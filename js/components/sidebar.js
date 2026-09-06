/**
 * Vectra Jansadak Suraksha AI - Left Sidebar Component
 */

import { simulationEngine } from '../data/simulationEngine.js';

export function renderSidebar(container, currentView = 'dashboard') {
  const state = simulationEngine.state;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'areas', label: 'Areas', icon: 'map-pin', badge: 'New', badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' },
    {
      id: 'monitoring',
      label: 'Live Monitoring',
      icon: 'video',
      children: [
        { id: 'cctv_cameras', label: 'CCTV Cameras', icon: 'camera' },
        { id: 'map_view', label: 'Map View', icon: 'map' }
      ]
    },
    { id: 'anpr', label: 'ANPR & Vehicles', icon: 'scan-line' },
    { id: 'trajectories', label: 'Trajectories', icon: 'git-commit' },
    { id: 'traffic_analytics', label: 'Traffic Analytics', icon: 'bar-chart-3' },
    { id: 'road_health', label: 'Road Health', icon: 'activity' },
    { id: 'bus_fleet', label: 'Bus Fleet (Sensing)', icon: 'bus' },
    { id: 'incidents', label: 'Incidents', icon: 'shield-alert' },
    { id: 'alerts', label: 'Alerts Center', icon: 'bell', badge: `${state.activeAlertsCount}`, badgeColor: 'bg-alert-red text-white' },
    { id: 'ai_assistant', label: 'AI Assistant', icon: 'bot', badge: 'New', badgeColor: 'bg-cyan-950 text-cyan-400 border border-cyan-500/30' },
    { id: 'reports', label: 'Reports', icon: 'file-text' },
    { id: 'settings', label: 'System Settings', icon: 'settings' }
  ];

  let monitoringExpanded = currentView === 'cctv_cameras' || currentView === 'map_view' || currentView === 'monitoring';

  container.innerHTML = `
    <!-- Top Branding -->
    <div class="p-4 border-b border-command-border">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-lg bg-slate-900/80 border border-slate-700/50 p-1 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-950/40">
          <img src="assets/images/vectra-logo.png" alt="Vectra Logo" class="w-full h-full object-contain filter drop-shadow(0 0 6px rgba(56, 189, 248, 0.4))" />
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-sm font-bold text-white tracking-tight leading-tight truncate">Vectra Jansadak Suraksha AI</h1>
          <p class="text-[10px] text-slate-400 leading-tight mt-0.5">AI-powered city traffic, vehicle and road intelligence platform</p>
        </div>
        <!-- Collapse / Close Drawer Button -->
        <button id="btn-sidebar-close" class="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors flex-shrink-0 -mr-1" title="Collapse Sidebar Navigation">
          <i data-lucide="chevrons-left" class="w-4 h-4"></i>
        </button>
      </div>
    </div>

    <!-- Navigation List -->
    <nav class="flex-1 px-2.5 py-3 overflow-y-auto space-y-1 text-xs">
      ${navItems.map(item => {
        if (item.children) {
          const isChildActive = item.children.some(c => c.id === currentView);
          return `
            <div>
              <button data-nav-group="${item.id}" class="w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
                isChildActive ? 'bg-command-card text-cctv-blue font-semibold' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }">
                <div class="flex items-center gap-2.5">
                  <i data-lucide="${item.icon}" class="w-4 h-4"></i>
                  <span>${item.label}</span>
                </div>
                <i data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform duration-200 ${monitoringExpanded ? 'rotate-180' : ''}"></i>
              </button>
              <div id="subnav-${item.id}" class="pl-6 pr-1 py-1 space-y-1 ${monitoringExpanded ? '' : 'hidden'}">
                ${item.children.map(child => `
                  <button data-nav-id="${child.id}" class="w-full flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-colors text-[11px] ${
                    currentView === child.id ? 'bg-blue-600/20 text-cctv-blue border-l-2 border-cctv-blue font-semibold' : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }">
                    <i data-lucide="${child.icon}" class="w-3.5 h-3.5"></i>
                    <span>${child.label}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          `;
        }

        const isActive = currentView === item.id;
        return `
          <button data-nav-id="${item.id}" class="w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
            isActive ? 'bg-blue-600/20 text-cctv-blue border-l-2 border-cctv-blue font-semibold' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }">
            <div class="flex items-center gap-2.5">
              <i data-lucide="${item.icon}" class="w-4 h-4"></i>
              <span>${item.label}</span>
            </div>
            ${item.badge ? `
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'}">
                ${item.badge}
              </span>
            ` : ''}
          </button>
        `;
      }).join('')}
    </nav>

    <!-- Bottom Officer Profile & Copyright -->
    <div class="p-3 border-t border-command-border bg-command-dark/95">
      <div class="flex items-center gap-3 p-2 rounded-lg bg-command-card border border-command-border/80">
        <div class="relative">
          <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <i data-lucide="user-check" class="w-4 h-4 text-cctv-blue"></i>
          </div>
          <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-command-card animate-pulse"></span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
            <span>Officer_01</span>
          </div>
          <div class="text-[10px] text-slate-400 truncate">Traffic Control Room</div>
          <div class="text-[10px] text-emerald-400 font-mono font-medium flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
          </div>
        </div>
      </div>
      <div class="mt-2.5 px-1 text-[10px] text-slate-500 text-center font-mono">
        © 2026 Vectra. Prototype build.
      </div>
    </div>
  `;

  // Re-initialize Lucide Icons
  if (window.lucide && typeof window.lucide.createIcons === "function") { try { window.lucide.createIcons(); } catch (e) {} }

  // Collapse / Close button inside sidebar header
  const closeBtn = container.querySelector('#btn-sidebar-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (typeof window.toggleSidebar === 'function') window.toggleSidebar();
    });
  }

  // Event handlers for navigation
  container.querySelectorAll('[data-nav-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = btn.getAttribute('data-nav-id');
      if (window.navigateTo) window.navigateTo(viewId);
      // Auto-slide drawer closed on mobile/tablet when navigation occurs
      if (window.innerWidth < 1024 && typeof window.closeSidebar === 'function') {
        window.closeSidebar();
      }
    });
  });

  // Toggle subnavigation groups
  container.querySelectorAll('[data-nav-group]').forEach(btn => {
    btn.addEventListener('click', () => {
      const groupId = btn.getAttribute('data-nav-group');
      const subnav = container.querySelector(`#subnav-${groupId}`);
      if (subnav) {
        subnav.classList.toggle('hidden');
      }
    });
  });

  // Initialize global drawer controller
  setupSidebarDrawer();
}

