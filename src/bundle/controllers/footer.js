// ============================================================
// controllers/footer.js — Terminal status bar + typewriter intro
// Depends on: $, SELECTORS, FOOTER_LINES, TIMING (utils.js, models.js)
// ============================================================

function initFooter() {
    var footer = $(SELECTORS.FOOTER);
    if (!footer) return;

    var obs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            runTypewriter();
            obs.disconnect();
        }
    }, { threshold: 0.4 });

    obs.observe(footer);
}

function runTypewriter() {
    FOOTER_LINES.forEach(function (l) {
        var el = document.getElementById(l.id);
        if (el) { el.innerHTML = ''; el.classList.remove('typing'); }
    });

    var lineIdx = 0;

    function typeTokens(line, tokIdx, charIdx, done) {
        var el = document.getElementById(line.id);
        if (!el) return;
        el.classList.add('typing');

        var tok = line.tokens[tokIdx];
        var span = el.children[tokIdx];
        if (!span) {
            span = document.createElement('span');
            if (tok.cls) span.className = tok.cls;
            el.appendChild(span);
        }

        if (charIdx < tok.text.length) {
            span.textContent += tok.text[charIdx];
            setTimeout(function () { typeTokens(line, tokIdx, charIdx + 1, done); }, TIMING.TYPEWRITER_CHAR);
        } else if (tokIdx + 1 < line.tokens.length) {
            typeTokens(line, tokIdx + 1, 0, done);
        } else {
            el.classList.remove('typing');
            setTimeout(done, TIMING.TYPEWRITER_LINE_PAUSE);
        }
    }

    function nextLine() {
        if (lineIdx < FOOTER_LINES.length) typeTokens(FOOTER_LINES[lineIdx++], 0, 0, nextLine);
        else startStatusBar();
    }

    nextLine();
}

// ─── Terminal Status Bar ───

var _statusInterval = null;
var _sessionStart = Date.now();

function startStatusBar() {
    var bar = document.getElementById('footer-status-bar');
    if (!bar) return;

    updateStatusBar(bar);
    _statusInterval = setInterval(function () { updateStatusBar(bar); }, 3000);
}

function updateStatusBar(bar) {
    var uptime = Math.floor((Date.now() - _sessionStart) / 1000);
    var days = Math.floor(uptime / 86400);
    var hours = Math.floor((uptime % 86400) / 3600);
    var mem = Math.floor(Math.random() * 30 + 30);

    bar.textContent = ''
        + '[UPTIME: ' + days + 'd ' + hours + 'h]'
        + ' [NET: v6]'
        + ' [MEM: ' + mem + '%]'
        + ' [ERR: ' + Math.floor(Math.random() * 5) + ']';
}
