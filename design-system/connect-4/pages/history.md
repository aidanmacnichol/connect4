# Page override: History

> Overrides `MASTER.md` for the past-games replay screen (`/history`).

**Job:** List past matches + replay board. Board remains the visual hero; list is supporting chrome.

---

## Hierarchy

1. Left clay rail — **History** title + scrollable match cards  
2. Right stage — match date + result badge, then **board**, then scrubber  
3. No secondary stats, charts, or move chip clutter

---

## Layout

- Split: `~280px` rail + fluid stage  
- Rail: inset clay panel (`surface` + inset cards, thick border)  
- Active card: raised clay (`shadow-clay-out` + CTA border) — **no translate/scale hover**  
- Stage centered; board is the dominant block  
- Scrubber: one clay control bar under the board

---

## Result badges

Block-color pills (WIN / LOSS / DRAW) — color + label (not color alone).

---

## Motion

- Short enter on page/stage (`ease-out`, ~200–400ms)  
- Honor `prefers-reduced-motion`  
- No infinite decorative animation

---

## Do not

- Neon / purple / glass overlays (MASTER anti-patterns)  
- Dashboard density, card grids of boards  
- Move-by-move chip lists under the scrubber
