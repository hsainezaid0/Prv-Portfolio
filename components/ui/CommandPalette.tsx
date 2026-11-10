"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/I18nProvider";
import { useUI } from "@/lib/ui";
import { usePathname, useRouter } from "next/navigation";
import { links, projects } from "@/content/profile";
import { pages } from "@/components/layout/Header";
import { ChatIcon, GridIcon, HomeIcon, LayersIcon, UserIcon, CopyIcon, FileIcon, GithubIcon, GlobeIcon, MailIcon, MoonIcon, SearchIcon, TerminalIcon } from "./Icons";

type Action = { id: string; group: string; label: string; keywords?: string; icon: ReactNode; run: () => void };

const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function CommandPalette() {
  const { t, lang, setLang, pick } = useI18n();
  const { paletteOpen, setPaletteOpen, toggleTheme, openChat } = useUI();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Ctrl+K / Cmd+K anywhere, or "/" when not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]");
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      } else if (e.key === "/" && !typing && !paletteOpen) {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "Escape" && paletteOpen) {
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  useEffect(() => {
    if (paletteOpen) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [paletteOpen]);

  const actions = useMemo<Action[]>(() => {
    const pageIcons = { home: <HomeIcon />, about: <UserIcon />, skills: <LayersIcon />, projects: <GridIcon />, contact: <MailIcon /> };
    const goTo: Action[] = pages.map(({ href, key }) => ({
      id: `go-${key}`,
      group: t.palette.goTo,
      label: t.nav[key],
      keywords: `${key} ${href}`,
      icon: pageIcons[key],
      run: () => router.push(href),
    }));
    const tools: Action[] = [
      { id: "chat", group: t.palette.actions, label: t.palette.openChat, keywords: "ai ia groq chat assistant", icon: <ChatIcon />, run: () => openChat() },
      {
        id: "terminal",
        group: t.palette.actions,
        label: t.palette.openTerminal,
        keywords: "terminal shell bash",
        icon: <TerminalIcon />,
        run: () => {
          // The terminal is on the home page.
          const focus = () => {
            document.getElementById("terminal")?.scrollIntoView({ block: "center", behavior: "smooth" });
            window.setTimeout(() => window.dispatchEvent(new Event("cyb:focus-terminal")), 500);
          };
          if (pathname === "/") focus();
          else {
            router.push("/");
            window.setTimeout(focus, 700);
          }
        },
      },
      { id: "lang", group: t.palette.actions, label: t.palette.switchLang, keywords: "language langue english francais", icon: <GlobeIcon />, run: () => setLang(lang === "en" ? "fr" : "en") },
      { id: "theme", group: t.palette.actions, label: t.palette.toggleTheme, keywords: "dark light sombre clair theme mode", icon: <MoonIcon />, run: () => toggleTheme() },
      { id: "copy", group: t.palette.actions, label: t.palette.copyEmail, keywords: "email mail", icon: <CopyIcon />, run: () => void navigator.clipboard?.writeText(links.email).catch(() => {}) },
    ];
    const projectActions: Action[] = projects.map((p) => ({
      id: `project-${p.id}`,
      group: t.nav.projects,
      label: pick(p.title),
      keywords: p.stack.join(" "),
      icon: <FileIcon />,
      run: () =>
        pathname === "/projects"
          ? window.dispatchEvent(new CustomEvent("cyb:open-project", { detail: p.id }))
          : router.push(`/projects#${p.id}`),
    }));
    const external: Action[] = [
      { id: "github", group: t.palette.links, label: "GitHub", icon: <GithubIcon />, run: () => window.open(links.github, "_blank", "noopener") },
      { id: "cv", group: t.palette.links, label: t.contact.cv, keywords: "cv resume", icon: <FileIcon />, run: () => window.open(links.cv, "_blank", "noopener") },
      { id: "mail", group: t.palette.links, label: links.email, keywords: "email", icon: <MailIcon />, run: () => (window.location.href = `mailto:${links.email}`) },
    ];
    return [...goTo, ...tools, ...projectActions, ...external];
  }, [t, lang, pick, router, pathname, openChat, setLang, toggleTheme]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return actions;
    return actions.filter((a) => normalize(`${a.label} ${a.keywords ?? ""} ${a.group}`).includes(q));
  }, [actions, query]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (action: Action | undefined) => {
    if (!action) return;
    setPaletteOpen(false);
    action.run();
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Tab") {
      e.preventDefault(); // keep focus in the palette
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {paletteOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-[#0b0a1f]/55 backdrop-blur-sm" onClick={() => setPaletteOpen(false)} aria-hidden="true" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.palette}
            onKeyDown={onKeyDown}
            initial={{ y: -16, scale: 0.97, rotateX: 12 }}
            animate={{ y: 0, scale: 1, rotateX: 0 }}
            exit={{ y: -10, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{ transformPerspective: 1000 }}
            className="relative flex max-h-[min(32rem,75vh)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4 text-muted">
              <SearchIcon />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.palette.placeholder}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-base text-fg placeholder:text-muted outline-none"
              />
              <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-xs">Esc</kbd>
            </div>
            <ul id="palette-list" role="listbox" ref={listRef} className="flex-1 overflow-y-auto p-2" data-lenis-prevent>
              {results.length === 0 && <li className="p-6 text-center text-muted">{t.palette.empty}</li>}
              {results.map((action, index) => {
                const header = action.group !== lastGroup ? action.group : null;
                lastGroup = action.group;
                return (
                  <li key={action.id} role="presentation">
                    {header && <div className="px-3 pb-1 pt-3 text-sm font-semibold text-muted">{header}</div>}
                    <div
                      id={`palette-${action.id}`}
                      role="option"
                      aria-selected={index === active}
                      data-index={index}
                      onMouseMove={() => setActive(index)}
                      onClick={() => choose(action)}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-fg aria-selected:bg-raised aria-selected:text-accent"
                    >
                      <span className="grid size-8 place-items-center rounded-lg bg-raised text-muted">{action.icon}</span>
                      {action.label}
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="border-t border-line px-5 py-3 text-sm text-muted">{t.palette.hint}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
