import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Projects } from "@/components/sections/Projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Intrusion detection with Snort, an Arduino smart parking system, a hackathon app, a Discord bot and this portfolio.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader page="projects" />
      <Projects showHeading={false} />
    </>
  );
}
