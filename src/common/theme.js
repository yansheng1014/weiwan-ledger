// 维万记账 · 视觉令牌（Vela 无 CSS 变量，颜色/字号通过 style 对象注入）
export const COLORS = {
  bg: "#000000",
  surface: "#161618",
  press: "#222226",
  glass: "rgba(255,255,255,0.09)",
  glassStrong: "rgba(255,255,255,0.14)",
  glassLine: "rgba(255,255,255,0.12)",
  line: "#3A3A3A",
  lineSoft: "#2A2A2A",
  text: "#FFFFFF",
  secondary: "#B3B3B3",
  muted: "#A6A6A6",
  disabled: "#666666",
  accent: "#4C9AFF",
  accentPress: "#7FB8FF",
  accentDisabled: "#2E4A6B"
}

export const T = {
  page: { backgroundColor: COLORS.bg },
  text: { color: COLORS.text },
  secondary: { color: COLORS.secondary },
  muted: { color: COLORS.muted },
  disabled: { color: COLORS.disabled },
  accent: { color: COLORS.accent },
  accentBg: { backgroundColor: COLORS.accent },
  surface: { backgroundColor: COLORS.surface },
  press: { backgroundColor: COLORS.press },
  glass: {
    backgroundColor: COLORS.glass,
    borderColor: COLORS.glassLine,
    borderWidth: "1px",
    borderStyle: "solid"
  },
  glassStrong: {
    backgroundColor: COLORS.glassStrong,
    borderColor: COLORS.glassLine,
    borderWidth: "1px",
    borderStyle: "solid"
  },
  line: { backgroundColor: COLORS.line },
  lineSoft: { backgroundColor: COLORS.lineSoft }
}

export const ICONS = {
  catFoodW: "/common/icons/w/utensils.png",
  catFoodS: "/common/icons/s/utensils.png",
  catTransportW: "/common/icons/w/bus.png",
  catTransportS: "/common/icons/s/bus.png",
  catShoppingW: "/common/icons/w/shopping-bag.png",
  catShoppingS: "/common/icons/s/shopping-bag.png",
  catFunW: "/common/icons/w/gamepad-2.png",
  catFunS: "/common/icons/s/gamepad-2.png",
  catDailyW: "/common/icons/w/shopping-basket.png",
  catDailyS: "/common/icons/s/shopping-basket.png",
  catHealthW: "/common/icons/w/pill.png",
  catHealthS: "/common/icons/s/pill.png",
  catStudyW: "/common/icons/w/book-open.png",
  catStudyS: "/common/icons/s/book-open.png",
  catOtherW: "/common/icons/w/circle-ellipsis.png",
  catOtherS: "/common/icons/s/circle-ellipsis.png",
  catSalaryW: "/common/icons/w/wallet.png",
  catSalaryS: "/common/icons/s/wallet.png",
  catGiftW: "/common/icons/w/gift.png",
  catGiftS: "/common/icons/s/gift.png",
  plusAccent: "/common/icons/a/plus.png",
  back: "/common/icons/w/chevron-left.png",
  chevronLeft: "/common/icons/w/chevron-left.png",
  chevronRight: "/common/icons/s/chevron-right.png",
  list: "/common/icons/s/list.png",
  report: "/common/icons/s/bar-chart-3.png",
  settings: "/common/icons/s/settings.png",
  trash: "/common/icons/s/trash-2.png",
  check: "/common/icons/w/check.png",
  checkMuted: "/common/icons/s/check.png",
  close: "/common/icons/w/x.png",
  closeMuted: "/common/icons/s/x.png",
  undo: "/common/icons/w/rotate-ccw.png",
  undoMuted: "/common/icons/s/rotate-ccw.png",
  backspace: "/common/icons/s/delete.png",
  up: "/common/icons/s/arrow-up.png",
  down: "/common/icons/s/arrow-down.png",
  bookmark: "/common/icons/s/bookmark-plus.png",
  bookmarkActive: "/common/icons/a/bookmark-check.png",
  bookmarkDetail: "/common/icons/s/bookmark-check.png",
  upDisabled: "/common/icons/d/arrow-up.png",
  downDisabled: "/common/icons/d/arrow-down.png"
}

export const CAT_ICON = {
  "exp.food": { w: ICONS.catFoodW, s: ICONS.catFoodS },
  "exp.transport": { w: ICONS.catTransportW, s: ICONS.catTransportS },
  "exp.shopping": { w: ICONS.catShoppingW, s: ICONS.catShoppingS },
  "exp.fun": { w: ICONS.catFunW, s: ICONS.catFunS },
  "exp.daily": { w: ICONS.catDailyW, s: ICONS.catDailyS },
  "exp.health": { w: ICONS.catHealthW, s: ICONS.catHealthS },
  "exp.study": { w: ICONS.catStudyW, s: ICONS.catStudyS },
  "exp.other": { w: ICONS.catOtherW, s: ICONS.catOtherS },
  "inc.salary": { w: ICONS.catSalaryW, s: ICONS.catSalaryS },
  "inc.gift": { w: ICONS.catGiftW, s: ICONS.catGiftS },
  "inc.other": { w: ICONS.catOtherW, s: ICONS.catOtherS }
}
