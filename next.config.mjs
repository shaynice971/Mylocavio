/** @type {import('next').NextConfig} */
const nextConfig = {
  // `serverExternalPackages` (stable) n'existe qu'à partir de Next.js 15 : sur
  // cette version (14.2.35), cette clé était silencieusement ignorée par Next
  // ("Unrecognized key(s) in object: 'serverExternalPackages'" à chaque build).
  // Corrigé vers l'équivalent Next 14 : experimental.serverComponentsExternalPackages.
  // Note (audit) : testé par comparaison directe des fichiers tracés (.nft.json)
  // pour les routes /api/*/pdf avant/après ce changement — le tracé de
  // @react-pdf/renderer était déjà correct dans les deux cas pour ces Route
  // Handlers. Ce correctif est donc une mise en conformité légitime (supprime
  // l'avertissement, prépare une éventuelle migration vers Next 15) mais n'a
  // PAS été confirmé comme la cause du problème de génération PDF rapporté.
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
  // images: { domains: [] }, // Ajouter les domaines d'images externes si nécessaire
};

export default nextConfig;
