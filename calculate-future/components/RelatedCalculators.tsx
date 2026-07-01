import Link from 'next/link';
import type { CalculatorConfig } from '@/lib/types';

export default function RelatedCalculators({ calculators }: { calculators: CalculatorConfig[] }) {
  if (!calculators.length) return null;
  return (
    <aside aria-labelledby="related-calc-heading" className="mt-12">
      <h2 id="related-calc-heading" className="mb-4 text-2xl font-bold text-slate-900">
        Related Calculators
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {calculators.map((calc) => (
          <Link
            key={calc.slug}
            href={`/${calc.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand hover:shadow-md"
          >
            <div className="font-semibold text-slate-800">{calc.name}</div>
            <div className="mt-1 text-sm text-slate-500">{calc.introParagraph.slice(0, 70)}…</div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
