/**
 * Vectra Jansadak Suraksha AI - Incidents Management View
 */

import { mockIncidents } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';

export function renderIncidentsView(container) {
  const state = simulationEngine.state;
  let activeStatus = 'all';

  function update() {
    const incidents = activeStatus === 'all'
      ? state.incidents
      : state.incidents.filter(i => i.status.toLowerCase() === activeStatus.toLowerCase());

    container.innerHTML = `
      <div class="space-y-4">
        <!-- Header -->
        <div class="bg-command-card border border-command-border p-4 rounded-lg flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 class="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <i data-lucide="shield-alert" class="w-5 h-5 text-alert-red"></i>
              <span>City Traffic & Road Incident Management</span>
            </h1>
            <p class="text-xs text-slate-400 mt-0.5">
              Multi-source incident dispatching, investigation lifecycle, and inter-agency coordination.
            </p>
          </div>

          <!-- Status Filters -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400 font-mono">Filter Status:</span>
            <select id="incident-status-filter" class="bg-slate-950 border border-command-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cctv-blue">
              <option value="all" ${activeStatus === 'all' ? 'selected' : ''}>All Incidents (${state.incidents.length})</option>
              <option value="New" ${activeStatus === 'New' ? 'selected' : ''}>New / Unassigned</option>
              <option value="Under Review" ${activeStatus === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Resolved" ${activeStatus === 'Resolved' ? 'selected' : ''}>Resolved</option>
            </select>
          </div>
        </div>

        <!-- Incidents Table & Action Grid -->
        <div class="command-card p-4 space-y-3">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-mono">
              <thead class="bg-slate-950 text-slate-400 border-b border-command-border text-[11px] uppercase">
                <tr>
                  <th class="p-3">Incident ID</th>
                  <th class="p-3">Category & Type</th>
                  <th class="p-3">Source & Area</th>
                  <th class="p-3">Timestamp / GPS</th>
                  <th class="p-3">Severity</th>
                  <th class="p-3">Status</th>
                  <th class="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-command-border/60">
                ${incidents.map(inc => {
                  const isCritical = inc.severity === 'Critical';
                  const isHigh = inc.severity === 'High';
                  const sevBadge = isCritical ? 'bg-red-950 text-red-400 border-red-800' : isHigh ? 'bg-amber-950 text-amber-400 border-amber-800' : 'bg-blue-950 text-blue-400 border-blue-800';

                  const statusBadge = inc.status === 'New' ? 'bg-red-900/40 text-red-300 border-red-700' : inc.status === 'Under Review' ? 'bg-amber-900/40 text-amber-300 border-amber-700' : 'bg-emerald-900/40 text-emerald-300 border-emerald-700';

                  return `
                    <tr class="hover:bg-slate-900/60 transition-colors">
                      <td class="p-3 font-bold text-cctv-blue">${inc.id}</td>
                      <td class="p-3">
                        <div class="font-bold text-white text-xs font-sans">${inc.type}</div>
                        <div class="text-[10px] text-slate-400">${inc.category}</div>
                      </td>
                      <td class="p-3">
                        <div class="text-slate-200">${inc.source}</div>
                        <div class="text-[10px] text-slate-400">${inc.areaName}</div>
                      </td>
                      <td class="p-3">
                        <div class="text-slate-200">${inc.timestamp}</div>
                        <div class="text-[10px] text-slate-500">${inc.gps}</div>
                      </td>
                      <td class="p-3">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${sevBadge}">
                          ${inc.severity}
                        </span>
                      </td>
                      <td class="p-3">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge}">
                          ${inc.status}
                        </span>
                      </td>
                      <td class="p-3 text-right">
                        <button data-action-inc="${inc.id}" class="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-cctv-blue hover:text-white text-[10px] font-bold transition-colors">
                          Manage
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons({ root: container });

    const filterSelect = container.querySelector('#incident-status-filter');
    filterSelect?.addEventListener('change', (e) => {
      activeStatus = e.target.value;
      update();
    });

    container.querySelectorAll('[data-action-inc]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-action-inc');
        const inc = state.incidents.find(i => i.id === id);
        if (inc) {
          inc.status = inc.status === 'New' ? 'Under Review' : inc.status === 'Under Review' ? 'Resolved' : 'New';
          if (window.showToast) window.showToast(`Incident #${inc.id} status updated to ${inc.status}`, 'info');
          update();
        }
      });
    });
  }

  update();
}
