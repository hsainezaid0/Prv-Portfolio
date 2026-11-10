"use client";

// Building blocks for scroll animation:
// - <Reveal>: content arrives blurred and low, then settles in.
// - <DepthSection>: a whole section tips up from a 3D angle as it enters,
//   like a camera moving onto it.
// - <Parallax>: moves its content at a different speed than the scroll.

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export function Reveal({
  children,
  delay = 0,
  className,
  y = 32,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function DepthSection({
  id,
  children,
  className = "",
  compactTop = false,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  /** Less space on top, for a section that follows a page header. */
  compactTop?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.35, 1]);

  return (
    <section id={id} ref={ref} className={`relative scroll-mt-24 pb-24 sm:pb-32 ${compactTop ? "pt-6 sm:pt-10" : "pt-24 sm:pt-32"} ${className}`}>
      <motion.div
        style={reduce ? undefined : { rotateX, scale, opacity, transformPerspective: 1400, transformOrigin: "50% 0%" }}
      >
        {children}
      </motion.div>
    </section>
  );
}

export function Parallax({ children, speed = 0.2, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 120, -speed * 120]);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

/** Section title block used by every section. */
export function SectionHeading({ title, lead, id }: { title: string; lead: string; id: string }) {
  return (
    <Reveal className="mb-12 max-w-2xl sm:mb-16">
      <h2 id={id} className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-xl leading-relaxed text-muted">{lead}</p>
    </Reveal>
  );
}
