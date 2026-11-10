"use client";

import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { motion } from "motion/react";
import { useI18n } from "@/i18n/I18nProvider";
import { DepthSection, Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { ArrowIcon, GridIcon, LayersIcon, MailIcon, UserIcon } from "@/components/ui/Icons";

type Key = "about" | "skills" | "projects" | "contact";
const items: { key: Key; href: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { key: "about", href: "/about", Icon: UserIcon },
  { key: "skills", href: "/skills", Icon: LayersIcon },
  { key: "projects", href: "/projects", Icon: GridIcon },
  { key: "contact", href: "/contact", Icon: MailIcon },
];

export function Highlights() {
  const { t } = useI18n();
  return (
    <DepthSection id="explore" compactTop>
      <div className="container-x">
        <Reveal>
          <h2 className="mb-10 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{t.home.highlightsTitle}</h2>
        </Reveal>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ key, href, Icon }, i) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 40, rotateX: 16 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 1000 }}
            >
              <Link href={href} className="block h-full rounded-3xl">
                <TiltCard className="glass h-full rounded-3xl p-6 depth-shadow">
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary text-on-primary [transform:translateZ(30px)]">
                    <Icon width={22} height={22} />
                  </span>
                  <h3 className="mt-6 flex items-center gap-2 text-xl font-semibold text-fg [transform:translateZ(20px)]">
                    {t.nav[key]}
                    <ArrowIcon width={16} height={16} className="text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-muted">{t.home.highlights[key]}</p>
                </TiltCard>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </DepthSection>
  );
}
