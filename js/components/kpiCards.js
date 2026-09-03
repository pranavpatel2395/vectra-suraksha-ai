/**
 * Vectra Jansadak Suraksha AI - Top KPI Summary Cards Component
 */

import { simulationEngine } from '../data/simulationEngine.js';

export function renderKpiCards(container) {
  const state = simulationEngine.state;

  const cards = [
    {
      id: 'kpi_cameras',
      title: 'ACTIVE CAMERAS',
      value: `${state.activeCameras} / ${state.totalCameras}`,
      subtext: 'Online',
      subtextColor: 'text-emerald-400',
      icon: 'video',
      iconBg: 'bg-sky-950/60 text-cctv-blue border border-sky-500/30',
      cardClass: 'command-card-glow-blue',
      onClick: () => window.navigateTo && window.navigateTo('cctv_cameras')
    },
    {
      id: 'kpi_buses',
      title: 'ACTIVE BUSES (SENSING)',
      value: `${state.activeBuses} / ${state.totalBuses}`,
      subtext: 'Online',
      subtextColor: 'text-emerald-400',
      icon: 'bus',
      iconBg: 'bg-purple-950/60 text-bus-purple border border-purple-500/30',
      cardClass: 'command-card-glow-purple',
      onClick: () => window.navigateTo && window.navigateTo('bus_fleet')
    },
    {
      id: 'kpi_vehicles',
      title: 'VEHICLES DETECTED TODAY',
      value: state.vehiclesDetectedToday.toLocaleString(),
      subtext: '+8.5%',
      subtextColor: 'text-emerald-400',
      icon: 'car',
      iconBg: 'bg-blue-950/60 text-blue-400 border border-blue-500/30',
      cardClass: '',
      onClick: () => window.navigateTo && window.navigateTo('anpr')
    },
    {
      id: 'kpi_density',
      title: 'TRAFFIC DENSITY',
      value: `${state.trafficDensity}%`,
      subtext: state.trafficDensity > 75 ? 'High' : 'Moderate',
      subtextColor: state.trafficDensity > 75 ? 'text-amber-400' : 'text-emerald-400',
      icon: 'users',
      iconBg: 'bg-amber-950/60 text-warn-yellow border border-amber-500/30',
      cardClass: '',
      onClick: () => window.navigateTo && window.navigateTo('traffic_analytics')
    },
    {
      id: 'kpi_alerts',
      title: 'ACTIVE ALERTS',
      value: String(state.activeAlertsCount).padStart(2, '0'),
      subtext: 'View All',
      subtextColor: 'text-alert-red font-semibold underline cursor-pointer',
      icon: 'alert-triangle',
      iconBg: 'bg-red-950/60 text-alert-red border border-red-500/30',
      cardClass: 'command-card-glow-red',
      onClick: () => window.navigateTo && window.navigateTo('alerts')
    },
    {
      id: 'kpi_health',
      title: 'ROAD HEALTH SCORE',
      value: `${state.roadHealthScore} / 100`,
      subtext: 'Needs Attention',
      subtextColor: 'text-warn-yellow',
      icon: 'shield',
      iconBg: 'bg-emerald-950/60 text-road-green border border-emerald-500/30',
      cardClass: 'command-card-glow-green',
      onClick: () => window.navigateTo && window.navigateTo('road_health')
    },
    {
      id: 'kpi_system',
      title: 'SYSTEM STATUS',
      value: state.systemStatus,
      subtext: 'All Systems Normal',
      subtextColor: 'text-slate-400',
      icon: 'shield-check',
      iconBg: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30',
      cardClass: '',
      onClick: () => window.navigateTo && window.navigateTo('settings')
    }
  ];

  container.innerHTML = `
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
      ${cards.map(c => `
        <div data-kpi-id="${c.id}" class="command-card ${c.cardClass} p-3 cursor-pointer hover:border-slate-600 transition-all flex flex-col justify-between">
          <div class="flex items-center justify-between gap-1 mb-2">
            <span class="text-[10px] font-bold tracking-wider text-slate-400 uppercase leading-tight truncate">${c.title}</span>
            <div class="p-1 rounded ${c.iconBg}">
              <i data-lucide="${c.icon}" class="w-3.5 h-3.5"></i>
            </div>
          </div>
          <div>
            <div class="text-lg lg:text-xl font-bold font-mono text-white tracking-tight leading-none truncate">${c.value}</div>
            <div class="text-[11px] mt-1.5 ${c.subtextColor} flex items-center gap-1 font-medium">
              ${c.subtext === 'Online' ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>' : ''}
              ${c.subtext === '+8.5%' ? '<i data-lucide="trending-up" class="w-3 h-3"></i>' : ''}
              <span>${c.subtext}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Icons
  if (window.lucide && typeof window.lucide.createIcons === "function") { try { window.lucide.createIcons(); } catch (e) {} }

  // Click handler
  cards.forEach(c => {
    const el = container.querySelector(`[data-kpi-id="${c.id}"]`);
    if (el && c.onClick) {
      el.addEventListener('click', c.onClick);
    }
  });
}
