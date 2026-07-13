// ============================================================
// controllers/boot-splash.js — Full-screen terminal boot sequence
// Plays once per session. Self-contained, no external deps.
// ============================================================

function initBootSplash() {
    if (sessionStorage.getItem('boot_played')) return;

    var bootLines = [
        '> INITIALIZING KERNEL............ [OK]',
        '> MOUNTING FILESYSTEM............ [OK]',
        '> STARTING NETWORK SERVICES...... [OK]',
        '> LOADING PORTFOLIO MODULES...... [DONE]'
    ];

    var overlay = document.createElement('div');
    overlay.id = 'boot-splash';
    overlay.style.cssText = [
        'position:fixed;top:0;left:0;width:100%;height:100%;',
        'z-index:10001;',
        'background:#05070a;',
        'display:flex;flex-direction:column;',
        'align-items:center;justify-content:center;',
        'font-family:"Fira Code","Consolas",monospace;',
        'font-size:14px;color:#33FF00;',
        'opacity:1;transition:opacity 0.5s;',
        'padding:2rem;'
    ].join('');

    var log = document.createElement('div');
    log.style.cssText = 'text-align:left;max-width:420px;width:100%;line-height:1.8;';
    overlay.appendChild(log);
    document.body.appendChild(overlay);

    var lineIdx = 0;
    var charIdx = 0;

    function typeLine() {
        if (lineIdx >= bootLines.length) {
            sessionStorage.setItem('boot_played', '1');
            setTimeout(function () {
                overlay.style.opacity = '0';
                setTimeout(function () {
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                }, 500);
            }, 400);
            return;
        }

        var line = bootLines[lineIdx];
        var p = document.createElement('div');
        log.appendChild(p);

        charIdx = 0;
        function typeChar() {
            if (charIdx < line.length) {
                p.textContent += line[charIdx];
                charIdx++;
                setTimeout(typeChar, 15 + Math.random() * 20);
            } else {
                lineIdx++;
                setTimeout(typeLine, 250);
            }
        }
        typeChar();
    }

    typeLine();
}
