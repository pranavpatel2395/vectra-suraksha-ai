import urllib.request

files = [
    'css/styles.css',
    'js/app.js',
    'js/data/mockData.js',
    'js/data/simulationEngine.js',
    'js/components/header.js',
    'js/components/sidebar.js',
    'js/components/kpiCards.js',
    'js/components/cctvFeeds.js',
    'js/components/intelligenceMap.js',
    'js/components/vehicleSearch.js',
    'js/components/trafficAnalytics.js',
    'js/components/roadHealthCard.js',
    'js/components/alertsPanel.js',
    'js/components/aiAssistant.js',
    'js/components/modals.js',
    'js/views/dashboardView.js',
    'js/views/areasView.js',
    'js/views/cctvMonitoringView.js',
    'js/views/mapMonitoringView.js',
    'js/views/anprVehiclesView.js',
    'js/views/trajectoriesView.js',
    'js/views/trafficAnalyticsView.js',
    'js/views/roadHealthView.js',
    'js/views/busFleetView.js',
    'js/views/incidentsView.js',
    'js/views/alertsCenterView.js',
    'js/views/aiAssistantView.js',
    'js/views/reportsView.js',
    'js/views/settingsView.js'
]

success = True
for f in files:
    url = f'http://localhost:8080/{f}'
    try:
        res = urllib.request.urlopen(url)
        content = res.read()
        print(f"OK [200]: {f} ({len(content)} bytes)")
    except Exception as e:
        print(f"FAILED: {f} -> {e}")
        success = False

if success:
    print("\n>>> ALL 29 MODULES AND ASSETS DELIVERED SUCCESSFULLY (HTTP 200) <<<")
else:
    print("\n>>> SOME ASSETS FAILED <<<")
