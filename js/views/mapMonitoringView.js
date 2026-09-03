/**
 * Vectra Jansadak Suraksha AI - Fullscreen GIS Map Monitoring View
 */

import { renderIntelligenceMap } from '../components/intelligenceMap.js';

export function renderMapMonitoringView(container) {
  container.innerHTML = `
    <div class="space-y-4 h-[calc(100vh-140px)] flex flex-col">
      <!-- Fullscreen Map Canvas Container -->
      <div id="fullscreen-map-wrapper" class="flex-1 w-full"></div>
    </div>
  `;

  const mapWrapper = container.querySelector('#fullscreen-map-wrapper');
  if (mapWrapper) {
    renderIntelligenceMap(mapWrapper, true);
  }
}
