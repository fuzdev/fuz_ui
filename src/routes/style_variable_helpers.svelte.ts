import type {StyleVariable} from '@fuzdev/fuz_css/variable.js';

import {create_context} from '$lib/context_helpers.js';

// TODO maybe change this to a generic wrapper class for any value?
// TODO @many add to $lib?
export class SelectedStyleVariable {
	value: StyleVariable | null = $state()!;

	constructor(initial: StyleVariable | null = null) {
		this.value = initial;
	}
}

export const selected_variable_context = create_context(() => new SelectedStyleVariable(null));
