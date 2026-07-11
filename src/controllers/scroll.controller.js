/**
 * Scroll controller — IntersectionObserver-driven reveal animations
 */

import { $$ } from '../utils/dom.js';
import { TIMING } from '../utils/constants.js';

export function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: TIMING.REVEAL_THRESHOLD, rootMargin: TIMING.REVEAL_MARGIN });

    $$('.reveal, .reveal-stagger, .reveal-hero').forEach(el => {
        observer.observe(el);
    });
}
