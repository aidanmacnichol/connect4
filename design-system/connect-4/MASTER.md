# Connect 4 — Design System Master

> **LOGIC:** When building a screen, first check `design-system/connect-4/pages/[page].md`.
> If that file exists, its rules **override** this Master. Otherwise, follow this file.

---

**Project:** Connect 4 (multiplayer web)
**Stack:** React (`/web`)
**Generated:** 2026-07-27 (ui-ux-pro-max)
**Style direction:** Claymorphism primary + Vibrant & Block-based accents
**Existing MVP phases:** `idle` → `queued` → `playing` → `over`

---

## 1. Design thesis

A toy-like, soft-3D Connect 4 that feels like chunky plastic pieces on a clay board — playful and modern, not arcade-neon or dark esports.

| Pillar | From | How it shows up |
|--------|------|-----------------|
| Soft 3D / chunky | Claymorphism | Double shadows, thick borders, press-in buttons, rounded discs |
| Bold blocks of color | Vibrant & Block-based | Large player color fields, high-contrast Red/Yellow, generous gaps |
| Casual multiplayer | Product (Gaming) | Clear turn state, queue feedback, win celebration — never silent waits |

**Brand-first rule:** The wordmark **Connect 4** is the hero of the idle/lobby viewport — larger than any status line. The board is the hero during play.

---

## 2. Style synthesis

### Claymorphism (structure)

- Soft 3D, chunky, bubbly, toy-like
- Border radius: **16–24px** on panels/buttons; discs are **fully circular**
- Borders: **3–4px** solid, slightly darker than fill
- Shadows: **inner + outer** (no hard single drop shadows)
- Interaction: soft press **200ms ease-out**

### Vibrant & Block-based (energy)

- Bold geometric color blocks for player identity
- High contrast between Red / Yellow / Board blue
- Large type for brand + turn callouts (**32px+** for hero moments)
- Section gaps feel generous (**24–48px**), not cramped dashboard density
- Hover = color shift / shadow deepen — **not** layout-shifting scale

### Do not mix in

- Glassmorphism / heavy blur overlays
- Neon purple / indigo “AI default” themes
- Dark OLED esports chrome
- Pixel / 8-bit fonts
- Glow blooms, floating badge stickers on the board
- Emoji as icons

---

## 3. Color palette

Light clay canvas. Classic Connect 4 blue board. Saturated but matte clay discs (not neon).

### Core tokens

| Role | Hex | CSS variable | Usage |
|------|-----|--------------|--------|
| Background | `#E8F4FC` | `--color-bg` | Page wash (soft sky clay) |
| Background deep | `#D4EAF8` | `--color-bg-deep` | Gradient end / subtle pattern |
| Surface | `#F7FBFE` | `--color-surface` | Clay panels, modals |
| Surface inset | `#C5DFF0` | `--color-surface-inset` | Recessed wells, empty cells |
| Board | `#3B82C4` | `--color-board` | Game frame |
| Board border | `#2A5F94` | `--color-board-border` | Thick clay rim |
| Board highlight | `#5BA3D9` | `--color-board-highlight` | Top-edge light |
| Red (P1) | `#E23B3B` | `--color-red` | Discs, you-are-red |
| Red light | `#FF7A7A` | `--color-red-light` | Disc specular |
| Red deep | `#B91C1C` | `--color-red-deep` | Disc rim / border |
| Yellow (P2) | `#F0C42E` | `--color-yellow` | Discs, you-are-yellow |
| Yellow light | `#FFE38A` | `--color-yellow-light` | Disc specular |
| Yellow deep | `#C99700` | `--color-yellow-deep` | Disc rim / border |
| CTA | `#0D9488` | `--color-cta` | Find game / primary actions (teal — not purple) |
| CTA press | `#0F766E` | `--color-cta-press` | Active/pressed CTA |
| CTA soft | `#CCFBF1` | `--color-cta-soft` | Soft fill / secondary chip |
| Text | `#1E3A5F` | `--color-text` | Primary copy (≥ 4.5:1 on bg) |
| Text muted | `#5A7A9A` | `--color-text-muted` | Status, hints |
| Danger | `#DC2626` | `--color-danger` | Errors / disconnect |
| Success | `#16A34A` | `--color-success` | Win / connected ping |
| Focus ring | `#0D9488` | `--color-focus` | `:focus-visible` |

