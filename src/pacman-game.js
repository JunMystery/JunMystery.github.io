const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const bugsEatenEl = document.getElementById('bugsEaten');
const menuOverlay = document.getElementById('menuOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalMetrics = document.getElementById('finalMetrics');
const gameFrame = document.getElementById('gameFrame');
const statusText = document.getElementById('statusText');
const cooldownText = document.getElementById('cooldownText');

// Layout Physics Grid: 28x28
const COLS = 28;
const ROWS = 28;
const CELL_SIZE = 14;

// Maze: 1 = wall, 0 = pellet, 2 = ghost spawn, 3 = power pellet, 4 = empty
const MAZE = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 2, 2, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let board = MAZE.map(row => [...row]);
let score = 0;
let bugsEaten = 0;
let gameRunning = false;

// Pacman entity
let pacman = {
    gridX: 13, gridY: 17,
    x: 13 * CELL_SIZE, y: 17 * CELL_SIZE,
    dirX: -1, dirY: 0,
    nextDirX: -1, nextDirY: 0,
    speed: 1.0, baseSpeed: 1.0,
    mouthAngle: 0.2, mouthSpeed: 0.04
};

// Ghosts: syntax_err (Blinky), type_err (Pinky), link_err (Inky), runtime_err (Clyde)
let ghosts = [
    { name: "syntax_err", color: "#ff7b72", x: 13 * CELL_SIZE, y: 11 * CELL_SIZE, gridX: 13, gridY: 11, speed: 1.05, dirX: -1, dirY: 0, state: "CHASE", modeTime: 0, houseTimer: 0 },
    { name: "type_err", color: "#ff7dd2", x: 12 * CELL_SIZE, y: 13 * CELL_SIZE, gridX: 12, gridY: 13, speed: 1.0, dirX: -1, dirY: 0, state: "HOUSE", modeTime: 0, houseTimer: 150 },
    { name: "link_err", color: "#58a6ff", x: 14 * CELL_SIZE, y: 13 * CELL_SIZE, gridX: 14, gridY: 13, speed: 0.95, dirX: 1, dirY: 0, state: "HOUSE", modeTime: 0, houseTimer: 300 },
    { name: "runtime_err", color: "#ffa657", x: 13 * CELL_SIZE, y: 12 * CELL_SIZE, gridX: 13, gridY: 12, speed: 0.9, dirX: 0, dirY: -1, state: "HOUSE", modeTime: 0, houseTimer: 450 }
];

let globalMode = "CHASE";           // "CHASE" or "SCATTER"
let globalModeTimer = 500;          // ticks until mode switch
let ghostsEatenThisPower = 0;
let particles = [];

let overclockActive = false;
let overclockTimer = 0;
let overclockCooldown = 0;

// Timing
let lastFrameTime = 0;
let accumulator = 0;
const TICK_RATE = 1000 / 62.5;

// ----- Input Handling -----
window.addEventListener('keydown', handleKeyDown);
document.querySelectorAll('.dpad-btn').forEach(btn => {
    const dir = btn.getAttribute('data-dir');
    const action = btn.getAttribute('data-action');
    btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (dir) processDirectionalInput(dir);
        if (action === 'overclock') triggerOverclock();
    });
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (dir) processDirectionalInput(dir);
        if (action === 'overclock') triggerOverclock();
    }, { passive: false });
});
gameFrame.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (!gameRunning) triggerCompileEngine();
});

function handleKeyDown(e) {
    if (!gameRunning) {
        if (e.key === ' ' || e.key === 'Enter') triggerCompileEngine();
        return;
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': processDirectionalInput('up'); break;
        case 'ArrowDown': case 's': case 'S': processDirectionalInput('down'); break;
        case 'ArrowLeft': case 'a': case 'A': processDirectionalInput('left'); break;
        case 'ArrowRight': case 'd': case 'D': processDirectionalInput('right'); break;
        case ' ': triggerOverclock(); break;
    }
}

