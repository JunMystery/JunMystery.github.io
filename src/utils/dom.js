/** Get element by selector */
export const $ = (sel, ctx = document) => ctx.querySelector(sel);

/** Get all elements by selector */
export const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/** Create element with optional attrs and children */
export const createEl = (tag, attrs = {}, ...children) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'className') el.className = v;
        else if (k.startsWith('data-')) el.setAttribute(k, v);
        else el[k] = v;
    });
    children.forEach(c => {
        if (typeof c === 'string') el.appendChild(document.createTextNode(c));
        else if (c instanceof Node) el.appendChild(c);
    });
    return el;
};
