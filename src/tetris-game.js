const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const linesEl = document.getElementById('lines');
const menuOverlay = document.getElementById('menuOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalMetrics = document.getElementById('finalMetrics');
const gameFrame = document.getElementById('gameFrame');
const statusText = document.getElementById('statusText');
const levelText = document.getElementById('levelText');

// Layout Physics Grid definitions (Standard 10 Columns x 20 Rows scale matrix space)
const BOARD_COLS = 10;
const BOARD_ROWS = 20;
const CELL_SIZE = 24; // Mapped precisely within the 360x480 responsive coordinate map

// Offset configurations
const BOARD_X = 10;
const BOARD_Y = 0;
const RIGHT_PANEL_X = 260;

// Core Block Palette mapping Syntax elements
const TETROMINO_COLORS = {
    'I': { fill: '#58a6ff', stroke: '#388bfd', shadow: '#58a6ff' }, // Syntax Type (Blue)
    'O': { fill: '#ffa657', stroke: '#f0883e', shadow: '#ffa657' }, // Function / Variable (Orange)
    'T': { fill: '#d2a8ff', stroke: '#bc8cff', shadow: '#d2a8ff' }, // Operator / Keyword (Purple)
    'S': { fill: '#7ee787', stroke: '#56d364', shadow: '#7ee787' }, // Success String (Green)
    'Z': { fill: '#ff7b72', stroke: '#f85149', shadow: '#ff7b72' }, // Exception String (Red)
    'J': { fill: '#3fb950', stroke: '#2ea043', shadow: '#3fb950' }, // Comments (Green)
    'L': { fill: '#e1b400', stroke: '#b08b00', shadow: '#e1b400' }  // Constants (Yellow)
};

const SHAPES = {
    'I': [[1, 1, 1, 1]],
    'O': [[1, 1], [1, 1]],
    'T': [[0, 1, 0], [1, 1, 1]],
    'S': [[0, 1, 1], [1, 1, 0]],
    'Z': [[1, 1, 0], [0, 1, 1]],
    'J': [[1, 0, 0], [1, 1, 1]],
    'L': [[0, 0, 1], [1, 1, 1]]
};

let board = Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0));
let activePiece = null;
let nextPiece = null;
let particles = [];
let score = 0;
let lines = 0;
let level = 1;
let gameRunning = false;
let lastDropTime = 0;
let dropInterval = 1000; // Baseline gravity step speed rate (ms)

let isSpeedingUp = false;      // Accelerated Soft Drop falling animation
let isImmediateSliding = false; // Fast sliding drop animation down instantly

// Flashing and progressive difficulty system variables
let isClearing = false;
let clearingRows = [];
let clearAnimTimer = 0;
let lastFrameTime = 0;
let lastOverclockTime = 0;
let overclockLevel = 0;

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

// Tactile touch interfaces supporting low-latency D-Pad hold and slide mechanics
document.querySelectorAll('.dpad-btn, .action-btn').forEach(btn => {
    const action = btn.getAttribute('data-action');
    btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (action === 'down') {
            isSpeedingUp = true;
        } else if (action === 'hard') {
            isImmediateSliding = true;
        } else {
            processAction(action);
        }
    });
    btn.addEventListener('pointerup', (e) => {
        e.preventDefault();
        if (action === 'down') {
            isSpeedingUp = false;
        }
    });
    btn.addEventListener('pointerleave', (e) => {
        if (action === 'down') {
            isSpeedingUp = false;
        }
    });
});

// Initialize game on game screen interaction
gameFrame.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (!gameRunning) {
        triggerAppBootCompiler();
    }
});

function handleKeyDown(e) {
    if (!gameRunning) {
        if (e.key === ' ' || e.key === 'Enter') {
            triggerAppBootCompiler();
        }
        return;
    }

    if (isClearing || isImmediateSliding) return;

    // Block default scroll behaviors on gameplay keys
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
    }

    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            processAction('left');
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            processAction('right');
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
            processAction('rotate');
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            isSpeedingUp = true;
            break;
        case ' ':
            isImmediateSliding = true;
            break;
    }
}

function handleKeyUp(e) {
    if (!gameRunning) return;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        isSpeedingUp = false;
    }
}

