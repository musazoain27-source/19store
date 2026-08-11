"use client";

export default function SizePicker({ sizes, selected, onSelect }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="font-mono text-[11px] tracking-widest2 uppercase text-ink">Size</span>
        {selected && (
          <span className="font-mono text-[11px] text-clay">
            {sizes.find((s) => s.size === selected)?.stock ?? 0} in stock
          </span>
        )}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {sizes.map((s) => {
          const disabled = s.stock <= 0;
          const active = selected === s.size;
          return (
            <button
              key={s.size}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(s.size)}
              className={[
                "relative h-11 border text-sm font-medium transition-colors",
                disabled
                  ? "border-line text-clay/40 cursor-not-allowed line-through"
                  : active
                  ? "border-ink bg-ink text-paper"
                  : "border-line hover:border-ink",
              ].join(" ")}
            >
              {s.size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
