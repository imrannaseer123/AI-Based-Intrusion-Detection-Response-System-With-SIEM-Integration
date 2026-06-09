import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const SEVERITY_COLORS = {
  info: '#3b82f6',
  warning: '#f59e0b',
  high: '#ea580c',
  critical: '#dc2626',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-slate-700 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-mono">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export function TimelineChart({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-surface-card rounded-xl shadow-card p-5"
    >
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Events Over Time</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="events" name="Total Events" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
            <Line type="monotone" dataKey="anomalies" name="Anomalies" stroke="#dc2626" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#dc2626' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function SeverityChart({ logs }) {
  const counts = { info: 0, warning: 0, high: 0 };
  (logs || []).forEach(log => {
    const s = log.severity?.toLowerCase() || 'info';
    if (counts[s] !== undefined) counts[s]++;
    else counts.info++;
  });
  const data = [
    { name: 'Info',    count: counts.info,    fill: SEVERITY_COLORS.info },
    { name: 'Warning', count: counts.warning, fill: SEVERITY_COLORS.warning },
    { name: 'High',    count: counts.high,    fill: SEVERITY_COLORS.high },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="bg-surface-card rounded-xl shadow-card p-5"
    >
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Severity Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