function processAction(action) {
    if (!gameRunning || isClearing || isImmediateSliding || !activePiece) return;

    if (action === 'left') {
        if (isValidMove(activePiece.matrix, activePiece.x - 1, activePiece.y)) {
            activePiece.x--;
        }
    } else if (action === 'right') {
        if (isValidMove(activePiece.matrix, activePiece.x + 1, activePiece.y)) {
            activePiece.x++;
        }
    } else if (action === 'rotate') {
        rotateActivePiece();
    }
}

function triggerAppBootCompiler() {
    if (!gameRunning) {
        menuOverlay.style.display = 'none';
        gameOverOverlay.style.display = 'none';
        resetGame();
        gameRunning = true;
        statusText.textContent = "STATUS: RUNNING";
        lastDropTime = performance.now();
        lastFrameTime = performance.now();
        lastOverclockTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
}

function resetGame() {
    board = Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0));
    score = 0;
    lines = 0;
    level = 1;
    dropInterval = 1000;
    isSpeedingUp = false;
    isImmediateSliding = false;
    activePiece = null; // Explicitly clear active piece
    scoreEl.textContent = score;
    linesEl.textContent = lines;
    levelText.textContent = `LEVEL: ${level}`;
    particles = [];
    isClearing = false;
    clearingRows = [];
    clearAnimTimer = 0;
    overclockLevel = 0;
    nextPiece = createRandomPiece();
    spawnNextPiece();
}

function createRandomPiece() {
    const types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const type = types[Math.floor(Math.random() * types.length)];
    return {
        type: type,
        matrix: JSON.parse(JSON.stringify(SHAPES[type])),
        x: Math.floor((BOARD_COLS - SHAPES[type][0].length) / 2),
        y: 0
    };
}

function spawnNextPiece() {
    activePiece = nextPiece;
    nextPiece = createRandomPiece();

    // Check if spawning location collides immediately (Game Over scenario)
    if (!isValidMove(activePiece.matrix, activePiece.x, activePiece.y)) {
        triggerGameOver("STACK_OVERFLOW: Recursive block layout trace limit exceeded.");
    }
}

// Collision Verification System
function isValidMove(matrix, offset_x, offset_y) {
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c]) {
                const targetX = offset_x + c;
                const targetY = offset_y + r;

                if (targetX < 0 || targetX >= BOARD_COLS || targetY >= BOARD_ROWS) {
                    return false;
                }
                if (targetY >= 0 && board[targetY][targetX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function rotateActivePiece() {
    const currentMatrix = activePiece.matrix;
    const N = currentMatrix.length;
    const M = currentMatrix[0].length;

    // Re-map 2D Array Matrix orientation CCW direction steps
    let temp = Array.from({ length: M }, () => Array(N).fill(0));
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < M; c++) {
            temp[c][N - 1 - r] = currentMatrix[r][c];
        }
    }

    // Simple wall-kick fallback loop logic steps
    const offsets = [0, -1, 1, -2, 2];
    for (let offset of offsets) {
        if (isValidMove(temp, activePiece.x + offset, activePiece.y)) {
            activePiece.matrix = temp;
            activePiece.x += offset;
            return;
        }
    }
}

function lockActivePiece() {
    if (!activePiece || isClearing) return; // Prevent double-locking
    
    const matrix = activePiece.matrix;
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c]) {
                const boardY = activePiece.y + r;
                const boardX = activePiece.x + c;
                if (boardY >= 0 && boardY < BOARD_ROWS) {
                    board[boardY][boardX] = activePiece.type;
                }
            }
        }
    }
    
    isImmediateSliding = false;
    isSpeedingUp = false;
    
    detectLineClears();
}

function detectLineClears() {
    clearingRows = [];
    for (let r = BOARD_ROWS - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            clearingRows.push(r);
        }
    }

    if (clearingRows.length > 0) {
        isClearing = true;
        clearAnimTimer = 18; // Flash for 18 animation frame ticks (~300ms)
    } else {
        spawnNextPiece();
    }
}

