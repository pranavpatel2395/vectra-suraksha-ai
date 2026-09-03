/**
 * Vectra Jansadak Suraksha AI - Live Simulation Engine
 * Drives deterministic and dynamic real-time traffic, bus sensing, and camera telemetry
 */

import { mockAreas, mockCameras, mockBuses, mockRoadIssues, mockAlerts, mockIncidents, mockTrafficTrends } from './mockData.js';

class SimulationEngine {
  constructor() {
    this.isRunning = false;
    this.timer = null;
    this.speed = 1;
    this.tickCount = 0;
    this.subscribers = new Set();
    
    // Live Mutable State
    this.state = {
      activeCameras: 48,
      totalCameras: 52,
      activeBuses: 37,
      totalBuses: 42,
      vehiclesDetectedToday: 12564,
      trafficDensity: 76,
      activeAlertsCount: 7,
      roadHealthScore: 72,
      systemStatus: 'Operational',
      busesProcessed: 37,
      roadKmAnalyzed: 86.4,
      roadIssuesDetected: 26,
      safetyEvents: 9,
      selectedArea: 'all',
      selectedVehicle: 'UP16AB1234',
      selectedIssue: null,
      cameras: JSON.parse(JSON.stringify(mockCameras)),
      buses: JSON.parse(JSON.stringify(mockBuses)),
      roadIssues: JSON.parse(JSON.stringify(mockRoadIssues)),
      alerts: JSON.parse(JSON.stringify(mockAlerts)),
      incidents: JSON.parse(JSON.stringify(mockIncidents)),
      trafficTrends: JSON.parse(JSON.stringify(mockTrafficTrends))
    };
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    for (const sub of this.subscribers) {
      try {
        sub(this.state);
      } catch (err) {
        console.error('Simulation subscriber error:', err);
      }
    }
  }

  toggle() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
    return this.isRunning;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timer = setInterval(() => this.tick(), 2000 / this.speed);
    this.notify();
    if (window.showToast) {
      window.showToast('Live Simulation Started: Streaming telemetry & detections', 'info');
    }
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.notify();
    if (window.showToast) {
      window.showToast('Live Simulation Paused', 'warn');
    }
  }

  setArea(areaId) {
    this.state.selectedArea = areaId;
    this.notify();
  }

  setVehicle(plate) {
    this.state.selectedVehicle = plate;
    this.notify();
  }

  selectRoadIssue(issueId) {
    this.state.selectedIssue = this.state.roadIssues.find(i => i.id === issueId) || null;
    this.notify();
  }

  tick() {
    this.tickCount++;

    // 1. Increment vehicles count
    const increment = Math.floor(Math.random() * 4) + 1;
    this.state.vehiclesDetectedToday += increment;

    // 2. Modulate density slightly
    const densityDelta = (Math.random() - 0.5) * 1.5;
    this.state.trafficDensity = Math.min(95, Math.max(50, Math.round(this.state.trafficDensity + densityDelta)));

    // 3. Increment bus sensing telemetry
    this.state.roadKmAnalyzed = +(this.state.roadKmAnalyzed + 0.05).toFixed(1);
    
    // 4. Slightly jitter bus coordinates for moving on map
    this.state.buses.forEach((bus, index) => {
      const angle = (this.tickCount * 0.15) + index;
      bus.lat = +(bus.lat + Math.sin(angle) * 0.0003).toFixed(5);
      bus.lng = +(bus.lng + Math.cos(angle) * 0.0003).toFixed(5);
    });

    // 5. Occasionally trigger a simulated detection alert (every 10 ticks)
    if (this.tickCount % 10 === 0) {
      const newAlert = {
        id: `ALT-SIM-${Date.now().toString().slice(-4)}`,
        title: 'New Road Anomaly Logged',
        desc: `Minor pavement distress sensed by BUS-07 near GT Road`,
        severity: 'warning',
        source: 'BUS-07',
        sourceType: 'Bus Mobile Sensing',
        area: 'gt_road',
        areaName: 'GT Road',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: 'activity',
        acknowledged: false
      };
      this.state.alerts.unshift(newAlert);
      if (this.state.alerts.length > 12) this.state.alerts.pop();
      this.state.activeAlertsCount = this.state.alerts.filter(a => !a.acknowledged).length;
      
      if (window.soundEngine) {
        window.soundEngine.playAlert('warning');
      }
      if (window.showToast) {
        window.showToast(newAlert.title + ': ' + newAlert.desc, 'warning');
      }
    }

    this.notify();
  }
}

export const simulationEngine = new SimulationEngine();
