/**
 * Vectra Jansadak Suraksha AI - Left Sidebar Component
 */

import { simulationEngine } from '../data/simulationEngine.js';

export function renderSidebar(container, currentView = 'dashboard') {
  const state = simulationEngine.state;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'areas', label: 'Areas', icon: 'map-pin', badge: 'New', badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' },
    {
      id: 'monitoring',
      label: 'Live Monitoring',
      icon: 'video',
      children: [
        { id: 'cctv_cameras', label: 'CCTV Cameras', icon: 'camera' },
        { id: 'map_view', label: 'Map View', icon: 'map' }
      ]
    },
    { id: 'anpr', label: 'ANPR & Vehicles', icon: 'scan-line' },
    { id: 'trajectories', label: 'Trajectories', icon: 'git-commit' },
    { id: 'traffic_analytics', label: 'Traffic Analytics', icon: 'bar-chart-3' },
    { id: 'road_health', label: 'Road Health', icon: 'activity' },
    { id: 'bus_fleet', label: 'Bus Fleet (Sensing)', icon: 'bus' },
    { id: 'incidents', label: 'Incidents', icon: 'shield-alert' },
    { id: 'alerts', label: 'Alerts Center', icon: 'bell', badge: `${state.activeAlertsCount}`, badgeColor: 'bg-alert-red text-white' },
    { id: 'ai_assistant', label: 'AI Assistant', icon: 'bot', badge: 'New', badgeColor: 'bg-cyan-950 text-cyan-400 border border-cyan-500/30' },
    { id: 'reports', label: 'Reports', icon: 'file-text' },
    { id: 'settings', label: 'System Settings', icon: 'settings' }
  ];

  let monitoringExpanded = currentView === 'cctv_cameras' || currentView === 'map_view' || currentView === 'monitoring';

  container.innerHTML = `
    <!-- Top Branding -->
    <div class="p-4 border-b border-command-border">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/30 border border-blue-400/30">
          <i data-lucide="shield" class="w-5 h-5 text-white"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-sm font-bold text-white tracking-tight leading-tight truncate">Vectra Jansadak Suraksha AI</h1>
          <p class="text-[10px] text-slate-400 leading-tight mt-0.5">AI-powered city traffic, vehicle and road intelligence platform</p>
        </div>
      </div>
    </div>

    <!-- Navigation List -->
    <nav class="flex-1 px-2.5 py-3 overflow-y-auto space-y-1 text-xs">
      ${navItems.map(item => {
        if (item.children) {
          const isChildActive = item.children.some(c => c.id === currentView);
          return `
            <div>
              <button data-nav-group="${item.id}" class="w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
                isChildActive ? 'bg-command-card text-cctv-blue font-semibold' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }">
                <div class="flex items-center gap-2.5">
                  <i data-lucide="${item.icon}" class="w-4 h-4"></i>
                  <span>${item.label}</span>
                </div>
                <i data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform duration-200 ${monitoringExpanded ? 'rotate-180' : ''}"></i>
              </button>
              <div id="subnav-${item.id}" class="pl-6 pr-1 py-1 space-y-1 ${monitoringExpanded ? '' : 'hidden'}">
                ${item.children.map(child => `
                  <button data-nav-id="${child.id}" class="w-full flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-colors text-[11px] ${
                    currentView === child.id ? 'bg-blue-600/20 text-cctv-blue border-l-2 border-cctv-blue font-semibold' : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }">
                    <i data-lucide="${child.icon}" class="w-3.5 h-3.5"></i>
                    <span>${child.label}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          `;
        }

        const isActive = currentView === item.id;
        return `
          <button data-nav-id="${item.id}" class="w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
            isActive ? 'bg-blue-600/20 text-cctv-blue border-l-2 border-cctv-blue font-semibold' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }">
            <div class="flex items-center gap-2.5">
              <i data-lucide="${item.icon}" class="w-4 h-4"></i>
              <span>${item.label}</span>
            </div>
            ${item.badge ? `
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'}">
                ${item.badge}
              </span>
            ` : ''}
          </button>
        `;
      }).join('')}
    </nav>

    <!-- Bottom Officer Profile & Copyright -->
    <div class="p-3 border-t border-command-border bg-command-dark/95">
      <div class="flex items-center gap-3 p-2 rounded-lg bg-command-card border border-command-border/80">
        <div class="relative">
          <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <i data-lucide="user-check" class="w-4 h-4 text-cctv-blue"></i>
          </div>
          <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-command-card animate-pulse"></span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
            <span>Officer_01</span>
          </div>
          <div class="text-[10px] text-slate-400 truncate">Traffic Control Room</div>
          <div class="text-[10px] text-emerald-400 font-mono font-medium flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
          </div>
        </div>
      </div>
      <div class="mt-2.5 px-1 text-[10px] text-slate-500 text-center font-mono">
        © 2026 Vectra. Prototype build.
      </div>
    </div>
  `;

  // Re-initialize Lucide Icons
  if (window.lucide && typeof window.lucide.createIcons === "function") { try { window.lucide.createIcons(); } catch (e) {} }

  // Event handlers for navigation
  container.querySelectorAll('[data-nav-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = btn.getAttribute('data-nav-id');
      if (window.navigateTo) window.navigateTo(viewId);
    });
  });

  // Toggle subnavigation groups
  container.querySelectorAll('[data-nav-group]').forEach(btn => {
    btn.addEventListener('click', () => {
      const groupId = btn.getAttribute('data-nav-group');
      const subnav = container.querySelector(`#subnav-${groupId}`);
      if (subnav) {
        subnav.classList.toggle('hidden');
      }
    });
  });
}
