import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com', // Google profile images
      'lh4.googleusercontent.com', // Alternative Google domain
      'lh5.googleusercontent.com', // Alternative Google domain
      'lh6.googleusercontent.com',] // Alternative Google domain]
  },
}
export default nextConfig;
