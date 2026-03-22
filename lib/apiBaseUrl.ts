/**
 * 浏览器端 Memory / IP 等 API 的 base URL（一般为 `/api/v1`）。
 *
 * - 在 **Netlify / Vercel** 生产域名上 **强制** 同源 `/api/v1`，忽略 Dashboard 里误配的
 *   `NEXT_PUBLIC_API_URL=https://...railway.app/...`（否则构建注入后仍会跨域）。
 * - 生产（Netlify）：`netlify.toml` 边缘代理 `/api/*` → Railway，不经 Next Serverless（避免 10s 超时 502）。
 * - 本地：`next.config.js` rewrites 转发到 `RAILWAY_API_ORIGIN` 或 `http://127.0.0.1:8000`。
 * - 本地开发：`NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1` 仍生效（非 netlify/vercel 域名）。
 */
export function getBrowserApiBaseUrl(): string {
  const u = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    // 可选：生产环境浏览器直连 Railway（绕过 Netlify 边缘 /api 代理），减轻 502、长轮询超时。
    // 本地开发勿设，以免误连线上。
    const direct = process.env.NEXT_PUBLIC_API_DIRECT_ORIGIN?.trim();
    if (!isLocal && direct && /^https:\/\//i.test(direct)) {
      return `${direct.replace(/\/$/, '')}/api/v1`;
    }

    if (host.endsWith('.netlify.app') || host.endsWith('.vercel.app')) {
      return '/api/v1';
    }
    // 自定义域名托管在 Netlify 时：若误配了指向 Railway 的 NEXT_PUBLIC_*，仍强制同源
    if (
      u &&
      /\.railway\.app/i.test(u) &&
      host !== 'localhost' &&
      host !== '127.0.0.1'
    ) {
      return '/api/v1';
    }
  }
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
