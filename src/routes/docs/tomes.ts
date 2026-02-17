import type {Tome} from '$lib/tome.js';
import introduction from '$routes/docs/introduction/+page.svelte';
import Themed from '$routes/docs/Themed/+page.svelte';
import PendingAnimation from '$routes/docs/PendingAnimation/+page.svelte';
import PendingButton from '$routes/docs/PendingButton/+page.svelte';
import LibrarySummary from '$routes/docs/LibrarySummary/+page.svelte';
import LibraryDetail from '$routes/docs/LibraryDetail/+page.svelte';
import Details from '$routes/docs/Details/+page.svelte';
import Dialog from '$routes/docs/Dialog/+page.svelte';
import Teleport from '$routes/docs/Teleport/+page.svelte';
import Alert from '$routes/docs/Alert/+page.svelte';
import Docs from '$routes/docs/Docs/+page.svelte';
import Contextmenu from '$routes/docs/Contextmenu/+page.svelte';
import Redirect from '$routes/docs/Redirect/+page.svelte';
import HueInput from '$routes/docs/HueInput/+page.svelte';
import Breadcrumb from '$routes/docs/Breadcrumb/+page.svelte';
import Card from '$routes/docs/Card/+page.svelte';
import Svg from '$routes/docs/Svg/+page.svelte';
import csp from '$routes/docs/csp/+page.svelte';
import logos from '$routes/docs/logos/+page.svelte';
import theming from '$routes/docs/theming/+page.svelte';
import api from '$routes/docs/api/+page.svelte';
import intersect from '$routes/docs/intersect/+page.svelte';
import svelte_preprocess_mdz from '$routes/docs/svelte_preprocess_mdz/+page.svelte';
import vite_plugin_library_well_known from '$routes/docs/vite_plugin_library_well_known/+page.svelte';
import vite_plugin_library_json from '$routes/docs/vite_plugin_library_json/+page.svelte';
import mdz from '$routes/docs/mdz/+page.svelte';

// TODO maybe decouple `related` from `Tome` to get bidirectionality for free

// TODO consider with auto-discovery and exported metadata per-component

// TODO maybe decouple related links from Tome to get bidirectionality for free

