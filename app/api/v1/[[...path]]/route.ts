import { NextRequest, NextResponse } from 'next/server';

/**
 * 浏览器只访问同源 /api/v1/*，由本 Route 在服务端转发到 Railway。
 * 比仅靠 next.config rewrites 更可控，并设置 maxDuration，减轻 Netlify「Application failed to respond」502。
 */
const UPSTREAM =
  process.env.RAILWAY_API_ORIGIN || 'https://ai-native-ip-production.up.railway.app';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';

const SKIP_HEADERS = new Set([
  'host',
  'connection',
  'keep-alive',
  'transfer-encoding',
  'content-length',
]);

function forwardHeaders(req: NextRequest): Headers {
  const out = new Headers();
  req.headers.forEach((value, key) => {
    if (SKIP_HEADERS.has(key.toLowerCase())) return;
    out.set(key, value);
  });
  return out;
}

async function proxy(req: NextRequest, segments: string[]): Promise<NextResponse> {
  const sub = segments.length ? segments.join('/') : '';
  const target = `${UPSTREAM.replace(/\/$/, '')}/api/v1/${sub}${req.nextUrl.search}`;

  const init: RequestInit & { duplex?: 'half' } = {
    method: req.method,
    headers: forwardHeaders(req),
    signal: AbortSignal.timeout(115_000),
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body;
    init.duplex = 'half';
  }

  try {
    const upstream = await fetch(target, init);
    const headers = new Headers();
    upstream.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'transfer-encoding') return;
      headers.set(key, value);
    });
    return new NextResponse(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    });
  } catch (e) {
    console.error('[api proxy] upstream fetch failed:', target, e);
    return NextResponse.json(
      {
        detail: 'Upstream unreachable. Check Railway deploy and RAILWAY_API_ORIGIN.',
        error: String(e),
      },
      { status: 502 }
    );
  }
}

type Ctx = { params: { path?: string[] } };

export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path ?? []);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path ?? []);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path ?? []);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path ?? []);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path ?? []);
}
export async function HEAD(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path ?? []);
}
export async function OPTIONS(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path ?? []);
}
