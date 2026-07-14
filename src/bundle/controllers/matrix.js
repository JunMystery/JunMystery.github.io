// ============================================================
// controllers/matrix.js — Canvas-based Matrix rain for terminals
// ============================================================

function initMatrixRain() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var terminals = document.querySelectorAll('.terminal-window');
    terminals.forEach(function (terminal) {
        // Create canvas
        var canvas = document.createElement('canvas');
        canvas.className = 'terminal-matrix-canvas';
        
        // Style canvas via JS to ensure offline standalone works without heavy CSS edits
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.opacity = '0.04'; // Extremely subtle background effect
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';

        // Set position relative on terminal to contain the canvas
        if (window.getComputedStyle(terminal).position === 'static') {
            terminal.style.position = 'relative';
        }
        
        terminal.appendChild(canvas);

        var ctx = canvas.getContext('2d');
        var columns = [];
        var fontSize = 10;
        var active = true;

        function resizeCanvas() {
            var rect = terminal.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            var numCols = Math.floor(canvas.width / fontSize) + 1;
            columns = [];
            for (var i = 0; i < numCols; i++) {
                columns.push({
                    y: Math.random() * -100,
                    speed: 1 + Math.random() * 2
                });
            }
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        var chars = '01'; // Binary rain for AI SDLC Orchestration theme

        function draw() {
            if (!active) return;
            ctx.fillStyle = 'rgba(13, 17, 23, 0.1)'; // Matches github dark background
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#58a6ff'; // Matches --accent-primary blue
            ctx.font = fontSize + 'px monospace';

            for (var i = 0; i < columns.length; i++) {
                var char = chars.charAt(Math.floor(Math.random() * chars.length));
                var x = i * fontSize;
                var y = columns[i].y;

                ctx.fillText(char, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    columns[i].y = 0;
                } else {
                    columns[i].y += columns[i].speed * fontSize * 0.5;
                }
            }
        }

        // Run animation frame loop
        var lastTime = 0;
        var interval = 50; // 20 fps for low CPU consumption

        function tick(time) {
            if (!active) return;
            requestAnimationFrame(tick);
            if (time - lastTime >= interval) {
                draw();
                lastTime = time;
            }
        }
        requestAnimationFrame(tick);

        // Pause when terminal is not in viewport (performance optimization)
        if ('IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    active = entry.isIntersecting;
                    if (active) {
                        lastTime = performance.now();
                        tick(lastTime);
                    }
                });
            }, { threshold: 0.01 });
            obs.observe(terminal);
        }
    });
}
