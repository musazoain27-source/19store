"use client";

export default function QuantitySelector({ qty, setQty, max = 99 }) {
  return (
    <div className="inline-flex items-center border border-line h-11">
      <button
        type="button"
        onClick={() => setQty(Math.max(1, qty - 1))}
        className="w-10 h-full flex items-center justify-center hover:bg-bone transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-10 text-center text-sm font-medium" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => setQty(Math.min(max, qty + 1))}
        className="w-10 h-full flex items-center justify-center hover:bg-bone transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
