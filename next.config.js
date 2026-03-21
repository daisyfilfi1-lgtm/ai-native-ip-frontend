/** 服务端转发目标（浏览器永远走同源 /api，不写进 NEXT_PUBLIC，避免跨域） */
const RAILWAY_API_ORIGIN =
  process.env.RAILWAY_API_ORIGIN || 'https://ai-native-ip-production.up.railway.app'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 禁用SWC，使用Babel编译（解决Node.js 25兼容性问题）
  swcMinify: false,
  
  reactStrictMode: true,
  
  // 图片配置（Netlify 支持 Next.js 图片优化）
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ai-native-ip-production.up.railway.app',
      },
    ],
    // 如果使用静态导出，取消下面的注释
    // unoptimized: true,
  },
  
  // 浏览器请求 /api/* → 由 Node 转发到 Railway（同源、无 CORS；勿在 Netlify 再配 /api 边缘代理）
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${RAILWAY_API_ORIGIN}/api/:path*`,
      },
    ];
  },
  
  // 重定向配置
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },
  
  // HTTP 头配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
  
  // 实验性功能（可选）
  experimental: {
    // appDir: true, // Next.js 14 默认启用
  },
}

module.exports = nextConfig
