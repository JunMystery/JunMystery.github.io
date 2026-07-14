// ============================================================
// controllers/hero.js — Hero typewriter + glitch effects
// Depends on: $ (utils.js)
// ============================================================

var _heroTyped = sessionStorage.getItem('hero_typed');
function _isMobile() { return window.matchMedia('(max-width: 768px)').matches; }

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

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || _isMobile()) {
        textSpan.textContent = text;
        sessionStorage.setItem('hero_typed', '1');
        triggerHeroGlitch();
        typeTagline();
        return;
    }

    var charIdx = 0;

    function typeChar() {
        if (charIdx < text.length) {
            textSpan.textContent += text[charIdx];
            charIdx++;
            setTimeout(typeChar, 20);
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

function initScrollEffects() {
    var hero = document.querySelector('.hero');
    var content = document.querySelector('.hero-content');
    if (!hero || !content) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || _isMobile()) return;

    var ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function () {
                var rect = hero.getBoundingClientRect();
                var vh = window.innerHeight;
                // progress: 0 = hero fully visible, 1 = hero scrolled past viewport
                var progress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.4)));

                content.style.opacity = (1 - progress * 0.15).toFixed(3);
                content.style.transform = 'scale(' + (1 - progress * 0.015).toFixed(4) + ')';
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
}

function typeTagline() {
    var tagline = $('.hero-tagline');
    if (!tagline) return;
    var text = tagline.textContent;
    if (!text) return;

    var stored = sessionStorage.getItem('tagline_typed');
    if (stored) return;

    tagline.textContent = '';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || _isMobile()) {
        tagline.textContent = text;
        sessionStorage.setItem('tagline_typed', '1');
        return;
    }

    var charIdx = 0;

    function typeChar() {
        if (charIdx < text.length) {
            tagline.textContent += text[charIdx];
            charIdx++;
            setTimeout(typeChar, 12);
        } else {
            sessionStorage.setItem('tagline_typed', '1');
        }
    }

    typeChar();
}
