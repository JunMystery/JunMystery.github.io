// ============================================================
// controllers/career.js — Career section tab switching
// Depends on: $$ (utils.js)
// ============================================================

function initCareerTabs() {
    var tabs = $$('.career-tab-btn');
    var panels = $$('.career-panel');

    if (!tabs.length || !panels.length) return;

    tabs.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var tab = btn.getAttribute('data-career-tab');

            tabs.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            panels.forEach(function (p) {
                p.classList.toggle('active', p.getAttribute('data-career-panel') === tab);
            });
        });
    });
}
