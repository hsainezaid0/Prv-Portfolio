import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { About } from "@/components/sections/About";
import { Journey } from "@/components/sections/Journey";

export const metadata: Metadata = {
  title: "About",
  description: "Zaid Hsaine's background: scientific baccalaureate, cybersecurity bootcamp, EMSI engineering studies and exchange at EPITECH Paris.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader page="about" />
      <About showHeading={false} />
      <Journey />
    </>
  );
}
