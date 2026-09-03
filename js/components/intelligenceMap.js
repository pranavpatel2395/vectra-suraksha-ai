/**
 * Vectra Jansadak Suraksha AI - City Live Intelligence Map Component
 * Interactive Command-Center Tactical GIS Map
 */

import { mockAreas, mockCameras, mockBuses, mockRoadIssues, mockIncidents, mockVehicles } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';

export function renderIntelligenceMap(container, isFullScreen = false) {
  const state = simulationEngine.state;
  let activeLayer = 'all';

  container.innerHTML = `
    <div class="command-card p-3.5 h-full flex flex-col relative overflow-hidden">
      <!-- Header Bar -->
      <div class="flex items-center justify-between mb-2.5 border-b border-command-border/80 pb-2 z-10">
        <div class="flex items-center gap-2">
          <div class="p-1 rounded bg-blue-950/80 text-cctv-blue border border-blue-500/30">
            <i data-lucide="map" class="w-4 h-4"></i>
          </div>
          <div>
            <h2 class="text-xs font-bold text-white tracking-wide uppercase">City Live Intelligence Map</h2>
            <p class="text-[10px] text-slate-400">Integrated fixed surveillance & mobile road sensing GIS</p>
          </div>
        </div>

        <!-- Layer Selector & Fullscreen Toggle -->
        <div class="flex items-center gap-2">
          <div class="relative">
            <select id="map-layer-select" class="bg-command-card border border-command-border text-slate-200 text-xs font-medium rounded px-2.5 py-1 pr-7 focus:outline-none focus:border-cctv-blue transition-colors cursor-pointer appearance-none">
              <option value="all">All Layers</option>
              <option value="cctv">CCTV Cameras</option>
              <option value="bus">Bus Sensing Sources</option>
              <option value="traffic">Traffic Density</option>
              <option value="road_issues">Road Issues</option>
              <option value="incidents">Incidents</option>
              <option value="trajectory">Vehicle Trajectories</option>
            </select>
            <i data-lucide="layers" class="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1.5 pointer-events-none"></i>
          </div>

          <button id="btn-map-expand" class="p-1 rounded bg-command-card border border-command-border text-slate-300 hover:text-white hover:border-slate-500 transition-colors" title="Toggle Fullscreen Map">
            <i data-lucide="${isFullScreen ? 'minimize-2' : 'maximize-2'}" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>

      <!-- Map Canvas Container with Tactical GIS Controls -->
      <div class="relative flex-1 bg-[#050811] rounded border border-command-border/80 overflow-hidden min-h-[300px]" id="gis-map-wrapper">
        
        <!-- GIS Map Canvas (Roads, Particles, Traffic Flow) -->
        <canvas id="gis-canvas" class="w-full h-full block cursor-crosshair"></canvas>

        <!-- Interactive SVG Overlay for Nodes, Markers & Popups -->
        <svg id="gis-svg-overlay" class="absolute inset-0 w-full h-full pointer-events-auto select-none"></svg>

        <!-- Top Left Map Zoom & Recenter Controls -->
        <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          <button id="btn-zoom-in" class="w-7 h-7 rounded bg-command-card/90 backdrop-blur-sm border border-command-border text-slate-200 hover:text-white hover:border-cctv-blue flex items-center justify-center transition-all shadow-md" title="Zoom In">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          </button>
          <button id="btn-zoom-out" class="w-7 h-7 rounded bg-command-card/90 backdrop-blur-sm border border-command-border text-slate-200 hover:text-white hover:border-cctv-blue flex items-center justify-center transition-all shadow-md" title="Zoom Out">
            <i data-lucide="minus" class="w-3.5 h-3.5"></i>
          </button>
          <button id="btn-recenter" class="w-7 h-7 rounded bg-command-card/90 backdrop-blur-sm border border-command-border text-slate-200 hover:text-white hover:border-cctv-blue flex items-center justify-center transition-all shadow-md" title="Reset View">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <!-- Bottom Legend Bar -->
        <div class="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/85 backdrop-blur-md border border-command-border/80 rounded px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-300 z-20">
          <div class="flex items-center gap-3 flex-wrap">
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cctv-blue shadow-sm"></span> CCTV Camera</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-bus-purple shadow-sm"></span> Bus Sensing</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-1 rounded-sm bg-alert-red"></span> Traffic High</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-1 rounded-sm bg-warn-yellow"></span> Traffic Medium</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-1 rounded-sm bg-road-green"></span> Traffic Low</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-amber-400 rotate-45"></span> Road Issue</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span> Incident</span>
          </div>
          <div class="text-slate-400 hidden sm:block">GIS Grid: 28.61° N, 77.20° E</div>
        </div>

        <!-- Node Inspection Popup (Floating Tooltip) -->
        <div id="gis-popup" class="hidden absolute z-30 bg-command-dark/95 backdrop-blur-md border border-command-border-bright rounded-md p-2.5 text-xs shadow-xl min-w-[200px] pointer-events-auto"></div>
      </div>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === "function") { try { window.lucide.createIcons(); } catch (e) {} }

  // Initialize GIS Engine
  setupGisEngine(container, isFullScreen);
}

// Tactical GIS Vector Engine
function setupGisEngine(container, isFullScreen) {
  const canvas = container.querySelector('#gis-canvas');
  const svgOverlay = container.querySelector('#gis-svg-overlay');
  const popup = container.querySelector('#gis-popup');
  const layerSelect = container.querySelector('#map-layer-select');
  const expandBtn = container.querySelector('#btn-map-expand');
  const zoomInBtn = container.querySelector('#btn-zoom-in');
  const zoomOutBtn = container.querySelector('#btn-zoom-out');
  const recenterBtn = container.querySelector('#btn-recenter');

  if (!canvas || !svgOverlay) return;

  const ctx = canvas.getContext('2d');
  let zoom = 1;
  let offsetX = 0;
  let offsetY = 0;
  let currentLayer = 'all';

  // Canonical World Coordinate System for Uniform Proportional GIS Projection (Aspect 1.6:1)
  const WORLD_W = 1000;
  const WORLD_H = 620;

  // Define City Road Network Nodes & Segments (Harmonized Geospatial Distribution)
  const cityNodes = {
    'airport_road': { x: 0.16, y: 0.20, name: 'Airport Road', code: 'AP' },
    'mg_road': { x: 0.38, y: 0.32, name: 'MG Road', code: 'MG' },
    'sector_12': { x: 0.22, y: 0.70, name: 'Sector-12', code: 'S12' },
    'ring_road': { x: 0.35, y: 0.54, name: 'Ring Road', code: 'RR' },
    'city_center': { x: 0.56, y: 0.44, name: 'City Center', code: 'CC' },
    'central_park': { x: 0.52, y: 0.66, name: 'Central Park', code: 'CP' },
    'gt_road': { x: 0.74, y: 0.32, name: 'GT Road', code: 'GT' },
    'industrial_area': { x: 0.86, y: 0.24, name: 'Industrial Area', code: 'IA' },
    'highway_exit': { x: 0.80, y: 0.78, name: 'Highway Exit', code: 'HE' }
  };

  // Road Corridors with Traffic Density Status
  const cityCorridors = [
    { from: 'airport_road', to: 'mg_road', traffic: 'low', name: 'Airport Express Corridor' },
    { from: 'airport_road', to: 'sector_12', traffic: 'medium', name: 'West Ring Link' },
    { from: 'sector_12', to: 'ring_road', traffic: 'high', name: 'Sector-12 Arterial' },
    { from: 'ring_road', to: 'central_park', traffic: 'medium', name: 'South Arterial' },
    { from: 'mg_road', to: 'city_center', traffic: 'high', name: 'MG Metro Highway' },
    { from: 'city_center', to: 'gt_road', traffic: 'high', name: 'North Central Connector' },
    { from: 'gt_road', to: 'industrial_area', traffic: 'medium', name: 'Industrial Freight Line' },
    { from: 'city_center', to: 'central_park', traffic: 'low', name: 'Central Promenade' },
    { from: 'central_park', to: 'highway_exit', traffic: 'high', name: 'Highway Radial Link' },
    { from: 'gt_road', to: 'highway_exit', traffic: 'medium', name: 'Eastern Bypass' },
    { from: 'ring_road', to: 'mg_road', traffic: 'high', name: 'Ring Road Northbound' }
  ];

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || canvas.clientWidth || 700;
    canvas.height = rect.height || canvas.clientHeight || 420;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Map Drawing & Animation Loop
  let animId;
  let particles = [];
  // Initialize traffic flow particles
  for (let i = 0; i < 45; i++) {
    const corridor = cityCorridors[Math.floor(Math.random() * cityCorridors.length)];
    particles.push({
      corridor,
      t: Math.random(),
      speed: 0.0025 + Math.random() * 0.0035
    });
  }

  function drawMap() {
    if (canvas.width <= 0 || canvas.height <= 0) {
      resizeCanvas();
    }
    const w = canvas.width || 700;
    const h = canvas.height || 420;
    if (w === 0 || h === 0) {
      animId = requestAnimationFrame(drawMap);
      return;
    }

    // Uniform Proportional Projection (Zero Distortion on any screen aspect ratio)
    const scale = Math.min(w / WORLD_W, h / WORLD_H);
    const mapW = WORLD_W * scale;
    const mapH = WORLD_H * scale;
    const originX = (w - mapW) / 2;
    const originY = (h - mapH) / 2;

    function getMapPoint(nx, ny) {
      return {
        x: originX + nx * mapW,
        y: originY + ny * mapH
      };
    }

    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2 + offsetX, h / 2 + offsetY);
    ctx.scale(zoom, zoom);
    ctx.translate(-w / 2, -h / 2);

    // 1. Draw Uniform Grid Lines (Square Cells - No Stretching)
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.lineWidth = 1;
    const gridSize = Math.max(30, 48 * scale);
    for (let x = originX; x <= originX + mapW; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, originY);
      ctx.lineTo(x, originY + mapH);
      ctx.stroke();
    }
    for (let y = originY; y <= originY + mapH; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(originX, y);
      ctx.lineTo(originX + mapW, y);
      ctx.stroke();
    }

    // 2. Draw Road Corridors with True Proportions
    cityCorridors.forEach(c => {
      const p1 = cityNodes[c.from];
      const p2 = cityNodes[c.to];
      if (!p1 || !p2) return;

      const pt1 = getMapPoint(p1.x, p1.y);
      const pt2 = getMapPoint(p2.x, p2.y);

      // Base road casing
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = Math.max(7, 11 * scale);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(pt1.x, pt1.y);
      ctx.lineTo(pt2.x, pt2.y);
      ctx.stroke();

      // Traffic Color Segment
      let trafficColor = '#22c55e'; // Low (Green)
      if (c.traffic === 'medium') trafficColor = '#f59e0b'; // Medium (Yellow)
      if (c.traffic === 'high') trafficColor = '#ef4444'; // High (Red)

      ctx.strokeStyle = trafficColor;
      ctx.lineWidth = Math.max(3, 4.5 * scale);
      ctx.beginPath();
      ctx.moveTo(pt1.x, pt1.y);
      ctx.lineTo(pt2.x, pt2.y);
      ctx.stroke();

      // Road Glow
      ctx.strokeStyle = trafficColor;
      ctx.lineWidth = Math.max(5, 8 * scale);
      ctx.globalAlpha = 0.18;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    });

    // 3. Draw Vehicle Trajectory Path (if active vehicle exists)
    const activeVehicle = mockVehicles[simulationEngine.state.selectedVehicle];
    if (activeVehicle && (currentLayer === 'all' || currentLayer === 'trajectory')) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = Math.max(2, 3 * scale);
      ctx.setLineDash([6 * scale, 6 * scale]);
      ctx.beginPath();
      activeVehicle.trajectory.forEach((pt, index) => {
        const node = cityNodes[pt.area];
        if (node) {
          const ptCoord = getMapPoint(node.x, node.y);
          if (index === 0) ctx.moveTo(ptCoord.x, ptCoord.y);
          else ctx.lineTo(ptCoord.x, ptCoord.y);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 4. Draw Animated Traffic Flow Particles
    particles.forEach(p => {
      p.t += p.speed;
      if (p.t > 1) {
        p.t = 0;
        p.corridor = cityCorridors[Math.floor(Math.random() * cityCorridors.length)];
      }

      const p1 = cityNodes[p.corridor.from];
      const p2 = cityNodes[p.corridor.to];
      if (p1 && p2) {
        const pt1 = getMapPoint(p1.x, p1.y);
        const pt2 = getMapPoint(p2.x, p2.y);
        const px = pt1.x + (pt2.x - pt1.x) * p.t;
        const py = pt1.y + (pt2.y - pt1.y) * p.t;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1.8, 2.4 * scale), 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 5. Draw Area Node Badges
    Object.entries(cityNodes).forEach(([key, node]) => {
      const pt = getMapPoint(node.x, node.y);
      const nx = pt.x;
      const ny = pt.y;

      // Outer Ring
      ctx.fillStyle = '#0b1120';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(nx, ny, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Node Code
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.code, nx, ny);

      // Area Name Text Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const nameWidth = ctx.measureText(node.name).width;
      ctx.fillRect(nx - nameWidth / 2 - 5, ny + 17, nameWidth + 10, 15);
      ctx.strokeRect(nx - nameWidth / 2 - 5, ny + 17, nameWidth + 10, 15);
      
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText(node.name, nx, ny + 25);
    });

    ctx.restore();

    renderSvgMarkers(w, h);
    animId = requestAnimationFrame(drawMap);
  }

  // Render SVG interactive layer for crisp clickable icons & telemetry cones
  function renderSvgMarkers(w, h) {
    const state = simulationEngine.state;
    let svgHtml = '';

    const scale = Math.min(w / WORLD_W, h / WORLD_H);
    const mapW = WORLD_W * scale;
    const mapH = WORLD_H * scale;
    const originX = (w - mapW) / 2;
    const originY = (h - mapH) / 2;

    const applyTransform = (nx, ny) => {
      const baseX = originX + nx * mapW;
      const baseY = originY + ny * mapH;
      const screenX = (baseX - w / 2) * zoom + w / 2 + offsetX;
      const screenY = (baseY - h / 2) * zoom + h / 2 + offsetY;
      return { x: screenX, y: screenY };
    };

    // A. Fixed CCTV Cameras
    if (currentLayer === 'all' || currentLayer === 'cctv') {
      state.cameras.forEach(cam => {
        const node = cityNodes[cam.area];
        if (!node) return;
        const offsetJitterX = (parseInt(cam.id.slice(-2)) % 3 - 1) * 0.032;
        const offsetJitterY = (parseInt(cam.id.slice(-2)) % 2 - 0.5) * 0.038;
        const pos = applyTransform(node.x + offsetJitterX, node.y + offsetJitterY);

        svgHtml += `
          <g class="cctv-marker cursor-pointer group" data-type="camera" data-id="${cam.id}" transform="translate(${pos.x}, ${pos.y})">
            <!-- FOV Radar Cone -->
            <path d="M 0 0 L -18 -26 A 30 30 0 0 1 18 -26 Z" fill="rgba(56, 189, 248, 0.15)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="0.5"/>
            <!-- Camera Icon Circle -->
            <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" class="transition-transform group-hover:scale-125"/>
            <text x="0" y="3" font-size="8" font-family="JetBrains Mono" font-weight="bold" fill="#38bdf8" text-anchor="middle">CAM</text>
          </g>
        `;
      });
    }

    // B. Public Bus Sensing Nodes (STRICTLY NO VIDEO - Mobile sensing telemetry marker only)
    if (currentLayer === 'all' || currentLayer === 'bus') {
      state.buses.forEach(bus => {
        const node = cityNodes[bus.area];
        if (!node) return;
        const pos = applyTransform(node.x + (Math.sin(Date.now() * 0.001 + bus.kmAnalyzed) * 0.05), node.y + (Math.cos(Date.now() * 0.001 + bus.kmAnalyzed) * 0.05));

        svgHtml += `
          <g class="bus-marker cursor-pointer group" data-type="bus" data-id="${bus.id}" transform="translate(${pos.x}, ${pos.y})">
            <!-- Pulsing Sensing Ring -->
            <circle cx="0" cy="0" r="14" fill="none" stroke="#a855f7" stroke-width="1" stroke-dasharray="3 3" opacity="0.6"/>
            <!-- Bus Circle -->
            <circle cx="0" cy="0" r="9" fill="#0f172a" stroke="#a855f7" stroke-width="1.5" class="transition-transform group-hover:scale-125"/>
            <text x="0" y="3" font-size="7" font-family="JetBrains Mono" font-weight="bold" fill="#c084fc" text-anchor="middle">BUS</text>
          </g>
        `;
      });
    }

    // C. Road Issues (Potholes, Waterlogging, Dividers, Signs)
    if (currentLayer === 'all' || currentLayer === 'road_issues') {
      state.roadIssues.forEach(issue => {
        const node = cityNodes[issue.area];
        if (!node) return;
        const pos = applyTransform(node.x + 0.025, node.y - 0.03);

        const color = issue.severity === 'Critical' ? '#ef4444' : issue.severity === 'High' ? '#f59e0b' : '#38bdf8';

        svgHtml += `
          <g class="issue-marker cursor-pointer group" data-type="issue" data-id="${issue.id}" transform="translate(${pos.x}, ${pos.y})">
            <rect x="-8" y="-8" width="16" height="16" transform="rotate(45)" fill="#0f172a" stroke="${color}" stroke-width="1.5" class="transition-transform group-hover:scale-125"/>
            <text x="0" y="3" font-size="8" font-family="sans-serif" font-weight="bold" fill="${color}" text-anchor="middle">!</text>
          </g>
        `;
      });
    }

    // D. Incidents
    if (currentLayer === 'all' || currentLayer === 'incidents') {
      state.incidents.forEach(inc => {
        const node = cityNodes[inc.area];
        if (!node) return;
        const pos = applyTransform(node.x - 0.03, node.y + 0.035);

        svgHtml += `
          <g class="incident-marker cursor-pointer group" data-type="incident" data-id="${inc.id}" transform="translate(${pos.x}, ${pos.y})">
            <circle cx="0" cy="0" r="10" fill="#ef4444" opacity="0.25"/>
            <circle cx="0" cy="0" r="8" fill="#0f172a" stroke="#ef4444" stroke-width="1.5" class="transition-transform group-hover:scale-125"/>
            <text x="0" y="3" font-size="7" font-family="JetBrains Mono" font-weight="bold" fill="#f87171" text-anchor="middle">INC</text>
          </g>
        `;
      });
    }

    svgOverlay.innerHTML = svgHtml;
    bindSvgInteractions();
  }

  // Bind Marker Clicks to Open Popups / Inspector
  function bindSvgInteractions() {
    svgOverlay.querySelectorAll('[data-type]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = el.getAttribute('data-type');
        const id = el.getAttribute('data-id');
        const rect = el.getBoundingClientRect();
        const mapRect = svgOverlay.getBoundingClientRect();

        const x = rect.left - mapRect.left + 20;
        const y = rect.top - mapRect.top - 10;

        showGisPopup(type, id, x, y);
      });
    });
  }

  function showGisPopup(type, id, x, y) {
    if (!popup) return;
    const state = simulationEngine.state;
    let html = '';

    if (type === 'camera') {
      const cam = state.cameras.find(c => c.id === id);
      if (!cam) return;
      html = `
        <div class="space-y-1.5 font-mono">
          <div class="flex items-center justify-between border-b border-slate-700 pb-1">
            <span class="font-bold text-cctv-blue">${cam.id}</span>
            <span class="text-[10px] text-emerald-400">● ${cam.status}</span>
          </div>
          <div class="text-[11px] text-slate-300">${cam.name}</div>
          <div class="text-[10px] text-slate-400">Area: <span class="text-white">${cam.areaName}</span></div>
          <div class="text-[10px] text-slate-400">Rate: <span class="text-white">${cam.vehiclesPerHr} veh/hr</span></div>
          <button id="btn-popup-inspect-cam" class="w-full mt-2 py-1 px-2 rounded bg-blue-600/30 border border-blue-500 text-cctv-blue hover:bg-blue-600/50 text-[11px] font-semibold transition-colors">
            View Live Stream
          </button>
        </div>
      `;
    } else if (type === 'bus') {
      const bus = state.buses.find(b => b.id === id);
      if (!bus) return;
      html = `
        <div class="space-y-1.5 font-mono">
          <div class="flex items-center justify-between border-b border-slate-700 pb-1">
            <span class="font-bold text-bus-purple">${bus.id} (Mobile Sensing)</span>
            <span class="text-[10px] text-emerald-400">● ${bus.status}</span>
          </div>
          <div class="text-[11px] text-slate-300">${bus.route}</div>
          <div class="text-[10px] text-slate-400">Road KM Analyzed: <span class="text-white font-bold">${bus.kmAnalyzed} km</span></div>
          <div class="text-[10px] text-slate-400">Road Issues Flagged: <span class="text-amber-400 font-bold">${bus.issuesDetected}</span></div>
          <div class="text-[9px] text-purple-300 italic">Edge AI Inference: Potholes, Waterlogging, Signs</div>
        </div>
      `;
    } else if (type === 'issue') {
      const issue = state.roadIssues.find(i => i.id === id);
      if (!issue) return;
      html = `
        <div class="space-y-1.5 font-mono">
          <div class="flex items-center justify-between border-b border-slate-700 pb-1">
            <span class="font-bold text-warn-yellow">${issue.type}</span>
            <span class="text-[10px] font-bold ${issue.severity === 'Critical' ? 'text-red-400' : 'text-amber-400'}">${issue.severity}</span>
          </div>
          <div class="text-[11px] text-slate-300">${issue.description}</div>
          <div class="text-[10px] text-slate-400">Detected by: <span class="text-purple-400">${issue.detectedBy}</span></div>
          <div class="text-[10px] text-slate-400">Confidence: <span class="text-emerald-400 font-bold">${issue.confidence}%</span></div>
          <button id="btn-popup-inspect-issue" class="w-full mt-2 py-1 px-2 rounded bg-amber-600/30 border border-amber-500 text-warn-yellow hover:bg-amber-600/50 text-[11px] font-semibold transition-colors">
            Inspect Road Issue
          </button>
        </div>
      `;
    } else if (type === 'incident') {
      const inc = state.incidents.find(i => i.id === id);
      if (!inc) return;
      html = `
        <div class="space-y-1.5 font-mono">
          <div class="flex items-center justify-between border-b border-slate-700 pb-1">
            <span class="font-bold text-alert-red">${inc.id}</span>
            <span class="text-[10px] font-bold text-red-400">${inc.severity}</span>
          </div>
          <div class="text-[11px] text-slate-200 font-semibold">${inc.type}</div>
          <div class="text-[10px] text-slate-400">Source: <span class="text-white">${inc.source}</span></div>
          <div class="text-[10px] text-slate-400">Status: <span class="text-amber-400">${inc.status}</span></div>
          <button id="btn-popup-inspect-incident" class="w-full mt-2 py-1 px-2 rounded bg-red-600/30 border border-red-500 text-red-300 hover:bg-red-600/50 text-[11px] font-semibold transition-colors">
            Open Incident
          </button>
        </div>
      `;
    }

    popup.innerHTML = html;
    popup.style.left = `${Math.min(x, svgOverlay.clientWidth - 220)}px`;
    popup.style.top = `${Math.min(y, svgOverlay.clientHeight - 180)}px`;
    popup.classList.remove('hidden');

    // Bind action buttons inside popup
    const camBtn = popup.querySelector('#btn-popup-inspect-cam');
    if (camBtn) {
      camBtn.addEventListener('click', () => {
        const cam = state.cameras.find(c => c.id === id);
        if (window.openCameraModal) window.openCameraModal(cam);
        popup.classList.add('hidden');
      });
    }

    const issueBtn = popup.querySelector('#btn-popup-inspect-issue');
    if (issueBtn) {
      issueBtn.addEventListener('click', () => {
        const issue = state.roadIssues.find(i => i.id === id);
        if (window.openRoadIssueModal) window.openRoadIssueModal(issue);
        popup.classList.add('hidden');
      });
    }

    const incBtn = popup.querySelector('#btn-popup-inspect-incident');
    if (incBtn) {
      incBtn.addEventListener('click', () => {
        if (window.navigateTo) window.navigateTo('incidents');
        popup.classList.add('hidden');
      });
    }
  }

  // Close popup when clicking on canvas background
  svgOverlay.addEventListener('click', () => {
    if (popup) popup.classList.add('hidden');
  });

  // Layer filter handler
  if (layerSelect) {
    layerSelect.addEventListener('change', (e) => {
      currentLayer = e.target.value;
    });
  }

  // Expand / Fullscreen
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      if (window.navigateTo) window.navigateTo(isFullScreen ? 'dashboard' : 'map_view');
    });
  }

  // Interactive Drag / Pan Controls
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  svgOverlay.addEventListener('mousedown', (e) => {
    if (e.target.closest('[data-type]')) return;
    isDragging = true;
    dragStartX = e.clientX - offsetX;
    dragStartY = e.clientY - offsetY;
    svgOverlay.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    offsetX = e.clientX - dragStartX;
    offsetY = e.clientY - dragStartY;
    const maxBound = 700 * zoom;
    offsetX = Math.max(-maxBound, Math.min(maxBound, offsetX));
    offsetY = Math.max(-maxBound, Math.min(maxBound, offsetY));
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      svgOverlay.style.cursor = 'crosshair';
    }
  });

  // Mouse Wheel Smooth Zoom
  svgOverlay.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.88;
    zoom = Math.max(0.7, Math.min(3.5, zoom * factor));
  }, { passive: false });

  // Map Controls (Zoom In, Zoom Out, Recenter)
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      zoom = Math.min(zoom * 1.25, 3.5);
    });
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      zoom = Math.max(zoom / 1.25, 0.7);
    });
  }
  if (recenterBtn) {
    recenterBtn.addEventListener('click', () => {
      zoom = 1;
      offsetX = 0;
      offsetY = 0;
    });
  }

  drawMap();
}
