// ============================================================
// controllers/hero.js — Hero typewriter + glitch effects
// Depends on: $ (utils.js)
// ============================================================

var _heroTyped = sessionStorage.getItem('hero_typed');

function initHeroTypewriter() {
    var el = $('[data-typewriter]');
    if (!el) return;

    var text = el.textContent;
    if (!text) return;

    if (_heroTyped) {
        // Restore full text if already typed this session
        el.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor">|</span>';
        var textSpan = el.querySelector('.typewriter-text');
        if (textSpan) textSpan.textContent = text;
        typeTagline();
        return;
    }

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
        } else {
            sessionStorage.setItem('hero_typed', '1');
            triggerHeroGlitch();
            typeTagline();
        }
    }

    typeChar();
}

function triggerHeroGlitch() {
    var title = $('.hero-title');
    if (!title) return;
    title.classList.remove('glitch');
    void title.offsetWidth;
    title.classList.add('glitch');
}

function typeTagline() {
    var tagline = $('.hero-tagline');
    if (!tagline) return;
    var text = tagline.textContent;
    if (!text) return;

    var stored = sessionStorage.getItem('tagline_typed');
    if (stored) return;

    tagline.textContent = '';
    var charIdx = 0;
    var speed = 18;

    function typeChar() {
        if (charIdx < text.length) {
            tagline.textContent += text[charIdx];
            charIdx++;
            setTimeout(typeChar, speed);
        } else {
            sessionStorage.setItem('tagline_typed', '1');
        }
    }

    typeChar();
}
