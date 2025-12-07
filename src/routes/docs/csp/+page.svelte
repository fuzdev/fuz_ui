<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import GithubLink from '$lib/GithubLink.svelte';
	import {get_tome_by_name} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import MdnLink from '$lib/MdnLink.svelte';
	import {
		csp_directive_required_trust_defaults,
		csp_directive_specs,
		csp_trust_levels,
	} from '$lib/csp.js';
	import {render_value_to_string} from '$lib/helpers.js';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';

	const LIBRARY_ITEM_NAME = 'csp';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);

	// TODO maybe subheadings, needs polish/reworking tho

	// TODO add a Svelte logo svg and make the below a special component that MdnLink also extends (MdnLink only exists because it has special inference logic for its href)
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<p>
			Fuz supports <a href="https://svelte.dev/docs/kit/configuration#csp">SvelteKit's config</a>
			for <MdnLink
				path="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/ContentSecurityPolicy"
				>Content Security Policies</MdnLink
			> with the
			<DeclarationLink name="create_csp_directives" /> helper. Fuz also provides related helpers, types,
			and CSP data.
		</p>
		<p>
			The goal is to provide a simple trust modeling system that balances safety+security+privacy
			with ergonomics, helping users maintain secure policies without unhelpful burden or
			restriction. It's restrictive by default and easy to set granular overrides, and there's
			tiered grants for convenience.
		</p>
		<p>Example usage:</p>
		<Code
			content={`import {create_csp_directives, type CspSourceSpec} from '@ryanatkn/fuz/csp.js';

// Create the default CSP with no trusted sources except 'self' and some sensible fallbacks.
// This tries to balance security and privacy with usability,
// helping nonexperts write secure policies while still supporting advanced users.
// More later on the details of the defaults.
const csp = create_csp_directives();
// Use in svelte.config.js:
// export default {kit: {csp}}

// Create a CSP with some trusted sources, using Fuz's CSP default trust levels:
export const my_csp_trusted_sources: Array<CspSourceSpec> = [
	// Trust in yourself:
	{source: 'https://my.domain/', trust: 'high'},
	// No scripting allowed on these subdomains:
	{source: 'https://*.my.domain/', trust: 'medium'}, 
	// Low but allow scripting:
	{source: 'https://me.github.io/', trust: 'low', directives: ['script-src-elem']},
];
const csp = create_csp_directives({
  trusted_sources: my_csp_trusted_sources,
});

// Create a CSP that opts out of using Fuz's trust abstraction:
create_csp_directives({
	directives: {
		'img-src': ['self', 'https://*.my.domain/'],
		// ...your explicit directives
	},
	// Simply omit \`trusted_sources\`,
	// but note the above directives extend the base defaults.
});

// Create a CSP with no hidden base defaults,
// so it's fully declarative and explicit,
// like not using Fuz's CSP helpers at all:
const precise_csp = create_csp_directives({
	value_defaults_base: null,
	required_trust_defaults_base: null,
	value_defaults: {
		'img-src': ['self', 'https://my.domain/'],
		'connect-src': ['self', 'https://my.domain/'],
	},
});
// assert.deepEqual(precise_csp, {
// 	'img-src': ['self', 'https://my.domain/'],
// 	'connect-src': ['self', 'https://my.domain/'],
// });

// Transform/extend directives by passing a function:
const custom_csp = create_csp_directives({
  trusted_sources: my_csp_trusted_sources,
  directives: {
    // Add additional domains to existing values:
    'img-src': (v) => [...v, 'trusted.domain'], // extend trusted sources

     // Or completely replace values:
    'connect-src': ['self', 'trusted.domain'], // no base trusted sources!
    'connect-src': () => ['self', 'trusted.domain'], // equivalent

    // Example opt-in to eval:
    'script-src-elem': (v) => [...v, 'unsafe-eval', 'wasm-unsafe-eval'], // alert alert

		// Returning \`undefined\` or \`null\` removes the directive,
		// all other values are passed through to SvelteKit.
  },
});`}
			lang="ts"
		/>
		<p>
			Auditability and transparency are key concerns for the API, but some features are designed to
			help you to trade away some directness for ergonomics, with the idea that we make it easy for
			nonexpert users to safely configure basic scenarios, and advanced users can opt into using the
			API with full declarative transparency (and more verbosity and information load).
		</p>
		<p>
			Fuz defines an optional system with three levels of trust/risk/sensitivity (low/medium/high, <DeclarationLink
				name="CspTrustLevel"
			/>) that can be configured for each trusted source to give blanket permissions at a specified
			tier. Granular overrides are straightforward and declarative.
		</p>
		<p>
			I'm trying to design for full customizability with clear, intuitive boundaries with escalating
			security and privacy implications. Fuz includes a debatable set of defaults, and input is
			appreciated to help tune the tradeoffs.
		</p>
	</section>

	<TomeSection>
		<TomeSectionHeader text="Trust" />
		<!-- TODO make this a header if it stabilizes -->
		<p>
			Fuz provides an optional CSP abstraction with three trust levels (of type <DeclarationLink
				name="CspTrustLevel"
			/>) with tiers of escalating risk and implied permission. Sources can opt-in to blanket
			permissions at a specific level:
		</p>
		<Code
			content={`export const my_csp_trusted_sources: Array<CspSourceSpec> = [
	{source: 'https://a.domain/'}, // undefined \`trust\` - same as null
	{source: 'https://b.domain/', trust: null}, // no trust
	{source: 'https://c.domain/', trust: 'low'}, // passive resources only
	{source: 'https://d.domain/', trust: 'medium'}, // no script execution
	{source: 'https://e.domain/', trust: 'high'}, // arbitrary code execution
];`}
		/>
		<table>
			<thead>
				<tr>
					<th class="white_space_nowrap">trust level</th>
					<th>what it means</th>
					<th>configured by <DeclarationLink name="required_trust_defaults_base" /></th>
				</tr>
			</thead>
			<tbody>
				{#each ([null] as typeof csp_trust_levels | Array<null>).concat(csp_trust_levels) as trust_level (trust_level)}
					<tr>
						<td><Code content={render_value_to_string(trust_level)} /></td>
						{#if trust_level === null}
							<td>No trust - used for directives that don't support sources</td>
						{:else if trust_level === 'low'}
							<td>Passive resources only - no script execution, no styling or UI control</td>
						{:else if trust_level === 'medium'}
							<td
								>Content that may affect layout, styling, or embed external browsing contexts, but
								cannot directly run code in the page's JS execution environment</td
							>
						{:else if trust_level === 'high'}
							<td>Sources that can execute arbitrary code in the page's context</td>
						{/if}
						<td>
							<!-- TODO convert to `Code`, needs a layout fix after Moss upgrade -->
							<code
								>{Object.entries(csp_directive_required_trust_defaults)
									.filter(([_, value]) => value === trust_level)
									.map(([key]) => render_value_to_string(key))
									.join(', ')}</code
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<p>
			The trust system introduces opt-in abstraction and indirection, and a downside of the design
			is that it encourages over-permissioning at each individual tier. The maintainers currently
			feel that this granularity with 3 tiers offers an intuitive base that gets most of the
			important questions right most of the time for most users, and additional safeguards are
			available for those that want tighter control or less chance of error.
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Explicit directives" />
		<!-- TODO make this a header if it stabilizes -->
		<p>
			The CSP helpers have a convenient, declarative API for defining directives per source. These
			override any defaults, and unlike <code>trust</code>, the <code>directives</code> do not depend
			on an abstraction layer, so WYSIWYG.
		</p>
		<Code
			content={`export const my_csp_trusted_sources: Array<CspSourceSpec> = [
	{source: 'https://a.domain/'}, // No explicit directives, will use trust level if any
	{source: 'https://b.domain/', directives: null}, // Explicitly no directives
	{source: 'https://c.domain/', directives: ['img-src']}, // Only use for images
	{source: 'https://d.domain/', directives: ['connect-src', 'font-src']}, // Allow for connections and fonts
];`}
			lang="ts"
		/>
		<p>
			Explicit directives are additive with the trust system. For example, a source with
			<code>trust: 'low'</code> would normally not be allowed for <code>connect-src</code>, but you
			can explicitly permit this by including <code>connect-src</code> in the directives array.
		</p>
		<Code
			content={`// Example: explicitly allowing a source for specific directives regardless of trust
export const my_csp_trusted_sources: Array<CspSourceSpec> = [
	// Allow for specific directives (adds to what trust level allows):
	{source: 'https://a.domain/', trust: 'low', directives: ['connect-src']},
	
	// Trust-level provides baseline permissions, explicit directives add specific ones:
	{source: 'https://b.domain/', trust: 'medium', directives: ['script-src-elem']},
	
	// Both mechanisms work together - trust level provides baseline permissions
	// and explicit directives add specific permissions
];`}
			lang="ts"
		/>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Base defaults" />
		<p>
			The options <code>value_defaults_base</code> (defaults to <DeclarationLink
				name="csp_directive_value_defaults"
			/>) and <code>required_trust_defaults_base</code> (defaults to <DeclarationLink
				name="csp_directive_required_trust_defaults"
			/>) afford full control over defaults:
		</p>

		<Code
			content={`// Start with completely empty defaults (fully declarative):
const minimal_csp = create_csp_directives({
	// Set both base values to null or {} to reset defaults
	value_defaults_base: null, // or {} for same effect
	required_trust_defaults_base: null, // or {} for same effect
	
	// Define only what you need
	value_defaults: {
		'script-src': ['self'],
		'img-src': ['self', 'data:'],
	},
});
// The above is equivalent to not using Fuz's CSP abstraction at all:
assert.deepEqual(minimal_csp, {
	'script-src': ['self'],
	'img-src': ['self', 'data:'],
});

// Use your own custom base value defaults:
create_csp_directives({
	// Define your own value defaults base
	value_defaults_base: {
		'default-src': ['none'],
		'script-src': ['self'],
		'img-src': ['self', 'data:'],
	},
	
	// Override specific directives in the base
	value_defaults: {
		'script-src': ['self', 'https://trusted.domain/'],
	}
});

// Set custom trust requirements for directives:
create_csp_directives({
	// Define your own trust requirements base
	required_trust_defaults_base: {
		'script-src': 'high',
		'connect-src': 'medium',
		'img-src': 'low',
	},
	
	// Source will be added based on your custom trust requirements
	trusted_sources: [
		// This source gets trusted for script-src and connect-src and no other directives.
		// If the \`required_trust_defaults_base\` were omitted, it would have the normal defaults.
		{source: 'https://somewhat.trusted.domain/', trust: 'medium'},
	]
});`}
			lang="ts"
		/>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Directive specs" />
		<p>
			<!-- TODO component for the `code` here to reference declaration -->
			The exported <DeclarationLink name="csp_directive_specs" /> has JSON data about the
			<MdnLink path="Web/HTTP/Reference/Headers/Content-Security-Policy">CSP directives</MdnLink>.
			Fuz omits deprecated directives.
		</p>
		<table>
			<thead>
				<tr>
					<th>directive</th>
					<th>fallback</th>
					<th>fallback of</th>
				</tr>
			</thead>
			<tbody>
				{#each csp_directive_specs as spec (spec.name)}
					<tr>
						<td>{spec.name}</td>
						<td>{spec.fallback?.join(', ') || ''}</td>
						<td>{spec.fallback_of?.join(', ') || ''}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</TomeSection>
	<aside>
		For more, see the <GithubLink path="ryanatkn/fuz/blob/main/src/lib/csp.ts"
			>source code</GithubLink
		>
		and <GithubLink path="ryanatkn/fuz/blob/main/src/lib/csp.test.ts">tests</GithubLink>. The API
		feels near-complete, and includes full customization of the default directive values and trust
		levels. Some details may change and input is welcome.
	</aside>
</TomeContent>
