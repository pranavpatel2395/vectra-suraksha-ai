/**
 * Vectra Jansadak Suraksha AI - Alerts Center View
 * Centralized multi-source alert management & audio ping dispatcher
 */

import { simulationEngine } from '../data/simulationEngine.js';

export function renderAlertsCenterView(container) {
  const state = simulationEngine.state;
  let activeSeverity = 'all';

  function update() {
    const alerts = activeSeverity === 'all'
      ? state.alerts
      : activeSeverity === 'resolved'
      ? state.alerts.filter(a => a.acknowledged)
      : state.alerts.filter(a => a.severity.toLowerCase() === activeSeverity.toLowerCase() && !a.acknowledged);

    container.innerHTML = `
      <div class="space-y-4">
        <!-- Header -->
        <div class="bg-command-card border border-command-border p-4 rounded-lg flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 class="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <i data-lucide="bell" class="w-5 h-5 text-alert-red"></i>
              <span>City Traffic & Road Alert Center</span>
            </h1>
            <p class="text-xs text-slate-400 mt-0.5">
              Confidence-evaluated warning and critical alarm stream from CCTV cameras, ANPR, and Bus Mobile Sensing.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button id="btn-sound-alarm-test" class="px-3 py-1.5 rounded bg-red-600/20 border border-red-500 text-red-300 hover:bg-red-600 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5">
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              <span>Trigger Test Audio Alert</span>
            </button>
          </div>
        </div>

        <!-- Severity Filter Buttons -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          ${[
            { id: 'all', label: `All Alerts (${state.alerts.length})` },
            { id: 'critical', label: 'Critical' },
            { id: 'high', label: 'High' },
            { id: 'warning', label: 'Warning' },
            { id: 'resolved', label: 'Acknowledged / Resolved' }
          ].map(f => `
            <button data-sev-filter="${f.id}" class="px-3 py-1 rounded border text-xs font-mono font-medium transition-colors ${
              activeSeverity === f.id ? 'bg-blue-600/30 border-blue-400 text-cctv-blue font-bold' : 'bg-command-card border-command-border text-slate-400 hover:text-white'
            }">
              ${f.label}
            </button>
          `).join('')}
        </div>

        <!-- Alert Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          ${alerts.map(alt => {
            const isCritical = alt.severity === 'critical';
            const isHigh = alt.severity === 'high';
            const borderGlow = isCritical ? 'border-red-500/60 bg-red-950/20' : isHigh ? 'border-amber-500/60 bg-amber-950/20' : 'border-slate-800 bg-slate-950';
            const badgeBg = isCritical ? 'bg-red-950 text-red-400 border-red-800' : isHigh ? 'bg-amber-950 text-amber-400 border-amber-800' : 'bg-yellow-950 text-yellow-400 border-yellow-800';

            return `
              <div data-alert-card="${alt.id}" class="command-card p-4 flex flex-col justify-between hover:border-slate-500 transition-all ${borderGlow}">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${badgeBg}">
                      ${alt.severity}
                    </span>
                    <span class="text-[10px] font-mono text-slate-400">${alt.time}</span>
                  </div>

                  <h3 class="text-sm font-bold text-white mb-1">${alt.title}</h3>
                  <p class="text-xs text-slate-300 mb-3 bg-black/40 p-2 rounded border border-slate-800">
                    ${alt.desc}
                  </p>

                  <div class="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-400">
                    <div>Source: <b class="text-white">${alt.source}</b></div>
                    <div>Source Type: <b class="text-cctv-blue">${alt.sourceType}</b></div>
                    <div>Area: <b class="text-slate-300">${alt.areaName}</b></div>
                    <div>Status: <b class="${alt.acknowledged ? 'text-emerald-400' : 'text-amber-400'}">${alt.acknowledged ? 'Acknowledged' : 'Active'}</b></div>
                  </div>
                </div>

                <div class="pt-3 border-t border-command-border mt-3 flex items-center justify-between gap-2">
                  <button data-action-ack="${alt.id}" class="px-3 py-1 rounded ${alt.acknowledged ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white'} text-[11px] font-bold font-mono transition-colors">
                    ${alt.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                  </button>
                  <button data-action-inspect="${alt.id}" class="px-3 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-cctv-blue hover:text-white text-[11px] font-bold font-mono transition-colors">
                    Inspect
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons({ root: container });

    // Filter Buttons
    container.querySelectorAll('[data-sev-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSeverity = btn.getAttribute('data-sev-filter');
        update();
      });
    });

    // Sound Test
    container.querySelector('#btn-sound-alarm-test')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playAlert('critical');
      if (window.showToast) window.showToast('Tactical Alert Ping Triggered', 'critical');
    });

    // Acknowledge Action
    container.querySelectorAll('[data-action-ack]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-action-ack');
        const alt = state.alerts.find(a => a.id === id);
        if (alt) {
          alt.acknowledged = true;
          if (window.showToast) window.showToast(`Alert ${alt.id} Acknowledged`, 'info');
          update();
        }
      });
    });

    // Inspect Action
    container.querySelectorAll('[data-action-inspect]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-action-inspect');
        const alt = state.alerts.find(a => a.id === id);
        if (alt && window.openAlertModal) window.openAlertModal(alt);
      });
    });
  }

  update();
}
