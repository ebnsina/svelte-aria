# Contributing to svelte-aria

Thanks for your interest in svelte-aria — an accessible, headless-first Svelte 5
component library. The project cares about one thing above all: **rigorous,
correct interaction behaviour** (keyboard, pointer, touch, focus, ARIA) with a
Svelte-native API. Contributions are welcome as long as they hold that bar.

## Discussion or issue?

Pick the lightest-weight channel that fits:

- **Question / usage help** → [Discussions · Q&A](https://github.com/ebnsina/svelte-aria/discussions/categories/q-a).
  "How do I…", "is this a bug?", "what's the recommended way to…".
- **Open-ended idea / brainstorming** → [Discussions · Ideas](https://github.com/ebnsina/svelte-aria/discussions/categories/ideas).
  New component proposals and API sketches that aren't yet concrete.
- **Confirmed, reproducible bug** → open a **Bug report** issue.
- **Concrete, well-scoped feature** → open a **Feature request** issue.
- **A widget diverges from its WAI-ARIA APG pattern** → open an **Accessibility
  report** issue.

When in doubt, start a Discussion. It's easier to promote an idea to a tracked
issue than to reshape a half-formed issue.

## Filing a good bug

The single most valuable thing you can provide is a **minimal reproduction** — a
stripped-down REPL or StackBlitz that shows the defect and nothing else. Reports
without a reproduction usually can't be acted on. Include:

- what happened and what you expected,
- exact steps to reproduce,
- environment (svelte-aria version, Svelte version, browser + OS — and call out
  **mobile / iOS / Android**, since touch and pointer behaviour differ), and
- whether it affects **keyboard, screen readers, or focus** — accessibility
  regressions are treated as high priority.

## The accessibility bar

This is non-negotiable and shapes how every change is reviewed:

- **Every widget matches its WAI-ARIA APG pattern.** Roles, keyboard support,
  focus management, and ARIA state are validated against the authoritative
  Authoring Practices Guide pattern for that component before it's considered
  done.
- **Keyboard, focus, and roles are verified** — in the browser, not from code
  alone. Real roving DOM focus where the pattern calls for it; virtual focus via
  `aria-activedescendant` where it calls for that. Don't mix the two in one
  widget.
- **Modal vs non-modal overlays behave correctly** — modals trap Tab, set
  siblings `inert`, lock scroll, and restore focus to the trigger; non-modal
  overlays move focus in but don't trap.
- Any deliberate deviation from a pattern must be documented and justified.

## Styling conventions

- **Tokens, never hardcoded colours.** Use the `--sa-*` tokens and registered
  utilities so light, dark, and re-tinting all work. No raw hex, no `text-white`
  / `ring-black/10`, no Tailwind palette classes (`slate-*`, `sky-*`) in
  components. (Black scrims/overlays are the one allowed exception.)
- **State via `data-*`, not bespoke classes.** Expose interaction state as
  `data-pressed` / `data-hovered` / `data-focus-visible` / `data-selected` /
  `data-disabled` / `data-invalid` so styling stays declarative.
- **Focus** is drawn by the single global rule; don't add per-element focus
  styles or Tailwind `ring-*` / `focus-visible:*`.
- Components are modern, clean, and minimal — flat surfaces, light 1px borders,
  no skeuomorphic gloss or inset treatments. Keep peers symmetric: when you
  change a treatment (colour, radius, ring, shadow, hover, spacing), change
  every sibling that should match.

## Local development

```bash
npm install
npm run dev      # dev server runs on port 5200
```

Before opening a PR, both of these must pass:

```bash
npm run check    # must report 0 errors, 0 warnings
npm run prepack  # svelte-package + publint clean; verify dist/ ships the styles
```

And do a browser pass in **both light and dark themes** (and, where relevant,
with a non-default accent) with the console clean. Nothing is "done" from code
alone.

## Commits

Author every commit as `ebnsina <ebnsina.me@gmail.com>`. Do **not** add a
`Co-Authored-By` trailer or any other identity.

## Sample content

Placeholder people and datasets draw from the Islamic Golden Age (Ibn Sīnā,
al-Khwārizmī, Ibn al-Haytham, Fāṭima al-Fihrī, al-Bīrūnī…), themed scenarios
(e.g. a Bayt al-Hikma manuscript catalogue), and `.example` domains
(`bayt-al-hikma.example`). Include women scholars, and use `lang="ar" dir="rtl"`
where Arabic script appears.
