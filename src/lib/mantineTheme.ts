import { MantineThemeOverride } from "@mantine/core";
import fonts from "./fonts";

const theme: MantineThemeOverride = {
  fontFamily: fonts.body.style.fontFamily,
  headings: { fontFamily: fonts.body.style.fontFamily },
  breakpoints: {
    xs: 480, //480px
    sm: 640, //640px
    md: 768, //768px
    lg: 1024, //1024px
    xl: 1280, // 1280px
  },
  globalStyles: (_) => ({
    html: {
      fontFamily: fonts.body.style.fontFamily,
    },
    body: {
      WebkitFontSmoothing: "auto",
      margin: 0,
      lineHeight: "inherit",
      overscrollBehavior: "none",
    },
    a: {
      color: "inherit",
      textDecoration: "inherit",
    },
  }),
};

export default theme;
