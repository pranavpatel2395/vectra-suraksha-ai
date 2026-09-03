/**
 * Vectra Jansadak Suraksha AI - Multi-Camera Vehicle Trajectories Studio
 */

import { mockVehicles } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';

export function renderTrajectoriesView(container) {
  const state = simulationEngine.state;
  let currentPlate = state.selectedVehicle || 'UP16AB1234';
  let vehicle = mockVehicles[currentPlate] || mockVehicles['UP16AB1234'];

  function update() {
    vehicle = mockVehicles[currentPlate] || mockVehicles['UP16AB1234'];

    container.innerHTML = `
      <div class="space-y-4">
        <!-- Top Toolbar -->
        <div class="flex items-center justify-between bg-command-card border border-command-border p-4 rounded-lg flex-wrap gap-3">
          <div>
            <h1 class="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <i data-lucide="git-commit" class="w-5 h-5 text-cctv-blue"></i>
              <span>Multi-Camera Forensic Trajectory Reconstructor</span>
            </h1>
            <p class="text-xs text-slate-400 mt-0.5">
              Reconstructing chronological journey path across fixed city surveillance cameras.
            </p>
          </div>

          <!-- Vehicle Selector -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400 font-mono">Select Vehicle:</span>
            <select id="traj-plate-select" class="bg-slate-950 border border-command-border rounded px-3 py-1.5 text-xs font-mono text-yellow-300 focus:outline-none focus:border-cctv-blue">
              ${Object.keys(mockVehicles).map(p => `<option value="${p}" ${p === currentPlate ? 'selected' : ''}>${p} (${mockVehicles[p].type})</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Trajectory Workspace Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <!-- Left: Journey Forensic Timeline (5 cols) -->
          <div class="lg:col-span-5 command-card p-4 flex flex-col justify-between space-y-4">
            <div>
              <!-- Vehicle Profile Header -->
              <div class="flex items-center justify-between pb-3 border-b border-command-border">
                <div class="flex items-center gap-2.5">
                  <div class="px-2.5 py-1 rounded bg-black border border-yellow-500/50 text-yellow-400 font-mono font-bold text-xs">
                    ${vehicle.plateNumber}
                  </div>
                  <div>
                    <span class="text-xs font-bold text-white">${vehicle.color} ${vehicle.type}</span>
                    <span class="text-[10px] text-slate-400 block font-mono">OCR: ${vehicle.ocrConfidence}%</span>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono ${vehicle.status === 'Blacklisted' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}">
                  ${vehicle.status}
                </span>
              </div>

              <!-- Trajectory Stats Cards -->
              <div class="grid grid-cols-3 gap-2 my-3 font-mono text-xs">
                <div class="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                  <span class="text-[10px] text-slate-400 block">Total Distance</span>
                  <span class="text-white font-bold">${vehicle.stats.totalDistance}</span>
                </div>
                <div class="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                  <span class="text-[10px] text-slate-400 block">Cameras Matched</span>
                  <span class="text-cctv-blue font-bold">${vehicle.stats.camerasMatched}</span>
                </div>
                <div class="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                  <span class="text-[10px] text-slate-400 block">Journey Duration</span>
                  <span class="text-emerald-400 font-bold">${vehicle.stats.journeyDuration}</span>
                </div>
              </div>

              <!-- Camera Step-by-Step Chronology -->
              <div class="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                ${vehicle.trajectory.map((t, idx) => `
                  <div class="p-3 rounded bg-slate-950/80 border border-slate-800 flex items-start gap-3 relative group hover:border-cctv-blue/60 transition-colors">
                    <div class="w-6 h-6 rounded-full bg-blue-600/20 border border-cctv-blue text-cctv-blue font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                      ${idx + 1}
                    </div>
                    <div class="flex-1 min-w-0 font-mono">
                      <div class="flex items-center justify-between text-xs">
                        <span class="font-bold text-white">${t.camera} • ${t.areaName}</span>
                        <span class="text-cctv-blue font-semibold">${t.time}</span>
                      </div>
                      <div class="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                        <span>Heading: <b class="text-slate-300">${t.direction}</b></span>
                        <span class="text-emerald-400 font-bold">Confidence ${t.confidence}%</span>
                      </div>
                      <div class="text-[10px] text-slate-500 mt-0.5">GPS: ${t.lat}° N, ${t.lng}° E</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Action Controls -->
            <div class="pt-3 border-t border-command-border flex items-center justify-between gap-2">
              <button id="btn-traj-replay" class="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow flex items-center justify-center gap-2 transition-colors">
                <i data-lucide="play" class="w-4 h-4"></i>
                <span>Replay Animated Journey</span>
              </button>
              <button id="btn-traj-export" class="py-2 px-3 rounded bg-command-card border border-command-border hover:border-cctv-blue text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5">
                <i data-lucide="download" class="w-4 h-4 text-cctv-blue"></i>
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <!-- Right: Interactive Large Trajectory Map Canvas (7 cols) -->
          <div class="lg:col-span-7 command-card p-4 flex flex-col justify-between min-h-[460px]">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-xs font-bold text-white uppercase tracking-wide">Spatial Trajectory Route Reconstruction</h2>
              <span class="text-[10px] font-mono text-cctv-blue">Sequential CCTV Vector Path</span>
            </div>

            <div class="relative flex-1 bg-[#050811] rounded border border-command-border overflow-hidden min-h-[380px]">
              <canvas id="large-trajectory-canvas" class="w-full h-full block"></canvas>
              <div id="traj-replay-badge" class="hidden absolute top-3 right-3 bg-yellow-950/90 border border-yellow-500/50 text-yellow-300 px-3 py-1 rounded font-mono text-xs font-bold flex items-center gap-2 shadow-lg">
                <span class="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
                <span>Replaying Journey...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons({ root: container });

    // Plate selector change
    const select = container.querySelector('#traj-plate-select');
    select?.addEventListener('change', (e) => {
      currentPlate = e.target.value;
      simulationEngine.setVehicle(currentPlate);
      update();
    });

    // Replay journey
    container.querySelector('#btn-traj-replay')?.addEventListener('click', () => {
      startLargeTrajectoryReplay(container, vehicle);
    });

    container.querySelector('#btn-traj-export')?.addEventListener('click', () => {
      if (window.openReportModal) window.openReportModal(`Trajectory Export: ${vehicle.plateNumber}`, vehicle.trajectory);
    });

    renderLargeTrajectory(container, vehicle, 1.0);
  }

  update();
}

