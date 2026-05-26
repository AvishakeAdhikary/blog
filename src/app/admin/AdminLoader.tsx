'use client';

import dynamic from 'next/dynamic';

const AdminClient = dynamic(() => import('./AdminClient').then((m) => m.AdminClient), {
  ssr: false,
  loading: () => <div className="text-muted p-8 text-sm">loading admin…</div>
});

export function AdminLoader() {
  return <AdminClient />;
}
