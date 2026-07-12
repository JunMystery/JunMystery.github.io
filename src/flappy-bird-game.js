const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const warningsEl = document.getElementById('warnings');
const menuOverlay = document.getElementById('menuOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalMetrics = document.getElementById('finalMetrics');
const gameFrame = document.getElementById('gameFrame');
const statusText = document.getElementById('statusText');
const fpsText = document.getElementById('fpsText');
const flapBtn = document.getElementById('flapBtn');

const GRAVITY = 0.22;
const FLAP_STRENGTH = -4.5;
const PIPE_SPEED_BASE = 2.0;
const PIPE_SPAWN_DISTANCE = 180;
const PIPE_GAP = 125;
const PIPE_WIDTH = 55;

let bug = {
    x: 80,
    y: 200,
    radius: 12,
    velocity: 0,
    wingAngle: 0,
    wingDir: 1
};

let pipelines = [];
let semicolons = [];
let particles = [];
let score = 0;
let warningsResolved = 0;
let gameRunning = false;
let speedMultiplier = 1.0;

let lastFrameTime = 0;
let accumulator = 0;
const TICK_RATE = 1000 / 60;

window.addEventListener('keydown', handleKeyDown);

const handleTouchAction = (e) => {
    e.preventDefault();
    if (!gameRunning) {
        triggerCompileEngine();
    } else {
        triggerFlap();
    }
};
flapBtn.addEventListener('pointerdown', handleTouchAction);
flapBtn.addEventListener('touchstart', handleTouchAction, { passive: false });

gameFrame.addEventListener('pointerdown', (e) => {
    // Only trigger if clicking on the overlay or the canvas area, not the overlays' children
    if (e.target === gameFrame || e.target === canvas || e.target.classList.contains('overlay-screen') || e.target.closest('.overlay-screen')) {
        e.preventDefault();
        if (!gameRunning) {
            triggerCompileEngine();
        } else {
            triggerFlap();
        }
    }
});

function handleKeyDown(e) {
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === 'Enter') {
        e.preventDefault();
        if (!gameRunning) {
            triggerCompileEngine();
        } else {
            triggerFlap();
        }
    }
}

function triggerFlap() {
    if (!gameRunning) return;
    bug.velocity = FLAP_STRENGTH;
    createCompilationParticles(bug.x - 5, bug.y, "#58a6ff", 4);
}

function triggerCompileEngine() {
    if (!gameRunning) {
        menuOverlay.style.display = 'none';
        gameOverOverlay.style.display = 'none';
        resetWorkspace();
        gameRunning = true;
        statusText.textContent = "STATUS: PIPELINE_RUNNING";
        statusText.style.color = "var(--text-accent)";
        lastFrameTime = performance.now();
        accumulator = 0;
        requestAnimationFrame(gameLoop);
    }
}

function resetWorkspace() {
    score = 0;
    warningsResolved = 0;
    scoreEl.textContent = score;
    warningsEl.textContent = warningsResolved;
    speedMultiplier = 1.0;

    bug.y = 200;
    bug.velocity = 0;
    bug.wingAngle = 0;

    pipelines = [];
    semicolons = [];
    particles = [];

    spawnPipeline(canvas.width + 100);
    fpsText.textContent = "PIPELINE: STABLE";
    fpsText.style.color = "";
}

function spawnPipeline(startX) {
    const minHeight = 40;
    const maxHeight = canvas.height - PIPE_GAP - minHeight - 30;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    const bottomHeight = canvas.height - PIPE_GAP - topHeight;

    pipelines.push({
        x: startX,
        topHeight: topHeight,
        bottomHeight: bottomHeight,
        passed: false
    });

    if (Math.random() > 0.4) {
        semicolons.push({
            x: startX + PIPE_WIDTH / 2,
            y: topHeight + PIPE_GAP / 2 + (Math.random() - 0.5) * 40,
            collected: false,
            pulse: 0
        });
    }
}

function createCompilationParticles(px, py, colorHex, count = 8) {
    const bits = ["0", "1", ";", "{", "}"];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: px,
            y: py,
            char: bits[Math.floor(Math.random() * bits.length)],
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            alpha: 1.0,
            color: colorHex
        });
    }
}

function gameLoop(timestamp) {
    if (!gameRunning) return;

    requestAnimationFrame(gameLoop);

    let dt = timestamp - lastFrameTime;
    if (dt > 100) dt = 16.67;
    lastFrameTime = timestamp;

    accumulator += dt;

    while (accumulator >= TICK_RATE) {
        updatePhysicsStep();
        accumulator -= TICK_RATE;
    }

    render();
}

