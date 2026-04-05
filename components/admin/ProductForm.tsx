"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductImage, ProductSize, ProductSpec } from "@/lib/types";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const PRESET_COLORS = [
  { value: "black-ops", label: "Negro", hex: "#1a1a1a" },
  { value: "od-green", label: "Verde Militar", hex: "#4a5240" },
  { value: "coyote-tan", label: "Coyote Tan", hex: "#937b5d" },
  { value: "multicam", label: "Multicam", hex: "#6b7c52" },
  { value: "ranger-green", label: "Verde Ranger", hex: "#3d4a35" },
  { value: "wolf-grey", label: "Gris Lobo", hex: "#6b7280" },
  { value: "navy", label: "Azul Marino", hex: "#1e3a5f" },
  { value: "dark-brown", label: "Café Oscuro", hex: "#4a3728" },
];

const SPEC_ICONS = [
  { value: "shield", label: "Protección" },
  { value: "water_drop", label: "Impermeable" },
  { value: "bolt", label: "Resistencia" },
  { value: "thermostat", label: "Temperatura" },
  { value: "visibility", label: "Visibilidad" },
  { value: "grid_4x4", label: "Tejido" },
  { value: "directions_run", label: "Movilidad" },
  { value: "handyman", label: "Durabilidad" },
  { value: "compress", label: "Compresión" },
  { value: "star", label: "Calidad" },
  { value: "lock", label: "Seguridad" },
  { value: "light_mode", label: "Liviano" },
];

const CATEGORIES = [
  { value: "superior", label: "Ropa Superior" },
  { value: "inferior", label: "Ropa Inferior" },
  { value: "calzado", label: "Calzado" },
  { value: "accessories", label: "Accesorios y Equipo" },
] as const;

function toSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const emptyProduct: Omit<Product, "id"> = {
  slug: "",
  sku: "",
  series: "",
  name: "",
  category: "superior",
  price: 0,
  rating: 5.0,
  reviewCount: 0,
  badge: "",
  status: "available",
  stock: undefined,
  variantStock: undefined,
  images: [{ src: "", alt: "", label: "" }],
  specs: [{ icon: "shield", title: "", description: "" }],
  availableSizes: [],
  availableColors: [],
  featured: false,
};

// Clave de variante: "TALLA" (sin colores o 1 color) o "TALLA:COLOR" (varios colores)
function variantKey(size: string, color: string | undefined, multiColor: boolean): string {
  return multiColor && color ? `${size}:${color}` : size;
}

function computeStatusFromVariants(variantStock: Record<string, number>): Product["status"] {
  const values = Object.values(variantStock);
  if (values.length === 0) return "out-of-stock";
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return "out-of-stock";
  if (total <= 5) return "low-stock";
  return "available";
}

interface Props {
  initialData?: Product;
  mode: "new" | "edit";
}

