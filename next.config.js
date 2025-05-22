/** @type {import('next').NextConfig} */
const nextPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/my-site' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextPWA(nextConfig)