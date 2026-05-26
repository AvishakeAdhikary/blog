'use client';

import { useEffect, useState } from 'react';
import type { PostFrontmatter } from '@/lib/types';
import type { AdminPost } from '../AdminClient';
import { MarkdownPreview } from './MarkdownPreview';
import { UploadZone } from './UploadZone';

export function PostEditor({
  post,
  onSave
}: {
  post: AdminPost;
  onSave: (slug: string, frontmatter: PostFrontmatter, body: string) => Promise<boolean>;
}) {
  const [title, setTitle] = useState(post.frontmatter.title);
  const [description, setDescription] = useState(post.frontmatter.description || '');
  const [date, setDate] = useState(post.frontmatter.date);
  const [tags, setTags] = useState((post.frontmatter.tags || []).join(', '));
  const [body, setBody] = useState(post.body);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTitle(post.frontmatter.title);
    setDescription(post.frontmatter.description || '');
    setDate(post.frontmatter.date);
    setTags((post.frontmatter.tags || []).join(', '));
    setBody(post.body);
  }, [post]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const fm: PostFrontmatter = {
      title,
      description,
      date,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      cover: post.frontmatter.cover,
      draft: post.frontmatter.draft,
      updated: post.frontmatter.updated
    };
    const ok = await onSave(post.slug, fm, body);
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  };

  return (
    <section className="border border-border rounded p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block text-xs">
          <span className="text-muted block mb-1">title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-bg border border-border rounded px-2 py-1 text-sm focus:border-accent outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="text-muted block mb-1">date</span>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-bg border border-border rounded px-2 py-1 text-sm focus:border-accent outline-none"
          />
        </label>
        <label className="block text-xs sm:col-span-2">
          <span className="text-muted block mb-1">description</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-bg border border-border rounded px-2 py-1 text-sm focus:border-accent outline-none"
          />
        </label>
        <label className="block text-xs sm:col-span-2">
          <span className="text-muted block mb-1">tags (comma separated)</span>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-bg border border-border rounded px-2 py-1 text-sm focus:border-accent outline-none"
          />
        </label>
      </div>

      <UploadZone
        slug={post.slug}
        onUploaded={(rel) => {
          const insert = rel.match(/\.(png|jpe?g|gif|svg|webp)$/i)
            ? `\n\n![](${rel})\n`
            : `\n\n[asset](${rel})\n`;
          setBody((b) => b + insert);
        }}
      />

      <div className="flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setTab('write')}
          className={`border rounded px-2 py-1 transition-colors ${tab === 'write' ? 'border-accent text-accent' : 'border-border hover:border-accent'}`}
        >
          write
        </button>
        <button
          type="button"
          onClick={() => setTab('preview')}
          className={`border rounded px-2 py-1 transition-colors ${tab === 'preview' ? 'border-accent text-accent' : 'border-border hover:border-accent'}`}
        >
          preview
        </button>
      </div>

      {tab === 'write' ? (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={20}
          className="w-full bg-bg border border-border rounded px-3 py-2 text-sm font-mono focus:border-accent outline-none"
        />
      ) : (
        <div className="border border-border rounded p-3 min-h-[20rem]">
          <MarkdownPreview source={body} />
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="border border-accent text-accent hover:bg-accent hover:text-white disabled:opacity-50 rounded px-3 py-1 text-sm transition-colors"
        >
          {saving ? 'saving…' : 'save'}
        </button>
        {saved && <span className="text-xs text-accent">saved</span>}
        <a
          href={`/posts/${post.slug}/`}
          target="_blank"
          rel="noreferrer"
          className="border border-border hover:border-accent hover:text-accent rounded px-3 py-1 text-sm transition-colors"
        >
          view
        </a>
      </div>
    </section>
  );
}
