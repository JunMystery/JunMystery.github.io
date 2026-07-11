// ============================================================
// controllers/skills.js — Skills tab filtering
// Depends on: $$, SELECTORS (utils.js)
// ============================================================

function initSkillsTabs() {
    var tabs = $$(SELECTORS.TAB_BTNS);
    var groups = $$(SELECTORS.SKILL_GROUPS);

    tabs.forEach(function (btn) {
        btn.addEventListener('click', function () {
            tabs.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');
            groups.forEach(function (group) {
                var category = group.getAttribute('data-category');
                group.style.display = (filter === 'all' || category === filter) ? '' : 'none';
            });
        });
    });
}
