"use client";

import { motion } from "motion/react";
import { useI18n } from "@/i18n/I18nProvider";
import { skillGroups } from "@/content/profile";
import { DepthSection, SectionHeading } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

export function Expertise() {
  const { t, pick } = useI18n();

  return (
    <DepthSection id="expertise">
      <div className="container-x">
        <SectionHeading id="expertise-title" title={t.expertise.title} lead={t.expertise.lead} />

        <div className="grid gap-6 lg:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 50, rotateY: gi % 2 ? -14 : 14 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 1200 }}
              // Wide cards for the bigger groups, so the grid has no empty slot.
              className={group.id === "security" || group.id === "programming" ? "lg:col-span-2" : undefined}
            >
              {/* A stacked "physical" card: two offset sheets behind give it thickness. */}
              <div className="relative h-full">
                <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-3xl border border-line bg-raised/60" aria-hidden="true" />
                <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-3xl border border-line bg-surface/70" aria-hidden="true" />
                <TiltCard intensity={5} className="glass h-full rounded-3xl p-7 depth-shadow">
                  <div className="flex items-baseline justify-between gap-4 [transform:translateZ(20px)]">
                    <h3 className="text-2xl font-semibold tracking-tight text-fg">{pick(group.title)}</h3>
                    <span className="font-mono text-sm text-accent">{String(group.skills.length).padStart(2, "0")}</span>
                  </div>
                  <ul
                    className={`mt-6 grid gap-6 ${
                      group.id === "security" ? "md:grid-cols-2 xl:grid-cols-4" : group.id === "programming" ? "md:grid-cols-3" : ""
                    }`}
                  >
                    {group.skills.map((skill) => (
                      <li key={skill.name} className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 font-semibold text-fg">
                          {skill.name}
                          {skill.learning && (
                            <span className="rounded-full border border-accent/50 px-2 py-0.5 text-xs font-medium text-accent">
                              {t.expertise.learning}
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-base leading-relaxed text-muted">{pick(skill.text)}</p>
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {skill.tags.map((tag) => (
                            <li key={tag} className="rounded-full bg-raised px-2.5 py-1 text-sm text-muted">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DepthSection>
  );
}
