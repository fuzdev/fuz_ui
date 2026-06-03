import type {Url} from '@fuzdev/fuz_util/url.js';

import {create_context} from './context_helpers.js';
import type {SvgData} from './svg.js';

export interface SiteStateOptions {
	/**
	 * The site's icon, e.g. a logo from `logos.ts`.
	 */
	icon?: SvgData | null;
	/**
	 * The site's glyph, a single unicode character identifying the project.
	 */
	glyph?: string | null;
	/**
	 * The site's source repository url, e.g. for `DocsFooter` links.
	 */
	repo_url?: Url | null;
}

/**
 * Light site-identity values for app chrome - the icon, glyph, and repo url used
 * by components like `Breadcrumb` and `DocsFooter`. Set once per app at the root
 * layout. Distinct from `library_context`, which carries the heavy
 * module/declaration metadata that only docs and API pages need.
 */
export class SiteState {
	icon: SvgData | null = $state.raw(null);
	glyph: string | null = $state.raw(null);
	repo_url: Url | null = $state.raw(null);

	constructor(options: SiteStateOptions = {}) {
		this.icon = options.icon ?? null;
		this.glyph = options.glyph ?? null;
		this.repo_url = options.repo_url ?? null;
	}
}

export const site_context = create_context<SiteState>();
