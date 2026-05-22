import type { NextConfig } from "next";
import path from "path";

const nextConfig = {
  allowedDevOrigins: ['172.26.208.1', '192.168.4.44', '192.168.4.23'],
  turbopack: {
    root: process.cwd(),
  },
} as NextConfig;

export default nextConfig;