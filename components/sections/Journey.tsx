"use client";

// The journey: milestones float as nodes, connected by a glowing path that
// draws itself as you scroll. The path is computed from the real positions of
// the nodes (measured in the browser), so it always passes through them,
// whatever the screen size or the text length.

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useI18n } from "@/i18n/I18nProvider";
import { projects, timeline } from "@/content/profile";
import { DepthSection, Reveal, SectionHeading } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { ArrowIcon } from "@/components/ui/Icons";

export function Journey() {
  const { t, pick } = useI18n();
  const reduce = useReducedMotion();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [path, setPath] = useState({ d: "", width: 0, height: 0 });

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 0.75", "end 0.6"] });
  const drawn = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  // Build a smooth curve through the centre of every node.
  // offsetLeft/offsetTop ignore CSS transforms, so the measurement stays right
  // even while the section is still tilting into place.
  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const points = dotRefs.current
      .filter((el): el is HTMLSpanElement => !!el)
      .map((el) => {
        let x = el.offsetWidth / 2;
        let y = el.offsetHeight / 2;
        let node: HTMLElement | null = el;
        while (node && node !== container) {
          x += node.offsetLeft;
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        return { x, y };
      });
    if (points.length < 2) return;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      const midY = (a.y + b.y) / 2;
      d += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
    }
    setPath({ d, width: container.offsetWidth, height: container.offsetHeight });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const caseStudies = projects.filter((p) => p.id === "snort" || p.id === "parking");

  return (
    <DepthSection id="journey">
      <div className="container-x">
        <SectionHeading id="journey-title" title={t.journey.title} lead={t.journey.lead} />

        <div ref={containerRef} className="relative">
          {/* The pathway: a faint track, plus a glowing line that draws with the scroll. */}
          {path.d && (
            <svg
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={path.width}
              height={path.height}
              viewBox={`0 0 ${path.width} ${path.height}`}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="journey-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a5b4fc" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4338ca" />
                </linearGradient>
              </defs>
              <path d={path.d} fill="none" stroke="var(--line-strong)" strokeWidth={2} strokeDasharray="4 8" />
              <motion.path
                d={path.d}
                fill="none"
                stroke="url(#journey-gradient)"
                strokeWidth={3}
                strokeLinecap="round"
                style={{ pathLength: reduce ? 1 : drawn, filter: "drop-shadow(0 0 8px var(--glow))" }}
              />
            </svg>
          )}

          <ol className="relative grid gap-10 sm:gap-14">
            {timeline.map((entry, i) => {
              const right = i % 2 === 1;
              return (
                <li
                  key={entry.year}
                  className={`relative flex items-center gap-5 sm:w-[58%] ${right ? "sm:ml-auto sm:flex-row-reverse sm:text-right" : ""}`}
                >
                  {/* The node */}
                  <span
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    className="relative grid size-12 shrink-0 place-items-center rounded-full border border-line-strong bg-surface font-mono text-xs font-semibold text-accent shadow-[0_0_0_6px_var(--bg),0_0_30px_var(--glow)]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <Reveal className="min-w-0 flex-1" y={24}>
                    <TiltCard intensity={6} className="glass rounded-2xl p-5 depth-shadow">
                      <p className="font-mono text-sm text-accent">
                        {entry.year}
                        {entry.place && <span className="text-muted"> · {entry.place}</span>}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold tracking-tight text-fg sm:text-xl">{pick(entry.title)}</h3>
                      <p className="mt-2 text-muted">{pick(entry.text)}</p>
                    </TiltCard>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Two case studies at the end of the journey */}
        <div className="mt-24">
          <Reveal>
            <h3 className="text-2xl font-semibold tracking-tight text-fg">{t.journey.caseStudies}</h3>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {caseStudies.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <TiltCard className="glass h-full overflow-hidden rounded-3xl depth-shadow">
                  <div className="relative aspect-[16/8] overflow-hidden bg-[#1e1b4b]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={pick(p.imageAlt)}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm font-medium text-accent">{t.projects.categories[p.category]}</p>
                    <h4 className="mt-1 text-xl font-semibold tracking-tight text-fg">{pick(p.title)}</h4>
                    <p className="mt-2 text-muted">{pick(p.summary)}</p>
                    <button
                      type="button"
                      onClick={() => router.push(`/projects#${p.id}`)}
                      className="mt-5 inline-flex items-center gap-2 font-semibold text-accent hover:underline"
                    >
                      {t.journey.caseCta}
                      <ArrowIcon width={16} height={16} />
                    </button>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </DepthSection>
  );
}
