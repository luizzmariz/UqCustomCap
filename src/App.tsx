import { useEffect } from 'react';
import { Landing } from './components/landing/Landing';
import { Customizer } from './components/customizer/Customizer';
import { Footer } from './components/landing/Footer';
import { useCustomizerStore } from './store/customizerStore';

export default function App() {
  const locale = useCustomizerStore((s) => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en';
  }, [locale]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Landing />
      <main>
        <Customizer />
      </main>
      <Footer />
    </div>
  );
}
