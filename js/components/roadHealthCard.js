/**
 * Vectra Jansadak Suraksha AI - Mobile Road Sensing & Road Health Summary Component
 * STRICT RULE: No bus video footage displayed. Structured edge AI results & telemetry only!
 */

import { simulationEngine } from '../data/simulationEngine.js';

export function renderRoadHealthCard(container) {
  const state = simulationEngine.state;

  container.innerHTML = `
    <div class="command-card p-3.5 h-full flex flex-col justify-between">
      <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-3 border-b border-command-border/80 pb-2">
          <div class="flex items-center gap-2">
            <div class="p-1 rounded bg-purple-950/80 text-bus-purple border border-purple-500/30">
              <i data-lucide="bus" class="w-4 h-4"></i>
            </div>
            <div>
              <h2 class="text-xs font-bold text-white tracking-wide uppercase">Mobile Road Sensing (Today)</h2>
              <p class="text-[10px] text-slate-400">Edge AI road defect detection via municipal transit buses</p>
            </div>
          </div>
          <button id="btn-view-bus-sensing-details" class="text-[11px] px-2 py-0.5 rounded bg-command-card border border-command-border text-bus-purple hover:text-white hover:border-bus-purple font-medium transition-colors">
            View Details
          </button>
        </div>

        <!-- 4 Key Mobile Sensing Metrics -->
        <div class="grid grid-cols-2 gap-2 mb-3">
          <!-- Buses Processed -->
          <div class="p-2.5 rounded bg-slate-950 border border-command-border/80">
            <span class="text-[10px] text-slate-400 font-mono block">Buses Processed</span>
            <div class="text-xl font-bold font-mono text-white mt-1">${state.busesProcessed} <span class="text-xs text-slate-500 font-normal">/ 42</span></div>
            <span class="text-[10px] text-emerald-400 font-medium">● 100% Edge Units Synced</span>
          </div>

          <!-- Road KM Analyzed -->
          <div class="p-2.5 rounded bg-slate-950 border border-command-border/80">
            <span class="text-[10px] text-slate-400 font-mono block">Road KM Analyzed</span>
            <div class="text-xl font-bold font-mono text-road-green mt-1">${state.roadKmAnalyzed} <span class="text-xs text-slate-400 font-normal">km</span></div>
            <span class="text-[10px] text-slate-400">Pavement scanned today</span>
          </div>

          <!-- Road Issues Detected -->
          <div class="p-2.5 rounded bg-slate-950 border border-command-border/80">
            <span class="text-[10px] text-slate-400 font-mono block">Road Issues Detected</span>
            <div class="text-xl font-bold font-mono text-amber-400 mt-1">${state.roadIssuesDetected}</div>
            <span class="text-[10px] text-amber-300 font-medium">5 Critical Potholes</span>
          </div>

          <!-- Safety Events -->
          <div class="p-2.5 rounded bg-slate-950 border border-command-border/80">
            <span class="text-[10px] text-slate-400 font-mono block">Safety Events</span>
            <div class="text-xl font-bold font-mono text-bus-purple mt-1">${state.safetyEvents}</div>
            <span class="text-[10px] text-purple-300">Geo-tagged in Transit</span>
          </div>
        </div>

        <!-- Edge Processing Neural Modules Status -->
        <div class="p-2 rounded bg-purple-950/20 border border-purple-900/40 text-[10px] font-mono text-slate-300 space-y-1">
          <div class="text-purple-300 font-bold flex items-center gap-1.5">
            <i data-lucide="cpu" class="w-3.5 h-3.5"></i>
            <span>Active Edge AI Models on Fleet:</span>
          </div>
          <div class="grid grid-cols-2 gap-1 text-[9px] text-slate-400">
            <span>• PotholeNet-v4 (Optical)</span>
            <span>• HydroPool (Waterlogging)</span>
            <span>• BarrierGuard (Dividers)</span>
            <span>• SignAudit (Traffic Signs)</span>
          </div>
        </div>
      </div>

      <div class="pt-2 border-t border-command-border text-[10px] text-slate-500 flex items-center justify-between">
        <span>Raw video processed on-device • Metadata only transmitted</span>
        <span class="text-emerald-400 font-mono">🔒 Secure Edge</span>
      </div>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === "function") { try { window.lucide.createIcons(); } catch (e) {} }

  container.querySelector('#btn-view-bus-sensing-details')?.addEventListener('click', () => {
    if (window.navigateTo) window.navigateTo('bus_fleet');
  });
}
