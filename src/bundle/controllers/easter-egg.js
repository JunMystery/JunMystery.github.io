// ============================================================
// controllers/easter-egg.js — Console greeting + reboot glitch
// Self-contained (no external deps)
// ============================================================

function initEasterEgg() {
    // --- Console greeting ---
    var greeting = [
        '',
        '  __  __           _     _               _  ',
        ' |  \\/  |_   _  ___(_)___| |_ _ __ __ _ | |___',
        ' | |\\/| | | | |/ __| / __| __| \'__/ _` || / __|',
        ' | |  | | |_| |\\__ \\ \\__ \\ |_| | | (_| || \\__ \\',
        ' |_|  |_|\\__, |___/_|___/\\__|_|  \\__,_|/ |___/',
        '         |___/  v1.0              |__/ ',
        '',
        ' > try window._easter_egg() to unlock a surprise.',
        ''
    ].join('\n');
    console.log(greeting);

    // --- Expose easter egg ---
    window._easter_egg = triggerRebootGlitch;
}

var _eggActive = false;

function triggerRebootGlitch() {
    if (_eggActive) return;
    _eggActive = true;
    if (typeof _achieve === 'function') _achieve('glitch');
    var T0 = Date.now();

    // Phase 1: Screen glitch — long and dramatic (2500ms)
    document.body.classList.add('glitching');
    // Pulse intensity mid-glitch — skip setTimeout if reduced motion
    var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var t = rm ? function (fn) { fn(); return 0; } : setTimeout;
    t(function () { document.body.style.filter = 'brightness(1.6) hue-rotate(180deg)'; }, rm ? 0 : 400);
    t(function () { document.body.style.filter = ''; }, rm ? 0 : 700);
    t(function () { document.body.style.filter = 'brightness(0.3) hue-rotate(90deg)'; }, rm ? 0 : 900);
    t(function () { document.body.style.filter = ''; }, rm ? 0 : 1100);

    // Console boot sequence — slower, more dramatic
    console.log('');
    console.log('%c ⚡ INITIALIZING REBOOT SEQUENCE...', 'color: #0f0; font-weight: bold; font-size: 14px');
    var bootMsgs = [
        '> [██████░░░░░░░░░░░░]  27%  — scanning node_modules...',
        '> [██████████░░░░░░░░]  45%  — recompiling skills module...',
        '> [██████████████░░░░]  67%  — optimizing career trajectory...',
        '> [████████████████░░]  85%  — rebuilding bundle...',
        '> [██████████████████] 100%  — done.',
        '> System ready. Have a nice day.'
    ];
    bootMsgs.forEach(function (msg, i) {
        t(function () {
            console.log('%c ' + msg, 'color: #0f0');
        }, rm ? 0 : 100 + i * 250);
    });

    // Phase 2: Matrix rain overlay (starts at 2500ms, lasts 3000ms)
    if (rm) return _eggActive = false;
    var rainTimeout = setTimeout(function () {
        var canvas = createRainCanvas();
        document.body.appendChild(canvas);
        var rainProps = startRain(canvas);

        // Mid-rain wave effect (shift to cyan at 1500ms)
        setTimeout(function () {
            rainProps.setColor('#0ff');
        }, 1500);

        // Phase 3: Boot messages typed onto canvas, then recovery
        setTimeout(function () {
            rainProps.stop();

            // Type final messages onto the canvas
            var bootLines = [
                '> ALL SYSTEMS NOMINAL.',
                '> MEMORY: 0xDEADBEEF bytes free.',
                '> PORTFOLIO KERNEL v1.0 ready.',
                '> Press any key to continue...'
            ];
            var lineY = canvas.height / 2 - 40;
            var lineIdx = 0;
            function typeNextLine() {
                if (lineIdx >= bootLines.length) {
                    // Fade out
                    canvas.classList.add('rain-fadeout');
                    setTimeout(function () {
                        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
                        document.body.classList.remove('glitching');
                        document.body.classList.add('rebooted');
                        setTimeout(function () {
                            document.body.classList.remove('rebooted');
                            _eggActive = false;
                        }, 700);
                    }, 600);
                    return;
                }
                var line = bootLines[lineIdx];
                var ctx = canvas.getContext('2d');
                var col = 0;
                function typeChar() {
                    if (col >= line.length) {
                        lineIdx++;
                        lineY += 30;
                        setTimeout(typeNextLine, 200);
                        return;
                    }
                    ctx.fillStyle = '#0f0';
                    ctx.font = '16px monospace';
                    ctx.fillText(line[col], 60 + col * 10, lineY);
                    col++;
                    setTimeout(typeChar, 20 + Math.random() * 15);
                }
                typeChar();
            }
            typeNextLine();
        }, 3000);
    }, 2500);

    // Safety: force cleanup after 12s no matter what
    setTimeout(function () {
        if (_eggActive) {
            var canvases = document.querySelectorAll('.rain-canvas');
            canvases.forEach(function (c) { if (c.parentNode) c.parentNode.removeChild(c); });
            document.body.classList.remove('glitching', 'rebooted');
            document.body.style.filter = '';
            _eggActive = false;
        }
    }, 12000);
}

// --- Matrix rain ---
function createRainCanvas() {
    var canvas = document.createElement('canvas');
    canvas.className = 'rain-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;pointer-events:none;opacity:0;transition:opacity 0.3s;';
    // Fade in on next frame
    requestAnimationFrame(function () { canvas.style.opacity = '0.85'; });
    return canvas;
}

function startRain(canvas) {
    var ctx = canvas.getContext('2d');
    var cols = Math.floor(canvas.width / 14);
    var drops = [];
    for (var i = 0; i < cols; i++) drops[i] = 1;

    var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    var currentColor = '#0f0';
    var running = true;

    function draw() {
        if (!running) return;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = currentColor;
        ctx.font = '14px monospace';

        for (var i = 0; i < drops.length; i++) {
            var char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * 14, drops[i] * 14);
            if (drops[i] * 14 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        _rainRaf = requestAnimationFrame(draw);
    }

    var _rainRaf = requestAnimationFrame(draw);

    return {
        stop: function () { running = false; if (_rainRaf) cancelAnimationFrame(_rainRaf); },
        setColor: function (c) { currentColor = c; }
    };
}
