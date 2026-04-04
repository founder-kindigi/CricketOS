import { NavLink } from 'react-router-dom';
import { Home, Plus, Users, BarChart3, MapPin, Cog, Zap } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/add', icon: Plus, label: 'Add', highlight: true },
  { to: '/players', icon: Users, label: 'Players' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
];

const secondaryNavItems = [
  { to: '/quick', icon: Zap, label: 'Quick', highlight: true },
  { to: '/venues', icon: MapPin, label: 'Venues' },
  { to: '/settings', icon: Cog, label: 'Settings' },
];

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 backdrop-blur-lg border-t border-slate-800 dark:border-slate-800 light:border-slate-200 safe-area-pb">
      <div className="flex items-center h-16 px-1">
        <div className="flex-1 flex justify-around">
          {navItems.map(({ to, icon: Icon, label, highlight }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl transition-all touch-target ${
                  isActive
                    ? 'text-emerald-500 dark:text-emerald-400 light:text-emerald-600'
                    : 'text-slate-400 dark:text-slate-400 light:text-slate-500 active:bg-slate-800/50 dark:active:bg-slate-800/50 light:active:bg-slate-100/50'
                }`
              }
            >
              <div className={`flex items-center justify-center w-11 h-11 rounded-full transition-all ${
                highlight 
                  ? 'bg-emerald-500 dark:bg-emerald-500 light:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                  : ''
              }`}>
                <Icon size={22} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
        
        <div className="w-px h-8 bg-slate-700 dark:bg-slate-700 light:bg-slate-200 mx-1"></div>
        
        <div className="flex items-center gap-0.5">
          {secondaryNavItems.map(({ to, icon: Icon, label, highlight }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-all touch-target ${
                  isActive
                    ? 'text-emerald-500 dark:text-emerald-400 light:text-emerald-600 bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-50'
                    : 'text-slate-400 dark:text-slate-400 light:text-slate-500 active:bg-slate-800/50 dark:active:bg-slate-800/50 light:active:bg-slate-100/50'
                }`
              }
            >
              <Icon size={18} className={highlight ? 'text-amber-500 dark:text-amber-400 light:text-amber-500' : ''} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