function updatePhysicsStep() {
    speedMultiplier = 1.0 + (score * 0.05);
    if (speedMultiplier > 2.0) speedMultiplier = 2.0;

    bug.velocity += GRAVITY;
    bug.y += bug.velocity;

    bug.wingAngle += bug.wingDir * (0.05 + Math.abs(bug.velocity) * 0.02);
    if (bug.wingAngle > 0.4 || bug.wingAngle < -0.4) {
        bug.wingDir = -bug.wingDir;
    }

    if (bug.y - bug.radius < 0 || bug.y + bug.radius > canvas.height - 24) {
        triggerCrashDump("SEG_FAULT: Out of physical process bounds memory boundary.");
        return;
    }

    const moveSpeed = PIPE_SPEED_BASE * speedMultiplier;

    for (let i = pipelines.length - 1; i >= 0; i--) {
        let p = pipelines[i];
        p.x -= moveSpeed;

        if (checkPipeCollision(bug, p)) {
            triggerCrashDump("SYNTAX_ERROR: Conflicting structural scope bounds intercepted.");
            return;
        }

        if (!p.passed && p.x + PIPE_WIDTH < bug.x) {
            p.passed = true;
            score += 1;
            scoreEl.textContent = score;
            createCompilationParticles(bug.x, bug.y, "#7ee787", 6);
        }

        if (p.x + PIPE_WIDTH < -20) {
            pipelines.splice(i, 1);
        }
    }

    for (let i = semicolons.length - 1; i >= 0; i--) {
        let s = semicolons[i];
        s.x -= moveSpeed;
        s.pulse += 0.05;

        if (!s.collected && Math.hypot(bug.x - s.x, bug.y - s.y) < bug.radius + 10) {
            s.collected = true;
            warningsResolved += 1;
            warningsEl.textContent = warningsResolved;
            createCompilationParticles(s.x, s.y, "#ffbd2e", 10);
            semicolons.splice(i, 1);
            continue;
        }

        if (s.x < -20) {
            semicolons.splice(i, 1);
        }
    }

    let spawnNew = false;
    if (pipelines.length === 0) {
        spawnNew = true;
    } else {
        let lastPipe = pipelines[pipelines.length - 1];
        if (canvas.width - lastPipe.x >= PIPE_SPAWN_DISTANCE) {
            spawnNew = true;
        }
    }

    if (spawnNew) {
        spawnPipeline(canvas.width);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    if (speedMultiplier > 1.6) {
        fpsText.textContent = "PIPELINE: OVERCLOCKED";
        fpsText.style.color = "var(--syntax-var)";
    } else if (speedMultiplier > 1.2) {
        fpsText.textContent = "PIPELINE: ENERGIZED";
        fpsText.style.color = "var(--text-accent)";
    }
}

function checkPipeCollision(b, p) {
    if (b.x + b.radius > p.x && b.x - b.radius < p.x + PIPE_WIDTH) {
        if (b.y - b.radius < p.topHeight || b.y + b.radius > canvas.height - p.bottomHeight) {
            return true;
        }
    }
    return false;
}

function triggerCrashDump(reason) {
    gameRunning = false;
    statusText.textContent = "STATUS: SYSTEM_PANIC";
    statusText.style.color = "var(--syntax-keyword)";

    finalMetrics.innerHTML = `<span class="error-text">Fatal Dump:</span> Build failed on trace: <br><span class="comment">${reason}</span>.<br><br><span class="variable">Compiled Commits:</span> <span class="number">${score} Commits</span><br><span class="variable">Warnings Fixed:</span> <span class="number">${warningsResolved}</span>`;
    gameOverOverlay.style.display = 'flex';
}

function render() {
    // Clear canvas with solid background (no moving code text)
    ctx.fillStyle = '#090c10';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw static grid lines (subtle background pattern)
    ctx.strokeStyle = '#161b22';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i); ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Draw pipelines
    pipelines.forEach(p => {
        drawScopeBracketColumn(p);
    });

    // Draw floating semicolons
    semicolons.forEach(s => {
        if (!s.collected) {
            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffbd2e';
            ctx.fillStyle = '#ffbd2e';
            ctx.font = 'bold 22px var(--font-stack)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            let pulseOffset = Math.sin(s.pulse) * 3;
            ctx.fillText(';', s.x, s.y + pulseOffset);
            ctx.restore();
        }
    });

    // Draw flying Code Bug
    drawCodeBug();

    // Draw particles
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.font = '10px var(--font-stack)';
        ctx.fillText(p.char, p.x, p.y);
    });
    ctx.globalAlpha = 1.0;

    // Draw bottom terminal tray
    ctx.fillStyle = '#161b22';
    ctx.fillRect(0, canvas.height - 24, canvas.width, 24);
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 24); ctx.lineTo(canvas.width, canvas.height - 24);
    ctx.stroke();

    ctx.font = '9px var(--font-stack)';
    ctx.fillStyle = '#8b949e';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('> compilation pipeline status: STABLE_OK', 10, canvas.height - 12);
}