### Semantic mapping to game state

| State | Color cue (never color alone) |
|-------|-------------------------------|
| Your turn | Pulsing clay ring on board + label “Your turn” |
| Opponent turn | Dimmed column affordances + “Waiting…” |
| You are Red | Clay chip with disc swatch + word “Red” |
| You are Yellow | Clay chip with disc swatch + word “Yellow” |
| Queued | CTA soft panel + bouncing Loader icon |
| Error | Danger text + `aria-live` |

### Background atmosphere

```css
background:
  radial-gradient(ellipse 80% 50% at 50% -10%, #FFFFFF 0%, transparent 55%),
  radial-gradient(circle at 15% 80%, #B8E0F5 0%, transparent 40%),
  radial-gradient(circle at 85% 70%, #FFE8A3 0%, transparent 35%),
  var(--color-bg);
```

Soft sky + warm yellow wash — not flat single color, not purple mesh.

---

## 4. Typography

**Primary pairing (recommended):** Playful Creative — Fredoka + Nunito

| Role | Font | Weights | Size scale |
|------|------|---------|------------|
| Brand / Display | **Fredoka** | 600–700 | `clamp(2.5rem, 6vw, 3.75rem)` |
| Headings | **Fredoka** | 500–600 | `1.5–2rem` |
| Body / UI | **Nunito** | 400–600 | `1rem` / `1.125rem` |
| Status / meta | **Nunito** | 500–600 | `0.9375–1.125rem` |
| Hints / code | **Nunito** | 400 | `0.875rem` |

```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');

:root {
  --font-display: 'Fredoka', system-ui, sans-serif;
  --font-body: 'Nunito', system-ui, sans-serif;
}
```

**Letter-spacing:** Display +0.02em; body normal.  
**Line-height:** Body 1.45; display 1.1.

### Alternate (if more competitive tone later)

Russo One + Chakra Petch — **do not use** for v1; too esports for clay.

---

## 5. Spacing, radius, elevation

### Spacing

| Token | Value | Usage |
|-------|-------|--------|
| `--space-2xs` | `4px` | Hairline gaps |
| `--space-xs` | `8px` | Icon ↔ label |
| `--space-sm` | `12px` | Compact stacks |
| `--space-md` | `16px` | Default padding |
| `--space-lg` | `24px` | Panel padding |
| `--space-xl` | `32px` | Section gaps |
| `--space-2xl` | `48px` | Block-layout breathing room |
| `--space-3xl` | `64px` | Top/bottom page chrome |

### Radius

| Token | Value | Usage |
|-------|-------|--------|
| `--radius-sm` | `12px` | Small chips |
| `--radius-md` | `16px` | Buttons |
| `--radius-lg` | `20px` | Panels |
| `--radius-xl` | `24px` | Board frame |
| `--radius-disc` | `50%` | Cells / discs only |

### Clay shadows (required language)

```css
:root {
  /* Raised clay (buttons, board) */
  --shadow-clay-out:
    4px 4px 0 rgba(30, 58, 95, 0.12),
    0 8px 20px rgba(30, 58, 95, 0.10),
    inset 0 2px 0 rgba(255, 255, 255, 0.45);

  /* Pressed clay */
  --shadow-clay-in:
    inset 3px 3px 8px rgba(30, 58, 95, 0.18),
    inset -2px -2px 6px rgba(255, 255, 255, 0.5);

  /* Disc raised */
  --shadow-disc:
    inset -3px -3px 8px rgba(0, 0, 0, 0.18),
    inset 3px 3px 6px rgba(255, 255, 255, 0.35),
    2px 3px 0 rgba(0, 0, 0, 0.12);

  /* Empty cell well */
  --shadow-well:
    inset 3px 3px 8px rgba(30, 58, 95, 0.25),
    inset -1px -1px 4px rgba(255, 255, 255, 0.4);
}
```

Avoid flat Material-only shadows; every interactive surface should read as clay.

---

## 6. Motion & animation rules

### Timing tokens

