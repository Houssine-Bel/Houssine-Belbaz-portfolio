import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

    const handleMove = (event: MouseEvent) => {
      cursor.style.transform = `translate3d(${event.clientX - 5}px, ${event.clientY - 5}px, 0)`;
    };
    const handlePointerOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      cursor.dataset.active = String(Boolean(target.closest("a, button, input, textarea")));
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseover", handlePointerOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handlePointerOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed start-0 top-0 z-[100] hidden h-2.5 w-2.5 rounded-full bg-accent mix-blend-screen transition-[width,height,margin,opacity] duration-200 data-[active=true]:-ms-1.5 data-[active=true]:-mt-1.5 data-[active=true]:h-5 data-[active=true]:w-5 data-[active=true]:opacity-70 lg:block"
      aria-hidden="true"
    />
  );
}
