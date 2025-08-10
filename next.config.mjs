/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Игнорировать проверки ESLint при билде на Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