function finalizeLineClears() {
    const linesClearedThisTurn = clearingRows.length;
    
    // Track if this was a T-spin (bonus scoring)
    let isTSpin = false;
    if (activePiece && activePiece.type === 'T') {
        // Check if the T-piece was rotated into place
        isTSpin = true; // Simplified T-spin detection
    }

    clearingRows.forEach(r => {
        for (let c = 0; c < BOARD_COLS; c++) {
            const blockType = board[r][c];
            const blockColor = TETROMINO_COLORS[blockType] ? TETROMINO_COLORS[blockType].fill : '#58a6ff';
            createClearedLineParticles(c, r, blockColor);
        }
    });

    clearingRows.sort((a, b) => b - a).forEach(r => {
        board.splice(r, 1);
        board.unshift(Array(BOARD_COLS).fill(0));
    });

    // Fixed scoring with T-spin bonuses
    const basePoints = [0, 100, 300, 500, 800];
    let linePoints = basePoints[linesClearedThisTurn] * level;
    
    // T-spin bonus (multiply by 1.5)
    if (isTSpin && linesClearedThisTurn >= 2) {
        linePoints = Math.floor(linePoints * 1.5);
        statusText.textContent = "STATUS: T-SPIN!";
        statusText.style.color = '#d2a8ff';
        setTimeout(() => {
            if (gameRunning) {
                statusText.textContent = "STATUS: RUNNING";
                statusText.style.color = '';
            }
        }, 1500);
    }
    
    // Combo bonus (consecutive line clears)
    if (linesClearedThisTurn >= 4) {
        linePoints += 200 * level; // Tetris bonus
    }
    
    score += linePoints;
    lines += linesClearedThisTurn;

    scoreEl.textContent = score;
    linesEl.textContent = lines;

    updateDifficultyAndLevel();

    if (linesClearedThisTurn > 0) {
        triggerShake();
    }

    isClearing = false;
    clearingRows = [];
    spawnNextPiece();
}

function updateDifficultyAndLevel() {
    const targetLevel = Math.floor(lines / 10) + 1;
    if (targetLevel > level) {
        level = targetLevel;
        levelText.textContent = `LEVEL: ${level}`;
    }
    // Base speedup calculated from current level + active survival overclock coefficients
    const baseInterval = Math.max(100, 1000 - (level - 1) * 100);
    dropInterval = Math.max(80, baseInterval - overclockLevel * 50);
}

