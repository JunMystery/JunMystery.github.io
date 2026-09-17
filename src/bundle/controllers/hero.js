// ============================================================
// controllers/hero.js — Hero scroll effects
// ============================================================

function _isMobile() { return window.matchMedia('(max-width: 768px)').matches; }

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
