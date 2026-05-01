import type { Metadata } from "next";

// Sanity Studio is publicly reachable. robots.txt blocks /studio for
// well-behaved crawlers but hostile crawlers ignore robots.txt, so add an
// explicit meta robots noindex,nofollow at the route level.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
