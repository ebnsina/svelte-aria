# svelte-aria — project guide

Accessible, headless-first **Svelte 5** component library. Goal: rigorous,
correct interaction behaviour (keyboard, pointer, touch, focus, ARIA) with a
Svelte-native API — runes, attachments, snippets. Public-facing text presents
svelte-aria as fully independent; don't reference other libraries by name.

## Working principles (read first)

- **Apply symmetry. Don't patch one place and leave its siblings inconsistent.**
  Before changing a treatment (colour, radius, focus ring, shadow, hover,
  spacing), find every peer that should match and change them together. A fix
  that only lands in one component is a bug, not a fix.
- **Don't follow instructions literally when they'd break consistency.** If a
  request would make one element diverge from its peers, reconcile it across the
  set and say what you did. Verify the intent, then apply it symmetrically.
- **Verify in the browser, in both themes.** Every visual change is checked in
  light *and* dark (and, where relevant, with a non-default accent). Nothing is
  "done" from code alone.
- **Validate interaction behaviour against the canonical pattern.** At each
  component checkpoint, before it's "done", check its roles, keyboard support,
  and focus management against the authoritative accessible-behaviour pattern
  for that component (the WAI-ARIA Authoring Practices Guide, plus the behaviour
  benchmark tracked in `docs/`). Match the pattern — don't ship an interaction
  that diverges from the accepted a11y behaviour. Record any deliberate
  deviation and why.
- **Tokens, never hardcoded colours.** No `ring-black/10`, `text-white`,
  `#hex`, or Tailwind palette classes (`slate-*`, `sky-*`) in components or docs
  chrome. Use the `--sa-*` tokens / registered utilities so light, dark, and
  re-tinting all work. (Black scrims/overlays are the one allowed exception.)
- **State via `data-*`, not bespoke classes.** Interaction state is exposed as
  `data-pressed` / `data-hovered` / `data-focus-visible` / `data-selected` /
  `data-disabled` / `data-invalid` so styling stays declarative and the styled
  layer is swappable.
- **Sample/demo content draws from the Islamic Golden Age & Islamic culture.**
  Placeholder people are Golden-Age polymaths (Ibn Sīnā, al-Khwārizmī, Ibn
  al-Haytham, Fāṭima al-Fihrī, al-Bīrūnī, Omar Khayyām, Maryam al-Asṭurlābī…),
  and sample datasets/scenarios are themed to match (e.g. a Bayt al-Hikma —
  House of Wisdom — manuscript catalogue). Use `.example` domains
  (`bayt-al-hikma.example`). Prefer this over generic Western placeholders (Ada
  Lovelace, John Doe, Lorem ipsum). Include women scholars, and add Arabic
  script where it fits (with `lang="ar" dir="rtl"` for correct font + shaping).

## Architecture (layers)

```
primitives (attachments)  →  state (runes)  →  components  →  styles (tokens/CSS)
press · hover · focusVisible   toggle           Button/Checkbox/TextField/Spinner
```

- `src/lib/attachments/*.svelte.ts` — behaviour as Svelte **attachments**
  (`{@attach}`), Svelte 5.29+. They attach listeners and set `data-*`. Compose
  with `combineAttachments`.
- `src/lib/state/*.svelte.ts` — framework-only rune state machines (no DOM).
- `src/lib/components/*.svelte` — accessible components, **inline-Tailwind**:
  all styling lives in the `.svelte` file as Tailwind
  utilities so a copied component is self-contained and editable (ready for the
  planned CLI/registry). No shared component CSS. Variant/size maps + an
  exported `xVariants()` (cva pattern). Styling is driven by:
  - reactive runes (checked state) and `data-*` from primitives (`data-[pressed]`,
    `data-[hovered]`), and
  - native/CSS variants where the element is natively accessible:
    `peer-*`/`peer-focus-visible` (checkbox off its hidden input),
    `has-[:focus-visible]`/`hover:` (text field). Native controls (checkbox,
    text field) need **no** behaviour primitives; only custom pressables (Button)
    use them.
- `src/lib/styles/` — the design system:
  - `theme.css` — tokens (OKLCH, re-tintable). **Framework-agnostic.**
  - `tailwind.css` — the consumer preset: imports `theme.css` + `@theme`
    mapping tokens to utilities + `dark:` variant remap + the global
    `:focus-visible` rule. (No `components.css` — styling is inline per the
    inline model.)
