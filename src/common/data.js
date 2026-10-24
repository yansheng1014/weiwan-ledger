import { read, write, clearAll } from "./storage.js"
import { monthKey, currentMonth, elapsedDays, prevMonth } from "./date.js"
import { formatAbs } from "./money.js"

export const CATEGORIES = [
  { id: "exp.food", name: "餐饮", icon: "utensils", type: 1 },
  { id: "exp.transport", name: "交通", icon: "bus", type: 1 },
  { id: "exp.shopping", name: "购物", icon: "shopping-bag", type: 1 },
  { id: "exp.fun", name: "娱乐", icon: "gamepad-2", type: 1 },
  { id: "exp.daily", name: "日用", icon: "shopping-basket", type: 1 },
  { id: "exp.health", name: "医疗", icon: "pill", type: 1 },
  { id: "exp.study", name: "学习", icon: "book-open", type: 1 },
  { id: "exp.other", name: "其他", icon: "circle-ellipsis", type: 1 },
  { id: "inc.salary", name: "工资", icon: "wallet", type: 2 },
  { id: "inc.gift", name: "红包", icon: "gift", type: 2 },
  { id: "inc.other", name: "其他", icon: "circle-ellipsis", type: 2 }
]

export const DEFAULT_CFG = { v: 1, budgets: {}, manualOrder: null, months: [] }

export function catById(id) {
  for (var i = 0; i < CATEGORIES.length; i += 1) {
    if (CATEGORIES[i].id === id) return CATEGORIES[i]
  }
  return null
}

export function catsOfType(type) {
  var out = []
  for (var i = 0; i < CATEGORIES.length; i += 1) {
    if (CATEGORIES[i].type === type) out.push(CATEGORIES[i])
  }
  return out
}

export function monthPrefix(month) { return "bluebridge.ledger.m." + month }
export var CFG_PREFIX = "bluebridge.ledger.cfg"

// 进程内读缓存：频繁的页面往返不再反复读 storage；写入成功后同步更新。
var cfgCache = null
var monthCache = {}
var monthOrder = []

function rememberMonth(month, records) {
  if (!monthCache[month]) monthOrder.push(month)
  monthCache[month] = records
  while (monthOrder.length > 24) {
    var old = monthOrder.shift()
    delete monthCache[old]
  }
}

function forgetAll() {
  cfgCache = null
  monthCache = {}
  monthOrder = []
}

function normalizeCfg(raw) {
  var c = raw && typeof raw === "object" ? raw : {}
  return {
    v: 1,
    budgets: c.budgets && typeof c.budgets === "object" ? c.budgets : {},
    manualOrder: c.manualOrder && typeof c.manualOrder === "object" ? c.manualOrder : null,
    months: Array.isArray(c.months) ? c.months.slice(0) : []
  }
}

export function loadCfg(cb) {
  if (cfgCache) {
    var cachedCfg = cfgCache
    setTimeout(function () { cb(cachedCfg, null) }, 0)
    return
  }
  read(CFG_PREFIX, function (err, d) {
    var cfg = normalizeCfg(d)
    if (!err) cfgCache = cfg
    cb(cfg, err || null)
  })
}

export function saveCfg(cfg, cb) {
  var norm = normalizeCfg(cfg)
  write(CFG_PREFIX, norm, function (err) {
    if (!err) cfgCache = norm
    if (cb) cb(err)
  })
}

export function loadMonth(month, cb) {
  if (monthCache[month]) {
    var cachedRecords = monthCache[month]
    setTimeout(function () { cb(cachedRecords, null) }, 0)
    return
  }
  read(monthPrefix(month), function (err, d) {
    var records = Array.isArray(d) ? d : []
    if (!err) rememberMonth(month, records)
    cb(records, err || null)
  })
}

export function saveMonth(month, records, cb) {
  write(monthPrefix(month), records, function (err) {
    if (!err) rememberMonth(month, records)
    if (cb) cb(err)
  })
}

function ensureMonthIndex(month, cb) {
  loadCfg(function (cfg) {
    if (cfg.months.indexOf(month) >= 0) { cb(cfg); return }
    cfg.months.push(month)
    cfg.months.sort(function (a, b) { return a < b ? 1 : -1 })
    if (cfg.months.length > 24) cfg.months = cfg.months.slice(0, 24)
    saveCfg(cfg, function () { cb(cfg) })
  })
}

export function addRecord(month, record, cb) {
  loadMonth(month, function (records) {
    var list = records.slice(0)
    list.push(record)
    list.sort(function (a, b) { return b.t - a.t })
    saveMonth(month, list, function (err) {
      if (err) { cb(err); return }
      ensureMonthIndex(month, function () { cb(null) })
    })
  })
}

