/**
 * Vectra Jansadak Suraksha AI - Central Structured Mock Dataset
 * Real-time city surveillance & mobile road sensing data model
 */

// Dynamic date helpers so all timestamps reflect today's date automatically every day
export function getTodayDateStr(offsetDays = 0) {
  const d = new Date();
  if (offsetDays !== 0) d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getCurrentYear() {
  return new Date().getFullYear();
}

const currentFormattedDate = getTodayDateStr();
const currentYear = getCurrentYear();

export const mockAreas = [
  { id: 'all', name: 'All Areas', camerasCount: 48, busesCount: 37, healthScore: 72, trafficDensity: 76, activeAlerts: 7 },
  { id: 'mg_road', name: 'MG Road', camerasCount: 8, busesCount: 6, healthScore: 78, trafficDensity: 74, activeAlerts: 1, lat: 28.6139, lng: 77.2090 },
  { id: 'gt_road', name: 'GT Road', camerasCount: 9, busesCount: 7, healthScore: 61, trafficDensity: 82, activeAlerts: 2, lat: 28.6448, lng: 77.2167 },
  { id: 'ring_road', name: 'Ring Road', camerasCount: 7, busesCount: 5, healthScore: 84, trafficDensity: 88, activeAlerts: 1, lat: 28.5800, lng: 77.2300 },
  { id: 'sector_12', name: 'Sector-12', camerasCount: 6, busesCount: 4, healthScore: 65, trafficDensity: 69, activeAlerts: 1, lat: 28.5900, lng: 77.0600 },
  { id: 'city_center', name: 'City Center', camerasCount: 8, busesCount: 6, healthScore: 75, trafficDensity: 85, activeAlerts: 1, lat: 28.6289, lng: 77.2065 },
  { id: 'airport_road', name: 'Airport Road', camerasCount: 5, busesCount: 3, healthScore: 89, trafficDensity: 58, activeAlerts: 0, lat: 28.5562, lng: 77.1000 },
  { id: 'industrial_area', name: 'Industrial Area', camerasCount: 5, busesCount: 4, healthScore: 54, trafficDensity: 63, activeAlerts: 1, lat: 28.6600, lng: 77.2800 },
  { id: 'highway_exit', name: 'Highway Exit', camerasCount: 4, busesCount: 2, healthScore: 70, trafficDensity: 79, activeAlerts: 0, lat: 28.5200, lng: 77.2700 }
];

export const mockCameras = [
  { id: 'CAM-01', name: 'MG Road Junction West', area: 'mg_road', areaName: 'MG Road', status: 'Online', fps: 30, resolution: '4K', lat: 28.614, lng: 77.208, direction: 'Eastbound', vehiclesPerHr: 1420, activeDetections: ['SUV', 'Sedan', 'Auto'] },
  { id: 'CAM-02', name: 'City Center Plaza North', area: 'city_center', areaName: 'City Center', status: 'Online', fps: 30, resolution: '4K', lat: 28.629, lng: 77.207, direction: 'Northbound', vehiclesPerHr: 1850, activeDetections: ['Sedan', 'Bus', 'Hatchback'] },
  { id: 'CAM-03', name: 'Ring Road Flyover Entry', area: 'ring_road', areaName: 'Ring Road', status: 'Online', fps: 28, resolution: '1080p', lat: 28.581, lng: 77.231, direction: 'Northbound', vehiclesPerHr: 2100, activeDetections: ['Truck', 'SUV', 'Sedan'] },
  { id: 'CAM-04', name: 'Sector-12 Main Corridor', area: 'sector_12', areaName: 'Sector-12', status: 'Online', fps: 30, resolution: '1080p', lat: 28.591, lng: 77.061, direction: 'Eastbound', vehiclesPerHr: 980, activeDetections: ['2-Wheeler', 'Sedan'] },
  { id: 'CAM-05', name: 'Airport Express Connector', area: 'airport_road', areaName: 'Airport Road', status: 'Online', fps: 30, resolution: '4K', lat: 28.557, lng: 77.101, direction: 'Westbound', vehiclesPerHr: 1250, activeDetections: ['Taxi', 'SUV', 'Sedan'] },
  { id: 'CAM-06', name: 'Highway Exit Gate 3', area: 'highway_exit', areaName: 'Highway Exit', status: 'Online', fps: 25, resolution: '1080p', lat: 28.521, lng: 77.271, direction: 'Westbound', vehiclesPerHr: 1670, activeDetections: ['Heavy Truck', 'SUV', 'Bus'] },
  { id: 'CAM-07', name: 'GT Road Interchange', area: 'gt_road', areaName: 'GT Road', status: 'Online', fps: 30, resolution: '4K', lat: 28.645, lng: 77.217, direction: 'Southbound', vehiclesPerHr: 1940, activeDetections: ['SUV [UP16AB1234]', 'Auto', 'Truck'] },
  { id: 'CAM-08', name: 'Industrial Phase 1 Gate', area: 'industrial_area', areaName: 'Industrial Area', status: 'Online', fps: 25, resolution: '1080p', lat: 28.661, lng: 77.281, direction: 'Northbound', vehiclesPerHr: 820, activeDetections: ['Container Truck', 'Tempo'] },
  { id: 'CAM-09', name: 'GT Road North Terminal', area: 'gt_road', areaName: 'GT Road', status: 'Online', fps: 30, resolution: '1080p', lat: 28.650, lng: 77.220, direction: 'Northbound', vehiclesPerHr: 1530, activeDetections: ['Sedan', 'Bus'] },
  { id: 'CAM-10', name: 'MG Road Central Metro Gate', area: 'mg_road', areaName: 'MG Road', status: 'Online', fps: 30, resolution: '4K', lat: 28.618, lng: 77.212, direction: 'Westbound', vehiclesPerHr: 1390, activeDetections: ['Auto', '2-Wheeler', 'Car'] },
  { id: 'CAM-11', name: 'Ring Road Underpass', area: 'ring_road', areaName: 'Ring Road', status: 'Maintenance', fps: 0, resolution: '1080p', lat: 28.575, lng: 77.225, direction: 'Southbound', vehiclesPerHr: 0, activeDetections: [] },
  { id: 'CAM-12', name: 'Sector-12 Commercial Hub', area: 'sector_12', areaName: 'Sector-12', status: 'Online', fps: 30, resolution: '1080p', lat: 28.595, lng: 77.065, direction: 'Southbound', vehiclesPerHr: 890, activeDetections: ['Sedan', 'SUV'] }
];

export const mockBuses = [
  { id: 'BUS-01', route: 'Route 101 (MG Road - City Center)', area: 'mg_road', status: 'Active Sensing', kmAnalyzed: 18.4, issuesDetected: 3, safetyEvents: 1, lastSegment: 'MG Road Sector-4 Junction', lat: 28.616, lng: 77.210, speed: '28 km/h', modelState: 'Optimal' },
  { id: 'BUS-07', route: 'Route 204 (GT Road - Sector-12)', area: 'gt_road', status: 'Active Sensing', kmAnalyzed: 24.2, issuesDetected: 7, safetyEvents: 2, lastSegment: 'Sector-12 Flyover Descent', lat: 28.632, lng: 77.150, speed: '32 km/h', modelState: 'Optimal' },
  { id: 'BUS-12', route: 'Route 308 (Ring Road Orbital)', area: 'ring_road', status: 'Active Sensing', kmAnalyzed: 19.8, issuesDetected: 5, safetyEvents: 2, lastSegment: 'Ring Road South Underpass', lat: 28.585, lng: 77.228, speed: '35 km/h', modelState: 'Optimal' },
  { id: 'BUS-18', route: 'Route 112 (Airport - Industrial)', area: 'airport_road', status: 'Active Sensing', kmAnalyzed: 12.6, issuesDetected: 2, safetyEvents: 1, lastSegment: 'Airport Expressway Km 4', lat: 28.560, lng: 77.120, speed: '42 km/h', modelState: 'Optimal' },
  { id: 'BUS-23', route: 'Route 405 (Industrial - GT Road)', area: 'industrial_area', status: 'Active Sensing', kmAnalyzed: 11.4, issuesDetected: 9, safetyEvents: 3, lastSegment: 'Industrial Phase-2 Crossing', lat: 28.655, lng: 77.275, speed: '24 km/h', modelState: 'Optimal' },
  { id: 'BUS-31', route: 'Route 502 (City Center - Highway)', area: 'city_center', status: 'Active Sensing', kmAnalyzed: 14.8, issuesDetected: 4, safetyEvents: 1, lastSegment: 'Highway Exit Merge', lat: 28.535, lng: 77.260, speed: '38 km/h', modelState: 'Optimal' },
  { id: 'BUS-37', route: 'Route 109 (Sector-12 Feeder)', area: 'sector_12', status: 'Active Sensing', kmAnalyzed: 9.6, issuesDetected: 2, safetyEvents: 0, lastSegment: 'Sector-12 Block B Road', lat: 28.588, lng: 77.058, speed: '22 km/h', modelState: 'Optimal' }
];

export const mockRoadIssues = [
  {
    id: 'RD-0101',
    type: 'Pothole',
    category: 'Potholes / Damaged Roads',
    severity: 'High',
    confidence: 94.7,
    area: 'sector_12',
    areaName: 'Sector-12',
    detectedBy: 'BUS-07',
    lat: 28.589,
    lng: 77.062,
    timestamp: `10:20 AM, ${currentFormattedDate}`,
    status: 'Unresolved',
    depthEst: '8.5 cm depth',
    surfaceArea: '0.65 sq m',
    description: 'Deep road surface crater on outer lane detected via optical edge classifier & IMU vibration spike.'
  },
  {
    id: 'RD-0102',
    type: 'Waterlogging',
    category: 'Waterlogging',
    severity: 'Warning',
    confidence: 91.3,
    area: 'gt_road',
    areaName: 'GT Road',
    detectedBy: 'BUS-12',
    lat: 28.642,
    lng: 77.215,
    timestamp: `09:50 AM, ${currentFormattedDate}`,
    status: 'Under Review',
    depthEst: '12-15 cm standing water',
    surfaceArea: '14.2 sq m',
    description: 'Road curb drainage blockage causing surface pooling on nearside carriageway.'
  },
  {
    id: 'RD-0103',
    type: 'Damaged Divider',
    category: 'Missing / Damaged Dividers',
    severity: 'High',
    confidence: 96.1,
    area: 'city_center',
    areaName: 'City Center',
    detectedBy: 'BUS-01',
    lat: 28.627,
    lng: 77.205,
    timestamp: `09:30 AM, ${currentFormattedDate}`,
    status: 'Unresolved',
    depthEst: '3.2 m gap',
    surfaceArea: 'Concrete median sheared',
    description: 'Concrete median barrier displaced into oncoming lane posing collision risk.'
  },
  {
    id: 'RD-0104',
    type: 'Missing Zebra Crossing',
    category: 'Zebra Crossing Deficiencies',
    severity: 'Warning',
    confidence: 88.9,
    area: 'mg_road',
    areaName: 'MG Road',
    detectedBy: 'BUS-01',
    lat: 28.615,
    lng: 77.211,
    timestamp: `08:45 AM, ${currentFormattedDate}`,
    status: 'Unresolved',
    depthEst: '90% paint eroded',
    surfaceArea: 'Intersection paint faded',
    description: 'Zebra crossing markings severely worn and invisible under nighttime illumination.'
  },
  {
    id: 'RD-0105',
    type: 'Traffic Sign Deficiency',
    category: 'Traffic Sign Deficiencies',
    severity: 'Warning',
    confidence: 92.4,
    area: 'industrial_area',
    areaName: 'Industrial Area',
    detectedBy: 'BUS-23',
    lat: 28.658,
    lng: 77.279,
    timestamp: `08:15 AM, ${currentFormattedDate}`,
    status: 'Unresolved',
    depthEst: 'Bent post / 45 deg tilt',
    surfaceArea: 'No-Entry Sign obscured',
    description: 'Mandatory traffic signage tilted and obscured by overgrown branch.'
  },
  {
    id: 'RD-0106',
    type: 'Pothole',
    category: 'Potholes / Damaged Roads',
    severity: 'Critical',
    confidence: 97.2,
    area: 'industrial_area',
    areaName: 'Industrial Area',
    detectedBy: 'BUS-23',
    lat: 28.662,
    lng: 77.284,
    timestamp: `07:50 AM, ${currentFormattedDate}`,
    status: 'Unresolved',
    depthEst: '11 cm depth',
    surfaceArea: '1.2 sq m',
    description: 'Severe multi-cavity pothole cluster on heavy vehicle freight corridor.'
  },
  {
    id: 'RD-0107',
    type: 'Pothole',
    category: 'Potholes / Damaged Roads',
    severity: 'High',
    confidence: 93.5,
    area: 'gt_road',
    areaName: 'GT Road',
    detectedBy: 'BUS-07',
    lat: 28.647,
    lng: 77.219,
    timestamp: `07:30 AM, ${currentFormattedDate}`,
    status: 'Resolved',
    depthEst: 'Filled & compacted',
    surfaceArea: '0.45 sq m',
    description: 'Bitumen erosion near bus stop bay.'
  }
];

export const mockVehicles = {
  'UP16AB1234': {
    plateNumber: 'UP16AB1234',
    type: 'SUV',
    color: 'White',
    status: 'Blacklisted',
    statusReason: 'Wanted for Vehicle Identification & Verification (Law Enforcement Alert #WL-882)',
    ocrConfidence: 96.2,
    firstSeen: '09:12 AM',
    lastSeen: '10:23 AM',
    image: 'assets/images/vehicles/suv-white.jpg',
    stats: {
      totalDistance: '14.6 km',
      camerasMatched: 5,
      journeyDuration: '71 min'
    },
    trajectory: [
      { camera: 'CAM-01', area: 'mg_road', areaName: 'MG Road', time: '09:12 AM', direction: 'Eastbound', confidence: 97.4, lat: 28.614, lng: 77.208, speed: '42 km/h' },
      { camera: 'CAM-03', area: 'ring_road', areaName: 'Ring Road', time: '09:25 AM', direction: 'Northbound', confidence: 95.1, lat: 28.581, lng: 77.231, speed: '48 km/h' },
      { camera: 'CAM-02', area: 'city_center', areaName: 'City Center', time: '09:41 AM', direction: 'Northbound', confidence: 93.8, lat: 28.629, lng: 77.207, speed: '35 km/h' },
      { camera: 'CAM-04', area: 'sector_12', areaName: 'Sector-12', time: '10:02 AM', direction: 'Eastbound', confidence: 96.7, lat: 28.591, lng: 77.061, speed: '40 km/h' },
      { camera: 'CAM-06', area: 'highway_exit', areaName: 'Highway Exit', time: '10:23 AM', direction: 'Westbound', confidence: 98.2, lat: 28.521, lng: 77.271, speed: '58 km/h' }
    ]
  },
  'HR26EF9876': {
    plateNumber: 'HR26EF9876',
    type: 'Sedan',
    color: 'Silver',
    status: 'Speed Violation',
    statusReason: 'Vehicle logged exceeding posted speed limit on Airport Expressway (94 km/h in 60 zone)',
    ocrConfidence: 97.8,
    firstSeen: '09:45 AM',
    lastSeen: '10:10 AM',
    image: 'assets/images/vehicles/sedan-silver.jpg',
    stats: {
      totalDistance: '9.2 km',
      camerasMatched: 3,
      journeyDuration: '25 min'
    },
    trajectory: [
      { camera: 'CAM-05', area: 'airport_road', areaName: 'Airport Road', time: '09:45 AM', direction: 'Eastbound', confidence: 98.6, lat: 28.557, lng: 77.101, speed: '94 km/h' },
      { camera: 'CAM-04', area: 'sector_12', areaName: 'Sector-12', time: '09:58 AM', direction: 'Eastbound', confidence: 96.9, lat: 28.591, lng: 77.061, speed: '62 km/h' },
      { camera: 'CAM-03', area: 'ring_road', areaName: 'Ring Road', time: '10:10 AM', direction: 'Northbound', confidence: 97.4, lat: 28.581, lng: 77.231, speed: '55 km/h' }
    ]
  },
  'DL01CA9988': {
    plateNumber: 'DL01CA9988',
    type: 'Hatchback',
    color: 'Dark Grey',
    status: 'Active',
    statusReason: 'Regular commuting vehicle with valid telemetry',
    ocrConfidence: 98.4,
    firstSeen: '08:30 AM',
    lastSeen: '09:15 AM',
    image: 'assets/images/vehicles/hatchback-grey.jpg',
    stats: {
      totalDistance: '11.8 km',
      camerasMatched: 3,
      journeyDuration: '45 min'
    },
    trajectory: [
      { camera: 'CAM-02', area: 'city_center', areaName: 'City Center', time: '08:30 AM', direction: 'Southbound', confidence: 98.8, lat: 28.629, lng: 77.207, speed: '34 km/h' },
      { camera: 'CAM-01', area: 'mg_road', areaName: 'MG Road', time: '08:52 AM', direction: 'Westbound', confidence: 97.9, lat: 28.614, lng: 77.208, speed: '38 km/h' },
      { camera: 'CAM-07', area: 'gt_road', areaName: 'GT Road', time: '09:15 AM', direction: 'Northbound', confidence: 98.4, lat: 28.645, lng: 77.217, speed: '41 km/h' }
    ]
  },
  'MH12DE3456': {
    plateNumber: 'MH12DE3456',
    type: 'Commercial Truck',
    color: 'Blue',
    status: 'Active',
    statusReason: 'Heavy commercial goods carrier on permitted corridor',
    ocrConfidence: 94.1,
    firstSeen: '06:10 AM',
    lastSeen: '07:45 AM',
    image: 'assets/images/vehicles/truck-blue.jpg',
    stats: {
      totalDistance: '16.5 km',
      camerasMatched: 4,
      journeyDuration: '95 min'
    },
    trajectory: [
      { camera: 'CAM-08', area: 'industrial_area', areaName: 'Industrial Area', time: '06:10 AM', direction: 'Southbound', confidence: 94.5, lat: 28.661, lng: 77.281, speed: '32 km/h' },
      { camera: 'CAM-07', area: 'gt_road', areaName: 'GT Road', time: '06:48 AM', direction: 'Southbound', confidence: 93.8, lat: 28.645, lng: 77.217, speed: '35 km/h' },
      { camera: 'CAM-03', area: 'ring_road', areaName: 'Ring Road', time: '07:15 AM', direction: 'Southbound', confidence: 95.2, lat: 28.581, lng: 77.231, speed: '38 km/h' },
      { camera: 'CAM-06', area: 'highway_exit', areaName: 'Highway Exit', time: '07:45 AM', direction: 'Eastbound', confidence: 96.0, lat: 28.521, lng: 77.271, speed: '45 km/h' }
    ]
  },
  'KA03XY7711': {
    plateNumber: 'KA03XY7711',
    type: 'Sedan',
    color: 'White',
    status: 'Active',
    statusReason: 'Interstate passenger vehicle',
    ocrConfidence: 95.9,
    firstSeen: '10:00 AM',
    lastSeen: '10:45 AM',
    image: 'assets/images/vehicles/sedan-white.jpg',
    stats: {
      totalDistance: '8.4 km',
      camerasMatched: 3,
      journeyDuration: '45 min'
    },
    trajectory: [
      { camera: 'CAM-01', area: 'mg_road', areaName: 'MG Road', time: '10:00 AM', direction: 'Eastbound', confidence: 96.2, lat: 28.614, lng: 77.208, speed: '36 km/h' },
      { camera: 'CAM-04', area: 'sector_12', areaName: 'Sector-12', time: '10:22 AM', direction: 'Eastbound', confidence: 95.4, lat: 28.591, lng: 77.061, speed: '39 km/h' },
      { camera: 'CAM-06', area: 'highway_exit', areaName: 'Highway Exit', time: '10:45 AM', direction: 'Southbound', confidence: 96.5, lat: 28.521, lng: 77.271, speed: '48 km/h' }
    ]
  }
};

export const mockAlerts = [
  {
    id: 'ALT-901',
    title: 'Blacklisted Vehicle Detected',
    desc: 'UP16AB1234 detected at CAM-07, GT Road',
    severity: 'critical',
    source: 'CAM-07',
    sourceType: 'CCTV / ANPR',
    area: 'gt_road',
    areaName: 'GT Road',
    time: '10:23 AM',
    icon: 'car',
    acknowledged: false
  },
  {
    id: 'ALT-902',
    title: 'High Severity Pothole',
    desc: 'Detected by BUS-07 near Sector-12',
    severity: 'high',
    source: 'BUS-07',
    sourceType: 'Bus Sensing',
    area: 'sector_12',
    areaName: 'Sector-12',
    time: '10:20 AM',
    icon: 'alert-triangle',
    acknowledged: false
  },
  {
    id: 'ALT-903',
    title: 'High Congestion Alert',
    desc: 'Severe congestion at Ring Road Junction',
    severity: 'critical',
    source: 'TRAFFIC',
    sourceType: 'Traffic Density',
    area: 'ring_road',
    areaName: 'Ring Road',
    time: '10:15 AM',
    icon: 'users',
    acknowledged: false
  },
  {
    id: 'ALT-904',
    title: 'Speed Violation Detected',
    desc: 'Vehicle HR26EF9876 overspeeding',
    severity: 'warning',
    source: 'CAM-19',
    sourceType: 'CCTV / Speed Radar',
    area: 'airport_road',
    areaName: 'Airport Road',
    time: '10:10 AM',
    icon: 'gauge',
    acknowledged: false
  },
  {
    id: 'ALT-905',
    title: 'Rash Driving Event',
    desc: 'Unsafe driving event detected near MG Road',
    severity: 'high',
    source: 'CAM-03',
    sourceType: 'CCTV Edge AI',
    area: 'mg_road',
    areaName: 'MG Road',
    time: '10:05 AM',
    icon: 'alert-octagon',
    acknowledged: false
  },
  {
    id: 'ALT-906',
    title: 'Severe Waterlogging Blockage',
    desc: 'Standing water 15cm detected at GT Road near metro',
    severity: 'high',
    source: 'BUS-12',
    sourceType: 'Bus Sensing',
    area: 'gt_road',
    areaName: 'GT Road',
    time: '09:50 AM',
    icon: 'droplets',
    acknowledged: true
  },
  {
    id: 'ALT-907',
    title: 'Damaged Divider Hazard',
    desc: 'Concrete median barrier displaced near City Center',
    severity: 'high',
    source: 'BUS-01',
    sourceType: 'Bus Sensing',
    area: 'city_center',
    areaName: 'City Center',
    time: '09:30 AM',
    icon: 'shield-alert',
    acknowledged: true
  }
];

export const mockIncidents = [
  {
    id: `INC-${currentYear}-081`,
    type: 'Blacklisted Vehicle Spotted',
    category: 'Blacklisted Vehicle',
    source: 'CAM-07 (GT Road)',
    area: 'gt_road',
    areaName: 'GT Road',
    timestamp: `10:23 AM, ${currentFormattedDate}`,
    gps: '28.645° N, 77.217° E',
    confidence: '96.2%',
    severity: 'Critical',
    status: 'New',
    description: 'Vehicle UP16AB1234 flagged on Law Enforcement Watchlist. Moving Southbound towards Ring Road.'
  },
  {
    id: `INC-${currentYear}-080`,
    type: 'Hazardous Road Pothole Cluster',
    category: 'Road Hazard',
    source: 'BUS-07 (Sector-12)',
    area: 'sector_12',
    areaName: 'Sector-12',
    timestamp: `10:20 AM, ${currentFormattedDate}`,
    gps: '28.589° N, 77.062° E',
    confidence: '94.7%',
    severity: 'High',
    status: 'Under Review',
    description: 'Crater on high-speed flyover descent. Work order generated for Municipal PWD department.'
  },
  {
    id: `INC-${currentYear}-079`,
    type: 'Rash / Zig-Zag Unsafe Driving',
    category: 'Rash / Unsafe Driving',
    source: 'CAM-03 (Ring Road)',
    area: 'ring_road',
    areaName: 'Ring Road',
    timestamp: `10:05 AM, ${currentFormattedDate}`,
    gps: '28.581° N, 77.231° E',
    confidence: '91.8%',
    severity: 'High',
    status: 'Under Review',
    description: 'Aggressive multiple lane switching without indicators at high density flow.'
  },
  {
    id: `INC-${currentYear}-078`,
    type: 'Severe Storm Drain Overflow',
    category: 'Waterlogging',
    source: 'BUS-12 (GT Road)',
    area: 'gt_road',
    areaName: 'GT Road',
    timestamp: `09:50 AM, ${currentFormattedDate}`,
    gps: '28.642° N, 77.215° E',
    confidence: '91.3%',
    severity: 'Warning',
    status: 'Resolved',
    description: 'Drainage suction truck deployed by Municipal Team 04. Road cleared.'
  },
  {
    id: `INC-${currentYear}-077`,
    type: 'Damaged Concrete Median Hazard',
    category: 'Infrastructure Deficiency',
    source: 'BUS-01 (City Center)',
    area: 'city_center',
    areaName: 'City Center',
    timestamp: `09:30 AM, ${currentFormattedDate}`,
    gps: '28.627° N, 77.205° E',
    confidence: '96.1%',
    severity: 'High',
    status: 'Under Review',
    description: 'Median barrier crushed during early morning hours, protruding 0.8m into fast lane.'
  },
  {
    id: `INC-${currentYear}-076`,
    type: 'Traffic Density Surge & Gridlock',
    category: 'Traffic Event',
    source: 'CAM-02 / CAM-03',
    area: 'ring_road',
    areaName: 'Ring Road',
    timestamp: `09:15 AM, ${currentFormattedDate}`,
    gps: '28.580° N, 77.230° E',
    confidence: '98.0%',
    severity: 'Critical',
    status: 'Under Review',
    description: 'Traffic density exceeded 88% due to stalled commercial vehicle near underpass.'
  }
];

export const mockTrafficTrends = {
  cityDensity: 76,
  totalFlowToday: 12564,
  flowGrowth: '+8.5%',
  hourlyFlow: [
    { hour: '00:00', density: 18, volume: 420 },
    { hour: '02:00', density: 12, volume: 280 },
    { hour: '04:00', density: 15, volume: 340 },
    { hour: '06:00', density: 38, volume: 920 },
    { hour: '08:00', density: 72, volume: 1840 },
    { hour: '10:00', density: 84, volume: 2190 },
    { hour: '12:00', density: 70, volume: 1720 },
    { hour: '14:00', density: 68, volume: 1650 },
    { hour: '16:00', density: 79, volume: 1980 },
    { hour: '18:00', density: 89, volume: 2410 },
    { hour: '20:00', density: 76, volume: 1890 },
    { hour: '22:00', density: 45, volume: 1050 }
  ],
  vehicleClasses: [
    { label: 'Two-Wheelers', percentage: 46, count: 5780, color: '#38bdf8' },
    { label: 'Cars & SUVs', percentage: 34, count: 4272, color: '#6366f1' },
    { label: 'Auto-Rickshaws', percentage: 11, count: 1382, color: '#f59e0b' },
    { label: 'Commercial Trucks', percentage: 5, count: 628, color: '#ef4444' },
    { label: 'Public Transit Buses', percentage: 4, count: 502, color: '#a855f7' }
  ]
};

export const mockAIQueries = [
  {
    query: "Show vehicles detected on GT Road.",
    response: "Found 1,940 vehicles processed on GT Road today across CAM-07 and CAM-09. Notable detections include blacklisted SUV **UP16AB1234** (Confidence: 96.2%) and 14 heavy commercial carriers.",
    actionType: "filter_area",
    actionData: "gt_road",
    actionLabel: "View GT Road in GIS Map"
  },
  {
    query: "Which areas have road defects?",
    response: "Mobile bus sensing has flagged 26 road defects. Highest defect density is in **GT Road** (7 issues), **Sector-12** (5 issues), and **Industrial Area** (9 issues), predominantly potholes and drainage overflow.",
    actionType: "open_road_health",
    actionData: null,
    actionLabel: "Open Road Health Intelligence"
  },
  {
    query: "Show blacklisted vehicle detections.",
    response: "Critical Alert: Vehicle **UP16AB1234** (White SUV) matched 5 fixed CCTV cameras starting at MG Road (09:12 AM) through Highway Exit (10:23 AM). Current status is Flagged / Tracked.",
    actionType: "view_vehicle",
    actionData: "UP16AB1234",
    actionLabel: "View UP16AB1234 Trajectory"
  },
  {
    query: "Where are the most severe potholes?",
    response: "The two most severe road craters are located at **Industrial Phase 1 Gate** (RD-0106, Depth 11cm, Critical) and **Sector-12 Flyover Descent** (RD-0101, Depth 8.5cm, High Severity).",
    actionType: "view_issue",
    actionData: "RD-0101",
    actionLabel: "Inspect Sector-12 Pothole on Map"
  },
  {
    query: "Which areas need road maintenance attention?",
    response: "Overall Road Health Score is **72/100**. Areas requiring urgent municipal intervention are **Industrial Area (54/100)** and **GT Road (61/100)** due to multiple uncompacted pothole clusters and drain pooling.",
    actionType: "filter_area",
    actionData: "industrial_area",
    actionLabel: "Filter Industrial Area Telemetry"
  }
];
