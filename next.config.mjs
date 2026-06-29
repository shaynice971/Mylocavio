/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  // images: { domains: [] }, // Ajouter les domaines d'images externes si nécessaire
};

export default nextConfig;