| Token | Value | Use |
|-------|-------|-----|
| `--motion-fast` | `150ms` | Hover color, focus |
| `--motion-base` | `200ms` | Soft press, chip toggles |
| `--motion-slow` | `300ms` | Panel enter |
| `--motion-drop` | `420ms` | Disc drop into cell |
| `--motion-win` | `600ms` | Win pulse cycle |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default exits |
| `--ease-press` | `cubic-bezier(0.34, 1.2, 0.64, 1)` | Soft bounce press |
| `--ease-drop` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Disc gravity |

### Required motions (ship ≥ 3)

1. **Disc drop** — piece falls from top of column into cell (`--motion-drop`, `--ease-drop`); slight squash at land (scaleY 0.92 → 1, 120ms).
2. **Soft press** — primary buttons translateY(2px) + swap to `--shadow-clay-in` on `:active` (200ms).
3. **Turn pulse** — subtle outer ring opacity 0.35 ↔ 0.9 on “your turn” indicator (1.2s loop).
4. **Queue bounce** — Lucide `Loader` spin + status text fade pulse while `queued`.
5. **Win celebrate** — winning four discs scale 1 → 1.08 → 1 with highlight rim (respect reduced motion).

### Motion do / don’t

| Do | Don’t |
|----|--------|
| 150–300ms for UI chrome | >500ms for buttons/menus |
| Animate opacity/shadow/transform on self | Scale that shifts siblings / layout |
| Column hover highlight before drop | Instant disc appear with no motion |
| `prefers-reduced-motion: reduce` → opacity only | Ignore reduced motion |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Component specs

### Buttons

Chunky clay blocks — **not** pill-shaped (`border-radius: 16px`, not `9999px`).

| Variant | Fill | Border | Text |
|---------|------|--------|------|
| Primary (CTA) | `--color-cta` | 3px `--color-cta-press` | white |
| Secondary | `--color-surface` | 3px `--color-board-border` | `--color-text` |
| Danger / Cancel | `--color-surface` | 3px `--color-danger` | `--color-danger` |
| Disabled | 50% opacity | same | same — `cursor: not-allowed` |

```css
.btn {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 1.0625rem;
  min-height: 48px;          /* ≥ 44px touch */
  padding: 12px 28px;
  border-radius: var(--radius-md);
  border: 3px solid;
  box-shadow: var(--shadow-clay-out);
  transition:
    transform var(--motion-base) var(--ease-press),
    box-shadow var(--motion-base) var(--ease-out),
    background-color var(--motion-fast);
  cursor: pointer;
}

.btn:hover:not(:disabled) {
  filter: brightness(1.05);
}

.btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: var(--shadow-clay-in);
}

.btn:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
```

### Player chip

Small clay badge: disc swatch (16px) + capitalized color name. Used in meta row (“You are Red”).

### Status line

Nunito 600, `--color-text-muted`. Wrap in `aria-live="polite"` for phase / turn / error updates.

### Board

- 7×6 grid, gap `10–12px`, padding `16–20px`
- Frame: `--color-board`, radius `--radius-xl`, border 4px `--color-board-border`, `--shadow-clay-out`
- Empty cell: circular well, `--color-surface-inset`, `--shadow-well`
- Filled cell: radial gradient (light at 30% 30%) + `--shadow-disc`
- Column hit targets: full column clickable; min width on mobile keeps **≥ 44px** where possible (on narrow screens, enlarge board or use column buttons below)

### Column affordance

On your turn, hovering a column brightens empty wells in that column (board-highlight tint). Cursor `pointer`. Disabled when not your turn.

### Icons

**Lucide only** (outline, 24×24). Suggested:

| Need | Icon |
|------|------|
| Find / start | `Play` |
| Queued | `Loader` (`animate-spin`) |
| Cancel | `X` |
| Connected | `Wifi` / `Check` |
| Error | `XCircle` |
| Play again | `RotateCcw` |
| Info / hint | `Info` |

`aria-hidden="true"` on decorative icons; never emoji.

---

## 8. Screen map (aligned to current MVP)

| Phase | Screen intent | Dominant element |
|-------|---------------|------------------|
| `idle` | Brand + one CTA | **Connect 4** wordmark + Find game |
| `queued` | Waiting feedback | Soft clay panel + spinner + Cancel |
| `playing` | The game | Board + turn/meta strip |
| `over` | Result + replay | Result banner + Play again |

