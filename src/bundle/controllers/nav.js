// ============================================================
// controllers/nav.js — Navigation menu toggle & scroll effects
// Depends on: $, SELECTORS (utils.js)
// ============================================================

function initNav() {
    var toggle = $(SELECTORS.NAV_TOGGLE);
    var menu = $(SELECTORS.NAV_MENU);
    var navbar = $('.navbar');

    if (toggle && menu) {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.classList.toggle('active');
            var icon = toggle.querySelector('svg');
            if (icon) {
                setIcon(icon, menu.classList.contains('active') ? 'times' : 'bars');
            }
        });

        document.addEventListener('click', function (e) {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('active');
                var icon = toggle.querySelector('svg');
                if (icon) setIcon(icon, 'bars');
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

function initSpotlight() {
    if ('ontouchstart' in window) return;
    document.addEventListener('mousemove', function (e) {
        var x = (e.clientX / window.innerWidth) * 100;
        var y = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--cursor-x', x + '%');
        document.documentElement.style.setProperty('--cursor-y', y + '%');
    }, { passive: true });
}
