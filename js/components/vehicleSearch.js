/**
 * Vectra Jansadak Suraksha AI - Vehicle Intelligence Search & Multi-Camera Trajectory Component
 */

import { mockVehicles } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';

export function renderVehicleIntelligence(container) {
  const state = simulationEngine.state;
  const currentPlate = state.selectedVehicle || 'UP16AB1234';
  const vehicle = mockVehicles[currentPlate] || mockVehicles['UP16AB1234'];

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full">
      
      <!-- LEFT: Vehicle Intelligence Search Card -->
      <div class="lg:col-span-5 command-card p-3.5 flex flex-col justify-between h-full">
        <div>
          <!-- Header -->
          <div class="flex items-center justify-between mb-3 border-b border-command-border/80 pb-2">
            <div class="flex items-center gap-2">
              <div class="p-1 rounded bg-blue-950/80 text-cctv-blue border border-blue-500/30">
                <i data-lucide="scan-line" class="w-4 h-4"></i>
              </div>
              <div>
                <h2 class="text-xs font-bold text-white tracking-wide uppercase">Vehicle Intelligence Search</h2>
                <p class="text-[10px] text-slate-400">ANPR OCR & multi-camera vehicle identification</p>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono ${vehicle.status === 'Blacklisted' ? 'bg-red-950 text-red-400 border border-red-800' : vehicle.status === 'Speed Violation' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}">
              ${vehicle.status}
            </span>
          </div>

          <!-- Search Input Box -->
          <div class="flex items-center gap-2 mb-2.5">
            <div class="relative flex-1">
              <input type="text" id="input-vehicle-search" value="${currentPlate}" placeholder="Enter License Plate Number (e.g. UP16AB1234)" class="w-full bg-slate-950 border border-command-border rounded px-3 py-1.5 text-xs font-mono uppercase text-white focus:outline-none focus:border-cctv-blue">
              <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2 pointer-events-none"></i>
            </div>
            <button id="btn-vehicle-search" class="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-colors">
              Search
            </button>
          </div>

          <!-- Quick Sample Plate Buttons -->
          <div class="flex items-center gap-1.5 flex-wrap mb-3 text-[10px] font-mono">
            <span class="text-slate-400">Sample:</span>
            ${Object.keys(mockVehicles).map(plate => `
              <button data-quick-plate="${plate}" class="px-2 py-0.5 rounded border transition-colors ${plate === currentPlate ? 'bg-blue-600/30 border-blue-400 text-cctv-blue font-bold' : 'bg-command-card border-command-border text-slate-400 hover:text-white'}">
                ${plate}
              </button>
            `).join('')}
          </div>

          <!-- Tracked Vehicle Profile Card -->
          <div class="flex gap-3 bg-slate-950/80 rounded border border-command-border p-3 mb-3">
            <!-- Vehicle Image Preview with Plate Overlay -->
            <div class="relative w-32 aspect-[4/3] rounded overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-800">
              <img src="${vehicle.image}" alt="${vehicle.color} ${vehicle.type}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='assets/images/vehicles/sedan-silver.jpg'">
              <div class="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded font-mono text-[9px] text-yellow-400 border border-yellow-500/40">
                ${vehicle.plateNumber}
              </div>
            </div>

            <!-- Attributes Breakdown -->
            <div class="flex-1 grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs font-mono">
              <div>
                <span class="text-[10px] text-slate-400 block">Vehicle Type:</span>
                <span class="text-slate-200 font-bold">${vehicle.type}</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 block">Color:</span>
                <span class="text-slate-200 font-bold">${vehicle.color}</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 block">OCR Confidence:</span>
                <span class="text-emerald-400 font-bold">${vehicle.ocrConfidence}%</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 block">Status:</span>
                <span class="${vehicle.status === 'Blacklisted' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}">${vehicle.status}</span>
              </div>
              <div class="col-span-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
                <span>First Seen: <b class="text-white">${vehicle.firstSeen}</b></span>
                <span>Last Seen: <b class="text-white">${vehicle.lastSeen}</b></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-command-border">
          <button id="btn-vehicle-history" class="py-1.5 px-2 rounded bg-command-card border border-command-border hover:border-cctv-blue text-[11px] font-semibold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-1">
            <i data-lucide="history" class="w-3.5 h-3.5 text-cctv-blue"></i>
            <span class="truncate">Full History</span>
          </button>
          <button id="btn-vehicle-gis-view" class="py-1.5 px-2 rounded bg-command-card border border-command-border hover:border-cctv-blue text-[11px] font-semibold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-1">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-cctv-blue"></i>
            <span class="truncate">View on Map</span>
          </button>
          <button id="btn-vehicle-export-report" class="py-1.5 px-2 rounded bg-command-card border border-command-border hover:border-cctv-blue text-[11px] font-semibold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-1">
            <i data-lucide="download" class="w-3.5 h-3.5 text-cctv-blue"></i>
            <span class="truncate">Export Report</span>
          </button>
        </div>
      </div>

      <!-- CENTER & RIGHT: Vehicle Trajectory (All Cameras) -->
      <div class="lg:col-span-7 command-card p-3.5 flex flex-col justify-between h-full">
        <div>
          <!-- Header -->
          <div class="flex items-center justify-between mb-3 border-b border-command-border/80 pb-2">
            <div class="flex items-center gap-2">
              <div class="p-1 rounded bg-sky-950/80 text-cctv-blue border border-sky-500/30">
                <i data-lucide="git-commit" class="w-4 h-4"></i>
              </div>
              <div>
                <h2 class="text-xs font-bold text-white tracking-wide uppercase">Vehicle Trajectory (All Cameras)</h2>
                <p class="text-[10px] text-slate-400">Reconstructed spatial-temporal path across fixed CCTV cameras</p>
              </div>
            </div>
            <button id="btn-view-full-trajectory" class="text-[11px] px-2.5 py-1 rounded bg-command-card border border-command-border text-cctv-blue hover:text-white hover:border-cctv-blue font-medium transition-colors flex items-center gap-1">
              <span>View Full Trajectory</span>
              <i data-lucide="arrow-right" class="w-3 h-3"></i>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
            <!-- Timeline of Camera Detections -->
            <div class="md:col-span-7 space-y-2 pr-1 max-h-[185px] overflow-y-auto font-mono text-xs">
              ${vehicle.trajectory.map((t, idx) => `
                <div class="flex items-start gap-2.5 p-2 rounded bg-slate-950/70 border border-command-border/80 relative">
                  <!-- Stepper Indicator -->
                  <div class="flex flex-col items-center">
                    <div class="w-4 h-4 rounded-full bg-blue-600/30 border border-cctv-blue text-cctv-blue text-[9px] font-bold flex items-center justify-center">
                      ${idx + 1}
                    </div>
                    ${idx < vehicle.trajectory.length - 1 ? '<div class="w-0.5 h-6 bg-slate-800 my-0.5"></div>' : ''}
                  </div>

                  <!-- Details -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="font-bold text-slate-200 truncate">${t.camera} | ${t.areaName}</span>
                      <span class="text-slate-400 font-semibold">${t.time}</span>
                    </div>
                    <div class="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                      <span>Direction: <b class="text-slate-300">${t.direction}</b></span>
                      <span class="text-emerald-400">Confidence ${t.confidence}%</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Mini GIS Trajectory Canvas -->
            <div class="md:col-span-5 relative bg-[#050811] rounded border border-command-border/80 overflow-hidden flex flex-col justify-between p-2 min-h-[150px]">
              <canvas id="mini-trajectory-canvas" class="w-full h-full block"></canvas>
              <div class="absolute top-1.5 left-1.5 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-cctv-blue">
                Path Route Map
              </div>
            </div>
          </div>
        </div>

        <!-- Trajectory Stats & Replay Button Bar -->
        <div class="pt-2 border-t border-command-border flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div class="flex items-center gap-4 text-slate-300">
            <div>Total Distance: <b class="text-white font-bold">${vehicle.stats.totalDistance}</b></div>
            <div>Cameras Matched: <b class="text-cctv-blue font-bold">${vehicle.stats.camerasMatched}</b></div>
            <div>Journey Duration: <b class="text-emerald-400 font-bold">${vehicle.stats.journeyDuration}</b></div>
          </div>

          <button id="btn-replay-journey" class="px-3 py-1.5 rounded bg-blue-600/20 border border-blue-500 text-cctv-blue hover:bg-blue-600 hover:text-white font-semibold transition-all flex items-center gap-1.5 shadow-sm">
            <i data-lucide="play" class="w-3.5 h-3.5"></i>
            <span>Replay Journey</span>
          </button>
        </div>
      </div>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === "function") { try { window.lucide.createIcons(); } catch (e) {} }

  // Bind Vehicle Search & Quick Plates
  const searchInput = container.querySelector('#input-vehicle-search');
  const searchBtn = container.querySelector('#btn-vehicle-search');

  const doSearch = () => {
    const val = (searchInput?.value || '').trim().toUpperCase();
    if (val) {
      if (mockVehicles[val]) {
        simulationEngine.setVehicle(val);
      } else {
        // Fallback create dummy search result
        mockVehicles[val] = {
          plateNumber: val,
          type: 'Sedan',
          color: 'Silver',
          status: 'Active',
          statusReason: 'Tracked on active surveillance feeds',
          ocrConfidence: 95.5,
          firstSeen: '09:30 AM',
          lastSeen: '10:15 AM',
          image: 'assets/images/vehicles/sedan-silver.jpg',
          stats: { totalDistance: '10.4 km', camerasMatched: 4, journeyDuration: '45 min' },
          trajectory: [
            { camera: 'CAM-01', area: 'mg_road', areaName: 'MG Road', time: '09:30 AM', direction: 'Eastbound', confidence: 96.0, lat: 28.614, lng: 77.208 },
            { camera: 'CAM-02', area: 'city_center', areaName: 'City Center', time: '09:50 AM', direction: 'Northbound', confidence: 94.8, lat: 28.629, lng: 77.207 },
            { camera: 'CAM-06', area: 'highway_exit', areaName: 'Highway Exit', time: '10:15 AM', direction: 'Westbound', confidence: 97.2, lat: 28.521, lng: 77.271 }
          ]
        };
        simulationEngine.setVehicle(val);
      }
    }
  };

  searchBtn?.addEventListener('click', doSearch);
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });

  container.querySelectorAll('[data-quick-plate]').forEach(btn => {
    btn.addEventListener('click', () => {
      const plate = btn.getAttribute('data-quick-plate');
      simulationEngine.setVehicle(plate);
    });
  });

  // Action button bindings
  container.querySelector('#btn-vehicle-history')?.addEventListener('click', () => {
    if (window.openVehicleHistoryModal) window.openVehicleHistoryModal(vehicle);
  });
  container.querySelector('#btn-vehicle-gis-view')?.addEventListener('click', () => {
    if (window.navigateTo) window.navigateTo('trajectories');
  });
  container.querySelector('#btn-vehicle-export-report')?.addEventListener('click', () => {
    if (window.openReportModal) window.openReportModal('Vehicle Intelligence Report', vehicle);
  });
  container.querySelector('#btn-view-full-trajectory')?.addEventListener('click', () => {
    if (window.navigateTo) window.navigateTo('trajectories');
  });

  // Replay Journey Animation
  container.querySelector('#btn-replay-journey')?.addEventListener('click', () => {
    startMiniTrajectoryReplay(container, vehicle);
  });

  // Start initial mini trajectory canvas render
  renderMiniTrajectory(container, vehicle);
}

function renderMiniTrajectory(container, vehicle, replayProgress = 1.0) {
  const canvas = container.querySelector('#mini-trajectory-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width || 240;
  canvas.height = rect.height || 140;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, w, h);

  // Draw grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const points = vehicle.trajectory.map((pt, i) => {
    const total = vehicle.trajectory.length;
    return {
      x: 30 + (i / (total - 1)) * (w - 60),
      y: 35 + Math.sin(i * 1.8) * (h * 0.3),
      cam: pt.camera,
      area: pt.areaName
    };
  });

  // Draw trajectory route path
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // Glow line
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Draw waypoint nodes
  points.forEach((p, i) => {
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = i === points.length - 1 ? '#ef4444' : '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${i + 1}`, p.x, p.y + 3);

    // Node label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '7px "JetBrains Mono", monospace';
    ctx.fillText(p.cam, p.x, p.y - 10);
  });

  // Replay vehicle marker
  if (replayProgress < 1.0) {
    const totalPoints = points.length;
    const currentIdx = Math.floor(replayProgress * (totalPoints - 1));
    const nextIdx = Math.min(currentIdx + 1, totalPoints - 1);
    const subT = (replayProgress * (totalPoints - 1)) - currentIdx;

    const p1 = points[currentIdx];
    const p2 = points[nextIdx];
    const curX = p1.x + (p2.x - p1.x) * subT;
    const curY = p1.y + (p2.y - p1.y) * subT;

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(curX, curY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function startMiniTrajectoryReplay(container, vehicle) {
  let progress = 0;
  const startTime = performance.now();
  const duration = 2500; // 2.5s journey replay

  function step(now) {
    const elapsed = now - startTime;
    progress = Math.min(elapsed / duration, 1.0);
    renderMiniTrajectory(container, vehicle, progress);

    if (progress < 1.0) {
      requestAnimationFrame(step);
    } else {
      renderMiniTrajectory(container, vehicle, 1.0);
      if (window.showToast) {
        window.showToast(`Trajectory Journey Replay Completed for ${vehicle.plateNumber}`, 'info');
      }
    }
  }

  requestAnimationFrame(step);
}
