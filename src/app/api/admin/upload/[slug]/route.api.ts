import { NextResponse } from 'next/server';
import { adminSaveUpload } from '@/lib/admin-fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function prodGuard(): Response | null {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 });
  }
  return null;
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const guard = prodGuard();
  if (guard) return guard;
  const { slug } = await ctx.params;
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return new Response('Invalid form data', { status: 400 });
  }
  const file = form.get('file');
  if (!file || !(file instanceof File)) {
    return new Response('file field required', { status: 400 });
  }
  const buffer = new Uint8Array(await file.arrayBuffer());
  try {
    const rel = await adminSaveUpload(slug, file.name, buffer);
    return NextResponse.json({ path: rel });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(msg, { status: 500 });
  }
}
