var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var scoreEl = document.getElementById('score');
var highScoreEl = document.getElementById('highScore');
var menuOverlay = document.getElementById('menuOverlay');
var gameOverOverlay = document.getElementById('gameOverOverlay');
var finalMetrics = document.getElementById('finalMetrics');
var settingsBtn = document.getElementById('settingsBtn');
var settingsOverlay = document.getElementById('settingsOverlay');
var settingsClose = document.getElementById('settingsClose');
var speedSlider = document.getElementById('speedSlider');
var speedValue = document.getElementById('speedValue');
var gridOpts = document.querySelectorAll('.grid-opts button');

var GRID_SIZE = 20;
var TILE_COUNT = canvas.width / GRID_SIZE;
var TARGET_FPS = 10;
var snake = [];
var food = { x: 0, y: 0 };
var particles = [];
var dx = GRID_SIZE;
var dy = 0;
var nextDx = GRID_SIZE;
var nextDy = 0;
var score = 0;
var highScore = 0;
var gameRunning = false;
var lastUpdateTime = 0;

window.addEventListener('keydown', handleKeyDown);

document.querySelectorAll('.dpad-btn').forEach(function (btn) {
    btn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        var dir = btn.getAttribute('data-dir');
        if (dir) setDirection(dir);
    });
});

document.querySelectorAll('.action-btn').forEach(function (btn) {
    btn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        toggleGame();
    });
});

canvas.addEventListener('pointerdown', function (e) {
    if (!gameRunning) toggleGame();
});
menuOverlay.addEventListener('pointerdown', function (e) {
    if (!gameRunning) toggleGame();
});
gameOverOverlay.addEventListener('pointerdown', function (e) {
    if (!gameRunning) toggleGame();
});

settingsBtn.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    settingsOverlay.style.display = 'flex';
});

settingsClose.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    TARGET_FPS = parseInt(speedSlider.value, 10);
    settingsOverlay.style.display = 'none';
});

speedSlider.addEventListener('input', function () {
    speedValue.textContent = this.value;
    TARGET_FPS = parseInt(this.value, 10);
});

gridOpts.forEach(function (btn) {
    btn.addEventListener('click', function () {
        gridOpts.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
    });
});

function applySettings() {
    TARGET_FPS = parseInt(speedSlider.value, 10);
    var newGrid = parseInt(document.querySelector('.grid-opts .active').getAttribute('data-grid'), 10);
    if (newGrid !== GRID_SIZE) {
        GRID_SIZE = newGrid;
        TILE_COUNT = Math.floor(canvas.width / GRID_SIZE);
        if (!gameRunning) {
            resetGame();
        }
    }
}

function resetGame() {
    snake = [
        { x: GRID_SIZE * 5, y: GRID_SIZE * 10 },
        { x: GRID_SIZE * 4, y: GRID_SIZE * 10 },
        { x: GRID_SIZE * 3, y: GRID_SIZE * 10 }
    ];
    dx = GRID_SIZE;
    dy = 0;
    nextDx = GRID_SIZE;
    nextDy = 0;
    score = 0;
    scoreEl.textContent = '0';
    particles = [];
    spawnFood();
}

function spawnFood() {
    var onSnake;
    do {
        onSnake = false;
        food.x = Math.floor(Math.random() * TILE_COUNT) * GRID_SIZE;
        food.y = Math.floor(Math.random() * TILE_COUNT) * GRID_SIZE;
        for (var i = 0; i < snake.length; i++) {
            if (snake[i].x === food.x && snake[i].y === food.y) {
                onSnake = true;
                break;
            }
        }
    } while (onSnake);
}

function handleKeyDown(e) {
    if (settingsOverlay.style.display !== 'none' && settingsOverlay.style.display !== '') {
        return;
    }

    var key = e.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].indexOf(key) !== -1) {
        e.preventDefault();
    }

    if (!gameRunning) {
        if (key === 'Enter' || key === ' ') {
            toggleGame();
        }
        return;
    }

    if (key === 'ArrowUp' || key === 'w' || key === 'W') setDirection('up');
    else if (key === 'ArrowDown' || key === 's' || key === 'S') setDirection('down');
    else if (key === 'ArrowLeft' || key === 'a' || key === 'A') setDirection('left');
    else if (key === 'ArrowRight' || key === 'd' || key === 'D') setDirection('right');
}