function processDirectionalInput(dir) {
    if (!gameRunning) return;
    switch (dir) {
        case 'up': pacman.nextDirX = 0; pacman.nextDirY = -1; break;
        case 'down': pacman.nextDirX = 0; pacman.nextDirY = 1; break;
        case 'left': pacman.nextDirX = -1; pacman.nextDirY = 0; break;
        case 'right': pacman.nextDirX = 1; pacman.nextDirY = 0; break;
    }
}

// ----- Game Flow -----
function triggerOverclock() {
    if (!gameRunning || overclockActive || overclockCooldown > 0) return;
    overclockActive = true;
    overclockTimer = 100;
    overclockCooldown = 375;
    statusText.textContent = "STATUS: OVERCLOCK_ACTIVE";
    statusText.style.color = "var(--syntax-var)";
}

function triggerCompileEngine() {
    menuOverlay.style.display = 'none';
    gameOverOverlay.style.display = 'none';
    resetWorkspace();
    gameRunning = true;
    statusText.textContent = "STATUS: COMPILED_OK";
    statusText.style.color = "";
    lastFrameTime = performance.now();
    accumulator = 0;
    requestAnimationFrame(gameLoop);
}

function resetWorkspace() {
    score = 0; bugsEaten = 0;
    scoreEl.textContent = score;
    bugsEatenEl.textContent = bugsEaten;
    board = MAZE.map(row => [...row]);

    pacman.gridX = 13; pacman.gridY = 17;
    pacman.x = 13 * CELL_SIZE; pacman.y = 17 * CELL_SIZE;
    pacman.dirX = -1; pacman.dirY = 0;
    pacman.nextDirX = -1; pacman.nextDirY = 0;
    pacman.speed = pacman.baseSpeed;

    overclockActive = false; overclockTimer = 0; overclockCooldown = 0;
    cooldownText.textContent = "COOLDOWN: READY"; cooldownText.style.color = "";

    globalMode = "CHASE"; globalModeTimer = 500;
    ghostsEatenThisPower = 0;
    particles = [];

    // reset ghosts
    ghosts[0].x = 13 * CELL_SIZE; ghosts[0].y = 11 * CELL_SIZE; ghosts[0].gridX = 13; ghosts[0].gridY = 11;
    ghosts[0].state = "CHASE"; ghosts[0].dirX = -1; ghosts[0].dirY = 0; ghosts[0].houseTimer = 0;
    ghosts[1].x = 12 * CELL_SIZE; ghosts[1].y = 13 * CELL_SIZE; ghosts[1].gridX = 12; ghosts[1].gridY = 13;
    ghosts[1].state = "HOUSE"; ghosts[1].dirX = -1; ghosts[1].dirY = 0; ghosts[1].houseTimer = 150;
    ghosts[2].x = 14 * CELL_SIZE; ghosts[2].y = 13 * CELL_SIZE; ghosts[2].gridX = 14; ghosts[2].gridY = 13;
    ghosts[2].state = "HOUSE"; ghosts[2].dirX = 1; ghosts[2].dirY = 0; ghosts[2].houseTimer = 300;
    ghosts[3].x = 13 * CELL_SIZE; ghosts[3].y = 12 * CELL_SIZE; ghosts[3].gridX = 13; ghosts[3].gridY = 12;
    ghosts[3].state = "HOUSE"; ghosts[3].dirX = 0; ghosts[3].dirY = -1; ghosts[3].houseTimer = 450;
}

// ----- Physics & Update -----
function gameLoop(timestamp) {
    if (!gameRunning) return;
    requestAnimationFrame(gameLoop);
    let dt = timestamp - lastFrameTime;
    if (dt > 100) dt = 16;
    lastFrameTime = timestamp;
    let speedMult = overclockActive ? 1.5 : 1.0;
    accumulator += dt * speedMult;
    while (accumulator >= TICK_RATE) {
        updatePhysicsStep();
        accumulator -= TICK_RATE;
    }
    render();
}

