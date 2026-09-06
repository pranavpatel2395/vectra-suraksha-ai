/**
 * Vectra Jansadak Suraksha AI - Modals & Detailed Inspectors Component
 */

import { simulationEngine } from '../data/simulationEngine.js';
import { 
  getStandardVehiclesForCamera, 
  drawPerspectiveRoad, 
  drawRealisticVehicle, 
  getLaneX 
} from '../utils/vehicleRenderer.js';

export function setupModals() {
  const modalContainer = document.getElementById('modal-container');
  const toastContainer = document.getElementById('toast-container');

  // Global Toast Dispatcher
  window.showToast = (message, type = 'info') => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    const borderBg = type === 'critical' || type === 'error' ? 'border-red-500 bg-red-950/95 text-red-200' : type === 'warning' ? 'border-amber-500 bg-amber-950/95 text-amber-200' : 'border-blue-500 bg-slate-900/95 text-slate-100';
    
    toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-lg border ${borderBg} shadow-2xl text-xs font-mono backdrop-blur-md transition-all duration-300 transform translate-y-2 opacity-0`;
    toast.innerHTML = `
      <i data-lucide="${type === 'critical' ? 'alert-octagon' : type === 'warning' ? 'alert-triangle' : 'info'}" class="w-4 h-4 flex-shrink-0"></i>
      <span class="flex-1">${message}</span>
      <button class="text-slate-400 hover:text-white ml-2 text-sm">&times;</button>
    `;

    toastContainer.appendChild(toast);
    if (window.lucide) window.lucide.createIcons({ root: toast });

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    const closeBtn = toast.querySelector('button');
    const dismiss = () => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    };

    closeBtn?.addEventListener('click', dismiss);
    setTimeout(dismiss, 4500);
  };

  // 1. Road Issue Inspector Modal
  window.openRoadIssueModal = (issue) => {
    if (!modalContainer || !issue) return;

    modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto';
    modalContainer.innerHTML = `
      <div class="bg-command-card border border-command-border-bright rounded-lg w-full max-w-lg overflow-hidden shadow-2xl flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-command-border bg-command-dark">
          <div class="flex items-center gap-2.5">
            <div class="p-1.5 rounded bg-amber-950/80 text-warn-yellow border border-amber-500/30">
              <i data-lucide="alert-triangle" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white tracking-wide">Road Issue Details: ${issue.id}</h3>
              <p class="text-[11px] text-slate-400">Mobile transit bus edge sensing telemetry</p>
            </div>
          </div>
          <button id="btn-close-modal" class="text-slate-400 hover:text-white text-lg p-1">&times;</button>
        </div>

        <!-- Body Content -->
        <div class="p-4 space-y-3.5 text-xs font-mono">
          <div class="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded border border-slate-800">
            <div>
              <span class="text-[10px] text-slate-400 block">Issue Type:</span>
              <span class="text-sm font-bold text-warn-yellow">${issue.type}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block">Severity:</span>
              <span class="text-sm font-bold ${issue.severity === 'Critical' ? 'text-red-400' : 'text-amber-400'}">${issue.severity}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block">Confidence:</span>
              <span class="text-emerald-400 font-bold text-sm">${issue.confidence}%</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block">Status:</span>
              <span class="text-slate-200 font-bold">${issue.status}</span>
            </div>
          </div>

          <div class="space-y-1 text-slate-300">
            <div class="text-[11px] font-sans font-semibold text-slate-200">Description & Observations:</div>
            <p class="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed">
              ${issue.description}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div>Area: <b class="text-white">${issue.areaName}</b></div>
            <div>Detected By: <b class="text-purple-400">${issue.detectedBy} (Bus Edge AI)</b></div>
            <div>GPS Location: <b class="text-slate-200">${issue.lat}° N, ${issue.lng}° E</b></div>
            <div>Timestamp: <b class="text-slate-200">${issue.timestamp}</b></div>
            <div>Estimated Depth: <b class="text-amber-300">${issue.depthEst}</b></div>
            <div>Surface Area: <b class="text-slate-200">${issue.surfaceArea}</b></div>
          </div>

          <div class="p-2 rounded bg-purple-950/20 border border-purple-800/30 text-[10px] text-purple-300">
            <b>Edge AI Pipeline Note:</b> Detection triggered by onboard optical convolution + multi-axis accelerometer peak. No raw video feed stored on central server.
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-3 border-t border-command-border bg-command-dark flex items-center justify-between gap-2">
          <button id="btn-modal-map" class="px-3 py-1.5 rounded bg-command-card border border-command-border hover:border-cctv-blue text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-cctv-blue"></i>
            <span>View on Map</span>
          </button>
          
          <div class="flex items-center gap-2">
            <button id="btn-modal-create-incident" class="px-3.5 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow transition-colors flex items-center gap-1.5">
              <i data-lucide="file-plus" class="w-3.5 h-3.5"></i>
              <span>Create Incident / Work Order</span>
            </button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons({ root: modalContainer });

    const closeBtn = modalContainer.querySelector('#btn-close-modal');
    closeBtn?.addEventListener('click', closeModal);

    modalContainer.querySelector('#btn-modal-map')?.addEventListener('click', () => {
      closeModal();
      if (window.navigateTo) window.navigateTo('map_view');
    });

    modalContainer.querySelector('#btn-modal-create-incident')?.addEventListener('click', () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Add incident to state
      const newInc = {
        id: `INC-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        type: `Hazard: ${issue.type}`,
        category: 'Road Hazard',
        source: `${issue.detectedBy} (${issue.areaName})`,
        area: issue.area,
        areaName: issue.areaName,
        timestamp: `${timeStr}, ${dateStr}`,
        gps: `${issue.lat}° N, ${issue.lng}° E`,
        confidence: `${issue.confidence}%`,
        severity: issue.severity,
        status: 'New',
        description: issue.description
      };
      simulationEngine.state.incidents.unshift(newInc);
      closeModal();
      window.showToast(`Incident #${newInc.id} created successfully & dispatched to PWD`, 'info');
      if (window.navigateTo) window.navigateTo('incidents');
    });
  };

  // 2. Camera Inspector Modal
  window.openCameraModal = (camera) => {
    if (!modalContainer || !camera) return;

    modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto';
    modalContainer.innerHTML = `
      <div class="bg-command-card border border-command-border-bright rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between p-4 border-b border-command-border bg-command-dark">
          <div class="flex items-center gap-2.5">
            <div class="p-1.5 rounded bg-sky-950/80 text-cctv-blue border border-sky-500/30">
              <i data-lucide="video" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white tracking-wide">Live Camera Stream: ${camera.id} (${camera.name})</h3>
              <p class="text-[11px] text-slate-400">Area: ${camera.areaName} • Stream Rate: ${camera.fps} FPS • ${camera.resolution}</p>
            </div>
          </div>
          <button id="btn-close-modal" class="text-slate-400 hover:text-white text-lg p-1">&times;</button>
        </div>

        <div class="p-4 space-y-3">
          <!-- Canvas High Res Stream -->
          <div class="relative w-full aspect-video bg-slate-950 rounded border border-command-border overflow-hidden">
            <canvas id="modal-cctv-canvas" class="w-full h-full block"></canvas>
            <div class="cctv-scanline"></div>
            <div class="absolute top-2 left-2 flex items-center gap-2 bg-black/80 px-2 py-0.5 rounded font-mono text-[10px] text-cctv-blue border border-slate-700">
              <span>● RTSP HD STREAM</span>
              <span>|</span>
              <span class="text-emerald-400 font-bold">ANPR OCR ACTIVE</span>
            </div>
          </div>

          <!-- Camera Stream Metrics -->
          <div class="grid grid-cols-3 gap-2 text-xs font-mono">
            <div class="p-2 rounded bg-slate-950 border border-slate-800">
              <span class="text-[10px] text-slate-400 block">Traffic Volume:</span>
              <span class="text-white font-bold">${camera.vehiclesPerHr} veh/hr</span>
            </div>
            <div class="p-2 rounded bg-slate-950 border border-slate-800">
              <span class="text-[10px] text-slate-400 block">Direction:</span>
              <span class="text-cctv-blue font-bold">${camera.direction}</span>
            </div>
            <div class="p-2 rounded bg-slate-950 border border-slate-800">
              <span class="text-[10px] text-slate-400 block">Model Pipeline:</span>
              <span class="text-emerald-400 font-bold">YOLO-ANPR-v8</span>
            </div>
          </div>
        </div>

        <div class="p-3 border-t border-command-border bg-command-dark flex items-center justify-end">
          <button id="btn-close-modal-btn" class="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
            Close Stream
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons({ root: modalContainer });

    modalContainer.querySelector('#btn-close-modal')?.addEventListener('click', closeModal);
    modalContainer.querySelector('#btn-close-modal-btn')?.addEventListener('click', closeModal);

    // Start modal camera canvas
    startModalCanvas(camera);
  };

  // 3. Vehicle Full Forensic History Modal
  window.openVehicleHistoryModal = (vehicle) => {
    if (!modalContainer || !vehicle) return;

    modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto';
    modalContainer.innerHTML = `
      <div class="bg-command-card border border-command-border-bright rounded-lg w-full max-w-xl overflow-hidden shadow-2xl flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between p-4 border-b border-command-border bg-command-dark">
          <div class="flex items-center gap-2.5">
            <div class="p-1.5 rounded bg-blue-950 text-cctv-blue border border-blue-500/30">
              <i data-lucide="history" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white tracking-wide">Vehicle History: ${vehicle.plateNumber}</h3>
              <p class="text-[11px] text-slate-400">Multi-Camera Spatial-Temporal Detection Audit Log</p>
            </div>
          </div>
          <button id="btn-close-modal" class="text-slate-400 hover:text-white text-lg p-1">&times;</button>
        </div>

        <div class="p-4 space-y-3 font-mono text-xs max-h-[360px] overflow-y-auto">
          <div class="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-slate-400 block">Class / Model:</span>
              <span class="text-white font-bold">${vehicle.color} ${vehicle.type}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block">Classification Confidence:</span>
              <span class="text-emerald-400 font-bold">${vehicle.ocrConfidence}%</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block">Watchlist Flag:</span>
              <span class="${vehicle.status === 'Blacklisted' ? 'text-red-400' : 'text-emerald-400'} font-bold">${vehicle.status}</span>
            </div>
          </div>

          <div class="space-y-2">
            <div class="text-[11px] font-sans font-semibold text-slate-200">Chronological CCTV Frame Captures:</div>
            ${vehicle.trajectory.map((t, idx) => `
              <div class="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded bg-blue-600/30 text-cctv-blue text-[10px] font-bold flex items-center justify-center">${idx + 1}</span>
                  <div>
                    <div class="font-bold text-slate-200">${t.camera} (${t.areaName})</div>
                    <div class="text-[10px] text-slate-400">Heading: ${t.direction} • Point: ${t.lat}°, ${t.lng}°</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-white">${t.time}</div>
                  <div class="text-[10px] text-emerald-400">OCR: ${t.confidence}%</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="p-3 border-t border-command-border bg-command-dark flex items-center justify-between">
          <span class="text-[10px] text-slate-500 font-mono">Forensic Evidence Chain Verified</span>
          <button id="btn-close-modal-btn" class="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
            Done
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons({ root: modalContainer });
    modalContainer.querySelector('#btn-close-modal')?.addEventListener('click', closeModal);
    modalContainer.querySelector('#btn-close-modal-btn')?.addEventListener('click', closeModal);
  };

  // 4. Alert Inspector Modal
  window.openAlertModal = (alert) => {
    if (!modalContainer || !alert) return;

    modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto';
    modalContainer.innerHTML = `
      <div class="bg-command-card border border-command-border-bright rounded-lg w-full max-w-md overflow-hidden shadow-2xl flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between p-4 border-b border-command-border bg-command-dark">
          <div class="flex items-center gap-2.5">
            <div class="p-1.5 rounded ${alert.severity === 'critical' ? 'bg-red-950 text-alert-red' : 'bg-amber-950 text-warn-yellow'} border border-slate-700">
              <i data-lucide="bell" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white tracking-wide">${alert.title}</h3>
              <p class="text-[11px] text-slate-400">Source: ${alert.source} (${alert.sourceType})</p>
            </div>
          </div>
          <button id="btn-close-modal" class="text-slate-400 hover:text-white text-lg p-1">&times;</button>
        </div>

        <div class="p-4 space-y-3 font-mono text-xs">
          <div class="p-3 rounded bg-slate-950 border border-slate-800">
            <div class="text-slate-300 text-[11px] leading-relaxed">${alert.desc}</div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div>Area: <b class="text-white">${alert.areaName}</b></div>
            <div>Timestamp: <b class="text-white">${alert.time}</b></div>
            <div>Severity: <b class="uppercase ${alert.severity === 'critical' ? 'text-red-400' : 'text-amber-400'}">${alert.severity}</b></div>
            <div>Status: <b class="${alert.acknowledged ? 'text-emerald-400' : 'text-amber-400'}">${alert.acknowledged ? 'Acknowledged' : 'Pending Action'}</b></div>
          </div>
        </div>

        <div class="p-3 border-t border-command-border bg-command-dark flex items-center justify-between gap-2">
          <button id="btn-ack-alert" class="px-3.5 py-1.5 rounded bg-emerald-600/30 border border-emerald-500 text-emerald-300 hover:bg-emerald-600/50 text-xs font-semibold transition-colors">
            Acknowledge Alert
          </button>
          <button id="btn-dispatch-alert" class="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
            Dispatch Patrol Unit
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons({ root: modalContainer });
    modalContainer.querySelector('#btn-close-modal')?.addEventListener('click', closeModal);

    modalContainer.querySelector('#btn-ack-alert')?.addEventListener('click', () => {
      alert.acknowledged = true;
      closeModal();
      window.showToast(`Alert ${alert.id} marked as Acknowledged`, 'info');
    });

    modalContainer.querySelector('#btn-dispatch-alert')?.addEventListener('click', () => {
      closeModal();
      window.showToast(`Patrol Unit Dispatched to ${alert.areaName}`, 'info');
    });
  };

  // 5. Report Preview Modal
  window.openReportModal = (reportTitle, data) => {
    if (!modalContainer) return;

    const reportDateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm pointer-events-auto';
    modalContainer.innerHTML = `
      <div class="bg-command-card border border-command-border-bright rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col font-sans max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between p-4 border-b border-command-border bg-command-dark">
          <div class="flex items-center gap-2.5">
            <div class="p-1.5 rounded bg-blue-950 text-cctv-blue border border-blue-500/30">
              <i data-lucide="file-text" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white tracking-wide">${reportTitle}</h3>
              <p class="text-[11px] text-slate-400">Generated: ${reportDateStr} • Vectra Jansadak Suraksha AI</p>
            </div>
          </div>
          <button id="btn-close-modal" class="text-slate-400 hover:text-white text-lg p-1">&times;</button>
        </div>

        <div class="p-5 space-y-4 font-mono text-xs overflow-y-auto flex-1 bg-slate-950">
          <div class="p-4 rounded border border-slate-800 bg-slate-900/60 space-y-2">
            <div class="text-sm font-bold text-white border-b border-slate-800 pb-1">EXECUTIVE SUMMARY</div>
            <p class="text-slate-300 font-sans text-xs leading-relaxed">
              Official automated intelligence summary generated by Vectra Jansadak Suraksha AI Control Platform. Integrates 48 fixed CCTV ANPR detection points and 37 mobile bus-mounted road sensing units across all municipal corridors.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 text-slate-300">
            <div class="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span class="text-[10px] text-slate-400 block">Total Vehicles Today:</span>
              <span class="text-white font-bold text-sm">12,564</span>
            </div>
            <div class="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span class="text-[10px] text-slate-400 block">City Road Health Score:</span>
              <span class="text-amber-400 font-bold text-sm">72 / 100</span>
            </div>
          </div>

          <div class="p-3 rounded border border-slate-800 bg-slate-900/60">
            <div class="font-bold text-slate-200 mb-1">Target Evidence Details:</div>
            <pre class="text-[11px] text-slate-400 overflow-x-auto">${JSON.stringify(data || { summary: 'Official City Intelligence Export' }, null, 2)}</pre>
          </div>
        </div>

        <div class="p-3 border-t border-command-border bg-command-dark flex items-center justify-between">
          <span class="text-[10px] text-slate-500 font-mono">Format: PDF/CSV Ready</span>
          <div class="flex items-center gap-2">
            <button id="btn-download-csv" class="px-3.5 py-1.5 rounded bg-command-card border border-command-border hover:border-cctv-blue text-xs font-semibold text-white transition-colors">
              Download CSV
            </button>
            <button id="btn-print-pdf" class="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-colors">
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons({ root: modalContainer });
    modalContainer.querySelector('#btn-close-modal')?.addEventListener('click', closeModal);

    modalContainer.querySelector('#btn-download-csv')?.addEventListener('click', () => {
      closeModal();
      window.showToast('CSV Export Downloaded successfully', 'info');
    });

    modalContainer.querySelector('#btn-print-pdf')?.addEventListener('click', () => {
      window.print();
    });
  };

  function closeModal() {
    if (modalContainer) {
      modalContainer.className = 'fixed inset-0 pointer-events-none z-50 flex items-center justify-center';
      modalContainer.innerHTML = '';
    }
  }

  function startModalCanvas(camera) {
    const canvas = document.getElementById('modal-cctv-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = 640);
    let height = (canvas.height = 360);
    const horizonY = 90;
    const vpX = width / 2;

    const vehicles = getStandardVehiclesForCamera(camera?.id || 'CAM-01', 1);

    let frame = 0;
    function draw() {
      frame++;

      // 1. Draw highway with perspective lanes and road surface
      drawPerspectiveRoad(ctx, width, height, horizonY, vpX, frame);

      // 2. Draw multiple flowing vehicles with realistic metallic colors
      vehicles.forEach(v => {
        v.y += v.speed * 1.25;
        if (v.y > height + 45) {
          v.y = horizonY + 8;
          v.lane = (v.lane + 1) % 4;
        }

        const currentX = getLaneX(v.lane, v.y, width, height, horizonY);
        const t = Math.max(0, (v.y - horizonY) / (height - horizonY));
        const scale = 0.5 + t * 0.9;
        const vWidth = 38 * scale;
        const vHeight = 62 * scale;

        drawRealisticVehicle(ctx, currentX, v.y, vWidth, vHeight, v, v.isWanted);
      });

      if (modalContainer.innerHTML.includes('modal-cctv-canvas')) {
        requestAnimationFrame(draw);
      }
    }
    requestAnimationFrame(draw);
  }
}
