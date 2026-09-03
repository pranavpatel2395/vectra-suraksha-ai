/**
 * Vectra Jansadak Suraksha AI - Areas Architecture View
 * Mapped data sources (CCTV, Bus Sensing, Road Intelligence, Health Score) per city zone
 */

import { mockAreas, mockCameras, mockBuses, mockRoadIssues } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';

export function renderAreasView(container) {
  const state = simulationEngine.state;
  const filteredAreas = mockAreas.filter(a => a.id !== 'all');

  container.innerHTML = `
    <div class="space-y-4">
      <!-- Top Title & Overview -->
      <div class="flex items-center justify-between bg-command-card border border-command-border p-4 rounded-lg">
        <div>
          <h1 class="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <i data-lucide="map-pin" class="w-5 h-5 text-cctv-blue"></i>
            <span>City Areas & Mapped Data Architecture</span>
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            Hierarchical source mapping: Each city area aggregates assigned fixed CCTV cameras, mobile bus sensing units, and localized road health diagnostics.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded bg-blue-950/80 border border-blue-500/40 text-cctv-blue font-mono text-xs">
            ${filteredAreas.length} Monitored Zones
          </span>
        </div>
      </div>

      <!-- Area Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        ${filteredAreas.map(area => {
          const assignedCams = state.cameras.filter(c => c.area === area.id);
          const assignedBuses = state.buses.filter(b => b.area === area.id);
          const assignedIssues = state.roadIssues.filter(i => i.area === area.id);
          const isSelected = state.selectedArea === area.id;

          const healthColor = area.healthScore >= 80 ? 'text-road-green' : area.healthScore >= 65 ? 'text-amber-400' : 'text-red-400';
          const healthBg = area.healthScore >= 80 ? 'bg-emerald-950/60 border-emerald-500/40' : area.healthScore >= 65 ? 'bg-amber-950/60 border-amber-500/40' : 'bg-red-950/60 border-red-500/40';

          return `
            <div data-area-card="${area.id}" class="command-card p-4 flex flex-col justify-between hover:border-cctv-blue cursor-pointer transition-all ${isSelected ? 'border-cctv-blue ring-1 ring-cctv-blue/50' : ''}">
              <div>
                <!-- Area Header -->
                <div class="flex items-center justify-between mb-3 border-b border-command-border pb-2">
                  <div>
                    <h2 class="text-sm font-bold text-white tracking-wide">${area.name}</h2>
                    <span class="text-[10px] font-mono text-slate-400">Zone ID: ${area.id.toUpperCase()}</span>
                  </div>
                  <div class="px-2.5 py-1 rounded font-mono text-xs font-bold border ${healthBg} ${healthColor}">
                    ${area.healthScore}/100
                  </div>
                </div>

                <!-- Source 1: Fixed CCTV Cameras -->
                <div class="mb-3 space-y-1">
                  <div class="flex items-center justify-between text-[11px] font-mono text-cctv-blue">
                    <span class="flex items-center gap-1"><i data-lucide="video" class="w-3.5 h-3.5"></i> Fixed CCTV:</span>
                    <span class="text-slate-300 font-bold">${assignedCams.length} Units</span>
                  </div>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    ${assignedCams.map(c => `
                      <span class="px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-[10px] font-mono text-sky-300">
                        ${c.id}
                      </span>
                    `).join('') || '<span class="text-[10px] text-slate-500">Auto-routed</span>'}
                  </div>
                </div>

                <!-- Source 2: Mobile Bus Sensing -->
                <div class="mb-3 space-y-1">
                  <div class="flex items-center justify-between text-[11px] font-mono text-bus-purple">
                    <span class="flex items-center gap-1"><i data-lucide="bus" class="w-3.5 h-3.5"></i> Mobile Bus Sensing:</span>
                    <span class="text-slate-300 font-bold">${assignedBuses.length} Units</span>
                  </div>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    ${assignedBuses.map(b => `
                      <span class="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-[10px] font-mono text-purple-300">
                        ${b.id}
                      </span>
                    `).join('') || '<span class="text-[10px] text-slate-500">Patrol route</span>'}
                  </div>
                </div>

                <!-- Source 3: Road Intelligence Flagged -->
                <div class="space-y-1">
                  <div class="flex items-center justify-between text-[11px] font-mono text-warn-yellow">
                    <span class="flex items-center gap-1"><i data-lucide="activity" class="w-3.5 h-3.5"></i> Road Issues:</span>
                    <span class="text-slate-300 font-bold">${assignedIssues.length} Detected</span>
                  </div>
                  <div class="text-[10px] text-slate-400 space-y-0.5">
                    ${assignedIssues.slice(0, 2).map(i => `
                      <div class="truncate flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full ${i.severity === 'Critical' ? 'bg-red-400' : 'bg-amber-400'}"></span>
                        <span>${i.type} (${i.detectedBy})</span>
                      </div>
                    `).join('') || '<div class="text-emerald-400">● No active road defects</div>'}
                  </div>
                </div>
              </div>

              <!-- Footer Button -->
              <div class="pt-3 border-t border-command-border mt-3 flex items-center justify-between">
                <span class="text-[10px] text-slate-400 font-mono">Density: <b class="text-white">${area.trafficDensity}%</b></span>
                <button class="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-cctv-blue hover:text-white text-[11px] font-semibold transition-colors">
                  Filter Dashboard
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === "function") { try { window.lucide.createIcons(); } catch (e) {} }

  // Bind Card Click to Filter Area
  container.querySelectorAll('[data-area-card]').forEach(card => {
    card.addEventListener('click', () => {
      const areaId = card.getAttribute('data-area-card');
      simulationEngine.setArea(areaId);
      if (window.showToast) window.showToast(`Dashboard filtered to ${areaId.toUpperCase()}`, 'info');
      if (window.navigateTo) window.navigateTo('dashboard');
    });
  });
}
