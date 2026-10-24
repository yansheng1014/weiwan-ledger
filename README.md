# 维万记账（WeiWan Ledger）

小米手环 Vela 5.0 JS 快应用 · 纯本地记账 · 蓝色主题 · 336×480（自动适配 338 宽）

- 应用名：维万记账
- 包名：com.bluebridge.ledger
- designWidth：336
- 网络权限：无（不声明 network，全部数据留在本机）

## 功能

- 3 秒记账：记一笔 → 分类 → 金额 → 存；大额（≥ ¥500）二次确认；保存后可撤销。
- 高频分类：8 个支出 + 3 个收入；记账页横滑分类条，按近 30 天使用频率排序，分类管理可手动调整并持久化。
- 首页：本月支出大数字 + 预算剩余（收入可抵扣支出）；明细 / 月结 / 设置入口；撤销条与存储异常提示。
- 明细：按日期倒序、分类聚合；单条删除（行内 ✓ / ✕）；月份可回看 24 个月，无数据月份显示空态。
- 月结：总支出、收入、结余、分类占比（带 %）、日均、笔数；数字按长度自适应字号，不截断。
- 书签：记账页可给本笔记录加书签备注；保存后图标高亮；明细点记录进入同一书签页查看/编辑，无书签显示「暂无书签」。输入使用 Vela 官方 input 组件，由系统输入法接管。
- 设置：月预算、分类管理、数据清除（红色危险操作，二次确认）。
- 存储：金额一律整数分；按月分片 + A/B 双槽 + 单调 seq + FNV-1a 校验 + 写后回读；读/写队列带看门狗，异常不阻塞导航。

## 页面路由

manifest.router.entry = pages/home

    src/pages/
    ├── home/        pages/home        首页（本月支出 / 预算 / 导航 / 撤销）
    ├── record/      pages/record      记账（分类条 + 数字键盘 + 书签 + 存）
    ├── detail/      pages/detail      明细（月份选择 + 倒序记录 + 删除）
    ├── report/      pages/report      月结（汇总 + 分类占比 + 日均）
    ├── settings/    pages/settings    设置（预算 / 分类 / 数据清除）
    ├── categories/  pages/categories  分类管理（频率默认 + 手动上下移）
    ├── budget/      pages/budget      月预算（数字键盘）
    └── bookmark/    pages/bookmark    书签（系统输入法 + 输出 + ✓ 完成）

所有页面均在 src/manifest.json 的 router.pages 中注册；每个页面是独立目录 + 同名 .ux 文件。
导航使用 @system.router 的 push/back：Record → Detail → back 回到 Record。

## 目录结构

    .
    ├── src/
    │   ├── manifest.json          # 页面路由、features、icon、designWidth
    │   ├── app.ux                 # 应用入口 / 全局数据（撤销、书签草稿）
    │   ├── common/
    │   │   ├── theme.js           # 颜色、字号、图标路径
    │   │   ├── base.css           # 页面/顶栏/命中区基础样式
    │   │   ├── money.js           # 金额整数分、格式化、输入解析
    │   │   ├── date.js            # 月份/日期/日均
    │   │   ├── storage.js         # A/B 双槽存储 + 校验 + 看门狗
    │   │   ├── data.js            # 分类、记录、汇总、预算、频率
    │   │   └── icons/             # Lucide 2× PNG（w/s/a/d）+ ICONS.md
    │   └── pages/                 # 8 个页面目录
    ├── scripts/
    │   ├── build-rpk.sh           # 从 ASCII 临时目录构建（规避中文路径）
    │   ├── build.cjs              # 调 aiot-toolkit build
    │   └── gen-icons.cjs          # Lucide SVG → 2× PNG
    ├── dist/                      # 可安装 rpk（构建产物）
    ├── package.json
    ├── quickapp.config.js
    └── README.md

## 构建

要求：Node.js ≥ 20；构建依赖 aiot-toolkit、sharp、lucide-static。

    npm install
    npm run build
    # 输出：dist/com.bluebridge.ledger.debug.1.0.0.rpk

说明：
- 构建脚本会复制 src 到 /tmp 下的 ASCII 临时目录再构建，避免 aiot-toolkit 在中文路径下生成临时目录失败。
- 重新生成图标：npm run icons（真实 Lucide SVG → 2× PNG，见 src/common/icons/ICONS.md）。
- 已开启 JSC 字节码编译（quickapp.config.js），加快启动；需要安装 @aiot-toolkit/jsc。

## 真机 / 模拟器安装

推荐使用 AIoT-IDE 连接手环或官方 VVD 后直接安装运行。

命令行安装（Vela watch）：

    adb push dist/com.bluebridge.ledger.debug.1.0.0.rpk /data/local/tmp/ledger.rpk
    adb shell pm install /data/local/tmp/ledger.rpk
    adb shell am start com.bluebridge.ledger

- 官方模拟器：VVD vela-watch-5.0，336×480；安装 rpk 后启动应用即可。
- 手环 9 Pro：系统需支持 Vela JS 快应用；安装后从桌面启动。应用图标为 192×192 不透明 PNG（/common/app-icon.png），按系统桌面掩膜裁切显示。

## Release

- GitHub Release v1.0.0：https://github.com/yansheng1014/weiwan-ledger/releases/tag/v1.0.0
- 仓库内可安装包：dist/com.bluebridge.ledger.debug.1.0.0.rpk

## 图标与来源

- 线性图标：Lucide lucide-static@0.545.0，ISC License；生成脚本、尺寸、色套与清单见 src/common/icons/ICONS.md，许可证见 src/common/icons/LUCIDE-LICENSE.txt。
- 应用图标：由项目提供的 192×192 双色「维万 / 记账」图稿转换，保持不透明满版，供手环桌面掩膜使用。

## 数据与隐私

- 不声明网络 feature，无任何网络请求。
- 记录、预算、分类顺序、书签均仅保存在本机 storage。
- 金额以整数分存储与计算，避免浮点误差；显示时按规则省略 .00。

## 已知说明

- 官方 VVD 弹出的系统键盘是模拟器自带调试键盘，并非手环 9 Pro 零售版输入法皮肤；快应用只能通过官方 input 组件调用系统输入法，真机自动使用真机 IME。
- 无 CSS 变量 / 伪类 / 后代选择器 / overflow 依赖；所有图片为 PNG，符合 Vela 限制。
