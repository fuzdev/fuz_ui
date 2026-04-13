import type {SvgData} from './Svg.svelte';

// SVG icon data for replacing character glyphs with scalable vector icons.
// Each export uses the `icon_` prefix and conforms to `SvgData`.
// Default viewBox is "0 0 100 100".

// --- Status ---

export const icon_unknown = {
	label: 'unknown, double question mark',
	paths: [
		{
			d: 'M12 34C10 6 46 2 46 26C46 36 38 38 34 46L34 56 22 56 22 46C22 36 16 36 12 34zM21 70a7 7 0 1 0 14 0 7 7 0 0 0-14 0zM56 34C54 6 90 2 90 26C90 36 82 38 78 46L78 56 66 56 66 46C66 36 60 36 56 34zM65 70a7 7 0 1 0 14 0 7 7 0 0 0-14 0z',
		},
	],
} satisfies SvgData;

export const icon_important = {
	label: 'important, question and exclamation',
	paths: [
		{
			d: 'M12 34C10 6 46 2 46 26C46 36 38 38 34 46L34 56 22 56 22 46C22 36 16 36 12 34zM21 70a7 7 0 1 0 14 0 7 7 0 0 0-14 0zM63 8L79 8 76 56 66 56zM65 70a7 7 0 1 0 14 0 7 7 0 0 0-14 0z',
		},
	],
} satisfies SvgData;

export const icon_info = {
	label: 'info circle',
	paths: [
		{
			d: 'M50 5a45 45 0 1 0 0 90 45 45 0 0 0 0-90zm0 10a35 35 0 1 1 0 70 35 35 0 0 1 0-70zm-5 15h10v10h-10zm0 15h10v25h-10z',
		},
	],
} satisfies SvgData;

// --- Actions ---

export const icon_add = {
	label: 'add, plus',
	paths: [{d: 'M45 15v30h-30v10h30v30h10v-30h30v-10h-30v-30z'}],
} satisfies SvgData;

export const icon_remove = {
	label: 'remove, x mark',
	paths: [
		{
			d: 'M26.5 19.4l-7.1 7.1L42.9 50 19.4 73.5l7.1 7.1L50 57.1l23.5 23.5 7.1-7.1L57.1 50l23.5-23.5-7.1-7.1L50 42.9z',
		},
	],
} satisfies SvgData;

export const icon_delete = {
	label: 'delete, x in square',
	paths: [
		{
			d: 'M10 10h80v80h-80zm10 10v60h60v-60zm8 15l7-7 15 15 15-15 7 7-15 15 15 15-7 7-15-15-15 15-7-7 15-15z',
		},
	],
} satisfies SvgData;

export const icon_clear = {
	label: 'clear, backspace',
	paths: [
		{
			d: 'M35 15l-25 35 25 35h55v-70zm8 22l7-7 13 13 13-13 7 7-13 13 13 13-7 7-13-13-13 13-7-7 13-13z',
		},
	],
} satisfies SvgData;

export const icon_restore = {
	label: 'restore, redo arrow',
	paths: [
		{
			d: 'M65 20l20 20-20 20v-12a30 30 0 0 0-30 30h-12a42 42 0 0 1 42-42z',
		},
	],
} satisfies SvgData;

export const icon_cancel = {
	label: 'cancel, circle with line',
	paths: [
		{
			d: 'M50 5a45 45 0 1 0 0 90 45 45 0 0 0 0-90zm0 10a35 35 0 1 1 0 70 35 35 0 1 1 0-70zM28 35l7-7 37 37-7 7z',
		},
	],
} satisfies SvgData;

export const icon_drag = {
	label: 'drag handle, three horizontal lines',
	paths: [{d: 'M20 25h60v8h-60zm0 17h60v8h-60zm0 17h60v8h-60z'}],
} satisfies SvgData;

export const icon_copy = {
	label: 'copy, overlapping squares',
	paths: [{d: 'M10 30h45v45h-45zm7 7v31h31v-31z'}, {d: 'M30 10h45v45h-45zm7 7v31h31v-31z'}],
} satisfies SvgData;

