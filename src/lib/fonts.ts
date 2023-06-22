import { DM_Sans } from "next/font/google";

const body = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const fonts = { body };

export default fonts;
