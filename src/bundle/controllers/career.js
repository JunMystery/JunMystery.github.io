// ============================================================
// controllers/career.js — Tabbed career section with
// directional transitions and sequenced timeline reveal
// ============================================================

var CAREER_DIRECTION = {
    experience: 'left',
    education: 'right',
    certifications: 'down'
};

var CAREER_STATUS = {
    experience: { count: '4 entries', path: 'experience.sh' },
    education: { count: '2 entries', path: 'education.sh' },
    certifications: { count: '7 entries', path: 'certifications.sh' }
};

function initCareerTabs() {
    var container = document.getElementById('career');
    if (!container) return;
    var tabs = container.querySelectorAll('.tab-btn');
    var panels = container.querySelectorAll('.career-panel');
    var statusBar = document.getElementById('career-status-bar');

    if (!tabs.length || !panels.length) return;

    // Set initial direction attributes
    panels.forEach(function (p) {
        var tab = p.getAttribute('data-career-panel');
        p.setAttribute('data-direction', CAREER_DIRECTION[tab] || 'left');
    });

    function updateStatus(tab) {
        if (!statusBar) return;
        var info = CAREER_STATUS[tab];
        if (!info) return;
        var prompt = statusBar.querySelector('.status-prompt');
        var path = statusBar.querySelector('.status-path');
        var count = statusBar.querySelector('.status-count');
        if (prompt) prompt.textContent = '$';
        if (path) path.textContent = './' + info.path;
        if (count) count.textContent = info.count;
    }

    function switchTab(tabId) {
        // Update tab buttons
        tabs.forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-career-tab') === tabId);
        });

        // Update panels with directional transition
        panels.forEach(function (p) {
            var isActive = p.getAttribute('data-career-panel') === tabId;

            if (isActive) {
                p.classList.remove('active');
                p.style.display = 'none';
                void p.offsetHeight;
                p.style.display = '';
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });

        // Re-trigger reveal animations on the new panel
        var activePanel = container.querySelector('.career-panel.active');
        if (activePanel) {
            var staggers = activePanel.querySelectorAll('.reveal-stagger, .edu-grid, .cert-list');
            staggers.forEach(function (el) {
                el.classList.remove('visible');
                void el.offsetWidth;
                el.classList.add('visible');
            });
        }

        updateStatus(tabId);
    }

    tabs.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var tab = btn.getAttribute('data-career-tab');
            switchTab(tab);
        });
    });

    // Init status on page load
    var activeTab = container.querySelector('.tab-btn.active');
    if (activeTab) {
        updateStatus(activeTab.getAttribute('data-career-tab'));
    }
}
