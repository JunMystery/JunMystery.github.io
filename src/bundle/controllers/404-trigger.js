// ============================================================
// controllers/404-trigger.js — Navigation triggers to 404 runner game
// No external deps
// ============================================================

function init404Trigger() {
    var gameUrl = 'game/404-runner-game.html';

    // === Trigger 1: URL param ?game=404 ===
    if (location.search.indexOf('game=404') !== -1) {
        location.href = gameUrl;
        return;
    }

    // === Trigger 2: Hash fragment #404 ===
    if (location.hash === '#404') {
        location.href = gameUrl;
        return;
    }

    // === Trigger 3: "exit" key sequence ===
    var exitSeq = ['e', 'x', 'i', 't'];
    var exitIdx = 0;
    document.addEventListener('keydown', function (e) {
        if (e.key === exitSeq[exitIdx]) {
            exitIdx++;
            if (exitIdx === exitSeq.length) {
                exitIdx = 0;
                go404();
            }
        } else {
            exitIdx = 0;
        }
    });

    // === Trigger 4: Idle 30s → floating [404?] prompt ===
    var idleTimer = null;
    var idlePrompt = null;
    var idleTimeout = 30000;

    function resetIdle() {
        if (idlePrompt) {
            if (idlePrompt.parentNode) idlePrompt.parentNode.removeChild(idlePrompt);
            idlePrompt = null;
        }
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(showIdlePrompt, idleTimeout);
    }

    function showIdlePrompt() {
        if (idlePrompt) return;
        idlePrompt = document.createElement('a');
        idlePrompt.href = '#';
        idlePrompt.textContent = '[404?]';
        idlePrompt.style.cssText = [
            'position:fixed',
            'bottom:20px',
            'right:20px',
            'z-index:9999',
            'font-family:"Fira Code","Cascadia Code","JetBrains Mono",monospace',
            'font-size:11px',
            'color:rgba(139,148,158,0.4)',
            'text-decoration:none',
            'cursor:pointer',
            'transition:color 0.3s',
            'opacity:0',
        ].join(';') + ';';

        idlePrompt.addEventListener('mouseenter', function () {
            idlePrompt.style.color = 'rgba(139,148,158,1)';
        });
        idlePrompt.addEventListener('mouseleave', function () {
            idlePrompt.style.color = 'rgba(139,148,158,0.4)';
        });
        idlePrompt.addEventListener('click', function (e) {
            e.preventDefault();
            go404();
        });
        // Make visible on next frame for fade transition
        document.body.appendChild(idlePrompt);
        requestAnimationFrame(function () {
            idlePrompt.style.transition = 'opacity 0.8s';
            idlePrompt.style.opacity = '1';
        });
    }

    // Activity resets the idle timer
    document.addEventListener('mousemove', resetIdle);
    document.addEventListener('keydown', resetIdle);
    document.addEventListener('touchstart', resetIdle);
    document.addEventListener('scroll', resetIdle);

    // Start idle timer
    resetIdle();

    // === Trigger 5: Console function ===
    window._404 = go404;

    // === Trigger 6: Click/tap .trigger-404 elements (footer token + hero badge) ===
    document.body.addEventListener('click', function (e) {
        var target = e.target.closest('.trigger-404');
        if (target) {
            e.preventDefault();
            go404();
        }
    });
}

function go404() {
    if (typeof _achieve === 'function') _achieve('game_404');
    window.location.href = 'game/404-runner-game.html';
}
