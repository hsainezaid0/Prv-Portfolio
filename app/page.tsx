import { Hero } from "@/components/sections/Hero";
import { HomeIntro } from "@/components/home/HomeIntro";
import { Highlights } from "@/components/home/Highlights";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ContactCta } from "@/components/home/ContactCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeIntro />
      <Highlights />
      <FeaturedProjects />
      <ContactCta />
    </>
  );
}