Keep one job per phase. No dashboard chrome, no secondary marketing blocks in the first viewport.

---

## 9. Layout principles

1. **One composition** — centered column: brand → status → actions → board.
2. **Max content width** ~ `min(100%, 28rem)` for chrome; board scales with viewport.
3. **Mobile-first** — stack vertically; board cells shrink but stay tappable; column index buttons optional helper, not required if cells/columns are large enough.
4. **Breakpoints:** 375 / 768 / 1024 / 1440 — verify no horizontal scroll.
5. **No cards for decoration** — clay panels only where they group interaction (queue panel, result panel).

---

## 10. Accessibility & UX rules

| Rule | Requirement |
|------|-------------|
| Contrast | Text ≥ 4.5:1 on backgrounds; discs distinguishable by color **and** label |
| Focus | Visible `:focus-visible` ring on all controls |
| Keyboard | Columns / cells are real `<button>`s (already in MVP — keep) |
| Live regions | Status, errors, turn changes → `aria-live="polite"` |
| Touch | Min 44×44px targets; ≥ 8px gap between adjacent controls |
| Loading | Any wait > 300ms shows spinner/status (queue, reconnect) |
| Empty / idle | Always show CTA + short helper — never blank board-only void without context |
| Color independence | Win line uses outline/pulse, not color alone |

---

## 11. CSS variable starter kit

```css
:root {
  --color-bg: #E8F4FC;
  --color-bg-deep: #D4EAF8;
  --color-surface: #F7FBFE;
  --color-surface-inset: #C5DFF0;
  --color-board: #3B82C4;
  --color-board-border: #2A5F94;
  --color-board-highlight: #5BA3D9;
  --color-red: #E23B3B;
  --color-red-light: #FF7A7A;
  --color-red-deep: #B91C1C;
  --color-yellow: #F0C42E;
  --color-yellow-light: #FFE38A;
  --color-yellow-deep: #C99700;
  --color-cta: #0D9488;
  --color-cta-press: #0F766E;
  --color-cta-soft: #CCFBF1;
  --color-text: #1E3A5F;
  --color-text-muted: #5A7A9A;
  --color-danger: #DC2626;
  --color-success: #16A34A;
  --color-focus: #0D9488;

  --font-display: 'Fredoka', system-ui, sans-serif;
  --font-body: 'Nunito', system-ui, sans-serif;

  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-xl: 24px;

  --motion-fast: 150ms;
  --motion-base: 200ms;
  --motion-drop: 420ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-press: cubic-bezier(0.34, 1.2, 0.64, 1);
  --ease-drop: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

---

## 12. Anti-patterns

- ❌ Generic flat blue SaaS board with no clay depth
- ❌ Purple / indigo gradient themes
- ❌ Dark neon esports UI
- ❌ Emoji icons
- ❌ Pill CTAs (`rounded-full`) for primary actions
- ❌ Hover `scale()` that reflows the grid
- ❌ Instant disc placement without drop motion
- ❌ Silent queue / reconnect with no spinner
- ❌ Color-only turn or win indication
- ❌ Removing focus outlines without a replacement ring
- ❌ Cards wrapping the entire page for no interaction reason

---

## 13. Implementation notes for `/web` MVP

Current UI already has: status, color tag, Find game / Cancel / Play again, board cell buttons, column buttons. When implementing this system later:

1. Replace `:root` colors in `App.css` with the token kit above.
2. Swap `Trebuchet MS` → Fredoka / Nunito.
3. Restyle `.board`, `.cell`, `.reset` as clay surfaces (keep structure).
4. Add disc-drop animation keyed off board updates (no React rewrite required for tokens-first pass).
5. Add Lucide icons beside CTAs; keep copy concise.

**Do not implement React UI in this design pass** — tokens + rules only until the build request.

---

## 14. Pre-delivery checklist

- [ ] No emojis as icons (Lucide SVG)
- [ ] `cursor: pointer` on all clickable elements
- [ ] Hover / press transitions 150–300ms
- [ ] Text contrast ≥ 4.5:1
- [ ] Visible `:focus-visible` rings
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375 / 768 / 1024 / 1440
- [ ] Touch targets ≥ 44px where feasible
- [ ] Status / turn / errors announced via `aria-live`
- [ ] Disc drop + soft press + turn pulse present
