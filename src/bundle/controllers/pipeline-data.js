// ============================================================
// controllers/pipeline-data.js — SDLC Pipeline preset data
// Structured message format: { agent, type, content, ... }
// Types: text, code, diff, command, status, thinking, divider
// ============================================================

var PIPELINE_PRESETS = {
    en: {
        "ad-deploy": {
            name: "Staging Active Directory VM & DNS Infrastructure",
            steps: [
                {
                    title: "PLANNING PHASE",
                    phase: "plan",
                    messages: [
                        { agent: "user", type: "text", content: "Stage a new Windows Server Active Directory controller for local operations." },
                        { agent: "planner", type: "thinking", content: "Analyzing request...", duration: 1200 },
                        { agent: "planner", type: "text", content: "Parsing request. Target Domain: factory.internal. Subnet: 10.0.10.0/24." },
                        { agent: "planner", type: "text", content: "Formulated deployment DAG. Delegating script creation to CoderAgent." },
                        { agent: "planner", type: "status", content: "Architecture plan finalized.", status: "pass" }
                    ]
                },
                {
                    title: "CODING / AUTOMATION PHASE",
                    phase: "code",
                    messages: [
                        { agent: "coder", type: "text", content: "Creating PowerShell bootstrap script: build_ad.ps1..." },
                        { agent: "coder", type: "code", content: "Generating directory configuration diff:", language: "powershell", code: "# PowerShell Active Directory Staging Script\nImport-Module ADDSDeployment\nInstall-WindowsFeature AD-Domain-Services -IncludeManagementTools\nInstall-ADDSForest -DomainName \"factory.internal\" -SafeModeAdministratorPassword $pass" },
                        { agent: "coder", type: "thinking", content: "Validating syntax...", duration: 800 },
                        { agent: "coder", type: "status", content: "Code synthesis complete. Handing over to VerifierAgent.", status: "pass" }
                    ]
                },
                {
                    title: "VERIFICATION PHASE",
                    phase: "verify",
                    messages: [
                        { agent: "verifier", type: "thinking", content: "Running syntax checks...", duration: 1500 },
                        { agent: "verifier", type: "text", content: "Running syntax parser & compiler linter..." },
                        { agent: "verifier", type: "status", content: "[Linter] Syntax check: OK. 0 errors, 0 warnings.", status: "pass" },
                        { agent: "verifier", type: "text", content: "Dry-running Active Directory setup in sandboxed hypervisor..." },
                        { agent: "verifier", type: "status", content: "[DNS test] Resolution checked. OUs validated. All checks PASSED.", status: "pass" }
                    ]
                },
                {
                    title: "DEPLOYMENT & GIT COMMIT PHASE",
                    phase: "deploy",
                    messages: [
                        { agent: "git", type: "thinking", content: "Staging changes...", duration: 600 },
                        { agent: "git", type: "text", content: "Staging changes and committing to local repository..." },
                        { agent: "git", type: "command", content: "git add -A && git commit -m \"infra: bootstrap staging Active Directory Domain Controller\"" },
                        { agent: "git", type: "diff", content: "Diff summary:", diff: [
                            "+ # PowerShell Active Directory Staging Script",
                            "+ Import-Module ADDSDeployment",
                            "+ Install-WindowsFeature AD-Domain-Services -IncludeManagementTools",
                            "+ Install-ADDSForest -DomainName \"factory.internal\" -SafeModeAdministratorPassword $pass"
                        ]},
                        { agent: "git", type: "text", content: "[main 9d2f8a1] infra: bootstrap staging Active Directory Domain Controller" },
                        { agent: "git", type: "text", content: "1 file changed, 45 insertions(+), 0 deletions(-)" },
                        { agent: "system", type: "status", content: "Initializing deployment on host VM... Domain services ONLINE & healthy.", status: "pass" }
                    ]
                }
            ]
        },
        "mcp-feature": {
            name: "Implementing Token-Optimized Guidance Search in MCP Server",
            steps: [
                {
                    title: "PLANNING PHASE",
                    phase: "plan",
                    messages: [
                        { agent: "user", type: "text", content: "Add local guidance query search functionality to the agent-guidance-mcp server." },
                        { agent: "planner", type: "thinking", content: "Analyzing requirement...", duration: 1000 },
                        { agent: "planner", type: "text", content: "Analyzing requirement. Index 168 local skills using SQLite FTS5." },
                        { agent: "planner", type: "text", content: "Constraint: Strict 150 token output limit per lookup to prevent client blowout." },
                        { agent: "planner", type: "status", content: "Plan approved. Delegating to CoderAgent.", status: "pass" }
                    ]
                },
                {
                    title: "CODING / AUTOMATION PHASE",
                    phase: "code",
                    messages: [
                        { agent: "coder", type: "text", content: "Writing search algorithm in python..." },
                        { agent: "coder", type: "code", content: "Staging search.py modifications:", language: "python", code: "# Before: simple LIKE query\ndef search_skills(query):\n    return db.query(\"SELECT * FROM skills WHERE desc LIKE ?\", ('%' + query + '%',))\n\n# After: SQLite FTS5 weighted query\ndef search_skills(query):\n    # SQLite FTS5 weighted query\n    return db.query(\"SELECT id, desc, rank FROM skills_fts WHERE skills_fts MATCH ? ORDER BY rank LIMIT 5\", (query,))" },
                        { agent: "coder", type: "thinking", content: "Running tests...", duration: 900 },
                        { agent: "coder", type: "status", content: "Code generated. Requesting verification checks.", status: "pass" }
                    ]
                },
                {
                    title: "VERIFICATION PHASE",
                    phase: "verify",
                    messages: [
                        { agent: "verifier", type: "thinking", content: "Running Ruff checks...", duration: 1200 },
                        { agent: "verifier", type: "text", content: "Running code formatting checking via Ruff..." },
                        { agent: "verifier", type: "status", content: "[Ruff] 0 format violations detected.", status: "pass" },
                        { agent: "verifier", type: "text", content: "Running unit tests..." },
                        { agent: "verifier", type: "status", content: "[pytest] TestSuite: 12 tests passed, 0 failed. Execution time: 0.22s.", status: "pass" }
                    ]
                },
                {
                    title: "DEPLOYMENT & GIT COMMIT PHASE",
                    phase: "deploy",
                    messages: [
                        { agent: "git", type: "thinking", content: "Committing feature...", duration: 500 },
                        { agent: "git", type: "text", content: "Committing feature code..." },
                        { agent: "git", type: "command", content: "git commit -a -m \"feat(search): implement weighted FTS5 search with token caps\"" },
                        { agent: "git", type: "text", content: "[main 4c1d2e8] feat(search): implement weighted FTS5 search with token caps" },
                        { agent: "git", type: "text", content: "2 files changed, 24 insertions(+), 8 deletions(-)" },
                        { agent: "system", type: "status", content: "Re-linking Stdio MCP Server... Server up and listening on Stdio.", status: "pass" }
                    ]
                }
            ]
        }
    },
    vi: {
        "ad-deploy": {
            name: "Tri\u1ec3n khai M\u00e1y ch\u1ee7 \u1ea2o Active Directory & C\u1ea5u h\u00ecnh DNS",
            steps: [
                {
                    title: "B\u01af\u1edaC L\u1eacP K\u1ebe HO\u1ea0CH",
                    phase: "plan",
                    messages: [
                        { agent: "user", type: "text", content: "D\u1ef1ng m\u00e1y ch\u1ee7 qu\u1ea3n l\u00fd t\u00ean mi\u1ec1n Active Directory m\u1edbi cho v\u1eadn h\u00e0nh n\u1ed9i b\u1ed9." },
                        { agent: "planner", type: "thinking", content: "\u0110ang ph\u00e2n t\u00edch y\u00eau c\u1ea7u...", duration: 1200 },
                        { agent: "planner", type: "text", content: "Ph\u00e2n t\u00edch y\u00eau c\u1ea7u. T\u00ean mi\u1ec1n: factory.internal. M\u1ea1ng: 10.0.10.0/24." },
                        { agent: "planner", type: "text", content: "L\u1eadp s\u01a1 \u0111\u1ed3 tri\u1ec3n khai DAG. Giao vi\u1ec7c vi\u1ebft t\u1eadp l\u1ec7nh cho CoderAgent." },
                        { agent: "planner", type: "status", content: "K\u1ebf ho\u1ea1ch ki\u1ebfn tr\u00fac \u0111\u00e3 \u0111\u01b0\u1ee3c th\u00f4ng qua.", status: "pass" }
                    ]
                },
                {
                    title: "B\u01af\u1edaC VI\u1ebeT CODE / T\u1ef0 \u0110\u1ed8NG H\u00d3A",
                    phase: "code",
                    messages: [
                        { agent: "coder", type: "text", content: "T\u1ea1o m\u00e3 t\u1ef1 \u0111\u1ed9ng h\u00f3a PowerShell: build_ad.ps1..." },
                        { agent: "coder", type: "code", content: "B\u1ea3n thay \u0111\u1ed5i m\u00e3 ngu\u1ed3n:", language: "powershell", code: "# PowerShell Active Directory Staging Script\nImport-Module ADDSDeployment\nInstall-WindowsFeature AD-Domain-Services -IncludeManagementTools\nInstall-ADDSForest -DomainName \"factory.internal\" -SafeModeAdministratorPassword $pass" },
                        { agent: "coder", type: "thinking", content: "\u0110ang x\u00e1c th\u1ef1c c\u00fa ph\u00e1p...", duration: 800 },
                        { agent: "coder", type: "status", content: "T\u1ed5ng h\u1ee3p m\u00e3 ho\u00e0n t\u1ea5t. Chuy\u1ec3n giao sang VerifierAgent.", status: "pass" }
                    ]
                },
                {
                    title: "B\u01af\u1edaC X\u00c1C MINH KI\u1ec2M TH\u1eec",
                    phase: "verify",
                    messages: [
                        { agent: "verifier", type: "thinking", content: "\u0110ang ch\u1ea1y ki\u1ec3m tra c\u00fa ph\u00e1p...", duration: 1500 },
                        { agent: "verifier", type: "text", content: "Ch\u1ea1y tr\u00ecnh ki\u1ec3m tra c\u00fa ph\u00e1p v\u00e0 quy chu\u1ea9n m\u00e3 l\u1ec7nh..." },
                        { agent: "verifier", type: "status", content: "[Linter] Ki\u1ec3m \u0111\u1ecbnh c\u00fa ph\u00e1p: OK. 0 l\u1ed7i, 0 c\u1ea3nh b\u00e1o.", status: "pass" },
                        { agent: "verifier", type: "text", content: "Ch\u1ea1y th\u1eed thi\u1ebft l\u1eadp AD trong m\u00e1y \u1ea3o gi\u1ea3 l\u1eadp c\u00f4 l\u1eadp..." },
                        { agent: "verifier", type: "status", content: "[DNS test] Ph\u00e2n gi\u1ea3i DNS ho\u1ea1t \u0111\u1ed9ng. OUs h\u1ee3p l\u1ec7. Ki\u1ec3m tra TH\u00d4NG QUA.", status: "pass" }
                    ]
                },
                {
                    title: "Tri\u1ec3n khai & Commit Git",
                    phase: "deploy",
                    messages: [
                        { agent: "git", type: "thinking", content: "\u0110ang chu\u1ea9n b\u1ecb commit...", duration: 600 },
                        { agent: "git", type: "text", content: "\u0110\u01b0a c\u00e1c t\u1ec7p v\u00e0o h\u00e0ng ch\u1edd v\u00e0 commit v\u00e0o kho l\u01b0u tr\u1eef..." },
                        { agent: "git", type: "command", content: "git add -A && git commit -m \"infra: bootstrap staging Active Directory Domain Controller\"" },
                        { agent: "git", type: "diff", content: "T\u00f3m t\u1eaft thay \u0111\u1ed5i:", diff: [
                            "+ # PowerShell Active Directory Staging Script",
                            "+ Import-Module ADDSDeployment",
                            "+ Install-WindowsFeature AD-Domain-Services -IncludeManagementTools",
                            "+ Install-ADDSForest -DomainName \"factory.internal\" -SafeModeAdministratorPassword $pass"
                        ]},
                        { agent: "git", type: "text", content: "[main 9d2f8a1] infra: bootstrap staging Active Directory Domain Controller" },
                        { agent: "git", type: "text", content: "1 t\u1ec7p thay \u0111\u1ed5i, 45 d\u00f2ng th\u00eam (+), 0 d\u00f2ng x\u00f3a (-)" },
                        { agent: "system", type: "status", content: "Kh\u1edfi t\u1ea1o tri\u1ec3n khai d\u1ecbch v\u1ee5 AD tr\u00ean VM... Tr\u1ea1ng th\u00e1i ONLINE v\u00e0 kh\u1ecfe m\u1ea1nh.", status: "pass" }
                    ]
                }
            ]
        },
        "mcp-feature": {
            name: "T\u00edch h\u1ee3p T\u00ecm ki\u1ebfm T\u1ed1i \u01b0u Token v\u00e0o M\u00e1y ch\u1ee7 MCP",
            steps: [
                {
                    title: "B\u01af\u1edaC L\u1eacP K\u1ebe HO\u1ea0CH",
                    phase: "plan",
                    messages: [
                        { agent: "user", type: "text", content: "T\u00edch h\u1ee3p ch\u1ee9c n\u0103ng t\u00ecm ki\u1ebfm k\u1ef9 n\u0103ng v\u00e0o m\u00e1y ch\u1ee7 agent-guidance-mcp." },
                        { agent: "planner", type: "thinking", content: "\u0110ang ph\u00e2n t\u00edch y\u00eau c\u1ea7u...", duration: 1000 },
                        { agent: "planner", type: "text", content: "Ph\u00e2n t\u00edch y\u00eau c\u1ea7u. Ch\u1ec9 m\u1ee5c h\u00f3a 168 k\u1ef9 n\u0103ng b\u1eb1ng SQLite FTS5." },
                        { agent: "planner", type: "text", content: "R\u00e0ng bu\u1ed9c: Gi\u1edbi h\u1ea1n 150 token m\u1ed7i truy v\u1ea5n \u0111\u1ec3 tr\u00e1nh qu\u00e1 t\u1ea3i d\u1eef li\u1ec7u." },
                        { agent: "planner", type: "status", content: "Ph\u00ea duy\u1ec7t k\u1ebf ho\u1ea1ch. Giao vi\u1ec7c cho CoderAgent.", status: "pass" }
                    ]
                },
                {
                    title: "B\u01af\u1edaC VI\u1ebeT CODE / T\u1ef0 \u0110\u1ed8NG H\u00d3A",
                    phase: "code",
                    messages: [
                        { agent: "coder", type: "text", content: "Vi\u1ebft thu\u1eadt to\u00e1n t\u00ecm ki\u1ebfm b\u1eb1ng Python..." },
                        { agent: "coder", type: "code", content: "B\u1ea3n thay \u0111\u1ed5i m\u00e3 ngu\u1ed3n trong search.py:", language: "python", code: "# Before: simple LIKE query\ndef search_skills(query):\n    return db.query(\"SELECT * FROM skills WHERE desc LIKE ?\", ('%' + query + '%',))\n\n# After: SQLite FTS5 weighted query\ndef search_skills(query):\n    # SQLite FTS5 weighted query\n    return db.query(\"SELECT id, desc, rank FROM skills_fts WHERE skills_fts MATCH ? ORDER BY rank LIMIT 5\", (query,))" },
                        { agent: "coder", type: "thinking", content: "\u0110ang ch\u1ea1y ki\u1ec3m th\u1eed...", duration: 900 },
                        { agent: "coder", type: "status", content: "\u0110\u00e3 sinh m\u00e3 ngu\u1ed3n. Y\u00eau c\u1ea7u ch\u1ea1y ki\u1ec3m th\u1eed.", status: "pass" }
                    ]
                },
                {
                    title: "B\u01af\u1edaC X\u00c1C MINH KI\u1ec2M TH\u1eec",
                    phase: "verify",
                    messages: [
                        { agent: "verifier", type: "thinking", content: "\u0110ang ch\u1ea1y Ruff...", duration: 1200 },
                        { agent: "verifier", type: "text", content: "Ch\u1ea1y tr\u00ecnh ki\u1ec3m tra quy chu\u1ea9n Ruff..." },
                        { agent: "verifier", type: "status", content: "[Ruff] 0 l\u1ed7i quy chu\u1ea9n \u0111\u01b0\u1ee3c ph\u00e1t hi\u1ec7n.", status: "pass" },
                        { agent: "verifier", type: "text", content: "Th\u1ef1c thi c\u00e1c ca ki\u1ec3m th\u1eed t\u1ef1 \u0111\u1ed9ng..." },
                        { agent: "verifier", type: "status", content: "[pytest] TestSuite: 12 b\u00e0i test \u0111\u00e3 th\u00f4ng qua. Th\u1eddi gian ch\u1ea1y: 0.22s.", status: "pass" }
                    ]
                },
                {
                    title: "Tri\u1ec3n khai & Commit Git",
                    phase: "deploy",
                    messages: [
                        { agent: "git", type: "thinking", content: "\u0110ang commit...", duration: 500 },
                        { agent: "git", type: "text", content: "\u0110ang commit m\u00e3 ngu\u1ed3n t\u00ednh n\u0103ng..." },
                        { agent: "git", type: "command", content: "git commit -a -m \"feat(search): implement weighted FTS5 search with token caps\"" },
                        { agent: "git", type: "text", content: "[main 4c1d2e8] feat(search): implement weighted FTS5 search with token caps" },
                        { agent: "git", type: "text", content: "2 t\u1ec7p thay \u0111\u1ed5i, 24 d\u00f2ng th\u00eam (+), 8 d\u00f2ng x\u00f3a (-)" },
                        { agent: "system", type: "status", content: "Kh\u1edfi \u0111\u1ed9ng l\u1ea1i li\u00ean k\u1ebft m\u00e1y ch\u1ee7 MCP... Tr\u1ea1ng th\u00e1i k\u1ebft n\u1ed1i s\u1eb5n s\u00e0ng.", status: "pass" }
                    ]
                }
            ]
        }
    }
};
