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

// -------------------- Grid & Maze --------------------
const COLS = 28;
const ROWS = 28;
const CELL_SIZE = 14;

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

// -------------------- Pac-Man --------------------
let pacman = {
    gridX: 13, gridY: 17,
    x: 13 * CELL_SIZE, y: 17 * CELL_SIZE,
    dirX: -1, dirY: 0,
    nextDirX: -1, nextDirY: 0,
    speed: 1.0,
    mouthAngle: 0.2, mouthSpeed: 0.04
};

// -------------------- Ghost Classes --------------------
class Ghost {
    constructor(name, color, startGridX, startGridY, speed, initialState, houseTimer, personality) {
        this.name = name;
        this.color = color;
        this.gridX = startGridX;
        this.gridY = startGridY;
        this.x = startGridX * CELL_SIZE;
        this.y = startGridY * CELL_SIZE;
        this.speed = speed;
        this.dirX = 0;
        this.dirY = 0;
        this.state = initialState;  // HOUSE, EXITING, CHASE, SCATTER, FRIGHTENED, EATEN
        this.modeTime = 0;
        this.houseTimer = houseTimer;
        this.personality = personality; // 'blinky', 'pinky', 'inky', 'clyde'
        this.frightenedTimer = 0;
        this.exitPath = null;
    }

    reset(startGridX, startGridY, initialState, houseTimer) {
        this.gridX = startGridX;
        this.gridY = startGridY;
        this.x = startGridX * CELL_SIZE;
        this.y = startGridY * CELL_SIZE;
        this.state = initialState;
        this.houseTimer = houseTimer;
        this.dirX = 0;
        this.dirY = 0;
        this.modeTime = 0;
        this.frightenedTimer = 0;
    }

    getTargetTile(globalMode, blinkyRef) {
        // If EXITING, target is cell above the door (13,10)
        if (this.state === 'EXITING') return { x: 13, y: 10 };
        // If EATEN, target is the house center (13,13)
        if (this.state === 'EATEN') return { x: 13, y: 13 };
        // If FRIGHTENED, random direction will be chosen later
        if (this.state === 'FRIGHTENED') return null;

        const mode = (this.state === 'SCATTER') ? 'SCATTER' : globalMode;
        if (mode === 'SCATTER') {
            if (this.personality === 'blinky') return { x: 27, y: 0 };
            if (this.personality === 'pinky') return { x: 0, y: 0 };
            if (this.personality === 'inky') return { x: 27, y: 27 };
            if (this.personality === 'clyde') return { x: 0, y: 27 };
        } else { // CHASE
            if (this.personality === 'blinky') {
                return { x: pacman.gridX, y: pacman.gridY };
            } else if (this.personality === 'pinky') {
                let tx = pacman.gridX + pacman.dirX * 4;
                let ty = pacman.gridY + pacman.dirY * 4;
                return { x: Math.max(0, Math.min(COLS - 1, tx)), y: Math.max(0, Math.min(ROWS - 1, ty)) };
            } else if (this.personality === 'inky') {
                let aheadX = pacman.gridX + pacman.dirX * 2;
                let aheadY = pacman.gridY + pacman.dirY * 2;
                let blinky = blinkyRef;
                let tx = aheadX + (aheadX - blinky.gridX);
                let ty = aheadY + (aheadY - blinky.gridY);
                return { x: Math.max(0, Math.min(COLS - 1, tx)), y: Math.max(0, Math.min(ROWS - 1, ty)) };
            } else if (this.personality === 'clyde') {
                let dist = Math.hypot(this.gridX - pacman.gridX, this.gridY - pacman.gridY);
                if (dist > 8) return { x: pacman.gridX, y: pacman.gridY };
                else return { x: 0, y: 27 };
            }
        }
        return { x: 13, y: 13 }; // fallback
    }

