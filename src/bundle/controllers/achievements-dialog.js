// ============================================================
// controllers/achievements-dialog.js — Achievements UI dialog & toasts
// ============================================================

var _achieveDialog = null;
var _toastTimer = null;

function toggleAchieveDialog() {
    if (_achieveDialog) {
        closeAchieveDialog();
    } else {
        openAchieveDialog();
    }
}

function openAchieveDialog() {
    if (_achieveDialog) return;

    markSeen();
    updateBadge();

    _achieveDialog = document.createElement('div');
    _achieveDialog.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:99999',
        'background:rgba(0,0,0,0.5)',
        'display:flex', 'align-items:center', 'justify-content:center',
        'opacity:0', 'transition:opacity 0.2s ease',
    ].join(';') + ';';

    var panel = document.createElement('div');
    panel.style.cssText = [
        'background:var(--bg-secondary)',
        'border:1px solid var(--border-color)',
        'border-radius:var(--border-radius-lg)',
        'width:360px', 'max-width:92vw', 'max-height:80vh',
        'overflow:hidden',
        'box-shadow:0 12px 40px rgba(0,0,0,0.5)',
        'transform:scale(0.95)',
        'transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
    ].join(';') + ';';

    // Terminal header
    var header = document.createElement('div');
    header.style.cssText = [
        'display:flex', 'align-items:center', 'gap:8px',
        'padding:10px 14px',
        'background:var(--bg-tertiary)',
        'border-bottom:1px solid var(--border-color)',
        'font:12px/1 var(--font-mono)',
        'color:var(--text-secondary)',
    ].join(';') + ';';

    var dotColors = ['#ff5555', '#f1fa8c', '#50fa7b'];
    for (var d = 0; d < 3; d++) {
        var dot = document.createElement('span');
        dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:' + dotColors[d] + ';display:inline-block;';
        header.appendChild(dot);
    }

    var title = document.createElement('span');
    title.style.cssText = 'flex:1;text-align:center;';
    title.textContent = 'achievements.json';
    header.appendChild(title);

    var discovered = getDiscovered();
    var countLabel = document.createElement('span');
    countLabel.style.cssText = [
        'font:10px/1 var(--font-mono)',
        'color:var(--accent-primary)',
        'background:var(--bg-secondary)',
        'border:1px solid var(--border-color)',
        'border-radius:8px',
        'padding:2px 6px',
    ].join(';') + ';';
    countLabel.textContent = discovered.length + '/' + ACHIEVEMENTS.length;
    header.appendChild(countLabel);

    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = [
        'background:none', 'border:none',
        'color:var(--text-muted)',
        'font:16px/1 var(--font-mono)',
        'cursor:pointer', 'padding:0 4px',
    ].join(';') + ';';
    closeBtn.addEventListener('click', closeAchieveDialog);
    header.appendChild(closeBtn);

    panel.appendChild(header);

    // Body
    var body = document.createElement('div');
    body.style.cssText = 'padding:14px;overflow-y:auto;max-height:calc(80vh - 46px);';

    var list = document.createElement('div');
    list.style.cssText = 'display:flex;flex-direction:column;gap:8px;';

    for (var i = 0; i < ACHIEVEMENTS.length; i++) {
        var def = ACHIEVEMENTS[i];
        var found = discoveredMap();
        var isFound = found[def.id] ? true : false;

        var row = document.createElement('div');
        if (isFound) {
            row.style.cssText = [
                'display:flex', 'align-items:flex-start', 'gap:10px',
                'padding:10px 12px',
                'background:var(--bg-tertiary)',
                'border-radius:var(--border-radius-sm)',
                'border-left:3px solid var(--accent-primary)',
            ].join(';') + ';';
        } else {
            row.style.cssText = [
                'display:flex', 'align-items:flex-start', 'gap:10px',
                'padding:10px 12px',
                'background:transparent',
                'border-radius:var(--border-radius-sm)',
                'border-left:3px solid var(--border-color)',
                'opacity:0.35',
            ].join(';') + ';';
        }

        var icon = document.createElement('i');
        if (isFound) {
            icon.className = 'fas ' + def.icon;
            icon.style.cssText = 'color:var(--accent-secondary);font-size:14px;margin-top:1px;';
        } else {
            icon.className = 'fas fa-lock';
            icon.style.cssText = 'color:var(--text-muted);font-size:14px;margin-top:1px;';
        }

        var info = document.createElement('div');
        info.style.cssText = 'flex:1;min-width:0;';

        var name = document.createElement('div');
        if (isFound) {
            name.style.cssText = 'font:600 13px/1.4 var(--font-mono);color:var(--text-primary);';
            name.textContent = def.name;
        } else {
            name.style.cssText = 'font:600 13px/1.4 var(--font-mono);color:var(--text-muted);';
            name.textContent = '???';
        }

        var desc = document.createElement('div');
        if (isFound) {
            desc.style.cssText = 'font:11px/1.4 var(--font-mono);color:var(--text-secondary);margin-top:2px;';
            desc.textContent = def.desc;
        } else {
            desc.style.cssText = 'font:11px/1.4 var(--font-mono);color:var(--text-muted);margin-top:2px;font-style:italic;';
            desc.textContent = 'not yet discovered';
        }

        if (isFound) {
            var time = document.createElement('div');
            time.style.cssText = 'font:10px/1 var(--font-mono);color:var(--text-muted);margin-top:4px;';
            time.textContent = formatAchieveTime(found[def.id]);
            info.appendChild(name);
            info.appendChild(desc);
            info.appendChild(time);
        } else {
            info.appendChild(name);
            info.appendChild(desc);
        }

        row.appendChild(icon);
        row.appendChild(info);
        list.appendChild(row);
    }
    body.appendChild(list);

    panel.appendChild(body);
    _achieveDialog.appendChild(panel);
    document.body.appendChild(_achieveDialog);

    requestAnimationFrame(function () {
        _achieveDialog.style.opacity = '1';
        panel.style.transform = 'scale(1)';
    });

    _achieveDialog.addEventListener('click', function (e) {
        if (e.target === _achieveDialog) closeAchieveDialog();
    });
    document.addEventListener('keydown', _achieveEscHandler);

    // Refresh badge on open
    updateBadge();
}