export const icon_paste = {
	label: 'paste, clipboard',
	paths: [
		{
			d: 'M35 5h30v10h15a5 5 0 0 1 5 5v65a5 5 0 0 1-5 5h-60a5 5 0 0 1-5-5v-65a5 5 0 0 1 5-5h15zm5 5v10h20v-10zm-15 10v60h50v-60h-10v10h-30v-10z',
		},
	],
} satisfies SvgData;

export const icon_reset = {
	label: 'reset, undo arrow',
	paths: [
		{
			d: 'M35 20l-20 20 20 20v-12a30 30 0 0 1 30 30h12a42 42 0 0 0-42-42z',
		},
	],
} satisfies SvgData;

export const icon_refresh = {
	label: 'refresh, circular arrow',
	paths: [{d: 'M70 15A40 40 0 1 1 30 15L36 26A28 28 0 1 0 64 26z'}, {d: 'M86 21L70 15 64 26z'}],
} satisfies SvgData;

export const icon_connect = {
	label: 'connect, link',
	paths: [
		{
			d: 'M30 40a15 15 0 0 0-15 15 15 15 0 0 0 15 15h10v10h-10a25 25 0 0 1-25-25 25 25 0 0 1 25-25h10v10zm30-10h10a25 25 0 0 1 25 25 25 25 0 0 1-25 25h-10v-10h10a15 15 0 0 0 15-15 15 15 0 0 0-15-15h-10zm-25 20h30v10h-30z',
		},
	],
} satisfies SvgData;

export const icon_disconnect = {
	label: 'disconnect, broken link',
	paths: [
		{
			d: 'M30 40a15 15 0 0 0-15 15 15 15 0 0 0 15 15h10v10h-10a25 25 0 0 1-25-25 25 25 0 0 1 25-25h10v10zm30-10h10a25 25 0 0 1 25 25 25 25 0 0 1-25 25h-10v-10h10a15 15 0 0 0 15-15 15 15 0 0 0-15-15h-10zM44 42l-4-8h8l4 8zM56 58l4 8h-8l-4-8z',
		},
	],
} satisfies SvgData;

export const icon_retry = {
	label: 'retry, counterclockwise arrow',
	paths: [{d: 'M30 15A40 40 0 1 0 70 15L64 26A28 28 0 1 1 36 26z'}, {d: 'M14 21L30 15 36 26z'}],
} satisfies SvgData;

export const icon_placeholder = {
	label: 'placeholder, return arrow',
	paths: [{d: 'M75 15v40h-40v15l-25-20 25-20v15h30v-30z'}],
} satisfies SvgData;

export const icon_send = {
	label: 'send, paper plane',
	paths: [{d: 'M10 85l80-35-80-35v27l55 8-55 8z'}],
} satisfies SvgData;

// --- Media ---

export const icon_play = {
	label: 'play',
	paths: [{d: 'M25 10l55 40-55 40z'}],
} satisfies SvgData;

export const icon_pause = {
	label: 'pause',
	paths: [{d: 'M25 15h15v70h-15zm35 0h15v70h-15z'}],
} satisfies SvgData;

// --- Validation ---

export const icon_checkmark = {
	label: 'checkmark',
	paths: [{d: 'M15 52l10-10 17 17 33-33 10 10-43 43z'}],
} satisfies SvgData;

export const icon_checkmark_heavy = {
	label: 'heavy checkmark',
	paths: [{d: 'M10 50l14-14 18 18 34-34 14 14-48 48z'}],
} satisfies SvgData;

export const icon_xmark = {
	label: 'x mark',
	paths: [
		{
			d: 'M26 19l-7 7 24 24-24 24 7 7 24-24 24 24 7-7-24-24 24-24-7-7-24 24z',
		},
	],
} satisfies SvgData;

