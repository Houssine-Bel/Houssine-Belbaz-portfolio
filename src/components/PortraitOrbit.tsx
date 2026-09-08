import { motion, useReducedMotion } from "framer-motion";

type PortraitOrbitProps = {
  layer: "back" | "front";
  active?: boolean;
};

export default function PortraitOrbit({ layer, active = true }: PortraitOrbitProps) {
  const shouldReduceMotion = useReducedMotion();
  const suffix = layer === "back" ? "back" : "front";

  return (
    <div
      className={`pointer-events-none absolute -inset-x-24 -inset-y-16 hidden sm:block ${layer === "back" ? "z-0" : "z-20"}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 700 820"
        className="h-full w-full overflow-visible"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`portrait-orbit-line-${suffix}`} x1="20" y1="700" x2="680" y2="260" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1677ff" stopOpacity="0" />
            <stop offset=".18" stopColor="#208cff" stopOpacity=".75" />
            <stop offset=".48" stopColor="#5ec7ff" />
            <stop offset=".78" stopColor="#238cff" stopOpacity=".85" />
            <stop offset="1" stopColor="#1677ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`portrait-orbit-flare-${suffix}`} x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#4fc3ff" stopOpacity="0" />
            <stop offset=".48" stopColor="#8fddff" />
            <stop offset="1" stopColor="#247dff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`portrait-orbit-dot-${suffix}`}>
            <stop stopColor="#e4f7ff" />
            <stop offset=".32" stopColor="#6acbff" />
            <stop offset="1" stopColor="#1677ff" />
          </radialGradient>
          <filter id={`portrait-orbit-glow-${suffix}`} x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {layer === "back" ? (
          <>
            <motion.path
              d="M 34 594 C -4 486, 39 366, 136 315 C 276 241, 512 284, 640 388 C 755 481, 687 584, 560 642 C 418 707, 165 732, 18 667"
              stroke="#167cff"
              strokeOpacity=".55"
              strokeWidth="1.15"
              strokeDasharray="5 13"
              animate={shouldReduceMotion || !active ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -180] }}
              transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="34"
              cy="594"
              r="3"
              fill="#58bdff"
              filter={`url(#portrait-orbit-glow-${suffix})`}
              animate={shouldReduceMotion || !active ? { opacity: .55, scale: 1 } : { opacity: [.25, 1, .25], scale: [.75, 1.5, .75] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        ) : (
          <>
            <motion.path
              d="M 18 667 C 165 732, 418 707, 560 642 C 687 584, 755 481, 640 388"
              stroke={`url(#portrait-orbit-line-${suffix})`}
              strokeWidth="1.6"
              strokeLinecap="round"
              filter={`url(#portrait-orbit-glow-${suffix})`}
              initial={{ pathLength: shouldReduceMotion ? 1 : 0, opacity: 0 }}
              animate={shouldReduceMotion || !active ? { pathLength: 1, opacity: .65 } : { pathLength: 1, opacity: [.55, 1, .55] }}
              transition={{
                pathLength: { duration: shouldReduceMotion ? 0.01 : 1.8, delay: .65, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              }}
            />
            <motion.path
              d="M -8 692 C 137 744, 367 732, 537 662 C 640 619, 708 557, 697 493"
              stroke={`url(#portrait-orbit-flare-${suffix})`}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="135 520"
              filter={`url(#portrait-orbit-glow-${suffix})`}
              animate={shouldReduceMotion || !active ? { strokeDashoffset: 0 } : { strokeDashoffset: [520, -145] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              r="4.5"
              fill={`url(#portrait-orbit-dot-${suffix})`}
              filter={`url(#portrait-orbit-glow-${suffix})`}
              animate={
                shouldReduceMotion || !active
                  ? { cx: 560, cy: 642 }
                  : {
                      cx: [18, 165, 418, 560, 687, 640],
                      cy: [667, 732, 707, 642, 584, 388],
                      opacity: [0, 1, 1, 1, .8, 0],
                      scale: [.7, 1, .85, 1.15, .8, .6],
                    }
              }
              transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
