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
export { default as ToggleButton, type ToggleButtonSize } from './components/ToggleButton.svelte';
export { default as Checkbox } from './components/Checkbox.svelte';
export { default as TextField } from './components/TextField.svelte';
export { default as SearchField } from './components/SearchField.svelte';
export { default as NumberField } from './components/NumberField.svelte';
export { default as RadioGroup } from './components/RadioGroup.svelte';
export { default as Radio } from './components/Radio.svelte';
export { default as Switch } from './components/Switch.svelte';
export { default as Slider } from './components/Slider.svelte';
export { default as Calendar } from './components/Calendar.svelte';
export { default as BanglaCalendar } from './components/BanglaCalendar.svelte';
export {
	toBangla,
	fromBangla,
	banglaMonthLength,
	toBanglaDigits,
	BANGLA_MONTHS,
	BANGLA_MONTHS_LATIN,
	BANGLA_WEEKDAYS,
	BANGLA_WEEKDAYS_SHORT,
	type BanglaDate
} from './utils/bangla-calendar.js';
export { default as DatePicker } from './components/DatePicker.svelte';
export { default as RangeCalendar, type DateRange } from './components/RangeCalendar.svelte';
export { default as DateRangePicker } from './components/DateRangePicker.svelte';
export { default as Tooltip } from './components/Tooltip.svelte';
export { default as Spinner } from './components/Spinner.svelte';
export { default as Progress } from './components/Progress.svelte';
export { default as Avatar } from './components/Avatar.svelte';
export { default as Breadcrumb, type Crumb } from './components/Breadcrumb.svelte';
export { default as Pagination } from './components/Pagination.svelte';
export { default as Badge, badgeVariants, type BadgeVariant } from './components/Badge.svelte';
export { default as Separator } from './components/Separator.svelte';
export { default as Toolbar } from './components/Toolbar.svelte';
export { default as ToolbarSeparator } from './components/ToolbarSeparator.svelte';
export { default as Toaster } from './components/Toaster.svelte';

// Accordion (compound)
export { default as Accordion } from './components/Accordion.svelte';
export { default as AccordionItem } from './components/AccordionItem.svelte';
export { default as AccordionTrigger } from './components/AccordionTrigger.svelte';
export { default as AccordionContent } from './components/AccordionContent.svelte';

// Collapsible (compound)
export { default as Collapsible } from './components/Collapsible.svelte';
export { default as CollapsibleTrigger } from './components/CollapsibleTrigger.svelte';
export { default as CollapsibleContent } from './components/CollapsibleContent.svelte';

// HoverCard (compound)
export { default as HoverCard } from './components/HoverCard.svelte';
export { default as HoverCardTrigger } from './components/HoverCardTrigger.svelte';
export { default as HoverCardContent } from './components/HoverCardContent.svelte';

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

// Command palette (compound)
export { default as Command } from './components/Command.svelte';
export { default as CommandDialog } from './components/CommandDialog.svelte';
export { default as CommandInput } from './components/CommandInput.svelte';
export { default as CommandList } from './components/CommandList.svelte';
export { default as CommandGroup } from './components/CommandGroup.svelte';
export { default as CommandItem } from './components/CommandItem.svelte';
export { default as CommandEmpty } from './components/CommandEmpty.svelte';
export { default as CommandSeparator } from './components/CommandSeparator.svelte';

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

// Sheet / Drawer — an edge-anchored modal. Reuses the Dialog root + parts
// (a sheet is a modal dialog); only the sliding content differs.
export { default as Sheet } from './components/Dialog.svelte';
export { default as SheetTrigger } from './components/DialogTrigger.svelte';
export { default as SheetContent } from './components/SheetContent.svelte';
export { default as SheetHeader } from './components/DialogHeader.svelte';
export { default as SheetTitle } from './components/DialogTitle.svelte';
export { default as SheetDescription } from './components/DialogDescription.svelte';
export { default as SheetFooter } from './components/DialogFooter.svelte';
export { default as SheetClose } from './components/DialogClose.svelte';

// Tabs (compound)
// List
export { default as List } from './components/List.svelte';
export { default as ListItem } from './components/ListItem.svelte';

// Chat / AI
export { default as MessageScroller } from './components/MessageScroller.svelte';
export { default as Message } from './components/Message.svelte';
export { default as MessagePart } from './components/MessagePart.svelte';
export { default as ToolCall } from './components/ToolCall.svelte';
export { default as Sources } from './components/Sources.svelte';
export { default as PromptInput } from './components/PromptInput.svelte';
export { default as Bubble, bubbleVariants, type BubbleVariant } from './components/Bubble.svelte';
export { default as Attachment } from './components/Attachment.svelte';
export { default as Marker } from './components/Marker.svelte';
export { default as Terminal } from './components/Terminal.svelte';
export { default as TerminalHeader } from './components/TerminalHeader.svelte';
export { default as TerminalLine } from './components/TerminalLine.svelte';
export { default as TerminalInput } from './components/TerminalInput.svelte';

// Table
export { default as Table } from './components/Table.svelte';
export { default as TableHeader } from './components/TableHeader.svelte';
export { default as TableBody } from './components/TableBody.svelte';
export { default as TableRow } from './components/TableRow.svelte';
export { default as TableHead } from './components/TableHead.svelte';
export { default as TableCell } from './components/TableCell.svelte';
export { default as TableCaption } from './components/TableCaption.svelte';

// DataTable — TanStack Table (table-core) utilities for Svelte 5
export { default as FlexRender } from './components/FlexRender.svelte';
export { createSvelteTable } from './utils/create-svelte-table.svelte.js';
export {
	renderComponent,
	renderSnippet,
	RenderComponentConfig,
	RenderSnippetConfig
} from './utils/render-helpers.js';

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
export { computePosition, type Placement, type Align } from './utils/position.js';

// State machines
export { createToggleState, type ToggleStateOptions } from './state/toggle.svelte.js';
export { createSortable, type SortableOptions, type SortablePosition } from './state/sortable.svelte.js';
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