function updatePhysicsStep() {
    if (overclockActive) {
        overclockTimer--;
        if (overclockTimer <= 0) { overclockActive = false; statusText.textContent = "STATUS: COMPILED_OK"; statusText.style.color = ""; }
    }
    if (overclockCooldown > 0) {
        overclockCooldown--;
        cooldownText.textContent = overclockCooldown === 0 ? "COOLDOWN: READY" : `COOLDOWN: ${Math.ceil(overclockCooldown / 62.5)}S`;
        cooldownText.style.color = overclockCooldown === 0 ? "" : "var(--syntax-keyword)";
    }

    // Global mode timer
    globalModeTimer--;
    if (globalModeTimer <= 0) {
        globalMode = (globalMode === "CHASE") ? "SCATTER" : "CHASE";
        globalModeTimer = (globalMode === "CHASE") ? 700 : 300;
        // update ghost states that are not in special modes
        ghosts.forEach(g => {
            if (g.state === "CHASE" || g.state === "SCATTER") {
                g.state = globalMode;
            }
        });
    }

    updatePacman();
    updateGhosts();
    updateParticles();
    checkInteractions();
    checkVictoryCondition();
}

function updatePacman() {
    const gridCenterX = Math.round(pacman.x / CELL_SIZE) * CELL_SIZE;
    const gridCenterY = Math.round(pacman.y / CELL_SIZE) * CELL_SIZE;
    const distX = Math.abs(pacman.x - gridCenterX);
    const distY = Math.abs(pacman.y - gridCenterY);

    if (distX < pacman.speed && distY < pacman.speed) {
        pacman.x = gridCenterX;
        pacman.y = gridCenterY;
        pacman.gridX = Math.round(pacman.x / CELL_SIZE);
        pacman.gridY = Math.round(pacman.y / CELL_SIZE);

        // eat pellets
        if (pacman.gridX >= 0 && pacman.gridX < COLS && pacman.gridY >= 0 && pacman.gridY < ROWS) {
            if (board[pacman.gridY][pacman.gridX] === 0) {
                board[pacman.gridY][pacman.gridX] = 4;
                score += 10; scoreEl.textContent = score;
                createCompilationParticles(pacman.x, pacman.y, "#ffbd2e");
            } else if (board[pacman.gridY][pacman.gridX] === 3) {
                board[pacman.gridY][pacman.gridX] = 4;
                score += 50; scoreEl.textContent = score;
                createCompilationParticles(pacman.x, pacman.y, "#7ee787");
                triggerDebugState();
            }
        }

        if (!isWall(pacman.gridX + pacman.nextDirX, pacman.gridY + pacman.nextDirY) &&
            !isSpawnerGate(pacman.gridX + pacman.nextDirX, pacman.gridY + pacman.nextDirY, null)) {
            pacman.dirX = pacman.nextDirX; pacman.dirY = pacman.nextDirY;
        }
        if (isWall(pacman.gridX + pacman.dirX, pacman.gridY + pacman.dirY) ||
            isSpawnerGate(pacman.gridX + pacman.dirX, pacman.gridY + pacman.dirY, null)) {
            pacman.dirX = 0; pacman.dirY = 0;
        }
    }

    pacman.x += pacman.dirX * pacman.speed;
    pacman.y += pacman.dirY * pacman.speed;

    // wrap tunnel
    if (pacman.y === 13 * CELL_SIZE) {
        if (pacman.x < -CELL_SIZE) pacman.x = COLS * CELL_SIZE;
        else if (pacman.x > COLS * CELL_SIZE) pacman.x = -CELL_SIZE;
    }

    if (pacman.dirX !== 0 || pacman.dirY !== 0) {
        pacman.mouthAngle += pacman.mouthSpeed;
        if (pacman.mouthAngle > 0.4 || pacman.mouthAngle < 0.05) pacman.mouthSpeed = -pacman.mouthSpeed;
    }
}

