import { Montserrat } from "next/font/google";

const body = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const fonts = { body };

export default fonts;
