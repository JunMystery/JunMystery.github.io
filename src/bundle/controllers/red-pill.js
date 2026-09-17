// ============================================================
// controllers/red-pill.js — Red Pill / Blue Pill easter egg
// Trigger: click any terminal-dots 3× within 3 seconds
// Reveals floating pill widget → Red pill toggles Matrix rain
// ============================================================

var _rpClickCount = 0;
var _rpClickTimer = null;
var _rpWidget = null;
var _rpRainActive = false;
var _rpRainCtrl = null;
var _rpAchieved = false;

function initRedPill() {
    // Listen for 3 rapid clicks on terminal-dots
    document.body.addEventListener('click', function (e) {
        var dots = e.target.closest('.terminal-dots');
        if (!dots) return;
        _rpClickCount++;
        if (_rpClickTimer) clearTimeout(_rpClickTimer);
        _rpClickTimer = setTimeout(function () { _rpClickCount = 0; }, 3000);
        if (_rpClickCount >= 3) {
            _rpClickCount = 0;
            clearTimeout(_rpClickTimer);
            showPillWidget();
        }
    });
}

function showPillWidget() {
    if (_rpWidget) return;

    // Backdrop (click to dismiss)
    var backdrop = document.createElement('div');
    backdrop.style.cssText = [
        'position:fixed', 'inset:0',
        'z-index:99998',
        'background:rgba(0,0,0,0.3)',
        'opacity:0',
        'transition:opacity 0.25s ease',
    ].join(';') + ';';

    // Widget container — floating terminal frame
    var widget = document.createElement('div');
    widget.style.cssText = [
        'position:fixed',
        'bottom:40px',
        'left:50%',
        'transform:translateX(-50%) translateY(30px)',
        'z-index:99999',
        'background:var(--bg-secondary)',
        'border:1px solid var(--border-color)',
        'border-radius:var(--border-radius-lg)',
        'padding:18px 24px',
        'box-shadow:0 8px 32px rgba(0,0,0,0.5)',
        'opacity:0',
        'transition:opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        'font-family:var(--font-mono)',
        'text-align:center',
        'min-width:220px',
    ].join(';') + ';';

    // Prompt line
    var prompt = document.createElement('div');
    prompt.style.cssText = 'color:var(--text-muted);font-size:0.7rem;margin-bottom:12px;letter-spacing:0.08em;';
    prompt.textContent = '> choose __';

    // Pill buttons row
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:12px;justify-content:center;';

    // Red pill
    var red = document.createElement('button');
    red.textContent = 'Red Pill';
    red.style.cssText = [
        'font-family:var(--font-mono)',
        'font-size:0.75rem',
        'font-weight:600',
        'padding:6px 18px',
        'border:none',
        'border-radius:999px',
        'background:#e74c3c',
        'color:#fff',
        'cursor:pointer',
        'transition:transform 0.15s ease, box-shadow 0.15s ease',
        'box-shadow:0 2px 8px rgba(231,76,60,0.3)',
    ].join(';') + ';';
    red.addEventListener('mouseenter', function () {
        red.style.transform = 'scale(1.08)';
        red.style.boxShadow = '0 4px 16px rgba(231,76,60,0.5)';
    });
    red.addEventListener('mouseleave', function () {
        red.style.transform = '';
        red.style.boxShadow = '0 2px 8px rgba(231,76,60,0.3)';
    });
    red.addEventListener('click', function () { handlePill('red'); });

    // Blue pill
    var blue = document.createElement('button');
    blue.textContent = 'Blue Pill';
    blue.style.cssText = [
        'font-family:var(--font-mono)',
        'font-size:0.75rem',
        'font-weight:600',
        'padding:6px 18px',
        'border:none',
        'border-radius:999px',
        'background:#3498db',
        'color:#fff',
        'cursor:pointer',
        'transition:transform 0.15s ease, box-shadow 0.15s ease',
        'box-shadow:0 2px 8px rgba(52,152,219,0.3)',
    ].join(';') + ';';
    blue.addEventListener('mouseenter', function () {
        blue.style.transform = 'scale(1.08)';
        blue.style.boxShadow = '0 4px 16px rgba(52,152,219,0.5)';
    });
    blue.addEventListener('mouseleave', function () {
        blue.style.transform = '';
        blue.style.boxShadow = '0 2px 8px rgba(52,152,219,0.3)';
    });
    blue.addEventListener('click', function () { handlePill('blue'); });

    row.appendChild(red);
    row.appendChild(blue);
    widget.appendChild(prompt);
    widget.appendChild(row);
    document.body.appendChild(backdrop);
    document.body.appendChild(widget);

    _rpWidget = { widget: widget, backdrop: backdrop };

    // Animate in
    requestAnimationFrame(function () {
        backdrop.style.opacity = '1';
        widget.style.opacity = '1';
        widget.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Click backdrop to dismiss
    backdrop.addEventListener('click', function () { dismissPillWidget(); });
}

var _rpRainTimer = null;

function handlePill(color) {
    if (color === 'red') {
        if (_rpRainActive) return;
        startMatrixRain();
        if (!_rpAchieved && typeof _achieve === 'function') {
            _rpAchieved = true;
            _achieve('matrix');
        }
        dismissPillWidget();
    } else if (color === 'blue') {
        if (_rpRainActive) {
            stopMatrixRain();
        } else {
            console.log('%c 💊 Blue pill taken. Ignorance is bliss.', 'color: #3498db');
            showPillToast('nothing happens');
        }
        dismissPillWidget();
    }
}

// --- Matrix Rain Overlay (auto-dismiss after 5s) ---

function startMatrixRain() {
    if (_rpRainActive) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var canvas = document.createElement('canvas');
    canvas.className = 'pill-rain-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = [
        'position:fixed', 'top:0', 'left:0',
        'width:100%', 'height:100%',
        'z-index:99997',
        'pointer-events:none',
        'opacity:0',
        'transition:opacity 0.4s ease',
    ].join(';') + ';';

    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var cols = Math.floor(canvas.width / 14);
    var drops = [];
    for (var i = 0; i < cols; i++) drops[i] = 1;
    var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    var running = true;
    var rafId = null;

    function draw() {
        if (!running) return;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f0';
        ctx.font = '14px monospace';

        for (var i = 0; i < drops.length; i++) {
            var ch = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(ch, i * 14, drops[i] * 14);
            if (drops[i] * 14 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        rafId = requestAnimationFrame(draw);
    }

    // Fade in then start
    requestAnimationFrame(function () { canvas.style.opacity = '0.85'; });
    setTimeout(function () {
        rafId = requestAnimationFrame(draw);
    }, 400);

    _rpRainCtrl = {
        stop: function () {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
        },
        canvas: canvas
    };
    _rpRainActive = true;

    // Auto-dismiss after 5 seconds
    _rpRainTimer = setTimeout(function () {
        stopMatrixRain();
    }, 5000);
}

function stopMatrixRain() {
    if (!_rpRainActive || !_rpRainCtrl) return;
    if (_rpRainTimer) { clearTimeout(_rpRainTimer); _rpRainTimer = null; }
    _rpRainCtrl.stop();
    var canvas = _rpRainCtrl.canvas;
    if (canvas) {
        canvas.style.opacity = '0';
        setTimeout(function () {
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }, 400);
    }
    _rpRainCtrl = null;
    _rpRainActive = false;
}

// --- Widget Dismissal ---

function dismissPillWidget() {
    if (!_rpWidget) return;
    var widget = _rpWidget.widget;
    var backdrop = _rpWidget.backdrop;

    widget.style.opacity = '0';
    widget.style.transform = 'translateX(-50%) translateY(30px)';
    backdrop.style.opacity = '0';

    setTimeout(function () {
        if (widget.parentNode) widget.parentNode.removeChild(widget);
        if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
        _rpWidget = null;
    }, 300);
}

// --- Toast notification ---

function showPillToast(msg) {
    var toast = document.createElement('div');
    toast.style.cssText = [
        'position:fixed', 'bottom:100px', 'left:50%',
        'transform:translateX(-50%)',
        'z-index:100000',
        'background:var(--bg-secondary)',
        'border:1px solid var(--border-color)',
        'border-radius:var(--border-radius-sm)',
        'padding:6px 16px',
        'font:12px/1.6 var(--font-mono)',
        'color:var(--text-muted)',
        'opacity:0',
        'transition:opacity 0.2s ease',
        'pointer-events:none',
    ].join(';') + ';';
    toast.textContent = '> ' + msg;

    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.style.opacity = '1'; });

    setTimeout(function () {
        toast.style.opacity = '0';
        setTimeout(function () {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 200);
    }, 1500);
}
