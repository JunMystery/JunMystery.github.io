// ============================================================
// controllers/projects.js — Project card animations
// Depends on: $$ (utils.js)
// ============================================================

function initProjectTyping() {
    var descs = $$('.project-desc');
    if (!descs.length) return;

    // Store full text on each description
    descs.forEach(function (d) {
        d.setAttribute('data-fulltext', d.textContent);
    });

    // Observe the first card in each grid for typing trigger
    var grids = $$('.projects-grid');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var card = entry.target;
            var desc = card.querySelector('.project-desc');
            if (desc && !desc.getAttribute('data-typed')) {
                typeDescription(desc);
            }
            observer.unobserve(card);
        });
    }, { threshold: 0.4 });

    grids.forEach(function (grid) {
        var first = grid.querySelector('.project-card');
        if (first) observer.observe(first);
    });
}

function typeDescription(el) {
    el.setAttribute('data-typed', 'true');
    var text = el.getAttribute('data-fulltext') || '';
    el.textContent = text;
}

function initProjectTabs() {
    var container = document.getElementById('projects');
    if (!container) return;
    var tabs = container.querySelectorAll('.tab-btn');
    var panels = container.querySelectorAll('.project-panel');
    if (!tabs.length || !panels.length) return;

    function switchTab(tabId) {
        tabs.forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-project-tab') === tabId);
        });
        panels.forEach(function (p) {
            p.classList.toggle('active', p.getAttribute('data-project-panel') === tabId);
        });
    }

    tabs.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var tab = btn.getAttribute('data-project-tab');
            switchTab(tab);
        });
    });
}