function triggerDebugState() {
    statusText.textContent = "STATUS: DEBUG_MODE_ACTIVE";
    statusText.style.color = "var(--text-accent)";
    ghostsEatenThisPower = 0;
    ghosts.forEach(g => {
        if (g.state !== "EATEN" && g.state !== "HOUSE" && g.state !== "EXITING") {
            g.state = "FRIGHTENED";
            g.modeTime = 400;
            // snap to grid and reverse
            g.x = Math.round(g.x / CELL_SIZE) * CELL_SIZE;
            g.y = Math.round(g.y / CELL_SIZE) * CELL_SIZE;
            g.gridX = Math.round(g.x / CELL_SIZE);
            g.gridY = Math.round(g.y / CELL_SIZE);
            g.dirX = -g.dirX; g.dirY = -g.dirY;
        }
    });
}

// ----- Ghost Updates -----
function updateGhosts() {
    ghosts.forEach(g => {
        // frightened timer
        if (g.state === "FRIGHTENED") {
            g.modeTime--;
            if (g.modeTime <= 0) {
                g.state = globalMode;
                if (ghosts.filter(gh => gh.state === "FRIGHTENED").length === 0) {
                    statusText.textContent = "STATUS: COMPILED_OK"; statusText.style.color = "";
                }
            }
        }

        // house bobbing & release
        if (g.state === "HOUSE") {
            const upperY = 12 * CELL_SIZE + 4;
            const lowerY = 13 * CELL_SIZE + 4;
            g.y += g.dirY * 0.5;
            if (g.y <= upperY) { g.dirY = 1; g.y = upperY; }
            else if (g.y >= lowerY) { g.dirY = -1; g.y = lowerY; }
            g.houseTimer--;
            if (g.houseTimer <= 0) {
                // move to exit cell inside house (13,11) and set EXITING
                g.state = "EXITING";
                g.x = 13 * CELL_SIZE; g.y = 11 * CELL_SIZE;
                g.gridX = 13; g.gridY = 11;
                g.dirX = 0; g.dirY = -1;  // start moving up
            }
            return;
        }

        // movement for non-house ghosts
        let currentSpeed = g.speed;
        if (g.state === "FRIGHTENED") currentSpeed = 0.5;
        if (g.state === "EATEN") currentSpeed = 1.5;
        if (g.state === "EXITING") currentSpeed = 1.0;

        g.x += g.dirX * currentSpeed;
        g.y += g.dirY * currentSpeed;

        // wrap in tunnel row
        if (Math.abs(g.y - 13 * CELL_SIZE) < CELL_SIZE / 2) {
            if (g.x < -CELL_SIZE / 2) { g.x = COLS * CELL_SIZE - CELL_SIZE / 2; g.gridX = COLS - 1; }
            else if (g.x > COLS * CELL_SIZE - CELL_SIZE / 2) { g.x = -CELL_SIZE / 2; g.gridX = 0; }
        } else {
            g.x = Math.max(0, Math.min(g.x, (COLS - 1) * CELL_SIZE));
            g.y = Math.max(0, Math.min(g.y, (ROWS - 1) * CELL_SIZE));
        }

        // align to grid centre for direction decisions
        const gridCenterX = Math.round(g.x / CELL_SIZE) * CELL_SIZE;
        const gridCenterY = Math.round(g.y / CELL_SIZE) * CELL_SIZE;
        if (Math.abs(g.x - gridCenterX) < currentSpeed && Math.abs(g.y - gridCenterY) < currentSpeed) {
            g.x = gridCenterX; g.y = gridCenterY;
            g.gridX = Math.round(g.x / CELL_SIZE);
            g.gridY = Math.round(g.y / CELL_SIZE);

            // state transitions at specific tiles
            if (g.state === "EXITING" && g.gridX === 13 && g.gridY === 10) {
                g.state = globalMode;  // now outside house
                g.dirX = -1; g.dirY = 0;
            } else if (g.state === "EATEN" && g.gridX === 13 && g.gridY === 13) {
                g.state = "HOUSE"; g.houseTimer = 60;
                g.dirX = 0; g.dirY = -1;
                g.y = 13 * CELL_SIZE + 4;
                return;
            } else {
                decideGhostDirection(g);
            }
        }
    });
}

