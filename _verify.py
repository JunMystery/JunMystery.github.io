import os, re, sys

root = r'F:\Git\JunMystery.github.io'

errors = []

# Verify CSS @import paths
css_file = os.path.join(root, 'styles', 'main.css')
with open(css_file) as f:
    content = f.read()

imports = re.findall(r"@import url\('([^']+)'\)", content)
print('=== CSS @import checks ===')
for imp in imports:
    full = os.path.join(root, 'styles', imp)
    exists = os.path.exists(full)
    status = 'OK' if exists else 'MISSING'
    print(f'  {status}: styles/main.css -> {imp}')
    if not exists:
        errors.append(f'CSS: {imp}')

# Verify JS import paths
js_files = []
for dirpath, _, files in os.walk(os.path.join(root, 'src')):
    for f in files:
        if f.endswith('.js'):
            js_files.append(os.path.join(dirpath, f))

print()
print('=== JS import checks ===')
for jsf in sorted(js_files):
    with open(jsf) as f:
        content = f.read()
    imports = re.findall(r"from\s+['\"]([^'\"]+)['\"]", content)
    rel_dir = os.path.dirname(jsf)
    for imp in imports:
        full = os.path.normpath(os.path.join(rel_dir, imp))
        exists = os.path.exists(full)
        short = os.path.relpath(jsf, root).replace('\\', '/')
        short_imp = os.path.relpath(full, root).replace('\\', '/')
        status = 'OK' if exists else 'MISSING'
        print(f'  {status}: {short} -> {short_imp}')
        if not exists:
            errors.append(f'JS: {short} -> {imp}')

print()
if errors:
    print('ERRORS FOUND:')
    for e in errors:
        print(f'  - {e}')
    sys.exit(1)
else:
    print('All paths OK.')