    decideDirection(globalMode, ghosts) {
        // Find blinky (for Inky's targeting)
        const blinky = ghosts.find(g => g.personality === 'blinky') || this;

        // FRIGHTENED: random valid direction
        if (this.state === 'FRIGHTENED') {
            const dirs = this.getValidDirections(false);
            if (dirs.length > 0) {
                const rand = dirs[Math.floor(Math.random() * dirs.length)];
                this.dirX = rand.x; this.dirY = rand.y;
            }
            return;
        }

        // Non‑FRIGHTENED: get target tile
        let target = this.getTargetTile(globalMode, blinky);
        if (!target) return;

        // Get possible directions (prefer no reverse)
        let validDirs = this.getValidDirections(true);

        if (validDirs.length === 0) {
            validDirs = this.getValidDirections(false);
        }

        if (validDirs.length === 0) {
            this.dirX = 0; this.dirY = 0;
            return;
        }

        // Choose direction closest to target
        let bestDir = validDirs[0];
        let minDist = Infinity;
        validDirs.forEach(d => {
            const nx = this.gridX + d.x;
            const ny = this.gridY + d.y;
            const dist = Math.hypot(nx - target.x, ny - target.y);
            if (dist < minDist) {
                minDist = dist;
                bestDir = d;
            }
        });
        this.dirX = bestDir.x;
        this.dirY = bestDir.y;
    }

    getValidDirections(avoidReverse) {
        const allDirs = [
            { x: 0, y: -1 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 0 }
        ];
        let filtered = allDirs.filter(d => {
            if (avoidReverse && d.x === -this.dirX && d.y === -this.dirY) return false;
            const nx = this.gridX + d.x;
            const ny = this.gridY + d.y;
            if (isWall(nx, ny)) return false;
            if (isSpawnerGate(nx, ny, this)) return false;
            return true;
        });
        if (filtered.length === 0 && avoidReverse) {
            filtered = allDirs.filter(d => {
                const nx = this.gridX + d.x;
                const ny = this.gridY + d.y;
                if (isWall(nx, ny)) return false;
                if (isSpawnerGate(nx, ny, this)) return false;
                return true;
            });
        }
        return filtered;
    }

    update(globalMode, ghosts) {
        // HOUSE logic (bob up/down)
        if (this.state === 'HOUSE') {
            const upperY = 12 * CELL_SIZE + 4;
            const lowerY = 13 * CELL_SIZE + 4;
            this.y += this.dirY * 0.5;
            if (this.y <= upperY) { this.dirY = 1; this.y = upperY; }
            else if (this.y >= lowerY) { this.dirY = -1; this.y = lowerY; }

            // Releasing countdown and locking rules
            if (globalFrightenedTimer > 0) {
                return; // Hold inside base until power-up decays
            }

            this.houseTimer--;
            if (this.houseTimer <= 0) {
                this.state = 'EXITING';
                this.x = 13 * CELL_SIZE;
                this.y = 13 * CELL_SIZE;
                this.gridX = 13; this.gridY = 13;
                this.dirX = 0; this.dirY = -1; // start moving up smoothly
            }
            return;
        }

        // Movement (non‑HOUSE)
        let speed = this.speed;
        if (this.state === 'FRIGHTENED') speed = 0.5;
        else if (this.state === 'EATEN') speed = 1.5;
        else if (this.state === 'EXITING') speed = 1.0;

        this.x += this.dirX * speed;
        this.y += this.dirY * speed;

        // Wrap in tunnel
        if (Math.abs(this.y - 13 * CELL_SIZE) < CELL_SIZE / 2) {
            if (this.x < -CELL_SIZE / 2) {
                this.x = COLS * CELL_SIZE - CELL_SIZE / 2;
                this.gridX = COLS - 1;
            } else if (this.x > COLS * CELL_SIZE - CELL_SIZE / 2) {
                this.x = -CELL_SIZE / 2;
                this.gridX = 0;
            }
        } else {
            this.x = Math.max(0, Math.min(this.x, (COLS - 1) * CELL_SIZE));
            this.y = Math.max(0, Math.min(this.y, (ROWS - 1) * CELL_SIZE));
        }

        // Check grid center alignment
        const gridCenterX = Math.round(this.x / CELL_SIZE) * CELL_SIZE;
        const gridCenterY = Math.round(this.y / CELL_SIZE) * CELL_SIZE;
        if (Math.abs(this.x - gridCenterX) < speed && Math.abs(this.y - gridCenterY) < speed) {
            this.x = gridCenterX;
            this.y = gridCenterY;
            this.gridX = Math.round(this.x / CELL_SIZE);
            this.gridY = Math.round(this.y / CELL_SIZE);

            // State transitions at specific tiles
            if (this.state === 'EXITING' && this.gridX === 13 && this.gridY === 10) {
                this.state = globalMode;
                this.dirX = -1; this.dirY = 0;
            } else if (this.state === 'EATEN' && this.gridX === 13 && this.gridY === 13) {
                this.state = 'HOUSE';
                this.houseTimer = 60;
                this.dirX = 0; this.dirY = -1;
                this.y = 13 * CELL_SIZE + 4; // reset bobbing position
                return;
            } else {
                this.decideDirection(globalMode, ghosts);
            }
        }
    }
}

