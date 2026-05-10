import { useEffect, useState } from "react";

export default function SpotlightBackground() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Hide on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9997] transition-opacity duration-500 opacity-60 mix-blend-overlay"
      style={{
        background: `radial-gradient(800px circle at ${pos.x}px ${pos.y}px, rgba(255,107,53,0.08), transparent 40%)`
      }}
    />
  );
}
