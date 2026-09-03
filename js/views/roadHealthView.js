/**
 * Vectra Jansadak Suraksha AI - Road Health Intelligence Center
 */

import { mockRoadIssues, mockAreas } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';

export function renderRoadHealthView(container) {
  const state = simulationEngine.state;
  let activeCategory = 'all';

  function update() {
    const issues = activeCategory === 'all'
      ? state.roadIssues
      : state.roadIssues.filter(i => i.category === activeCategory);

    container.innerHTML = `
      <div class="space-y-4">
        <!-- Top Header Summary -->
        <div class="bg-command-card border border-command-border p-4 rounded-lg flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 class="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <i data-lucide="activity" class="w-5 h-5 text-road-green"></i>
              <span>City Road Health & Pavement Diagnostics</span>
            </h1>
            <p class="text-xs text-slate-400 mt-0.5">
              Continuous infrastructure sensing via public transit buses equipped with optical edge classifiers and vibration IMU sensors.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <span class="px-3.5 py-1.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-road-green font-mono text-xs font-bold">
              City Health Score: ${state.roadHealthScore} / 100 (Needs Attention)
            </span>
          </div>
        </div>

        <!-- 4 Top KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="command-card p-3.5">
            <span class="text-[10px] font-mono text-slate-400 block uppercase">Overall Health Score</span>
            <div class="text-2xl font-bold font-mono text-amber-400 my-1">${state.roadHealthScore} / 100</div>
            <span class="text-[11px] text-amber-300">Requires Municipal Action</span>
          </div>

          <div class="command-card p-3.5">
            <span class="text-[10px] font-mono text-slate-400 block uppercase">Road Issues Detected</span>
            <div class="text-2xl font-bold font-mono text-white my-1">26</div>
            <span class="text-[11px] text-emerald-400">Geo-tagged via Bus Fleet</span>
          </div>

          <div class="command-card p-3.5">
            <span class="text-[10px] font-mono text-slate-400 block uppercase">Critical Road Issues</span>
            <div class="text-2xl font-bold font-mono text-alert-red my-1">5</div>
            <span class="text-[11px] text-red-300">Severe cratering / median gap</span>
          </div>

          <div class="command-card p-3.5">
            <span class="text-[10px] font-mono text-slate-400 block uppercase">Areas Requiring Attention</span>
            <div class="text-2xl font-bold font-mono text-purple-400 my-1">8 Corridors</div>
            <span class="text-[11px] text-purple-300 font-mono">GT Road, Sector-12, Industrial</span>
          </div>
        </div>

        <!-- Category Filter Pills -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span class="text-slate-400 font-mono text-[11px]">Categories:</span>
          ${[
            { id: 'all', label: 'All Deficiencies' },
            { id: 'Potholes / Damaged Roads', label: 'Potholes / Damaged Roads' },
            { id: 'Waterlogging', label: 'Waterlogging' },
            { id: 'Missing / Damaged Dividers', label: 'Missing / Damaged Dividers' },
            { id: 'Zebra Crossing Deficiencies', label: 'Zebra Crossing Deficiencies' },
            { id: 'Traffic Sign Deficiencies', label: 'Traffic Sign Deficiencies' }
          ].map(cat => `
            <button data-cat-pill="${cat.id}" class="px-3 py-1 rounded-full border transition-colors whitespace-nowrap font-medium text-[11px] ${
              activeCategory === cat.id ? 'bg-blue-600/30 border-blue-400 text-cctv-blue font-bold' : 'bg-command-card border-command-border text-slate-400 hover:text-white'
            }">
              ${cat.label}
            </button>
          `).join('')}
        </div>

        <!-- Road Defect Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          ${issues.map(issue => {
            const isCritical = issue.severity === 'Critical';
            const isHigh = issue.severity === 'High';
            const badgeBg = isCritical ? 'bg-red-950 text-red-400 border-red-800' : isHigh ? 'bg-amber-950 text-amber-400 border-amber-800' : 'bg-blue-950 text-blue-400 border-blue-800';

            return `
              <div data-issue-card="${issue.id}" class="command-card p-4 flex flex-col justify-between hover:border-warn-yellow cursor-pointer transition-all">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-bold text-white text-sm font-sans flex items-center gap-1.5">
                      <i data-lucide="alert-triangle" class="w-4 h-4 text-warn-yellow"></i>
                      <span>${issue.type}</span>
                    </span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${badgeBg}">
                      ${issue.severity}
                    </span>
                  </div>

                  <p class="text-xs text-slate-300 mb-3 bg-slate-950/80 p-2 rounded border border-slate-800">
                    ${issue.description}
                  </p>

                  <div class="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-400">
                    <div>Area: <b class="text-white">${issue.areaName}</b></div>
                    <div>Confidence: <b class="text-emerald-400">${issue.confidence}%</b></div>
                    <div>Source: <b class="text-purple-400">${issue.detectedBy} (Bus)</b></div>
                    <div>Status: <b class="text-slate-200">${issue.status}</b></div>
                    <div class="col-span-2 text-[10px] text-slate-500 pt-1">Timestamp: ${issue.timestamp}</div>
                  </div>
                </div>

                <div class="pt-3 border-t border-command-border mt-3 flex items-center justify-between">
                  <span class="text-[10px] text-amber-300 font-mono">${issue.depthEst || 'Road hazard'}</span>
                  <button class="px-2.5 py-1 rounded bg-amber-600/20 hover:bg-amber-600 text-warn-yellow hover:text-slate-950 text-[11px] font-bold transition-colors">
                    Inspect & Action
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons({ root: container });

    // Category pills
    container.querySelectorAll('[data-cat-pill]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat-pill');
        update();
      });
    });

    // Issue cards
    issues.forEach(issue => {
      const card = container.querySelector(`[data-issue-card="${issue.id}"]`);
      card?.addEventListener('click', () => {
        if (window.openRoadIssueModal) window.openRoadIssueModal(issue);
      });
    });
  }

  update();
}
