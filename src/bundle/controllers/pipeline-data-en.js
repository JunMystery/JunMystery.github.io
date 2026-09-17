// ============================================================
// controllers/pipeline-data-en.js — EN preset data
// ============================================================

PIPELINE_PRESETS.en = {
    "ad-deploy": {
        name: "Staging Active Directory VM & DNS Infrastructure",
        gameOutput: "snake",
        steps: [
            {
                title: "PLANNING PHASE",
                phase: "plan",
                messages: [
                    { agent: "user", type: "text", content: "Need to set up AD DS + DNS on Windows Server 2022 in our test lab before prod rollout." },
                    { agent: "system", type: "thinking", duration: 1200 },
                    { agent: "planner", type: "text", content: "Breaking down the AD deployment into phases:\n1. Validate hardware prerequisites (8 vCPU / 32 GB RAM / 200 GB SSD)\n2. Install AD Domain Services role + DNS Server role\n3. Configure a new forest (domain: lab.corp.example.com)\n4. Create OUs: CorpUsers, CorpComputers, ServiceAccounts\n5. Set up reverse lookup zones + dynamic DNS updates\n6. Promote secondary DC for fault tolerance" },
                    { agent: "system", type: "divider", content: "Plan finalized" }
                ]
            },
            {
                title: "DEVELOPMENT EXECUTION",
                phase: "code",
                messages: [
                    { agent: "coder", type: "thinking", duration: 800 },
                    { agent: "coder", type: "code", language: "powershell", code: "# Install AD DS + DNS roles\nInstall-WindowsFeature -Name AD-Domain-Services,DNS -IncludeManagementTools\n\n# Promote to Domain Controller (new forest)\nInstall-ADDSForest -DomainName \"lab.corp.example.com\" `\n  -SafeModeAdministratorPassword (ConvertTo-SecureString \"P@ssw0rd!\" -AsPlainText -Force) `\n  -Force:$true -Confirm:$false\n\n# Create OUs\nNew-ADOrganizationalUnit -Name \"CorpUsers\" -Path \"DC=lab,DC=corp,DC=example,DC=com\"\nNew-ADOrganizationalUnit -Name \"CorpComputers\" -Path \"DC=lab,DC=corp,DC=example,DC=com\"\nNew-ADOrganizationalUnit -Name \"ServiceAccounts\" -Path \"DC=lab,DC=corp,DC=example,DC=com\"" }
                ]
            },
            {
                title: "VERIFICATION",
                phase: "verify",
                messages: [
                    { agent: "verifier", type: "thinking", duration: 600 },
                    { agent: "verifier", type: "diff", content: "Config validation:", diff: ["+ DNS zone 'lab.corp.example.com' created", "+ Reverse lookup zone '10.0.0.x' configured", "+ SRV records registered (_ldap._tcp.dc._msdcs)", "+ 3 OUs structured under domain root"] },
                    { agent: "verifier", type: "status", content: "AD health check: OK. DNS resolution: OK. Replication: OK.", status: "pass" }
                ]
            },
            {
                title: "DEPLOYMENT",
                phase: "deploy",
                messages: [
                    { agent: "system", type: "thinking", duration: 400 },
                    { agent: "git", type: "command", content: "terraform apply -auto-approve" },
                    { agent: "git", type: "text", content: "Output: Apply complete! Resources: 6 added, 0 changed, 0 destroyed." },
                    { agent: "git", type: "text", content: "Secondary DC promotion queued for off-hours." },
                    { agent: "system", type: "status", content: "AD DS + DNS deployed lab.corp.example.com (Build artifact: snake-game.html)", status: "pass" }
                ]
            }
        ]
    },
    "mcp-feature": {
        name: "Implement MCP Guidance Search",
        gameOutput: "tetris",
        steps: [
            {
                title: "PLANNING PHASE",
                phase: "plan",
                messages: [
                    { agent: "user", type: "text", content: "We need a MCP-based guidance search that lets users query skills via natural language." },
                    { agent: "system", type: "thinking", duration: 1200 },
                    { agent: "planner", type: "text", content: "Architecture breakdown:\n1. Define skill metadata schema (name, description, tags, category)\n2. Implement vector similarity search using embeddings (sentence-transformers)\n3. Build MCP tool wrapper: guidance_search(query, limit, category?)\n4. Wire into existing prompt pipeline as a skill-lookup step\n5. Add caching layer (LRU, TTL 5 min) for frequent queries" },
                    { agent: "system", type: "divider", content: "Plan finalized" }
                ]
            },
            {
                title: "DEVELOPMENT EXECUTION",
                phase: "code",
                messages: [
                    { agent: "coder", type: "thinking", duration: 800 },
                    { agent: "coder", type: "code", language: "typescript", code: "// guidance-search.ts — MCP-powered skill lookup\ninterface SkillDoc {\n  id: string;\n  name: string;\n  description: string;\n  tags: string[];\n  category: string;\n  embedding?: number[];\n}\n\nconst cache = new LRUCache<string, SkillDoc[]>({ max: 100, ttl: 300_000 });\n\nasync function guidanceSearch(\n  query: string,\n  limit = 5,\n  category?: string\n): Promise<SkillDoc[]> {\n  const cacheKey = `${query}:${limit}:${category ?? '*'}`;\n  const cached = cache.get(cacheKey);\n  if (cached) return cached;\n\n  const embedding = await embed(query);\n  const results = await vectorDB.search(embedding, { limit, filter: category ? { category } : undefined });\n  cache.set(cacheKey, results);\n  return results;\n}" }
                ]
            },
            {
                title: "VERIFICATION",
                phase: "verify",
                messages: [
                    { agent: "verifier", type: "thinking", duration: 600 },
                    { agent: "verifier", type: "diff", content: "Test results:", diff: ["+ guidance_search('authentication') returns 5 results in 42ms", "+ category filter 'security' narrows to 3 results", "+ Cache hit reduces latency to 2ms", "+ 0 false positives in 20-sample eval"] },
                    { agent: "verifier", type: "status", content: "Precision: 0.95. Recall: 0.92. Latency p95: 68ms.", status: "pass" }
                ]
            },
            {
                title: "DEPLOYMENT",
                phase: "deploy",
                messages: [
                    { agent: "system", type: "thinking", duration: 400 },
                    { agent: "git", type: "command", content: "npm run build && npm publish" },
                    { agent: "git", type: "text", content: "Published @org/guidance-search v1.0.0 to internal registry." },
                    { agent: "git", type: "text", content: "Integration PR merged into main pipeline." },
                    { agent: "system", type: "status", content: "MCP Guidance Search deployed v1.0.0 (Build artifact: tetris-game.html)", status: "pass" }
                ]
            }
        ]
    },
    "portfolio-deploy": {
        name: "Deploy Portfolio to Cloudflare",
        gameOutput: "pacman",
        steps: [
            {
                title: "PLANNING PHASE",
                phase: "plan",
                messages: [
                    { agent: "user", type: "text", content: "We need to deploy the static portfolio site to Cloudflare Pages with custom domain." },
                    { agent: "system", type: "thinking", duration: 1200 },
                    { agent: "planner", type: "text", content: "Deployment plan:\n1. Build static site (Jekyll/Hugo/vanilla — confirm stack)\n2. Configure cloudflare.toml for build settings\n3. Set up Cloudflare Pages project via Wrangler CLI\n4. Configure custom domain (junmystery.dev) + SSL\n5. Enable D1 database for contact form submissions\n6. Set up branch preview deployments" },
                    { agent: "system", type: "divider", content: "Plan finalized" }
                ]
            },
            {
                title: "DEVELOPMENT EXECUTION",
                phase: "code",
                messages: [
                    { agent: "coder", type: "thinking", duration: 800 },
                    { agent: "coder", type: "code", language: "toml", code: "# cloudflare.toml\nname = \"junmystery-portfolio\"\ncompatibility_date = \"2025-01-01\"\n\n[build]\ncommand = \"bash src/bundle/build.sh\"\npublish = \"./\"\n\n[env.production]\nroutes = [{ pattern = \"junmystery.dev\", zone = \"<zone_id>\" }]\n\n[env.preview]\nroutes = [{ pattern = \"preview.junmystery.dev\" }]\n\n[[d1_databases]]\nbinding = \"CONTACT_DB\"\ndatabase_name = \"portfolio-contact\"\ndatabase_id = \"<db_id>\"" }
                ]
            },
            {
                title: "VERIFICATION",
                phase: "verify",
                messages: [
                    { agent: "verifier", type: "thinking", duration: 600 },
                    { agent: "verifier", type: "diff", content: "Deploy validation:", diff: ["+ Build output: 47 files, 2.3 MB total", "+ All internal links resolve (0 dead links)", "+ Lighthouse score: 98 Performance / 100 Accessibility", "+ Custom domain SSL: Active (TLS 1.3)", "+ D1 database: Connected"] },
                    { agent: "verifier", type: "status", content: "Preview deployment: OK. Production ready.", status: "pass" }
                ]
            },
            {
                title: "DEPLOYMENT",
                phase: "deploy",
                messages: [
                    { agent: "system", type: "thinking", duration: 400 },
                    { agent: "git", type: "command", content: "wrangler pages deploy --branch=main" },
                    { agent: "git", type: "text", content: "✨ Deployment complete! https://junmystery.dev" },
                    { agent: "git", type: "text", content: "Cache purged. CDN propagation: 12s." },
                    { agent: "system", type: "status", content: "Portfolio deployed to Cloudflare Pages (Build artifact: pacman-game.html)", status: "pass" }
                ]
            }
        ]
    },
    "game-engine": {
        name: "Build 2D Canvas Game Engine",
        gameOutput: "flappy",
        steps: [
            {
                title: "PLANNING PHASE",
                phase: "plan",
                messages: [
                    { agent: "user", type: "text", content: "Design a lightweight 2D canvas engine for simple browser games (snake, tetris, pacman, flappy)." },
                    { agent: "system", type: "thinking", duration: 1200 },
                    { agent: "planner", type: "text", content: "Engine architecture:\n1. Canvas2D renderer with auto-scaling and HiDPI support\n2. Entity-component system (ECS): Position, Velocity, Sprite, Collider, Health\n3. Input manager (keyboard + touch) with action mapping\n4. Physics subsystem: AABB collision, gravity, bounce easing\n5. Audio manager for Web Audio API (SFX + music tracks)\n6. Scene graph with camera transform, layers, and parallax" },
                    { agent: "system", type: "divider", content: "Plan finalized" }
                ]
            },
            {
                title: "DEVELOPMENT EXECUTION",
                phase: "code",
                messages: [
                    { agent: "coder", type: "thinking", duration: 800 },
                    { agent: "coder", type: "code", language: "javascript", code: "// engine.js — 2D canvas game engine core\nclass Engine {\n  constructor(canvasId) {\n    this.canvas = document.getElementById(canvasId);\n    this.ctx = this.canvas.getContext('2d');\n    this.scenes = new Map();\n    this.activeScene = null;\n    this.lastTime = 0;\n    this.running = false;\n  }\n\n  addScene(name, scene) {\n    this.scenes.set(name, scene);\n    scene.engine = this;\n  }\n\n  start(name) {\n    this.activeScene = this.scenes.get(name);\n    this.running = true;\n    this.lastTime = performance.now();\n    requestAnimationFrame(t => this.loop(t));\n  }\n\n  loop(now) {\n    if (!this.running) return;\n    const dt = (now - this.lastTime) / 1000;\n    this.lastTime = now;\n    this.activeScene.update(dt);\n    this.activeScene.render(this.ctx);\n    requestAnimationFrame(t => this.loop(t));\n  }\n}" }
                ]
            },
            {
                title: "VERIFICATION",
                phase: "verify",
                messages: [
                    { agent: "verifier", type: "thinking", duration: 600 },
                    { agent: "verifier", type: "diff", content: "Benchmark results:", diff: ["+ 60 FPS sustained at 500 entities (collision + render)", "+ Memory: 12 MB baseline, no leaks after 10 min run", "+ Input latency: <16ms (single frame)", "+ Audio: 4 simultaneous SFX channels, zero glitching", "+ Scene transitions: <8ms"] },
                    { agent: "verifier", type: "status", content: "Engine benchmark: 60 FPS / 500 entities. Memory: stable.", status: "pass" }
                ]
            },
            {
                title: "DEPLOYMENT",
                phase: "deploy",
                messages: [
                    { agent: "system", type: "thinking", duration: 400 },
                    { agent: "git", type: "command", content: "npm run build:engine" },
                    { agent: "git", type: "text", content: "Build output: dist/engine.min.js (44 KB gzipped: 12 KB)" },
                    { agent: "git", type: "text", content: "Published as @org/canvas-engine v1.0.0" },
                    { agent: "system", type: "status", content: "2D Canvas Engine deployed v1.0.0 (Build artifact: flappy-bird-game.html)", status: "pass" }
                ]
            }
        ]
    }
};
