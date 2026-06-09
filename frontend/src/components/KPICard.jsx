import { motion } from 'framer-motion';

export default function KPICard({ title, value, icon: Icon, color = 'brand', subtitle }) {
  const colorMap = {
    brand:  { bg: 'bg-brand-50',  text: 'text-brand-600',  icon: 'bg-brand-100  text-brand-600' },
    green:  { bg: 'bg-green-50',  text: 'text-green-700',  icon: 'bg-green-100  text-green-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'bg-orange-100 text-orange-600' },
    red:    { bg: 'bg-red-50',    text: 'text-red-700',    icon: 'bg-red-100    text-red-600' },
  };

  const c = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="bg-surface-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${c.text}`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg ${c.icon} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
