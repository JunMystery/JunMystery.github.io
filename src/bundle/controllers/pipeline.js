// ============================================================
// controllers/pipeline.js — Interactive SDLC Pipeline simulator
// Chat-style multi-agent conversation with streaming engine
// ============================================================

var SPEED_CONFIG = {
    fast:   { charMs: 30,  msgPauseMs: 200, stepPauseMs: 500, thinkPauseMs: 300 },
    normal: { charMs: 100, msgPauseMs: 500, stepPauseMs: 1000, thinkPauseMs: 600 },
    slow:   { charMs: 200, msgPauseMs: 800, stepPauseMs: 1500, thinkPauseMs: 1000 }
};

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

    function esc(s) { return escapeHtml(s); }

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
                    msgEl.querySelector('.thinking-dots').innerHTML = '<span style="color:var(--text-muted);font-size:0.7rem;width:auto;height:auto;border-radius:0;background:none">done</span>';
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
        removeDebugButton();
    }

    function appendDebugButton(presetKey) {
        removeDebugButton();
        if (!presetKey) return;
        var lang = i18n.currentLang || 'en';
        var preset = presets[lang] && presets[lang][presetKey];
        var gameId = preset && preset.gameOutput;
        if (!gameId || !GAME_MAP[gameId]) return;

        var info = GAME_MAP[gameId];
        var msgEl = document.createElement('div');
        msgEl.className = 'chat-message chat-debug-btn-wrap';

        var avatar = document.createElement('div');
        avatar.className = 'chat-avatar system';
        avatar.textContent = 'S';
        msgEl.appendChild(avatar);

        var bubble = document.createElement('div');
        bubble.className = 'chat-bubble';

        var content = document.createElement('div');
        content.className = 'chat-content';

        var btn = document.createElement('a');
        btn.className = 'chat-debug-btn';
        btn.href = info.url;
        btn.target = '_blank';
        btn.setAttribute('title', info.label);
        var icon = document.createElement('i');
        icon.className = 'fas fa-code';
        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(' Debug: ' + info.label));
        content.appendChild(btn);
        bubble.appendChild(content);
        msgEl.appendChild(bubble);
        terminalBody.appendChild(msgEl);
        scrollBottom();
    }

    function finish() {
        isRunning = false;
        updateNodes();
        var lang = i18n.currentLang || 'en';
        var presetKey = presetSelect.value;
        appendDebugButton(presetKey);
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
