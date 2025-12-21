import re
from z3 import Int, Optimize, Sum, sat

BTN_RE = re.compile(r"\(([^)]*)\)")
JOLT_RE = re.compile(r"\{([^}]*)\}")

def parse_line(line: str):
    jm = JOLT_RE.search(line)
    target = [int(x.strip()) for x in jm.group(1).split(",") if x.strip()]

    buttons = []
    for bm in BTN_RE.finditer(line):
        inside = bm.group(1).strip()
        if not inside:
            buttons.append([])
        else:
            buttons.append([int(x.strip()) for x in inside.split(",") if x.strip()])

    return buttons, target

def solve_machine(buttons, target) -> int:
    n = len(target)
    m = len(buttons)

    uses = [[] for _ in range(n)]
    for j, idxs in enumerate(buttons):
        for i in idxs:
            uses[i].append(j)

    opt = Optimize()

    x = [Int(f"x_{j}") for j in range(m)]
    for v in x:
        opt.add(v >= 0)

    for i in range(n):
        opt.add(Sum([x[j] for j in uses[i]]) == target[i])

    total = Sum(x)
    opt.minimize(total)
    opt.check()

    model = opt.model()
    return sum(model.eval(v).as_long() for v in x)

def main():
    with open("input.txt", "r", encoding="utf-8") as f:
        lines = [ln.strip() for ln in f if ln.strip()]

    grand_total = 0
    for ln in lines:
        buttons, target = parse_line(ln)
        grand_total += solve_machine(buttons, target)

    print(grand_total)

if __name__ == "__main__":
    main()