import Link from 'next/link';
import { SITE } from '@/config/site';
import { CALCULATORS } from '@/config/calculators.config';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-500">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="font-semibold text-slate-800">{SITE.name}</div>
            <p className="mt-2">{SITE.description}</p>
          </div>
          <div>
            <div className="font-semibold text-slate-800">Popular Calculators</div>
            <ul className="mt-2 space-y-1">
              {CALCULATORS.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="hover:text-brand hover:underline">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-800">Explore</div>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/calculators" className="hover:text-brand hover:underline">
                  All Calculators
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-brand hover:underline">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-brand hover:underline">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-slate-100 pt-6 text-xs">
          © {new Date().getFullYear()} {SITE.name}. For educational purposes only — not financial advice.
        </p>
      </div>
    </footer>
  );
}
