"use client";

interface QuantityControlProps {
  quantity: number;
  onChange: (qty: number) => void;
}

export function QuantityControl({ quantity, onChange }: QuantityControlProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border border-outline-variant/50 bg-surface-container-low">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="text-outline hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined">remove</span>
      </button>
      <span className="font-headline font-bold px-4">
        {String(quantity).padStart(2, "0")}
      </span>
      <button
        onClick={() => onChange(quantity + 1)}
        className="text-outline hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}
