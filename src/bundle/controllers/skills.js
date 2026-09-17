// ============================================================
// controllers/skills.js — Skills tab filtering
// Depends on: setupTabs, SELECTORS (utils.js)
// ============================================================

function initSkillsTabs() {
    setupTabs({
        buttons: SELECTORS.TAB_BTNS,
        panels: SELECTORS.SKILL_GROUPS,
        buttonAttr: 'data-filter',
        panelAttr: 'data-category',
        filterMode: true
    });
}