function _achieveEscHandler(e) {
    if (e.key === 'Escape') closeAchieveDialog();
}

function closeAchieveDialog() {
    if (!_achieveDialog) return;
    var panel = _achieveDialog.firstChild;
    if (panel) panel.style.transform = 'scale(0.95)';
    _achieveDialog.style.opacity = '0';
    setTimeout(function () {
        if (_achieveDialog && _achieveDialog.parentNode) {
            _achieveDialog.parentNode.removeChild(_achieveDialog);
        }
        _achieveDialog = null;
    }, 200);
    document.removeEventListener('keydown', _achieveEscHandler);
}

function formatAchieveTime(ts) {
    var diff = Date.now() - ts;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return Math.floor(diff / 86400000) + 'd ago';
}

function showAchieveToast(entry) {
    if (_toastTimer) {
        clearTimeout(_toastTimer);
        var prev = document.querySelector('.achieve-toast');
        if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
    }

    var toast = document.createElement('div');
    toast.className = 'achieve-toast';
    toast.style.cssText = [
        'position:fixed', 'bottom:70px', 'left:50%',
        'transform:translateX(-50%) translateY(20px)',
        'z-index:100003',
        'background:var(--bg-secondary)',
        'border:1px solid var(--accent-primary)',
        'border-radius:var(--border-radius-md)',
        'padding:10px 18px',
        'display:flex', 'align-items:center', 'gap:10px',
        'font:13px/1 var(--font-mono)',
        'color:var(--text-primary)',
        'box-shadow:0 4px 20px rgba(0,0,0,0.4)',
        'opacity:0',
        'transition:opacity 0.25s ease,transform 0.25s ease',
        'pointer-events:none',
    ].join(';') + ';';

    var icon = document.createElement('i');
    icon.className = 'fas ' + entry.icon;
    icon.style.cssText = 'color:var(--accent-secondary);font-size:14px;';

    var txt = document.createElement('span');
    txt.textContent = 'Achievement: ' + entry.name;

    toast.appendChild(icon);
    toast.appendChild(txt);
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    _toastTimer = setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(function () {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 250);
        _toastTimer = null;
    }, 3000);
}
