/**
 * Vectra Jansadak Suraksha AI - Traffic Analytics Full View
 * Strict compliance: Volume, Density and Flow metrics ONLY (NO average speed, bottleneck detection, OD patterns, or route delay estimation)
 */

import { mockTrafficTrends, mockAreas } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';

export function renderTrafficAnalyticsView(container) {
  const state = simulationEngine.state;
  const trends = mockTrafficTrends;

  container.innerHTML = `
    <div class="space-y-4">
      <!-- Top Title -->
      <div class="bg-command-card border border-command-border p-4 rounded-lg flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <i data-lucide="bar-chart-3" class="w-5 h-5 text-warn-yellow"></i>
            <span>City-Wide Traffic Analytics & Vehicle Volume Intelligence</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">
            Continuous vehicle volume counting, corridor density monitoring, and vehicle type distribution.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded bg-amber-950/80 border border-amber-500/40 text-warn-yellow font-mono text-xs font-bold">
            City Density: ${state.trafficDensity}%
          </span>
        </div>
      </div>

      <!-- Key Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="command-card p-3.5">
          <span class="text-[10px] font-mono text-slate-400 block uppercase">Overall Traffic Density</span>
          <div class="text-2xl font-bold font-mono text-amber-400 my-1">${state.trafficDensity}%</div>
          <span class="text-[11px] text-amber-300">Peak corridor load active</span>
        </div>

        <div class="command-card p-3.5">
          <span class="text-[10px] font-mono text-slate-400 block uppercase">24-Hour Traffic Flow</span>
          <div class="text-2xl font-bold font-mono text-cctv-blue my-1">${state.vehiclesDetectedToday.toLocaleString()}</div>
          <span class="text-[11px] text-emerald-400 font-mono">+8.5% vs yesterday</span>
        </div>

        <div class="command-card p-3.5">
          <span class="text-[10px] font-mono text-slate-400 block uppercase">Active Optical Counters</span>
          <div class="text-2xl font-bold font-mono text-white my-1">48 / 52</div>
          <span class="text-[11px] text-emerald-400">Fixed camera AI streams</span>
        </div>

        <div class="command-card p-3.5">
          <span class="text-[10px] font-mono text-slate-400 block uppercase">Commercial Heavy Vehicles</span>
          <div class="text-2xl font-bold font-mono text-purple-400 my-1">628</div>
          <span class="text-[11px] text-slate-400 font-mono">5.0% of total flow</span>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <!-- 24-Hour Hourly Traffic Flow Curve (8 cols) -->
        <div class="lg:col-span-8 command-card p-4 flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3 border-b border-command-border pb-2">
            <h2 class="text-xs font-bold text-white uppercase tracking-wide">24-Hour Hourly Vehicle Volume Flow</h2>
            <span class="text-[10px] font-mono text-slate-400">Vehicles per Hour (Fixed CCTV Aggregated)</span>
          </div>

          <!-- Canvas Volume Bar Chart with explicit locked height -->
          <div class="relative w-full h-[250px] bg-slate-950 rounded border border-command-border p-2 overflow-hidden flex items-center justify-center">
            <canvas id="hourly-volume-canvas" class="w-full h-full block"></canvas>
          </div>
        </div>

        <!-- Vehicle Classification Bar Breakdown (4 cols) -->
        <div class="lg:col-span-4 command-card p-4 flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3 border-b border-command-border pb-2">
            <h2 class="text-xs font-bold text-white uppercase tracking-wide">Vehicle Classification Breakdown</h2>
            <span class="text-[10px] font-mono text-cctv-blue">AI Classification</span>
          </div>

          <div class="space-y-3 my-2 font-mono">
            ${trends.vehicleClasses.map(vc => `
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-300">${vc.label}</span>
                  <span class="font-bold text-white">${vc.percentage}% <span class="text-[10px] text-slate-500 font-normal">(${vc.count})</span></span>
                </div>
                <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div class="h-full rounded-full" style="width: ${vc.percentage}%; background-color: ${vc.color};"></div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="p-2.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono">
            Neural classification powered by multi-class edge vehicle detectors on roadside fixed feeds.
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons({ root: container });

  // Render Canvas Hourly Chart
  renderHourlyChart(container, trends.hourlyFlow);
}

function renderHourlyChart(container, data) {
  const canvas = container.querySelector('#hourly-volume-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function draw() {
    if (!canvas.isConnected) return;
    const parent = canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
    
    // Explicit 1:1 pixel buffer matching container dimensions exactly
    const w = (canvas.width = Math.max(300, Math.round(rect.width ? rect.width - 16 : 500)));
    const h = (canvas.height = Math.round(rect.height ? rect.height - 16 : 234));

    if (w <= 0 || h <= 0) return;

    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const maxVol = 2600;
    const barWidth = Math.max(8, (w - 60) / data.length);

    data.forEach((d, i) => {
      const x = 40 + i * barWidth;
      const barHeight = Math.max(4, (d.volume / maxVol) * (h - 50));
      const y = h - 30 - barHeight;

      // Bar Fill
      const grad = ctx.createLinearGradient(0, y, 0, h - 30);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(1, '#1e3a8a');

      ctx.fillStyle = grad;
      ctx.fillRect(x + 4, y, Math.max(4, barWidth - 8), barHeight);

      // Value on top
      ctx.fillStyle = '#94a3b8';
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${d.volume}`, x + barWidth / 2, y - 4);

      // Hour label
      ctx.fillStyle = '#64748b';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(d.hour, x + barWidth / 2, h - 14);
    });
  }

  // Draw once DOM layout reflow has settled
  requestAnimationFrame(draw);
  setTimeout(draw, 40);

  // ResizeObserver guarantees perfectly locked height during any viewport or layout change
  if (window.ResizeObserver && canvas.parentElement) {
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(draw);
    });
    ro.observe(canvas.parentElement);
  }
}
