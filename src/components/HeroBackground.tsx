import { motion, useReducedMotion } from "framer-motion";

const particles = [
  { left: "4%", top: "24%", size: 4, duration: 7, delay: -2 },
  { left: "13%", top: "12%", size: 3, duration: 9, delay: -5 },
  { left: "32%", top: "18%", size: 2, duration: 8, delay: -1 },
  { left: "46%", top: "12%", size: 3, duration: 10, delay: -7 },
  { left: "56%", top: "20%", size: 3, duration: 7, delay: -4 },
  { left: "78%", top: "13%", size: 2, duration: 8, delay: -6 },
  { left: "91%", top: "8%", size: 7, duration: 9, delay: -3 },
  { left: "96%", top: "37%", size: 4, duration: 8, delay: -5 },
  { left: "51%", top: "61%", size: 5, duration: 10, delay: -2 },
  { left: "98%", top: "64%", size: 6, duration: 7, delay: -1 },
];

type HeroBackgroundProps = {
  active?: boolean;
};

export default function HeroBackground({ active = true }: HeroBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute end-[8%] top-[7%] h-[32rem] w-[32rem] rounded-full bg-blue-600/[0.08] blur-[110px]" />
      <div className="absolute start-[28%] top-[22%] h-72 w-72 rounded-full bg-cyan-400/[0.035] blur-[90px]" />

      {particles.map((particle, index) => (
        <motion.span
          key={`${particle.left}-${particle.top}`}
          className={`absolute rounded-full ${index % 3 === 0 ? "bg-cyan-300" : "bg-blue-500"}`}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            boxShadow: `0 0 ${particle.size * 4}px rgba(54, 156, 255, .9)`,
          }}
          animate={
            shouldReduceMotion || !active
              ? { opacity: 0.55 }
              : { y: [0, -12, 3, 0], opacity: [0.25, 1, 0.4, 0.25], scale: [0.8, 1.25, 0.9, 0.8] }
          }
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <svg
        className="absolute inset-x-0 bottom-0 h-[36%] min-h-72 w-full opacity-75"
        viewBox="0 0 1600 450"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mesh-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2d9cff" stopOpacity="0" />
            <stop offset=".45" stopColor="#2d9cff" stopOpacity=".32" />
            <stop offset="1" stopColor="#2d9cff" stopOpacity=".08" />
          </linearGradient>
          <linearGradient id="ribbon-blue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#207cff" stopOpacity="0" />
            <stop offset=".35" stopColor="#5eb8ff" stopOpacity=".9" />
            <stop offset=".72" stopColor="#237bff" stopOpacity=".55" />
            <stop offset="1" stopColor="#207cff" stopOpacity="0" />
          </linearGradient>
          <filter id="ribbon-glow" x="-30%" y="-80%" width="160%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <mask id="mesh-mask">
            <rect width="1600" height="450" fill="url(#mesh-fade)" />
          </mask>
        </defs>

        <g mask="url(#mesh-mask)" fill="none" stroke="#258bff" strokeOpacity=".28" strokeWidth="1">
          {Array.from({ length: 12 }).map((_, index) => {
            const y = 170 + index * 24;
            return <path key={`horizontal-${y}`} d={`M-80 ${y} C260 ${y - 100} 480 ${y + 70} 790 ${y - 4} C1110 ${y - 92} 1320 ${y + 82} 1680 ${y - 28}`} />;
          })}
          {Array.from({ length: 24 }).map((_, index) => {
            const x = -30 + index * 72;
            return <path key={`vertical-${x}`} d={`M${x} 470 C${x - 95} 340 ${x + 75} 265 ${x + 5} 145`} />;
          })}
        </g>

        <motion.path
          d="M-80 365 C210 135 455 515 770 285 C1065 66 1275 445 1690 185"
          fill="none"
          stroke="url(#ribbon-blue)"
          strokeWidth="3"
          strokeDasharray="22 18"
          filter="url(#ribbon-glow)"
          animate={shouldReduceMotion || !active ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -160] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M-70 402 C260 205 430 475 760 330 C1090 185 1325 395 1680 245"
          fill="none"
          stroke="#196dff"
          strokeOpacity=".55"
          strokeWidth="1.3"
          strokeDasharray="10 16"
          animate={shouldReduceMotion || !active ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, 130] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}
