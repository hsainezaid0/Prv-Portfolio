"use client";

// Top bar, shared by every page.
// - Desktop: page links with a sliding highlight, language, theme, search.
// - It tucks away when you scroll down to read and comes back as soon as you scroll up.
// - A thin bar along its bottom edge shows how far you've read.
// On phones the page links live in the bottom bar (MobileNav), within thumb reach.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useI18n } from "@/i18n/I18nProvider";
import { useUI } from "@/lib/ui";
import type { Lang } from "@/content/profile";
import { MoonIcon, SearchIcon, SunIcon } from "@/components/ui/Icons";

export const pages = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/skills", key: "skills" },
  { href: "/projects", key: "projects" },
  { href: "/contact", key: "contact" },
] as const;

export const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggleTheme, setPaletteOpen } = useUI();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Hide after scrolling down past the top area; show on any upward scroll.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Always show the bar again after changing page.
  useEffect(() => setHidden(false), [pathname]);

  const onThemeClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)]"
      animate={{ y: hidden ? "-120%" : "0%" }}
      transition={{ type: "spring", stiffness: 300, damping: 34 }}
      // Keyboard users: focusing anything in the bar brings it back.
      onFocusCapture={() => setHidden(false)}
    >
      <div className={`container-x transition-[padding] duration-500 ${scrolled ? "pt-3" : "pt-5"}`}>
        <div
          className={`relative flex items-center gap-3 rounded-2xl px-3 py-2 transition-[background-color,border-color,box-shadow] duration-500 sm:px-4 ${
            scrolled ? "glass" : "border border-transparent"
          }`}
        >
          <Link href="/" className="flex shrink-0 items-center gap-3 rounded-xl text-lg font-semibold tracking-tight text-fg" aria-label="Zaid Hsaine, home">
            <span className="grid size-10 place-items-center rounded-xl bg-primary font-mono text-base text-on-primary shadow-[0_8px_24px_-8px_var(--glow)]">
              zh
            </span>
            <span className="hidden sm:inline">Zaid Hsaine</span>
          </Link>

          <nav aria-label={t.nav.menu} className="mx-auto hidden lg:block">
            <ul className="flex items-center gap-1 rounded-xl p-1">
              {pages.map(({ href, key }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`relative block rounded-lg px-4 py-2 text-base font-medium transition-colors ${
                        active ? "text-on-primary" : "text-muted hover:text-fg"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 -z-10 rounded-lg bg-primary shadow-[0_8px_24px_-10px_var(--glow)]"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      {t.nav[key]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <div role="group" aria-label={t.nav.language} className="flex rounded-xl border border-line p-0.5">
              {(["en", "fr"] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  aria-pressed={lang === code}
                  onClick={() => setLang(code)}
                  className="h-9 rounded-lg px-3 text-sm font-semibold text-muted transition-colors hover:text-fg aria-pressed:bg-primary aria-pressed:text-on-primary"
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onThemeClick}
              aria-label={theme === "dark" ? t.nav.themeLight : t.nav.themeDark}
              title={theme === "dark" ? t.nav.themeLight : t.nav.themeDark}
              className="grid size-10 place-items-center overflow-hidden rounded-xl border border-line text-fg transition-colors hover:border-line-strong hover:text-accent"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ y: 18, rotate: -90, opacity: 0 }}
                  animate={{ y: 0, rotate: 0, opacity: 1 }}
                  exit={{ y: -18, rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid place-items-center"
                >
                  {theme === "dark" ? <SunIcon width={20} height={20} /> : <MoonIcon width={20} height={20} />}
                </motion.span>
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label={t.nav.palette}
              className="flex h-10 items-center gap-2 rounded-xl border border-line px-2.5 text-muted transition-colors hover:border-line-strong hover:text-fg sm:pl-3"
            >
              <SearchIcon width={18} height={18} />
              <kbd className="hidden rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-xs sm:inline">
                {isMac ? "⌘" : "Ctrl"} K
              </kbd>
            </button>
          </div>

          {/* Reading progress */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-4 -bottom-px h-0.5 origin-left rounded-full bg-linear-to-r from-[#4338ca] via-[#6366f1] to-[#a5b4fc]"
            style={{ scaleX: progress, opacity: scrolled ? 1 : 0 }}
          />
        </div>
      </div>
    </motion.header>
  );
}
