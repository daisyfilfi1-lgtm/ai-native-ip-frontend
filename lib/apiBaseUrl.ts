/**
 * 浏览器端 Memory / IP 等 API 的 base URL。
 *
 * 默认使用同源相对路径 `/api/v1`，由 next.config.js 的 rewrites 在服务端转发到 Railway。
 * 这样浏览器不跨域，不依赖后端 CORS，也不经过 Netlify 边缘对 /api 的 200 代理（易 502）。
 *
 * 仅在需要浏览器直连后端时设置 NEXT_PUBLIC_API_URL 为完整 https URL（如本地调试连远程）。
 */
export function getBrowserApiBaseUrl(): string {
  const u = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (u && /^https?:\/\//i.test(u)) {
    return u.replace(/\/$/, '');
  }
  return '/api/v1';
}
