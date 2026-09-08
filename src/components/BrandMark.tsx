type BrandMarkProps = {
  className?: string;
};

export default function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <span
      className={`relative block h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-accent/30 bg-[#030714] shadow-[0_0_20px_rgba(94,184,255,.08)] ${className}`}
      aria-hidden="true"
    >
      <img
        src="./logo-mark.svg"
        alt=""
        width="64"
        height="64"
        className="h-full w-full"
      />
    </span>
  );
}
