/**
 * Vectra Jansadak Suraksha AI - Traffic Analytics (City Wide) Component
 * Strict compliance: Volume, Density and Flow metrics ONLY (NO average speed, bottleneck detection, OD patterns, or route delay estimation)
 */

import { mockTrafficTrends } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';

export function renderTrafficAnalytics(container) {
  const state = simulationEngine.state;
  const trends = mockTrafficTrends;

  container.innerHTML = `
    <div class="command-card p-3.5 h-full flex flex-col justify-between">
      <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-3 border-b border-command-border/80 pb-2">
          <div class="flex items-center gap-2">
            <div class="p-1 rounded bg-amber-950/80 text-warn-yellow border border-amber-500/30">
              <i data-lucide="bar-chart-3" class="w-4 h-4"></i>
            </div>
            <div>
              <h2 class="text-xs font-bold text-white tracking-wide uppercase">Traffic Analytics (City Wide)</h2>
              <p class="text-[10px] text-slate-400">Real-time volume distribution & density monitoring</p>
            </div>
          </div>
          <button id="btn-open-full-analytics" class="text-[11px] px-2 py-0.5 rounded bg-command-card border border-command-border text-cctv-blue hover:text-white hover:border-cctv-blue font-medium transition-colors">
            Open Full Analytics
          </button>
        </div>

        <!-- 3 Key Metric Blocks with Sparklines -->
        <div class="grid grid-cols-3 gap-2 mb-3">
          <!-- 1. Traffic Density -->
          <div class="p-2.5 rounded bg-slate-950 border border-command-border/80 flex flex-col justify-between">
            <span class="text-[10px] text-slate-400 font-mono">Traffic Density</span>
            <div class="text-lg font-bold font-mono text-amber-400 my-1">${state.trafficDensity}%</div>
            <!-- Sparkline Canvas -->
            <canvas id="sparkline-density" class="w-full h-7 block"></canvas>
          </div>

          <!-- 2. Traffic Flow -->
          <div class="p-2.5 rounded bg-slate-950 border border-command-border/80 flex flex-col justify-between">
            <span class="text-[10px] text-slate-400 font-mono">Traffic Flow</span>
            <div class="text-base font-bold font-mono text-cctv-blue my-1 truncate">${state.vehiclesDetectedToday.toLocaleString()} <span class="text-[9px] text-slate-400">veh/day</span></div>
            <!-- Sparkline Canvas -->
            <canvas id="sparkline-flow" class="w-full h-7 block"></canvas>
          </div>

          <!-- 3. Vehicle Count -->
          <div class="p-2.5 rounded bg-slate-950 border border-command-border/80 flex flex-col justify-between">
            <span class="text-[10px] text-slate-400 font-mono">Vehicle Count</span>
            <div class="text-base font-bold font-mono text-emerald-400 my-1 truncate">${state.vehiclesDetectedToday.toLocaleString()} <span class="text-[9px] text-slate-400">today</span></div>
            <!-- Sparkline Canvas -->
            <canvas id="sparkline-count" class="w-full h-7 block"></canvas>
          </div>
        </div>

        <!-- Vehicle Classification Distribution Breakdown -->
        <div class="space-y-1.5 pt-1">
          <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>Vehicle Classification</span>
            <span>Count Breakdown</span>
          </div>
          ${trends.vehicleClasses.map(vc => `
            <div class="space-y-0.5">
              <div class="flex items-center justify-between text-[11px] font-mono">
                <span class="text-slate-300">${vc.label}</span>
                <span class="font-bold text-slate-200">${vc.percentage}% <span class="text-[10px] text-slate-500 font-normal">(${vc.count.toLocaleString()})</span></span>
              </div>
              <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width: ${vc.percentage}%; background-color: ${vc.color};"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="pt-2 border-t border-command-border/80 text-[10px] text-slate-500 flex items-center justify-between">
        <span>Updated: Real-time ANPR & Video Counter</span>
        <span class="text-emerald-400 font-mono">● Active Sync</span>
      </div>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    try { window.lucide.createIcons(); } catch (e) {}
  }

  container.querySelector('#btn-open-full-analytics')?.addEventListener('click', () => {
    if (window.navigateTo) window.navigateTo('traffic_analytics');
  });

  drawSparklines(container);
}

function drawSparklines(container) {
  const densityCanvas = container.querySelector('#sparkline-density');
  const flowCanvas = container.querySelector('#sparkline-flow');
  const countCanvas = container.querySelector('#sparkline-count');

  const drawLine = (canvas, color, data, fillColor) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = (canvas.width = canvas.clientWidth || 80);
    const h = (canvas.height = canvas.clientHeight || 28);

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    data.forEach((val, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((val - min) / range) * (h - 4) - 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill gradient
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
  };

  drawLine(densityCanvas, '#f59e0b', [45, 52, 60, 72, 84, 76, 78, 82, 76], 'rgba(245, 158, 11, 0.15)');
  drawLine(flowCanvas, '#38bdf8', [320, 480, 890, 1420, 1850, 2100, 1940, 2190], 'rgba(56, 189, 248, 0.15)');
  drawLine(countCanvas, '#22c55e', [1200, 2500, 4800, 7200, 9400, 11200, 12564], 'rgba(34, 197, 94, 0.15)');
}
