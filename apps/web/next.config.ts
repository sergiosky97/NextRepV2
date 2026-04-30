import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@nextrep/ui",
    "@nextrep/auth",
    "@nextrep/i18n",
    "@nextrep/api-client",
    "@nextrep/assets"
  ],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"]
    });
    return config;
  }
};

export default nextConfig;
