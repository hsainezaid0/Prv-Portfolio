"use client";

// Lenis gives the page a smooth, inertial scroll on desktop.
// It is skipped for visitors who prefer reduced motion and on touch screens,
// where the native scroll already feels right.
//
// In "root" mode Lenis drives the whole window, so it is mounted *next to* the
// page instead of around it: turning it on never re-mounts the page.

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

/** On every page change, start at the top (or at the #section in the address). */
function ScrollReset() {
  const lenis = useLenis();
  const pathname = usePathname();
  useEffect(() => {
    const hash = window.location.hash;
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (lenis) lenis.scrollTo(target ?? 0, { immediate: true, force: true, offset: target ? -96 : 0 });
    else if (target) target.scrollIntoView();
  }, [pathname, lenis]);
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(!reduce && fine);
  }, []);

  return (
    <>
      {enabled && <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }} />}
      <ScrollReset />
      {children}
    </>
  );
}
