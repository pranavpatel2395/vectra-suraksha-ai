/**
 * Vectra Jansadak Suraksha AI - Live CCTV Feeds Component
 * Renders high-fidelity fixed camera simulations with real-time Edge AI bounding boxes & OCR tags
 */

import { mockCameras } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';
import { 
  getStandardVehiclesForCamera, 
  drawPerspectiveRoad, 
  drawRealisticVehicle, 
  getLaneX 
} from '../utils/vehicleRenderer.js';

export function renderCctvFeeds(container, isGridOnly = false) {
  const state = simulationEngine.state;
  
  // Filter cameras if area selected (2x2 grid on dashboard)
  let camerasToDisplay = state.selectedArea && state.selectedArea !== 'all'
    ? state.cameras.filter(c => c.area === state.selectedArea).slice(0, 4)
    : state.cameras.slice(0, 4);

  if (camerasToDisplay.length === 0) {
    camerasToDisplay = state.cameras.slice(0, 4);
  }

  container.innerHTML = `
    <div class="command-card p-3.5 h-full flex flex-col justify-between">
      <!-- Header -->
      <div class="flex items-center justify-between mb-2 border-b border-command-border/80 pb-2">
        <div class="flex items-center gap-2">
          <div class="p-1 rounded bg-sky-950/80 text-cctv-blue border border-sky-500/30">
            <i data-lucide="video" class="w-4 h-4"></i>
          </div>
          <div>
            <h2 class="text-xs font-bold text-white tracking-wide uppercase">Live CCTV Feeds</h2>
            <p class="text-[10px] text-slate-400">Fixed roadside AI surveillance streams</p>
          </div>
        </div>
        <button id="btn-view-all-cameras" class="text-[11px] px-2.5 py-1 rounded bg-command-card border border-command-border text-cctv-blue hover:text-white hover:border-cctv-blue font-medium transition-colors flex items-center gap-1">
          <span>View All Cameras</span>
          <i data-lucide="arrow-right" class="w-3 h-3"></i>
        </button>
      </div>

      <!-- CCTV Grid (Strict 16:9 Aspect Ratio - Vertically Balanced) -->
      <div class="grid grid-cols-2 gap-2.5 flex-1 content-center my-auto">
        ${camerasToDisplay.map((cam, idx) => `
          <div data-cam-card="${cam.id}" class="relative rounded-md overflow-hidden bg-slate-950 border border-command-border group hover:border-cctv-blue/60 cursor-pointer transition-all flex flex-col">
            <!-- Simulated Video Canvas Container (Strict 16:9 Widescreen) -->
            <div class="cctv-feed-frame">
              <canvas id="cctv-canvas-${cam.id}" class="w-full h-full block" width="480" height="270"></canvas>
              
              <!-- CCTV Scanline Effect & Vignette -->
              <div class="cctv-scanline"></div>
              <div class="absolute inset-0 cctv-vignette pointer-events-none"></div>

              <!-- Top Left: ID & Area -->
              <div class="absolute top-1.5 left-1.5 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-slate-200 border border-slate-700/70 z-10">
                <span class="font-bold text-cctv-blue">${cam.id}</span>
                <span class="text-slate-500">|</span>
                <span class="truncate max-w-[85px]">${cam.areaName}</span>
              </div>

              <!-- Top Right: LIVE Indicator -->
              <div class="absolute top-1.5 right-1.5 flex items-center gap-1 bg-red-950/85 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-mono text-red-400 border border-red-800/70 z-10">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span>LIVE</span>
              </div>

              <!-- Bottom Overlay: Edge AI Detection Tag & FPS -->
              <div class="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[9px] font-mono bg-slate-950/85 backdrop-blur-sm px-2 py-0.5 rounded text-slate-300 border border-slate-800/80 z-10">
                <span class="text-emerald-400 truncate">AI: ${cam.activeDetections.slice(0, 2).join(', ') || 'Scanning...'}</span>
                <span class="text-slate-400 hidden sm:inline">${cam.fps || 30} FPS</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Bottom Stream Status Bar -->
      <div class="mt-2 pt-2 border-t border-command-border text-[10px] text-slate-400 flex items-center justify-between font-mono">
        <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 4 Streams Active • RTSP/H.265</span>
        <span class="text-cctv-blue">● AI Vision Engine: Online</span>
      </div>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === "function") { try { window.lucide.createIcons(); } catch (e) {} }

  // Bind View All Cameras button
  const viewAllBtn = container.querySelector('#btn-view-all-cameras');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      if (window.navigateTo) window.navigateTo('cctv_cameras');
    });
  }

  // Bind individual camera clicks to open Inspector modal
  camerasToDisplay.forEach(cam => {
    const card = container.querySelector(`[data-cam-card="${cam.id}"]`);
    if (card) {
      card.addEventListener('click', () => {
        if (window.openCameraModal) window.openCameraModal(cam);
      });
    }
  });

  // Start realistic Canvas rendering loop for all visible CCTV feeds
  startCctvCanvasRenderers(camerasToDisplay);
}

