#!/usr/bin/env bash
# Build the Vela RPK from an ASCII temporary directory.
# aiot-toolkit 2.0.5 creates /root/开发/.temp_* next to the project and
# can fail with EACCES when the project path contains non-ASCII chars.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d /tmp/weiwan-build.XXXXXX)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

if [ ! -d "$ROOT/node_modules/aiot-toolkit" ]; then
  echo "缺少 node_modules/aiot-toolkit；请先执行 npm install" >&2
  exit 1
fi

cp -a "$ROOT/src" "$ROOT/package.json" "$ROOT/quickapp.config.js" "$ROOT/scripts" "$TMP/"
ln -s "$ROOT/node_modules" "$TMP/node_modules"
mkdir -p "$ROOT/dist"

(
  cd "$TMP"
  node scripts/build.cjs
)

cp "$TMP"/dist/*.rpk "$ROOT/dist/"
ls -lh "$ROOT/dist"/*.rpk
