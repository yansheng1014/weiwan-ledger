// 金额：一律整数分；显示规则单一入口（分位为 0 省略小数）
export function group3(n) {
  var s = String(n)
  var out = ""
  var count = 0
  for (var i = s.length - 1; i >= 0; i -= 1) {
    out = s.charAt(i) + out
    count += 1
    if (count % 3 === 0 && i > 0) out = "," + out
  }
  return out
}

export function formatAbs(cents) {
  var a = Math.round(Math.abs(cents || 0))
  var intPart = Math.floor(a / 100)
  var frac = a % 100
  return "¥" + group3(intPart) + (frac ? "." + (frac < 10 ? "0" : "") + frac : "")
}

// opts: { plus: true, signed: true, negative: true }
export function format(cents, opts) {
  opts = opts || {}
  var c = Math.round(cents || 0)
  var s = formatAbs(c)
  if (c < 0) return opts.negative === false ? s : "-" + s
  if (opts.plus && c > 0) return "+" + s
  if (opts.signed && c > 0) return "+" + s
  return s
}

export function signedMoney(cents, type) {
  var c = Math.abs(Math.round(cents || 0))
  var s = formatAbs(c)
  return (type === 2 ? "+" : "-") + s
}

// 键盘输入字符串（"23" / "23.5"）→ 分；非法返回 0
export function parseInputToCents(input) {
  if (!input) return 0
  var s = String(input)
  if (s === "." || s === "") return 0
  var parts = s.split(".")
  if (parts.length > 2) return 0
  var intPart = parts[0] === "" ? "0" : parts[0]
  if (!/^[0-9]+$/.test(intPart)) return 0
  var frac = parts.length === 2 ? parts[1] : ""
  if (frac.length > 2) return 0
  var cents = parseInt(intPart, 10) * 100
  if (frac.length === 1) cents += parseInt(frac, 10) * 10
  if (frac.length === 2) cents += parseInt(frac, 10)
  return cents
}

export function centsToInput(cents) {
  var a = Math.round(Math.abs(cents || 0))
  var intPart = Math.floor(a / 100)
  var frac = a % 100
  if (!frac) return String(intPart)
  return intPart + "." + (frac < 10 ? "0" : "") + frac
}

// 金额字号阶梯：按格式化后字符长度，避免 Vela 截断
export function amountType(cents) {
  var len = formatAbs(cents).length
  if (len <= 6) return { fontSize: "96px", lineHeight: "104px" }
  if (len === 7) return { fontSize: "72px", lineHeight: "80px" }
  return { fontSize: "48px", lineHeight: "56px" }
}