export const icon_xmark_heavy = {
	label: 'heavy x mark',
	paths: [
		{
			d: 'M24 14l-10 10 26 26-26 26 10 10 26-26 26 26 10-10-26-26 26-26-10-10-26 26z',
		},
	],
} satisfies SvgData;

// --- Navigation ---

export const icon_download = {
	label: 'download arrow',
	paths: [{d: 'M45 10v40h-20l25 30 25-30h-20v-40zm-30 70v10h70v-10z'}],
} satisfies SvgData;

export const icon_error = {
	label: 'error, double exclamation',
	paths: [
		{
			d: 'M20 8L36 8 33 56 23 56zM21 70a7 7 0 1 0 14 0 7 7 0 0 0-14 0zM64 8L80 8 77 56 67 56zM65 70a7 7 0 1 0 14 0 7 7 0 0 0-14 0z',
		},
	],
} satisfies SvgData;

export const icon_chevron_up = {
	label: 'chevron up',
	paths: [{d: 'M50 33l35 28-5 7-30-24-30 24-5-7z'}],
} satisfies SvgData;

export const icon_chevron_right = {
	label: 'chevron right',
	paths: [{d: 'M67 50l-28 35-7-5 24-30-24-30 7-5z'}],
} satisfies SvgData;

export const icon_chevron_down = {
	label: 'chevron down',
	paths: [{d: 'M50 67l-35-28 5-7 30 24 30-24 5 7z'}],
} satisfies SvgData;

export const icon_chevron_left = {
	label: 'chevron left',
	paths: [{d: 'M33 50l28-35 7 5-24 30 24 30-7 5z'}],
} satisfies SvgData;

export const icon_double_chevron_left = {
	label: 'double chevron left',
	paths: [
		{
			d: 'M15 50l18-28 6 5-13 23 13 23-6 5zm30 0l18-28 6 5-13 23 13 23-6 5z',
		},
	],
} satisfies SvgData;

export const icon_double_chevron_right = {
	label: 'double chevron right',
	paths: [
		{
			d: 'M85 50l-18-28-6 5 13 23-13 23 6 5zm-30 0l-18-28-6 5 13 23-13 23 6 5z',
		},
	],
} satisfies SvgData;

// --- Editing ---

export const icon_edit = {
	label: 'edit, pencil',
	paths: [
		{
			d: 'M58 14l20 20-45 45-20-20zM13 59L10 82 33 79zM58 14l10-10 20 20-10 10z',
		},
	],
} satisfies SvgData;

export const icon_sort = {
	label: 'sort, up and down arrows',
	paths: [
		{
			d: 'M30 40l-20-25h12v-10h16v10h12zm40 20l20 25h-12v10h-16v-10h-12z',
		},
	],
} satisfies SvgData;

// --- Domain ---

export const icon_chat = {
	label: 'chat bubble',
	paths: [
		{
			d: 'M15 10h70a5 5 0 0 1 5 5v50a5 5 0 0 1-5 5h-40l-20 20v-20h-10a5 5 0 0 1-5-5v-50a5 5 0 0 1 5-5zm10 10v40h10v12l12-12h38v-40z',
		},
	],
} satisfies SvgData;

export const icon_thread = {
	label: 'thread, broken stacked lines',
	paths: [
		{
			d: 'M15 20h30v10h-30zm40 0h30v10h-30zm-40 20h30v10h-30zm40 0h30v10h-30zm-40 20h30v10h-30zm40 0h30v10h-30z',
		},
	],
} satisfies SvgData;

export const icon_turn = {
	label: 'turn, speech bracket',
	paths: [
		{
			d: 'M20 15h60v10h-60zm20 20h40v10h-40zm-20-5v35h10v-30h50v-5z',
		},
	],
} satisfies SvgData;

export const icon_file = {
	label: 'file, document',
	paths: [
		{
			d: 'M20 5h40l25 25v60a5 5 0 0 1-5 5h-60a5 5 0 0 1-5-5v-80a5 5 0 0 1 5-5zm5 10v70h50v-50h-20v-20zm30 0v15h15z',
		},
	],
} satisfies SvgData;

