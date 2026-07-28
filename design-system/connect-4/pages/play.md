# Page override: Play (`playing`)

> Active multiplayer match — board is the hero.

**Phase:** `phase === 'playing'`  
**Job:** Clarity of turn + delightful disc drops. Chrome stays quiet.

---

## Hierarchy

1. Compact brand or omit (board owns attention)
2. Meta strip: player chip + turn label
3. **Board** (dominant)
4. Optional column index helpers (existing MVP) — clay mini-buttons
5. No competing CTAs mid-game

---

## Meta strip

```
[● Red]  You are Red  ·  Your turn
```

| State | Presentation |
|-------|----------------|
| Your turn | Label “Your turn” + pulsing clay ring around board (or top of board) |
| Opponent turn | “Waiting for opponent…” + column buttons disabled / dimmed 40% |
| Color | Chip with disc swatch + text (not color alone) |

`aria-live="polite"` for turn changes.

---

## Board interaction

1. Hover column → tint empty wells with `--color-board-highlight` at 25% overlay
2. Click → disc drop animation into target cell
3. On land → squash micro-bounce
4. Opponent move → same drop animation when board updates

**Cell sizes**

| Viewport | Cell | Gap |
|----------|------|-----|
| ≥ 768px | 3.25rem | 0.55rem |
| < 520px | 2.5rem | 0.4rem |

Prefer enlarging touch via full-column hit area over tiny circular-only targets.

---

## Motion (play-critical)

1. Disc drop `420ms` `--ease-drop`
2. Turn pulse `1.2s` loop while `myTurn`
3. Soft press on column buttons

Win detection may start on this screen before phase flips — if so, begin win-disc highlight immediately.

---

## Copy

| Element | Copy |
|---------|------|
| Your turn | Your turn |
| Wait | Waiting… |
| Meta | You are {Red\|Yellow} |

---

## Overrides vs Master

| Rule | Override |
|------|----------|
| Brand size | Demoted / optional |
| Dominant color | Board blue + your disc color |
| CTA | None (or leave room only for disconnect error) |
| Spacing | Tighter chrome; max air around board |
