import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold text-slate-900">404 — Page Not Found</h1>
      <p className="mt-4 text-slate-600">The page you're looking for doesn't exist.</p>
      <Link href="/calculators" className="mt-6 inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">
        Browse All Calculators
      </Link>
    </div>
  );
}
