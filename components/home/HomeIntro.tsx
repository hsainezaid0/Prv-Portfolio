"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { DepthSection, Reveal } from "@/components/ui/Reveal";
import { Terminal } from "@/components/ui/Terminal";

export function HomeIntro() {
  const { t } = useI18n();
  return (
    <DepthSection id="intro">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-6xl">{t.home.introTitle}</h2>
          <p className="mt-6 text-xl leading-relaxed text-muted lg:text-2xl lg:leading-relaxed">{t.home.introText}</p>
          <p className="mt-10 text-xl font-semibold text-fg">{t.about.terminalTitle}</p>
          <p className="mt-1 text-lg text-muted">{t.about.terminalText}</p>
        </Reveal>
        <Reveal delay={0.1} className="min-w-0">
          <Terminal />
        </Reveal>
      </div>
    </DepthSection>
  );
}