export const icon_list = {
	label: 'list, bulleted lines',
	paths: [
		{
			d: 'M15 20a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm12 0h58v8h-58zm-12 18a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm12 0h58v8h-58zm-12 18a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm12 0h58v8h-58zm-12 18a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm12 0h58v8h-58z',
		},
	],
} satisfies SvgData;

export const icon_directory = {
	label: 'directory, folder',
	paths: [
		{
			d: 'M10 15h30l10 10h40a5 5 0 0 1 5 5v50a5 5 0 0 1-5 5h-80a5 5 0 0 1-5-5v-60a5 5 0 0 1 5-5zm5 10v50h70v-40h-40l-10-10z',
		},
	],
} satisfies SvgData;

export const icon_create_file = {
	label: 'create file, document with plus',
	paths: [
		{
			d: 'M20 5h40l25 25v60a5 5 0 0 1-5 5h-60a5 5 0 0 1-5-5v-80a5 5 0 0 1 5-5zm5 10v70h50v-50h-20v-20zm15 30h8v10h10v8h-10v10h-8v-10h-10v-8h10z',
		},
	],
} satisfies SvgData;

export const icon_create_folder = {
	label: 'create folder, folder with plus',
	paths: [
		{
			d: 'M10 15h30l10 10h40a5 5 0 0 1 5 5v50a5 5 0 0 1-5 5h-80a5 5 0 0 1-5-5v-60a5 5 0 0 1 5-5zm5 10v50h70v-40h-40l-10-10zm25 15h10v10h10v10h-10v10h-10v-10h-10v-10h10z',
		},
	],
} satisfies SvgData;

export const icon_prompt = {
	label: 'prompt, chevron with cursor',
	paths: [{d: 'M10 25l30 25-30 25-8-10 18-15-18-15zm35 40h40v10h-40z'}],
} satisfies SvgData;

export const icon_part = {
	label: 'part, dashed vertical line',
	paths: [
		{
			d: 'M45 10h10v15h-10zm0 22h10v15h-10zm0 22h10v15h-10zm0 22h10v15h-10z',
		},
	],
} satisfies SvgData;

export const icon_provider = {
	label: 'provider, branching star in circle',
	paths: [
		{
			d: 'M50 5a45 45 0 1 0 0 90 45 45 0 0 0 0-90zm0 10a35 35 0 1 1 0 70 35 35 0 1 1 0-70zM47 25L50 30 53 25 53 46 70 35 67 40 73 41 55 50 73 59 67 60 70 65 53 54 53 75 50 70 47 75 47 54 30 65 33 60 27 59 45 50 27 41 33 40 30 35 47 46z',
		},
	],
} satisfies SvgData;

export const icon_model = {
	label: 'model, branching star',
	paths: [
		{
			d: 'M45 12L50 20 55 12 54 43 80 27 76 35 85 36 58 50 85 64 76 65 80 73 54 57 55 88 50 80 45 88 46 57 20 73 24 65 15 64 42 50 15 36 24 35 20 27 46 43z',
		},
	],
} satisfies SvgData;

export const icon_action = {
	label: 'action, lightning bolt',
	paths: [{d: 'M55 5l-30 45h20l-5 45 35-50h-20z'}],
} satisfies SvgData;

export const icon_view = {
	label: 'view, eye',
	paths: [
		{
			d: 'M50 20c-25 0-42 30-42 30s17 30 42 30 42-30 42-30-17-30-42-30zm0 10a20 20 0 1 1 0 40 20 20 0 0 1 0-40zm0 8a12 12 0 1 0 0 24 12 12 0 0 0 0-24z',
		},
	],
} satisfies SvgData;

export const icon_preview = {
	label: 'preview, concentric circles',
	paths: [
		{
			d: 'M50 10a40 40 0 1 0 0 80 40 40 0 0 0 0-80zm0 10a30 30 0 1 1 0 60 30 30 0 0 1 0-60zm0 10a20 20 0 1 0 0 40 20 20 0 0 0 0-40zm0 10a10 10 0 1 1 0 20 10 10 0 0 1 0-20z',
		},
	],
} satisfies SvgData;

