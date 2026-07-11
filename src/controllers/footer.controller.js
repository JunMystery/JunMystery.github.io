/**
 * Footer controller — typewriter effect on scroll into view
 */

import { $ } from '../utils/dom.js';
import { FOOTER_LINES } from '../models/footer.model.js';
import { TIMING } from '../utils/constants.js';

export function initFooter() {
    const footer = $('.footer');
    if (!footer) return;

    const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            runTypewriter();
            obs.disconnect();
        }
    }, { threshold: 0.4 });

    obs.observe(footer);
}

function runTypewriter() {
    FOOTER_LINES.forEach(l => {
        const el = document.getElementById(l.id);
        if (el) { el.innerHTML = ''; el.classList.remove('typing'); }
    });

    let lineIdx = 0;

    function typeTokens(line, tokIdx, charIdx, done) {
        const el = document.getElementById(line.id);
        if (!el) return;
        el.classList.add('typing');

        const tok = line.tokens[tokIdx];
        let span = el.children[tokIdx];
        if (!span) {
            span = document.createElement('span');
            if (tok.cls) span.className = tok.cls;
            el.appendChild(span);
        }

        if (charIdx < tok.text.length) {
            span.textContent += tok.text[charIdx];
            setTimeout(() => typeTokens(line, tokIdx, charIdx + 1, done), TIMING.TYPEWRITER_CHAR);
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
