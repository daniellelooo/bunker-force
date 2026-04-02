"use client";

import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}

export function ShellWrapper({ children, header, footer }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
