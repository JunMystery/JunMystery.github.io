// ============================================================
// controllers/nav.js — Navigation menu toggle & smooth scroll
// Depends on: $, $$, SELECTORS (utils.js)
// ============================================================

function initNav() {
    var toggle = $(SELECTORS.NAV_TOGGLE);
    var menu = $(SELECTORS.NAV_MENU);
    var links = $$(SELECTORS.NAV_LINKS);
    var navbar = $('.navbar');

    if (toggle && menu) {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.classList.toggle('active');
            var icon = toggle.querySelector('i');
            if (icon) {
                icon.className = menu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        links.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                menu.classList.remove('active');
                var icon = toggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';

                var targetId = link.getAttribute('href');
                if (targetId && targetId.indexOf('#') === 0) {
                    var targetEl = document.querySelector(targetId);
                    if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        document.addEventListener('click', function (e) {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('active');
                var icon = toggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    }

    /* Backdrop blur on scroll */
    if (navbar) {
        window.addEventListener('scroll', function () {
            navbar.classList.toggle('scrolled', window.scrollY > 0);
        }, { passive: true });
    }
}

function initActiveSection() {
    var links = $$(SELECTORS.NAV_LINKS);
    var sections = [];
    links.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href && href.indexOf('#') === 0) {
            var el = document.querySelector(href);
            if (el) sections.push(el);
        }
    });
    if (!sections.length) return;

    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = entry.target.getAttribute('id');
            links.forEach(function (l) {
                l.classList.toggle('active', l.getAttribute('href') === '#' + id);
            });
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

    sections.forEach(function (s) { obs.observe(s); });
}

function initSpotlight() {
    document.addEventListener('mousemove', function (e) {
        var x = (e.clientX / window.innerWidth) * 100;
        var y = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--cursor-x', x + '%');
        document.documentElement.style.setProperty('--cursor-y', y + '%');
    }, { passive: true });
}
