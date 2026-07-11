// ============================================================
// controllers/reveal.js — Scroll-triggered reveal animations
// Depends on: $$, TIMING (utils.js)
// ============================================================

function initReveal() {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: TIMING.REVEAL_THRESHOLD, rootMargin: TIMING.REVEAL_MARGIN });

    $$('.reveal, .reveal-stagger, .reveal-hero').forEach(function (el) {
        observer.observe(el);
    });
}