- `src/lib/site/` — **docs-only** chrome (Sidebar, Topbar, CodeBlock, pickers…).
  Excluded from the published package (`files: !dist/site`). Not part of the API.
- `registry/` — the **CLI registry** (committed, public): `schema.ts` (manifest
  types), `registry.json` (every installable item + dependency graph),
  `README.md` (the design), and `build.ts` (the import rewriter → `dist/`,
  gitignored). The copy-paste distribution model. **When adding a component**:
  add a `registry:ui` item to `registry.json` with its `files` +
  `registryDependencies`, then run `npm run registry:build`.
- `cli/` — the **CLI** (`node cli/index.ts` / `npm run cli`): `init` (writes
  `components.json`, installs base = theme + cn, adds the `@import`), `add`
  (resolves the transitive tree from the registry, fills `{ui}/{lib}/{utils}`
  placeholders from the user's aliases, writes files, installs npm deps), and
  `list`. Import-graph correctness comes from the build's rewriter; the CLI just
  fills placeholders. Keep it strip-only TS (no param-properties/enums so
  `node` runs it directly).

## Design tokens & theming

- **Palette** — OKLCH, re-tintable via one variable
  `--sa-tint` (default `--sa-indigo`). The tint scale, `--sa-highlight-*`, focus
  ring, etc. all derive from it. Neutral gray carries a faint cool undertone.
- **Themes are explicit**: `data-theme="light" | "dark"` on `<html>`, seeded
  before paint by the inline script in `app.html` (from `localStorage` else OS).
  Dark styling is keyed to `:root[data-theme='dark']` — **never**
  `@media (prefers-color-scheme)** in component/theme CSS (it wouldn't follow the
  toggle). Light is the base.
- Docs controls: `theme.svelte.ts` (light/dark/system) and `accent.svelte.ts`
  (10 hues). Both persist + seed before paint.

### Shared visual conventions (keep these symmetric)

- **Radius:** use the token scale — `--sa-radius` 8px (`rounded-sa`),
  `--sa-radius-sm` 6px (`rounded-sa-sm`), `--sa-radius-lg` 10px
  (`rounded-sa-lg`). Circular only for opt-in icon buttons (`rounded-full`).
  Don't introduce raw `rounded-md/lg/xl/2xl`.
- **Focus:** one global rule in `styles/tailwind.css` (`@layer base`,
  `:where(...):focus-visible`) draws the accent ring (`outline: 2px`, offset
  `2px`) on **every** focusable element — inputs, textareas, selects, buttons,
  links, `[tabindex]`. Don't add per-element focus styles. The only exceptions
  are controls that move focus to a proxy element (checkbox indicator,
  text-field wrapper): those set `outline: none` on the real target and re-draw
  the ring on the visible part via `data-focus-visible` in `components.css`.
  Never use Tailwind `ring-*`/`focus-visible:*` for focus.
- **Elevation:** docs surfaces (cards/code/tables) use soft shadows
  (`--sa-shadow-sm/md`) + a `--sa-hairline` ring, not heavy borders; structural
  dividers use `--sa-hairline`.
- **Components are modern / clean / minimal**, NOT skeuomorphic. Flat surfaces, solid accent fills, **light 1px borders**
  (`--sa-gray-300`) on inputs/checkbox, no gloss/specular/inset treatments.
  Keep every control on this same flat system.
- **Hover surfaces:** `var(--sa-highlight-hover)`.
- **Disabled:** `opacity: 0.5` + `cursor: not-allowed` (don't recolour).

## Commits & repo hygiene

- Author **every** commit as `ebnsina <ebnsina.me@gmail.com>`
  (`git config user.name/user.email`). **No** `Co-Authored-By` trailer, no other
  identity.
- Remote uses the SSH host alias: `git@github-es:ebnsina/svelte-aria.git`.
- `docs/` and `data/` are **gitignored** (internal planning only — keep the
  public repo clean). Never commit plans/roadmaps/secrets.

## WAI-ARIA readiness (audited 2026-07-21)

Every widget was audited against its W3C **WAI-ARIA APG** pattern (roles,
keyboard, focus management, ARIA state) and the gaps fixed. Treat this as the
baseline: when you touch or add a component, keep it at ✅ and re-audit against
the APG pattern named below. **All widgets are ✅ Ready** as of the audit.

**Conventions that make the set conformant (keep these invariants):**

- **Focus model per role.** Real roving DOM focus for `menu`/`toolbar`/`tablist`
  /accordion headers/calendar grid (one tab stop, `tabindex` 0/-1, arrow keys in
  `TabList`/`Toolbar`/`Accordion`/`Calendar`). Virtual focus via
  `aria-activedescendant` (options stay `tabindex=-1`, DOM focus stays on the
  input) for `listbox`/`combobox` (`Select`, `ComboBox`, `Command`). Don't mix
  the two within one widget.
- **Modal vs non-modal overlays.** Modals (`Dialog`, `Sheet`, `CommandDialog`)
  trap Tab via `focus-scope.ts`, set sibling `inert` + scroll-lock, restore focus
  to the trigger, and dismiss on Esc/backdrop. Non-modal (`Popover`, `Tooltip`,
  `HoverCard`) move focus in but **don't** trap, and dismiss on Esc + outside
  press. `focus-scope.ts` / `PopoverContent` share one `FOCUSABLE` selector —
  it includes `[contenteditable]`; keep them in sync.
- **Every `role="dialog"` needs an accessible name.** `PopoverContent` defaults
  `aria-labelledby` to its trigger and accepts `aria-label`/`aria-labelledby` +
  an `initialFocus` selector (date pickers pass `aria-label` + focus the grid's
  active day `[data-key][tabindex='0']`). Same rule for `role="toolbar"` —
  `Toolbar` falls back to `aria-label="Toolbar"`.
- **Live regions never steal focus.** Streaming/updating content announces via
  `role="log"`/`status`/`alert` + `aria-live`, and only scrolls. `MessageScroller`
  uses `aria-relevant="additions"` (not `…text`) so streamed tokens don't re-read
  the whole history. `ToolCall` wraps its running→done/error icon in `role="status"`
  and gives the status icons `role="img"`. `Toaster`: `role="alert"` (assertive)
  for errors, `role="status"` (polite) otherwise.
- **Native semantics first.** `Checkbox`/`Switch`/`Radio`/`TextField`/`SearchField`
  are real inputs (native role + keyboard). Error path is uniform across fields:
  `aria-invalid` + `role="alert"` message + `aria-describedby` swap to the error.
  `NumberField` overrides role to `spinbutton`, so it must also set
  `aria-readonly` when read-only (native `readonly` alone won't convey).
- **Decorative glyphs/icons get `aria-hidden`** (terminal markers/prompt/cursor,
  chevrons, separators, breadcrumb/pagination dividers), and animations honour
  `motion-reduce:animate-none`. External links (`Sources`) carry a visually-hidden
  "(opens in a new tab)".
- **Grids** (`Calendar`/`RangeCalendar`/`BanglaCalendar`): `role="grid"`,
  `gridcell` on every cell (empty pads = `role="presentation"`), roving day,
  `aria-current="date"` on today, `aria-selected` on the selection.

**Documented deliberate deviations (not gaps):**

- **`HoverCard`** is an intentional *sighted-mouse* enhancement (like the
  reference hover-card pattern). Its trigger is a non-interactive wrapper, so it
  carries no `aria-expanded`/`aria-controls` and the card no dialog role — adding
  those would mislead (focus never enters). **Only use it for content that is
  duplicative** of a reachable control/link; never put unique/only-here info in it.
- **`List`** is a structural `role="list"` of individually-tabbable links/buttons
  — *not* a selectable `listbox`. Repurposing it for selection would need
  `listbox`/`option` + roving/`aria-selected`.
- **`Menu` Tab-dismiss** lands focus at end of document (portal limitation), not
  after the trigger. Esc and item-activation both return focus to the trigger
  correctly; only raw Tab-out has this quirk.
- **`NumberField`** exposes `role="spinbutton"` on a native `<input type=text>`
  (editable-spinbutton) — some SRs double-announce "edit text / spin button".
  Intentional and valid.

## Verify before "done"

1. `npm run check` — 0 errors, 0 warnings.
2. `npm run prepack` — `svelte-package` + `publint` clean; check `dist/` ships
   the styles.
3. Browser pass in **light and dark** (dev server on `:5200`), console clean.
4. **Behaviour parity** — keyboard, focus, and ARIA validated against the
   canonical pattern for that component (see `docs/component-checklist.md`).

## Stack

Svelte 5 (runes + attachments) · SvelteKit · Tailwind v4 (CSS-first) ·
`@lucide/svelte` icons · `clsx` + `tailwind-merge` (`cn`) · Mona Sans + Geist
Mono (docs). Node 24, pnpm/npm.
