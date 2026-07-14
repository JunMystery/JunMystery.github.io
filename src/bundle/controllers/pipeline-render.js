// ============================================================
// controllers/pipeline-render.js — Chat message render helpers
// Extracted from pipeline.js to stay under 300 LOC.
// Module-level globals; no closure dependencies.
// ============================================================

var AGENT_CONFIG = {
    user:     { name: "User",          initial: "U" },
    planner:  { name: "PlannerAgent",  initial: "P" },
    coder:    { name: "CoderAgent",    initial: "C" },
    verifier: { name: "VerifierAgent", initial: "V" },
    git:      { name: "GitAgent",      initial: "G" },
    system:   { name: "System",        initial: "S" }
};

function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

var GAME_MAP = {
    snake:  { url: 'game/snake-game.html',       label: 'snake_core.js' },
    tetris: { url: 'game/tetris-game.html',       label: 'compiler_engine.tsx' },
    pacman: { url: 'game/pacman-game.html',       label: 'compiler_pacman.py' },
    flappy: { url: 'game/flappy-bird-game.html',  label: 'pipeline_flappy.sh' }
};

function removeDebugButton() {
    var existing = document.querySelector('.chat-debug-btn-wrap');
    if (existing) existing.parentNode.removeChild(existing);
}

function createMessageEl(msg) {
    var agent = msg.agent || 'system';
    var cfg = AGENT_CONFIG[agent] || AGENT_CONFIG.system;
    var el = document.createElement('div');
    el.className = 'chat-message';

    var avatar = document.createElement('div');
    avatar.className = 'chat-avatar ' + agent;
    avatar.textContent = cfg.initial;
    el.appendChild(avatar);

    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    var header = document.createElement('div');
    header.className = 'chat-header';
    var nameSpan = document.createElement('span');
    nameSpan.className = 'chat-agent-name';
    nameSpan.setAttribute('data-agent', agent);
    nameSpan.textContent = cfg.name;
    header.appendChild(nameSpan);
    var ts = document.createElement('span');
    ts.className = 'chat-timestamp';
    ts.textContent = 'now';
    header.appendChild(ts);
    bubble.appendChild(header);

    var content = document.createElement('div');
    content.className = 'chat-content';

    switch (msg.type) {
        case 'code':
            renderCode(content, msg);
            break;
        case 'diff':
            renderDiff(content, msg);
            break;
        case 'command':
            renderCommand(content, msg);
            break;
        case 'status':
            renderStatus(content, msg);
            break;
        case 'thinking':
            renderThinking(content);
            break;
        case 'divider':
            renderDivider(content, msg);
            break;
        default:
            content.className = 'chat-content chat-content-text';
            content.textContent = msg.content || '';
            break;
    }

    bubble.appendChild(content);
    el.appendChild(bubble);
    return el;
}

function renderCode(container, msg) {
    var block = document.createElement('div');
    block.className = 'chat-code-block';

    var header = document.createElement('div');
    header.className = 'code-header';
    var langSpan = document.createElement('span');
    langSpan.className = 'code-lang';
    langSpan.textContent = msg.language || 'code';
    header.appendChild(langSpan);
    block.appendChild(header);

    var pre = document.createElement('pre');
    var code = document.createElement('code');
    code.textContent = msg.code || msg.content || '';
    pre.appendChild(code);
    block.appendChild(pre);

    container.appendChild(block);
}

function renderDiff(container, msg) {
    var block = document.createElement('div');
    block.className = 'chat-diff-block';

    var header = document.createElement('div');
    header.className = 'diff-header';
    header.textContent = msg.content || 'Diff:';
    block.appendChild(header);

    var lines = msg.diff || [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var lineEl = document.createElement('div');
        var cls = 'chat-diff-line';
        if (line.indexOf('+') === 0) cls += ' diff-add';
        else if (line.indexOf('-') === 0) cls += ' diff-del';
        lineEl.className = cls;
        lineEl.textContent = line;
        block.appendChild(lineEl);
    }

    container.appendChild(block);
}

function renderCommand(container, msg) {
    var cmd = document.createElement('div');
    cmd.className = 'chat-command';
    var prompt = document.createElement('span');
    prompt.className = 'cmd-prompt';
    prompt.textContent = '$';
    cmd.appendChild(prompt);
    cmd.appendChild(document.createTextNode(' ' + (msg.content || '')));
    container.appendChild(cmd);
}

function renderStatus(container, msg) {
    var badge = document.createElement('span');
    badge.className = 'chat-status';
    var iconName = 'fa-check-circle';
    var color = '#22c55e';
    if (msg.status === 'fail') { iconName = 'fa-times-circle'; color = '#ff4d4d'; }
    else if (msg.status === 'warn') { iconName = 'fa-exclamation-circle'; color = '#f59e0b'; }
    badge.style.color = color;
    var icon = document.createElement('i');
    icon.className = 'fas ' + iconName;
    badge.appendChild(icon);
    badge.appendChild(document.createTextNode(' ' + (msg.content || '')));
    container.appendChild(badge);
}

function renderThinking(container) {
    var dots = document.createElement('div');
    dots.className = 'thinking-dots';
    for (var i = 0; i < 3; i++) {
        var dot = document.createElement('span');
        dots.appendChild(dot);
    }
    container.appendChild(dots);
}

function renderDivider(container, msg) {
    var div = document.createElement('div');
    div.className = 'chat-divider';
    var span = document.createElement('span');
    span.textContent = msg.content || '';
    div.appendChild(span);
    container.appendChild(div);
}