function decideGhostDirection(g) {
    let targetX, targetY;

    if (g.state === "EXITING") {
        targetX = 13; targetY = 10;  // above the door
    } else if (g.state === "EATEN") {
        targetX = 13; targetY = 13;  // house center
    } else if (g.state === "FRIGHTENED") {
        // random direction
        const dirs = getValidDirections(g);
        if (dirs.length > 0) {
            const rand = dirs[Math.floor(Math.random() * dirs.length)];
            g.dirX = rand.x; g.dirY = rand.y;
        }
        return;
    } else {
        // CHASE or SCATTER (following globalMode unless own state is SCATTER)
        const mode = (g.state === "SCATTER") ? "SCATTER" : globalMode;
        if (mode === "SCATTER") {
            if (g.name === "syntax_err") { targetX = 27; targetY = 0; }
            else if (g.name === "type_err") { targetX = 0; targetY = 0; }
            else if (g.name === "link_err") { targetX = 27; targetY = 27; }
            else if (g.name === "runtime_err") { targetX = 0; targetY = 27; }
        } else { // CHASE – unique per ghost
            if (g.name === "syntax_err") {
                // Blinky: directly targets Pacman
                targetX = pacman.gridX;
                targetY = pacman.gridY;
            } else if (g.name === "type_err") {
                // Pinky: 4 tiles ahead of Pacman
                targetX = pacman.gridX + pacman.dirX * 4;
                targetY = pacman.gridY + pacman.dirY * 4;
            } else if (g.name === "link_err") {
                // Inky: uses Blinky's position
                let blinky = ghosts[0];
                let aheadX = pacman.gridX + pacman.dirX * 2;
                let aheadY = pacman.gridY + pacman.dirY * 2;
                targetX = aheadX + (aheadX - blinky.gridX);
                targetY = aheadY + (aheadY - blinky.gridY);
            } else if (g.name === "runtime_err") {
                // Clyde: chase if far, scatter if close
                let dist = Math.hypot(g.gridX - pacman.gridX, g.gridY - pacman.gridY);
                if (dist > 8) {
                    targetX = pacman.gridX; targetY = pacman.gridY;
                } else {
                    targetX = 0; targetY = 27;
                }
            }
            // clamp targets
            targetX = Math.max(0, Math.min(COLS - 1, targetX));
            targetY = Math.max(0, Math.min(ROWS - 1, targetY));
        }
    }

    // direction selection
    const directions = [
        { x: 0, y: -1 }, // up
        { x: -1, y: 0 }, // left
        { x: 0, y: 1 },  // down
        { x: 1, y: 0 }   // right
    ];

    let validDirs = directions.filter(d => {
        if (d.x === -g.dirX && d.y === -g.dirY) return false; // no reverse unless forced
        const nx = g.gridX + d.x, ny = g.gridY + d.y;
        if (isWall(nx, ny)) return false;
        if (isSpawnerGate(nx, ny, g)) return false;
        return true;
    });

    if (validDirs.length === 0) {
        validDirs = directions.filter(d => {
            const nx = g.gridX + d.x, ny = g.gridY + d.y;
            if (isWall(nx, ny)) return false;
            if (isSpawnerGate(nx, ny, g)) return false;
            return true;
        });
    }

    if (validDirs.length === 0) { g.dirX = 0; g.dirY = 0; return; }

    let bestDir = validDirs[0];
    let minDist = Infinity;
    validDirs.forEach(d => {
        const nx = g.gridX + d.x, ny = g.gridY + d.y;
        const dist = Math.hypot(nx - targetX, ny - targetY);
        if (dist < minDist) { minDist = dist; bestDir = d; }
    });
    g.dirX = bestDir.x; g.dirY = bestDir.y;
}