function drawScopeBracketColumn(p) {
    ctx.save();

    // Draw pipe bodies with subtle gradient
    const gradient1 = ctx.createLinearGradient(p.x, 0, p.x + PIPE_WIDTH, 0);
    gradient1.addColorStop(0, '#161b22');
    gradient1.addColorStop(0.5, '#1a1f2b');
    gradient1.addColorStop(1, '#161b22');

    // Top pipe
    ctx.fillStyle = gradient1;
    ctx.fillRect(p.x, 0, PIPE_WIDTH, p.topHeight);
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(p.x, 0, PIPE_WIDTH, p.topHeight);

    // Bottom pipe
    let bottomY = canvas.height - p.bottomHeight;
    ctx.fillStyle = gradient1;
    ctx.fillRect(p.x, bottomY, PIPE_WIDTH, p.bottomHeight);
    ctx.strokeStyle = '#30363d';
    ctx.strokeRect(p.x, bottomY, PIPE_WIDTH, p.bottomHeight);

    // Draw scope brackets
    ctx.fillStyle = '#ff7b72';
    ctx.font = 'bold 18px var(--font-stack)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('{', p.x + PIPE_WIDTH / 2, p.topHeight - 14);
    ctx.fillText('}', p.x + PIPE_WIDTH / 2, bottomY + 14);

    // Draw subtle code pattern lines inside pipes
    ctx.strokeStyle = 'rgba(139, 148, 158, 0.15)';
    ctx.lineWidth = 1;
    for (let y = 8; y < p.topHeight - 10; y += 12) {
        ctx.beginPath();
        ctx.moveTo(p.x + 8, y);
        ctx.lineTo(p.x + PIPE_WIDTH - 8, y);
        ctx.stroke();
    }
    for (let y = bottomY + 10; y < canvas.height - 24; y += 12) {
        ctx.beginPath();
        ctx.moveTo(p.x + 8, y);
        ctx.lineTo(p.x + PIPE_WIDTH - 8, y);
        ctx.stroke();
    }

    ctx.restore();
}

function drawCodeBug() {
    ctx.save();
    ctx.translate(bug.x, bug.y);

    let pitchAngle = bug.velocity * 0.08;
    if (pitchAngle > 0.4) pitchAngle = 0.4;
    if (pitchAngle < -0.4) pitchAngle = -0.4;
    ctx.rotate(pitchAngle);

    // Draw wings
    ctx.fillStyle = '#ffa657';
    ctx.font = 'bold 20px var(--font-stack)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.save();
    ctx.translate(-5, -6);
    ctx.rotate(-Math.PI / 4 + bug.wingAngle);
    ctx.fillText('{', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(-5, 6);
    ctx.rotate(Math.PI / 4 - bug.wingAngle);
    ctx.fillText('}', 0, 0);
    ctx.restore();

    // Draw body
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffa657';
    ctx.fillStyle = '#ffa657';
    ctx.beginPath();
    ctx.arc(0, 0, bug.radius - 1, 0, Math.PI * 2);
    ctx.fill();

    // Draw eyes
    ctx.fillStyle = '#0d1117';
    ctx.beginPath();
    ctx.arc(2, -3, 2, 0, Math.PI * 2);
    ctx.arc(2, 3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw antenna
    ctx.strokeStyle = '#ffa657';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(4, -3); ctx.quadraticCurveTo(8, -5, 10, -3);
    ctx.moveTo(4, 3); ctx.quadraticCurveTo(8, 5, 10, 3);
    ctx.stroke();

    ctx.restore();
}

window.onload = function () {
    render();
}
