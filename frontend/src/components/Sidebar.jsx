import { LayoutDashboard, ScrollText, ShieldAlert, Settings, Activity } from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: ScrollText,      label: 'Logs',      id: 'logs' },
  { icon: ShieldAlert,     label: 'Alerts',    id: 'alerts' },
  { icon: Settings,        label: 'Settings',  id: 'settings' },
];

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-surface-sidebar flex flex-col z-30">
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-white text-sm font-bold tracking-wide leading-none">SENTINEL</h1>
          <p className="text-slate-400 text-[10px] font-medium tracking-wider mt-0.5">SIEM PLATFORM</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, label, id }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                ${isActive
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-[10px] text-slate-500 font-mono">v1.0.0 · Django + Splunk</p>
      </div>
    </aside>
  );
}