/**
 * Global drawer & collapsible controller
 */
let drawerInitialized = false;
export function setupSidebarDrawer() {
  const sidebar = document.getElementById('sidebar-container');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (!sidebar) return;

  window.toggleSidebar = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      const isOpen = sidebar.classList.contains('drawer-open');
      if (isOpen) {
        sidebar.classList.remove('drawer-open');
        if (backdrop) backdrop.classList.remove('active');
      } else {
        sidebar.classList.add('drawer-open');
        if (backdrop) backdrop.classList.add('active');
      }
    } else {
      const isCollapsed = sidebar.classList.contains('collapsed');
      if (isCollapsed) {
        sidebar.classList.remove('collapsed');
        localStorage.setItem('vectra_sidebar_collapsed', 'false');
      } else {
        sidebar.classList.add('collapsed');
        localStorage.setItem('vectra_sidebar_collapsed', 'true');
      }
    }
  };

  window.closeSidebar = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      sidebar.classList.remove('drawer-open');
      if (backdrop) backdrop.classList.remove('active');
    } else {
      sidebar.classList.add('collapsed');
      localStorage.setItem('vectra_sidebar_collapsed', 'true');
    }
  };

  window.openSidebar = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      sidebar.classList.add('drawer-open');
      if (backdrop) backdrop.classList.add('active');
    } else {
      sidebar.classList.remove('collapsed');
      localStorage.setItem('vectra_sidebar_collapsed', 'false');
    }
  };

  if (!drawerInitialized) {
    drawerInitialized = true;
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        if (typeof window.closeSidebar === 'function') window.closeSidebar();
      });
    }

    // Restore desktop preference on load
    if (window.innerWidth >= 1024 && localStorage.getItem('vectra_sidebar_collapsed') === 'true') {
      sidebar.classList.add('collapsed');
    }
  }
}
