import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { useCricketStore } from '../store/cricketStore';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { settings, _hasHydrated } = useCricketStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(settings.theme);
    }
  }, [mounted, settings.theme]);

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-900 dark:bg-slate-900 light:bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-900 light:bg-slate-50 text-slate-100 dark:text-slate-100 light:text-slate-900 pb-20">
      <header className="sticky top-0 z-40 bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 backdrop-blur-lg border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-emerald-500 dark:text-emerald-400 light:text-emerald-600">CricketOS</h1>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
            Indoor Cricket Tracker
          </p>
        </div>
      </header>
      <main className="px-4 py-4">
        {children}
      </main>
      <Navbar />
    </div>
  );
}
