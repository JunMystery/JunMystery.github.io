/**
 * Agent-Guidance MCP Workbench - Core Simulation Engine
 * 100% Offline-friendly: attached to window (no import/export, no server needed)
 */

(function () {
    const { MOCK_TOOLS, SKILL_CATALOG, PRESETS } = window.McpMockData;

    class McpSimulatorCore {
        constructor() {
            this.activeTool = 'task_pipeline';
            this.history = [];
            this.totalTokensSaved = 14230;
            this.rawTokensTotal = 14850;
            this.boundedTokensTotal = 620;
            this.listeners = new Set();
        }

        subscribe(listener) {
            this.listeners.add(listener);
            return () => this.listeners.delete(listener);
        }

        notify(event, data) {
            for (const listener of this.listeners) {
                listener(event, data);
            }
        }

        setTool(toolId) {
            if (!MOCK_TOOLS[toolId]) return;
            this.activeTool = toolId;
            this.notify('tool_changed', { toolId, tool: MOCK_TOOLS[toolId] });
        }

        getTool(toolId = this.activeTool) {
            return MOCK_TOOLS[toolId];
        }

        getAllTools() {
            return Object.values(MOCK_TOOLS);
        }

        getPresets() {
            return PRESETS;
        }

        executeTool(toolId, rawPayload) {
            const tool = MOCK_TOOLS[toolId];
            if (!tool) throw new Error(`Unknown MCP Tool: ${toolId}`);

            let payload = {};
            try {
                payload = typeof rawPayload === 'string' ? JSON.parse(rawPayload) : rawPayload;
            } catch (e) {
                const errorResult = {
                    status: 'ERROR',
                    error: 'INVALID_JSON_PAYLOAD',
                    message: e.message,
                    timestamp: new Date().toISOString()
                };
                this.recordHistory(toolId, payload, errorResult);
                return errorResult;
            }

            let result = {};
            if (toolId === 'task_pipeline') {
                result = {
                    ...tool.response,
                    timestamp: new Date().toISOString(),
                    echo_task: payload.task || 'Default audit',
                    execution_time_ms: (Math.random() * 0.4 + 0.5).toFixed(2)
                };
            } else if (toolId === 'workflow_gate') {
                const isBlocked = payload.simulate_block || (payload.relative_paths && payload.relative_paths.some(p => p.includes('monolith')));
                result = isBlocked
                    ? { ...tool.scenarios.blocked_300, timestamp: new Date().toISOString() }
                    : { ...tool.scenarios.authorized, timestamp: new Date().toISOString() };
            } else if (toolId === 'project_context') {
                result = {
                    ...tool.benchmark,
                    timestamp: new Date().toISOString(),
                    target: payload.relative_path || 'src/services/auth.js',
                    symbol_searched: payload.target_symbol || 'all'
                };
                this.rawTokensTotal += result.raw_file_tokens;
                this.boundedTokensTotal += result.bounded_tokens;
                this.totalTokensSaved += result.saved_tokens;
            } else if (toolId === 'guidance') {
                const query = (payload.query || '').toLowerCase();
                const matches = this.searchSkills(query);
                result = {
                    status: 'PASSED',
                    timestamp: new Date().toISOString(),
                    query: payload.query || '*',
                    matches_count: matches.length,
                    skills: matches
                };
            }

            this.recordHistory(toolId, payload, result);
            this.notify('tool_executed', { toolId, payload, result });
            return result;
        }

        searchSkills(query) {
            if (!query) return SKILL_CATALOG;
            const q = query.toLowerCase();
            return SKILL_CATALOG.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.category.toLowerCase().includes(q) ||
                s.desc.toLowerCase().includes(q)
            ).sort((a, b) => b.score - a.score);
        }

        recordHistory(toolId, payload, result) {
            const entry = {
                id: 'call_' + Math.random().toString(36).substring(2, 9),
                timestamp: new Date().toLocaleTimeString(),
                toolId,
                payload,
                result
            };
            this.history.unshift(entry);
            if (this.history.length > 50) this.history.pop();
        }

        getHistory() {
            return this.history;
        }

        clearHistory() {
            this.history = [];
            this.notify('history_cleared', {});
        }

        getStats() {
            const savingsPct = this.rawTokensTotal > 0
                ? ((this.totalTokensSaved / this.rawTokensTotal) * 100).toFixed(1)
                : 0;
            return {
                totalSaved: this.totalTokensSaved,
                rawTotal: this.rawTokensTotal,
                boundedTotal: this.boundedTokensTotal,
                savingsPct
            };
        }
    }

    window.McpSimulatorCore = McpSimulatorCore;
})();
