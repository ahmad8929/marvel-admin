import type { ThemeConfig } from "antd";

/** Marvel's Online Clothings — brand palette applied to Ant Design. */
export const brand = {
  bg: "#FCF4EF",
  surface: "#FFFFFF",
  blush: "#F3DDD7",
  blushDeep: "#E7C3BC",
  primary: "#6D1533",
  primaryHover: "#57102A",
  gold: "#B98A3C",
  ink: "#2B1A22",
  muted: "#8A7178",
  line: "#EADFD9",
  sale: "#B3261E",
} as const;

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: brand.primary,
    colorLink: brand.primary,
    colorInfo: brand.primary,
    colorSuccess: "#2F7A4E",
    colorError: brand.sale,
    colorBgLayout: brand.bg,
    colorBorderSecondary: brand.line,
    borderRadius: 10,
    fontFamily:
      "'Jost', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Layout: {
      headerBg: brand.surface,
      siderBg: brand.primary,
      bodyBg: brand.bg,
    },
    Menu: {
      darkItemBg: brand.primary,
      darkSubMenuItemBg: brand.primaryHover,
      darkItemSelectedBg: brand.primaryHover,
    },
    Button: {
      primaryShadow: "none",
    },
  },
};
