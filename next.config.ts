import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // En développement, le serveur est accédé via proxy (localhost, GitHub
  // Codespaces). En production on n'élargit pas la protection CSRF des Server
  // Actions à tout sous-domaine.
  ...(isDev
    ? {
        experimental: {
          serverActions: {
            allowedOrigins: ["localhost:3000", "*.app.github.dev"],
          },
        },
      }
    : {}),
};

export default nextConfig;
