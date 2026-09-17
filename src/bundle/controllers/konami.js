// ============================================================
// controllers/konami.js — Konami code + triple-tap toggle CRT mode
// No external deps
// ============================================================

var _crtActive = false;

var _crtAchieved = false;

function _toggleCrt() {
    _crtActive = !_crtActive;
    document.documentElement.classList.toggle('crt-mode', _crtActive);
    console.log('%c 🕹️ CRT mode ' + (_crtActive ? 'ACTIVATED' : 'DEACTIVATED'), 'color: #0f0; font-weight: bold');
    if (_crtActive && !_crtAchieved) {
        _crtAchieved = true;
        if (typeof _achieve === 'function') _achieve('crt');
    }
    if (_crtActive && window._easter_egg) {
        console.log('%c Tip: try window._easter_egg() for another surprise', 'color: #8b949e');
    }
}

function initKonami() {
    // --- Desktop: Konami code (↑↑↓↓←→←→) ---
    var konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight'];
    var idx = 0;

    document.addEventListener('keydown', function (e) {
        if (e.key === konamiCode[idx]) {
            idx++;
            if (idx === konamiCode.length) {
                idx = 0;
                _toggleCrt();
            }
        } else {
            idx = 0;
        }
    });

    // --- Mobile: Triple-tap hero title toggles CRT ---
    var title = document.querySelector('.hero-title');
    if (title) {
        var tapCount = 0;
        var tapTimer = null;
        title.addEventListener('click', function (e) {
            tapCount++;
            if (tapCount === 1) {
                tapTimer = setTimeout(function () { tapCount = 0; }, 1000);
            }
            if (tapCount >= 3) {
                tapCount = 0;
                if (tapTimer) clearTimeout(tapTimer);
                _toggleCrt();
            }
        });
    }
}
