import { motion } from 'framer-motion';
import { Clock, Filter } from 'lucide-react';
import { useState } from 'react';

const SEVERITY_BADGE = {
  info:    'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  high:    'bg-red-50 text-red-700 border-red-200',
};

export default function LogsTable({ logs }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? logs
    : logs.filter(l => l.severity === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-surface-card rounded-xl shadow-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">Recent Logs</h3>
          <span className="text-xs text-slate-400 font-mono ml-1">({filtered.length})</span>
        </div>

        {/* Severity filter pills */}
        <div className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {['all', 'info', 'warning', 'high'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors capitalize
                ${filter === sev
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-50">
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 font-medium">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Activity</th>
              <th className="px-5 py-3">Severity</th>
              <th className="px-5 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-slate-400 text-sm">
                  No logs available
                </td>
              </tr>
            ) : (
              filtered.map((log, i) => {
                const sev = log.severity?.toLowerCase() || 'info';
                const isHighRisk = sev === 'high';
                return (
                  <tr
                    key={log.id || i}
                    className={`transition-colors hover:bg-slate-50 ${isHighRisk ? 'bg-red-50/40' : ''}`}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 whitespace-nowrap">{log.user}</td>
                    <td className="px-5 py-3 text-slate-600 font-mono text-xs max-w-md truncate">{log.activity}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium border ${SEVERITY_BADGE[sev] || SEVERITY_BADGE.info}`}>
                        {sev}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs whitespace-nowrap font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
