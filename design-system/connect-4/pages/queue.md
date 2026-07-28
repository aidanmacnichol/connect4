# Page override: Queue (`queued`)

> Waiting for an opponent after Find game.

**Phase:** `phase === 'queued'`  
**Job:** Reassure the wait. Make cancel obvious. Never look frozen.

---

## Hierarchy

1. Brand (smaller than lobby — Fredoka 600, ~2rem)
2. Clay status panel (`--color-cta-soft` fill, 3px teal border)
3. Lucide `Loader` spinning + “Looking for an opponent…”
4. **Cancel search** secondary/danger-outline button
5. Board optional / dimmed

---

## Status panel

```
[ Loader ]  Looking for an opponent…
            Usually under a few seconds
```

- `aria-live="polite"` on the status text
- Panel radius `--radius-lg`, padding `--space-lg`
- Soft pulse on panel border opacity (1.5s loop) — reduced-motion: static

---

## Motion

| Element | Animation |
|---------|-----------|
| Loader | CSS spin 0.9s linear infinite |
| Status text | Opacity 0.65 ↔ 1, 1.2s ease |
| Cancel | Soft press |

---

## Copy

| Element | Copy |
|---------|------|
| Status | Looking for an opponent… |
| Helper | Hang tight — matching you now. |
| CTA | Cancel search |

---

## Overrides vs Master

| Rule | Override |
|------|----------|
| Primary action | Cancel (outline) — not Find game |
| Accent | Teal soft panel, not player colors |
| Feedback | Mandatory spinner for any wait > 300ms |
