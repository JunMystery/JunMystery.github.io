/**
 * Agent-Guidance MCP Workbench - Mock Data Registry
 * 100% Offline-friendly: attached to window (no import/export, no server needed)
 */

(function () {
    const MOCK_TOOLS = {
        task_pipeline: {
            id: "task_pipeline",
            name: "task_pipeline",
            category: "ORCHESTRATION",
            desc_en: "Turn 1 agent bootstrapping, dynamic architecture pattern detection, and monolithic file alerts.",
            desc_vi: "Khởi tạo Agent Turn 1, tự động phát hiện kiến trúc & cảnh báo cấu trúc file nguyên khối.",
            default_payload: JSON.stringify({ task: "Integrate OAuth2 & JWT into auth service", phase: "plan" }, null, 2),
            response: {
                status: "ACTIVATED",
                active_phase: "plan",
                detected_pattern: "Layered_Architecture",
                monolithic_alerts: [
                    "src/auth-handler.js (342 LOC >= 200 LOC limit) - Decompose into auth-service.js & auth-validator.js"
                ],
                upfront_blueprint: {
                    controllers: "< 100 LOC (input validation & routing)",
                    services: "< 200 LOC (business workflows)",
                    domain_models: "< 150 LOC (schemas & types)"
                },
                memory_check: "Restored prior architectural boundaries from .agent-context"
            }
        },
        workflow_gate: {
            id: "workflow_gate",
            name: "workflow_gate",
            category: "GOVERNANCE",
            desc_en: "Enforces 300 LOC hard cap, plan approval gates, and batch edit authorizations.",
            desc_vi: "Kiểm soát giới hạn 300 LOC, cổng duyệt kế hoạch & cấp quyền sửa file theo nhóm.",
            default_payload: JSON.stringify({ action: "authorize_edit", relative_paths: ["src/services/auth.js"], risk_level: "LOW" }, null, 2),
            scenarios: {
                authorized: {
                    status: "PASSED",
                    active_stage: "Build",
                    plan_approved: true,
                    authorized_count: 2,
                    circuit_breaker: "0/3 fix attempts",
                    loc_verification: "All targets < 300 LOC compliant",
                    audit_log: "Batch edit authorized under Layered_Architecture"
                },
                blocked_300: {
                    status: "BLOCKED",
                    error_code: "LOC_LIMIT_EXCEEDED",
                    violating_file: "src/services/mega-monolith.js",
                    current_loc: 485,
                    hard_cap: 300,
                    remediation: "Refactor into single-responsibility submodules (<150 LOC) before requesting edit authorization."
                }
            }
        },
        project_context: {
            id: "project_context",
            name: "project_context",
            category: "TOKEN_OPTIMIZER",
            desc_en: "Token-bounded reads (capped at 300 LOC) and AST GraphRAG symbol extraction.",
            desc_vi: "Đọc mã giới hạn token (<300 dòng) và trích xuất ký hiệu AST GraphRAG cục bộ.",
            default_payload: JSON.stringify({ operation: "read", relative_path: "src/services/auth.js", target_symbol: "verifyToken" }, null, 2),
            benchmark: {
                target: "src/services/auth.js",
                raw_file_tokens: 14850,
                bounded_tokens: 620,
                saved_tokens: 14230,
                savings_pct: 95.8,
                compression_time_ms: 0.84,
                engine: "Native Rust 2024 Memory-Mapped FTS"
            }
        },
        guidance: {
            id: "guidance",
            name: "guidance",
            category: "CATALOG",
            desc_en: "279-skill embedded catalog search with hybrid vector + BM25 ranking and zero token bloat.",
            desc_vi: "Tra cứu danh mục 279 kỹ năng nhúng với bộ xếp hạng vector lai + BM25 tối ưu token.",
            default_payload: JSON.stringify({ operation: "search", query: "rust mcp security" }, null, 2)
        }
    };

    const SKILL_CATALOG = [
        { id: "agent-guidance", name: "agent-guidance", category: "Governance", score: 0.98, desc: "Architectural discipline & token optimization protocol for AI coding agents." },
        { id: "rust-mcp-protocol", name: "rust-mcp-protocol", category: "Systems", score: 0.94, desc: "High-performance Model Context Protocol stdio server implementation in Rust." },
        { id: "clean-architecture-gate", name: "clean-architecture-gate", category: "Architecture", score: 0.91, desc: "Upfront architecture enforcement: boundaries, entities, and use-cases under 300 LOC." },
        { id: "token-context-compressor", name: "token-context-compressor", category: "AI & LLM", score: 0.89, desc: "AST symbol indexing and whitespace pruning to cut 40-80% prompt tokens." },
        { id: "docker-compose-production", name: "docker-compose-production", category: "DevOps", score: 0.85, desc: "Multi-stage production containerization with hardened rootless profiles." },
        { id: "postgresql-indexing-audit", name: "postgresql-indexing-audit", category: "Database", score: 0.82, desc: "Query plan analysis, composite btree indexing, and connection pool sizing." },
        { id: "zero-trust-auth-security", name: "zero-trust-auth-security", category: "Security", score: 0.80, desc: "JWT rotation, RBAC permission matrices, and CSRF protection headers." },
        { id: "fastapi-async-worker", name: "fastapi-async-worker", category: "Backend", score: 0.78, desc: "Non-blocking async handlers, background workers, and Celery task queues." },
        { id: "android-compose-state", name: "android-compose-state", category: "Mobile", score: 0.76, desc: "Jetpack Compose unidirectional data flow with StateFlow and Room SQLite." },
        { id: "react-state-reducer", name: "react-state-reducer", category: "Frontend", score: 0.74, desc: "Predictable complex client state modeling with useReducer & TypeScript." }
    ];

    const PRESETS = [
        {
            id: "block_300",
            label_en: "Test 300 LOC Gate Block",
            label_vi: "Thử Nghiệm Chặn Vi Phạm 300 LOC",
            tool: "workflow_gate",
            action: "simulate_block",
            desc_en: "Watch the gate block a 485 LOC monolithic file insertion.",
            desc_vi: "Xem Gate lập tức chặn nạp file 485 dòng vượt ngưỡng 300 LOC."
        },
        {
            id: "benchmark_token",
            label_en: "Benchmark Token Saver",
            label_vi: "Đo Lường Tiết Kiệm Token (Raw vs MCP)",
            tool: "project_context",
            action: "benchmark",
            desc_en: "Compare raw full-file read vs token-bounded symbol read (95%+ saved).",
            desc_vi: "So sánh đọc thô toàn file với đọc trích xuất AST (tiết kiệm >95% token)."
        },
        {
            id: "search_skills",
            label_en: "Search 279-Skill Catalog",
            label_vi: "Tra Cứu Danh Mục 279 Kỹ Năng",
            tool: "guidance",
            action: "search",
            query: "rust mcp",
            desc_en: "Instant hybrid vector search across embedded standard skill sets.",
            desc_vi: "Tìm kiếm vector lai tức thì trong danh mục kỹ năng chuẩn hóa."
        },
        {
            id: "pipeline_init",
            label_en: "Run Turn 1 Task Pipeline",
            label_vi: "Khởi Tạo Task Pipeline Turn 1",
            tool: "task_pipeline",
            action: "run_pipeline",
            desc_en: "Simulate turn 1 project scan, architecture detection, and blueprint check.",
            desc_vi: "Mô phỏng quét dự án, nhận diện kiến trúc và thiết lập ranh giới code."
        }
    ];

    window.McpMockData = {
        MOCK_TOOLS,
        SKILL_CATALOG,
        PRESETS
    };
})();
