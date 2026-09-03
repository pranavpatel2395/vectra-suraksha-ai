/**
 * Vectra Jansadak Suraksha AI - Master Application Orchestrator & Router
 */

import { simulationEngine } from './data/simulationEngine.js';
import { renderHeader } from './components/header.js';
import { renderSidebar } from './components/sidebar.js';
import { setupModals } from './components/modals.js';

// Views
import { renderDashboardView } from './views/dashboardView.js';
import { renderAreasView } from './views/areasView.js';
import { renderCctvMonitoringView } from './views/cctvMonitoringView.js';
import { renderMapMonitoringView } from './views/mapMonitoringView.js';
import { renderAnprVehiclesView } from './views/anprVehiclesView.js';
import { renderTrajectoriesView } from './views/trajectoriesView.js';
import { renderTrafficAnalyticsView } from './views/trafficAnalyticsView.js';
import { renderRoadHealthView } from './views/roadHealthView.js';
import { renderBusFleetView } from './views/busFleetView.js';
import { renderIncidentsView } from './views/incidentsView.js';
import { renderAlertsCenterView } from './views/alertsCenterView.js';
import { renderAiAssistantView } from './views/aiAssistantView.js';
import { renderReportsView } from './views/reportsView.js';
import { renderSettingsView } from './views/settingsView.js';

export function safeCreateIcons() {
  try {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  } catch (e) {
    console.warn('Lucide icon rendering warning:', e);
  }
}

class VectraApp {
  constructor() {
    this.currentView = 'dashboard';
    this.sidebarContainer = document.getElementById('sidebar-container');
    this.headerContainer = document.getElementById('header-container');
    this.mainViewContainer = document.getElementById('main-view-container');
  }

  init() {
    console.log('🚀 Initializing Vectra Jansadak Suraksha AI...');

    // 1. Setup Modals & Toast Dispatcher
    try {
      setupModals();
    } catch (e) {
      console.error('Error in setupModals:', e);
    }

    // 2. Render Header & Sidebar Shells
    try {
      if (this.headerContainer) renderHeader(this.headerContainer);
      if (this.sidebarContainer) renderSidebar(this.sidebarContainer, this.currentView);
    } catch (e) {
      console.error('Error rendering header/sidebar:', e);
    }

    // 3. Expose Global Router
    window.navigateTo = (viewId) => {
      this.navigate(viewId);
    };

    // 4. Render Initial View
    try {
      this.renderCurrentView();
    } catch (e) {
      console.error('Error rendering initial view:', e);
    }

    // 5. Subscribe to Simulation Engine State Updates
    simulationEngine.subscribe(() => {
      try {
        if (this.sidebarContainer) renderSidebar(this.sidebarContainer, this.currentView);

        if (this.currentView === 'dashboard') {
          const row1 = document.getElementById('dashboard-row-1');
          if (row1) {
            import('./components/kpiCards.js').then(m => m.renderKpiCards(row1)).catch(console.error);
          }
          const sensingContainer = document.getElementById('dashboard-road-sensing-container');
          if (sensingContainer) {
            import('./components/roadHealthCard.js').then(m => m.renderRoadHealthCard(sensingContainer)).catch(console.error);
          }
          const alertsContainer = document.getElementById('dashboard-alerts-container');
          if (alertsContainer) {
            import('./components/alertsPanel.js').then(m => m.renderAlertsPanel(alertsContainer)).catch(console.error);
          }
        }
      } catch (err) {
        console.error('Simulation subscriber update error:', err);
      }
    });

    safeCreateIcons();
    console.log('✅ Vectra Jansadak Suraksha AI initialized and rendered successfully.');
  }

  navigate(viewId) {
    this.currentView = viewId;
    if (this.sidebarContainer) renderSidebar(this.sidebarContainer, this.currentView);
    this.renderCurrentView();

    if (this.mainViewContainer) {
      this.mainViewContainer.scrollTop = 0;
    }
  }

  renderCurrentView() {
    if (!this.mainViewContainer) {
      console.error('mainViewContainer not found in DOM');
      return;
    }
    this.mainViewContainer.innerHTML = '';

    switch (this.currentView) {
      case 'dashboard':
        renderDashboardView(this.mainViewContainer);
        break;
      case 'areas':
        renderAreasView(this.mainViewContainer);
        break;
      case 'cctv_cameras':
      case 'monitoring':
        renderCctvMonitoringView(this.mainViewContainer);
        break;
      case 'map_view':
        renderMapMonitoringView(this.mainViewContainer);
        break;
      case 'anpr':
        renderAnprVehiclesView(this.mainViewContainer);
        break;
      case 'trajectories':
        renderTrajectoriesView(this.mainViewContainer);
        break;
      case 'traffic_analytics':
        renderTrafficAnalyticsView(this.mainViewContainer);
        break;
      case 'road_health':
        renderRoadHealthView(this.mainViewContainer);
        break;
      case 'bus_fleet':
        renderBusFleetView(this.mainViewContainer);
        break;
      case 'incidents':
        renderIncidentsView(this.mainViewContainer);
        break;
      case 'alerts':
        renderAlertsCenterView(this.mainViewContainer);
        break;
      case 'ai_assistant':
        renderAiAssistantView(this.mainViewContainer);
        break;
      case 'reports':
        renderReportsView(this.mainViewContainer);
        break;
      case 'settings':
        renderSettingsView(this.mainViewContainer);
        break;
      default:
        renderDashboardView(this.mainViewContainer);
        break;
    }

    safeCreateIcons();
  }
}

// Immediate robust execution
function startApp() {
  try {
    const app = new VectraApp();
    app.init();
    window.vectraApp = app;
  } catch (err) {
    console.error('Fatal initialization error:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  // DOM is already parsed/interactive, run immediately
  startApp();
}
