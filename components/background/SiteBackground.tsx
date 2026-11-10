"use client";

// The background behind every page: slow-moving indigo light, a dotted grid,
// circuit-board traces with pulses of light running along them (data moving
// through a network), and a soft glow that follows the mouse.
// Everything is CSS/SVG animated on the GPU-friendly properties, and it all
// stops for visitors who ask for reduced motion.

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Small deterministic random generator, so the traces look the same on server and client. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

type Trace = { d: string; end: [number, number]; duration: number; delay: number };

/** Circuit traces: runs of straight and 45° segments, like a PCB. */
function makeTraces(): Trace[] {
  const rand = rng(42);
  const traces: Trace[] = [];
  for (let i = 0; i < 18; i++) {
    const fromLeft = i % 2 === 0;
    let x = fromLeft ? -20 : 1460;
    let y = 60 + rand() * 780;
    let d = `M ${x} ${y}`;
    const steps = 3 + Math.floor(rand() * 3);
    for (let s = 0; s < steps; s++) {
      const run = 80 + rand() * 220;
      x += fromLeft ? run : -run;
      d += ` L ${x.toFixed(0)} ${y.toFixed(0)}`;
      const diag = (rand() - 0.5) * 160;
      x += fromLeft ? Math.abs(diag) : -Math.abs(diag);
      y = Math.min(880, Math.max(20, y + diag));
      d += ` L ${x.toFixed(0)} ${y.toFixed(0)}`;
    }
    traces.push({ d, end: [Math.round(x), Math.round(y)], duration: 5 + rand() * 6, delay: rand() * -10 });
  }
  return traces;
}

const traces = makeTraces();

export function SiteBackground() {
  const glowRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  // On the home page the hero (#top) stays sharp; the frost fades in once
  // the visitor has scrolled past most of it. Inner pages are always frosted.
  const [pastHero, setPastHero] = useState(false);
  const blurred = !isHome || pastHero;

  useEffect(() => {
    if (!isHome) return;
    const update = () => {
      const hero = document.getElementById("top");
      if (!hero) return setPastHero(false);
      setPastHero(hero.getBoundingClientRect().bottom < window.innerHeight * 0.5);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isHome]);

  // The cursor glow eases toward the mouse instead of sticking to it.
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      glow.style.display = "none";
      return;
    }
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let x = tx;
    let y = ty;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      glow.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={`site-bg${blurred ? " site-bg--blurred" : ""}`} aria-hidden="true">
      <div className="aurora">
        <span />
        <span />
        <span />
      </div>
      <div className="site-bg__dots" />
      <svg className="site-bg__circuit" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {traces.map((t, i) => (
          <g key={i}>
            <path d={t.d} className="site-bg__trace" />
            {/* the pulse: a short dash that travels the length of the trace */}
            <path
              d={t.d}
              pathLength={1000}
              className="site-bg__pulse"
              style={{ animationDuration: `${t.duration}s`, animationDelay: `${t.delay}s` }}
            />
            <circle cx={t.end[0]} cy={t.end[1]} r={4} className="site-bg__pad" />
          </g>
        ))}
      </svg>
      <div ref={glowRef} className="site-bg__glow" />
      {/* Frosted layer: softens the background behind the content of inner pages */}
      <div className="site-bg__frost" />
      {/* Fades the background toward the edges so text always sits on calm color */}
      <div className="site-bg__vignette" />
    </div>
  );
}
