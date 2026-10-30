import { useEffect, useRef } from "react";
import drawScrollRibbon from "../lib/scrollRibbon";

export default function AmbientBackground({ rtl = false }: { rtl?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;
    const glowCanvas = document.createElement("canvas");
    const glowContext = glowCanvas.getContext("2d", { alpha: true });
    const starSprite = document.createElement("canvas");
    starSprite.width = starSprite.height = 64;
    const starContext = starSprite.getContext("2d");
    if (starContext) {
      const halo = starContext.createRadialGradient(32, 32, 0, 32, 32, 32);
      halo.addColorStop(0, "rgba(220, 249, 255, 0.9)");
      halo.addColorStop(0.12, "rgba(117, 216, 255, 0.65)");
      halo.addColorStop(0.35, "rgba(45, 150, 255, 0.22)");
      halo.addColorStop(1, "rgba(22, 96, 255, 0)");
      starContext.fillStyle = halo;
      starContext.fillRect(0, 0, 64, 64);
    }
    const glowLayer = glowContext
      ? {
          canvas: glowCanvas,
          context: glowContext,
          scale: 0.4,
          starSprite: starContext ? starSprite : undefined,
        }
      : undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallScreen = window.matchMedia(
      "(max-width: 767px), (pointer: coarse)",
    );
    let frame = 0;
    let width = 0;
    let height = 0;
    let animationTime = 0;
    let lastTick = 0;
    let lastPaint = -Infinity;
    let lastInteraction = -Infinity;
    let dirty = true;
    let frozenScrollY = window.scrollY;
    const pointer = { x: 0.5, y: 0.5, strength: 0 };
    const targetPointer = { x: 0.5, y: 0.5, strength: 0 };

    const draw = (timestamp: number) => {
      frame = 0;
      if (document.hidden) return;
      const elapsed = lastTick
        ? Math.min(64, Math.max(0, timestamp - lastTick))
        : 16.7;
      lastTick = timestamp;
      if (!reducedMotion.matches) animationTime += elapsed / 1000;

      const smoothing = 1 - Math.exp(-elapsed / 130);
      pointer.x += (targetPointer.x - pointer.x) * smoothing;
      pointer.y += (targetPointer.y - pointer.y) * smoothing;
      pointer.strength +=
        (targetPointer.strength - pointer.strength) * smoothing;
      const settling =
        !smallScreen.matches &&
        Math.abs(targetPointer.x - pointer.x) +
          Math.abs(targetPointer.y - pointer.y) +
          Math.abs(targetPointer.strength - pointer.strength) >
          0.004;
      const active = timestamp - lastInteraction < 180 || settling;
      const interval = 1000 / (active ? 60 : smallScreen.matches ? 15 : 30);

      if (dirty || timestamp - lastPaint >= interval - 0.8) {
        drawScrollRibbon(
          context,
          {
            width,
            height,
            scrollY: reducedMotion.matches ? frozenScrollY : window.scrollY,
            compact: smallScreen.matches,
            rtl,
            time: animationTime,
            pointer:
              reducedMotion.matches || smallScreen.matches
                ? undefined
                : pointer,
          },
          glowLayer,
        );
        lastPaint = timestamp;
        dirty = false;
      }
      if (!reducedMotion.matches) scheduleDraw();
    };
    const scheduleDraw = (force = false) => {
      if (force) dirty = true;
      if (!frame && !document.hidden)
        frame = window.requestAnimationFrame(draw);
    };
    const resize = () => {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        smallScreen.matches ? 1 : 1.25,
      );
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (glowLayer) {
        glowLayer.scale = smallScreen.matches ? 0.35 : 0.4;
        glowCanvas.width = Math.round(width * glowLayer.scale);
        glowCanvas.height = Math.round(height * glowLayer.scale);
        glowLayer.context.setTransform(
          glowLayer.scale,
          0,
          0,
          glowLayer.scale,
          0,
          0,
        );
      }
      if (smallScreen.matches) targetPointer.strength = pointer.strength = 0;
      scheduleDraw(true);
    };
    const onScroll = () => {
      if (reducedMotion.matches) return;
      lastInteraction = performance.now();
      scheduleDraw(true);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (
        reducedMotion.matches ||
        smallScreen.matches ||
        event.pointerType === "touch"
      )
        return;
      targetPointer.x = Math.max(0, Math.min(1, event.clientX / width));
      targetPointer.y = Math.max(0, Math.min(1, event.clientY / height));
      targetPointer.strength = 1;
      lastInteraction = performance.now();
      scheduleDraw(true);
    };
    const onPointerLeave = () => {
      if (reducedMotion.matches || smallScreen.matches) return;
      targetPointer.x = targetPointer.y = 0.5;
      targetPointer.strength = 0;
      lastInteraction = performance.now();
      scheduleDraw(true);
    };
    const onMotionChange = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      lastTick = 0;
      frozenScrollY = window.scrollY;
      pointer.strength = targetPointer.strength = 0;
      scheduleDraw(true);
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        lastTick = 0;
      } else scheduleDraw(true);
    };

    resize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    reducedMotion.addEventListener("change", onMotionChange);
    smallScreen.addEventListener("change", resize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      reducedMotion.removeEventListener("change", onMotionChange);
      smallScreen.removeEventListener("change", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [rtl]);

  return (
    <div className="ambient-background" aria-hidden="true">
      <canvas ref={canvasRef} className="scroll-ribbon-canvas" />
    </div>
  );
}
