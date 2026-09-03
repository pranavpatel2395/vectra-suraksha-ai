/**
 * Vectra Jansadak Suraksha AI - System Settings & Security Configuration View
 */

import { simulationEngine } from '../data/simulationEngine.js';

export function renderSettingsView(container) {
  const state = simulationEngine.state;

  container.innerHTML = `
    <div class="space-y-4 max-w-6xl mx-auto">
      <!-- Title -->
      <div class="bg-command-card border border-command-border p-4 rounded-lg flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <i data-lucide="settings" class="w-5 h-5 text-cctv-blue"></i>
            <span>System Settings, Edge Thresholds & Privacy Controls</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">
            Command center configuration, neural network confidence limits, role-based access, and data retention policies.
          </p>
        </div>
        <button id="btn-save-settings" class="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-colors flex items-center gap-1.5">
          <i data-lucide="save" class="w-3.5 h-3.5"></i>
          <span>Save Settings</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        <!-- Left: Neural Net Confidence Thresholds & Alert Rules (6 cols) -->
        <div class="lg:col-span-6 space-y-4">
          <!-- 1. AI Edge Confidence Thresholds -->
          <div class="command-card p-4 space-y-3">
            <h2 class="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2 border-b border-command-border pb-2">
              <i data-lucide="sliders" class="w-4 h-4 text-cctv-blue"></i>
              <span>Edge AI Detection Confidence Limits</span>
            </h2>

            <div class="space-y-3 text-xs font-mono">
              <div>
                <div class="flex justify-between text-slate-300 mb-1">
                  <span>ANPR License Plate OCR Threshold:</span>
                  <b class="text-cctv-blue">90%</b>
                </div>
                <input type="range" min="70" max="99" value="90" class="w-full accent-cctv-blue">
                <span class="text-[10px] text-slate-500">Detections below 90% are flagged for secondary multi-frame verification.</span>
              </div>

              <div>
                <div class="flex justify-between text-slate-300 mb-1">
                  <span>Bus Pothole Defect Threshold:</span>
                  <b class="text-warn-yellow">88%</b>
                </div>
                <input type="range" min="70" max="99" value="88" class="w-full accent-warn-yellow">
                <span class="text-[10px] text-slate-500">Optical classifier confidence paired with 3-axis IMU vibration peak.</span>
              </div>

              <div>
                <div class="flex justify-between text-slate-300 mb-1">
                  <span>Vehicle Classification Threshold:</span>
                  <b class="text-road-green">85%</b>
                </div>
                <input type="range" min="70" max="99" value="85" class="w-full accent-road-green">
              </div>
            </div>
          </div>

          <!-- 2. Privacy & Edge Data Safeguards -->
          <div class="command-card p-4 space-y-3">
            <h2 class="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2 border-b border-command-border pb-2">
              <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
              <span>Privacy Controls & Edge Security</span>
            </h2>

            <div class="space-y-2.5 text-xs">
              <div class="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <div>
                  <div class="font-bold text-white">Edge-First Processing (Zero Raw Video)</div>
                  <div class="text-[10px] text-slate-400">Process video directly on bus edge node; transmit geo-tagged metadata only.</div>
                </div>
                <input type="checkbox" checked disabled class="w-4 h-4 accent-emerald-500">
              </div>

              <div class="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <div>
                  <div class="font-bold text-white">Vehicle Plate Encryption at Rest (AES-256)</div>
                  <div class="text-[10px] text-slate-400">Sensitive plate numbers stored encrypted; access logged to audit trail.</div>
                </div>
                <input type="checkbox" checked class="w-4 h-4 accent-emerald-500">
              </div>

              <div class="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <div>
                  <div class="font-bold text-white">No External Citizen Database Links</div>
                  <div class="text-[10px] text-slate-400">Strictly camera evidence matching without personal PII queries.</div>
                </div>
                <input type="checkbox" checked disabled class="w-4 h-4 accent-emerald-500">
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Role-Based Access (RBAC) & Audit Logs (6 cols) -->
        <div class="lg:col-span-6 space-y-4">
          <!-- RBAC -->
          <div class="command-card p-4 space-y-3">
            <h2 class="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2 border-b border-command-border pb-2">
              <i data-lucide="users" class="w-4 h-4 text-purple-400"></i>
              <span>Role-Based Access Control (RBAC)</span>
            </h2>

            <div class="space-y-2 text-xs font-mono">
              <div class="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div class="font-bold text-white">Officer_01 (Current User)</div>
                  <div class="text-[10px] text-slate-400">Traffic Control Room Operator • Level 3 Clearance</div>
                </div>
                <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">Active</span>
              </div>

              <div class="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div class="font-bold text-slate-300">PWD Municipal Dispatcher</div>
                  <div class="text-[10px] text-slate-400">Road Maintenance & Work Orders • Level 2 Clearance</div>
                </div>
                <span class="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700 text-[10px]">Connected</span>
              </div>

              <div class="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div class="font-bold text-slate-300">City Transit Fleet Supervisor</div>
                  <div class="text-[10px] text-slate-400">Mobile Bus Sensor Monitoring • Level 2 Clearance</div>
                </div>
                <span class="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700 text-[10px]">Connected</span>
              </div>
            </div>
          </div>

          <!-- Audit Logs -->
          <div class="command-card p-4 space-y-3">
            <h2 class="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2 border-b border-command-border pb-2">
              <i data-lucide="scroll-text" class="w-4 h-4 text-cyan-400"></i>
              <span>System Audit Logs (Immutable)</span>
            </h2>

            <div class="space-y-1.5 font-mono text-[10px] text-slate-400 max-h-[160px] overflow-y-auto">
              <div class="p-1.5 rounded bg-slate-950 border border-slate-900 flex justify-between">
                <span>[10:23:14] UP16AB1234 trajectory reconstructed across 5 cameras</span>
                <span class="text-slate-500">Officer_01</span>
              </div>
              <div class="p-1.5 rounded bg-slate-950 border border-slate-900 flex justify-between">
                <span>[10:20:05] BUS-07 logged road defect RD-0101 (Sector-12)</span>
                <span class="text-purple-400">Edge-Bus-07</span>
              </div>
              <div class="p-1.5 rounded bg-slate-950 border border-slate-900 flex justify-between">
                <span>[10:15:30] Ring Road congestion density crossed 88% threshold</span>
                <span class="text-warn-yellow">Density-Engine</span>
              </div>
              <div class="p-1.5 rounded bg-slate-950 border border-slate-900 flex justify-between">
                <span>[09:50:12] Waterlogging alert generated on GT Road by BUS-12</span>
                <span class="text-purple-400">Edge-Bus-12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons({ root: container });

  container.querySelector('#btn-save-settings')?.addEventListener('click', () => {
    if (window.showToast) window.showToast('System configuration & AI thresholds saved successfully', 'info');
  });
}
