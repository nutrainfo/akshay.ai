import Link from 'next/link';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';

export interface BreadcrumbItem {
  name: string;
  href: string; // relative path, e.g. "/sip-calculator"
  url: string; // absolute URL for schema
}

export default function Breadcrumbs({ items, schemaId }: { items: BreadcrumbItem[]; schemaId: string }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === items.length - 1 ? (
                <span aria-current="page" className="font-medium text-slate-700">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-brand hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {/* Plain <script> (not next/script) so this is present in the initial
          server-rendered HTML immediately, not injected after hydration —
          required for reliable structured-data crawling. */}
      <script
        id={schemaId}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema(items.map(({ name, url }) => ({ name, url })))) }}
      />
    </>
  );
}
