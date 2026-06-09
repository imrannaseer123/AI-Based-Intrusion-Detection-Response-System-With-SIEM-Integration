import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

const RISK_STYLE = {
  High:     { dot: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200' },
  Medium:   { dot: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  Low:      { dot: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
  Critical: { dot: 'bg-red-600',    text: 'text-red-800',    bg: 'bg-red-100',   border: 'border-red-300' },
};

export default function AlertsPanel({ alerts }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className="bg-surface-card rounded-xl shadow-card"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <h3 className="text-sm font-semibold text-slate-700">Active Alerts</h3>
          {alerts.length > 0 && (
            <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {alerts.length}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <ShieldAlert className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert, i) => {
            const s = RISK_STYLE[alert.risk_level] || RISK_STYLE.Medium;
            return (
              <div
                key={alert.id || i}
                className={`px-4 py-3 rounded-lg border ${s.border} ${s.bg} transition-colors hover:shadow-sm`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                    <span className={`text-xs font-semibold ${s.text} uppercase`}>{alert.risk_level} Risk</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{alert.alert_type}</p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono leading-relaxed line-clamp-2">{alert.message}</p>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