function createClearedLineParticles(colIdx, rowIdx, color) {
    const symbols = ['0', '1'];
    const px = BOARD_X + (colIdx * CELL_SIZE) + CELL_SIZE / 2;
    const py = BOARD_Y + (rowIdx * CELL_SIZE) + CELL_SIZE / 2;

    for (let i = 0; i < 4; i++) {
        particles.push({
            x: px,
            y: py,
            char: symbols[Math.floor(Math.random() * symbols.length)],
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 1.2) * 4,
            alpha: 1.0,
            color: color
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.035;
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }
}

function triggerShake() {
    if (!gameFrame) return;
    gameFrame.classList.remove('shake');
    void gameFrame.offsetWidth;
    gameFrame.classList.add('shake');
}

function triggerGameOver(reason) {
    gameRunning = false;
    isImmediateSliding = false;
    isSpeedingUp = false;
    statusText.textContent = "STATUS: STACK CRASH";
    finalMetrics.innerHTML = `<span class="error-text">Exception:</span> ${reason}<br><br><span class="variable">Compiled Rows Count:</span> <span class="number">${lines}</span><br><span class="variable">Final Build Score:</span> <span class="number">${score}</span>`;
    gameOverOverlay.style.display = 'flex';
    triggerShake();
}

function gameLoop(timestamp) {
    if (!gameRunning) return;

    requestAnimationFrame(gameLoop);

    const elapsedFrame = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    updateParticles();

    // Intercept normal physics logic if line-clear flashing phase is active
    if (isClearing) {
        clearAnimTimer--;
        if (clearAnimTimer <= 0) {
            finalizeLineClears();
        }
        render();
        return;
    }

    // Continuous Survival Difficulty Scaler
    if (timestamp - lastOverclockTime >= 30000) {
        lastOverclockTime = timestamp;
        overclockLevel++;
        updateDifficultyAndLevel();

        statusText.textContent = `STATUS: OVERCLOCK_V${overclockLevel}`;
        statusText.style.color = 'var(--syntax-var)';
        setTimeout(() => {
            if (gameRunning) {
                statusText.textContent = "STATUS: RUNNING";
                statusText.style.color = '';
            }
        }, 3000);
    }

    const elapsed = timestamp - lastDropTime;

    // Dynamic interval mapping
    let currentInterval = dropInterval;
    if (isImmediateSliding) {
        // HARD DROP: Instantly place piece at lowest position
        hardDropPiece();
        lastDropTime = timestamp;
        render();
        return;
    } else if (isSpeedingUp) {
        currentInterval = 45;
        // SOFT DROP: Award points for each cell dropped
        if (elapsed >= currentInterval) {
            lastDropTime = timestamp;
            if (isValidMove(activePiece.matrix, activePiece.x, activePiece.y + 1)) {
                activePiece.y++;
                score += 1; // Soft drop scoring: 1 point per cell
                scoreEl.textContent = score;
            } else {
                lockActivePiece();
            }
        }
    } else {
        // NORMAL DROP
        if (elapsed >= currentInterval) {
            lastDropTime = timestamp;
            if (isValidMove(activePiece.matrix, activePiece.x, activePiece.y + 1)) {
                activePiece.y++;
            } else {
                lockActivePiece();
            }
        }
    }

    render();
}

// Add this new function for hard drops:
function hardDropPiece() {
    if (!activePiece || isClearing) return;
    
    let dropDistance = 0;
    
    // Find the lowest valid position
    while (isValidMove(activePiece.matrix, activePiece.x, activePiece.y + dropDistance + 1)) {
        dropDistance++;
    }
    
    // Award 2 points per cell dropped
    score += dropDistance * 2;
    scoreEl.textContent = score;
    
    // Place piece at the lowest position
    activePiece.y += dropDistance;
    
    // Create hard drop particles
    if (dropDistance > 0) {
        const style = TETROMINO_COLORS[activePiece.type];
        if (style) {
            createHardDropParticles(
                BOARD_X + (activePiece.x + Math.floor(activePiece.matrix[0].length / 2)) * CELL_SIZE,
                BOARD_Y + activePiece.y * CELL_SIZE,
                style.fill
            );
        }
        triggerShake();
    }

    lockActivePiece();

    isImmediateSliding = false;
}

// Add hard drop particle effects:
function createHardDropParticles(px, py, color) {
    const symbols = ['▼', '↓', '|'];
    for (let i = 0; i < 6; i++) {
        particles.push({
            x: px + (Math.random() - 0.5) * 20,
            y: py + Math.random() * 10,
            char: symbols[Math.floor(Math.random() * symbols.length)],
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 2 + 1,
            alpha: 1.0,
            color: color
        });
    }
}

function render() {
    // Clear current frame
    ctx.fillStyle = '#090c10';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Board Grid Boundaries & Layout Lines
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(BOARD_X, BOARD_Y, BOARD_COLS * CELL_SIZE, BOARD_ROWS * CELL_SIZE);
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;

    for (let r = 0; r <= BOARD_ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(BOARD_X, BOARD_Y + r * CELL_SIZE);
        ctx.lineTo(BOARD_X + BOARD_COLS * CELL_SIZE, BOARD_Y + r * CELL_SIZE);
        ctx.stroke();
    }
    for (let c = 0; c <= BOARD_COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(BOARD_X + c * CELL_SIZE, BOARD_Y);
        ctx.lineTo(BOARD_X + c * CELL_SIZE, BOARD_Y + BOARD_ROWS * CELL_SIZE);
        ctx.stroke();
    }

    // 2. Draw Locked Static Blocks / Flashing compiles
    for (let r = 0; r < BOARD_ROWS; r++) {
        const isRowFlashing = isClearing && clearingRows.includes(r);
        const flashOn = Math.floor(clearAnimTimer / 3) % 2 === 0;

        for (let c = 0; c < BOARD_COLS; c++) {
            const blockType = board[r][c];
            if (blockType !== 0) {
                if (isRowFlashing) {
                    if (flashOn) {
                        drawFlashBlock(BOARD_X + c * CELL_SIZE, BOARD_Y + r * CELL_SIZE);
                    }
                } else {
                    drawBlock(BOARD_X + c * CELL_SIZE, BOARD_Y + r * CELL_SIZE, blockType);
                }
            }
        }
    }

    // 3. Draw Drop Ghost Target Overlay
    if (activePiece) {
        let dropDist = 0;
        while (isValidMove(activePiece.matrix, activePiece.x, activePiece.y + dropDist + 1)) {
            dropDist++;
        }
        const ghostY = activePiece.y + dropDist;

        ctx.save();
        ctx.globalAlpha = 0.18; // Soft visual indicator transparency
        const matrix = activePiece.matrix;
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    drawBlock(BOARD_X + (activePiece.x + c) * CELL_SIZE, BOARD_Y + (ghostY + r) * CELL_SIZE, activePiece.type);
                }
            }
        }
        ctx.restore();
    }

    // 4. Draw Active Falling Blocks Segment
    if (activePiece) {
        const matrix = activePiece.matrix;
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    drawBlock(BOARD_X + (activePiece.x + c) * CELL_SIZE, BOARD_Y + (activePiece.y + r) * CELL_SIZE, activePiece.type);
                }
            }
        }
    }

    // 5. Draw Right HUD Aux Sidebar Info (Next Piece Display panel)
    drawSidebarLayout();

    // 6. Draw Particle Systems Layer
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.font = '10px var(--font-stack)';
        ctx.fillText(p.char, p.x, p.y);
    });
    ctx.restore();
}

