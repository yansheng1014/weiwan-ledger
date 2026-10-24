const fs = require("fs")
const path = require("path")
const { spawnSync } = require("child_process")

const root = path.resolve(__dirname, "..")
const cliPath = path.join(root, "node_modules", "aiot-toolkit", "lib", "bin.js")
const distDir = path.join(root, "dist")

if (!fs.existsSync(cliPath)) {
  console.error("[build] aiot-toolkit 未安装")
  process.exit(1)
}

if (fs.existsSync(distDir)) {
  fs.readdirSync(distDir).forEach(function (name) {
    if (name.endsWith(".rpk")) fs.unlinkSync(path.join(distDir, name))
  })
}

const result = spawnSync(process.execPath, [cliPath, "build"], {
  cwd: root,
  stdio: "inherit"
})

if (result.error) {
  console.error(result.error)
  process.exit(1)
}
if (result.status !== 0) process.exit(result.status || 1)

const rpks = fs.existsSync(distDir)
  ? fs.readdirSync(distDir).filter(function (name) {
    return name.endsWith(".rpk")
  }).map(function (name) {
    const filePath = path.join(distDir, name)
    return { path: filePath, size: fs.statSync(filePath).size, time: fs.statSync(filePath).mtimeMs }
  }).sort(function (a, b) {
    return b.time - a.time
  })
  : []

if (!rpks.length) {
  console.error("[build] 未生成 RPK")
  process.exit(1)
}

const latest = rpks[0]
console.log("")
console.log("[build] RPK: " + path.relative(root, latest.path))
console.log("[build] 大小: " + (latest.size / 1024).toFixed(1) + " KB")
