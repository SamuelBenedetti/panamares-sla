"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import type { Locale } from "@/lib/copy";

interface NavCounts {
  venta: Record<string, number>;
  alquiler: Record<string, number>;
}

interface Props {
  navCounts: NavCounts;
  footer: React.ReactNode;
  compareBar: React.ReactNode;
  children: React.ReactNode;
  locale?: Locale;
}

// Rutas sin navbar ni footer
const FULLSCREEN_ROUTES: string[] = [];
// Rutas con navbar pero sin footer
const NO_FOOTER_ROUTES = ["/buscar", "/en/search"];

export default function LayoutShell({ navCounts, footer, compareBar, children, locale = "es" }: Props) {
  const pathname = usePathname();
  const isFullscreen = FULLSCREEN_ROUTES.some((r) => pathname.startsWith(r));
  const isNoFooter = NO_FOOTER_ROUTES.some((r) => pathname.startsWith(r));
  const hideChrome = isFullscreen;
  const hideFooter = isFullscreen || isNoFooter;
  const isTransparentTop =
    (pathname.startsWith("/barrios/") && pathname !== "/barrios/") ||
    (pathname.startsWith("/en/neighborhoods/") && pathname !== "/en/neighborhoods/");

  return (
    <>
      {!hideChrome && <Navbar navCounts={navCounts} locale={locale} />}
      <main className={`min-h-screen ${hideChrome || isTransparentTop ? "" : "pt-20"}`}>{children}</main>
      {!hideFooter && footer}
      {!hideChrome && compareBar}
    </>
  );
}
