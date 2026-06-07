/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google OAuth profile photos
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com", // fallback avatars
      },
    ],
  },
};

module.exports = nextConfig;
