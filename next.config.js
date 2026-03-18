/** @type {import('next').NextConfig} */
const nextConfig = {
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
  
  // API 代理配置（开发环境和 Netlify 都适用）
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ai-native-ip-production.up.railway.app/api/:path*',
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
