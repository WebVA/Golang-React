import { useMediaQuery } from "react-responsive";

export default function useScreenSize() {
  let screen;
  if (useMediaQuery({ minWidth: "800px" })) screen = "desktop";
  if (useMediaQuery({ maxWidth: "799px" })) screen = "phone";

  return screen;
}
