/**
 * svelte-aria — React Aria–level behaviour, Svelte-level DX.
 *
 * Public entry point. The library is layered:
 *   - primitives (attachments): press, hover, focusVisible
 *   - state machines (runes): toggle
 *   - components (Tailwind styled): Button, Checkbox, TextField
 * Import behaviour primitives to build your own components, or use the
 * ready-made components directly.
 */

// Components
export { default as Button, buttonVariants } from './components/Button.svelte';
export { default as Checkbox } from './components/Checkbox.svelte';
export { default as TextField } from './components/TextField.svelte';
export { default as RadioGroup } from './components/RadioGroup.svelte';
export { default as Radio } from './components/Radio.svelte';
export { default as Switch } from './components/Switch.svelte';
export { default as Spinner } from './components/Spinner.svelte';

// Dialog (compound)
export { default as Dialog } from './components/Dialog.svelte';
export { default as DialogTrigger } from './components/DialogTrigger.svelte';
export { default as DialogContent } from './components/DialogContent.svelte';
export { default as DialogTitle } from './components/DialogTitle.svelte';
export { default as DialogDescription } from './components/DialogDescription.svelte';
export { default as DialogHeader } from './components/DialogHeader.svelte';
export { default as DialogFooter } from './components/DialogFooter.svelte';
export { default as DialogClose } from './components/DialogClose.svelte';

// Primitives (attachments)
export { createPress, type PressEvent, type PressOptions } from './attachments/press.svelte.js';
export { createHover, type HoverOptions } from './attachments/hover.svelte.js';
export { createFocusVisible, type FocusOptions } from './attachments/focus.svelte.js';
export { createFocusScope } from './attachments/focus-scope.js';
export { portal } from './attachments/portal.js';

// State machines
export { createToggleState, type ToggleStateOptions } from './state/toggle.svelte.js';

// Utilities
export { useId } from './utils/id.js';
export { cn } from './utils/cn.js';
export { combineAttachments, setDataAttr } from './utils/attachments.js';
