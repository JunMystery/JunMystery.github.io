const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const warningsEl = document.getElementById('warnings');
const menuOverlay = document.getElementById('menuOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalMetrics = document.getElementById('finalMetrics');
const gameFrame = document.getElementById('gameFrame');
const statusText = document.getElementById('statusText');
const statusRight = document.getElementById('statusRight');
const jumpBtn = document.getElementById('jumpBtn');

// --- Theme colors ---
const COLORS = {
    bg: '#090c10',
    grid: '#161b22',
    ground: 'rgba(88,166,255,0.25)',
    player: '#7ee787',
    obstacle: '#ff7b72',
    score: '#8b949e',
    tray: '#161b22',
    trayBorder: '#30363d',
    terminal: '#8b949e',
};

// --- Constants ---
const GROUND_Y = 160;
const PLAYER_X = 60;
const PLAYER_W = 18;
const PLAYER_H = 18;
const GRAVITY = 0.55;
const JUMP_VEL = -9.3;
const BASE_SPEED = 2.5;
const MAX_SPEED = 5.5;
const ERROR_CODES = ['403', '404', '500', '502', '503'];

// --- State ---
let player = { y: GROUND_Y - PLAYER_H, vy: 0, grounded: true };
let obstacles = [];
let particles = [];
let score = 0;
let failsResolved = 0;
let speed = BASE_SPEED;
let frame = 0;
let spawnCounter = 0;
let groundOffset = 0;
let gameRunning = false;

let lastFrameTime = 0;
let accumulator = 0;
const TICK_RATE = 1000 / 60;

// --- Input ---
document.addEventListener('keydown', function(e) {
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (!gameRunning) { startGame(); } else { jump(); }
    }
    if ((e.key === 'r' || e.key === 'R') && !gameRunning) {
        startGame();
    }
});

const handleAction = function(e) {
    e.preventDefault();
    if (!gameRunning) { startGame(); } else { jump(); }
};
document.querySelectorAll('.action-btn, .dpad-btn').forEach(btn => {
    btn.addEventListener('pointerdown', handleAction);
});
jumpBtn.addEventListener('touchstart', handleAction, { passive: false });

gameFrame.addEventListener('pointerdown', function(e) {
    if (e.target === gameFrame || e.target === canvas ||
        e.target.classList.contains('overlay-screen') || e.target.closest('.overlay-screen')) {
        e.preventDefault();
        if (!gameRunning) { startGame(); } else { jump(); }
    }
});

// --- Game functions ---
function jump() {
    if (!gameRunning) return;
    if (player.grounded) {
        player.vy = JUMP_VEL;
        player.grounded = false;
        spawnParticles(PLAYER_X, GROUND_Y, '#7ee787', 5);
    }
}

function startGame() {
    menuOverlay.style.display = 'none';
    gameOverOverlay.style.display = 'none';
    resetGame();
    gameRunning = true;
    statusText.textContent = 'STATUS: COMPILING';
    statusText.style.color = '#58a6ff';
    statusRight.textContent = 'RUNNER: ACTIVE';
    lastFrameTime = performance.now();
    accumulator = 0;
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    score = 0;
    failsResolved = 0;
    speed = BASE_SPEED;
    frame = 0;
    spawnCounter = 0;
    groundOffset = 0;
    player.y = GROUND_Y - PLAYER_H;
    player.vy = 0;
    player.grounded = true;
    obstacles = [];
    particles = [];
    scoreEl.textContent = '0';
    warningsEl.textContent = '0';
}

// --- Particles ---
function spawnParticles(px, py, color, count) {
    var chars = [';', '{', '}', '0', '1'];
    for (var i = 0; i < count; i++) {
        particles.push({
            x: px,
            y: py,
            char: chars[Math.floor(Math.random() * chars.length)],
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 4 - 1,
            alpha: 1,
            color: color,
        });
    }
}

