"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

export function ContactCta() {
  const { t } = useI18n();
  return (
    <section className="pb-24 pt-8 sm:pb-32" aria-labelledby="cta-title">
      <div className="container-x">
        <Reveal>
          <TiltCard intensity={4} className="overflow-hidden rounded-[2rem] depth-shadow">
            <div className="relative bg-linear-to-br from-[#1e1b4b] via-[#4338ca] to-[#6366f1] px-6 py-14 text-center sm:px-12 sm:py-20">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(224,231,255,0.25),transparent_45%)]" aria-hidden="true" />
              <h2 id="cta-title" className="relative mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-[#f8faff] sm:text-5xl">
                {t.home.ctaTitle}
              </h2>
              <p className="relative mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#e0e7ff]">{t.home.ctaText}</p>
              <Link
                href="/contact"
                className="relative mt-9 inline-flex h-13 items-center rounded-xl bg-[#f8faff] px-7 text-lg font-semibold text-[#1e1b4b] transition-transform hover:-translate-y-0.5"
              >
                {t.home.ctaButton}
              </Link>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
