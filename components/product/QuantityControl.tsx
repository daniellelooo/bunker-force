"use client";

interface QuantityControlProps {
  quantity: number;
  onChange: (qty: number) => void;
  max?: number;
}

export function QuantityControl({ quantity, onChange, max }: QuantityControlProps) {
  const atMax = max !== undefined && quantity >= max;

  return (
    <div className="space-y-1 flex-1">
      <div className="flex items-center border border-outline-variant/50 bg-surface-container-low">
        <button
          onClick={() => onChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="px-4 py-3 text-outline hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
        <span className="font-headline font-bold flex-1 text-center">
          {String(quantity).padStart(2, "0")}
        </span>
        <button
          onClick={() => onChange(atMax ? quantity : quantity + 1)}
          disabled={atMax}
          className="px-4 py-3 text-outline hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
      {atMax && (
        <p className="font-label text-[10px] tracking-widest text-yellow-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">inventory_2</span>
          Máximo disponible: {max}
        </p>
      )}
    </div>
  );
}
