"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface DropdownItem {
  href: string;
  label: string;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
}

export function NavDropdown({ label, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button className="font-headline font-bold uppercase text-base text-on-surface-variant hover:text-primary transition-colors tracking-widest flex items-center gap-1">
        {label}
        <span
          className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-surface-container-low border border-outline-variant/30 z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 font-headline font-bold uppercase text-xs tracking-tight text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border-b border-outline-variant/20 last:border-0"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
