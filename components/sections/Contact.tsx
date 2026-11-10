"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/I18nProvider";
import { links, person } from "@/content/profile";
import { DepthSection, Reveal, SectionHeading } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { ArrowIcon, CheckIcon, CopyIcon, FileIcon, GithubIcon, GlobeIcon, MailIcon } from "@/components/ui/Icons";

type Status = "idle" | "sending" | "sent" | "error";

// FormSubmit's AJAX endpoint emails the form to this address and answers with JSON.
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${links.email}`;

const fieldClass =
  "w-full rounded-xl border border-line bg-surface/80 px-4 py-3 text-fg placeholder:text-muted/70 transition-[border-color,box-shadow] focus:border-accent-strong focus:outline-none focus:ring-4 focus:ring-[var(--glow)]";

export function Contact({ showHeading = true }: { showHeading?: boolean }) {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, _subject: `New message from ${person.name}'s portfolio`, _template: "table", _captcha: "false" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${links.email}`;
    }
  };

  const channels = [
    { href: links.github, label: t.contact.github, value: "github.com/hsainezaid0", Icon: GithubIcon },
    { href: links.cv, label: t.contact.cv, value: "hsainezaid0.github.io", Icon: FileIcon },
    { href: links.site, label: t.contact.website, value: "zaidhsaine.com", Icon: GlobeIcon },
  ];

  return (
    <DepthSection id="contact" compactTop={!showHeading}>
      <div className="container-x">
        {showHeading && <SectionHeading id="contact-title" title={t.contact.title} lead={t.contact.lead} />}

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <TiltCard intensity={3} className="glass rounded-3xl p-6 depth-shadow sm:p-8">
              <form onSubmit={onSubmit} className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="contact-name" className="text-sm font-medium text-fg">
                      {t.contact.name}
                    </label>
                    <input id="contact-name" name="name" required autoComplete="name" maxLength={100} className={fieldClass} />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="contact-email" className="text-sm font-medium text-fg">
                      {t.contact.email}
                    </label>
                    <input id="contact-email" name="email" type="email" required autoComplete="email" maxLength={150} className={fieldClass} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="contact-message" className="text-sm font-medium text-fg">
                    {t.contact.message}
                  </label>
                  <textarea id="contact-message" name="message" required rows={6} maxLength={3000} className={`${fieldClass} resize-y`} />
                </div>
                {/* Honeypot: hidden from people, filled by bots, which FormSubmit then ignores. */}
                <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                <p className="text-sm text-muted">{t.contact.privacy}</p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex h-12 items-center rounded-xl bg-primary px-6 font-semibold text-on-primary shadow-[0_14px_40px_-12px_var(--glow)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-progress disabled:opacity-70"
                  >
                    {status === "sending" ? t.contact.sending : t.contact.send}
                  </button>
                  <p role="status" className="text-sm">
                    {status === "sent" && <span className="font-semibold text-accent">{t.contact.sent}</span>}
                    {status === "error" && <span className="text-fg">{t.contact.error}</span>}
                  </p>
                </div>
              </form>
            </TiltCard>
          </Reveal>

          <div className="grid content-start gap-6">
            <Reveal delay={0.1}>
              <h3 className="mb-4 text-lg font-semibold text-fg">{t.contact.direct}</h3>
              <ul className="grid gap-3">
                <li className="glass flex items-center gap-3 rounded-2xl p-2 pl-4">
                  <MailIcon className="shrink-0 text-accent" />
                  <a href={`mailto:${links.email}`} className="min-w-0 flex-1 py-2">
                    <span className="block text-sm text-muted">{t.contact.emailMe}</span>
                    <span className="block truncate font-semibold text-fg">{links.email}</span>
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label={t.contact.copy}
                    title={t.contact.copy}
                    className="grid size-10 shrink-0 place-items-center rounded-xl border border-line text-fg hover:border-line-strong hover:text-accent"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span key={copied ? "y" : "n"} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                        {copied ? <CheckIcon /> : <CopyIcon />}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                  <span role="status" className="sr-only">
                    {copied ? t.contact.copied : ""}
                  </span>
                </li>
                {channels.map(({ href, label, value, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="glass group flex items-center gap-3 rounded-2xl px-4 py-3 transition-transform hover:-translate-y-0.5"
                    >
                      <Icon className="shrink-0 text-accent" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-muted">{label}</span>
                        <span className="block truncate font-semibold text-fg">{value}</span>
                      </span>
                      <ArrowIcon className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* No invented testimonials: an invitation to leave real feedback instead. */}
            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-dashed border-line-strong p-6">
                <h3 className="font-semibold text-fg">{t.feedback.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.feedback.text}</p>
                <a
                  href={`mailto:${links.email}?subject=${encodeURIComponent("Feedback for Zaid")}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                >
                  {t.feedback.cta}
                  <ArrowIcon width={14} height={14} />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </DepthSection>
  );
}