// Subsystem Block Drawing Component
function drawBlock(px, py, type) {
    const style = TETROMINO_COLORS[type];
    if (!style) return;

    ctx.fillStyle = style.fill;
    ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);

    // Inner bracket syntax themed graphic lines inside tiles
    ctx.fillStyle = 'rgba(13, 17, 23, 0.4)';
    ctx.font = 'bold 9px var(--font-stack)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('[]', px + CELL_SIZE / 2, py + CELL_SIZE / 2);
}

function drawFlashBlock(px, py) {
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#58a6ff';
    ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    ctx.shadowBlur = 0;
}

function drawSidebarLayout() {
    // Draw Next section bounding containers
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#161b22';
    ctx.fillRect(RIGHT_PANEL_X, 20, 90, 90);
    ctx.strokeRect(RIGHT_PANEL_X, 20, 90, 90);

    // Label text metrics
    ctx.fillStyle = '#8b949e';
    ctx.font = '10px var(--font-stack)';
    ctx.textAlign = 'center';
    ctx.fillText('// NEXT_PIECE', RIGHT_PANEL_X + 45, 15);

    // Render Preview blocks centered neatly inside next viewport
    if (nextPiece) {
        const matrix = nextPiece.matrix;
        const rows = matrix.length;
        const cols = matrix[0].length;
        const innerCellSize = 14;

        const startX = RIGHT_PANEL_X + (90 - cols * innerCellSize) / 2;
        const startY = 20 + (90 - rows * innerCellSize) / 2;

        const style = TETROMINO_COLORS[nextPiece.type];
        if (style) {
            ctx.save();
            ctx.fillStyle = style.fill;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (matrix[r][c]) {
                        ctx.fillRect(startX + c * innerCellSize + 1, startY + r * innerCellSize + 1, innerCellSize - 2, innerCellSize - 2);
                    }
                }
            }
            ctx.restore();
        }
    }

    // Static Syntax-inspired Help panel lines mapped bottom
    ctx.textAlign = 'left';
    ctx.font = '9px var(--font-stack)';
    ctx.fillStyle = '#58a6ff';
    ctx.fillText('/* CONTROLS', RIGHT_PANEL_X, 150);
    ctx.fillStyle = '#8b949e';
    ctx.fillText('A/D : Move X', RIGHT_PANEL_X, 170);
    ctx.fillText('W   : Rotate', RIGHT_PANEL_X, 185);
    ctx.fillText('S   : Speed Up', RIGHT_PANEL_X, 200);
    ctx.fillText('SPC : Instant', RIGHT_PANEL_X, 215);

    // Print active CPU clock warning overlays
    if (overclockLevel > 0) {
        ctx.fillStyle = '#ff7b72';
        ctx.fillText(`⚡ CLOCK: V${overclockLevel}`, RIGHT_PANEL_X, 235);
    } else {
        ctx.fillStyle = '#58a6ff';
        ctx.fillText('*/', RIGHT_PANEL_X, 235);
    }
}

// Draw static baseline placeholder frame at runtime
window.onload = function () {
    // Initial render with menu overlay visible
    ctx.fillStyle = '#090c10';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the empty board to show the game area behind the menu
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(BOARD_X, BOARD_Y, BOARD_COLS * CELL_SIZE, BOARD_ROWS * CELL_SIZE);
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    for (let r = 0; r <= BOARD_ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(BOARD_X, BOARD_Y + r * CELL_SIZE);
        ctx.lineTo(BOARD_X + BOARD_COLS * CELL_SIZE, BOARD_Y + r * CELL_SIZE);
        ctx.stroke();
    }
    for (let c = 0; c <= BOARD_COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(BOARD_X + c * CELL_SIZE, BOARD_Y);
        ctx.lineTo(BOARD_X + c * CELL_SIZE, BOARD_Y + BOARD_ROWS * CELL_SIZE);
        ctx.stroke();
    }
    
    // Draw sidebar
    drawSidebarLayout();
};
