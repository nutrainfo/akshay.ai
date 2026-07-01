import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { CALCULATORS, getAllCategories, getCalculatorsByCategory } from '@/config/calculators.config';
import { GUIDES } from '@/config/guides.config';

export const metadata: Metadata = buildMetadata({
  title: 'Free Indian Financial Calculators & Guides',
  description:
    'Calculate Future offers free, accurate SIP, EMI, FD, PPF, NPS and other Indian financial calculators, plus in-depth guides to help you plan your money confidently.',
  path: '/',
});

export default function HomePage() {
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Plan Your Money with Confidence
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Free, accurate financial calculators and beginner-friendly guides — built for India, updated for 2026.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/calculators" className="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">
            Explore Calculators
          </Link>
          <Link href="/guides" className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:border-brand hover:text-brand">
            Read Guides
          </Link>
        </div>
      </section>

      {categories.map((category) => (
        <section key={category} className="mt-16">
          <h2 className="mb-6 text-2xl font-bold capitalize text-slate-900">{category} Calculators</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getCalculatorsByCategory(category).map((calc) => (
              <Link
                key={calc.slug}
                href={`/${calc.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand hover:shadow-md"
              >
                <div className="font-semibold text-slate-800">{calc.name}</div>
                <p className="mt-1 text-sm text-slate-500">{calc.introParagraph.slice(0, 90)}…</p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Latest Guides</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand hover:shadow-md"
            >
              <div className="font-semibold text-slate-800">{guide.title}</div>
              <p className="mt-1 text-sm text-slate-500">{guide.metaDescription.slice(0, 90)}…</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-16 text-center text-sm text-slate-400">{CALCULATORS.length}+ calculators and counting.</p>
    </div>
  );
}
