import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [dotPos, setDotPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer")
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }

      if (target.tagName.toLowerCase() === "input" || target.tagName.toLowerCase() === "textarea") {
        setHidden(true);
      } else {
        setHidden(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrame;
    const updateDot = () => {
      setDotPos(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.25, // higher = faster catchup
        y: prev.y + (pos.y - prev.y) * 0.25
      }));
      animationFrame = requestAnimationFrame(updateDot);
    };
    animationFrame = requestAnimationFrame(updateDot);
    return () => cancelAnimationFrame(animationFrame);
  }, [pos]);

  // Hide on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          body, button, a, .cursor-pointer { cursor: none !important; }
        }
      `}</style>
      
      {/* Outer Ring */}
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-[1.5px] border-primary/60 transition-all duration-200 ease-out"
        style={{
          width: hovering ? 64 : 36,
          height: hovering ? 64 : 36,
          transform: `translate(${dotPos.x - (hovering ? 32 : 18)}px, ${dotPos.y - (hovering ? 32 : 18)}px)`,
          backgroundColor: hovering ? "rgba(255,107,53,0.1)" : "transparent",
          opacity: hidden ? 0 : 1,
          backdropFilter: hovering ? "blur(1px)" : "none",
        }}
      />
      
      {/* Inner Dot */}
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-primary transition-all duration-100 ease-out"
        style={{
          width: 8,
          height: 8,
          transform: `translate(${pos.x - 4}px, ${pos.y - 4}px)`,
          opacity: hidden || hovering ? 0 : 1,
          boxShadow: "0 0 12px rgba(255,107,53,0.8)"
        }}
      />
    </>
  );
}
