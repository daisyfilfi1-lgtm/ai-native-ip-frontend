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
  
  // /api/v1/* 由 app/api/v1/[[...path]]/route.ts 服务端转发到 Railway（勿再依赖 rewrites，避免 Netlify 上行为不一致）
  async rewrites() {
    return [];
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
