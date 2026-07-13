// ============================================================
// controllers/fine-trigger.js — "This is fine" widget overlay
// Shows this-is-fine.html in an iframe dialog on index.html
// Hidden triggers: Shift+double-click, two-finger tap,
// console _fine(), ?fine URL param, footer [fine] token
// ============================================================

var _fineAchieved = false;

function initFineTrigger() {
    var _overlay = null;

    // URL param ?fine / hash #fine auto-show
    if (location.search.indexOf('fine') !== -1 || location.hash === '#fine') {
        showFineWidget();
    }

    // Shift+double-click
    document.addEventListener('dblclick', function (e) {
        if (e.shiftKey) showFineWidget();
    });

    // Two-finger tap
    var tapTime = 0;
    document.addEventListener('touchstart', function (e) {
        if (e.touches.length === 2) tapTime = Date.now();
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
        if (e.changedTouches.length === 2 && tapTime > 0 && Date.now() - tapTime < 400) {
            showFineWidget();
        }
        tapTime = 0;
    }, { passive: true });

    // Click .trigger-fine elements (footer token)
    document.body.addEventListener('click', function (e) {
        var el = e.target.closest('.trigger-fine');
        if (el) { e.preventDefault(); showFineWidget(); }
    });

    // Console function
    window._fine = showFineWidget;

    function showFineWidget() {
        if (_overlay) return;
        if (!_fineAchieved && typeof _achieve === 'function') {
            _fineAchieved = true;
            _achieve('fine');
        }

        _overlay = document.createElement('div');
        _overlay.style.cssText = [
            'position:fixed',
            'inset:0',
            'z-index:99999',
            'background:rgba(0,0,0,0.5)',
            'display:flex',
            'align-items:center',
            'justify-content:center',
            'opacity:0',
            'transition:opacity 0.25s ease',
        ].join(';') + ';';

        var dialog = document.createElement('div');
        dialog.style.cssText = [
            'position:relative',
            'width:360px',
            'max-width:92vw',
            'max-height:90vh',
            'border-radius:10px',
            'overflow:hidden',
            'box-shadow:0 12px 40px rgba(0,0,0,0.8)',
            'transform:scale(0.95)',
            'transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        ].join(';') + ';';

        var closeBtn = document.createElement('button');
        closeBtn.textContent = '\u2715';
        closeBtn.style.cssText = [
            'position:absolute',
            'top:0',
            'right:0',
            'z-index:100001',
            'width:28px',
            'height:28px',
            'border:none',
            'background:rgba(0,0,0,0.7)',
            'color:#8b949e',
            'font:14px/1 monospace',
            'cursor:pointer',
            'border-radius:0 0 0 6px',
            'transition:color 0.15s',
        ].join(';') + ';';
        closeBtn.addEventListener('mouseenter', function () { closeBtn.style.color = '#fff'; });
        closeBtn.addEventListener('mouseleave', function () { closeBtn.style.color = '#8b949e'; });
        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            dismissFineWidget();
        });

        var iframe = document.createElement('iframe');
        iframe.src = 'this-is-fine.html';
        iframe.style.cssText = [
            'width:100%',
            'height:460px',
            'max-height:90vh',
            'border:none',
            'display:block',
        ].join(';') + ';';
        iframe.setAttribute('title', 'this is fine widget');
        iframe.setAttribute('loading', 'eager');

        dialog.appendChild(iframe);
        dialog.appendChild(closeBtn);
        _overlay.appendChild(dialog);
        document.body.appendChild(_overlay);

        requestAnimationFrame(function () {
            _overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        });

        _overlay.addEventListener('click', function (e) {
            if (e.target === _overlay) dismissFineWidget();
        });
    }

    function dismissFineWidget() {
        if (!_overlay) return;
        var dialog = _overlay.firstChild;
        if (dialog) dialog.style.transform = 'scale(0.95)';
        _overlay.style.opacity = '0';
        setTimeout(function () {
            if (_overlay && _overlay.parentNode) _overlay.parentNode.removeChild(_overlay);
            _overlay = null;
        }, 250);
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && _overlay) dismissFineWidget();
    });
}
