/**
 * Agent-Guidance MCP Workbench - UI Controller
 * 100% Offline-friendly: attached to window (no import/export, no server needed)
 */

(function () {
    const { MOCK_TOOLS } = window.McpMockData;
    const McpSimulatorCore = window.McpSimulatorCore;

    const I18N = {
        vi: {
            back_home: "← Portfolio",
            page_title: "Agent-Guidance // MCP Simulator & Workbench",
            page_sub: "Giả lập giao thức Model Context Protocol (MCP stdio) & Bộ kẹp kỷ luật kiến trúc AI Agents",
            badge_status: "● NATIVE RUST <1MS",
            presets_label: "KỊCH BẢN MÔ PHỎNG NHANH",
            tools_label: "DANH MỤC CÔNG CỤ MCP",
            payload_label: "THAM SỐ GỌI TOOL (JSON PAYLOAD)",
            run_btn: "THỰC THI TOOL (EXECUTE)",
            clear_btn: "XÓA LOG",
            stream_label: "LUỒNG THỰC THI & PHẢN HỒI MCP (STDIO LOG)",
            stats_saved: "TOKEN ĐÃ TIẾT KIỆM",
            stats_rate: "TỶ LỆ TIẾT KIỆM",
            stats_latency: "ĐỘ TRỄ KHỞI ĐỘNG",
            stats_ram: "BỘ NHỚ TIÊU THỤ",
            search_placeholder: "Tìm kiếm kỹ năng (ví dụ: rust, security, docker, mcp)...",
            view_repo: "GitHub Repository"
        },
        en: {
            back_home: "← Portfolio",
            page_title: "Agent-Guidance // MCP Simulator & Workbench",
            page_sub: "Interactive Model Context Protocol (stdio) simulator enforcing architectural discipline on AI agents",
            badge_status: "● NATIVE RUST <1MS",
            presets_label: "QUICK SIMULATION PRESETS",
            tools_label: "MCP TOOL REGISTRY",
            payload_label: "TOOL INVOCATION (JSON PAYLOAD)",
            run_btn: "EXECUTE TOOL (STDIO)",
            clear_btn: "CLEAR LOGS",
            stream_label: "MCP EXECUTION STREAM & TELEMETRY",
            stats_saved: "TOKENS SAVED",
            stats_rate: "SAVINGS RATE",
            stats_latency: "STARTUP LATENCY",
            stats_ram: "MEMORY USAGE",
            search_placeholder: "Search catalog skills (e.g., rust, security, docker, mcp)...",
            view_repo: "GitHub Repository"
        }
    };

    class McpSimulatorUI {
        constructor() {
            this.core = new McpSimulatorCore();
            this.currentLang = localStorage.getItem('lang') || 'vi';
            this.init();
        }

        init() {
            this.setupTheme();
            this.renderI18n();
            this.renderToolsNav();
            this.renderPresets();
            this.loadToolPayload(this.core.activeTool);
            this.bindEvents();
            this.updateStats();

            // Run initial pipeline simulation on load
            this.runToolInvocation('task_pipeline');
        }

        setupTheme() {
            const saved = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', saved);
            const themeBtn = document.getElementById('theme-toggle-btn');
            if (themeBtn) themeBtn.textContent = saved === 'dark' ? '☀️' : '🌙';
        }

        toggleTheme() {
            const curr = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = curr === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            const themeBtn = document.getElementById('theme-toggle-btn');
            if (themeBtn) themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
        }

        toggleLang() {
            this.currentLang = this.currentLang === 'vi' ? 'en' : 'vi';
            localStorage.setItem('lang', this.currentLang);
            this.renderI18n();
            this.renderToolsNav();
            this.renderPresets();
        }

        renderI18n() {
            const t = I18N[this.currentLang] || I18N.vi;
            document.querySelectorAll('[data-mcp-i18n]').forEach(el => {
                const key = el.getAttribute('data-mcp-i18n');
                if (t[key]) el.textContent = t[key];
            });
            const langBtn = document.getElementById('lang-toggle-btn');
            if (langBtn) langBtn.textContent = this.currentLang.toUpperCase();
            const searchInput = document.getElementById('skill-search-input');
            if (searchInput) searchInput.placeholder = t.search_placeholder;
        }

        renderToolsNav() {
            const container = document.getElementById('tools-nav-list');
            if (!container) return;
            container.innerHTML = '';

            this.core.getAllTools().forEach(tool => {
                const btn = document.createElement('button');
                btn.className = `tool-pill ${tool.id === this.core.activeTool ? 'active' : ''}`;
                btn.type = 'button';
                btn.innerHTML = `<span class="tool-dot"></span><span class="tool-name">${tool.name}</span><span class="tool-cat">${tool.category}</span>`;
                btn.addEventListener('click', () => {
                    this.core.setTool(tool.id);
                    document.querySelectorAll('.tool-pill').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.loadToolPayload(tool.id);
                });
                container.appendChild(btn);
            });
        }

        renderPresets() {
            const container = document.getElementById('presets-list');
            if (!container) return;
            container.innerHTML = '';

            this.core.getPresets().forEach(preset => {
                const btn = document.createElement('button');
                btn.className = 'preset-card-btn';
                btn.type = 'button';
                const label = this.currentLang === 'vi' ? preset.label_vi : preset.label_en;
                const desc = this.currentLang === 'vi' ? preset.desc_vi : preset.desc_en;
                btn.innerHTML = `<strong>${label}</strong><p>${desc}</p>`;
                btn.addEventListener('click', () => this.handlePresetClick(preset));
                container.appendChild(btn);
            });
        }

        loadToolPayload(toolId) {
            const tool = this.core.getTool(toolId);
            const editor = document.getElementById('payload-editor');
            if (editor && tool) {
                editor.value = tool.default_payload;
            }
        }

        handlePresetClick(preset) {
            this.core.setTool(preset.tool);
            this.renderToolsNav();

            const editor = document.getElementById('payload-editor');
            if (preset.id === 'block_300') {
                editor.value = JSON.stringify({ action: "authorize_edit", relative_paths: ["src/services/mega-monolith.js"], simulate_block: true }, null, 2);
            } else if (preset.id === 'benchmark_token') {
                editor.value = JSON.stringify({ operation: "read", relative_path: "src/services/auth.js", target_symbol: "verifyToken" }, null, 2);
            } else if (preset.id === 'search_skills') {
                editor.value = JSON.stringify({ operation: "search", query: "rust mcp security" }, null, 2);
            } else {
                editor.value = MOCK_TOOLS[preset.tool].default_payload;
            }
            this.runToolInvocation(preset.tool);
        }

        runToolInvocation(toolId = this.core.activeTool) {
            const editor = document.getElementById('payload-editor');
            const payloadText = editor ? editor.value : '{}';
            const result = this.core.executeTool(toolId, payloadText);
            this.appendLogEntry(toolId, payloadText, result);
            this.updateStats();
        }

        appendLogEntry(toolId, rawPayload, result) {
            const stream = document.getElementById('log-stream-content');
            if (!stream) return;

            const isPassed = result.status === 'PASSED' || result.status === 'ACTIVATED' || !result.error_code;
            const statusBadge = isPassed
                ? `<span class="badge-success">● PASSED / 200 OK</span>`
                : `<span class="badge-danger">▲ BLOCKED / GATE INTERCEPT</span>`;

            const logCard = document.createElement('div');
            logCard.className = `log-card ${isPassed ? 'log-passed' : 'log-blocked'}`;
            logCard.innerHTML = `
                <div class="log-card-header">
                    <div class="log-meta">
                        <span class="log-tool-tag">${toolId}()</span>
                        <span class="log-time">${new Date().toLocaleTimeString()}</span>
                    </div>
                    ${statusBadge}
                </div>
                <div class="log-body">
                    <pre class="json-code"><code>${this.syntaxHighlight(JSON.stringify(result, null, 2))}</code></pre>
                </div>
            `;
            stream.prepend(logCard);
        }

        syntaxHighlight(json) {
            return json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
                    let cls = 'hl-number';
                    if (/^"/.test(match)) {
                        cls = /:$/.test(match) ? 'hl-key' : 'hl-string';
                    } else if (/true|false/.test(match)) {
                        cls = 'hl-bool';
                    } else if (/null/.test(match)) {
                        cls = 'hl-null';
                    }
                    return `<span class="${cls}">${match}</span>`;
                });
        }

        updateStats() {
            const stats = this.core.getStats();
            const savedEl = document.getElementById('metric-tokens-saved');
            const rateEl = document.getElementById('metric-savings-rate');
            if (savedEl) savedEl.textContent = stats.totalSaved.toLocaleString() + ' tok';
            if (rateEl) rateEl.textContent = stats.savingsPct + '%';
        }

        bindEvents() {
            document.getElementById('theme-toggle-btn')?.addEventListener('click', () => this.toggleTheme());
            document.getElementById('lang-toggle-btn')?.addEventListener('click', () => this.toggleLang());
            document.getElementById('run-tool-btn')?.addEventListener('click', () => this.runToolInvocation());
            document.getElementById('clear-log-btn')?.addEventListener('click', () => {
                this.core.clearHistory();
                const stream = document.getElementById('log-stream-content');
                if (stream) stream.innerHTML = '';
            });
        }
    }

    window.McpSimulatorUI = McpSimulatorUI;

    // Auto-boot on load
    if (typeof window !== 'undefined') {
        window.addEventListener('DOMContentLoaded', () => {
            window.agentSimulator = new McpSimulatorUI();
        });
    }
})();
