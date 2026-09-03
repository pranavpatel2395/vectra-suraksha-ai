/**
 * Vectra Jansadak Suraksha AI - Reports Generator View
 */

import { simulationEngine } from '../data/simulationEngine.js';

export function renderReportsView(container) {
  const state = simulationEngine.state;

  const reportTemplates = [
    {
      id: 'rep_vehicle',
      title: 'Vehicle Intelligence Report',
      desc: 'Complete audit of license plate detections, vehicle classes, and matched CCTV cameras for a target vehicle.',
      icon: 'car',
      color: 'text-cctv-blue',
      format: 'PDF / CSV',
      lastGen: 'Today, 10:23 AM'
    },
    {
      id: 'rep_trajectory',
      title: 'Vehicle Trajectory Report',
      desc: 'Forensic spatial-temporal reconstructed route across all fixed city cameras with timestamps and confidence scores.',
      icon: 'git-commit',
      color: 'text-sky-400',
      format: 'PDF / GIS GeoJSON',
      lastGen: 'Today, 09:45 AM'
    },
    {
      id: 'rep_road_condition',
      title: 'Road Condition Report',
      desc: 'Aggregated pavement quality, pothole density, and road health scores analyzed via bus-mounted edge mobile sensors.',
      icon: 'activity',
      color: 'text-road-green',
      format: 'PDF / Excel',
      lastGen: 'Today, 08:30 AM'
    },
    {
      id: 'rep_infrastructure',
      title: 'Infrastructure Deficiency Report',
      desc: 'Actionable catalog of damaged dividers, missing zebra crossings, obscured traffic signs, and drainage blockages.',
      icon: 'alert-triangle',
      color: 'text-warn-yellow',
      format: 'PDF / PWD Work Order',
      lastGen: 'Today, 09:15 AM'
    },
    {
      id: 'rep_incident',
      title: 'Incident Report',
      desc: 'Comprehensive dispatch log, severity assessments, officer notes, and resolution lifecycle metrics.',
      icon: 'shield-alert',
      color: 'text-alert-red',
      format: 'PDF / CSV',
      lastGen: 'Today, 10:15 AM'
    },
    {
      id: 'rep_daily_city',
      title: 'Daily City Intelligence Report',
      desc: 'Executive summary combining 48 CCTV optical streams, 37 bus sensing units, 12,500+ vehicle counts, and city safety indices.',
      icon: 'file-text',
      color: 'text-purple-400',
      format: 'PDF / Full Briefing',
      lastGen: 'Today, 07:00 AM'
    }
  ];

  container.innerHTML = `
    <div class="space-y-4">
      <!-- Title -->
      <div class="bg-command-card border border-command-border p-4 rounded-lg flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <i data-lucide="file-text" class="w-5 h-5 text-cctv-blue"></i>
            <span>Automated City Intelligence Reports</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">
            Generate, preview, and export official municipal traffic, vehicle surveillance, and road condition reports.
          </p>
        </div>
      </div>

      <!-- Report Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        ${reportTemplates.map(rep => `
          <div data-report-id="${rep.id}" class="command-card p-4 flex flex-col justify-between hover:border-cctv-blue transition-all">
            <div>
              <div class="flex items-center justify-between mb-2.5">
                <div class="p-2 rounded bg-slate-950 border border-slate-800 ${rep.color}">
                  <i data-lucide="${rep.icon}" class="w-5 h-5"></i>
                </div>
                <span class="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  ${rep.format}
                </span>
              </div>

              <h2 class="text-sm font-bold text-white mb-1">${rep.title}</h2>
              <p class="text-xs text-slate-400 mb-3 leading-relaxed">
                ${rep.desc}
              </p>
            </div>

            <div class="pt-3 border-t border-command-border flex items-center justify-between">
              <span class="text-[10px] text-slate-500 font-mono">Last: ${rep.lastGen}</span>
              <button data-generate-report="${rep.title}" class="px-3 py-1.5 rounded bg-blue-600/20 hover:bg-blue-600 text-cctv-blue hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5">
                <i data-lucide="printer" class="w-3.5 h-3.5"></i>
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons({ root: container });

  container.querySelectorAll('[data-generate-report]').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-generate-report');
      if (window.openReportModal) {
        window.openReportModal(title, {
          reportType: title,
          generatedBy: 'Officer_01 (Traffic Control Room)',
          generatedAt: new Date().toLocaleString(),
          dataSources: '48 Fixed CCTV Units + 37 Public Bus Sensing Units',
          roadHealthScore: `${state.roadHealthScore}/100`,
          totalVehicles: state.vehiclesDetectedToday,
          status: 'Validated'
        });
      }
    });
  });
}
