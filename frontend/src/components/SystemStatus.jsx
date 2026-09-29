import React from 'react';
import { Activity, Server, Database, Cpu, Box } from 'lucide-react';

export default function SystemStatus({ statusData }) {
  const items = [
    {
      key: 'engine',
      title: 'ATLAS-Q ENGINE',
      status: statusData?.engine?.status || 'ONLINE',
      color: 'text-emerald-600',
      dot: 'bg-emerald-500',
      icon: Activity
    },
    {
      key: 'api',
      title: 'API GATEWAY',
      status: statusData?.api?.status || 'ONLINE',
      color: 'text-emerald-600',
      dot: 'bg-emerald-500',
      icon: Server
    },
    {
      key: 'data_pipeline',
      title: 'DATA PIPELINE',
      status: statusData?.data_pipeline?.status || 'DEMO MODE',
      color: 'text-sky-600',
      dot: 'bg-sky-500',
      icon: Database
    },
    {
      key: 'quantum_opt',
      title: 'QUANTUM OPTIMIZATION',
      status: statusData?.quantum_opt?.status || 'SIMULATION MODE',
      color: 'text-indigo-600',
      dot: 'bg-indigo-500',
      icon: Cpu
    },
    {
      key: 'model_status',
      title: 'MODEL STATUS',
      status: statusData?.model_status?.status || 'PROTOTYPE',
      color: 'text-amber-600',
      dot: 'bg-amber-500',
      icon: Box
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Operational System Telemetry
        </h3>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
          Render Cluster: prod-ap-south
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/70 rounded-lg p-2.5 transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight truncate">
                  {item.title}
                </span>
                <Icon className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className={`w-2 h-2 rounded-full ${item.dot} animate-pulse`}></span>
                <span className={`text-xs font-mono font-bold ${item.color}`}>
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
