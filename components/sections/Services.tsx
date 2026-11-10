"use client";

import type { ComponentType, SVGProps } from "react";
import { motion } from "motion/react";
import { useI18n } from "@/i18n/I18nProvider";
import { services, type Service } from "@/content/profile";
import { DepthSection, SectionHeading } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { BotIcon, ChipIcon, CodeIcon, PuzzleIcon, ShieldIcon, TerminalIcon } from "@/components/ui/Icons";

const icons: Record<Service["icon"], ComponentType<SVGProps<SVGSVGElement>>> = {
  shield: ShieldIcon,
  code: CodeIcon,
  chip: ChipIcon,
  bot: BotIcon,
  terminal: TerminalIcon,
  puzzle: PuzzleIcon,
};

export function Services() {
  const { t, pick } = useI18n();

  return (
    <DepthSection id="services">
      <div className="container-x">
        <SectionHeading id="services-title" title={t.services.title} lead={t.services.lead} />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = icons[service.icon];
            return (
              <motion.li
                key={service.id}
                initial={{ opacity: 0, y: 40, rotateX: 18 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformPerspective: 1000 }}
              >
                <TiltCard className="glass h-full rounded-3xl p-7 depth-shadow">
                  {/* The icon floats slightly above the card surface in 3D. */}
                  <div className="[transform:translateZ(36px)]">
                    <span className="grid size-12 place-items-center rounded-2xl bg-primary text-on-primary shadow-[0_12px_30px_-10px_var(--glow)]">
                      <Icon width={22} height={22} />
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-fg [transform:translateZ(24px)]">
                    {pick(service.title)}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted [transform:translateZ(12px)]">{pick(service.text)}</p>
                </TiltCard>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </DepthSection>
  );
}
