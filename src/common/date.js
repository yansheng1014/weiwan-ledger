export function pad2(n) {
  return n < 10 ? "0" + n : String(n)
}

export function monthKey(ts) {
  var d = new Date(ts === undefined ? Date.now() : ts)
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1)
}

export function currentMonth() {
  return monthKey(Date.now())
}

export function monthTitle(key) {
  var parts = String(key || "").split("-")
  var m = parseInt(parts[1] || "1", 10)
  return m + "月"
}

export function monthTitleLong(key) {
  var parts = String(key || "").split("-")
  return parts[0] + "年" + parseInt(parts[1] || "1", 10) + "月"
}

export function parseMonth(key) {
  var parts = String(key || "").split("-")
  return { year: parseInt(parts[0] || "2026", 10), month: parseInt(parts[1] || "1", 10) }
}

export function prevMonth(key) {
  var p = parseMonth(key)
  var y = p.year
  var m = p.month - 1
  if (m === 0) { m = 12; y -= 1 }
  return y + "-" + pad2(m)
}

export function nextMonth(key) {
  var p = parseMonth(key)
  var y = p.year
  var m = p.month + 1
  if (m === 13) { m = 1; y += 1 }
  return y + "-" + pad2(m)
}

export function daysInMonth(key) {
  var p = parseMonth(key)
  return new Date(p.year, p.month, 0).getDate()
}

// 日均分母：当月按今天号数，历史月按整月天数
export function elapsedDays(key) {
  var nowKey = currentMonth()
  if (key === nowKey) return new Date().getDate()
  if (key > nowKey) return 1
  return daysInMonth(key)
}

export function dayKey(ts) {
  var d = new Date(ts)
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate())
}

var WEEK = ["日", "一", "二", "三", "四", "五", "六"]
export function dayLabel(ts) {
  var d = new Date(ts)
  var now = new Date()
  var dk = dayKey(ts)
  if (dk === dayKey(now.getTime())) return "今天"
  var yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime()
  if (dk === dayKey(yest)) return "昨天"
  return (d.getMonth() + 1) + "月" + d.getDate() + "日 周" + WEEK[d.getDay()]
}

export function timeLabel(ts) {
  var d = new Date(ts)
  return pad2(d.getHours()) + ":" + pad2(d.getMinutes())
}

export function startOfMonth(key) {
  var p = parseMonth(key)
  return new Date(p.year, p.month - 1, 1).getTime()
}

export function endOfMonth(key) {
  var p = parseMonth(key)
  return new Date(p.year, p.month, 1).getTime()
}

export function compareMonth(a, b) {
  return a === b ? 0 : (a > b ? 1 : -1)
}

// 允许回看的历史月份下限（含当月共 24 个月），与是否有数据无关
export function monthsAgo(n) {
  var d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() - n)
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1)
}