function setDirection(dir) {
    if (!gameRunning) return;
    if (dir === 'up' && dy === 0) { nextDx = 0; nextDy = -GRID_SIZE; }
    else if (dir === 'down' && dy === 0) { nextDx = 0; nextDy = GRID_SIZE; }
    else if (dir === 'left' && dx === 0) { nextDx = -GRID_SIZE; nextDy = 0; }
    else if (dir === 'right' && dx === 0) { nextDx = GRID_SIZE; nextDy = 0; }
}

function toggleGame() {
    if (!gameRunning) {
        applySettings();
        menuOverlay.style.display = 'none';
        gameOverOverlay.style.display = 'none';
        resetGame();
        gameRunning = true;
        lastUpdateTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
}

function spawnParticles(x, y) {
    var symbols = ['0', '1', '<', '>', ';', '{', '}'];
    var cx = x + GRID_SIZE / 2;
    var cy = y + GRID_SIZE / 2;
    for (var i = 0; i < 28; i++) {
        var angle = Math.random() * Math.PI * 2;
        var speed = 1.5 + Math.random() * 5;
        particles.push({
            x: cx, y: cy,
            char: symbols[Math.floor(Math.random() * symbols.length)],
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1.0,
            color: Math.random() > 0.5 ? '#7ee787' : '#58a6ff'
        });
    }
}

function gameLoop(timestamp) {
    if (!gameRunning) return;
    requestAnimationFrame(gameLoop);

    var elapsed = timestamp - lastUpdateTime;
    var step = 1000 / TARGET_FPS;

    updateParticles();

    if (elapsed >= step) {
        lastUpdateTime = timestamp - (elapsed % step);
        dx = nextDx;
        dy = nextDy;
        moveSnake();
        checkCollisions();
    }

    render();
}

function moveSnake() {
    var head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = String(score);
        if (score > highScore) {
            highScore = score;
            highScoreEl.textContent = String(highScore);
        }
        spawnParticles(food.x, food.y);
        spawnFood();
    } else {
        snake.pop();
    }
}

function checkCollisions() {
    var head = snake[0];

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        endGame('ARRAY_INDEX_OUT_OF_BOUNDS: Memory perimeter leakage exception.');
    }

    for (var i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame('CIRCULAR_DEPENDENCY: Self-referencing loop detected.');
            break;
        }
    }
}

function updateParticles() {
    for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.018;
        if (p.alpha <= 0) particles.splice(i, 1);
    }
}

function endGame(reason) {
    gameRunning = false;
    finalMetrics.innerHTML = '<span style="color:var(--accent-orange)">Exception:</span> ' + reason + '<br><br><span style="color:var(--accent-orange)">Final Lines:</span> ' + score;
    gameOverOverlay.style.display = 'flex';
}

function render() {
    ctx.fillStyle = '#090c10';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < canvas.width; i += GRID_SIZE) {
        ctx.strokeStyle = '#161b22';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    ctx.fillStyle = '#ff7b72';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff7b72';
    ctx.font = 'bold 12px var(--font-stack)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('</>', food.x + GRID_SIZE / 2, food.y + GRID_SIZE / 2);

    for (var i = 0; i < snake.length; i++) {
        var seg = snake[i];
        var isHead = i === 0;
        ctx.fillStyle = isHead ? '#7ee787' : '#2ea043';
        ctx.shadowBlur = isHead ? 10 : 0;
        ctx.shadowColor = '#7ee787';

        if (isHead) {
            ctx.fillRect(seg.x + 1, seg.y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
            ctx.fillStyle = '#0d1117';
            ctx.font = 'bold 10px var(--font-stack)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('{}', seg.x + GRID_SIZE / 2, seg.y + GRID_SIZE / 2);
        } else {
            ctx.fillRect(seg.x + 2, seg.y + 2, GRID_SIZE - 4, GRID_SIZE - 4);
        }
    }

    ctx.shadowBlur = 0;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.font = '10px var(--font-stack)';
        ctx.fillText(p.char, p.x, p.y);
    }
    ctx.globalAlpha = 1.0;
}