function renderLargeTrajectory(container, vehicle, replayProgress = 1.0) {
  const canvas = container.querySelector('#large-trajectory-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width || 600;
  canvas.height = rect.height || 400;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#060a13';
  ctx.fillRect(0, 0, w, h);

  // Background Grid
  ctx.strokeStyle = '#172033';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  const trajectory = (vehicle.trajectory || []).filter(
    pt => Number.isFinite(Number(pt.lat)) && Number.isFinite(Number(pt.lng))
  );

  if (trajectory.length === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No valid GPS trajectory available', w / 2, h / 2);
    return;
  }

  // GPS bounds
  const lats = trajectory.map(pt => Number(pt.lat));
  const lngs = trajectory.map(pt => Number(pt.lng));

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Padding so first/last markers are not touching edges
  const padding = 70;

  function gpsToCanvas(lat, lng) {
    const latRange = Math.max(maxLat - minLat, 0.0001);
    const lngRange = Math.max(maxLng - minLng, 0.0001);

    const x = padding +
      ((lng - minLng) / lngRange) * (w - padding * 2);

    // Latitude increases upward, canvas Y increases downward
    const y = h - padding -
      ((lat - minLat) / latRange) * (h - padding * 2);

    return { x, y };
  }

  const points = trajectory.map((pt) => {
    const pos = gpsToCanvas(Number(pt.lat), Number(pt.lng));

    return {
      x: pos.x,
      y: pos.y,
      cam: pt.camera,
      area: pt.areaName,
      time: pt.time,
      lat: pt.lat,
      lng: pt.lng,
      direction: pt.direction,
      confidence: pt.confidence
    };
  });
  // Draw Connected Road Path
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // Active Glow Trajectory
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Waypoint Camera Stations
  points.forEach((p, i) => {
    // Outer pulse ring
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Node Circle
    ctx.fillStyle = '#0b1120';
    ctx.strokeStyle = i === points.length - 1 ? '#ef4444' : '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Step Number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px "JetBrains Mono"';
    ctx.textAlign = 'center';
    ctx.fillText(`${i + 1}`, p.x, p.y + 3.5);

    // Camera and Timestamp Tag
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.fillRect(p.x - 45, p.y + 18, 90, 26);
    ctx.strokeRect(p.x - 45, p.y + 18, 90, 26);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 9px "JetBrains Mono"';
    ctx.fillText(p.cam, p.x, p.y + 28);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '8px "JetBrains Mono"';
    ctx.fillText(p.time, p.x, p.y + 39);
  });

  // Replay vehicle moving along path
  if (replayProgress < 1.0) {
    const totalPoints = points.length;
    const currentIdx = Math.floor(replayProgress * (totalPoints - 1));
    const nextIdx = Math.min(currentIdx + 1, totalPoints - 1);
    const subT = (replayProgress * (totalPoints - 1)) - currentIdx;

    const p1 = points[currentIdx];
    const p2 = points[nextIdx];
    const curX = p1.x + (p2.x - p1.x) * subT;
    const curY = p1.y + (p2.y - p1.y) * subT;

    // Moving Car Indicator
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(curX, curY, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 8px "JetBrains Mono"';
    ctx.fillText('TARGET', curX, curY + 3);
  }
}

function startLargeTrajectoryReplay(container, vehicle) {
  const replayBadge = container.querySelector('#traj-replay-badge');
  if (replayBadge) replayBadge.classList.remove('hidden');

  let progress = 0;
  const startTime = performance.now();
  const duration = Math.max(3500, vehicle.trajectory.length * 900);

  function step(now) {
    const elapsed = now - startTime;
    progress = Math.min(elapsed / duration, 1.0);
    renderLargeTrajectory(container, vehicle, progress);

    if (progress < 1.0) {
      requestAnimationFrame(step);
    } else {
      renderLargeTrajectory(container, vehicle, 1.0);
      if (replayBadge) replayBadge.classList.add('hidden');
      if (window.showToast) {
        window.showToast(`Journey Forensic Replay Complete for ${vehicle.plateNumber}`, 'info');
      }
    }
  }

  requestAnimationFrame(step);
}
