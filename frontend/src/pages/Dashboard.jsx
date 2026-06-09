import { ScrollText, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import KPICard from '../components/KPICard';
import { TimelineChart, SeverityChart } from '../components/AlertsChart';
import LogsTable from '../components/LogsTable';
import AlertsPanel from '../components/AlertsPanel';

export default function Dashboard({ logs, alerts, chartData, backendStatus }) {
  const highRiskCount = alerts.filter(a => a.risk_level === 'High' || a.risk_level === 'Critical').length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Logs"
          value={logs.length}
          icon={ScrollText}
          color="brand"
          subtitle="Events ingested"
        />
        <KPICard
          title="Active Alerts"
          value={alerts.length}
          icon={ShieldAlert}
          color="orange"
          subtitle="Pending review"
        />
        <KPICard
          title="High Risk"
          value={highRiskCount}
          icon={AlertTriangle}
          color="red"
          subtitle="Immediate action"
        />
        <KPICard
          title="System Status"
          value={backendStatus === 'online' ? 'Healthy' : 'Degraded'}
          icon={CheckCircle2}
          color={backendStatus === 'online' ? 'green' : 'red'}
          subtitle="AI + SIEM engines"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TimelineChart data={chartData} />
        <SeverityChart logs={logs} />
      </div>

      {/* Logs + Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LogsTable logs={logs} />
        </div>
        <AlertsPanel alerts={alerts} />
      </div>
    </div>
  );
}
