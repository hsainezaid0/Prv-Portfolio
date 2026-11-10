"use client";

// Projects float as 3D cards with a picture each. Filters re-arrange them with
// layout animations, and "Open preview" expands a card into a full panel.
// A link like /projects#snort opens that project's preview directly.

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useI18n } from "@/i18n/I18nProvider";
import { projects, type Project, type ProjectCategory } from "@/content/profile";
import { DepthSection, SectionHeading } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { ArrowIcon, CloseIcon } from "@/components/ui/Icons";

type Filter = "all" | ProjectCategory;
const filters: Filter[] = ["all", "security", "web", "embedded", "apps"];

export function Projects({ showHeading = true }: { showHeading?: boolean }) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const open = projects.find((p) => p.id === openId) ?? null;
  const closePreview = useCallback(() => {
    setOpenId(null);
    // Remove "#snort" from the address bar without adding a history entry.
    if (window.location.hash) history.replaceState(null, "", window.location.pathname);
  }, []);

  useEffect(() => {
    setMounted(true);
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (projects.some((p) => p.id === id)) {
        setFilter("all");
        setOpenId(id);
      }
    };
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (projects.some((p) => p.id === id)) {
        setFilter("all");
        setOpenId(id);
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    window.addEventListener("cyb:open-project", onOpen);
    return () => {
      window.removeEventListener("hashchange", openFromHash);
      window.removeEventListener("cyb:open-project", onOpen);
    };
  }, []);

  return (
    <DepthSection id="projects" compactTop={!showHeading}>
      <div className="container-x">
        {showHeading && <SectionHeading id="projects-title" title={t.projects.title} lead={t.projects.lead} />}

        <div role="group" aria-label={t.projects.filter} className="mb-10 flex flex-wrap gap-2">
          {filters.map((f) => {
            const count = f === "all" ? projects.length : projects.filter((p) => p.category === f).length;
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={`relative inline-flex h-11 items-center gap-2 rounded-xl px-4 text-base font-medium transition-colors ${
                  active ? "text-on-primary" : "glass text-fg hover:text-accent"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 -z-10 rounded-xl bg-primary shadow-[0_10px_30px_-10px_var(--glow)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {f === "all" ? t.projects.all : t.projects.categories[f]}
                <span className={`rounded-md px-1.5 text-sm ${active ? "bg-white/20" : "bg-raised text-muted"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <motion.ul layout className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9, rotateX: 12 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateX: -12 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformPerspective: 1000 }}
              >
                <ProjectCard project={p} onOpen={() => setOpenId(p.id)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        {visible.length === 0 && <p className="text-muted">{t.projects.empty}</p>}
      </div>

      {/* Rendered into <body>: the section is 3D-transformed, which would trap a fixed overlay. */}
      {mounted &&
        createPortal(
          <AnimatePresence>{open && <ProjectPreview project={open} onClose={closePreview} />}</AnimatePresence>,
          document.body,
        )}
    </DepthSection>
  );
}

/** The project's picture, with category and status badges on top. */
function ProjectCover({ project, large = false }: { project: Project; large?: boolean }) {
  const { t, pick } = useI18n();
  return (
    <motion.div
      layoutId={`cover-${project.id}`}
      className={`relative shrink-0 overflow-hidden bg-[#1e1b4b] ${large ? "aspect-[16/8]" : "aspect-[16/10]"}`}
    >
      <Image
        src={project.image}
        alt={pick(project.imageAlt)}
        fill
        unoptimized // SVG illustrations: no need for Next.js image resizing
        sizes={large ? "768px" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <span className="absolute left-4 top-4 rounded-full bg-[#1e1b4b]/75 px-3 py-1 text-sm font-medium text-[#f8faff] backdrop-blur">
        {t.projects.categories[project.category]}
      </span>
      <span
        className={`absolute right-4 top-4 rounded-full px-3 py-1 text-sm font-medium backdrop-blur ${
          project.status === "in-progress" ? "bg-[#f8faff]/90 text-[#4338ca]" : "bg-[#1e1b4b]/75 text-[#e0e7ff]"
        }`}
      >
        {t.projects.status[project.status]}
      </span>
    </motion.div>
  );
}

export function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const { t, pick } = useI18n();
  return (
    <TiltCard className="glass flex h-full flex-col overflow-hidden rounded-3xl depth-shadow">
      <ProjectCover project={project} />
      <div className="flex flex-1 flex-col p-6 [transform:translateZ(20px)]">
        <h3 className="text-xl font-semibold tracking-tight text-fg">{pick(project.title)}</h3>
        <p className="mt-2 flex-1 text-base leading-relaxed text-muted">{pick(project.summary)}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <li key={s} className="rounded-full bg-raised px-2.5 py-1 text-sm text-muted">
              {s}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="mt-6 inline-flex items-center gap-2 self-start text-base font-semibold text-accent hover:underline"
        >
          {t.projects.open}
          <ArrowIcon width={16} height={16} />
        </button>
      </div>
    </TiltCard>
  );
}

function ProjectPreview({ project, onClose }: { project: Project; onClose: () => void }) {
  const { t, pick } = useI18n();
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Open: freeze the page scroll, focus the close button. Close: restore both.
  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    lenis?.stop();
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      lenis?.start();
      previousFocus.current?.focus({ preventScroll: true });
    };
  }, [lenis, onClose]);

  // Keep Tab inside the dialog.
  const trapFocus = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const focusable = e.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <motion.div className="fixed inset-0 z-[70] grid place-items-center p-4 sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label={t.projects.close} tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-[#0b0a1f]/65 backdrop-blur-sm" />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`preview-${project.id}`}
        onKeyDown={trapFocus}
        initial={{ y: 40, scale: 0.95, rotateX: 10 }}
        animate={{ y: 0, scale: 1, rotateX: 0 }}
        exit={{ y: 30, scale: 0.96, rotateX: 8 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        style={{ transformPerspective: 1200 }}
        className="relative flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl"
      >
        <div className="relative">
          <ProjectCover project={project} large />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.projects.close}
            className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-[#1e1b4b]/80 text-[#f8faff] backdrop-blur hover:bg-[#1e1b4b]"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8" data-lenis-prevent>
          <p className="font-mono text-sm text-accent">{project.stack.join(" / ")}</p>
          <h3 id={`preview-${project.id}`} className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            {pick(project.title)}
          </h3>
          <p className="mt-3 text-lg leading-relaxed text-muted">{pick(project.summary)}</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {project.details.map((d) => (
              <div key={d.label.en} className="rounded-2xl bg-raised/60 p-5">
                <dt className="text-base font-semibold text-fg">{pick(d.label)}</dt>
                <dd className="mt-1 text-base leading-relaxed text-muted">{pick(d.text)}</dd>
              </div>
            ))}
          </dl>
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 font-semibold text-on-primary hover:bg-primary-hover"
            >
              {t.projects.repo}
              <ArrowIcon width={16} height={16} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
