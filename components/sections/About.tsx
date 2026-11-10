"use client";

import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";
import { links, person } from "@/content/profile";
import { DepthSection, Parallax, Reveal, SectionHeading } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { ArrowIcon } from "@/components/ui/Icons";

/** `showHeading={false}` when the page header above already shows the title. */
export function About({ showHeading = true }: { showHeading?: boolean }) {
  const { t } = useI18n();
  const facts = [
    { label: t.about.facts.school, value: person.school },
    { label: t.about.facts.exchange, value: person.exchange },
    { label: t.about.facts.based, value: person.location },
    { label: t.about.facts.focus, value: t.about.facts.focusValue },
  ];

  return (
    <DepthSection id="about" compactTop={!showHeading}>
      <div className="container-x">
        {showHeading && <SectionHeading id="about-title" title={t.about.title} lead={t.about.lead} />}

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p className="font-medium text-fg">{t.about.p3}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {facts.map((f) => (
                  <div key={f.label} className="glass rounded-2xl px-4 py-3">
                    <dt className="text-sm text-muted">{f.label}</dt>
                    <dd className="mt-1 font-semibold text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

          </div>

          {/* Photo, lit like an object in the scene: glow behind, glass frame, tilt. */}
          <Parallax speed={0.25} className="relative mx-auto w-full max-w-sm lg:sticky lg:top-28 lg:self-start">
            <div
              className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(closest-side,var(--glow),transparent)] blur-2xl"
              aria-hidden="true"
            />
            <TiltCard intensity={10} className="glass rounded-[2rem] p-3 depth-shadow">
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/profile.jpg"
                  alt={person.name}
                  width={240}
                  height={240}
                  sizes="(min-width: 1024px) 384px, 90vw"
                  className="aspect-square w-full object-cover"
                />
                {/* Indigo color grade so the photo belongs to the palette. */}
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#1e1b4b]/55 via-transparent to-[#6366f1]/10 mix-blend-multiply"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-3 bottom-3 rounded-xl bg-[#1e1b4b]/70 px-4 py-3 text-[#f8faff] backdrop-blur-md [transform:translateZ(40px)]">
                  <p className="font-semibold">{person.name}</p>
                  <p className="text-sm text-[#e0e7ff]">{t.about.facts.focusValue} · {person.location}</p>
                </div>
              </div>
            </TiltCard>
            <a
              href={links.cv}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-accent hover:underline"
            >
              {t.about.cv}
              <ArrowIcon width={16} height={16} />
            </a>
          </Parallax>
        </div>
      </div>
    </DepthSection>
  );
}
