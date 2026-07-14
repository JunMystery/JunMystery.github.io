// ============================================================
// controllers/achievements.js — Achievements dialog + tracking
// Tracks discovered easter eggs & game pages.
// Exposes window._achieve(id) for other controllers to call.
// No external deps
// ============================================================

var ACHIEVEMENTS = [
    { id: 'game_404', name: '404 Runner',      desc: 'Reach the 404 runner game',  icon: 'fa-running' },
    { id: 'snake',    name: 'Snake',            desc: 'Play the snake game',        icon: 'fa-gamepad' },
    { id: 'tetris',   name: 'Tetris',           desc: 'Play tetris',                icon: 'fa-gamepad' },
    { id: 'pacman',   name: 'Pac-Man',          desc: 'Play pac-man',               icon: 'fa-gamepad' },
    { id: 'flappy',   name: 'Flappy Bird',      desc: 'Play flappy bird',           icon: 'fa-gamepad' },
    { id: 'glitch',   name: 'Reboot Initiated', desc: 'Trigger the reboot glitch',  icon: 'fa-bolt' },
    { id: 'crt',      name: 'CRT Mode',         desc: 'Activate retro CRT mode',    icon: 'fa-tv' },
    { id: 'vim',      name: 'Vim Trap',         desc: 'Toggle theme and see vim',   icon: 'fa-terminal' },
    { id: 'fine',     name: 'This is Fine',     desc: 'Summon the dog in flames',   icon: 'fa-fire' },
    { id: 'matrix',   name: 'Red Pill',          desc: 'Take the red pill. See how deep the rabbit hole goes.', icon: 'fa-code' }
];

var _achieveState = null;  // lazy-loaded: { id: timestamp }
var _achieveDialog = null;

function initAchievements() {
    loadAchievements();

    // Trophy button toggle
    var btn = document.getElementById('achieve-btn');
    if (btn) {
        btn.addEventListener('click', toggleAchieveDialog);
        updateBadge();
    }

    // Game debug button click detection (index.html terminal headers)
    document.body.addEventListener('click', function (e) {
        var el = e.target.closest('.terminal-debug-btn');
        if (!el) return;
        var href = el.getAttribute('href') || '';
        if (href.indexOf('snake') !== -1)   _achieve('snake');
        if (href.indexOf('tetris') !== -1)  _achieve('tetris');
        if (href.indexOf('pacman') !== -1)  _achieve('pacman');
        if (href.indexOf('flappy') !== -1)  _achieve('flappy');
    });

    // Expose global for other controllers
    window._achieve = _achieve;
}

// --- State ---

var _lastOpen = 0;

function loadAchievements() {
    try {
        var saved = localStorage.getItem('achievements');
        _achieveState = saved ? JSON.parse(saved) : {};
        var lo = localStorage.getItem('achievements_lastopen');
        _lastOpen = lo ? parseInt(lo, 10) : 0;
    } catch (e) {
        _achieveState = {};
        _lastOpen = 0;
    }
}

function saveAchievements() {
    try {
        localStorage.setItem('achievements', JSON.stringify(_achieveState));
    } catch (e) {}
}

function saveLastOpen() {
    try {
        localStorage.setItem('achievements_lastopen', String(_lastOpen));
    } catch (e) {}
}

function markSeen() {
    _lastOpen = Date.now();
    saveLastOpen();
}

function getNewCount() {
    if (!_achieveState) loadAchievements();
    var count = 0;
    var ids = Object.keys(_achieveState);
    for (var i = 0; i < ids.length; i++) {
        if (_achieveState[ids[i]] > _lastOpen) count++;
    }
    return count;
}

function _achieve(id) {
    if (!_achieveState) loadAchievements();
    if (_achieveState[id]) return;
    _achieveState[id] = Date.now();
    saveAchievements();
    updateBadge();

    var def = getAchieveDef(id);
    if (def) showAchieveToast(def);
}

function getAchieveDef(id) {
    for (var i = 0; i < ACHIEVEMENTS.length; i++) {
        if (ACHIEVEMENTS[i].id === id) return ACHIEVEMENTS[i];
    }
    return null;
}

function getDiscovered() {
    if (!_achieveState) loadAchievements();
    var ids = Object.keys(_achieveState);
    var result = [];
    for (var i = 0; i < ids.length; i++) {
        var def = getAchieveDef(ids[i]);
        if (def) result.push({ def: def, time: _achieveState[ids[i]] });
    }
    result.sort(function (a, b) { return b.time - a.time; });
    return result;
}

function discoveredMap() {
    if (!_achieveState) loadAchievements();
    return _achieveState;
}

function updateBadge() {
    var btn = document.getElementById('achieve-btn');
    if (!btn) return;
    var existing = btn.querySelector('.achieve-badge');
    if (existing) existing.remove();

    var count = getNewCount();
    if (count === 0) return;

    btn.style.position = 'relative';
    var badge = document.createElement('span');
    badge.className = 'achieve-badge';
    badge.style.cssText = [
        'position:absolute', 'top:-4px', 'right:-4px',
        'min-width:14px', 'height:14px',
        'border-radius:7px',
        'background:var(--accent-primary)',
        'color:#fff',
        'font:9px/14px var(--font-mono)',
        'text-align:center',
        'padding:0 3px',
        'pointer-events:none',
    ].join(';') + ';';
    badge.textContent = count;
    btn.appendChild(badge);
}

// Dialog UI logic has been moved to controllers/achievements-dialog.js
