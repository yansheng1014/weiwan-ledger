# 图标资源说明

本目录是「维万记账」的全部界面图标资源。所有线性图标均为真实 Lucide SVG 转 PNG，不手绘、不近似替代。

## 来源与许可证

| 项 | 值 |
|---|---|
| 图标库 | Lucide（https://lucide.dev/） |
| npm 包 | lucide-static |
| 版本 | 0.545.0（见 icons.json.lucideVersion） |
| 许可证 | ISC License（见 LUCIDE-LICENSE.txt） |
| 生成工具 | scripts/gen-icons.cjs + sharp |
| 输出格式 | PNG，透明背景，2× 资源（24px 图标输出 48px；32px 图标输出 64px） |

## 生成方式

    npm run icons

脚本读取 node_modules/lucide-static/icons/<name>.svg，将 currentColor 替换为对应色值，再用 sharp 按 2× 尺寸导出：

| 目录 | 色值 | 用途 |
|---|---|---|
| w/ | #FFFFFF | 白色前景（主文字/选中） |
| s/ | #B3B3B3 | 次级灰（辅助文字/未选中） |
| a/ | #4C9AFF | 主题蓝（强调/高亮） |
| d/ | #666666 | 禁用灰 |

## 图标清单

分类 / 功能图标：

- 支出：utensils（餐饮）、bus（交通）、shopping-bag（购物）、gamepad-2（娱乐）、shopping-basket（日用）、pill（医疗）、book-open（学习）、circle-ellipsis（其他）
- 收入：wallet（工资）、gift（红包）、circle-ellipsis（其他）
- 导航与操作：plus、chevron-left、chevron-right、list、bar-chart-3、settings、trash-2、check、x、rotate-ccw、delete、arrow-up、arrow-down、bookmark-plus、bookmark-check

书签高亮使用 a/bookmark-check.png，普通入口使用 s/bookmark-plus.png。

## 应用图标

src/common/app-icon.png 为 192×192、8-bit、不透明 PNG，路径在 src/manifest.json 中声明为 /common/app-icon.png。
图稿为项目自有的「维万 / 记账」双色设计，未使用第三方品牌标识；满版渲染，由手环桌面的圆形/圆角掩膜裁切，关键文字保持在中心安全区。
