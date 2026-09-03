/**
 * Vectra Jansadak Suraksha AI - Dedicated AI Assistant Full Terminal View
 */

import { renderAiAssistant } from '../components/aiAssistant.js';

export function renderAiAssistantView(container) {
  container.innerHTML = `
    <div class="space-y-4 max-w-5xl mx-auto">
      <div class="bg-command-card border border-command-border p-4 rounded-lg flex items-center justify-between">
        <div>
          <h1 class="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <i data-lucide="bot" class="w-5 h-5 text-info-cyan"></i>
            <span>Vectra AI Urban Assistant Command Terminal</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">
            Query multi-modal city intelligence, retrieve vehicle trajectories, and extract road defect summaries in natural language.
          </p>
        </div>
        <span class="px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono">
          Edge Reasoning Agent • Active
        </span>
      </div>

      <div id="standalone-ai-wrapper" class="w-full"></div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons({ root: container });

  const wrapper = container.querySelector('#standalone-ai-wrapper');
  if (wrapper) {
    renderAiAssistant(wrapper, true);
  }
}
