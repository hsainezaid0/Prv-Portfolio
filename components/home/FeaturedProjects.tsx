"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useI18n } from "@/i18n/I18nProvider";
import { projects } from "@/content/profile";
import { DepthSection, Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/sections/Projects";
import { ArrowIcon } from "@/components/ui/Icons";

export function FeaturedProjects() {
  const { t } = useI18n();
  const router = useRouter();
  const featured = projects.filter((p) => p.featured);

  return (
    <DepthSection id="featured" compactTop>
      <div className="container-x">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{t.home.featuredTitle}</h2>
          <Link href="/projects" className="inline-flex items-center gap-2 text-lg font-semibold text-accent hover:underline">
            {t.home.allProjects}
            <ArrowIcon width={16} height={16} />
          </Link>
        </Reveal>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 40, rotateX: 14 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 1000 }}
            >
              {/* Opens the project page with this project's preview already open. */}
              <ProjectCard project={p} onOpen={() => router.push(`/projects#${p.id}`)} />
            </motion.li>
          ))}
        </ul>
      </div>
    </DepthSection>
  );
}
