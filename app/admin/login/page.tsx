"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Error de autenticación");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="font-label text-xs tracking-[0.3em] text-outline uppercase mb-2">
            BUNKER FORCE BELLO
          </div>
          <h1 className="font-headline font-black text-4xl uppercase tracking-tighter text-primary">
            ADMIN
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-label text-[10px] tracking-[0.25em] text-outline uppercase mb-2">
              Contraseña de acceso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/40 px-4 py-3 font-body text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="font-label text-xs text-error tracking-widest uppercase">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-container text-on-primary py-4 font-headline font-black text-sm tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "VERIFICANDO..." : "INGRESAR"}
          </button>
        </form>

        <p className="mt-8 text-center font-label text-[10px] text-outline tracking-widest uppercase">
          Acceso restringido — solo personal autorizado
        </p>
      </div>
    </div>
  );
}
