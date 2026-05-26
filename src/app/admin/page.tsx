import { Container } from '@/components/Container';
import { AdminLoader } from './AdminLoader';

export const metadata = {
  title: 'admin',
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  if (process.env.NODE_ENV === 'production') {
    return (
      <Container size="md">
        <div className="py-16">
          <h1 className="text-3xl font-bold mb-3">admin</h1>
          <p className="text-muted">
            The admin editor is available only locally in dev mode. Run{' '}
            <code className="border border-border rounded px-1 py-0.5 bg-code-bg">npm run dev</code>{' '}
            and visit <code className="border border-border rounded px-1 py-0.5 bg-code-bg">/admin</code>.
          </p>
        </div>
      </Container>
    );
  }
  return <AdminLoader />;
}
