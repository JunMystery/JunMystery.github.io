// ============================================================
// controllers/pipeline-data-vi.js — VI preset data
// ============================================================

PIPELINE_PRESETS.vi = {
    "ad-deploy": {
        name: "Tri\u1ec3n khai M\u00e1y ch\u1ee7 \u1ea2o Active Directory & C\u1ea5u h\u00ecnh DNS",
        gameOutput: "snake",
        steps: [
            {
                title: "GIAI \u0110O\u1ea0N L\u1eacP K\u1ebe HO\u1ea0CH",
                phase: "plan",
                messages: [
                    { agent: "user", type: "text", content: "C\u1ea7n thi\u1ebft l\u1eadp AD DS + DNS tr\u00ean Windows Server 2022 trong ph\u00f2ng lab tr\u01b0\u1edbc khi tri\u1ec3n khai s\u1ea3n xu\u1ea5t." },
                    { agent: "system", type: "thinking", duration: 1200 },
                    { agent: "planner", type: "text", content: "Ph\u00e2n t\u00edch tri\u1ec3n khai AD theo c\u00e1c giai \u0111o\u1ea1n:\n1. Ki\u1ec3m tra ph\u1ea7n c\u1ee9ng (8 vCPU / 32 GB RAM / 200 GB SSD)\n2. C\u00e0i \u0111\u1eb7t vai tr\u00f2 AD Domain Services + DNS Server\n3. C\u1ea5u h\u00ecnh forest m\u1edbi (domain: lab.corp.example.com)\n4. T\u1ea1o OU: CorpUsers, CorpComputers, ServiceAccounts\n5. Thi\u1ebft l\u1eadp v\u00f9ng tra c\u1ee9u ng\u01b0\u1ee3c + c\u1eadp nh\u1eadt DNS \u0111\u1ed9ng\n6. Th\u0103m d\u00f2 DC ph\u1ee5 \u0111\u1ec3 ch\u1ecbu l\u1ed7i" },
                    { agent: "system", type: "divider", content: "K\u1ebf ho\u1ea1ch \u0111\u00e3 ho\u00e0n t\u1ea5t" }
                ]
            },
            {
                title: "TH\u1ef0C THI PH\u00c1T TRI\u1ec2N",
                phase: "code",
                messages: [
                    { agent: "coder", type: "thinking", duration: 800 },
                    { agent: "coder", type: "code", language: "powershell", code: "# C\u00e0i \u0111\u1eb7t vai tr\u00f2 AD DS + DNS\nInstall-WindowsFeature -Name AD-Domain-Services,DNS -IncludeManagementTools\n\n# Th\u0103ng c\u1ea5p th\u00e0nh Domain Controller (forest m\u1edbi)\nInstall-ADDSForest -DomainName \"lab.corp.example.com\" `\n  -SafeModeAdministratorPassword (ConvertTo-SecureString \"P@ssw0rd!\" -AsPlainText -Force) `\n  -Force:$true -Confirm:$false\n\n# T\u1ea1o OU\nNew-ADOrganizationalUnit -Name \"CorpUsers\" -Path \"DC=lab,DC=corp,DC=example,DC=com\"\nNew-ADOrganizationalUnit -Name \"CorpComputers\" -Path \"DC=lab,DC=corp,DC=example,DC=com\"\nNew-ADOrganizationalUnit -Name \"ServiceAccounts\" -Path \"DC=lab,DC=corp,DC=example,DC=com\"" }
                ]
            },
            {
                title: "X\u00c1C MINH",
                phase: "verify",
                messages: [
                    { agent: "verifier", type: "thinking", duration: 600 },
                    { agent: "verifier", type: "diff", content: "X\u00e1c th\u1ef1c c\u1ea5u h\u00ecnh:", diff: ["+ DNS zone 'lab.corp.example.com' \u0111\u00e3 t\u1ea1o", "+ Reverse lookup zone '10.0.0.x' \u0111\u00e3 c\u1ea5u h\u00ecnh", "+ SRV records \u0111\u00e3 \u0111\u0103ng k\u00fd (_ldap._tcp.dc._msdcs)", "+ 3 OU \u0111\u00e3 c\u1ea5u tr\u00fac d\u01b0\u1edbi g\u1ed1c mi\u1ec1n"] },
                    { agent: "verifier", type: "status", content: "Ki\u1ec3m tra AD: OK. DNS: OK. Nh\u00e2n b\u1ea3n: OK.", status: "pass" }
                ]
            },
            {
                title: "TRI\u1ec2N KHAI",
                phase: "deploy",
                messages: [
                    { agent: "system", type: "thinking", duration: 400 },
                    { agent: "git", type: "command", content: "terraform apply -auto-approve" },
                    { agent: "git", type: "text", content: "K\u1ebft qu\u1ea3: \u00c1p d\u1ee5ng th\u00e0nh c\u00f4ng! 6 t\u00e0i nguy\u00ean \u0111\u00e3 th\u00eam, 0 thay \u0111\u1ed5i, 0 x\u00f3a." },
                    { agent: "git", type: "text", content: "Th\u0103ng c\u1ea5p DC ph\u1ee5 \u0111\u00e3 x\u1ebfp h\u00e0ng ch\u1edd ngo\u00e0i gi\u1edd." },
                    { agent: "system", type: "status", content: "AD DS + DNS \u0111\u00e3 tri\u1ec3n khai lab.corp.example.com (Build artifact: snake-game.html)", status: "pass" }
                ]
            }
        ]
    },
    "mcp-feature": {
        name: "Tri\u1ec3n khai T\u00ecm ki\u1ebfm H\u01b0\u1edbng d\u1eabn MCP",
        gameOutput: "tetris",
        steps: [
            {
                title: "GIAI \u0110O\u1ea0N L\u1eacP K\u1ebe HO\u1ea0CH",
                phase: "plan",
                messages: [
                    { agent: "user", type: "text", content: "Ch\u00fang ta c\u1ea7n m\u1ed9t t\u00ecm ki\u1ebfm h\u01b0\u1edbng d\u1eabn d\u1ef1a tr\u00ean MCP cho ph\u00e9p ng\u01b0\u1eddi d\u00f9ng truy v\u1ea5n k\u1ef9 n\u0103ng b\u1eb1ng ng\u00f4n ng\u1eef t\u1ef1 nhi\u00ean." },
                    { agent: "system", type: "thinking", duration: 1200 },
                    { agent: "planner", type: "text", content: "Ph\u00e2n t\u00edch ki\u1ebfn tr\u00fac:\n1. X\u00e1c \u0111\u1ecbnh schema si\u00eau d\u1eef li\u1ec7u k\u1ef9 n\u0103ng (t\u00ean, m\u00f4 t\u1ea3, th\u1ebb, danh m\u1ee5c)\n2. Tri\u1ec3n khai t\u00ecm ki\u1ebfm t\u01b0\u01a1ng t\u1ef1 vector b\u1eb1ng embeddings (sentence-transformers)\n3. X\u00e2y d\u1ef1ng wrapper c\u00f4ng c\u1ee5 MCP: guidance_search(truy_v\u1ea5n, gi\u1edbi_h\u1ea1n, danh_m\u1ee5c?)\n4. T\u00edch h\u1ee3p v\u00e0o \u0111\u01b0\u1eddng \u1ed1ng prompt hi\u1ec7n t\u1ea1i nh\u01b0 m\u1ed9t b\u01b0\u1edbc tra c\u1ee9u k\u1ef9 n\u0103ng\n5. Th\u00eam l\u1edbp b\u1ed9 nh\u1edb \u0111\u1ec7m (LRU, TTL 5 ph\u00fat) cho c\u00e1c truy v\u1ea5n th\u01b0\u1eddng xuy\u00ean" },
                    { agent: "system", type: "divider", content: "K\u1ebf ho\u1ea1ch \u0111\u00e3 ho\u00e0n t\u1ea5t" }
                ]
            },
            {
                title: "TH\u1ef0C THI PH\u00c1T TRI\u1ec2N",
                phase: "code",
                messages: [
                    { agent: "coder", type: "thinking", duration: 800 },
                    { agent: "coder", type: "code", language: "typescript", code: "// guidance-search.ts \u2014 Tra c\u1ee9u k\u1ef9 n\u0103ng h\u1ed7 tr\u1ee3 MCP\ninterface SkillDoc {\n  id: string;\n  name: string;\n  description: string;\n  tags: string[];\n  category: string;\n  embedding?: number[];\n}\n\nconst cache = new LRUCache<string, SkillDoc[]>({ max: 100, ttl: 300_000 });\n\nasync function guidanceSearch(\n  query: string,\n  limit = 5,\n  category?: string\n): Promise<SkillDoc[]> {\n  const cacheKey = `${query}:${limit}:${category ?? '*'}`;\n  const cached = cache.get(cacheKey);\n  if (cached) return cached;\n\n  const embedding = await embed(query);\n  const results = await vectorDB.search(embedding, { limit, filter: category ? { category } : undefined });\n  cache.set(cacheKey, results);\n  return results;\n}" }
                ]
            },
            {
                title: "X\u00c1C MINH",
                phase: "verify",
                messages: [
                    { agent: "verifier", type: "thinking", duration: 600 },
                    { agent: "verifier", type: "diff", content: "K\u1ebft qu\u1ea3 ki\u1ec3m tra:", diff: ["+ guidance_search('authentication') tr\u1ea3 v\u1ec1 5 k\u1ebft qu\u1ea3 trong 42ms", "+ B\u1ed9 l\u1ecdc danh m\u1ee5c 'security' thu h\u1eb9p xu\u1ed1ng 3 k\u1ebft qu\u1ea3", "+ Cache hit gi\u1ea3m \u0111\u1ed9 tr\u1ec5 xu\u1ed1ng 2ms", "+ 0 d\u01b0\u01a1ng t\u00ednh gi\u1ea3 trong 20 m\u1eabu \u0111\u00e1nh gi\u00e1"] },
                    { agent: "verifier", type: "status", content: "\u0110\u1ed9 ch\u00ednh x\u00e1c: 0.95. \u0110\u1ed9 thu h\u1ed3i: 0.92. \u0110\u1ed9 tr\u1ec5 p95: 68ms.", status: "pass" }
                ]
            },
            {
                title: "TRI\u1ec2N KHAI",
                phase: "deploy",
                messages: [
                    { agent: "system", type: "thinking", duration: 400 },
                    { agent: "git", type: "command", content: "npm run build && npm publish" },
                    { agent: "git", type: "text", content: "\u0110\u00e3 xu\u1ea5t b\u1ea3n @org/guidance-search v1.0.0 l\u00ean kho n\u1ed9i b\u1ed9." },
                    { agent: "git", type: "text", content: "PR t\u00edch h\u1ee3p \u0111\u00e3 \u0111\u01b0\u1ee3c merge v\u00e0o \u0111\u01b0\u1eddng \u1ed1ng ch\u00ednh." },
                    { agent: "system", type: "status", content: "MCP Guidance Search \u0111\u00e3 tri\u1ec3n khai v1.0.0 (Build artifact: tetris-game.html)", status: "pass" }
                ]
            }
        ]
    },
    "portfolio-deploy": {
        name: "Tri\u1ec3n khai Portfolio l\u00ean Cloudflare",
        gameOutput: "pacman",
        steps: [
            {
                title: "GIAI \u0110O\u1ea0N L\u1eacP K\u1ebe HO\u1ea0CH",
                phase: "plan",
                messages: [
                    { agent: "user", type: "text", content: "C\u1ea7n tri\u1ec3n khai trang portfolio t\u0129nh l\u00ean Cloudflare Pages v\u1edbi t\u00ean mi\u1ec1n t\u00f9y ch\u1ec9nh." },
                    { agent: "system", type: "thinking", duration: 1200 },
                    { agent: "planner", type: "text", content: "K\u1ebf ho\u1ea1ch tri\u1ec3n khai:\n1. X\u00e2y d\u1ef1ng site t\u0129nh (Jekyll/Hugo/vanilla \u2014 x\u00e1c nh\u1eadn stack)\n2. C\u1ea5u h\u00ecnh cloudflare.toml cho c\u00e0i \u0111\u1eb7t build\n3. Thi\u1ebft l\u1eadp d\u1ef1 \u00e1n Cloudflare Pages qua Wrangler CLI\n4. C\u1ea5u h\u00ecnh t\u00ean mi\u1ec1n t\u00f9y ch\u1ec9nh (junmystery.dev) + SSL\n5. B\u1eadt c\u01a1 s\u1edf d\u1eef li\u1ec7u D1 cho bi\u1ec3u m\u1eabu li\u00ean h\u1ec7\n6. Thi\u1ebft l\u1eadp tri\u1ec3n khai xem tr\u01b0\u1edbc theo nh\u00e1nh" },
                    { agent: "system", type: "divider", content: "K\u1ebf ho\u1ea1ch \u0111\u00e3 ho\u00e0n t\u1ea5t" }
                ]
            },
            {
                title: "TH\u1ef0C THI PH\u00c1T TRI\u1ec2N",
                phase: "code",
                messages: [
                    { agent: "coder", type: "thinking", duration: 800 },
                    { agent: "coder", type: "code", language: "toml", code: "# cloudflare.toml\nname = \"junmystery-portfolio\"\ncompatibility_date = \"2025-01-01\"\n\n[build]\ncommand = \"bash src/bundle/build.sh\"\npublish = \"./\"\n\n[env.production]\nroutes = [{ pattern = \"junmystery.dev\", zone = \"<zone_id>\" }]\n\n[env.preview]\nroutes = [{ pattern = \"preview.junmystery.dev\" }]\n\n[[d1_databases]]\nbinding = \"CONTACT_DB\"\ndatabase_name = \"portfolio-contact\"\ndatabase_id = \"<db_id>\"" }
                ]
            },
            {
                title: "X\u00c1C MINH",
                phase: "verify",
                messages: [
                    { agent: "verifier", type: "thinking", duration: 600 },
                    { agent: "verifier", type: "diff", content: "X\u00e1c th\u1ef1c tri\u1ec3n khai:", diff: ["+ \u0110\u1ea7u ra build: 47 t\u1ec7p, t\u1ed5ng 2.3 MB", "+ T\u1ea5t c\u1ea3 li\u00ean k\u1ebft n\u1ed9i b\u1ed9 ho\u1ea1t \u0111\u1ed9ng (0 li\u00ean k\u1ebft ch\u1ebft)", "+ \u0110i\u1ec3m Lighthouse: 98 Hi\u1ec7u su\u1ea5t / 100 Kh\u1ea3 n\u0103ng ti\u1ebfp c\u1eadn", "+ SSL t\u00ean mi\u1ec1n t\u00f9y ch\u1ec9nh: Ho\u1ea1t \u0111\u1ed9ng (TLS 1.3)", "+ D1 database: \u0110\u00e3 k\u1ebft n\u1ed1i"] },
                    { agent: "verifier", type: "status", content: "Tri\u1ec3n khai xem tr\u01b0\u1edbc: OK. S\u1eb5n s\u00e0ng s\u1ea3n xu\u1ea5t.", status: "pass" }
                ]
            },
            {
                title: "TRI\u1ec2N KHAI",
                phase: "deploy",
                messages: [
                    { agent: "system", type: "thinking", duration: 400 },
                    { agent: "git", type: "command", content: "wrangler pages deploy --branch=main" },
                    { agent: "git", type: "text", content: "\u2728 Tri\u1ec3n khai ho\u00e0n t\u1ea5t! https://junmystery.dev" },
                    { agent: "git", type: "text", content: "\u0110\u00e3 x\u00f3a b\u1ed9 nh\u1edb \u0111\u1ec7m. Ph\u00e2n ph\u1ed1i CDN: 12s." },
                    { agent: "system", type: "status", content: "Portfolio \u0111\u00e3 tri\u1ec3n khai l\u00ean Cloudflare Pages (Build artifact: pacman-game.html)", status: "pass" }
                ]
            }
        ]
    },
    "game-engine": {
        name: "X\u00e2y d\u1ef1ng C\u00f4ng c\u1ee5 Game Canvas 2D",
        gameOutput: "flappy",
        steps: [
            {
                title: "GIAI \u0110O\u1ea0N L\u1eacP K\u1ebe HO\u1ea0CH",
                phase: "plan",
                messages: [
                    { agent: "user", type: "text", content: "Thi\u1ebft k\u1ebf m\u1ed9t c\u00f4ng c\u1ee5 canvas 2D nh\u1eb9 cho c\u00e1c game tr\u00ecnh duy\u1ec7t \u0111\u01a1n gi\u1ea3n (snake, tetris, pacman, flappy)." },
                    { agent: "system", type: "thinking", duration: 1200 },
                    { agent: "planner", type: "text", content: "Ki\u1ebfn tr\u00fac c\u00f4ng c\u1ee5:\n1. Tr\u00ecnh k\u1ebft xu\u1ea5t Canvas2D v\u1edbi t\u1ef1 \u0111\u1ed9ng chia t\u1ef7 l\u1ec7 v\u00e0 h\u1ed7 tr\u1ee3 HiDPI\n2. H\u1ec7 th\u1ed1ng th\u00e0nh ph\u1ea7n th\u1ef1c th\u1ec3 (ECS): V\u1ecb tr\u00ed, V\u1eadn t\u1ed1c, Sprite, Va ch\u1ea1m, S\u1ee9c kh\u1ecfe\n3. Tr\u00ecnh qu\u1ea3n l\u00fd \u0111\u1ea7u v\u00e0o (b\u00e0n ph\u00edm + c\u1ea3m \u1ee9ng) v\u1edbi \u00e1nh x\u1ea1 h\u00e0nh \u0111\u1ed9ng\n4. H\u1ec7 th\u1ed1ng con v\u1eadt l\u00fd: Va ch\u1ea1m AABB, tr\u1ecdng l\u1ef1c, gi\u1ea3m ch\u1ea5n n\u1ea3y\n5. Tr\u00ecnh qu\u1ea3n l\u00fd \u00e2m thanh cho Web Audio API (SFX + nh\u1ea1c n\u1ec1n)\n6. \u0110\u1ed3 th\u1ecb c\u1ea3nh v\u1edbi bi\u1ebfn \u0111\u1ed5i camera, l\u1edbp v\u00e0 parallax" },
                    { agent: "system", type: "divider", content: "K\u1ebf ho\u1ea1ch \u0111\u00e3 ho\u00e0n t\u1ea5t" }
                ]
            },
            {
                title: "TH\u1ef0C THI PH\u00c1T TRI\u1ec2N",
                phase: "code",
                messages: [
                    { agent: "coder", type: "thinking", duration: 800 },
                    { agent: "coder", type: "code", language: "javascript", code: "// engine.js \u2014 L\u00f5i c\u00f4ng c\u1ee5 game canvas 2D\nclass Engine {\n  constructor(canvasId) {\n    this.canvas = document.getElementById(canvasId);\n    this.ctx = this.canvas.getContext('2d');\n    this.scenes = new Map();\n    this.activeScene = null;\n    this.lastTime = 0;\n    this.running = false;\n  }\n\n  addScene(name, scene) {\n    this.scenes.set(name, scene);\n    scene.engine = this;\n  }\n\n  start(name) {\n    this.activeScene = this.scenes.get(name);\n    this.running = true;\n    this.lastTime = performance.now();\n    requestAnimationFrame(t => this.loop(t));\n  }\n\n  loop(now) {\n    if (!this.running) return;\n    const dt = (now - this.lastTime) / 1000;\n    this.lastTime = now;\n    this.activeScene.update(dt);\n    this.activeScene.render(this.ctx);\n    requestAnimationFrame(t => this.loop(t));\n  }\n}" }
                ]
            },
            {
                title: "X\u00c1C MINH",
                phase: "verify",
                messages: [
                    { agent: "verifier", type: "thinking", duration: 600 },
                    { agent: "verifier", type: "diff", content: "K\u1ebft qu\u1ea3 \u0111o \u0111\u1ea1c:", diff: ["+ Duy tr\u00ec 60 FPS \u1edf 500 th\u1ef1c th\u1ec3 (va ch\u1ea1m + k\u1ebft xu\u1ea5t)", "+ B\u1ed9 nh\u1edb: 12 MB c\u01a1 s\u1edf, kh\u00f4ng r\u00f2 r\u1ec9 sau 10 ph\u00fat ch\u1ea1y", "+ \u0110\u1ed9 tr\u1ec5 \u0111\u1ea7u v\u00e0o: <16ms (m\u1ed9t khung h\u00ecnh)", "+ \u00c2m thanh: 4 k\u00eanh SFX \u0111\u1ed3ng th\u1eddi, kh\u00f4ng gi\u1eadt", "+ Chuy\u1ec3n c\u1ea3nh: <8ms"] },
                    { agent: "verifier", type: "status", content: "\u0110o \u0111\u1ea1c c\u00f4ng c\u1ee5: 60 FPS / 500 th\u1ef1c th\u1ec3. B\u1ed9 nh\u1edb: \u1ed5n \u0111\u1ecbnh.", status: "pass" }
                ]
            },
            {
                title: "TRI\u1ec2N KHAI",
                phase: "deploy",
                messages: [
                    { agent: "system", type: "thinking", duration: 400 },
                    { agent: "git", type: "command", content: "npm run build:engine" },
                    { agent: "git", type: "text", content: "\u0110\u1ea7u ra build: dist/engine.min.js (44 KB n\u00e9n: 12 KB)" },
                    { agent: "git", type: "text", content: "\u0110\u00e3 xu\u1ea5t b\u1ea3n @org/canvas-engine v1.0.0" },
                    { agent: "system", type: "status", content: "C\u00f4ng c\u1ee5 Canvas 2D \u0111\u00e3 tri\u1ec3n khai v1.0.0 (Build artifact: flappy-bird-game.html)", status: "pass" }
                ]
            }
        ]
    }
};
