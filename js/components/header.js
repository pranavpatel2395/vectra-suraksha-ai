/**
 * Vectra Jansadak Suraksha AI - Top Header Component
 */

import { mockAreas } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';

export function renderHeader(container) {
  const state = simulationEngine.state;

  function update() {
    const isSimRunning = simulationEngine.isRunning;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = '28 Aug 2026';

    container.innerHTML = `
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Hamburger Sidebar Toggle Button -->
        <button id="btn-sidebar-toggle" class="p-1.5 rounded-md bg-command-card border border-command-border text-slate-300 hover:text-white hover:border-cctv-blue transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-blue-900/30" title="Toggle Sidebar Navigation">
          <i data-lucide="menu" class="w-4 h-4"></i>
        </button>

        <!-- Area Selector Dropdown -->
        <div class="flex items-center gap-2">
          <label for="header-area-select" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Area:</label>
          <div class="relative">
            <select id="header-area-select" class="bg-command-card border border-command-border text-slate-200 text-xs font-medium rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:border-cctv-blue transition-colors cursor-pointer appearance-none">
              ${mockAreas.map(a => `<option value="${a.id}" ${state.selectedArea === a.id ? 'selected' : ''}>${a.name}</option>`).join('')}
            </select>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none"></i>
          </div>
        </div>

        <!-- Run Live Simulation Button -->
        <button id="btn-run-simulation" class="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 shadow-md ${
          isSimRunning 
            ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 hover:bg-amber-600/40' 
            : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/30'
        }">
          <i data-lucide="${isSimRunning ? 'pause' : 'play'}" class="w-3.5 h-3.5 ${isSimRunning ? 'animate-spin' : ''}"></i>
          <span>${isSimRunning ? 'Simulation Running' : 'Run Live Simulation'}</span>
          ${isSimRunning ? '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>' : ''}
        </button>
      </div>

      <!-- Right Header Status Items -->
      <div class="flex items-center gap-4 text-xs">
        <!-- Live Clock & Date -->
        <div class="text-right border-r border-command-border pr-4 hidden sm:block">
          <div id="live-clock" class="font-mono font-semibold text-slate-200">${timeStr}</div>
          <div class="text-[11px] text-slate-400">${dateStr}</div>
        </div>

        <!-- Weather -->
        <div class="flex items-center gap-1.5 text-slate-300 border-r border-command-border pr-4 hidden md:flex">
          <i data-lucide="cloud-sun" class="w-4 h-4 text-amber-400"></i>
          <span>32°C <span class="text-slate-400 text-[11px]">Cloudy</span></span>
        </div>

        <!-- Notification Bell -->
        <button id="btn-header-alerts" class="relative p-1.5 rounded-md bg-command-card border border-command-border text-slate-300 hover:text-white hover:border-slate-600 transition-colors" title="View Active Alerts">
          <i data-lucide="bell" class="w-4 h-4"></i>
          ${state.activeAlertsCount > 0 ? `
            <span class="absolute -top-1 -right-1 bg-alert-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              ${state.activeAlertsCount}
            </span>
          ` : ''}
        </button>

        <!-- Demo Mode Badge -->
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-medium shadow-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Demo Mode</span>
        </div>
      </div>
    `;

    // Re-initialize Lucide Icons
    if (window.lucide && typeof window.lucide.createIcons === "function") { try { window.lucide.createIcons(); } catch (e) {} }

    // Event Bindings
    const toggleBtn = container.querySelector('#btn-sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (typeof window.toggleSidebar === 'function') {
          window.toggleSidebar();
        }
      });
    }

    const areaSelect = container.querySelector('#header-area-select');
    if (areaSelect) {
      areaSelect.addEventListener('change', (e) => {
        simulationEngine.setArea(e.target.value);
      });
    }

    const simBtn = container.querySelector('#btn-run-simulation');
    if (simBtn) {
      simBtn.addEventListener('click', () => {
        simulationEngine.toggle();
      });
    }

    const alertsBtn = container.querySelector('#btn-header-alerts');
    if (alertsBtn) {
      alertsBtn.addEventListener('click', () => {
        if (window.navigateTo) window.navigateTo('alerts');
      });
    }
  }

  // Subscribe to simulation updates
  simulationEngine.subscribe(() => {
    update();
  });

  // Clock interval for seconds
  setInterval(() => {
    const clockEl = container.querySelector('#live-clock');
    if (clockEl) {
      clockEl.textContent = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  }, 1000);

  update();
}
