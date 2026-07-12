// ============================================================
// controllers/hero.js — Hero subtitle typewriter effect
// Depends on: $ (utils.js)
// ============================================================

function initHeroTypewriter() {
    var el = $('[data-typewriter]');
    if (!el) return;

    var text = el.textContent;
    if (!text) return;

    el.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor">|</span>';
    var textSpan = el.querySelector('.typewriter-text');
    if (!textSpan) return;

    var charIdx = 0;
    var speed = 30;

    function typeChar() {
        if (charIdx < text.length) {
            textSpan.textContent += text[charIdx];
            charIdx++;
            setTimeout(typeChar, speed);
        }
    }

    typeChar();
}
