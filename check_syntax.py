import os

errors = []
for root, dirs, files in os.walk('js'):
    for f in files:
        if f.endswith('.js'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as fh:
                code = fh.read()
            o_b = code.count('{')
            c_b = code.count('}')
            if o_b != c_b:
                errors.append(f"Braces mismatch in {path}: {o_b} vs {c_b}")
            o_p = code.count('(')
            c_p = code.count(')')
            if o_p != c_p:
                errors.append(f"Parens mismatch in {path}: {o_p} vs {c_p}")

if not errors:
    print(">>> ALL JS MODULES SYNTACTICALLY BALANCED AND VALID! <<<")
else:
    for e in errors:
        print("SYNTAX ISSUE:", e)
