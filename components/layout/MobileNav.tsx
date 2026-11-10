"use client";

// Phones and tablets: a bottom tab bar, where thumbs naturally rest.
// Big touch targets (at least 48px), an icon plus a label, and a highlight
// that slides to the current page.

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { motion } from "motion/react";
import { useI18n } from "@/i18n/I18nProvider";
import { GridIcon, HomeIcon, LayersIcon, MailIcon, UserIcon } from "@/components/ui/Icons";
import { isActive, pages } from "./Header";

const icons: Record<(typeof pages)[number]["key"], ComponentType<SVGProps<SVGSVGElement>>> = {
  home: HomeIcon,
  about: UserIcon,
  skills: LayersIcon,
  projects: GridIcon,
  contact: MailIcon,
};

export function MobileNav() {
  const { t } = useI18n();
  const pathname = usePathname();

  return (
    <nav
      aria-label={t.nav.menu}
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <ul className="glass mx-auto flex max-w-md items-stretch justify-between rounded-2xl p-1.5">
        {pages.map(({ href, key }) => {
          const active = isActive(pathname, href);
          const Icon = icons[key];
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold transition-colors ${
                  active ? "text-on-primary" : "text-muted"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 -z-10 rounded-xl bg-primary shadow-[0_8px_24px_-10px_var(--glow)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon width={22} height={22} />
                {t.nav.short[key]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
