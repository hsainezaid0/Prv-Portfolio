"use client";

// The top of every inner page: breadcrumb, big title, lead, and a slowly
// turning "radar" that ties each page to the cybersecurity theme.

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "@/i18n/I18nProvider";

type PageKey = "about" | "skills" | "projects" | "contact";

export function PageHeader({ page }: { page: PageKey }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const content: Record<PageKey, { title: string; lead: string }> = {
    about: { title: t.about.title, lead: t.about.lead },
    skills: { title: t.pages.skillsTitle, lead: t.pages.skillsLead },
    projects: { title: t.projects.title, lead: t.projects.lead },
    contact: { title: t.contact.title, lead: t.contact.lead },
  };
  const { title, lead } = content[page];

  return (
    <header className="relative isolate overflow-hidden pb-8 pt-36 sm:pb-12 sm:pt-44">
      {/* Radar: rings plus a sweeping beam, in the palette colors */}
      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 size-[34rem] opacity-70 sm:right-0" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border border-line" />
        <div className="absolute inset-[15%] rounded-full border border-line" />
        <div className="absolute inset-[30%] rounded-full border border-line-strong/60" />
        <div className="absolute inset-[45%] rounded-full bg-accent-strong/20 blur-xl" />
        <motion.div
          className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,var(--glow)_40deg,transparent_70deg)]"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container-x">
        <motion.nav
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-sm text-muted"
        >
          <Link href="/" className="hover:text-accent">
            ~
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-accent" aria-current="page">
            {t.nav[page]}
          </span>
        </motion.nav>
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.035em] text-fg sm:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-2xl text-xl leading-relaxed text-muted"
        >
          {lead}
        </motion.p>
      </div>
    </header>
  );
}
