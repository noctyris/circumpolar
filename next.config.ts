import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const cloudinaryScripts = [
  "https://widget.cloudinary.com",
  "https://upload-widget.cloudinary.com",
].join(" ");

const cloudinaryConnections = [
  "https://api.cloudinary.com",
  "https://res.cloudinary.com",
  "https://widget.cloudinary.com",
  "https://upload-widget.cloudinary.com",
].join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${cloudinaryScripts}${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com",
  "font-src 'self' data:",
  `connect-src 'self' ${cloudinaryConnections}${isDev ? " ws://localhost:* http://localhost:*" : ""}`,
  "frame-src https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  "worker-src 'self' blob:",
  "media-src 'self'",
  "manifest-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ...(isDev
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
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
