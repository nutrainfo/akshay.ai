import type { FAQItem } from '@/lib/types';
import { faqSchema, jsonLd } from '@/lib/schema';

export default function FAQSection({ faqs, schemaId }: { faqs: FAQItem[]; schemaId: string }) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className="mb-6 text-2xl font-bold text-slate-900">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {faqs.map((faq) => (
          <details key={faq.question} className="group p-5">
            <summary className="cursor-pointer list-none font-medium text-slate-800 marker:content-none">
              <span className="flex items-center justify-between">
                {faq.question}
                <span className="ml-4 shrink-0 text-brand transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
      <script id={schemaId} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(faqs)) }} />
    </section>
  );
}
