"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { links, person } from "@/content/profile";
import { useScrollTo } from "@/lib/scroll";
import { pages } from "./Header";
import { ArrowUpIcon, GithubIcon, MailIcon } from "@/components/ui/Icons";

export function Footer() {
  const { t } = useI18n();
  const scrollTo = useScrollTo();

  return (
    <footer className="relative border-t border-line pb-28 lg:pb-0">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_auto] md:items-start">
        <div>
          <p className="text-lg font-semibold text-fg">{person.name}</p>
          <p className="mt-2 max-w-sm text-base text-muted">{t.hero.eyebrow}</p>
          <div className="mt-5 flex gap-2">
            <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid size-11 place-items-center rounded-xl border border-line text-fg hover:border-line-strong hover:text-accent">
              <GithubIcon />
            </a>
            <a href={`mailto:${links.email}`} aria-label={t.contact.emailMe} className="grid size-11 place-items-center rounded-xl border border-line text-fg hover:border-line-strong hover:text-accent">
              <MailIcon />
            </a>
          </div>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-base">
            {pages.map(({ href, key }) => (
              <li key={href}>
                <Link href={href} className="text-muted hover:text-fg">
                  {t.nav[key]}
                </Link>
              </li>
            ))}
            <li>
              <a href={links.cv} target="_blank" rel="noreferrer" className="text-muted hover:text-fg">
                CV
              </a>
            </li>
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => scrollTo("top")}
          className="inline-flex h-11 items-center gap-2 self-start rounded-xl border border-line px-4 text-base font-medium text-fg hover:border-line-strong hover:text-accent"
        >
          <ArrowUpIcon width={16} height={16} />
          {t.nav.backToTop}
        </button>
      </div>
      <div className="container-x border-t border-line py-6 text-sm text-muted">
        © {new Date().getFullYear()} {person.name}. {t.meta.footer}
      </div>
    </footer>
  );
}
