import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

// ── Django API on port 8001 (Splunk keeps 8000) ──
const API_BASE = 'http://localhost:8001/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [splunkStatus, setSplunkStatus] = useState('unknown');

  const fetchData = useCallback(async () => {
    try {
      const [logsRes, alertsRes, healthRes] = await Promise.all([
        axios.get(`${API_BASE}/logs/`),
        axios.get(`${API_BASE}/alerts/`),
        axios.get(`${API_BASE}/health/`),
      ]);

      const logsData = Array.isArray(logsRes.data) ? logsRes.data : [];
      const alertsData = Array.isArray(alertsRes.data) ? alertsRes.data : [];

      setLogs(logsData.slice(0, 50));
      setAlerts(alertsData.slice(0, 20));
      setBackendStatus('online');

      const splunk = healthRes.data?.splunk;
      setSplunkStatus(splunk?.status === 'connected' ? 'connected' : 'error');

      // Build chart point
      const now = new Date();
      setChartData(prev => {
        const point = {
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          events: logsData.length,
          anomalies: logsData.filter(l => l.severity !== 'info').length,
        };
        return [...prev, point].slice(-15);
      });
    } catch (err) {
      console.error('API fetch error:', err.message);
      setBackendStatus('offline');
      setSplunkStatus('unknown');
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="ml-[220px] flex-1 flex flex-col">
        <Navbar
          backendStatus={backendStatus}
          splunkStatus={splunkStatus}
          alertCount={alerts.length}
        />

        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              logs={logs}
              alerts={alerts}
              chartData={chartData}
              backendStatus={backendStatus}
            />
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">All Logs</h2>
              <LogsTableFull logs={logs} />
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">All Alerts</h2>
              <AlertsListFull alerts={alerts} />
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsPage splunkStatus={splunkStatus} backendStatus={backendStatus} />
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Inline sub-pages for Logs / Alerts / Settings tabs ──────────── */

import LogsTable from './components/LogsTable';
import AlertsPanel from './components/AlertsPanel';

function LogsTableFull({ logs }) {
  return <LogsTable logs={logs} />;
}

function AlertsListFull({ alerts }) {
  return <AlertsPanel alerts={alerts} />;
}

function SettingsPage({ splunkStatus, backendStatus }) {
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">System Settings</h2>
      <div className="bg-surface-card rounded-xl shadow-card p-5 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Django Backend</span>
          <span className={backendStatus === 'online' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {backendStatus === 'online' ? '● Online (port 8001)' : '● Offline'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Splunk HEC</span>
          <span className={splunkStatus === 'connected' ? 'text-green-600 font-medium' : 'text-slate-500 font-medium'}>
            {splunkStatus === 'connected' ? '● Connected (port 8088)' : '● Not Connected'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">AI Engine</span>
          <span className="text-green-600 font-medium">● Isolation Forest Loaded</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Rule Engine</span>
          <span className="text-green-600 font-medium">● 3 Rules Active</span>
        </div>
      </div>
    </div>
  );
}
