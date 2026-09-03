/**
 * Vectra Jansadak Suraksha AI - AI Urban Assistant Component
 * Conversational Natural Language Query Terminal for City Intelligence
 */

import { mockAIQueries, mockVehicles, mockRoadIssues } from '../data/mockData.js';
import { simulationEngine } from '../data/simulationEngine.js';

export function renderAiAssistant(container, isStandalone = false) {
  const suggestions = [
    "Show vehicles on GT Road",
    "Areas with road issues",
    "Blacklisted vehicles today",
    "Severe potholes today",
    "Which areas need road maintenance attention?"
  ];

  container.innerHTML = `
    <div class="command-card p-3.5 ${isStandalone ? 'min-h-[600px]' : 'h-full'} flex flex-col justify-between">
      <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-3 border-b border-command-border/80 pb-2">
          <div class="flex items-center gap-2">
            <div class="p-1 rounded bg-cyan-950/80 text-info-cyan border border-cyan-500/30">
              <i data-lucide="bot" class="w-4 h-4"></i>
            </div>
            <div>
              <h2 class="text-xs font-bold text-white tracking-wide uppercase">Vectra AI Urban Assistant</h2>
              <p class="text-[10px] text-slate-400">Natural language intelligence retrieval engine</p>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono">
            Online Agent
          </span>
        </div>

        <!-- Chat Transcript Area -->
        <div id="ai-chat-messages" class="space-y-3 max-h-[220px] overflow-y-auto pr-1 mb-3 text-xs">
          <!-- Initial Welcome Message from AI -->
          <div class="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/90 border border-command-border/80">
            <div class="w-6 h-6 rounded-full bg-cyan-950 flex items-center justify-center text-info-cyan flex-shrink-0 border border-cyan-500/30">
              <i data-lucide="bot" class="w-3.5 h-3.5"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-bold text-cyan-300 text-[11px] mb-0.5">Vectra AI Assistant</div>
              <div class="text-slate-300 leading-relaxed text-[11px]">
                Hello <b>Officer_01</b>. I can synthesize real-time fixed CCTV ANPR detections, bus-sensed road defects, and city safety events. Ask me anything or select a prompt below.
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Prompt Chips -->
        <div class="flex items-center gap-1.5 flex-wrap mb-2.5">
          ${suggestions.map(q => `
            <button data-ai-chip="${q}" class="px-2 py-1 rounded bg-command-card border border-command-border hover:border-cctv-blue text-slate-300 hover:text-white text-[10px] transition-colors">
              ${q}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Chat Input Field -->
      <div class="pt-2 border-t border-command-border">
        <form id="ai-chat-form" class="flex items-center gap-2">
          <input type="text" id="ai-chat-input" placeholder="Type your query (e.g. Which areas have road defects?)..." class="flex-1 bg-slate-950 border border-command-border rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cctv-blue">
          <button type="submit" class="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-colors flex items-center gap-1">
            <i data-lucide="send" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === "function") { try { window.lucide.createIcons(); } catch (e) {} }

  const messagesContainer = container.querySelector('#ai-chat-messages');
  const chatForm = container.querySelector('#ai-chat-form');
  const chatInput = container.querySelector('#ai-chat-input');

  function handleQuery(queryText) {
    if (!queryText || !messagesContainer) return;

    // 1. Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'flex items-start gap-2.5 p-2 rounded-lg bg-blue-950/30 border border-blue-900/40 justify-end';
    userMsg.innerHTML = `
      <div class="text-right">
        <div class="font-bold text-blue-300 text-[10px] mb-0.5">Officer_01</div>
        <div class="text-slate-200 text-[11px]">${queryText}</div>
      </div>
      <div class="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
        O1
      </div>
    `;
    messagesContainer.appendChild(userMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 2. Synthesize AI Response (Match from Knowledge Base or Dynamic Parser)
    setTimeout(() => {
      let matched = mockAIQueries.find(q => q.query.toLowerCase().includes(queryText.toLowerCase().trim()) || queryText.toLowerCase().includes(q.query.toLowerCase().slice(0, 15)));

      if (!matched) {
        // Fallback intelligent responder based on keywords
        if (queryText.toLowerCase().includes('pothole') || queryText.toLowerCase().includes('defect') || queryText.toLowerCase().includes('road')) {
          matched = mockAIQueries[1];
        } else if (queryText.toLowerCase().includes('blacklist') || queryText.toLowerCase().includes('wanted') || queryText.toLowerCase().includes('up16')) {
          matched = mockAIQueries[2];
        } else if (queryText.toLowerCase().includes('gt road') || queryText.toLowerCase().includes('cam-07')) {
          matched = mockAIQueries[0];
        } else {
          matched = {
            query: queryText,
            response: `Synthesized telemetry for **"${queryText}"**: Found 48 active CCTV streams and 37 mobile sensing buses. City traffic density is currently **${simulationEngine.state.trafficDensity}%** with **${simulationEngine.state.roadHealthScore}/100** road health score.`,
            actionType: 'filter_area',
            actionData: 'all',
            actionLabel: 'View City GIS Map'
          };
        }
      }

      const aiMsg = document.createElement('div');
      aiMsg.className = 'flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/90 border border-command-border/80';
      aiMsg.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-cyan-950 flex items-center justify-center text-info-cyan flex-shrink-0 border border-cyan-500/30">
          <i data-lucide="bot" class="w-3.5 h-3.5"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-cyan-300 text-[11px] mb-0.5">Vectra AI Assistant</div>
          <div class="text-slate-300 leading-relaxed text-[11px]">${matched.response}</div>
          ${matched.actionLabel ? `
            <div class="mt-2 pt-1.5 border-t border-slate-800">
              <button id="btn-ai-action-${Date.now()}" class="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 text-[10px] font-semibold flex items-center gap-1 transition-colors">
                <i data-lucide="compass" class="w-3 h-3"></i>
                <span>${matched.actionLabel}</span>
              </button>
            </div>
          ` : ''}
        </div>
      `;
      messagesContainer.appendChild(aiMsg);
      if (window.lucide) window.lucide.createIcons({ root: aiMsg });
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Bind dynamic action button
      const actBtn = aiMsg.querySelector('button');
      if (actBtn) {
        actBtn.addEventListener('click', () => {
          if (matched.actionType === 'filter_area') {
            simulationEngine.setArea(matched.actionData);
            if (window.navigateTo) window.navigateTo('dashboard');
          } else if (matched.actionType === 'open_road_health') {
            if (window.navigateTo) window.navigateTo('road_health');
          } else if (matched.actionType === 'view_vehicle') {
            simulationEngine.setVehicle(matched.actionData);
            if (window.navigateTo) window.navigateTo('trajectories');
          } else if (matched.actionType === 'view_issue') {
            const issue = mockRoadIssues.find(i => i.id === matched.actionData);
            if (window.openRoadIssueModal) window.openRoadIssueModal(issue);
          }
        });
      }
    }, 400);
  }

  // Bind Form Submit
  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = (chatInput?.value || '').trim();
    if (query) {
      handleQuery(query);
      chatInput.value = '';
    }
  });

  // Bind Quick Chips
  container.querySelectorAll('[data-ai-chip]').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-ai-chip');
      handleQuery(q);
    });
  });
}
