#!/bin/bash
set -e

SRC_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SRC_DIR/../.." && pwd)"
TEMPLATE="$SRC_DIR/index.template.html"
OUTPUT="$REPO_ROOT/index.html"

if [ ! -f "$TEMPLATE" ]; then
    echo "Template not found: $TEMPLATE"
    exit 1
fi

if command -v python3 >/dev/null 2>&1; then
    python3 -c "
import re, os, sys

src_dir = sys.argv[1]
template_path = sys.argv[2]
output_path = sys.argv[3]

def expand(text, base_dir, depth=0):
    if depth > 5:
        return text
    def repl(match):
        rel = match.group(1).strip()
        target = os.path.join(base_dir, rel)
        if not os.path.exists(target):
            raise FileNotFoundError(f'Include not found: {target}')
        with open(target, 'r', encoding='utf-8') as f:
            return expand(f.read(), base_dir, depth + 1)
    return re.sub(r'<!--\s*@include\s+([^\s]+)\s*-->', repl, text)

with open(template_path, 'r', encoding='utf-8') as f:
    content = f.read()

result = expand(content, src_dir).rstrip() + '\n'

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(result)
" "$SRC_DIR" "$TEMPLATE" "$OUTPUT"
else
    cp "$TEMPLATE" "$OUTPUT"
    for i in {1..5}; do
        match=$(grep -oE '<!--[[:space:]]*@include[[:space:]]+[^[:space:]]+[[:space:]]*-->' "$OUTPUT" | head -n 1 || true)
        [ -z "$match" ] && break
        file=$(echo "$match" | sed -E 's/<!--[[:space:]]*@include[[:space:]]+([^[:space:]]+)[[:space:]]*-->/\1/')
        file_path="$SRC_DIR/$file"
        [ ! -f "$file_path" ] && echo "Missing $file_path" && exit 1
        sed -i "/$match/{
            r $file_path
            d
        }" "$OUTPUT"
    done
fi

line_count=$(wc -l < "$OUTPUT")
echo "index.html generated: $OUTPUT ($line_count lines)"