export const icon_log = {
	label: 'log, scroll',
	paths: [
		{
			d: 'M20 10h50a10 10 0 0 1 10 10v60a10 10 0 0 1-10 10h-50a10 10 0 0 1-10-10v-60a10 10 0 0 1 10-10zm5 15v50h40v-50zm5 8h30v6h-30zm0 14h30v6h-30zm0 14h20v6h-20z',
		},
	],
} satisfies SvgData;

export const icon_tab = {
	label: 'tab, window frame',
	paths: [
		{
			d: 'M10 15h80v70h-80zm8 8v10h25v-10zm0 18v34h64v-34z',
		},
	],
} satisfies SvgData;

export const icon_project = {
	label: 'project, hexagon',
	paths: [
		{
			d: 'M50 5l40 23v44l-40 23-40-23v-44zm0 12l-30 17v34l30 17 30-17v-34z',
		},
	],
} satisfies SvgData;

export const icon_capability = {
	label: 'capability, wrench',
	paths: [
		{
			d: 'M72 8a28 28 0 0 0-25 40l-30 30a8 8 0 0 0 0 11l4 4a8 8 0 0 0 11 0l30-30a28 28 0 0 0 38-29l-14 14-12-4-4-12 14-14a28 28 0 0 0-12-10z',
		},
	],
} satisfies SvgData;

export const icon_settings = {
	label: 'settings, gear',
	paths: [
		{
			d: 'M43 9h14l2 12a35 35 0 0 1 10 6l11-5 7 12-9 8a35 35 0 0 1 0 12l9 8-7 12-11-5a35 35 0 0 1-10 6l-2 12h-14l-2-12a35 35 0 0 1-10-6l-11 5-7-12 9-8a35 35 0 0 1 0-12l-9-8 7-12 11 5a35 35 0 0 1 10-6zM50 35a15 15 0 1 0 0 30 15 15 0 0 0 0-30z',
		},
	],
} satisfies SvgData;

export const icon_domain = {
	label: 'domain, diamond',
	paths: [
		{
			d: 'M50 5l40 45-40 45-40-45zm0 15l-25 30 25 30 25-30z',
		},
	],
} satisfies SvgData;

export const icon_page = {
	label: 'page, browser window',
	paths: [
		{
			d: 'M10 10h80v80h-80zm8 8v12h64v-12zm0 20v44h64v-44z',
		},
	],
} satisfies SvgData;

// --- Space/Container ---

export const icon_space = {
	label: 'space, house',
	paths: [
		{
			d: 'M50 10l40 35h-12v40h-20v-25h-16v25h-20v-40h-12zm0 18l-20 17v30h8v-25h24v25h8v-30z',
		},
	],
} satisfies SvgData;

export const icon_desk = {
	label: 'desk, star in circle',
	paths: [
		{
			d: 'M50 5a45 45 0 1 0 0 90 45 45 0 0 0 0-90zm0 10a35 35 0 1 1 0 70 35 35 0 0 1 0-70zm0 8l8 16 18 3-13 13 3 18-16-8-16 8 3-18-13-13 18-3z',
		},
	],
} satisfies SvgData;

export const icon_pin = {
	label: 'pin, thumbtack',
	paths: [
		{
			d: 'M50 5a18 18 0 0 0-18 18c0 7 4 13 9 17l-6 18h30l-6-18c5-4 9-10 9-17a18 18 0 0 0-18-18zm-5 63h10v27h-10z',
		},
	],
} satisfies SvgData;

// --- System ---

export const icon_terminal = {
	label: 'terminal, command prompt',
	paths: [
		{
			d: 'M5 5h90v90h-90zm8 8v74h74v-74zm12 15l20 20-20 20-7-7 13-13-13-13zm25 35h30v8h-30z',
		},
	],
} satisfies SvgData;

