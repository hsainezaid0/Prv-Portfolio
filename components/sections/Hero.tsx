"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useUI } from "@/lib/ui";
import { useScrollTo } from "@/lib/scroll";
import { HeroSceneLoader } from "@/components/three/HeroSceneLoader";
import { ArrowDownIcon, ChatIcon } from "@/components/ui/Icons";

// One orchestrated entrance: each line arrives a little after the previous one.
const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(12px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero() {
  const { t } = useI18n();
  const { openChat } = useUI();
  const scrollTo = useScrollTo();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // As you scroll away, the text drifts up and fades (layered parallax with the 3D scene).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 160]);

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20"
    >
      {/* Layer 1: perspective grid, drifting slower than the page (parallax) */}
      <motion.div className="absolute inset-0 -z-20" style={reduce ? undefined : { y: gridY }} aria-hidden="true">
        <div className="depth-grid" />
      </motion.div>
      {/* Layer 2: the interactive 3D network globe */}
      <div className="absolute inset-0 -z-10">
        <HeroSceneLoader />
      </div>
      {/* Keeps the headline readable over the globe */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-bg/30 via-bg/75 to-bg/30 lg:bg-linear-to-r lg:from-bg/85 lg:via-bg/40 lg:to-transparent"
        aria-hidden="true"
      />

      <motion.div className="container-x" style={reduce ? undefined : { y: textY, opacity: textOpacity }}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
          className="max-w-2xl"
        >
          <motion.p
            variants={item}
            className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-base text-fg"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-strong opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent-strong" />
            </span>
            {t.hero.available}
          </motion.p>

          <motion.p variants={item} className="mt-8 font-mono text-base text-accent">
            {t.hero.eyebrow}
          </motion.p>

          <motion.h1
            id="hero-title"
            variants={item}
            className="mt-3 text-5xl font-semibold leading-[1.04] tracking-[-0.035em] text-fg sm:text-6xl lg:text-7xl"
          >
            {t.hero.title}
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-xl leading-relaxed text-muted">
            {t.hero.text}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex h-13 text-lg items-center rounded-xl bg-primary px-6 font-semibold text-on-primary shadow-[0_14px_40px_-12px_var(--glow)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              {t.hero.primary}
            </Link>
            <button
              type="button"
              onClick={() => openChat()}
              className="glass inline-flex h-13 items-center gap-2 rounded-xl px-5 text-lg font-semibold text-fg transition-transform hover:-translate-y-0.5"
            >
              <ChatIcon width={18} height={18} />
              {t.hero.secondary}
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#intro"
        onClick={(e) => {
          e.preventDefault();
          scrollTo("intro");
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-sm text-muted lg:flex"
      >
        {t.hero.scroll}
        <motion.span
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="grid size-9 place-items-center rounded-full border border-line"
        >
          <ArrowDownIcon width={16} height={16} />
        </motion.span>
      </motion.a>
    </section>
  );
}
