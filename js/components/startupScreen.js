/**
 * Vectra Jansadak Suraksha AI - Startup Loading Screen Controller
 * Orchestrates pre-launch initialization progress, dynamic telemetry & smooth fade-out.
 */

export function initStartupScreen() {
  const startupScreen = document.getElementById('vectra-startup-screen');
  if (!startupScreen) return;

  // 1. Prevent background scrolling while loading
  document.body.style.overflow = 'hidden';

  const progressFill = document.getElementById('startup-progress-fill');
  const progressPct = document.getElementById('startup-progress-pct');
  const statusMsg = document.getElementById('startup-status-msg');

  // Feature indicator items
  const featCctv = document.getElementById('feat-cctv');
  const featAnpr = document.getElementById('feat-anpr');
  const featRoad = document.getElementById('feat-road');
  const featAnalytics = document.getElementById('feat-analytics');

  // Status message sequence
  const statusSteps = [
    { at: 0, text: 'Loading a Safer Tomorrow...' },
    { at: 20, text: 'Initializing Urban Intelligence...' },
    { at: 45, text: 'Connecting Fixed CCTV & ANPR Corridors...' },
    { at: 70, text: 'Synchronizing Road Health Data...' },
    { at: 88, text: 'Preparing Real-time City Analytics...' },
    { at: 100, text: 'System Ready' }
  ];

  let currentMsgIndex = 0;
  function updateStatus(pct) {
    if (!statusMsg) return;
    for (let i = statusSteps.length - 1; i >= 0; i--) {
      if (pct >= statusSteps[i].at) {
        if (currentMsgIndex !== i) {
          currentMsgIndex = i;
          statusMsg.style.opacity = '0';
          statusMsg.style.transform = 'translateY(4px)';
          setTimeout(() => {
            statusMsg.textContent = statusSteps[i].text;
            statusMsg.style.opacity = '1';
            statusMsg.style.transform = 'translateY(0)';
          }, 150);
        }
        break;
      }
    }
  }

  // Animation parameters (Total duration ~2.8 seconds)
  const duration = 2800;
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function frame(now) {
    const elapsed = now - startTime;
    const rawProgress = Math.min(1, elapsed / duration);
    const easedProgress = easeOutCubic(rawProgress);
    const pct = Math.min(100, Math.round(easedProgress * 100));

    // Update Progress Bar
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressPct) progressPct.textContent = `${pct}%`;

    // Update Dynamic Status Text
    updateStatus(pct);

    // Sequentially illuminate feature indicators
    if (featCctv && pct >= 25 && !featCctv.classList.contains('active')) {
      featCctv.classList.add('active');
    }
    if (featAnpr && pct >= 50 && !featAnpr.classList.contains('active')) {
      featAnpr.classList.add('active');
    }
    if (featRoad && pct >= 75 && !featRoad.classList.contains('active')) {
      featRoad.classList.add('active');
    }
    if (featAnalytics && pct >= 92 && !featAnalytics.classList.contains('active')) {
      featAnalytics.classList.add('active');
    }

    if (rawProgress < 1) {
      requestAnimationFrame(frame);
    } else {
      // Completed: Brief hold at 100% "System Ready" then smooth fade-out
      setTimeout(() => {
        dismissStartupScreen();
      }, 350);
    }
  }

  function dismissStartupScreen() {
    startupScreen.classList.add('fade-out');

    // Restore body scrolling
    document.body.style.overflow = '';

    setTimeout(() => {
      startupScreen.classList.add('hidden');
      startupScreen.remove();

      // Trigger custom ready event for any telemetry subscribers
      window.dispatchEvent(new CustomEvent('vectra:ready'));
      console.log('✨ Vectra Jansadak Suraksha AI loading sequence completed.');
    }, 700);
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    if (progressFill) progressFill.style.width = '100%';
    if (progressPct) progressPct.textContent = '100%';
    if (statusMsg) statusMsg.textContent = 'System Ready';
    setTimeout(dismissStartupScreen, 400);
    return;
  }

  // Start animation loop
  requestAnimationFrame(frame);
}
