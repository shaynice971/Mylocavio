import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mylocavio.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/connexion", "/inscription", "/mentions-legales", "/confidentialite", "/cgu", "/contact"];
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.5,
  }));
}
