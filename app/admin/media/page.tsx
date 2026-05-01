"use client";

import { useEffect, useState } from "react";

type ConfigKey =
  | "heroVideo"
  | "heroDesktopImage"
  | "heroMobileImage"
  | "categorySuperiorImage"
  | "categoryInferiorImage"
  | "categoryCalzadoImage"
  | "categoryAccessoriesImage";

type Config = Record<ConfigKey, string | null>;

const SLOTS: {
  key: ConfigKey;
  label: string;
  description: string;
  kind: "image" | "video";
  defaultPath: string;
}[] = [
  {
    key: "heroVideo",
    label: "Video del hero (escritorio)",
    description:
      "Video de fondo en la portada para PC. MP4 o WEBM, máx 30MB. Si lo borras, se mostrará la imagen de hero escritorio.",
    kind: "video",
    defaultPath: "/hero.mp4",
  },
  {
    key: "heroDesktopImage",
    label: "Imagen del hero (escritorio)",
    description:
      "Fallback cuando no hay video. JPG/PNG/WEBP, máx 5MB. Recomendado: 1920×900px.",
    kind: "image",
    defaultPath: "/img-hero.webp",
  },
  {
    key: "heroMobileImage",
    label: "Imagen del hero (celular)",
    description:
      "Fondo de la portada en móvil. JPG/PNG/WEBP, máx 5MB. Recomendado vertical 800×1100px.",
    kind: "image",
    defaultPath: "/img-hero.webp",
  },
  {
    key: "categorySuperiorImage",
    label: "Categoría · Ropa superior",
    description: "Imagen del tile grande de ropa superior.",
    kind: "image",
    defaultPath: "/ropa-superior.webp",
  },
  {
    key: "categoryInferiorImage",
    label: "Categoría · Ropa inferior",
    description: "Imagen del tile de ropa inferior.",
    kind: "image",
    defaultPath: "/ropa-inferior.webp",
  },
  {
    key: "categoryCalzadoImage",
    label: "Categoría · Calzado",
    description: "Imagen del tile de calzado.",
    kind: "image",
    defaultPath: "/calzado.webp",
  },
  {
    key: "categoryAccessoriesImage",
    label: "Categoría · Accesorios",
    description: "Imagen del tile de accesorios.",
    kind: "image",
    defaultPath: "/accesorios.webp",
  },
];

export default function AdminMediaPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState<Record<ConfigKey, boolean>>({} as Record<ConfigKey, boolean>);
  const [feedback, setFeedback] = useState<{ key: ConfigKey; text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then((r) => r.json())
      .then((data) => setConfig(data));
  }, []);

  function setBusy(key: ConfigKey, busy: boolean) {
    setLoading((prev) => ({ ...prev, [key]: busy }));
  }

  async function handleUpload(key: ConfigKey, file: File, kind: "image" | "video") {
    setBusy(key, true);
    setFeedback(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const upData = await upRes.json();
      if (!upRes.ok) throw new Error(upData.error || "Error al subir");

      const cfgRes = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: upData.url }),
      });
      const cfgData = await cfgRes.json();
      if (!cfgRes.ok) throw new Error(cfgData.error || "Error al guardar");

      setConfig(cfgData);
      setFeedback({ key, text: "Actualizado correctamente", ok: true });
    } catch (err) {
      setFeedback({ key, text: (err as Error).message, ok: false });
    } finally {
      setBusy(key, false);
    }
  }

  async function handleReset(key: ConfigKey) {
    setBusy(key, true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al restablecer");
      setConfig(data);
      setFeedback({ key, text: "Restablecido al valor por defecto", ok: true });
    } catch (err) {
      setFeedback({ key, text: (err as Error).message, ok: false });
    } finally {
      setBusy(key, false);
    }
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="font-label text-xs tracking-widest text-outline uppercase animate-pulse">
          Cargando...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl uppercase tracking-tighter text-on-surface">
          Media del sitio
        </h1>
        <p className="font-label text-xs text-outline tracking-widest uppercase mt-1">
          Hero y categorías de la página principal
        </p>
      </div>

      <div className="space-y-6">
        {SLOTS.map((slot) => {
          const current = config[slot.key];
          const displaySrc = current || slot.defaultPath;
          const isBusy = !!loading[slot.key];
          const fb = feedback?.key === slot.key ? feedback : null;
          return (
            <div
              key={slot.key}
              className="bg-surface-container border border-outline-variant/20 p-5 md:p-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-5"
            >
              {/* Preview */}
              <div className="aspect-video bg-surface-container-high overflow-hidden border border-outline-variant/30 flex items-center justify-center">
                {slot.kind === "video" ? (
                  <video
                    key={displaySrc}
                    src={displaySrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displaySrc}
                    alt={slot.label}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Info + actions */}
              <div className="flex flex-col">
                <h2 className="font-headline font-black text-base uppercase tracking-widest text-on-surface">
                  {slot.label}
                </h2>
                <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {slot.description}
                </p>

                <div className="mt-2 mb-4">
                  <span className="font-label text-[10px] text-outline tracking-widest uppercase">
                    Estado:
                  </span>{" "}
                  <span
                    className={`font-label text-[10px] tracking-widest uppercase ${
                      current ? "text-primary" : "text-outline"
                    }`}
                  >
                    {current ? "PERSONALIZADO" : "POR DEFECTO"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <label
                    className={`inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary font-label text-[11px] tracking-widest uppercase cursor-pointer hover:bg-primary-container transition-colors ${
                      isBusy ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">upload</span>
                    {isBusy ? "Subiendo..." : "Subir nuevo"}
                    <input
                      type="file"
                      accept={slot.kind === "video" ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp,image/gif"}
                      hidden
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUpload(slot.key, f, slot.kind);
                        e.target.value = "";
                      }}
                    />
                  </label>

                  {current && (
                    <button
                      onClick={() => handleReset(slot.key)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-2 px-4 py-2.5 border border-outline-variant/40 text-on-surface font-label text-[11px] tracking-widest uppercase hover:border-error hover:text-error transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      Restablecer
                    </button>
                  )}
                </div>

                {fb && (
                  <p
                    className={`font-label text-[11px] tracking-widest uppercase mt-3 ${
                      fb.ok ? "text-primary" : "text-error"
                    }`}
                  >
                    {fb.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
