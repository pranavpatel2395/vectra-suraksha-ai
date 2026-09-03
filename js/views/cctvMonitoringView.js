/**
 * Vectra Jansadak Suraksha AI - CCTV Live Monitoring Wall View
 * Full grid of fixed roadside CCTV streams with AI bounding boxes & edge telemetry
 */

import { mockCameras } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';
import { 
  getStandardVehiclesForCamera, 
  drawPerspectiveRoad, 
  drawRealisticVehicle, 
  getLaneX 
} from '../utils/vehicleRenderer.js';

export function renderCctvMonitoringView(container) {
  const state = simulationEngine.state;
  let activeFilter = state.selectedArea || 'all';

  function update() {
    const cameras = activeFilter === 'all' 
      ? state.cameras 
      : state.cameras.filter(c => c.area === activeFilter);

    container.innerHTML = `
      <div class="space-y-4">
        <!-- Top Toolbar -->
        <div class="flex items-center justify-between bg-command-card border border-command-border p-4 rounded-lg flex-wrap gap-3">
          <div>
            <h1 class="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <i data-lucide="video" class="w-5 h-5 text-cctv-blue"></i>
              <span>Fixed CCTV Surveillance Stream Wall (${cameras.length} Active Feeds)</span>
            </h1>
            <p class="text-xs text-slate-400 mt-0.5">
              Edge-AI connected optical cameras with license plate recognition & vehicle classifier pipelines.
            </p>
          </div>

          <!-- Filters -->
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs text-slate-400 font-mono">Area Filter:</span>
            <select id="cctv-area-filter" class="bg-slate-950 border border-command-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cctv-blue">
              <option value="all" ${activeFilter === 'all' ? 'selected' : ''}>All City Corridors</option>
              <option value="mg_road" ${activeFilter === 'mg_road' ? 'selected' : ''}>MG Road</option>
              <option value="gt_road" ${activeFilter === 'gt_road' ? 'selected' : ''}>GT Road</option>
              <option value="ring_road" ${activeFilter === 'ring_road' ? 'selected' : ''}>Ring Road</option>
              <option value="sector_12" ${activeFilter === 'sector_12' ? 'selected' : ''}>Sector-12</option>
              <option value="city_center" ${activeFilter === 'city_center' ? 'selected' : ''}>City Center</option>
              <option value="airport_road" ${activeFilter === 'airport_road' ? 'selected' : ''}>Airport Road</option>
              <option value="industrial_area" ${activeFilter === 'industrial_area' ? 'selected' : ''}>Industrial Area</option>
              <option value="highway_exit" ${activeFilter === 'highway_exit' ? 'selected' : ''}>Highway Exit</option>
            </select>
          </div>
        </div>

        <!-- 48-Camera Wall Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
          ${cameras.map(cam => `
            <div data-cam-tile="${cam.id}" class="command-card rounded-md overflow-hidden bg-slate-950 border border-command-border hover:border-cctv-blue cursor-pointer transition-all flex flex-col group">
              <!-- Video Simulation Canvas (Strict 16:9) -->
              <div class="cctv-feed-frame">
                <canvas id="cctv-grid-canvas-${cam.id}" class="w-full h-full block" width="480" height="270"></canvas>
                <div class="cctv-scanline"></div>
                <div class="absolute inset-0 cctv-vignette pointer-events-none"></div>

                <!-- Top Badges -->
                <div class="absolute top-2 left-2 flex items-center gap-1.5 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-slate-200 border border-slate-700">
                  <span class="font-bold text-cctv-blue">${cam.id}</span>
                  <span class="text-slate-400">|</span>
                  <span class="truncate max-w-[90px]">${cam.areaName}</span>
                </div>

                <div class="absolute top-2 right-2 flex items-center gap-1 bg-red-950/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-red-400 border border-red-800">
                  <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span>LIVE</span>
                </div>

                <!-- Bottom Telemetry -->
                <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono bg-black/80 px-2 py-0.5 rounded text-slate-300 border border-slate-800">
                  <span class="text-emerald-400">${cam.fps} FPS • ${cam.resolution}</span>
                  <span class="text-cctv-blue">${cam.vehiclesPerHr} veh/hr</span>
                </div>
              </div>

              <!-- Metadata Card Footer -->
              <div class="p-2.5 bg-command-card flex items-center justify-between text-xs font-mono">
                <div>
                  <div class="font-bold text-slate-200 text-[11px]">${cam.name}</div>
                  <div class="text-[10px] text-slate-400">Heading: ${cam.direction}</div>
                </div>
                <button class="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-cctv-blue hover:text-white text-[10px] font-semibold transition-colors">
                  Inspect
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons({ root: container });

    // Filter change
    const filterSelect = container.querySelector('#cctv-area-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        activeFilter = e.target.value;
        simulationEngine.setArea(activeFilter);
        update();
      });
    }

    // Camera clicks
    cameras.forEach(cam => {
      const tile = container.querySelector(`[data-cam-tile="${cam.id}"]`);
      tile?.addEventListener('click', () => {
        if (window.openCameraModal) window.openCameraModal(cam);
      });
    });

    // Start canvas renderers for the grid
    renderGridCanvases(cameras);
  }

  function renderGridCanvases(cameras) {
    cameras.forEach((cam, i) => {
      const canvas = document.getElementById(`cctv-grid-canvas-${cam.id}`);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = (canvas.width = 480);
      const h = (canvas.height = 270);
      const horizonY = 70;
      const vpX = w / 2;

      // Initialize unique, vividly colored vehicles for this camera stream
      const vehicles = getStandardVehiclesForCamera(cam.id, i);

      let frame = 0;
      function draw() {
        frame++;

        // 1. Draw highway with perspective lanes and road surface
        drawPerspectiveRoad(ctx, w, h, horizonY, vpX, frame);

        // 2. Draw multiple flowing vehicles with realistic metallic colors
        vehicles.forEach(v => {
          v.y += v.speed;
          if (v.y > h + 35) {
            v.y = horizonY + 5;
            v.lane = (v.lane + 1) % 4;
          }

          const currentX = getLaneX(v.lane, v.y, w, h, horizonY);
          const t = Math.max(0, (v.y - horizonY) / (h - horizonY));
          const scale = 0.4 + t * 0.7;
          const vWidth = 28 * scale;
          const vHeight = 46 * scale;

          drawRealisticVehicle(ctx, currentX, v.y, vWidth, vHeight, v, v.isWanted);
        });

        // Loop while canvas is in DOM
        if (document.getElementById(`cctv-grid-canvas-${cam.id}`)) {
          requestAnimationFrame(draw);
        }
      }
      requestAnimationFrame(draw);
    });
  }

  update();
}
