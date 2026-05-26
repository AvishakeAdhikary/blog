'use client';

import { useState } from 'react';

export function UploadZone({
  slug,
  onUploaded
}: {
  slug: string;
  onUploaded: (relativePath: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`/api/admin/upload/${encodeURIComponent(slug)}/`, {
          method: 'POST',
          body: fd
        });
        if (!res.ok) {
          setError(`upload failed: ${res.status}`);
          continue;
        }
        const data = (await res.json()) as { path: string };
        onUploaded(data.path);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border border-dashed border-border rounded p-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted">upload assets to ./assets/</span>
        <label className="border border-border hover:border-accent hover:text-accent rounded px-2 py-1 text-xs cursor-pointer transition-colors">
          choose files
          <input
            type="file"
            multiple
            disabled={busy}
            onChange={(e) => upload(e.target.files)}
            className="hidden"
          />
        </label>
      </div>
      {busy && <div className="text-muted text-xs mt-2">uploading…</div>}
      {error && <div className="text-red-400 text-xs mt-2">{error}</div>}
    </div>
  );
}
