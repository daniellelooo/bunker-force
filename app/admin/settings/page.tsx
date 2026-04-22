"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError(data.error || "Error al cambiar la contraseña");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-md">
      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl uppercase tracking-tighter text-on-surface">
          Configuración
        </h1>
        <p className="font-label text-xs text-outline tracking-widest uppercase mt-1">
          Seguridad del panel admin
        </p>
      </div>

      <div className="bg-surface-container border border-outline-variant/20 p-6">
        <h2 className="font-headline font-black text-sm tracking-widest uppercase text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">lock</span>
          Cambiar contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-label text-[10px] tracking-[0.25em] text-outline uppercase mb-2">
              Contraseña actual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-surface border border-outline-variant/40 px-4 py-3 font-body text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block font-label text-[10px] tracking-[0.25em] text-outline uppercase mb-2">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-surface border border-outline-variant/40 px-4 py-3 font-body text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              placeholder="Mínimo 8 caracteres"
              required
            />
          </div>

          <div>
            <label className="block font-label text-[10px] tracking-[0.25em] text-outline uppercase mb-2">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-surface border border-outline-variant/40 px-4 py-3 font-body text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="font-label text-xs text-error tracking-widest uppercase">
              {error}
            </p>
          )}

          {success && (
            <p className="font-label text-xs text-primary tracking-widest uppercase">
              Contraseña actualizada correctamente
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-container text-on-primary py-4 font-headline font-black text-sm tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            {loading ? "GUARDANDO..." : "ACTUALIZAR CONTRASEÑA"}
          </button>
        </form>
      </div>
    </div>
  );
}
