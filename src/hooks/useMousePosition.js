import { useEffect, useRef } from "react";

export function useMousePosition(sensitivity = 1) {
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      target.current.x = ((e.clientX / window.innerWidth) * 2 - 1) * sensitivity;
      target.current.y = (-(e.clientY / window.innerHeight) * 2 + 1) * sensitivity;
    };

    let frame;
    const tick = () => {
      mouse.current.x += (target.current.x - mouse.current.x) * 0.06;
      mouse.current.y += (target.current.y - mouse.current.y) * 0.06;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, [sensitivity]);

  return mouse;
}
