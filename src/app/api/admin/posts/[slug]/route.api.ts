import { NextResponse } from 'next/server';
import { adminDeletePost, adminReadPost, adminUpdatePost } from '@/lib/admin-fs';
import type { PostFrontmatter } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function prodGuard(): Response | null {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 });
  }
  return null;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const guard = prodGuard();
  if (guard) return guard;
  const { slug } = await ctx.params;
  const post = await adminReadPost(slug);
  if (!post) return new Response('Not found', { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const guard = prodGuard();
  if (guard) return guard;
  const { slug } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid body', { status: 400 });
  }
  const data = body as { frontmatter?: PostFrontmatter; body?: string };
  if (!data.frontmatter || typeof data.body !== 'string') {
    return new Response('frontmatter and body are required', { status: 400 });
  }
  try {
    const post = await adminUpdatePost(slug, { frontmatter: data.frontmatter, body: data.body });
    return NextResponse.json(post);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(msg, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const guard = prodGuard();
  if (guard) return guard;
  const { slug } = await ctx.params;
  try {
    await adminDeletePost(slug);
    return new Response(null, { status: 204 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(msg, { status: 500 });
  }
}
