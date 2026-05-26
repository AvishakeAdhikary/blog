import { NextResponse } from 'next/server';
import { adminCreatePost, adminListPosts } from '@/lib/admin-fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function prodGuard(): Response | null {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 });
  }
  return null;
}

export async function GET() {
  const guard = prodGuard();
  if (guard) return guard;
  const posts = await adminListPosts();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const guard = prodGuard();
  if (guard) return guard;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid body', { status: 400 });
  }
  const data = body as {
    title?: string;
    description?: string;
    date?: string;
    tags?: string[];
    body?: string;
  };
  if (!data.title || typeof data.title !== 'string') {
    return new Response('title is required', { status: 400 });
  }
  try {
    const post = await adminCreatePost({
      title: data.title,
      description: data.description,
      date: data.date,
      tags: data.tags,
      body: data.body
    });
    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'failed';
    return new Response(msg, { status: 500 });
  }
}
