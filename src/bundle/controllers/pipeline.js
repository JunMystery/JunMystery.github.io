// ============================================================
// controllers/pipeline.js — Interactive SDLC Pipeline simulator
// Chat-style multi-agent conversation with streaming engine
// ============================================================

var SPEED_CONFIG = {
    fast:   { charMs: 15,  msgPauseMs: 150, stepPauseMs: 350, thinkPauseMs: 200 },
    normal: { charMs: 60,  msgPauseMs: 350, stepPauseMs: 700, thinkPauseMs: 400 },
    slow:   { charMs: 120, msgPauseMs: 600, stepPauseMs: 1200, thinkPauseMs: 800 }
};

function initPipelineSimulator() {
    var runBtn = document.getElementById('pipeline-run');
    var pauseBtn = document.getElementById('pipeline-pause');
    var stepBtn = document.getElementById('pipeline-step');
    var presetSelect = document.getElementById('pipeline-preset');
    var terminalBody = document.getElementById('pipeline-terminal-body');
    var nodes = document.querySelectorAll('.pipeline-stage-card, .pipeline-node');
    var statusLabel = document.getElementById('pipeline-status-label');

    if (!runBtn || !terminalBody) return;

    var currentStep = 0;
    var isRunning = false;
    var timerId = null;
    var currentSpeed = 'fast';
    var presets = PIPELINE_PRESETS;
    var msgIndex = 0;

    function getSpeed() { return SPEED_CONFIG.fast; }

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
        var stageCards = document.querySelectorAll('.pipeline-stage-card, .pipeline-node');
        stageCards.forEach(function (card, index) {
            card.classList.remove('active', 'completed');
            var statusBadge = card.querySelector('.stage-status-badge');
            var progressFill = card.querySelector('.stage-progress-fill');
            var durationEl = card.querySelector('.stage-duration');
            if (index < currentStep) {
                card.classList.add('completed');
                if (statusBadge) statusBadge.textContent = 'PASSED';
                if (progressFill) progressFill.style.width = '100%';
                if (durationEl && (!durationEl.textContent || durationEl.textContent === '--')) {
                    durationEl.textContent = '0.' + (6 + index * 2) + 's';
                }
            } else if (index === currentStep && isRunning) {
                card.classList.add('active');
                if (statusBadge) statusBadge.textContent = 'RUNNING';
                if (progressFill) progressFill.style.width = '70%';
            } else {
                if (statusBadge) statusBadge.textContent = 'QUEUED';
                if (progressFill) progressFill.style.width = '0%';
                if (durationEl) durationEl.textContent = '--';
            }
        });

        ['conn-plan-code', 'conn-code-verify', 'conn-verify-deploy'].forEach(function (id, idx) {
            var el = document.getElementById(id);
            if (el) {
                el.classList.toggle('completed', currentStep > idx + 1);
                el.classList.toggle('active', currentStep === idx + 1 && isRunning);
            }
        });

        updateTelemetry();
    }

    function updateTelemetry() {
        var metaStatus = document.getElementById('pipeline-meta-status');
        if (metaStatus) {
            metaStatus.classList.toggle('running', isRunning);
            var statusText = metaStatus.querySelector('.pipeline-status-text');
            if (statusText) {
                statusText.textContent = isRunning ? 'RUNNING: #AGY-908' : (currentStep >= 4 ? 'PASSED: #AGY-908' : 'STANDBY: #AGY-908');
            }
        }
        var tpsEl = document.getElementById('telemetry-tps');
        var latencyEl = document.getElementById('telemetry-latency');
        var tpsFill = document.getElementById('telemetry-tps-fill');
        var latencyFill = document.getElementById('telemetry-latency-fill');
        if (tpsEl) tpsEl.textContent = isRunning ? (460 + Math.floor(Math.random() * 50)) + ' tps' : (currentStep >= 4 ? '482 tps' : '0 tps');
        if (latencyEl) latencyEl.textContent = isRunning ? (26 + Math.floor(Math.random() * 12)) + ' ms' : (currentStep >= 4 ? '32 ms' : '-- ms');
        if (tpsFill) tpsFill.style.width = isRunning ? '82%' : (currentStep >= 4 ? '80%' : '0%');
        if (latencyFill) latencyFill.style.width = isRunning ? '35%' : (currentStep >= 4 ? '30%' : '0%');
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
        if (statusLabel) {
            statusLabel.textContent = lang === 'vi' ? 'CH\u1EDC' : 'IDLE';
            statusLabel.style.color = 'var(--text-secondary)';
        }
        var artifactEl = document.getElementById('telemetry-artifact-name');
        if (artifactEl) artifactEl.textContent = 'dist/bundle.js (3764 LOC)';
        updateNodes();
        removeDebugButton();
    }

    function appendDebugButton(presetKey) {
        removeDebugButton();
        if (!presetKey) return;
        var lang = i18n.currentLang || 'en';
        var preset = presets[lang] && presets[lang][presetKey];
        var info = preset && preset.gameOutput && GAME_MAP[preset.gameOutput];
        if (!info) return;

        var msgEl = document.createElement('div');
        msgEl.className = 'chat-message chat-debug-btn-wrap';
        msgEl.innerHTML = '<div class="chat-avatar system">S</div>' +
            '<div class="chat-bubble"><div class="chat-content">' +
            '<a class="chat-debug-btn" href="' + info.url + '" target="_blank" title="' + info.label + '">' +
            '<span>' + getIconSVG('code', 12) + '</span> Debug: ' + info.label + '</a>' +
            '</div></div>';
        terminalBody.appendChild(msgEl);
        scrollBottom();

        var artifactEl = document.getElementById('telemetry-artifact-name');
        if (artifactEl) artifactEl.textContent = info.label + ' (' + info.url + ')';
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
