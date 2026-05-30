import type {Tome} from '$lib/tome.js';
import introduction from '$routes/docs/introduction/+page.svelte';
import ThemeRoot from '$routes/docs/ThemeRoot/+page.svelte';
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
import mdz from '$routes/docs/mdz/+page.svelte';

// TODO maybe decouple `related` from `Tome` to get bidirectionality for free

// TODO consider with auto-discovery and exported metadata per-component

// TODO maybe decouple related links from Tome to get bidirectionality for free

export const tomes: Array<Tome> = [
	{
		slug: 'introduction',
		category: 'guide',
		Component: introduction,
		related_tomes: ['api', 'svelte_preprocess_mdz'],
		related_modules: [],
		related_declarations: [],
	},
	{
		slug: 'theming',
		category: 'guide',
		Component: theming,
		related_tomes: ['ThemeRoot'],
		related_modules: ['theme_state.svelte.ts'],
		related_declarations: ['ThemeRoot', 'ThemeState'],
	},
	{
		slug: 'api',
		category: 'guide',
		Component: api,
		related_tomes: [],
		related_modules: [],
		related_declarations: [],
	},
	{
		slug: 'svelte_preprocess_mdz',
		category: 'helpers',
		Component: svelte_preprocess_mdz,
		related_tomes: ['mdz'],
		related_modules: ['svelte_preprocess_mdz.ts', 'mdz_to_svelte.ts'],
		related_declarations: ['svelte_preprocess_mdz', 'mdz_to_svelte', 'MdzPrecompiled'],
	},
	{
		slug: 'csp',
		category: 'helpers',
		Component: csp,
		related_tomes: [],
		related_modules: ['csp.ts'],
		related_declarations: [],
	},
	{
		slug: 'intersect',
		category: 'helpers',
		Component: intersect,
		related_tomes: [],
		related_modules: ['intersect.svelte.ts'],
		related_declarations: [],
	},
	{
		slug: 'logos',
		category: 'helpers',
		Component: logos,
		related_tomes: ['LibraryDetail', 'LibrarySummary', 'Svg'],
		related_modules: ['logos.ts'],
		related_declarations: [],
	},
	{
		slug: 'mdz',
		category: 'helpers',
		Component: mdz,
		related_tomes: ['svelte_preprocess_mdz'],
		related_modules: ['mdz.ts'],
		related_declarations: ['Mdz', 'mdz_parse', 'MdzNodeView'],
	},
	{
		slug: 'Alert',
		category: 'components',
		Component: Alert,
		related_tomes: ['Card'],
		related_modules: [],
		related_declarations: ['Alert'],
	},
	{
		slug: 'Breadcrumb',
		category: 'components',
		Component: Breadcrumb,
		related_tomes: ['Redirect'],
		related_modules: [],
		related_declarations: ['Breadcrumb'],
	},
	{
		slug: 'Card',
		category: 'components',
		Component: Card,
		related_tomes: ['Alert'],
		related_modules: [],
		related_declarations: ['Card'],
	},
	{
		slug: 'Contextmenu',
		category: 'components',
		Component: Contextmenu,
		related_tomes: [],
		related_modules: ['contextmenu_helpers.ts', 'contextmenu_state.svelte.ts'],
		related_declarations: ['Contextmenu', 'ContextmenuRoot', 'ContextmenuEntry'],
	},
	{
		slug: 'Details',
		category: 'components',
		Component: Details,
		related_tomes: [],
		related_modules: [],
		related_declarations: ['Details'],
	},
	{
		slug: 'Dialog',
		category: 'components',
		Component: Dialog,
		related_tomes: ['Teleport'],
		related_modules: ['dialog.ts'],
		related_declarations: ['Dialog', 'Dialogs'],
	},
	{
		slug: 'HueInput',
		category: 'components',
		Component: HueInput,
		related_tomes: [], // TODO externals?
		related_modules: [],
		related_declarations: ['HueInput'],
	},
	{
		slug: 'Docs',
		category: 'components',
		Component: Docs,
		related_tomes: [],
		related_modules: [],
		related_declarations: ['Docs'],
	},
	{
		slug: 'LibraryDetail',
		category: 'components',
		Component: LibraryDetail,
		related_tomes: ['api', 'logos', 'LibrarySummary'],
		related_modules: [],
		related_declarations: ['LibraryDetail'],
	},
	{
		slug: 'LibrarySummary',
		category: 'components',
		Component: LibrarySummary,
		related_tomes: ['api', 'logos', 'LibraryDetail'],
		related_modules: [],
		related_declarations: ['LibrarySummary'],
	},
	{
		slug: 'PendingAnimation',
		category: 'components',
		Component: PendingAnimation,
		related_tomes: ['PendingButton'],
		related_modules: [],
		related_declarations: ['PendingAnimation'],
	},
	{
		slug: 'PendingButton',
		category: 'components',
		Component: PendingButton,
		related_tomes: ['PendingAnimation'],
		related_modules: [],
		related_declarations: ['PendingButton'],
	},
	{
		slug: 'Redirect',
		category: 'components',
		Component: Redirect,
		related_tomes: ['Breadcrumb'],
		related_modules: [],
		related_declarations: ['Redirect'],
	},
	{
		slug: 'Svg',
		category: 'components',
		Component: Svg,
		related_tomes: ['logos'],
		related_modules: [],
		related_declarations: ['Svg'],
	},
	{
		slug: 'Teleport',
		category: 'components',
		Component: Teleport,
		related_tomes: ['Dialog'],
		related_modules: [],
		related_declarations: ['Teleport'],
	},
	{
		slug: 'ThemeRoot',
		category: 'components',
		Component: ThemeRoot,
		related_tomes: ['theming'],
		related_modules: [],
		related_declarations: ['ThemeRoot'],
	},
];
