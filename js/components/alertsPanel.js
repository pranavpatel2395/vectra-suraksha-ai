/**
 * Vectra Jansadak Suraksha AI - Recent Alerts Panel Component
 */

import { simulationEngine } from '../data/simulationEngine.js';

export function renderAlertsPanel(container) {
  const state = simulationEngine.state;
  const recentAlerts = state.alerts.slice(0, 5);

  container.innerHTML = `
    <div class="command-card p-3.5 h-full flex flex-col justify-between">
      <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-3 border-b border-command-border/80 pb-2">
          <div class="flex items-center gap-2">
            <div class="p-1 rounded bg-red-950/80 text-alert-red border border-red-500/30">
              <i data-lucide="bell-ring" class="w-4 h-4"></i>
            </div>
            <div>
              <h2 class="text-xs font-bold text-white tracking-wide uppercase">Recent Alerts</h2>
              <p class="text-[10px] text-slate-400">Live multi-source event stream</p>
            </div>
          </div>
          <button id="btn-view-all-alerts" class="text-[11px] px-2 py-0.5 rounded bg-command-card border border-command-border text-alert-red hover:text-white hover:border-alert-red font-medium transition-colors">
            View All
          </button>
        </div>

        <!-- Alert Items List -->
        <div class="space-y-2 max-h-[305px] overflow-y-auto pr-0.5">
          ${recentAlerts.map(alt => {
            const isCritical = alt.severity === 'critical';
            const isHigh = alt.severity === 'high';
            const badgeBg = isCritical ? 'bg-red-950/80 text-red-400 border-red-800' : isHigh ? 'bg-amber-950/80 text-amber-400 border-amber-800' : 'bg-yellow-950/80 text-yellow-400 border-yellow-800';

            return `
              <div data-alert-id="${alt.id}" class="p-2 rounded bg-slate-950/90 border border-command-border/80 hover:border-slate-600 cursor-pointer transition-all flex items-start gap-2.5">
                <!-- Icon -->
                <div class="p-1.5 rounded ${isCritical ? 'bg-red-950 text-alert-red' : isHigh ? 'bg-amber-950 text-warn-yellow' : 'bg-slate-900 text-slate-300'} border border-slate-800 mt-0.5">
                  <i data-lucide="${alt.icon || 'alert-circle'}" class="w-3.5 h-3.5"></i>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold ${isCritical ? 'text-red-400' : 'text-slate-200'} truncate">${alt.title}</span>
                    <span class="text-[10px] font-mono text-slate-400 font-semibold">${alt.time}</span>
                  </div>
                  <div class="text-[11px] text-slate-400 truncate mt-0.5">${alt.desc}</div>
                  <div class="flex items-center gap-2 mt-1 font-mono text-[9px]">
                    <span class="px-1.5 py-0.2 rounded border ${badgeBg} uppercase font-bold">${alt.severity}</span>
                    <span class="text-slate-400">Source: <b class="text-slate-300">${alt.source}</b></span>
                    <span class="text-slate-500">• ${alt.areaName || 'City'}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="pt-2 border-t border-command-border text-[10px] text-slate-500 flex items-center justify-between">
        <span>Confidence-evaluated alert engine</span>
        <span class="text-cctv-blue cursor-pointer hover:underline" id="btn-sound-test">Test Audio Ping</span>
      </div>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === "function") { try { window.lucide.createIcons(); } catch (e) {} }

  container.querySelector('#btn-view-all-alerts')?.addEventListener('click', () => {
    if (window.navigateTo) window.navigateTo('alerts');
  });

  container.querySelector('#btn-sound-test')?.addEventListener('click', () => {
    if (window.soundEngine) {
      window.soundEngine.playAlert('critical');
      if (window.showToast) window.showToast('Test Control Room Audio Ping Played', 'info');
    }
  });

  // Alert item click
  container.querySelectorAll('[data-alert-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-alert-id');
      const alt = state.alerts.find(a => a.id === id);
      if (alt && window.openAlertModal) window.openAlertModal(alt);
    });
  });
}
