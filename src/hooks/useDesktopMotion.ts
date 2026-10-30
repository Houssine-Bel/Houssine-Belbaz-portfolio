import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const desktopQuery = "(min-width: 1024px) and (pointer: fine)";

export default function useDesktopMotion() {
  const [desktop, setDesktop] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const media = window.matchMedia(desktopQuery);
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return desktop && !reducedMotion;
}
