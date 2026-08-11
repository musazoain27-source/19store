const MESSAGES = [
  "Free shipping on orders over $100",
  "New arrivals every fortnight",
  "Easy 30-day returns",
  "Considered basics, made to last",
];

export default function PromoBanner() {
  const loop = [...MESSAGES, ...MESSAGES];
  return (
    <div className="bg-gold text-ink overflow-hidden border-y border-ink/10">
      <div className="rail flex whitespace-nowrap animate-marquee py-2.5">
        {loop.map((m, i) => (
          <span key={i} className="mx-6 font-mono text-[11px] tracking-widest2 uppercase flex items-center gap-6">
            {m}
            <span aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
