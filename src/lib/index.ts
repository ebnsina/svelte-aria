/**
 * svelte-aria — accessible, headless-first Svelte 5 components.
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
export { default as NumberField } from './components/NumberField.svelte';
export { default as RadioGroup } from './components/RadioGroup.svelte';
export { default as Radio } from './components/Radio.svelte';
export { default as Switch } from './components/Switch.svelte';
export { default as Slider } from './components/Slider.svelte';
export { default as Calendar } from './components/Calendar.svelte';
export { default as DatePicker } from './components/DatePicker.svelte';
export { default as Tooltip } from './components/Tooltip.svelte';
export { default as Spinner } from './components/Spinner.svelte';
export { default as Toaster } from './components/Toaster.svelte';

// Accordion (compound)
export { default as Accordion } from './components/Accordion.svelte';
export { default as AccordionItem } from './components/AccordionItem.svelte';
export { default as AccordionTrigger } from './components/AccordionTrigger.svelte';
export { default as AccordionContent } from './components/AccordionContent.svelte';

// Popover (compound)
export { default as Popover } from './components/Popover.svelte';
export { default as PopoverTrigger } from './components/PopoverTrigger.svelte';
export { default as PopoverContent } from './components/PopoverContent.svelte';

// Menu (compound)
export { default as Menu } from './components/Menu.svelte';
export { default as MenuTrigger } from './components/MenuTrigger.svelte';
export { default as MenuContent } from './components/MenuContent.svelte';
export { default as MenuItem } from './components/MenuItem.svelte';
export { default as MenuSeparator } from './components/MenuSeparator.svelte';

// ComboBox (compound)
export { default as ComboBox } from './components/ComboBox.svelte';
export { default as ComboBoxInput } from './components/ComboBoxInput.svelte';
export { default as ComboBoxContent } from './components/ComboBoxContent.svelte';
export { default as ComboBoxItem } from './components/ComboBoxItem.svelte';

// Select (compound)
export { default as Select } from './components/Select.svelte';
export { default as SelectTrigger } from './components/SelectTrigger.svelte';
export { default as SelectContent } from './components/SelectContent.svelte';
export { default as SelectItem } from './components/SelectItem.svelte';

// Tabs (compound)
export { default as Tabs } from './components/Tabs.svelte';
export { default as TabList } from './components/TabList.svelte';
export { default as Tab } from './components/Tab.svelte';
export { default as TabPanel } from './components/TabPanel.svelte';

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
export { computePosition, type Placement } from './utils/position.js';

// State machines
export { createToggleState, type ToggleStateOptions } from './state/toggle.svelte.js';
export {
	toast,
	toaster,
	type ToastType,
	type ToastOptions,
	type ToastItem,
	type ToastAction
} from './state/toast.svelte.js';

// Utilities
export { useId } from './utils/id.js';
export { cn } from './utils/cn.js';
export { combineAttachments, setDataAttr } from './utils/attachments.js';