export const icon_workspace = {
	label: 'workspace, grid',
	paths: [
		{
			d: 'M10 10h35v35h-35zm45 0h35v35h-35zm-45 45h35v35h-35zm45 0h35v35h-35z',
		},
	],
} satisfies SvgData;

export const icon_idea = {
	label: 'idea, lightbulb',
	paths: [
		{
			d: 'M50 5a30 30 0 0 0-30 30c0 12 7 22 15 28v12a5 5 0 0 0 5 5h20a5 5 0 0 0 5-5v-12c8-6 15-16 15-28a30 30 0 0 0-30-30zm0 12a18 18 0 0 1 18 18c0 8-5 15-12 20v8h-12v-8c-7-5-12-12-12-20a18 18 0 0 1 18-18zm-8 70h16v6h-16z',
		},
	],
} satisfies SvgData;

// --- Communication ---

export const icon_ping = {
	label: 'ping, circular arrow',
	paths: [
		{
			d: 'M50 15a35 35 0 1 1-25 10l7 7a24 24 0 1 0 18-6v10l-17-17 17-17v13z',
		},
	],
} satisfies SvgData;

export const icon_heartbeat = {
	label: 'heartbeat, pulse line',
	paths: [
		{
			d: 'M5 50h25l8-20 12 40 12-40 8 20h25v8h-30l-5-12-12 40-12-40-5 12h-26z',
		},
	],
} satisfies SvgData;

export const icon_response = {
	label: 'response, reply arrow',
	paths: [{d: 'M40 20l-30 30 30 30v-20h30c10 0 15 5 15 15v15h10v-15c0-20-10-30-25-30h-30z'}],
} satisfies SvgData;

export const icon_session = {
	label: 'session, hexagon with dot',
	paths: [
		{
			d: 'M50 5l40 23v44l-40 23-40-23v-44zm0 12l-30 17v34l30 17 30-17v-34zm0 20a13 13 0 1 0 0 26 13 13 0 0 0 0-26z',
		},
	],
} satisfies SvgData;

// --- Action Types ---

export const icon_action_type_local_call = {
	label: 'local call, right arrow',
	paths: [{d: 'M15 40h40v-15l30 25-30 25v-15h-40z'}],
} satisfies SvgData;

export const icon_action_type_remote_notification = {
	label: 'remote notification, arrow down to line',
	paths: [
		{
			d: 'M45 10h10v30h15l-20 30-20-30h15zM15 82h70v8h-70z',
		},
	],
} satisfies SvgData;

export const icon_action_type_request_response = {
	label: 'request response, bidirectional arrows',
	paths: [
		{
			d: 'M30 15l-20 20 20 20v-12h40v-16h-40zm40 30v12h-40v16h40v12l20-20z',
		},
	],
} satisfies SvgData;

// --- Links ---

export const icon_external_link = {
	label: 'external link, arrow out of box',
	paths: [
		{
			d: 'M70 5h25v25l-10-10-30 30-7-7 30-30zm-50 10h30v10h-30v50h50v-30h10v35a5 5 0 0 1-5 5h-60a5 5 0 0 1-5-5v-60a5 5 0 0 1 5-5z',
		},
	],
} satisfies SvgData;

export const icon_arrow_right = {
	label: 'arrow right',
	paths: [{d: 'M10 45h55v-15l25 20-25 20v-15h-55z'}],
} satisfies SvgData;

export const icon_arrow_left = {
	label: 'arrow left',
	paths: [{d: 'M90 45h-55v-15l-25 20 25 20v-15h55z'}],
} satisfies SvgData;

// --- Backend ---

export const icon_backend = {
	label: 'backend, server',
	paths: [
		{
			d: 'M15 10h70v25h-70zm8 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm15 0h30v10h-30zm-23 23h70v25h-70zm8 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm15 0h30v10h-30zm-23 23h70v25h-70zm8 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm15 0h30v10h-30z',
		},
	],
} satisfies SvgData;
