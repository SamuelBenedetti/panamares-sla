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

// Rutas sin navbar ni footer
const FULLSCREEN_ROUTES: string[] = [];
// Rutas con navbar pero sin footer
const NO_FOOTER_ROUTES = ["/buscar"];

export default function LayoutShell({ navCounts, footer, compareBar, children }: Props) {
  const pathname = usePathname();
  const isFullscreen = FULLSCREEN_ROUTES.some((r) => pathname.startsWith(r));
  const isNoFooter = NO_FOOTER_ROUTES.some((r) => pathname.startsWith(r));
  const hideChrome = isFullscreen;
  const hideFooter = isFullscreen || isNoFooter;

  return (
    <>
      {!hideChrome && <Navbar navCounts={navCounts} />}
      <main className={`min-h-screen ${hideChrome ? "" : "pt-20"}`}>{children}</main>
      {!hideFooter && footer}
      {!hideChrome && compareBar}
    </>
  );
}
