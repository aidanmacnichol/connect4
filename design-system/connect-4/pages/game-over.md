# Page override: Game over (`over`)

> Match finished — result clarity + replay.

**Phase:** `phase === 'over'`  
**Job:** Celebrate or console, then one clear next action.

---

## Hierarchy

1. Result banner (clay panel)
2. Final board (locked, winning discs highlighted)
3. **Play again** primary CTA
4. Optional: “You were Red/Yellow” chip

---

## Result banner

| Outcome | Panel fill | Border | Title |
|---------|------------|--------|-------|
| You win | `#DCFCE7` | `--color-success` | You win! |
| You lose | `#FEE2E2` | `--color-danger` | Opponent wins |
| Draw | `--color-surface` | `--color-board-border` | Draw |

Title: Fredoka 600, ~1.75–2rem.  
Announce via `aria-live="assertive"` once on enter.

---

## Board at end

- Cells not clickable (`disabled`)
- Winning four: rim highlight + scale pulse (`--motion-win`) using outline, not color swap alone
- Non-winning discs: slight opacity 0.85 so winners read first

---

## Motion

1. Banner slide/fade in 300ms
2. Win discs pulse 2–3 cycles then settle
3. Play again soft press

Reduced motion: static banner + static outline on winners.

---

## Copy

| Element | Copy |
|---------|------|
| Win | You win! |
| Loss | Nice try — opponent connected four. |
| Draw | Board’s full. Draw! |
| CTA | Play again |

---

## Overrides vs Master

| Rule | Override |
|------|----------|
| Primary CTA | Play again (teal) |
| Accent | Outcome-tinted panel |
| Board | Read-only showcase |
| Celebration | Allowed (bounded pulse) — still no emoji confetti |
