import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { GUIDES } from '@/config/guides.config';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'Financial Guides & Articles',
  description: 'In-depth, beginner-friendly guides on SIP, mutual funds, CAGR, and investment planning for India.',
  path: '/guides',
});

export default function GuidesIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        schemaId="breadcrumb-schema-guides"
        items={[
          { name: 'Home', href: '/', url: SITE.url },
          { name: 'Guides', href: '/guides', url: `${SITE.url}/guides` },
        ]}
      />
      <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Financial Guides</h1>
      <p className="mt-3 text-lg text-slate-600">
        Clear, beginner-friendly explanations to help you make better financial decisions.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand hover:shadow-md"
          >
            <div className="font-semibold text-slate-800">{guide.title}</div>
            <p className="mt-1 text-sm text-slate-500">{guide.metaDescription.slice(0, 100)}…</p>
            <div className="mt-3 text-xs text-slate-400">{guide.readingTimeMinutes} min read</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
