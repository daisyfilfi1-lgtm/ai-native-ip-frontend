/**
 * 浏览器端 Memory / IP 等 API 的 base URL（一般为 `/api/v1`）。
 *
 * - 在 **Netlify / Vercel** 生产域名上 **强制** 同源 `/api/v1`，忽略 Dashboard 里误配的
 *   `NEXT_PUBLIC_API_URL=https://...railway.app/...`（否则构建注入后仍会跨域）。
 * - 由 `next.config.js` rewrites 在服务端转发到 Railway。
 * - 本地开发：`NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1` 仍生效（非 netlify/vercel 域名）。
 */
export function getBrowserApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.endsWith('.netlify.app') || host.endsWith('.vercel.app')) {
      return '/api/v1';
    }
  }
  const u = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (u && /^https?:\/\//i.test(u)) {
    return u.replace(/\/$/, '');
  }
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