export function ProductForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Omit<Product, "id">>(() => {
    if (!initialData) return emptyProduct;
    // Recalcular status desde variantStock al cargar, para corregir valores obsoletos en BD
    const status = initialData.variantStock
      ? computeStatusFromVariants(initialData.variantStock)
      : initialData.status;
    return { ...initialData, status };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [customColorName, setCustomColorName] = useState("");
  const [customColorHex, setCustomColorHex] = useState("#000000");
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [openIconPicker, setOpenIconPicker] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(name: string) {
    setField("name", name);
    if (mode === "new") {
      setField("slug", toSlug(name));
    }
  }

  function toggleSize(size: string) {
    setForm((prev) => ({
      ...prev,
      availableSizes: prev.availableSizes.includes(size as any)
        ? prev.availableSizes.filter((s) => s !== size)
        : [...prev.availableSizes, size as any],
    }));
  }

  function toggleColor(value: string) {
    setForm((prev) => ({
      ...prev,
      availableColors: prev.availableColors.includes(value)
        ? prev.availableColors.filter((c) => c !== value)
        : [...prev.availableColors, value],
    }));
  }

  function addCustomColor() {
    if (!customColorName.trim()) return;
    const value = customColorHex;
    if (!form.availableColors.includes(value)) {
      toggleColor(value);
    }
    setCustomColorName("");
    setCustomColorHex("#000000");
    setShowCustomColor(false);
  }

  // Images
  function setImage(index: number, field: keyof ProductImage, value: string) {
    const imgs = [...form.images];
    imgs[index] = { ...imgs[index], [field]: value };
    setField("images", imgs);
  }
  function addImage() {
    setField("images", [...form.images, { src: "", alt: "", label: "" }]);
    fileInputRefs.current.push(null);
  }
  function removeImage(index: number) {
    setField("images", form.images.filter((_, i) => i !== index));
  }
  async function handleFileUpload(index: number, file: File) {
    setUploadingIndex(index);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      setImage(index, "src", data.url);
      if (!form.images[index].alt) setImage(index, "alt", file.name.replace(/\.[^.]+$/, ""));
    } else {
      setError(data.error || "Error al subir la imagen");
    }
    setUploadingIndex(null);
  }

  // Specs
  function setSpec(index: number, field: keyof ProductSpec, value: string) {
    const specs = [...form.specs];
    specs[index] = { ...specs[index], [field]: value };
    setField("specs", specs);
  }
  function addSpec() {
    setField("specs", [...form.specs, { icon: "shield", title: "", description: "" }]);
  }
  function removeSpec(index: number) {
    setField("specs", form.specs.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url =
      mode === "new"
        ? "/api/admin/products"
        : `/api/admin/products/${initialData!.id}`;
    const method = mode === "new" ? "POST" : "PUT";

    // Garantizar que el status esté recalculado antes de guardar
    const finalForm = form.variantStock
      ? { ...form, status: computeStatusFromVariants(form.variantStock) }
      : form;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalForm),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError("Error al guardar el producto. Intenta de nuevo.");
    }
    setSaving(false);
  }

  const inputCls =
    "w-full bg-surface-container border border-outline-variant/40 px-3 py-2.5 font-body text-sm text-on-surface focus:outline-none focus:border-primary transition-colors";
  const labelCls =
    "block font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-1.5";
  const hintCls = "font-body text-[11px] text-outline mt-1";
  const sectionCls =
    "bg-surface-container-low border border-outline-variant/20 p-6 space-y-5";

  // Colors: map hex values back for custom colors display
  const allColorValues = [
    ...PRESET_COLORS,
    ...form.availableColors
      .filter((v) => !PRESET_COLORS.find((p) => p.value === v))
      .map((hex) => ({ value: hex, label: "Personalizado", hex })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-error/10 border border-error/30 px-4 py-3">
          <p className="font-label text-xs text-error tracking-widest uppercase">{error}</p>
        </div>
      )}

      {/* ─── Información del producto ─── */}
      <div className={sectionCls}>
        <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline mb-2">
          Información del producto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className={labelCls}>Nombre del producto *</label>
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="Chaqueta Táctica Storm-X"
            />
          </div>

          {/* Slug */}
          <div>
            <label className={labelCls}>Dirección web del producto *</label>
            <input
              className={inputCls}
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              required
              placeholder="chaqueta-storm-x"
            />
            <p className={hintCls}>
              Se genera automáticamente. Aparece en la URL: <span className="text-primary">/product/<strong>{form.slug || "..."}</strong></span>
            </p>
          </div>

          {/* SKU */}
          <div>
            <label className={labelCls}>Código del producto (SKU) *</label>
            <input
              className={inputCls}
              value={form.sku}
              onChange={(e) => setField("sku", e.target.value)}
              required
              placeholder="BF-STX-001"
            />
            <p className={hintCls}>Código único para identificar el producto en tu inventario. Ej: BF-STX-001</p>
          </div>

          {/* Series */}
          <div>
            <label className={labelCls}>Colección / Serie</label>
            <input
              className={inputCls}
              value={form.series}
              onChange={(e) => setField("series", e.target.value)}
              placeholder="BELLO-01"
            />
            <p className={hintCls}>Agrupa productos de la misma línea. Ej: BELLO-01, TEMPORADA 2025</p>
          </div>

          {/* Categoría */}
          <div>
            <label className={labelCls}>Categoría *</label>
            <select
              className={inputCls}
              value={form.category}
              onChange={(e) => setField("category", e.target.value as any)}
              required
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div>
            <label className={labelCls}>Precio (pesos colombianos) *</label>
            <input
              type="number"
              className={inputCls}
              value={form.price || ""}
              onChange={(e) => setField("price", Number(e.target.value))}
              required
              min={0}
              placeholder="489900"
            />
          </div>

          {/* Badge */}
          <div>
            <label className={labelCls}>Etiqueta especial</label>
            <input
              className={inputCls}
              value={form.badge || ""}
              onChange={(e) => setField("badge", e.target.value)}
              placeholder="NUEVO, OFERTA, NIVEL IV, MÁS VENDIDO..."
            />
            <p className={hintCls}>Aparece como una pegatina sobre la foto del producto en el catálogo. Déjalo vacío si no quieres ninguna.</p>
          </div>

          {/* Estado (solo lectura, calculado automáticamente si hay sizeStock) */}
          <div>
            <label className={labelCls}>Disponibilidad</label>
            <div className={`${inputCls} flex items-center gap-2 cursor-default`}>
              <span className={`w-2 h-2 rounded-full ${
                form.status === "available" ? "bg-green-500" :
                form.status === "low-stock" ? "bg-yellow-400" : "bg-red-500"
              }`} />
              <span className="font-label text-xs tracking-widest uppercase">
                {form.status === "available" ? "Disponible" :
                 form.status === "low-stock" ? "Pocas unidades" : "Agotado"}
              </span>
            </div>
            <p className={hintCls}>Se calcula automáticamente según el stock por talla.</p>
          </div>
        </div>

        {/* Destacado */}
        <div className="flex items-start gap-3 pt-2 border-t border-outline-variant/20 mt-4">
          <input
            id="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setField("featured", e.target.checked)}
            className="w-4 h-4 accent-primary mt-0.5 shrink-0"
          />
          <label htmlFor="featured" className="cursor-pointer">
            <span className="font-label text-xs tracking-widest uppercase text-on-surface">
              ⭐ Destacar en la página principal
            </span>
            <p className={hintCls}>
              Los productos destacados aparecen en el carrusel al inicio de la tienda.
            </p>
          </label>
        </div>
      </div>

      {/* ─── Fotos del producto ─── */}
      <div className={sectionCls}>
        <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline mb-2">
          Fotos del producto
        </h2>
        <div className="space-y-4">
          {form.images.map((img, i) => (
            <div key={i} className="border border-outline-variant/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-label text-[10px] tracking-widest text-outline uppercase">
                  Foto {i + 1}
                </span>
                {form.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="font-label text-[10px] tracking-widest uppercase text-error/60 hover:text-error transition-colors"
                  >
                    Eliminar foto
                  </button>
                )}
              </div>

              {/* Preview + Upload */}
              <div className="flex gap-4 items-start">
                {img.src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.src}
                    alt={img.alt || "Vista previa"}
                    className="w-20 h-20 object-cover bg-surface-container-high shrink-0"
                  />
                )}
                <div className="flex-1 space-y-2">
                  {/* File upload button */}
                  <input
                    ref={(el) => { fileInputRefs.current[i] = el; }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(i, file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[i]?.click()}
                    disabled={uploadingIndex === i}
                    className="flex items-center gap-2 px-4 py-2 font-label text-xs tracking-widest uppercase bg-surface-container border border-outline-variant/40 text-on-surface hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload</span>
                    {uploadingIndex === i ? "Subiendo..." : "Subir foto desde mi PC"}
                  </button>
                  <p className={hintCls}>JPG, PNG o WEBP · máximo 5MB</p>
                  {/* URL manual fallback */}
                  <div>
                    <label className="block font-label text-[9px] tracking-widest uppercase text-outline/60 mb-1">
                      O pegar link de imagen
                    </label>
                    <input
                      className={inputCls + " text-xs"}
                      value={img.src}
                      onChange={(e) => setImage(i, "src", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Descripción de la foto</label>
                  <input
                    className={inputCls}
                    value={img.alt}
                    onChange={(e) => setImage(i, "alt", e.target.value)}
                    placeholder="Vista frontal de la chaqueta negra"
                  />
                  <p className={hintCls}>Describe brevemente la foto (ayuda a Google y personas con discapacidad visual).</p>
                </div>
                <div>
                  <label className={labelCls}>Nombre de la vista</label>
                  <input
                    className={inputCls}
                    value={img.label}
                    onChange={(e) => setImage(i, "label", e.target.value)}
                    placeholder="Frente, Espalda, Detalle, Lateral..."
                  />
                  <p className={hintCls}>Aparece como pestaña debajo de la foto en la página del producto.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addImage}
          className="flex items-center gap-2 px-4 py-2 font-label text-xs tracking-widest uppercase border border-dashed border-outline-variant/40 text-outline hover:border-primary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
          Agregar otra foto
        </button>
      </div>

      {/* ─── Inventario por talla y color ─── */}
      <div className={sectionCls}>
        <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline mb-2">
          Inventario por talla y color
        </h2>

        {form.availableSizes.length === 0 && (
          <p className="font-label text-[11px] text-outline tracking-widest mb-3">
            Primero activa las tallas en la sección de colores y tallas, luego configura el stock aquí.
          </p>
        )}

        {form.availableSizes.length > 0 && (() => {
          const multiColor = form.availableColors.length > 1;
          const colors = multiColor ? form.availableColors : [undefined as unknown as string];

          function updateVariant(size: string, color: string | undefined, value: string) {
            const num = value === "" ? 0 : Math.max(0, Number(value));
            const key = variantKey(size, color, multiColor);
            const newVariant: Record<string, number> = { ...(form.variantStock ?? {}) };
            newVariant[key] = num;
            const total = Object.values(newVariant).reduce((a, b) => a + b, 0);
            setForm((prev) => ({
              ...prev,
              variantStock: newVariant,
              status: computeStatusFromVariants(newVariant),
              stock: total || undefined,
            }));
          }

          function getStock(size: string, color: string | undefined): number {
            if (!form.variantStock) return 0;
            return form.variantStock[variantKey(size, color, multiColor)] ?? 0;
          }

          const colorLabels: Record<string, string> = Object.fromEntries(
            PRESET_COLORS.map((c) => [c.value, c.label])
          );

          return (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left px-3 py-2 font-label text-[9px] tracking-[0.2em] uppercase text-outline border-b border-outline-variant/20 w-16">
                      Talla
                    </th>
                    {multiColor ? (
                      colors.map((color) => (
                        <th key={color} className="px-3 py-2 font-label text-[9px] tracking-widest uppercase text-outline border-b border-outline-variant/20 text-center min-w-[90px]">
                          <span className="flex flex-col items-center gap-1">
                            <span
                              className="w-4 h-4 rounded-full border border-outline-variant/40 inline-block"
                              style={{ backgroundColor: PRESET_COLORS.find(p => p.value === color)?.hex ?? color }}
                            />
                            {colorLabels[color] ?? color}
                          </span>
                        </th>
                      ))
                    ) : (
                      <th className="px-3 py-2 font-label text-[9px] tracking-widest uppercase text-outline border-b border-outline-variant/20 text-center">
                        Unidades
                      </th>
                    )}
                    <th className="px-3 py-2 font-label text-[9px] tracking-widest uppercase text-outline border-b border-outline-variant/20 text-right">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {form.availableSizes.map((size) => {
                    const rowTotal = colors.reduce((sum, color) => sum + getStock(size, color), 0);
                    return (
                      <tr key={size} className="hover:bg-surface-container-high transition-colors">
                        <td className="px-3 py-3">
                          <span className="font-label text-sm font-black tracking-widest text-on-surface">{size}</span>
                        </td>
                        {colors.map((color) => {
                          const stock = getStock(size, color);
                          return (
                            <td key={color ?? "none"} className="px-3 py-3 text-center">
                              <input
                                type="number"
                                min={0}
                                value={stock}
                                onChange={(e) => updateVariant(size, color, e.target.value)}
                                className={`w-20 bg-surface-container-high border px-2 py-1.5 font-headline font-bold text-sm text-center focus:outline-none transition-colors ${
                                  stock === 0
                                    ? "border-error/40 text-error focus:border-error"
                                    : stock <= 3
                                    ? "border-yellow-500/40 text-yellow-400 focus:border-yellow-500"
                                    : "border-outline-variant/40 text-on-surface focus:border-primary"
                                }`}
                              />
                            </td>
                          );
                        })}
                        <td className="px-3 py-3 text-right">
                          <span className={`font-label text-xs font-bold ${
                            rowTotal === 0 ? "text-error/60" : rowTotal <= 3 ? "text-yellow-400" : "text-outline"
                          }`}>
                            {rowTotal === 0 ? "Agotado" : `${rowTotal} uds.`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-outline-variant/30">
                    <td colSpan={colors.length + 1} className="px-3 py-3 font-label text-[10px] tracking-widest text-outline uppercase">
                      Total en bodega
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-headline font-black text-sm text-on-surface">
                        {form.availableSizes.reduce((sum, size) =>
                          sum + colors.reduce((cs, color) => cs + getStock(size, color), 0), 0
                        )} uds.
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Estado calculado */}
              <div className="mt-3 flex items-center gap-2">
                <span className="font-label text-[10px] tracking-widest text-outline uppercase">Estado calculado:</span>
                <span className={`font-label text-[10px] tracking-widest uppercase px-2 py-1 border ${
                  form.status === "available"
                    ? "text-green-400 border-green-400/30 bg-green-400/10"
                    : form.status === "low-stock"
                    ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                    : "text-red-400 border-red-400/30 bg-red-400/10"
                }`}>
                  {form.status === "available" ? "Disponible" :
                   form.status === "low-stock" ? "Pocas unidades" : "Agotado"}
                </span>
              </div>
            </div>
          );
        })()}

        {form.availableSizes.length === 0 && (
          <p className={hintCls}>
            Activa las tallas en la sección &quot;Tallas disponibles&quot; de arriba para configurar el stock.
          </p>
        )}
      </div>

      {/* ─── Colores ─── */}
      <div className={sectionCls}>
        <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline mb-2">
          Colores disponibles
        </h2>
        <p className={hintCls + " mb-3"}>Selecciona los colores en los que está disponible este producto.</p>
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map((color) => {
            const selected = form.availableColors.includes(color.value);
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => toggleColor(color.value)}
                title={color.label}
                className={`flex flex-col items-center gap-1.5 p-2 border transition-all ${
                  selected
                    ? "border-primary"
                    : "border-outline-variant/30 hover:border-outline"
                }`}
              >
                <span
                  className="w-8 h-8 block rounded-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <span className={`font-label text-[9px] tracking-widest uppercase ${selected ? "text-primary" : "text-outline"}`}>
                  {color.label}
                </span>
                {selected && (
                  <span className="material-symbols-outlined text-[12px] text-primary">check</span>
                )}
              </button>
            );
          })}

          {/* Custom colors already added */}
          {form.availableColors
            .filter((v) => !PRESET_COLORS.find((p) => p.value === v))
            .map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => toggleColor(hex)}
                className="flex flex-col items-center gap-1.5 p-2 border border-primary"
              >
                <span className="w-8 h-8 block rounded-sm" style={{ backgroundColor: hex }} />
                <span className="font-label text-[9px] tracking-widest uppercase text-primary">Custom</span>
                <span className="material-symbols-outlined text-[12px] text-primary">check</span>
              </button>
            ))}
        </div>

        {/* Agregar color personalizado */}
        {!showCustomColor ? (
          <button
            type="button"
            onClick={() => setShowCustomColor(true)}
            className="mt-3 flex items-center gap-2 px-4 py-2 font-label text-xs tracking-widest uppercase border border-dashed border-outline-variant/40 text-outline hover:border-primary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">palette</span>
            Agregar color personalizado
          </button>
        ) : (
          <div className="mt-3 flex items-end gap-3 p-3 border border-outline-variant/30">
            <div>
              <label className={labelCls}>Nombre del color</label>
              <input
                className={inputCls}
                value={customColorName}
                onChange={(e) => setCustomColorName(e.target.value)}
                placeholder="Azul Royal, Rojo, etc."
                style={{ width: 160 }}
              />
            </div>
            <div>
              <label className={labelCls}>Color</label>
              <input
                type="color"
                value={customColorHex}
                onChange={(e) => setCustomColorHex(e.target.value)}
                className="w-12 h-10 cursor-pointer border border-outline-variant/40 bg-surface-container p-0.5"
              />
            </div>
            <button
              type="button"
              onClick={addCustomColor}
              className="px-4 py-2.5 font-label text-xs tracking-widest uppercase bg-primary text-on-primary"
            >
              Agregar
            </button>
            <button
              type="button"
              onClick={() => setShowCustomColor(false)}
              className="px-4 py-2.5 font-label text-xs tracking-widest uppercase border border-outline-variant/40 text-outline"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* ─── Características técnicas ─── */}
      <div className={sectionCls}>
        <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline mb-2">
          Características técnicas
        </h2>
        <p className={hintCls + " mb-3"}>Describe los puntos fuertes del producto. Aparecen en la página de detalle.</p>
        <div className="space-y-4">
          {form.specs.map((spec, i) => (
            <div key={i} className="border border-outline-variant/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-label text-[10px] tracking-widest text-outline uppercase">
                  Característica {i + 1}
                </span>
                {form.specs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="font-label text-[10px] tracking-widest uppercase text-error/60 hover:text-error transition-colors"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              {/* Icon picker */}
              <div>
                <label className={labelCls}>Ícono</label>
                <div className="flex flex-wrap gap-2">
                  {SPEC_ICONS.map((icon) => (
                    <button
                      key={icon.value}
                      type="button"
                      onClick={() => setSpec(i, "icon", icon.value)}
                      title={icon.label}
                      className={`flex flex-col items-center gap-0.5 px-2 py-1.5 border transition-all ${
                        spec.icon === icon.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-outline-variant/30 text-outline hover:border-outline"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{icon.value}</span>
                      <span className="font-label text-[8px] tracking-widest">{icon.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Nombre de la característica</label>
                  <input
                    className={inputCls}
                    value={spec.title}
                    onChange={(e) => setSpec(i, "title", e.target.value)}
                    placeholder="RESISTENCIA AL AGUA"
                  />
                </div>
                <div>
                  <label className={labelCls}>Descripción</label>
                  <input
                    className={inputCls}
                    value={spec.description}
                    onChange={(e) => setSpec(i, "description", e.target.value)}
                    placeholder="Certificado IPX-6, aguanta lluvia fuerte"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSpec}
          className="flex items-center gap-2 px-4 py-2 font-label text-xs tracking-widest uppercase border border-dashed border-outline-variant/40 text-outline hover:border-primary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Agregar característica
        </button>
      </div>

      {/* ─── Guardar ─── */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary px-8 py-4 font-headline font-black text-sm tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          {saving ? "GUARDANDO..." : mode === "new" ? "CREAR PRODUCTO" : "GUARDAR CAMBIOS"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-4 font-headline font-black text-sm tracking-widest uppercase border border-outline-variant/40 text-outline hover:text-on-surface hover:border-outline transition-colors"
        >
          CANCELAR
        </button>
      </div>
    </form>
  );
}
