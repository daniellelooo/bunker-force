"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const SearchModal = dynamic(
  () => import("./SearchModal").then((m) => ({ default: m.SearchModal })),
  { ssr: false }
);

export function SearchButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 active:scale-95"
        aria-label="Buscar"
      >
        <span className="material-symbols-outlined">search</span>
      </button>
      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