function getValidDirections(g) {
    const dirs = [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }];
    let filtered = dirs.filter(d => {
        if (d.x === -g.dirX && d.y === -g.dirY) return false;
        const nx = g.gridX + d.x, ny = g.gridY + d.y;
        if (isWall(nx, ny)) return false;
        if (isSpawnerGate(nx, ny, g)) return false;
        return true;
    });
    if (filtered.length === 0) {
        filtered = dirs.filter(d => {
            const nx = g.gridX + d.x, ny = g.gridY + d.y;
            if (isWall(nx, ny)) return false;
            if (isSpawnerGate(nx, ny, g)) return false;
            return true;
        });
    }
    return filtered;
}

// ----- Collision & Helpers -----
function isWall(gridX, gridY) {
    if (gridY === 13 && (gridX < 0 || gridX >= COLS)) return false; // tunnel
    if (gridX < 0 || gridX >= COLS || gridY < 0 || gridY >= ROWS) return true;
    return board[gridY][gridX] === 1;
}

function isSpawnerGate(gridX, gridY, ghost) {
    if (gridY === 11 && (gridX === 13 || gridX === 14)) {
        if (ghost && (ghost.state === "HOUSE" || ghost.state === "EATEN" || ghost.state === "EXITING"))
            return false;
        return true; // blocks Pacman and normal ghosts
    }
    return false;
}

function checkInteractions() {
    ghosts.forEach(g => {
        if (Math.hypot(pacman.x - g.x, pacman.y - g.y) < CELL_SIZE * 0.8) {
            if (g.state === "FRIGHTENED") {
                g.state = "EATEN";
                g.x = Math.round(g.x / CELL_SIZE) * CELL_SIZE; g.y = Math.round(g.y / CELL_SIZE) * CELL_SIZE;
                g.gridX = Math.round(g.x / CELL_SIZE); g.gridY = Math.round(g.y / CELL_SIZE);
                bugsEaten++; ghostsEatenThisPower++;
                let points = 200 * Math.pow(2, Math.min(3, ghostsEatenThisPower - 1));
                score += points; scoreEl.textContent = score; bugsEatenEl.textContent = bugsEaten;
                createCompilationParticles(g.x, g.y, "#58a6ff");
            } else if (g.state !== "EATEN" && g.state !== "HOUSE" && g.state !== "EXITING") {
                triggerCrashDump(g.name, g.color);
            }
        }
    });
}

function checkVictoryCondition() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === 0 || board[r][c] === 3) return;
        }
    }
    gameRunning = false;
    statusText.textContent = "STATUS: BUILD_COMPLETE";
    finalMetrics.innerHTML = `<span class="success-text">BUILD SUCCESSFUL!</span><br>Score: ${score}  Bugs fixed: ${bugsEaten}`;
    gameOverOverlay.style.display = 'flex';
}

function triggerCrashDump(name, color) {
    gameRunning = false;
    statusText.textContent = "STATUS: SYSTEM_PANIC";
    finalMetrics.innerHTML = `<span class="error-text">Fatal:</span> Caught by <span style="color:${color}">${name}</span><br>Score: ${score}`;
    gameOverOverlay.style.display = 'flex';
}

// ----- Particles -----
function createCompilationParticles(px, py, color) {
    const bits = ["0", "1", ";", "{", "}"];
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: px + CELL_SIZE / 2, y: py + CELL_SIZE / 2,
            char: bits[Math.floor(Math.random() * bits.length)],
            vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
            alpha: 1.0, color: color
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.alpha -= 0.03;
        if (p.alpha <= 0) particles.splice(i, 1);
    }
}

