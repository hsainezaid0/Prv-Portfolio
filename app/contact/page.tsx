import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Zaid Hsaine about a cybersecurity alternance, a project or a question.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader page="contact" />
      <Contact showHeading={false} />
    </>
  );
}
