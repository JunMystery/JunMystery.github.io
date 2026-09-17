// ============================================================
// controllers/reveal.js — Scroll-triggered reveal animations
// Depends on: $$, TIMING (utils.js)
// ============================================================

function initReveal() {
    var isMobile = window.matchMedia('(max-width: 768px)').matches;
    var threshold = isMobile ? 0.05 : TIMING.REVEAL_THRESHOLD;
    var rootMargin = isMobile ? '0px 0px -10px 0px' : TIMING.REVEAL_MARGIN;
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);

            if (entry.target.classList.contains('reveal-terminal')) {
                var title = entry.target.querySelector('.terminal-title');
                if (title && !title.getAttribute('data-typed')) {
                    typeCommandInTitle(title);
                }
            }
        });
    }, { threshold: threshold, rootMargin: rootMargin });

    $$('.reveal, .reveal-stagger, .reveal-hero, .reveal-terminal').forEach(function (el) {
        observer.observe(el);
    });
}

function typeCommandInTitle(title) {
    title.setAttribute('data-typed', 'true');
    var filename = title.textContent;
    var command = '$ cat ' + filename;
    var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    title.textContent = '';
    if (rm) { title.innerHTML = command; return; }
    var i = 0;
    function type() {
        if (i < command.length) {
            title.textContent += command.charAt(i);
            i++;
            setTimeout(type, 15);
        } else {
            title.innerHTML = command;
        }
    }
    setTimeout(type, 100);
}

function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                var scrollTop = window.scrollY;
                var docHeight = document.documentElement.scrollHeight - window.innerHeight;
                bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}
