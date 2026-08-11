"use client";
import { useEffect, useState } from "react";
import { StampMark } from "./Logo";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 750);
    const removeTimer = setTimeout(() => setVisible(false), 1100);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink transition-opacity duration-300 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="animate-stampIn">
        <StampMark className="w-20 h-20" tone="light" />
      </div>
      <p className="mt-5 font-mono text-[11px] tracking-widest2 uppercase text-bone/70">
        19Store
      </p>
    </div>
  );
}
