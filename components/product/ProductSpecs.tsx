import type { ProductSpec } from "@/lib/types";

interface ProductSpecsProps {
  specs: ProductSpec[];
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  if (specs.length === 0) return null;

  return (
    <div className="bg-surface-container-low border-l-4 border-primary p-6 mb-8">
      <h3 className="font-label text-xs tracking-widest font-bold mb-4 text-primary">
        ESPECIFICACIONES TÉCNICAS
      </h3>
      <ul className="space-y-4">
        {specs.map((spec, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-sm mt-1">
              {spec.icon}
            </span>
            <div>
              <span className="block font-bold text-sm tracking-wide">
                {spec.title}
              </span>
              <span className="block text-xs text-outline leading-relaxed">
                {spec.description}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
