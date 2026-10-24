// A/B 双槽 + seq + checksum + 写后回读；官方对原子性/容量无保证。
// 所有操作按 prefix 串行；每一步都有看门狗，任何回调缺失/抛错都不会卡死队列。
import storage from "@system.storage"

var cache = {}
var chains = {}
var READ_TIMEOUT = 2200
var WRITE_TIMEOUT = 3200

function fnv1a(s) {
  var h = 0x811c9dc5
  for (var i = 0; i < s.length; i += 1) {
    var c = s.charCodeAt(i)
    h = (h ^ (c & 0xff)) >>> 0
    h = (h * 0x01000193) >>> 0
    h = (h ^ ((c >>> 8) & 0xff)) >>> 0
    h = (h * 0x01000193) >>> 0
  }
  return ("0000000" + h.toString(16)).slice(-8)
}

function parseEnv(raw) {
  if (typeof raw !== "string" || raw.length < 24) return null
  var o
  try { o = JSON.parse(raw) } catch (e) { return null }
  if (!o || o.v !== 1) return null
  if (typeof o.s !== "number" || o.s < 0) return null
  if (typeof o.c !== "string" || typeof o.d !== "string") return null
  if (fnv1a(o.d) !== o.c) return null
  var d
  try { d = JSON.parse(o.d) } catch (e) { return null }
  return { s: o.s, d: d }
}

function readDoc(prefix, cb) {
  var got = { a: "", b: "" }
  var pending = 2
  function done() {
    if (pending > 0) return
    var best = null
    var valid = 0
    var slots = ["a", "b"]
    for (var i = 0; i < slots.length; i += 1) {
      var env = parseEnv(got[slots[i]])
      if (!env) continue
      valid += 1
      if (!best || env.s > best.s) best = { s: env.s, d: env.d, slot: slots[i] }
    }
    if (!best) { cb(null, null, false); return }
    cache[prefix] = { slot: best.slot, seq: best.s }
    cb(null, best.d, valid === 1 && !!(got.a || got.b))
  }
  function one(slot) {
    var settled = false
    function finish(v) {
      if (settled) return
      settled = true
      got[slot] = typeof v === "string" ? v : ""
      pending -= 1
      done()
    }
    storage.get({
      key: prefix + "." + slot,
      success: function (v) { finish(v) },
      fail: function () { finish("") },
      complete: function () {}
    })
  }
  one("a")
  one("b")
}

function writeDoc(prefix, data, cb) {
  var cur = cache[prefix] || { slot: null, seq: 0 }
  var seq = cur.seq + 1
  var slot = cur.slot === "a" ? "b" : "a"
  var payload = JSON.stringify(data)
  var env = JSON.stringify({ v: 1, s: seq, c: fnv1a(payload), d: payload })
  var attempts = 0
  function attempt() {
    attempts += 1
    var key = prefix + "." + slot
    var settle = false
    storage.set({
      key: key,
      value: env,
      success: function () {
        if (settle) return
        settle = true
        storage.get({
          key: key,
          success: function (back) {
            if (back === env) {
              cache[prefix] = { slot: slot, seq: seq }
              cb(null)
            } else {
              if (attempts < 2) attempt()
              else cb(new Error("readback-mismatch"))
            }
          },
          fail: function () {
            if (attempts < 2) attempt()
            else cb(new Error("readback-fail"))
          },
          complete: function () {}
        })
      },
      fail: function () {
        if (settle) return
        settle = true
        if (attempts < 2) attempt()
        else cb(new Error("set-fail"))
      },
      complete: function () {}
    })
  }
  attempt()
}

function run(prefix) {
  var chain = chains[prefix]
  if (!chain || !chain.length) { delete chains[prefix]; return }
  var job = chain[0]
  var started = false
  function nextOnce() {
    if (started) return
    started = true
    chain.shift()
    run(prefix)
  }
  job.fn(nextOnce)
}

function enqueue(prefix, fn) {
  if (!chains[prefix]) chains[prefix] = []
  chains[prefix].push({ fn: fn })
  if (chains[prefix].length === 1) run(prefix)
}

export function read(prefix, cb) {
  enqueue(prefix, function (next) {
    var finished = false
    var timer = setTimeout(function () {
      if (finished) return
      finished = true
      try { cb(new Error("read-timeout"), null, false) } finally { next() }
    }, READ_TIMEOUT)
    readDoc(prefix, function (err, d, recovered) {
      if (finished) return
      finished = true
      clearTimeout(timer)
      try { cb(err, d, recovered) } finally { next() }
    })
  })
}

export function write(prefix, data, cb) {
  cb = cb || function () {}
  enqueue(prefix, function (next) {
    var finished = false
    var timer = setTimeout(function () {
      if (finished) return
      finished = true
      try { cb(new Error("write-timeout")) } finally { next() }
    }, WRITE_TIMEOUT)
    writeDoc(prefix, data, function (err) {
      if (finished) return
      finished = true
      clearTimeout(timer)
      try { cb(err) } finally { next() }
    })
  })
}

export function clearAll(cb) {
  cache = {}
  chains = {}
  storage.clear({
    success: function () { cb(null) },
    fail: function () { cb(new Error("clear-fail")) },
    complete: function () {}
  })
}
