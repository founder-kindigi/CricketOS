import { NavLink } from 'react-router-dom';
import { Home, Plus, Users, BarChart3, MapPin, Cog } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/add', icon: Plus, label: 'Add', highlight: true },
  { to: '/players', icon: Users, label: 'Players' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
];

const secondaryNavItems = [
  { to: '/venues', icon: MapPin, label: 'Venues' },
  { to: '/presets', icon: Users, label: 'Teams' },
  { to: '/settings', icon: Cog, label: 'Settings' },
];

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 safe-area-pb z-50">
      <div className="flex items-center h-14 px-2">
        <div className="flex-1 flex justify-around">
          {navItems.map(({ to, icon: Icon, label, highlight }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'text-emerald-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${highlight ? 'bg-emerald-500 text-white' : ''}`}>
                <Icon size={20} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
        
        <div className="w-px h-8 bg-slate-700 mx-1" />
        
        <div className="flex items-center gap-1">
          {secondaryNavItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-2 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`
              }
            >
              <Icon size={16} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
