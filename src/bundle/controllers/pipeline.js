// ============================================================
// controllers/pipeline.js — Interactive SDLC Pipeline simulator
// Chat-style multi-agent conversation with streaming engine
// ============================================================

var AGENT_CONFIG = {
    user:     { name: "User",          initial: "U" },
    planner:  { name: "PlannerAgent",  initial: "P" },
    coder:    { name: "CoderAgent",    initial: "C" },
    verifier: { name: "VerifierAgent", initial: "V" },
    git:      { name: "GitAgent",      initial: "G" },
    system:   { name: "System",        initial: "S" }
};

var SPEED_CONFIG = {
    fast:   { charMs: 30,  msgPauseMs: 200, stepPauseMs: 500, thinkPauseMs: 300 },
    normal: { charMs: 100, msgPauseMs: 500, stepPauseMs: 1000, thinkPauseMs: 600 },
    slow:   { charMs: 200, msgPauseMs: 800, stepPauseMs: 1500, thinkPauseMs: 1000 }
};

function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function initPipelineSimulator() {
    var runBtn = document.getElementById('pipeline-run');
    var pauseBtn = document.getElementById('pipeline-pause');
    var stepBtn = document.getElementById('pipeline-step');
    var presetSelect = document.getElementById('pipeline-preset');
    var terminalBody = document.getElementById('pipeline-terminal-body');
    var nodes = document.querySelectorAll('.pipeline-node');
    var statusLabel = document.getElementById('pipeline-status-label');
    var speedBtns = document.querySelectorAll('.pipeline-speed-btn');

    if (!runBtn || !terminalBody) return;

    var currentStep = 0;
    var isRunning = false;
    var timerId = null;
    var currentSpeed = 'normal';
    var presets = PIPELINE_PRESETS;
    var msgIndex = 0;

    // --- Speed control ---
    function initSpeedButtons() {
        speedBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                speedBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentSpeed = btn.dataset.speed || 'normal';
            });
        });
    }
    initSpeedButtons();

    function getSpeed() { return SPEED_CONFIG[currentSpeed] || SPEED_CONFIG.normal; }

    function scrollBottom() {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // --- HTML escaping ---
    function esc(s) { return escapeHtml(s); }

    // --- Render a single chat message element ---
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

    // --- Stream a text message char by char ---
    function streamText(msgEl, text, speed, done) {
        var contentEl = msgEl.querySelector('.chat-content');
        contentEl.className = 'chat-content chat-content-text';
        contentEl.textContent = '';

        if (!speed || speed.charMs <= 5) {
            contentEl.textContent = text;
            if (done) done();
            return;
        }

        var cursor = document.createElement('span');
        cursor.className = 'chat-cursor';
        contentEl.appendChild(cursor);

        var idx = 0;
        var charsPerTick = currentSpeed === 'fast' ? 3 : 1;
        var tick = currentSpeed === 'fast' ? 15 : speed.charMs;

        function type() {
            if (!contentEl.parentNode) { if (done) done(); return; }
            var chunk = text.slice(idx, idx + charsPerTick);
            contentEl.insertBefore(document.createTextNode(chunk), cursor);
            idx += charsPerTick;
            scrollBottom();
            if (idx < text.length) {
                timerId = setTimeout(type, tick);
            } else {
                contentEl.removeChild(cursor);
                if (done) done();
            }
        }
        timerId = setTimeout(type, tick);
    }

    // --- Execute the next message in the current step ---
    function executeNextMessage() {
        var lang = i18n.currentLang || 'en';
        var presetKey = presetSelect.value;
        var preset = presets[lang][presetKey];
        if (!preset) { finish(); return; }

        var stepData = preset.steps[currentStep];
        if (!stepData) { finish(); return; }

        if (msgIndex >= stepData.messages.length) {
            currentStep++;
            msgIndex = 0;
            if (currentStep < preset.steps.length) {
                updateNodes();
                if (isRunning) {
                    timerId = setTimeout(executeNextMessage, getSpeed().stepPauseMs);
                }
            } else {
                finish();
            }
            return;
        }

        var msg = stepData.messages[msgIndex];
        msgIndex++;

        var msgEl = createMessageEl(msg);
        terminalBody.appendChild(msgEl);
        scrollBottom();

        var speed = getSpeed();

        if (msg.type === 'thinking') {
            var duration = msg.duration || 1200;
            if (!isRunning) duration = 100;
            timerId = setTimeout(function () {
                if (msgEl.parentNode) {
                    msgEl.querySelector('.thinking-dots').innerHTML = '<span style="color:var(--text-muted);font-size:0.7rem">done</span>';
                }
                timerId = setTimeout(executeNextMessage, speed.thinkPauseMs);
            }, Math.min(duration, speed === SPEED_CONFIG.fast ? 300 : duration));
        } else if (msg.type === 'text') {
            streamText(msgEl, msg.content || '', speed, function () {
                timerId = setTimeout(executeNextMessage, speed.msgPauseMs);
            });
        } else {
            timerId = setTimeout(executeNextMessage, speed.msgPauseMs);
        }
    }

    function updateNodes() {
        nodes.forEach(function (node, index) {
            node.classList.remove('active', 'completed');
            if (index < currentStep) {
                node.classList.add('completed');
            } else if (index === currentStep && isRunning) {
                node.classList.add('active');
            }
        });

        var connPlanCode = document.getElementById('conn-plan-code');
        var connCodeVerify = document.getElementById('conn-code-verify');
        var connVerifyDeploy = document.getElementById('conn-verify-deploy');

        if (connPlanCode) {
            connPlanCode.classList.remove('active', 'completed');
            if (currentStep > 1) connPlanCode.classList.add('completed');
            else if (currentStep === 1 && isRunning) connPlanCode.classList.add('active');
        }
        if (connCodeVerify) {
            connCodeVerify.classList.remove('active', 'completed');
            if (currentStep > 2) connCodeVerify.classList.add('completed');
            else if (currentStep === 2 && isRunning) connCodeVerify.classList.add('active');
        }
        if (connVerifyDeploy) {
            connVerifyDeploy.classList.remove('active', 'completed');
            if (currentStep > 3) connVerifyDeploy.classList.add('completed');
            else if (currentStep === 3 && isRunning) connVerifyDeploy.classList.add('active');
        }
    }

    function reset() {
        clearTimeout(timerId);
        terminalBody.innerHTML = '';
        currentStep = 0;
        msgIndex = 0;
        isRunning = false;
        runBtn.disabled = false;
        pauseBtn.disabled = true;
        var lang = i18n.currentLang || 'en';
        statusLabel.textContent = lang === 'vi' ? 'CH\u1EDC' : 'IDLE';
        statusLabel.style.color = 'var(--text-secondary)';
        updateNodes();
    }

    function finish() {
        isRunning = false;
        updateNodes();
        var lang = i18n.currentLang || 'en';
        statusLabel.textContent = lang === 'vi' ? 'TH\u00c0NH C\u00d4NG' : 'IDLE';
        statusLabel.style.color = '#22c55e';
        runBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function startRun() {
        var lang = i18n.currentLang || 'en';
        reset();
        isRunning = true;
        runBtn.disabled = true;
        pauseBtn.disabled = false;
        statusLabel.textContent = lang === 'vi' ? '\u0110ANG CH\u1ea0Y' : 'RUNNING';
        statusLabel.style.color = '#58a6ff';
        updateNodes();
        executeNextMessage();
    }

    function pauseRun() {
        var lang = i18n.currentLang || 'en';
        isRunning = false;
        clearTimeout(timerId);
        runBtn.disabled = false;
        pauseBtn.disabled = true;
        statusLabel.textContent = lang === 'vi' ? 'T\u1ea0M D\u1eeaNG' : 'PAUSED';
        statusLabel.style.color = '#f59e0b';
        updateNodes();
    }

    function stepOnce() {
        var lang = i18n.currentLang || 'en';
        if (currentStep >= 4 && msgIndex === 0) { reset(); }
        isRunning = false;
        clearTimeout(timerId);
        statusLabel.textContent = lang === 'vi' ? 'B\u01af\u1edaC' : 'STEPPING';
        statusLabel.style.color = '#f59e0b';
        executeNextMessage();
    }

    // --- Event listeners ---
    runBtn.addEventListener('click', function () {
        if (currentStep >= 4 && msgIndex === 0) { reset(); }
        startRun();
    });

    pauseBtn.addEventListener('click', pauseRun);

    stepBtn.addEventListener('click', stepOnce);

    presetSelect.addEventListener('change', function () {
        reset();
    });
}
