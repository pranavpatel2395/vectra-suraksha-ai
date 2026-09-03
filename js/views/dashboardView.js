/**
 * Vectra Jansadak Suraksha AI
 * Main Dashboard View
 *
 * Stable command-center layout.
 *
 * ROW 1:
 * KPI cards
 *
 * ROW 2:
 * CCTV | GIS MAP | MOBILE ROAD SENSING
 *
 * ROW 3:
 * VEHICLE INTELLIGENCE + TRAJECTORY | RECENT ALERTS
 *
 * ROW 4:
 * TRAFFIC ANALYTICS
 *
 * ROW 5:
 * AI URBAN ASSISTANT
 */

import { renderKpiCards } from '../components/kpiCards.js';
import { renderCctvFeeds } from '../components/cctvFeeds.js';
import { renderIntelligenceMap } from '../components/intelligenceMap.js';
import { renderRoadHealthCard } from '../components/roadHealthCard.js';
import { renderAlertsPanel } from '../components/alertsPanel.js';
import { renderVehicleIntelligence } from '../components/vehicleSearch.js';
import { renderTrafficAnalytics } from '../components/trafficAnalytics.js';
import { renderAiAssistant } from '../components/aiAssistant.js';

export function renderDashboardView(container) {

  container.innerHTML = `

    <!-- =====================================================
         ROW 1 : KPI CARDS
    ====================================================== -->

    <section
      id="dashboard-row-1"
      class="w-full"
    ></section>


    <!-- =====================================================
         ROW 2 : PRIMARY COMMAND CENTER
         CCTV (4 cols) | MAP (5 cols) | ROAD SENSING (3 cols)
    ====================================================== -->

    <section
      class="dashboard-row w-full"
    >

      <!-- LEFT : CCTV (Locked 16:9 - 4 Columns) -->
      <div
        id="dashboard-cctv-container"
        class="min-w-0 w-full"
      ></div>


      <!-- CENTER : GIS MAP (Uniform Scale - 5 Columns) -->
      <div
        id="dashboard-map-container"
        class="min-w-0 w-full"
      ></div>


      <!-- RIGHT : ROAD SENSING (3 Columns) -->
      <div
        id="dashboard-road-sensing-container"
        class="min-w-0 w-full"
      ></div>

    </section>


    <!-- =====================================================
         ROW 3 : VEHICLE INTELLIGENCE + ALERTS
    ====================================================== -->

    <section
      class="dashboard-row w-full"
    >

      <!-- LEFT + CENTER : Vehicle Search + Trajectory (9 cols) -->
      <div
        id="dashboard-vehicle-container"
        class="min-w-0 w-full"
      ></div>


      <!-- RIGHT : Recent Alerts (3 cols) -->
      <div
        id="dashboard-alerts-container"
        class="min-w-0 w-full"
      ></div>

    </section>


    <!-- =====================================================
         ROW 4 : TRAFFIC ANALYTICS
    ====================================================== -->

    <section
      class="dashboard-row w-full"
    >

      <div
        id="dashboard-analytics-container"
        class="w-full min-w-0"
      ></div>

    </section>


    <!-- =====================================================
         ROW 5 : AI URBAN ASSISTANT
    ====================================================== -->

    <section
      class="dashboard-row w-full"
    >

      <div
        id="dashboard-ai-container"
        class="w-full min-w-0"
      ></div>

    </section>

  `;


  // =========================================================
  // DOM REFERENCES
  // =========================================================

  const row1 =
    container.querySelector('#dashboard-row-1');

  const cctvContainer =
    container.querySelector('#dashboard-cctv-container');

  const mapContainer =
    container.querySelector('#dashboard-map-container');

  const roadSensingContainer =
    container.querySelector('#dashboard-road-sensing-container');

  const alertsContainer =
    container.querySelector('#dashboard-alerts-container');

  const vehicleContainer =
    container.querySelector('#dashboard-vehicle-container');

  const analyticsContainer =
    container.querySelector('#dashboard-analytics-container');

  const aiContainer =
    container.querySelector('#dashboard-ai-container');


  // =========================================================
  // RENDER KPI CARDS
  // =========================================================

  if (row1) {
    renderKpiCards(row1);
  }


  // =========================================================
  // ROW 2
  // =========================================================

  if (cctvContainer) {
    renderCctvFeeds(cctvContainer);
  }

  if (mapContainer) {
    renderIntelligenceMap(mapContainer);
  }

  if (roadSensingContainer) {
    renderRoadHealthCard(roadSensingContainer);
  }


  // =========================================================
  // ROW 3
  // =========================================================

  if (vehicleContainer) {
    renderVehicleIntelligence(vehicleContainer);
  }

  if (alertsContainer) {
    renderAlertsPanel(alertsContainer);
  }


  // =========================================================
  // ROW 4
  // =========================================================

  if (analyticsContainer) {
    renderTrafficAnalytics(analyticsContainer);
  }


  // =========================================================
  // ROW 5
  // =========================================================

  if (aiContainer) {
    renderAiAssistant(aiContainer);
  }

}