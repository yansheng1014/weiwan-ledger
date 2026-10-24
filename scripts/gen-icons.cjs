// 真实 Lucide SVG -> 2x PNG，按视觉档 24/32 输出 48/64；w/s/a/d 四色套。
const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

const ROOT = path.resolve(__dirname, "..")
const SRC = path.join(ROOT, "node_modules", "lucide-static", "icons")
const OUT = path.join(ROOT, "src", "common", "icons")
const COLORS = { w: "#FFFFFF", s: "#B3B3B3", a: "#4C9AFF", d: "#666666" }

// name -> display size (px)
const ICONS = {
  utensils: 24, bus: 24, "shopping-bag": 24, "gamepad-2": 24,
  "shopping-basket": 24, pill: 24, "book-open": 24, "circle-ellipsis": 24,
  wallet: 24, gift: 24,
  plus: 32, "chevron-left": 32, "chevron-right": 32, list: 32,
  "bar-chart-3": 32, settings: 32, "trash-2": 32, check: 32, x: 32,
  "rotate-ccw": 32, delete: 32, "arrow-up": 32, "arrow-down": 32,
  "bookmark-plus": 32, "bookmark-check": 32
}
const VARIANTS = {
  utensils: ["w", "s"], bus: ["w", "s"], "shopping-bag": ["w", "s"],
  "gamepad-2": ["w", "s"], "shopping-basket": ["w", "s"], pill: ["w", "s"],
  "book-open": ["w", "s"], "circle-ellipsis": ["w", "s"], wallet: ["w", "s"], gift: ["w", "s"],
  plus: ["a"], "chevron-left": ["w", "s"], "chevron-right": ["w", "s"],
  list: ["s"], "bar-chart-3": ["s"], settings: ["s"], "trash-2": ["s"],
  check: ["w", "s"], x: ["w", "s"], "rotate-ccw": ["w", "s"], delete: ["s"],
  "arrow-up": ["s", "d"], "arrow-down": ["s", "d"],
  "bookmark-plus": ["s", "a"], "bookmark-check": ["s", "a"]
}

async function main() {
  const manifest = { lucideVersion: require("lucide-static/package.json").version, icons: {} }
  for (const name of Object.keys(ICONS)) {
    const svgPath = path.join(SRC, name + ".svg")
    let svg = fs.readFileSync(svgPath, "utf8")
    const size = ICONS[name] * 2
    manifest.icons[name] = { lucide: name, size: size, files: [] }
    for (const v of VARIANTS[name]) {
      const dir = path.join(OUT, v)
      fs.mkdirSync(dir, { recursive: true })
      const colored = svg.replace(/currentColor/g, COLORS[v])
      const png = await sharp(Buffer.from(colored)).resize(size, size).png().toBuffer()
      const file = path.join(dir, name + ".png")
      fs.writeFileSync(file, png)
      manifest.icons[name].files.push(v + "/" + name + ".png")
    }
  }
  fs.writeFileSync(path.join(OUT, "icons.json"), JSON.stringify(manifest, null, 2))
  console.log("[icons] generated", Object.keys(manifest.icons).length, "lucide icons")
}
main().catch(function (e) { console.error(e); process.exit(1) })
