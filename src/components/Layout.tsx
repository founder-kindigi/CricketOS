import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { useCricketStore } from '../store/cricketStore';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { settings } = useCricketStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('light', 'dark');
    }
  }, [settings.theme, mounted]);

  const bgClass = settings.theme === 'light' 
    ? 'bg-slate-50 text-slate-900' 
    : 'bg-slate-900 text-slate-100';
  
  const headerBgClass = settings.theme === 'light'
    ? 'bg-slate-50/95 border-slate-200'
    : 'bg-slate-900/95 border-slate-800';

  return (
    <div className={`min-h-screen ${bgClass} pb-20`}>
      <header className={`sticky top-0 z-40 ${headerBgClass} backdrop-blur border-b`}>
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-emerald-500">CricketOS</h1>
          <p className={`text-xs ${settings.theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
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
