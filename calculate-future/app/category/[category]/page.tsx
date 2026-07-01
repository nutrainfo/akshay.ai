import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getAllCategories, getCalculatorsByCategory } from '@/config/calculators.config';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE } from '@/config/site';

interface Props {
  params: { category: string };
}

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const calcs = getCalculatorsByCategory(params.category);
  if (!calcs.length) return {};
  const label = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  return buildMetadata({
    title: `${label} Calculators`,
    description: `Browse all ${label.toLowerCase()} calculators on ${SITE.name} — free, accurate, and built for Indian financial planning.`,
    path: `/category/${params.category}`,
  });
}

export default function CategoryPage({ params }: Props) {
  const calcs = getCalculatorsByCategory(params.category);
  if (!calcs.length) notFound();
  const label = params.category.charAt(0).toUpperCase() + params.category.slice(1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs
        schemaId="breadcrumb-schema-category"
        items={[
          { name: 'Home', href: '/', url: SITE.url },
          { name: 'Calculators', href: '/calculators', url: `${SITE.url}/calculators` },
          { name: label, href: `/category/${params.category}`, url: `${SITE.url}/category/${params.category}` },
        ]}
      />
      <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{label} Calculators</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calcs.map((calc) => (
          <Link
            key={calc.slug}
            href={`/${calc.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand hover:shadow-md"
          >
            <div className="font-semibold text-slate-800">{calc.name}</div>
            <p className="mt-1 text-sm text-slate-500">{calc.metaDescription.slice(0, 90)}…</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