// -------------------- Instantiate Ghosts --------------------
let ghosts = [
    new Ghost("syntax_err", "#ff7b72", 13, 11, 1.05, "CHASE", 0, 'blinky'),
    new Ghost("type_err", "#ff7dd2", 12, 13, 1.0, "HOUSE", 150, 'pinky'),
    new Ghost("link_err", "#58a6ff", 14, 13, 0.95, "HOUSE", 300, 'inky'),
    new Ghost("runtime_err", "#ffa657", 13, 12, 0.9, "HOUSE", 450, 'clyde')
];

// Global state
let globalMode = "CHASE";
let globalModeTimer = 500;
let globalFrightenedTimer = 0; // Synchronized global frightened duration timer
let ghostsEatenThisPower = 0;
let particles = [];
let overclockActive = false;
let overclockTimer = 0;
let overclockCooldown = 0;

// Timing
let lastFrameTime = 0;
let accumulator = 0;
const TICK_RATE = 1000 / 62.5;

// -------------------- Utility Functions --------------------
function isWall(gx, gy) {
    if (gy === 13 && (gx < 0 || gx >= COLS)) return false; // tunnel
    if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS) return true;
    return board[gy][gx] === 1;
}

function isSpawnerGate(gx, gy, ghost) {
    if (gy === 11 && (gx === 13 || gx === 14)) {
        if (ghost && (ghost.state === 'HOUSE' || ghost.state === 'EATEN' || ghost.state === 'EXITING'))
            return false;
        return true;
    }
    // Block house interior for active chasing/frightened ghosts and Pacman
    if (gy >= 12 && gy <= 14 && gx >= 11 && gx <= 16) {
        if (ghost && (ghost.state === 'HOUSE' || ghost.state === 'EATEN' || ghost.state === 'EXITING'))
            return false;
        return true;
    }
    return false;
}

// -------------------- Input & Game Flow --------------------
// (keyboard, touch, and trigger functions remain mostly the same as before)
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

    overclockActive = false; overclockTimer = 0; overclockCooldown = 0;
    cooldownText.textContent = "COOLDOWN: READY"; cooldownText.style.color = "";

    globalMode = "CHASE"; globalModeTimer = 500;
    globalFrightenedTimer = 0;
    ghostsEatenThisPower = 0;
    particles = [];

    // Reset each ghost individually
    ghosts[0].reset(13, 11, "CHASE", 0);
    ghosts[1].reset(12, 13, "HOUSE", 150);
    ghosts[2].reset(14, 13, "HOUSE", 300);
    ghosts[3].reset(13, 12, "HOUSE", 450);
}

// -------------------- Game Loop --------------------
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

    if (globalFrightenedTimer > 0) {
        globalFrightenedTimer--;
        if (globalFrightenedTimer === 0) {
            statusText.textContent = "STATUS: COMPILED_OK";
            statusText.style.color = "";
            ghosts.forEach(g => {
                if (g.state === "FRIGHTENED") {
                    g.state = globalMode;
                }
            });
        }
    }

    // Global mode timer
    globalModeTimer--;
    if (globalModeTimer <= 0) {
        globalMode = (globalMode === "CHASE") ? "SCATTER" : "CHASE";
        globalModeTimer = (globalMode === "CHASE") ? 700 : 300;
        // Update non-special ghost states
        ghosts.forEach(g => {
            if (g.state === "CHASE" || g.state === "SCATTER") {
                g.state = globalMode;
            }
        });
    }

    updatePacman();
    ghosts.forEach(g => g.update(globalMode, ghosts));
    updateParticles();
    checkInteractions();
    checkVictoryCondition();
}

