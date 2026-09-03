/**
 * Vectra Jansadak Suraksha AI - ANPR & Vehicles Intelligence View
 * Edge AI License Plate Recognition, OCR Pipeline & Multi-Camera Vehicle Registry
 */

import { mockVehicles } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';

export function renderAnprVehiclesView(container) {
  const state = simulationEngine.state;
  const vehiclesList = Object.values(mockVehicles);

  container.innerHTML = `
    <div class="space-y-4">
      <!-- Title & Edge Pipeline Visualizer -->
      <div class="bg-command-card border border-command-border p-4 rounded-lg space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <i data-lucide="scan-line" class="w-5 h-5 text-cctv-blue"></i>
              <span>ANPR & Edge OCR Pipeline Architecture</span>
            </h1>
            <p class="text-xs text-slate-400 mt-0.5">
              Fixed CCTV video frame processing: multi-stage neural network recognition without reliance on external citizen databases.
            </p>
          </div>
          <span class="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs">
            Model: YOLOv8-Plate-OCR
          </span>
        </div>

        <!-- 8-Stage Pipeline Breadcrumb / Stepper -->
        <div class="p-3 bg-slate-950 rounded border border-command-border/80 overflow-x-auto">
          <div class="flex items-center gap-2 text-[10px] font-mono min-w-[760px] justify-between">
            <span class="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">1. CCTV Frame</span>
            <i data-lucide="arrow-right" class="w-3 h-3 text-slate-500 flex-shrink-0"></i>
            <span class="px-2 py-1 rounded bg-blue-950/80 border border-blue-800 text-cctv-blue">2. Vehicle Bbox</span>
            <i data-lucide="arrow-right" class="w-3 h-3 text-slate-500 flex-shrink-0"></i>
            <span class="px-2 py-1 rounded bg-blue-950/80 border border-blue-800 text-cctv-blue">3. Plate Detection</span>
            <i data-lucide="arrow-right" class="w-3 h-3 text-slate-500 flex-shrink-0"></i>
            <span class="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">4. Super-Res Enhance</span>
            <i data-lucide="arrow-right" class="w-3 h-3 text-slate-500 flex-shrink-0"></i>
            <span class="px-2 py-1 rounded bg-amber-950/80 border border-amber-800 text-warn-yellow">5. CRNN OCR</span>
            <i data-lucide="arrow-right" class="w-3 h-3 text-slate-500 flex-shrink-0"></i>
            <span class="px-2 py-1 rounded bg-emerald-950/80 border border-emerald-800 text-road-green">6. Confidence (96.2%)</span>
            <i data-lucide="arrow-right" class="w-3 h-3 text-slate-500 flex-shrink-0"></i>
            <span class="px-2 py-1 rounded bg-purple-950/80 border border-purple-800 text-bus-purple">7. Trajectory Reconstruct</span>
          </div>
        </div>
      </div>

      <!-- Vehicle Database & Search Registry -->
      <div class="command-card p-4 space-y-3.5">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <h2 class="text-sm font-bold text-white uppercase flex items-center gap-2">
            <i data-lucide="car" class="w-4 h-4 text-cctv-blue"></i>
            <span>Tracked Vehicles Database (Camera Evidence Only)</span>
          </h2>
          <div class="flex items-center gap-2">
            <input type="text" id="anpr-filter-input" placeholder="Filter plate number..." class="bg-slate-950 border border-command-border rounded px-3 py-1 text-xs text-white focus:outline-none focus:border-cctv-blue">
          </div>
        </div>

        <!-- Vehicles Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          ${vehiclesList.map(v => `
            <div data-vehicle-card="${v.plateNumber}" class="p-3.5 rounded-lg bg-slate-950 border border-command-border hover:border-cctv-blue cursor-pointer transition-all flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="px-2.5 py-1 rounded bg-slate-900 border border-yellow-500/40 text-yellow-300 font-mono font-bold text-xs">
                    ${v.plateNumber}
                  </span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${v.status === 'Blacklisted' ? 'bg-red-950 text-red-400 border border-red-800' : v.status === 'Speed Violation' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}">
                    ${v.status}
                  </span>
                </div>

                <div class="flex gap-3 mb-2.5">
                  <img src="${v.image}" alt="Car" class="w-24 aspect-[4/3] rounded object-cover border border-slate-800">
                  <div class="text-[11px] font-mono space-y-0.5 text-slate-300">
                    <div>Type: <b class="text-white">${v.type}</b></div>
                    <div>Color: <b class="text-white">${v.color}</b></div>
                    <div>OCR: <b class="text-emerald-400">${v.ocrConfidence}%</b></div>
                    <div>Matched Cams: <b class="text-cctv-blue">${v.stats.camerasMatched} Fixed Cameras</b></div>
                  </div>
                </div>

                <p class="text-[10px] text-slate-400 bg-slate-900/60 p-1.5 rounded border border-slate-800 line-clamp-2">
                  ${v.statusReason}
                </p>
              </div>

              <div class="pt-2.5 border-t border-slate-800 mt-2.5 flex items-center justify-between">
                <span class="text-[10px] text-slate-500 font-mono">Span: ${v.firstSeen} - ${v.lastSeen}</span>
                <button class="px-2.5 py-1 rounded bg-blue-600/30 hover:bg-blue-600 text-cctv-blue hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1">
                  <span>View Trajectory</span>
                  <i data-lucide="arrow-right" class="w-3 h-3"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons({ root: container });

  // Click handler to load vehicle in trajectory
  container.querySelectorAll('[data-vehicle-card]').forEach(card => {
    card.addEventListener('click', () => {
      const plate = card.getAttribute('data-vehicle-card');
      simulationEngine.setVehicle(plate);
      if (window.navigateTo) window.navigateTo('trajectories');
    });
  });
}
