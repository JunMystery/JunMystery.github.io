// ============================================================
// controllers/projects.js — Project console and tab switching
// Depends on: setupTabs (utils.js)
// ============================================================

function initProjectTabs() {
    setupTabs({
        buttons: '#projects .tabs-row .tab-btn',
        panels: '#projects .project-panel',
        buttonAttr: 'data-project-tab',
        panelAttr: 'data-project-panel'
    });

    initProjectConsole();
}

function initProjectConsole() {
    setupTabs({
        buttons: '.project-nav-item',
        panels: '.project-detail-view',
        buttonAttr: 'data-project-target',
        panelAttr: 'data-project-id'
    });
}
