import { Search, Bell, User, Wifi, WifiOff } from 'lucide-react';

export default function Navbar({ backendStatus, splunkStatus, alertCount }) {
  return (
    <header className="h-[60px] bg-surface-nav border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Left — Title */}
      <div>
        <h2 className="text-base font-semibold text-slate-800">Intrusion Detection Dashboard</h2>
      </div>

      {/* Center — Search */}
      <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-80 gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search logs, alerts..."
          className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
        />
      </div>

      {/* Right — Status + Alerts + User */}
      <div className="flex items-center gap-4">
        {/* Backend status */}
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {backendStatus === 'online' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-green-700">API Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-500" />
              <span className="text-red-600">API Offline</span>
            </>
          )}
        </div>

        {/* Splunk status */}
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {splunkStatus === 'connected' ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-brand-600" />
              <span className="text-brand-700">Splunk</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-slate-500">Splunk</span>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* Notification bell */}
        <button className="relative p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-500" />
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </button>

        {/* User */}
        <button className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center hover:bg-brand-200 transition-colors">
          <User className="w-4 h-4 text-brand-700" />
        </button>
      </div>
    </header>
  );
}
