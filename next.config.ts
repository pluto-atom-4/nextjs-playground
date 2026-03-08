import type { NextConfig } from "next";

// Initialize dotenvx for encrypted environment variable loading
// This must be imported before any env vars are accessed
import "@dotenvx/dotenvx/config";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
