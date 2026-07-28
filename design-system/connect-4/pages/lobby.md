# Page override: Lobby (`idle`)

> Overrides `MASTER.md` for the disconnected / idle matchmaking entry screen.

**Phase:** `phase === 'idle'`  
**Job:** One composition — brand hero + single CTA. No board-as-decoration overload.

---

## Hierarchy (first viewport)

1. **Connect 4** — Fredoka 700, hero size (`clamp(2.5rem, 6vw, 3.75rem)`), `--color-text`
2. One short supporting line — e.g. “Drop in. Outplay. Connect four.”
3. Connection meta (small) — Connected / Reconnecting
4. **Find game** primary CTA (teal clay)
5. Optional muted hint (dev/server) below fold or de-emphasized

Do **not** put stats, “how to play” walls, or secondary promos in the first viewport.

---

## Board treatment

- Show an empty board as a quiet visual anchor **below** the CTA, or hide until queued/playing.
- Prefer: empty clay board at ~90% opacity, non-interactive (`pointer-events: none`), to preview the toy.
- If shown: no column glow, no turn pulse.

---

## Motion

- CTA soft press on click
- Optional: staggered fade-in of brand → line → CTA (300ms, `--ease-out`)
- No continuous neon patterns

---

## Copy

| Element | Copy |
|---------|------|
| Brand | Connect 4 |
| Support | Drop discs. Beat a stranger. |
| CTA | Find game |
| Disabled CTA | Connecting… |

---

## Overrides vs Master

| Token / rule | Override |
|--------------|----------|
| Dominant color | CTA teal + brand text — not Red/Yellow yet |
| Board | Decorative only if present |
| Density | Extra `--space-2xl` between brand and CTA |