export function deleteRecord(month, id, cb) {
  loadMonth(month, function (records) {
    var next = []
    for (var i = 0; i < records.length; i += 1) {
      if (records[i].i !== id) next.push(records[i])
    }
    saveMonth(month, next, function (err) { cb(err, next) })
  })
}

export function undoLast(month, cb) {
  loadMonth(month, function (records) {
    if (!records.length) { cb(null, null); return }
    var target = records[0]
    var next = records.slice(1)
    saveMonth(month, next, function (err) { cb(err, target) })
  })
}

export function summarize(records, month) {
  var expense = 0
  var income = 0
  var byCat = {}
  for (var i = 0; i < records.length; i += 1) {
    var r = records[i]
    if (r.ty === 2) income += r.a
    else expense += r.a
    if (r.ty === 2) continue
    var key = r.c
    if (!byCat[key]) byCat[key] = 0
    byCat[key] += r.a
  }
  var days = elapsedDays(month)
  var dailyAvg = days > 0 ? Math.round(expense / days) : 0
  var cats = []
  for (var id in byCat) {
    var cat = catById(id)
    cats.push({ id: id, name: cat ? cat.name : "其他", amount: byCat[id] })
  }
  cats.sort(function (a, b) { return b.amount - a.amount })
  return {
    expense: expense,
    income: income,
    balance: income - expense,
    netSpend: expense - income,
    count: records.length,
    dailyAvg: dailyAvg,
    cats: cats
  }
}

export function ranking(summary) {
  var cats = summary.cats
  var rows = []
  var other = 0
  for (var i = 0; i < cats.length; i += 1) {
    if (i < 3) rows.push(cats[i])
    else other += cats[i].amount
  }
  if (other > 0) rows.push({ id: "other", name: "其他", amount: other })
  var total = summary.expense || 0
  for (var j = 0; j < rows.length; j += 1) {
    rows[j].percent = total > 0 ? Math.round(rows[j].amount * 100 / total) : 0
  }
  return rows
}

// 近 30 天分类使用次数（本月 + 上月分片按 ts 过滤）
export function frequency(month, cb) {
  var min = Date.now() - 30 * 24 * 3600 * 1000
  var counts = {}
  var pending = 2
  function add(records) {
    for (var i = 0; i < records.length; i += 1) {
      var r = records[i]
      if (r.t < min) continue
      counts[r.c] = (counts[r.c] || 0) + 1
    }
    pending -= 1
    if (pending === 0) cb(counts)
  }
  loadMonth(month, function (a) { add(a) })
  loadMonth(prevMonth(month), function (b) { add(b) })
}

export function orderedCats(type, cfg, counts) {
  var list = catsOfType(type)
  var orderKey = type === 2 ? "inc" : "exp"
  var manual = cfg && cfg.manualOrder && cfg.manualOrder[orderKey]
  if (manual && manual.length) {
    var map = {}
    for (var i = 0; i < list.length; i += 1) map[list[i].id] = list[i]
    var out = []
    for (var j = 0; j < manual.length; j += 1) {
      if (map[manual[j]]) { out.push(map[manual[j]]); delete map[manual[j]] }
    }
    for (var k = 0; k < list.length; k += 1) {
      if (map[list[k].id]) out.push(list[k])
    }
    return out
  }
  counts = counts || {}
  return list.slice(0).sort(function (a, b) {
    var ca = counts[a.id] || 0
    var cb = counts[b.id] || 0
    if (ca !== cb) return cb - ca
    return 0
  })
}

export function budgetOf(cfg, month) {
  var v = cfg && cfg.budgets ? cfg.budgets[month] : 0
  return typeof v === "number" ? v : 0
}

export function setBudget(month, cents, cb) {
  loadCfg(function (cfg) {
    if (cents > 0) cfg.budgets[month] = cents
    else delete cfg.budgets[month]
    saveCfg(cfg, function () { cb() })
  })
}

export function clearAllData(cb) {
  forgetAll()
  clearAll(function (err) {
    if (!err) forgetAll()
    cb(err)
  })
}

export function newRecord(type, categoryId, cents) {
  var ts = Date.now()
  return {
    i: ts + "-" + Math.floor(Math.random() * 900 + 100),
    t: ts,
    ty: type,
    c: categoryId,
    a: cents
  }
}

export function recordText(r) {
  var cat = catById(r.c)
  return cat ? cat.name : "其他"
}

export function monthLabelSafe(month) { return month || currentMonth() }
