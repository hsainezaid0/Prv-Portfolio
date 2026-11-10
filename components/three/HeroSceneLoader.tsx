"use client";

// Loads the 3D scene only in the browser, only if WebGL works, and only after
// the page is interactive, so Three.js never slows down the first paint.
// While it loads (or if it can't run) the CSS aurora behind it still shows.

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useUI } from "@/lib/ui";
import { supportsWebGL } from "@/lib/motion";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => null });

export function HeroSceneLoader() {
  const { theme } = useUI();
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setCompact(window.innerWidth < 768);
    setReady(supportsWebGL());
  }, []);

  // Stop animating once the hero has scrolled out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      {ready && <HeroScene theme={theme} animate={visible && !reduced} compact={compact} />}
    </div>
  );
}