export const tomes: Array<Tome> = [
	{
		name: 'introduction',
		category: 'guide',
		Component: introduction,
		related_tomes: ['api', 'svelte_preprocess_mdz'],
		related_modules: [],
		related_declarations: [],
	},
	{
		name: 'theming',
		category: 'guide',
		Component: theming,
		related_tomes: ['Themed'],
		related_modules: ['themer.svelte.ts'],
		related_declarations: ['Themed', 'Themer'],
	},
	{
		name: 'api',
		category: 'guide',
		Component: api,
		related_tomes: [],
		related_modules: [],
		related_declarations: [],
	},
	{
		name: 'svelte_preprocess_mdz',
		category: 'helpers',
		Component: svelte_preprocess_mdz,
		related_tomes: ['mdz'],
		related_modules: ['svelte_preprocess_mdz.ts', 'mdz_to_svelte.ts'],
		related_declarations: ['svelte_preprocess_mdz', 'mdz_to_svelte', 'MdzPrecompiled'],
	},
	{
		name: 'vite_plugin_library_json',
		category: 'helpers',
		Component: vite_plugin_library_json,
		related_tomes: ['vite_plugin_library_well_known', 'api', 'LibraryDetail', 'LibrarySummary'],
		related_modules: ['vite_plugin_library_json.ts', 'library_generate.ts'],
		related_declarations: [
			'vite_plugin_library_json',
			'library_collect_source_files_from_fs',
			'library_generate',
		],
	},
	{
		name: 'vite_plugin_library_well_known',
		category: 'helpers',
		Component: vite_plugin_library_well_known,
		related_tomes: ['vite_plugin_library_json', 'api', 'LibraryDetail', 'LibrarySummary'],
		related_modules: ['vite_plugin_library_well_known.ts', 'library_gen.ts'],
		related_declarations: ['vite_plugin_library_well_known', 'library_gen'],
	},
	{
		name: 'csp',
		category: 'helpers',
		Component: csp,
		related_tomes: [],
		related_modules: ['csp.ts'],
		related_declarations: [],
	},
	{
		name: 'intersect',
		category: 'helpers',
		Component: intersect,
		related_tomes: [],
		related_modules: ['intersect.svelte.ts'],
		related_declarations: [],
	},
	{
		name: 'logos',
		category: 'helpers',
		Component: logos,
		related_tomes: ['LibraryDetail', 'LibrarySummary', 'Svg'],
		related_modules: ['logos.ts'],
		related_declarations: [],
	},
	{
		name: 'mdz',
		category: 'helpers',
		Component: mdz,
		related_tomes: ['svelte_preprocess_mdz'],
		related_modules: ['mdz.ts'],
		related_declarations: ['Mdz', 'mdz_parse', 'MdzNodeView'],
	},
	{
		name: 'Alert',
		category: 'components',
		Component: Alert,
		related_tomes: ['Card'],
		related_modules: [],
		related_declarations: ['Alert'],
	},
	{
		name: 'Breadcrumb',
		category: 'components',
		Component: Breadcrumb,
		related_tomes: ['Redirect'],
		related_modules: [],
		related_declarations: ['Breadcrumb'],
	},
	{
		name: 'Card',
		category: 'components',
		Component: Card,
		related_tomes: ['Alert'],
		related_modules: [],
		related_declarations: ['Card'],
	},
	{
		name: 'Contextmenu',
		category: 'components',
		Component: Contextmenu,
		related_tomes: [],
		related_modules: ['contextmenu_helpers.ts', 'contextmenu_state.svelte.ts'],
		related_declarations: ['Contextmenu', 'ContextmenuRoot', 'ContextmenuEntry'],
	},
	{
		name: 'Details',
		category: 'components',
		Component: Details,
		related_tomes: [],
		related_modules: [],
		related_declarations: ['Details'],
	},
	{
		name: 'Dialog',
		category: 'components',
		Component: Dialog,
		related_tomes: ['Teleport'],
		related_modules: ['dialog.ts'],
		related_declarations: ['Dialog', 'Dialogs'],
	},
	{
		name: 'HueInput',
		category: 'components',
		Component: HueInput,
		related_tomes: [], // TODO externals?
		related_modules: [],
		related_declarations: ['HueInput'],
	},
	{
		name: 'Docs',
		category: 'components',
		Component: Docs,
		related_tomes: [],
		related_modules: [],
		related_declarations: ['Docs'],
	},
	{
		name: 'LibraryDetail',
		category: 'components',
		Component: LibraryDetail,
		related_tomes: ['api', 'logos', 'LibrarySummary', 'vite_plugin_library_well_known'],
		related_modules: [],
		related_declarations: ['LibraryDetail'],
	},
	{
		name: 'LibrarySummary',
		category: 'components',
		Component: LibrarySummary,
		related_tomes: ['api', 'logos', 'LibraryDetail', 'vite_plugin_library_well_known'],
		related_modules: [],
		related_declarations: ['LibrarySummary'],
	},
	{
		name: 'PendingAnimation',
		category: 'components',
		Component: PendingAnimation,
		related_tomes: ['PendingButton'],
		related_modules: [],
		related_declarations: ['PendingAnimation'],
	},
	{
		name: 'PendingButton',
		category: 'components',
		Component: PendingButton,
		related_tomes: ['PendingAnimation'],
		related_modules: [],
		related_declarations: ['PendingButton'],
	},
	{
		name: 'Redirect',
		category: 'components',
		Component: Redirect,
		related_tomes: ['Breadcrumb'],
		related_modules: [],
		related_declarations: ['Redirect'],
	},
	{
		name: 'Svg',
		category: 'components',
		Component: Svg,
		related_tomes: ['logos'],
		related_modules: [],
		related_declarations: ['Svg'],
	},
	{
		name: 'Teleport',
		category: 'components',
		Component: Teleport,
		related_tomes: ['Dialog'],
		related_modules: [],
		related_declarations: ['Teleport'],
	},
	{
		name: 'Themed',
		category: 'components',
		Component: Themed,
		related_tomes: ['theming'],
		related_modules: [],
		related_declarations: ['Themed'],
	},
];