function updatePacman() {
    // same as before, but using CELL_SIZE
    const gridCenterX = Math.round(pacman.x / CELL_SIZE) * CELL_SIZE;
    const gridCenterY = Math.round(pacman.y / CELL_SIZE) * CELL_SIZE;
    if (Math.abs(pacman.x - gridCenterX) < pacman.speed && Math.abs(pacman.y - gridCenterY) < pacman.speed) {
        pacman.x = gridCenterX; pacman.y = gridCenterY;
        pacman.gridX = Math.round(pacman.x / CELL_SIZE);
        pacman.gridY = Math.round(pacman.y / CELL_SIZE);

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
    
    globalFrightenedTimer = 400; // Synchronize frightened timer
    
    ghosts.forEach(g => {
        if (g.state !== 'EATEN' && g.state !== 'HOUSE' && g.state !== 'EXITING') {
            g.state = 'FRIGHTENED';
            g.frightenedTimer = 400;
            // snap and reverse
            g.x = Math.round(g.x / CELL_SIZE) * CELL_SIZE;
            g.y = Math.round(g.y / CELL_SIZE) * CELL_SIZE;
            g.gridX = Math.round(g.x / CELL_SIZE);
            g.gridY = Math.round(g.y / CELL_SIZE);
            g.dirX = -g.dirX; g.dirY = -g.dirY;
        }
    });
}

function checkInteractions() {
    ghosts.forEach(g => {
        if (Math.hypot(pacman.x - g.x, pacman.y - g.y) < CELL_SIZE * 0.8) {
            if (g.state === 'FRIGHTENED') {
                g.state = 'EATEN';
                g.x = Math.round(g.x / CELL_SIZE) * CELL_SIZE; g.y = Math.round(g.y / CELL_SIZE) * CELL_SIZE;
                g.gridX = Math.round(g.x / CELL_SIZE); g.gridY = Math.round(g.y / CELL_SIZE);
                bugsEaten++; ghostsEatenThisPower++;
                score += 200 * Math.pow(2, Math.min(3, ghostsEatenThisPower - 1));
                scoreEl.textContent = score; bugsEatenEl.textContent = bugsEaten;
                createCompilationParticles(g.x, g.y, "#58a6ff");
            } else if (g.state !== 'EATEN' && g.state !== 'HOUSE' && g.state !== 'EXITING') {
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

// -------------------- Particles --------------------
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

// -------------------- Rendering --------------------
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
    ghosts.forEach(g => drawGhost(g));

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

function drawGhost(g) {
    ctx.save();
    ctx.translate(g.x + CELL_SIZE / 2, g.y + CELL_SIZE / 2);
    if (g.state === 'FRIGHTENED') { ctx.fillStyle = '#58a6ff'; ctx.shadowBlur = 8; ctx.shadowColor = '#58a6ff'; }
    else if (g.state === 'EATEN') ctx.fillStyle = 'rgba(139,148,158,0.4)';
    else ctx.fillStyle = g.color;

    if (g.state !== 'EATEN') {
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

    ctx.fillStyle = '#fff'; ctx.font = 'bold 8px var(--font-stack)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (g.state === 'FRIGHTENED') ctx.fillText('!?', 0, -1);
    else if (g.state === 'EATEN') ctx.fillText('👁👁', 0, -1);
    else {
        if (g.name === 'syntax_err') ctx.fillText('SYN', 0, -1);
        if (g.name === 'type_err') ctx.fillText('TYP', 0, -1);
        if (g.name === 'link_err') ctx.fillText('LNK', 0, -1);
        if (g.name === 'runtime_err') ctx.fillText('RUN', 0, -1);
    }
    ctx.restore();
}

// -------------------- Start --------------------
window.onload = () => render();