// Canvas animation system for realistic tactical CCTV highway feeds
const activeRenderers = new Map();

function startCctvCanvasRenderers(cameras) {
  // Clear previous renderers
  activeRenderers.forEach(stopFn => stopFn());
  activeRenderers.clear();

  cameras.forEach((cam, index) => {
    const canvas = document.getElementById(`cctv-canvas-${cam.id}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Strict 16:9 Coordinate Resolution (480 x 270)
    const width = (canvas.width = 480);
    const height = (canvas.height = 270);

    // Horizon line and vanishing point
    const horizonY = 70;
    const vpX = width / 2;

    // Distinct, vividly colored vehicles with perspective scaling
    const vehicles = getStandardVehiclesForCamera(cam.id, index);

    let animId;
    let frameCount = 0;

    function render() {
      frameCount++;

      // 1. Draw highway with perspective lanes and road surface
      drawPerspectiveRoad(ctx, width, height, horizonY, vpX, frameCount);

      // 2. Draw multiple flowing vehicles with realistic metallic colors
      vehicles.forEach(v => {
        v.y += v.speed;
        if (v.y > height + 35) {
          v.y = horizonY + 5;
          v.lane = (v.lane + 1) % 4;
        }

        const currentX = getLaneX(v.lane, v.y, width, height, horizonY);
        const t = Math.max(0, (v.y - horizonY) / (height - horizonY));
        const scale = 0.4 + t * 0.7;
        const vWidth = 28 * scale;
        const vHeight = 46 * scale;

        drawRealisticVehicle(ctx, currentX, v.y, vWidth, vHeight, v, v.isWanted);
      });

      // 6. Camera HUD Corner Brackets & Timestamp
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.2;
      const corner = 12;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(12, 12 + corner);
      ctx.lineTo(12, 12);
      ctx.lineTo(12 + corner, 12);
      // Top-Right
      ctx.moveTo(width - 12 - corner, 12);
      ctx.lineTo(width - 12, 12);
      ctx.lineTo(width - 12, 12 + corner);
      // Bottom-Left
      ctx.moveTo(12, height - 12 - corner);
      ctx.lineTo(12, height - 12);
      ctx.lineTo(12 + corner, height - 12);
      // Bottom-Right
      ctx.moveTo(width - 12 - corner, height - 12);
      ctx.lineTo(width - 12, height - 12);
      ctx.lineTo(width - 12, height - 12 - corner);
      ctx.stroke();

      // Timestamp with Running Seconds & dynamic current date
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = '9px "JetBrains Mono", monospace';
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();
      const nowStr = now.toTimeString().slice(0, 8);
      ctx.fillText(`REC • ${day}-${month}-${year} ${nowStr}`, 16, 24);

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    activeRenderers.set(cam.id, () => {
      cancelAnimationFrame(animId);
    });
  });
}
