/**
 * Toggle state machine — the reactive core shared by Checkbox, Switch, and
 * toggle buttons. Framework logic only: no DOM, no ARIA, no styling.
 *
 * Supports both controlled (`checked` passed in) and uncontrolled
 * (`defaultChecked`) usage, mirroring React Aria's `useToggleState`.
 */

export interface ToggleStateOptions {
	/** Controlled value. When provided, the caller owns the state. */
	checked?: boolean;
	/** Initial value for uncontrolled usage. */
	defaultChecked?: boolean;
	/** Called with the next value whenever a toggle is requested. */
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
	readOnly?: boolean;
}

export function createToggleState(options: ToggleStateOptions = {}) {
	const isControlled = () => options.checked !== undefined;
	let internal = $state(options.defaultChecked ?? false);

	const checked = () => (isControlled() ? (options.checked as boolean) : internal);

	function setChecked(value: boolean) {
		if (options.disabled || options.readOnly) return;
		if (!isControlled()) internal = value;
		options.onChange?.(value);
	}

	return {
		get checked() {
			return checked();
		},
		toggle() {
			setChecked(!checked());
		},
		setChecked
	};
}
