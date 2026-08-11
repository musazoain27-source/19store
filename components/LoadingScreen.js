'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 700);
    const hideTimer = setTimeout(() => setVisible(false), 1000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand transition-opacity duration-300 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="animate-pulseSlow flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl">
          <Image src="/logo-mark-192.png" alt="19Store" width={80} height={80} priority className="w-full h-full object-cover" />
        </div>
        <p className="text-white tracking-[0.3em] text-sm font-medium">19STORE</p>
      </div>
      <div className="mt-8 h-1 w-40 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-brand-gold rounded-full animate-[shimmer_1s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
