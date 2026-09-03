import os
import re

pattern = re.compile(r'if\s*\(\s*window\.lucide\s*\)\s*\{\s*window\.lucide\.createIcons\([^)]*\);\s*\}')
replacement = 'if (window.lucide && typeof window.lucide.createIcons === "function") { try { window.lucide.createIcons(); } catch (e) {} }'

count = 0
for root, dirs, files in os.walk('js'):
    for f in files:
        if f.endswith('.js'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as fh:
                content = fh.read()
            new_content = pattern.sub(replacement, content)
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as fh:
                    fh.write(new_content)
                count += 1
                print(f"Updated: {path}")

print(f"\nTotal files updated: {count}")