// ----- Rendering -----
function render() {
    ctx.fillStyle = '#090c10';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === 1) drawMazeWall(c * CELL_SIZE, r * CELL_SIZE);
            else if (board[r][c] === 0) {
                ctx.fillStyle = '#ffbd2e'; ctx.font = '10px var(--font-stack)';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(';', c * CELL_SIZE + CELL_SIZE / 2, r * CELL_SIZE + CELL_SIZE / 2);
            } else if (board[r][c] === 3) {
                if (Math.floor(performance.now() / 250) % 2 === 0) {
                    ctx.fillStyle = '#7ee787'; ctx.font = 'bold 11px var(--font-stack)';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText('{}', c * CELL_SIZE + CELL_SIZE / 2, r * CELL_SIZE + CELL_SIZE / 2);
                }
            }
        }
    }

    drawPacman();
    drawGhosts();

    particles.forEach(p => {
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha;
        ctx.font = '11px var(--font-stack)';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(p.char, p.x, p.y);
    });
    ctx.globalAlpha = 1.0;
}

function drawMazeWall(x, y) {
    ctx.strokeStyle = '#21262d'; ctx.lineWidth = 1;
    ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    ctx.strokeStyle = '#30363d'; ctx.lineWidth = 1.2;
    ctx.strokeRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
}

function drawPacman() {
    ctx.save();
    ctx.translate(pacman.x + CELL_SIZE / 2, pacman.y + CELL_SIZE / 2);
    let angle = 0;
    if (pacman.dirX === 1) angle = 0;
    else if (pacman.dirX === -1) angle = Math.PI;
    else if (pacman.dirY === 1) angle = Math.PI / 2;
    else if (pacman.dirY === -1) angle = -Math.PI / 2;
    ctx.rotate(angle);
    ctx.fillStyle = overclockActive ? '#ffa657' : '#ffbd2e';
    ctx.shadowBlur = overclockActive ? 12 : 0;
    ctx.shadowColor = '#ffa657';
    ctx.beginPath();
    ctx.arc(0, 0, CELL_SIZE / 2 - 1, pacman.mouthAngle * Math.PI, (2 - pacman.mouthAngle) * Math.PI);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.restore();
}

function drawGhosts() {
    ghosts.forEach(g => {
        ctx.save();
        ctx.translate(g.x + CELL_SIZE / 2, g.y + CELL_SIZE / 2);
        if (g.state === "FRIGHTENED") { ctx.fillStyle = "#58a6ff"; ctx.shadowBlur = 8; ctx.shadowColor = "#58a6ff"; }
        else if (g.state === "EATEN") ctx.fillStyle = "rgba(139,148,158,0.4)";
        else ctx.fillStyle = g.color;

        if (g.state !== "EATEN") {
            ctx.beginPath();
            ctx.arc(0, -1, CELL_SIZE / 2 - 1.5, Math.PI, 0, false);
            ctx.lineTo(CELL_SIZE / 2 - 1.5, CELL_SIZE / 2 - 1);
            ctx.lineTo(CELL_SIZE / 4, CELL_SIZE / 3);
            ctx.lineTo(0, CELL_SIZE / 2 - 1);
            ctx.lineTo(-CELL_SIZE / 4, CELL_SIZE / 3);
            ctx.lineTo(-CELL_SIZE / 2 + 1.5, CELL_SIZE / 2 - 1);
            ctx.closePath();
            ctx.fill();
        }

        ctx.fillStyle = "#fff"; ctx.font = "bold 8px var(--font-stack)";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        if (g.state === "FRIGHTENED") ctx.fillText("!?", 0, -1);
        else if (g.state === "EATEN") ctx.fillText("👁👁", 0, -1);
        else {
            if (g.name === "syntax_err") ctx.fillText("SYN", 0, -1);
            if (g.name === "type_err") ctx.fillText("TYP", 0, -1);
            if (g.name === "link_err") ctx.fillText("LNK", 0, -1);
            if (g.name === "runtime_err") ctx.fillText("RUN", 0, -1);
        }
        ctx.restore();
    });
}

// initial draw
window.onload = () => render();