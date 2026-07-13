// ============================================================
// controllers/vim-trap.js — Bar dialog that slides from bottom
// Called by theme toggle click (theme.js)
// ============================================================

var _vimBarEl = null;
var _vimDismissTimer = null;
var _vimAchieved = false;

function showVimBar(msg) {
    if (!_vimAchieved && typeof _achieve === 'function') {
        _vimAchieved = true;
        _achieve('vim');
    }
    if (_vimBarEl) {
        clearTimeout(_vimDismissTimer);
        if (_vimBarEl.parentNode) _vimBarEl.parentNode.removeChild(_vimBarEl);
        _vimBarEl = null;
    }
    _vimBarEl = document.createElement('div');
    _vimBarEl.id = 'vim-bar';
    _vimBarEl.textContent = msg || 'E98: Cannot exit: buffer has unsaved changes. Use :q! to force.';
    _vimBarEl.style.cssText = [
        'position:fixed',
        'bottom:20px',
        'left:50%',
        'transform:translateX(-50%) translateY(120%)',
        'z-index:10002',
        'background:#1c2333',
        'border:1px solid #30363d',
        'border-radius:8px',
        'color:#ff7b72',
        'font:13px/1.4 "Fira Code","Consolas",monospace',
        'padding:10px 18px',
        'text-align:center',
        'box-shadow:0 4px 24px rgba(0,0,0,0.5)',
        'white-space:nowrap',
        'transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
    ].join(';') + ';';
    document.body.appendChild(_vimBarEl);
    requestAnimationFrame(function () {
        _vimBarEl.style.transform = 'translateX(-50%) translateY(0)';
    });
    clearTimeout(_vimDismissTimer);
    _vimDismissTimer = setTimeout(dismissVimBar, 8000);
}

function dismissVimBar() {
    if (!_vimBarEl) return;
    clearTimeout(_vimDismissTimer);
    _vimBarEl.style.transform = 'translateX(-50%) translateY(120%)';
    setTimeout(function () {
        if (_vimBarEl && _vimBarEl.parentNode) _vimBarEl.parentNode.removeChild(_vimBarEl);
        _vimBarEl = null;
    }, 300);
}
