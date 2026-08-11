import Link from "next/link";
import Image from "next/image";
import { StampMark } from "./Logo";

export default function Hero() {
  return (
    <section className="relative bg-ink text-paper overflow-hidden">
      <div className="container-store grid md:grid-cols-2 items-center min-h-[78vh] md:min-h-[86vh] py-16 gap-10">
        <div className="relative z-10 animate-fadeUp">
          <p className="font-mono text-[11px] tracking-widest2 uppercase text-gold mb-6">
            The Nineteen Collection
          </p>
          <h1 className="font-display text-[13vw] leading-[0.95] sm:text-6xl md:text-7xl">
            Cut for
            <br />
            everyday
            <br />
            <span className="text-gold">wear.</span>
          </h1>
          <p className="mt-6 max-w-sm text-bone/70 text-[15px] leading-relaxed">
            Considered basics and directional pieces, made to be worn in, not
            worn once. New arrivals land every fortnight.
          </p>
          <div className="mt-9 flex items-center gap-4">
            <Link
              href="/products"
              className="bg-paper text-ink px-7 py-3.5 text-[13px] tracking-widest2 uppercase font-medium hover:bg-gold transition-colors"
            >
              Shop New Arrivals
            </Link>
            <Link
              href="/products?category=Outerwear"
              className="border border-white/30 px-7 py-3.5 text-[13px] tracking-widest2 uppercase hover:border-white transition-colors"
            >
              Outerwear
            </Link>
          </div>
        </div>

        <div className="relative h-[46vh] md:h-[64vh] animate-fadeUp [animation-delay:150ms]">
          <div className="absolute inset-0 rounded-sm overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1400&auto=format&fit=crop"
              alt="Model wearing a 19Store oversized wool overcoat"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 md:bottom-8 md:left-8 bg-paper text-ink px-5 py-4 flex items-center gap-3 shadow-2xl">
            <StampMark className="w-11 h-11" tone="dark" />
            <div className="leading-tight">
              <p className="font-display text-sm">Est. Collection 19</p>
              <p className="font-mono text-[10px] tracking-widest2 uppercase text-clay">
                Cut. Sewn. Considered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
