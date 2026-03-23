/**
 * 浏览器端 Memory / IP 等 API 的 base URL（一般为 `/api/v1`）。
 * 
 * 生产环境（Netlify/Vercel）：
 * - 优先使用 NEXT_PUBLIC_API_DIRECT_ORIGIN 直连 Railway
 * - 避免经过 Netlify Serverless 函数（防止内存问题和 502 超时）
 * 
 * 本地开发：
 * - 使用 NEXT_PUBLIC_API_URL 或默认 localhost:8000
 * 
 * 重要：NEXT_PUBLIC_API_DIRECT_ORIGIN 必须包含完整的 Railway 域名
 * 例如：https://ai-native-ip-production.up.railway.app
 */

/** 本仓库默认的线上后端 origin（Railway） */
const DEFAULT_PRODUCTION_API_ORIGIN = 'https://ai-native-ip-production.up.railway.app';

export function getBrowserApiBaseUrl(): string {
  const u = process.env.NEXT_PUBLIC_API_URL?.trim();
  
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    const isHosted = host.endsWith('.netlify.app') || host.endsWith('.vercel.app');
    
    // 生产环境（Netlify/Vercel）：直连 Railway
    if (!isLocal && isHosted) {
      const directOrigin = process.env.NEXT_PUBLIC_API_DIRECT_ORIGIN?.trim();
      // 优先使用环境变量设置的 origin，否则使用默认
      const origin = directOrigin || DEFAULT_PRODUCTION_API_ORIGIN;
      
      if (origin && /^https:\/\//i.test(origin)) {
        console.log('[API] 使用直连 Railway:', origin);
        return `${origin.replace(/\/$/, '')}/api/v1`;
      }
      
      // 如果没有配置直连，使用同源代理（可能有问题）
      console.warn('[API] 未配置直连 Railway，使用同源代理，可能导致 502/内存问题');
      return '/api/v1';
    }
    
    // 本地开发：使用配置的 API URL
    if (isLocal && u && /^https?:\/\//i.test(u)) {
      return u.replace(/\/$/, '');
    }
  }
  
  // 默认回退
  return '/api/v1';
}

/**
 * 请求根路径下的 `/api/...`（非 `/api/v1`）时使用：返回 ''（同源）或带 origin 的直连前缀。
 */
export function getApiOriginOrEmpty(): string {
  const base = getBrowserApiBaseUrl();
  if (base === '/api/v1') return '';
  if (base.startsWith('http')) {
    return base.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
  }
  return '';
}
