/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/my-site' : '',
  images: {
    unoptimized: true,
  },
  // 静的ファイルのコピー設定
  async rewrites() {
    return [
      {
        source: '/assets/:path*',
        destination: '/assets/:path*',
      },
    ]
  },
}

export default nextConfig
