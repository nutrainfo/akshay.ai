import Link from 'next/link';
import { SITE } from '@/config/site';

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">
          {SITE.name}
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-slate-600">
          <Link href="/calculators" className="hover:text-brand">
            Calculators
          </Link>
          <Link href="/guides" className="hover:text-brand">
            Guides
          </Link>
        </nav>
      </div>
    </header>
  );
}
