"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

interface NavCounts {
  venta: Record<string, number>;
  alquiler: Record<string, number>;
}

interface Props {
  navCounts: NavCounts;
  footer: React.ReactNode;
  compareBar: React.ReactNode;
  children: React.ReactNode;
}

const FULLSCREEN_ROUTES = ["/buscar"];

export default function LayoutShell({ navCounts, footer, compareBar, children }: Props) {
  const pathname = usePathname();
  const isFullscreen = FULLSCREEN_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <>
      {!isFullscreen && <Navbar navCounts={navCounts} />}
      <main className={`min-h-screen ${isFullscreen ? "" : "pt-20"}`}>{children}</main>
      {!isFullscreen && footer}
      {!isFullscreen && compareBar}
    </>
  );
}
