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
    // Skip typewriter animation when user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        FOOTER_LINES.forEach(function (l) {
            var el = document.getElementById(l.id);
            if (el) {
                el.innerHTML = '';
                l.tokens.forEach(function (tok) {
                    var span = document.createElement('span');
                    if (tok.cls) span.className = tok.cls;
                    span.textContent = tok.text;
                    el.appendChild(span);
                });
            }
        });
        return;
    }
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
    }

    nextLine();
}
