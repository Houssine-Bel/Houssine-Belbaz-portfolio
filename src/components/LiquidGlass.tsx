import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionStyle,
} from "framer-motion";
import {
  useEffect,
  useRef,
  type PointerEvent,
  type PropsWithChildren,
} from "react";
import useDesktopMotion from "../hooks/useDesktopMotion";

type LiquidGlassProps = PropsWithChildren<{
  className?: string;
  tilt?: boolean;
  delay?: number;
  reveal?: boolean;
  style?: MotionStyle;
}>;

export default function LiquidGlass({
  children,
  className = "",
  tilt = true,
  delay = 0,
  reveal = true,
  style,
}: LiquidGlassProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef(0);
  const lastPointer = useRef({ x: 0.5, y: 0.35 });
  const desktopMotion = useDesktopMotion();
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 160, damping: 24, mass: 0.6 });
  const rotateY = useSpring(y, { stiffness: 160, damping: 24, mass: 0.6 });

  useEffect(() => () => window.cancelAnimationFrame(pointerFrame.current), []);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!desktopMotion || event.pointerType === "touch") return;
    const surface = event.currentTarget;
    if (!surface.contains(event.target as Node)) return;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    if (!pointerFrame.current) {
      pointerFrame.current = window.requestAnimationFrame(() => {
        pointerFrame.current = 0;
        const rect = surface.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const px = Math.max(
          0,
          Math.min(1, (lastPointer.current.x - rect.left) / rect.width),
        );
        const py = Math.max(
          0,
          Math.min(1, (lastPointer.current.y - rect.top) / rect.height),
        );
        if (tilt) {
          x.set((0.5 - py) * 5);
          y.set((px - 0.5) * 6);
        }
        surface.style.setProperty("--glass-x", `${px * 100}%`);
        surface.style.setProperty("--glass-y", `${py * 100}%`);
        surface.dataset.pointer = "true";
      });
    }
  };
  const onPointerLeave = () => {
    window.cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = 0;
    x.set(0);
    y.set(0);
    if (surfaceRef.current) surfaceRef.current.dataset.pointer = "false";
  };

  return (
    <motion.div
      ref={surfaceRef}
      className={`liquid-glass ${className}`}
      data-liquid-motion={desktopMotion && tilt ? "true" : "false"}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      initial={
        reveal
          ? {
              opacity: 0,
              y: reducedMotion ? 0 : 28,
              scale: reducedMotion ? 1 : 0.985,
            }
          : false
      }
      whileInView={reveal ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: true, amount: 0.12, margin: "45px 0px" }}
      whileHover={desktopMotion && tilt ? { y: -5 } : undefined}
      transition={{
        duration: reducedMotion ? 0.15 : 0.7,
        delay: reducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        transformPerspective: desktopMotion && tilt ? 1100 : undefined,
        rotateX: desktopMotion && tilt ? rotateX : 0,
        rotateY: desktopMotion && tilt ? rotateY : 0,
        ...style,
      }}
    >
      <div className="liquid-glass-content">{children}</div>
    </motion.div>
  );
}
