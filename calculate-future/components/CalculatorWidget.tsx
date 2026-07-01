'use client';

import { useState } from 'react';
import { getCalculatorBySlug } from '@/config/calculators.config';

/**
 * Generic, config-driven interactive calculator widget.
 * Works for every calculator in CALCULATORS without needing a
 * bespoke component per calculator — the fields[] and compute()
 * function from each config entry fully describe the UI and math.
 *
 * Only a plain string `slug` is accepted as a prop (not the config
 * object itself) because React Server Components cannot serialize
 * functions across the server→client boundary. The calculator's
 * compute() function is instead looked up client-side, inside this
 * component's own module scope, from the shared config import.
 */
export default function CalculatorWidget({ slug }: { slug: string }) {
  const calculator = getCalculatorBySlug(slug);
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries((calculator?.fields ?? []).map((f) => [f.id, f.defaultValue]))
  );

  if (!calculator) return null;

  const result = calculator.compute(values);

  const handleChange = (id: string, raw: string) => {
    const num = parseFloat(raw);
    setValues((prev) => ({ ...prev, [id]: isNaN(num) ? 0 : num }));
  };

  return (
    <div
      className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-8"
      data-testid="calculator-widget"
    >
      <div className="space-y-6">
        {calculator.fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
              <span>{field.label}</span>
              <span className="font-semibold text-brand">
                {field.unit === '₹' ? '₹' : ''}
                {values[field.id].toLocaleString('en-IN')}
                {field.unit && field.unit !== '₹' ? ` ${field.unit}` : ''}
              </span>
            </label>
            <input
              id={field.id}
              type="range"
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.id]}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="w-full accent-brand"
              aria-label={field.label}
            />
            <input
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.id]}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              aria-label={`${field.label} exact value`}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-center rounded-xl bg-slate-50 p-6">
        <div className="text-sm font-medium text-slate-500">{result.headline.label}</div>
        <div className="mt-1 text-4xl font-bold text-brand" data-testid="calculator-headline">
          {result.headline.value}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {result.items.map((item) => (
            <div key={item.label} className="rounded-lg bg-white p-3 text-center shadow-sm">
              <div className="text-lg font-semibold text-slate-800">{item.value}</div>
              <div className="text-xs text-slate-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
