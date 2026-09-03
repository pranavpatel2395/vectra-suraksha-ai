/**
 * Vectra Jansadak Suraksha AI - Bus Fleet Mobile Road Sensing View
 * STRICT RULE: Zero raw bus video footage. Edge AI telemetry, routes, and road diagnostics only!
 */

import { mockBuses } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';

export function renderBusFleetView(container) {
  const state = simulationEngine.state;

  container.innerHTML = `
    <div class="space-y-4">
      <!-- Title & Fleet Header -->
      <div class="bg-command-card border border-command-border p-4 rounded-lg flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <i data-lucide="bus" class="w-5 h-5 text-bus-purple"></i>
            <span>Public Transit Mobile Sensing Fleet (37 Active Units)</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">
            Municipal buses functioning as mobile pavement & infrastructure diagnostic probes via onboard Edge AI computers.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded bg-purple-950/80 border border-purple-500/40 text-bus-purple font-mono text-xs">
            Edge Inference Active (Zero Video Transmission)
          </span>
        </div>
      </div>

      <!-- Fleet Overview Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="command-card p-3.5">
          <span class="text-[10px] font-mono text-slate-400 block uppercase">Active Sensing Fleet</span>
          <div class="text-2xl font-bold font-mono text-bus-purple my-1">37 / 42</div>
          <span class="text-[11px] text-emerald-400">● 100% Edge Health</span>
        </div>

        <div class="command-card p-3.5">
          <span class="text-[10px] font-mono text-slate-400 block uppercase">Road KM Scanned Today</span>
          <div class="text-2xl font-bold font-mono text-road-green my-1">${state.roadKmAnalyzed} km</div>
          <span class="text-[11px] text-slate-400">Continuous IMU + Optical Scan</span>
        </div>

        <div class="command-card p-3.5">
          <span class="text-[10px] font-mono text-slate-400 block uppercase">Potholes & Cracks Logged</span>
          <div class="text-2xl font-bold font-mono text-amber-400 my-1">26 Defects</div>
          <span class="text-[11px] text-amber-300">Geo-tagged with GPS accuracy</span>
        </div>

        <div class="command-card p-3.5">
          <span class="text-[10px] font-mono text-slate-400 block uppercase">Transit Safety Events</span>
          <div class="text-2xl font-bold font-mono text-cctv-blue my-1">9 Events</div>
          <span class="text-[11px] text-blue-300">Harsh Braking / Hazard Near-Miss</span>
        </div>
      </div>

      <!-- Bus Fleet Units Table & Cards -->
      <div class="command-card p-4 space-y-3">
        <div class="flex items-center justify-between border-b border-command-border pb-2">
          <h2 class="text-xs font-bold text-white uppercase tracking-wide">Connected Municipal Bus Sensing Units</h2>
          <span class="text-[10px] font-mono text-slate-400">Edge Hardware: Vectra Edge-Node TX-2</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          ${state.buses.map(bus => `
            <div class="p-3.5 rounded-lg bg-slate-950 border border-command-border hover:border-purple-500/60 transition-all flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-bus-purple animate-pulse"></span>
                    <span class="text-sm font-bold font-mono text-purple-300">${bus.id}</span>
                  </div>
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                    ${bus.status}
                  </span>
                </div>

                <div class="text-xs font-semibold text-white mb-2">${bus.route}</div>

                <div class="p-2 rounded bg-slate-900 border border-slate-800 space-y-1 text-[11px] font-mono text-slate-300 mb-2.5">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Road Scanned:</span>
                    <b class="text-road-green">${bus.kmAnalyzed} km</b>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Road Issues Flagged:</span>
                    <b class="text-amber-400">${bus.issuesDetected}</b>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Safety Events:</span>
                    <b class="text-purple-400">${bus.safetyEvents}</b>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Telemetry Speed:</span>
                    <b class="text-slate-200">${bus.speed}</b>
                  </div>
                </div>

                <div class="text-[10px] text-slate-400 font-mono truncate">
                  Last Segment: <b class="text-slate-300">${bus.lastSegment}</b>
                </div>
              </div>

              <div class="pt-2.5 border-t border-slate-800 mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Model State: <b class="text-emerald-400">Optimal</b></span>
                <span class="text-bus-purple">Geo-tagged</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons({ root: container });
}
