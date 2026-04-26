"use client";

import dynamic from "next/dynamic";

const WhatsAppButton = dynamic(
  () => import("./WhatsAppButton").then((m) => ({ default: m.WhatsAppButton })),
  { ssr: false }
);

export function WhatsAppButtonLazy() {
  return <WhatsAppButton />;
}
