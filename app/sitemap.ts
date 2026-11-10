import type { MetadataRoute } from "next";
import { links } from "@/content/profile";

const routes = ["", "/about", "/skills", "/projects", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${links.site}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
