import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "tfhe_bg.wasm": path.resolve(__dirname, 'node_modules/tfhe/tfhe_bg.wasm'),
    };
    return config;
  },
};

export default nextConfig;