import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Services } from "@/components/sections/Services";
import { Expertise } from "@/components/sections/Expertise";

export const metadata: Metadata = {
  title: "Skills",
  description: "Network monitoring with Snort, security analysis, web interfaces, embedded prototypes, automation, Linux and Git.",
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  return (
    <>
      <PageHeader page="skills" />
      <Services />
      <Expertise />
    </>
  );
}
