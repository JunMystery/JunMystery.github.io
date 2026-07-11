// ============================================================
// controllers/nav.js — Navigation menu toggle & smooth scroll
// Depends on: $, $$, SELECTORS (utils.js)
// ============================================================

function initNav() {
    var toggle = $(SELECTORS.NAV_TOGGLE);
    var menu = $(SELECTORS.NAV_MENU);
    var links = $$(SELECTORS.NAV_LINKS);

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
}
