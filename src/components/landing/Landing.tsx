import { Hero } from './Hero';
import { useT } from '../../i18n';

export function Landing() {
  const t = useT();

  const steps = [
    { n: '1', title: t('how.step1.title'), text: t('how.step1.text') },
    { n: '2', title: t('how.step2.title'), text: t('how.step2.text') },
    { n: '3', title: t('how.step3.title'), text: t('how.step3.text') },
  ];

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-center text-2xl font-bold text-slate-900">{t('how.title')}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-lg font-bold text-white">
                {step.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
