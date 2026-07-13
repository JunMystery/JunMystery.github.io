// ============================================================
// models.js — Data models (no dependencies on other modules)
// ============================================================

var FOOTER_LINES = [
    { id: 'fl-0', tokens: [
        { text: '> ', cls: 'terminal-comment' },
        { text: 'git commit', cls: 'terminal-keyword' },
        { text: ' -m ', cls: '' },
        { text: '"built with intent, shipped with care"', cls: 'terminal-string' }
    ]},
    { id: 'fl-1', tokens: [
        { text: 'const ', cls: 'terminal-keyword' },
        { text: 'portfolio', cls: 'terminal-variable' },
        { text: ' = { ', cls: '' },
        { text: 'author', cls: 'terminal-keyword' },
        { text: ': ', cls: '' },
        { text: '"Nguyen Hoang Thanh Tu"', cls: 'terminal-string' },
        { text: ', ', cls: '' },
        { text: 'status', cls: 'terminal-keyword' },
        { text: ': ', cls: '' },
        { text: '"active"', cls: 'terminal-string' },
        { text: ' }', cls: '' }
    ]},
    { id: 'fl-2', tokens: [
        { text: '.engineer', cls: 'terminal-variable' },
        { text: ' { ', cls: '' },
        { text: 'stack', cls: 'terminal-keyword' },
        { text: ': ', cls: '' },
        { text: 'systems + ai', cls: 'terminal-string' },
        { text: '; ', cls: '' },
        { text: 'output', cls: 'terminal-keyword' },
        { text: ': ', cls: '' },
        { text: 'production-grade', cls: 'terminal-orange' },
        { text: '; }', cls: '' },
        { text: ' [404]', cls: 'trigger-404' }
    ]}
];

var NAV_SECTIONS = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' }
];
