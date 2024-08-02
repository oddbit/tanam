import path from "path";
import {fileURLToPath} from "url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "firebasestorage.googleapis.com"],
  },
  redirects() {
    return [
      {
        source: "/auth",
        destination: "/auth/signin",
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    config.resolve.alias = {
      ...config.resolve.alias,
      "@shared/models": path.resolve(__dirname, "./../functions-ts/src/models/shared"),
      "@shared/definitions": path.resolve(__dirname, "./../functions-ts/src/definitions"),
    };

    return config;
  },
};

export default nextConfig;
