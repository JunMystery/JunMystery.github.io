/* ─── This is fine — Canvas fire particles + interactive scene ─── */

(function () {
    'use strict';

    var canvas = document.getElementById('fireCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var sceneArea = document.getElementById('sceneArea');

    var ideWidget = document.querySelector('.ide-widget');
    var stressBtn = document.getElementById('stressBtn');
    var fixBtn = document.getElementById('fixBtn');
    var speechBubble = document.getElementById('speechBubble');
    var bubbleText = document.getElementById('bubbleText');
    var statusLabel = document.getElementById('statusLabel');
    var errorRateLabel = document.getElementById('errorRateLabel');

    var intensity = 1.0;
    var isExtinguished = false;
    var targetIntensity = 1.0;
    var excuseIndex = 0;

    var EXCUSES = [
        "// This is fine.",
        "It works on my machine.",
        "No tests = No bugs.",
        "It's just a warning, relax.",
        "Just merge it, no conflicts.",
        "That's a feature, not a bug.",
        "I'll optimize it later...",
        "It was working a minute ago."
    ];

    function resizeCanvas() {
        canvas.width = sceneArea.clientWidth;
        canvas.height = sceneArea.clientHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    var particles = [];
    var errorTexts = [
        "FATAL_ERROR", "NullPointer", "STACK_OVERFLOW", "500", "PROD_DOWN",
        "TypeError", "SyntaxError", "CRASH_DUMP", "WARN_MEMORY", "EXIT_1"
    ];

    var binaryDigits = ['0', '1'];

    function typewriter(el, text, speed, callback) {
        el.textContent = '';
        var i = 0;
        speed = speed || 30;
        function tick() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(tick, speed);
            } else if (callback) {
                callback();
            }
        }
        tick();
    }

    function createParticle() {
        if (isExtinguished) return;
        var isText = Math.random() > 0.65;
        var x = Math.random() * canvas.width;
        particles.push({
            x: x,
            y: canvas.height + 20,
            size: Math.random() * (12 * intensity) + 4,
            speedY: (Math.random() * 1.5 + 0.5) * (1 + intensity * 0.3),
            speedX: (Math.random() - 0.5) * 1.0,
            opacity: 1.0,
            isText: isText,
            text: errorTexts[Math.floor(Math.random() * errorTexts.length)],
            color: isText
                ? 'rgba(255, 123, 114, ' + (Math.random() * 0.8 + 0.2) + ')'
                : 'rgba(255, ' + Math.floor(100 + Math.random() * 66) + ', 87, ' + (Math.random() * 0.7 + 0.3) + ')',
            fadeRate: Math.random() * 0.01 + 0.005
        });
        // Binary rain particles during stress
        if (intensity > 1.5 && Math.random() < 0.4) {
            particles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + 20,
                size: Math.random() * 8 + 6,
                speedY: (Math.random() * 2 + 1) * (1 + intensity * 0.3),
                speedX: 0,
                opacity: 0.9,
                isText: true,
                text: binaryDigits[Math.floor(Math.random() * 2)],
                color: 'rgba(51, 255, 0, ' + (Math.random() * 0.6 + 0.2) + ')',
                fadeRate: Math.random() * 0.008 + 0.003
            });
        }
    }

    function updateAndRenderParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Math.abs(intensity - targetIntensity) > 0.02) {
            intensity += (targetIntensity - intensity) * 0.05;
            errorRateLabel.textContent = 'ERRORS: ' + Math.round(intensity * 100) + '%';
        }

        var spawnThreshold = 0.15 * intensity;
        if (Math.random() < spawnThreshold) {
            var count = Math.ceil(intensity);
            for (var i = 0; i < count; i++) createParticle();
        }

        for (var j = particles.length - 1; j >= 0; j--) {
            var p = particles[j];
            p.y -= p.speedY;
            p.x += p.speedX;
            p.opacity -= p.fadeRate;

            if (p.opacity <= 0 || p.y < -20) {
                particles.splice(j, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;

            if (p.isText) {
                ctx.fillStyle = p.color;
                ctx.font = 'bold ' + Math.max(6, p.size) + 'px "Fira Code","Consolas","Courier New",monospace';
                ctx.fillText(p.text, p.x, p.y);
            } else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    stressBtn.addEventListener('click', function () {
        if (isExtinguished) {
            isExtinguished = false;
            intensity = 0.2;
        }
        targetIntensity = 3.0;
        statusLabel.textContent = 'STATUS: STRESS_OVERFLOW_FATAL';
        statusLabel.style.color = 'var(--fine-keyword)';
        typewriter(bubbleText, "Wait, i'm debugging");

        sceneArea.style.animation = 'none';
        setTimeout(function () {
            sceneArea.style.animation = 'fine-float-pulse 0.2s ease-in-out 4';
        }, 10);

        ideWidget.classList.remove('glitch');
        void ideWidget.offsetWidth; // reflow
        ideWidget.classList.add('glitch');
        ideWidget.classList.add('stressed');
    });

    fixBtn.addEventListener('click', function () {
        isExtinguished = true;
        targetIntensity = 0.0;
        statusLabel.textContent = 'STATUS: PATCHING_PRODUCTION...';
        statusLabel.style.color = '#27c93f';
        typewriter(bubbleText, 'Cho ti, em hotfix lien...');

        ideWidget.classList.remove('stressed');

        for (var i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: -10,
                size: Math.random() * 4 + 2,
                speedY: Math.random() * 3 + 2,
                speedX: (Math.random() - 0.5) * 1.5,
                opacity: 1.0,
                isText: Math.random() > 0.5,
                text: Math.random() > 0.5 ? '0' : '1',
                color: 'rgba(88, 166, 255, 0.8)',
                fadeRate: 0.015
            });
        }

        setTimeout(function () {
            isExtinguished = false;
            targetIntensity = 1.0;
            statusLabel.textContent = 'STATUS: PROD_ON_FIRE';
            statusLabel.style.color = '';
            typewriter(bubbleText, EXCUSES[excuseIndex]);
        }, 4500);
    });

    speechBubble.addEventListener('click', function () {
        excuseIndex = (excuseIndex + 1) % EXCUSES.length;
        typewriter(bubbleText, EXCUSES[excuseIndex]);
    });

    function mainLoop() {
        updateAndRenderParticles();
        requestAnimationFrame(mainLoop);
    }

    requestAnimationFrame(mainLoop);
})();
