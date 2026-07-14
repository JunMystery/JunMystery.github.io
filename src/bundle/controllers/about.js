// ============================================================
// controllers/about.js — Command header typing animation
// On scroll reveal, each $ command types out char by char
// Depends on: $$ (utils.js)
// ============================================================

function initAboutTyping() {
    var terminal = document.querySelector('#about .terminal-window');
    var headers = document.querySelectorAll('#about .term-cmd-header');
    if (!headers.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Skip animation, show fully rendered
        headers.forEach(function (h) { h.setAttribute('data-typed', 'done'); });
        return;
    }

    // Store originals and clear headers
    headers.forEach(function (h) {
        var html = h.getAttribute('data-orig-html');
        if (!html) {
            html = h.innerHTML;
            h.setAttribute('data-orig-html', html);
        }
        h.textContent = '';
    });

    // Observe terminal visibility to trigger typing cascade
    if (!('IntersectionObserver' in window)) {
        typeAllHeaders(headers);
        return;
    }

    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            obs.disconnect();
            typeAllHeaders(headers);
        });
    }, { threshold: 0.3 });

    obs.observe(terminal);
}

function typeAllHeaders(headers) {
    var delay = 0;
    headers.forEach(function (h) {
        var html = h.getAttribute('data-orig-html') || h.innerHTML;
        var text = h.textContent || html.replace(/<[^>]+>/g, '');
        if (!text.trim()) return;

        // Use a separate timer per header for staggered start
        setTimeout(function () {
            typeHeader(h, html, text);
        }, delay);
        delay += 400; // stagger each command header by 400ms
    });
}

function typeHeader(header, origHtml, fullText) {
    var idx = 0;
    var display = '';

    function typeChar() {
        if (idx >= fullText.length) {
            // Done — swap to styled HTML
            header.innerHTML = origHtml;
            header.setAttribute('data-typed', 'done');
            return;
        }
        display += fullText[idx];
        header.textContent = display;
        idx++;
        setTimeout(typeChar, 25 + Math.random() * 10);
    }

    typeChar();
}