// --- Physics ---
function updatePhysics() {
    frame++;
    speed = Math.min(BASE_SPEED + frame * 0.005, MAX_SPEED);
    var spawnInterval = Math.max(40, 100 - Math.floor(frame / 40));

    // Player
    player.vy += GRAVITY;
    player.y += player.vy;
    if (player.y >= GROUND_Y - PLAYER_H) {
        player.y = GROUND_Y - PLAYER_H;
        player.vy = 0;
        player.grounded = true;
    }

    // Spawn obstacles
    spawnCounter++;
    if (spawnCounter >= spawnInterval) {
        spawnCounter = 0;
        var code = ERROR_CODES[Math.floor(Math.random() * ERROR_CODES.length)];
        obstacles.push({
            x: canvas.width,
            code: code,
            w: 44,
            h: 24,
        });
    }

    // Move obstacles
    for (var i = obstacles.length - 1; i >= 0; i--) {
        var o = obstacles[i];
        o.x -= speed;
        if (o.x + o.w < -20) {
            obstacles.splice(i, 1);
        }
    }

    // Collision
    var px = PLAYER_X, py = player.y, pw = PLAYER_W, ph = PLAYER_H;
    for (var i = 0; i < obstacles.length; i++) {
        var o = obstacles[i];
        // Obstacle sits on ground, height ~24px
        if (px < o.x + o.w && px + pw > o.x && py < GROUND_Y && py + ph > GROUND_Y - o.h) {
            gameOver('SYNTAX_ERROR: Unhandled status code ' + o.code + ' at ' + Math.floor(o.x) + 'px');
            return;
        }
    }

    // Score
    score = Math.floor(frame / 3);
    scoreEl.textContent = score;
    groundOffset = (groundOffset + speed) % 20;

    // Particles
    for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.alpha -= 0.025;
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }
}

function gameOver(reason) {
    gameRunning = false;
    statusText.textContent = 'STATUS: CRASH';
    statusText.style.color = '#ff7b72';
    statusRight.textContent = 'RUNNER: HALTED';

    finalMetrics.innerHTML = '<span style="color:#ff7b72;">Fatal Dump:</span> ' + reason +
        '<br><br><span style="color:#ffa657;">Lines Compiled:</span> <span style="color:#d2a8ff;">' + score + '</span>' +
        '<br><span style="color:#ffa657;">Warnings Resolved:</span> <span style="color:#d2a8ff;">' + failsResolved + '</span>';
    gameOverOverlay.style.display = 'flex';
}

// --- Render ---
function render() {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (var x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (var y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Ground line
    ctx.strokeStyle = COLORS.ground;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.lineDashOffset = -groundOffset;
    ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(canvas.width, GROUND_Y); ctx.stroke();
    ctx.setLineDash([]);

    // Obstacles
    ctx.font = 'bold 18px "Fira Code", "Consolas", "Courier New", monospace';
    ctx.textAlign = 'center';
    for (var i = 0; i < obstacles.length; i++) {
        var o = obstacles[i];
        // Draw bracket body
        ctx.fillStyle = 'rgba(255,123,114,0.08)';
        ctx.fillRect(o.x, GROUND_Y - o.h, o.w, o.h);
        ctx.strokeStyle = 'rgba(255,123,114,0.35)';
        ctx.lineWidth = 1;
        ctx.strokeRect(o.x, GROUND_Y - o.h, o.w, o.h);

        // Draw error code
        ctx.fillStyle = COLORS.obstacle;
        ctx.fillText(o.code, o.x + o.w / 2, GROUND_Y - 6);
    }
    ctx.textAlign = 'left';

    // Player (underscore cursor)
    ctx.fillStyle = COLORS.player;
    ctx.font = 'bold 22px "Fira Code", "Consolas", "Courier New", monospace';
    ctx.fillText('_', PLAYER_X, player.y + 16);

    // Particles
    ctx.textAlign = 'center';
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.font = '10px "Fira Code", "Consolas", "Courier New", monospace';
        ctx.fillText(p.char, p.x, p.y);
    }
    ctx.globalAlpha = 1.0;
    ctx.textAlign = 'left';

    // Bottom tray
    ctx.fillStyle = COLORS.tray;
    ctx.fillRect(0, canvas.height - 24, canvas.width, 24);
    ctx.strokeStyle = COLORS.trayBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 24);
    ctx.lineTo(canvas.width, canvas.height - 24);
    ctx.stroke();

    ctx.font = '9px "Fira Code", "Consolas", "Courier New", monospace';
    ctx.fillStyle = COLORS.terminal;
    ctx.fillText('> curl -I ' + window.location.pathname + ' 2>&1', 10, canvas.height - 10);
}

// --- Game loop ---
function gameLoop(timestamp) {
    if (!gameRunning) return;
    requestAnimationFrame(gameLoop);

    var dt = timestamp - lastFrameTime;
    if (dt > 100) dt = 16.67;
    lastFrameTime = timestamp;
    accumulator += dt;

    while (accumulator >= TICK_RATE) {
        updatePhysics();
        if (!gameRunning) {
            render();
            return;
        }
        accumulator -= TICK_RATE;
    }
    render();
}

window.onload = function() {
    render();
};
