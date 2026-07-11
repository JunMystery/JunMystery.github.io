/**
 * Scroll service — IntersectionObserver factory
 */

export function createRevealObserver(threshold = 0.12, rootMargin = '0px 0px -40px 0px') {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        });
    }, { threshold, rootMargin });
    return obs;
}

export function createFooterObserver(threshold = 0.4) {
    const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            if (typeof window.startTypewriter === 'function') {
                window.startTypewriter();
            }
            obs.disconnect();
        }
    }, { threshold });
    return obs;
}
