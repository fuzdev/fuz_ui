import"../chunks/DsnmJJEf.js";import{p as qe,c as ze,f as u,a as v,i as M,b as r,s as e,d as s,n,r as t,j as E,u as ie,t as le,e as L,g as Y}from"../chunks/D3znixZ8.js";import{i as N}from"../chunks/Dr3J8KvJ.js";import{e as ce}from"../chunks/DdzsjrDj.js";import{C as q}from"../chunks/BgNuPRBO.js";import{G as ne}from"../chunks/C0eSe6WD.js";import{g as Ae}from"../chunks/D1iq-6uI.js";import{T as Ee}from"../chunks/h9dMOKty.js";import{M as de}from"../chunks/673sNx2k.js";import{T as D,a as O}from"../chunks/DDVHqbp2.js";import{D as y}from"../chunks/DAxAeKm8.js";const Ie=["low","medium","high"],je={"default-src":null,"script-src":"high","script-src-elem":"high","script-src-attr":null,"style-src":"medium","style-src-elem":"medium","style-src-attr":"medium","img-src":"low","media-src":"low","font-src":"low","manifest-src":null,"child-src":null,"connect-src":"medium","frame-src":"medium","frame-ancestors":"medium","form-action":"medium","worker-src":"medium","object-src":null,"base-uri":null,"upgrade-insecure-requests":null,"report-to":null,"require-trusted-types-for":null,"trusted-types":null,sandbox:null},ue=[{name:"default-src",fallback:null,fallback_of:["script-src","script-src-elem","script-src-attr","style-src","style-src-elem","style-src-attr","img-src","media-src","font-src","manifest-src","child-src","connect-src","worker-src","object-src"]},{name:"script-src",fallback:["default-src"],fallback_of:["script-src-elem","script-src-attr","worker-src"]},{name:"script-src-elem",fallback:["script-src","default-src"],fallback_of:null},{name:"script-src-attr",fallback:["script-src","default-src"],fallback_of:null},{name:"style-src",fallback:["default-src"],fallback_of:["style-src-elem","style-src-attr"]},{name:"style-src-elem",fallback:["style-src","default-src"],fallback_of:null},{name:"style-src-attr",fallback:["style-src","default-src"],fallback_of:null},{name:"img-src",fallback:["default-src"],fallback_of:null},{name:"media-src",fallback:["default-src"],fallback_of:null},{name:"font-src",fallback:["default-src"],fallback_of:null},{name:"manifest-src",fallback:["default-src"],fallback_of:null},{name:"child-src",fallback:["default-src"],fallback_of:["frame-src","worker-src"]},{name:"connect-src",fallback:["default-src"],fallback_of:null},{name:"frame-src",fallback:["child-src"],fallback_of:null},{name:"frame-ancestors",fallback:null,fallback_of:null},{name:"form-action",fallback:null,fallback_of:null},{name:"worker-src",fallback:["child-src","script-src","default-src"],fallback_of:null},{name:"object-src",fallback:["default-src"],fallback_of:null},{name:"base-uri",fallback:null,fallback_of:null},{name:"upgrade-insecure-requests",fallback:null,fallback_of:null},{name:"report-to",fallback:null,fallback_of:null},{name:"require-trusted-types-for",fallback:null,fallback_of:null},{name:"trusted-types",fallback:null,fallback_of:null},{name:"sandbox",fallback:null,fallback_of:null}];new Map(ue.map(o=>[o.name,o]));const H=o=>{if(o===null)return"null";if(o===void 0)return"undefined";const g=typeof o;return g==="string"?`'${o}'`:g==="number"||g==="boolean"?o+"":Array.isArray(o)?`[${o.map(H).join(", ")}]`:g==="object"?JSON.stringify(o):o+""};var Fe=u("<td>No trust - used for directives that don't support sources</td>"),Me=u("<td>Passive resources only - no script execution, no styling or UI control</td>"),Le=u(`<td>Content that may affect layout, styling, or embed external browsing contexts, but
								cannot directly run code in the page's JS execution environment</td>`),Ne=u("<td>Sources that can execute arbitrary code in the page's context</td>"),De=u("<tr><td><!></td><!><td><code> </code></td></tr>"),Oe=u(`<!> <p>Fuz provides an optional CSP abstraction with three trust levels (of type <!>) with tiers of escalating risk and implied permission. Sources can opt-in to blanket
			permissions at a specific level:</p> <!> <table><thead><tr><th class="white-space:nowrap">trust level</th><th>what it means</th><th>configured by <!></th></tr></thead><tbody></tbody></table> <p>The trust system introduces opt-in abstraction and indirection, and a downside of the design
			is that it encourages over-permissioning at each individual tier. The maintainers currently
			feel that this granularity with 3 tiers offers an intuitive base that gets most of the
			important questions right most of the time for most users, and additional safeguards are
			available for those that want tighter control or less chance of error.</p>`,1),Re=u(`<!> <p>The CSP helpers have a convenient, declarative API for defining directives per source. These
			override any defaults, and unlike <code>trust</code>, the <code>directives</code> do not depend
			on an abstraction layer, so WYSIWYG.</p> <!> <p>Explicit directives are additive with the trust system. For example, a source with <code>trust: 'low'</code> would normally not be allowed for <code>connect-src</code>, but you
			can explicitly permit this by including <code>connect-src</code> in the directives array.</p> <!>`,1),Be=u("<!> <p>The options <code>value_defaults_base</code> (defaults to <!>) and <code>required_trust_defaults_base</code> (defaults to <!>) afford full control over defaults:</p> <!>",1),Ge=u("<tr><td> </td><td> </td><td> </td></tr>"),Ue=u(`<!> <p>The exported <!> has JSON data about the <!>.
			Fuz omits deprecated directives.</p> <table><thead><tr><th>directive</th><th>fallback</th><th>fallback of</th></tr></thead><tbody></tbody></table>`,1),We=u(`<section><p>Fuz supports <a href="https://svelte.dev/docs/kit/configuration#csp">SvelteKit's config</a> for <!> with the <!> helper. Fuz also provides related helpers, types,
			and CSP data.</p> <p>The goal is to provide a simple trust modeling system that balances safety+security+privacy
			with ergonomics, helping users maintain secure policies without unhelpful burden or
			restriction. It's restrictive by default and easy to set granular overrides, and there's
			tiered grants for convenience.</p> <p>Example usage:</p> <!> <p>Auditability and transparency are key concerns for the API, but some features are designed to
			help you to trade away some directness for ergonomics, with the idea that we make it easy for
			nonexpert users to safely configure basic scenarios, and advanced users can opt into using the
			API with full declarative transparency (and more verbosity and information load).</p> <p>Fuz defines an optional system with three levels of trust/risk/sensitivity (low/medium/high, <!>) that can be configured for each trusted source to give blanket permissions at a specified
			tier. Granular overrides are straightforward and declarative.</p> <p>I'm trying to design for full customizability with clear, intuitive boundaries with escalating
			security and privacy implications. Fuz includes a debatable set of defaults, and input is
			appreciated to help tune the tradeoffs.</p></section> <!> <!> <!> <!> <aside>For more, see the <!> and <!>. The API
		feels near-complete, and includes full customization of the default directive values and trust
		levels. Some details may change and input is welcome.</aside>`,1);function ot(o,g){qe(g,!0);const fe=Ae("csp"),pe=ie(()=>[null].concat(Ie));Ee(o,{get tome(){return fe},children:(me,He)=>{var J=We(),R=v(J),B=s(R),K=e(s(B),3);de(K,{path:"https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/ContentSecurityPolicy",children:(l,k)=>{n();var a=M("Content Security Policies");r(l,a)},$$slots:{default:!0}});var ve=e(K,2);y(ve,{name:"create_csp_directives"}),n(),t(B);var Q=e(B,6);q(Q,{lang:"ts",content:`import {create_csp_directives, type CspSourceSpec} from '@fuzdev/fuz_ui/csp.js';

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
});`});var V=e(Q,4),_e=e(s(V));y(_e,{name:"CspTrustLevel"}),n(),t(V),n(2),t(R);var X=e(R,2);D(X,{children:(l,k)=>{var a=Oe(),d=v(a);O(d,{text:"Trust"});var i=e(d,2),p=e(s(i));y(p,{name:"CspTrustLevel"}),n(),t(i);var w=e(i,2);q(w,{content:`export const my_csp_trusted_sources: Array<CspSourceSpec> = [
	{source: 'https://a.domain/'}, // undefined \`trust\` - same as null
	{source: 'https://b.domain/', trust: null}, // no trust
	{source: 'https://c.domain/', trust: 'low'}, // passive resources only
	{source: 'https://d.domain/', trust: 'medium'}, // no script execution
	{source: 'https://e.domain/', trust: 'high'}, // arbitrary code execution
];`});var _=e(w,2),x=s(_),m=s(x),h=e(s(m),2),b=e(s(h));y(b,{name:"required_trust_defaults_base"}),t(h),t(m),t(x);var S=e(x);ce(S,20,()=>E(pe),z=>z,(z,f)=>{var A=De(),$=s(A),G=s($);{let c=ie(()=>H(f));q(G,{get content(){return E(c)}})}t($);var I=e($);{var U=c=>{var C=Fe();r(c,C)},be=c=>{var C=Y(),ge=v(C);{var ke=P=>{var j=Me();r(P,j)},we=P=>{var j=Y(),xe=v(j);{var Se=T=>{var F=Le();r(T,F)},$e=T=>{var F=Y(),Ce=v(F);{var Pe=W=>{var Te=Ne();r(W,Te)};N(Ce,W=>{f==="high"&&W(Pe)},!0)}r(T,F)};N(xe,T=>{f==="medium"?T(Se):T($e,!1)},!0)}r(P,j)};N(ge,P=>{f==="low"?P(ke):P(we,!1)},!0)}r(c,C)};N(I,c=>{f===null?c(U):c(be,!1)})}var ae=e(I),oe=s(ae),ye=s(oe,!0);t(oe),t(ae),t(A),le(c=>L(ye,c),[()=>Object.entries(je).filter(([c,C])=>C===f).map(([c])=>H(c)).join(", ")]),r(z,A)}),t(S),t(_),n(2),r(l,a)},$$slots:{default:!0}});var Z=e(X,2);D(Z,{children:(l,k)=>{var a=Re(),d=v(a);O(d,{text:"Explicit directives"});var i=e(d,4);q(i,{lang:"ts",content:`export const my_csp_trusted_sources: Array<CspSourceSpec> = [
	{source: 'https://a.domain/'}, // No explicit directives, will use trust level if any
	{source: 'https://b.domain/', directives: null}, // Explicitly no directives
	{source: 'https://c.domain/', directives: ['img-src']}, // Only use for images
	{source: 'https://d.domain/', directives: ['connect-src', 'font-src']}, // Allow for connections and fonts
];`});var p=e(i,4);q(p,{content:`// Example: explicitly allowing a source for specific directives regardless of trust
export const my_csp_trusted_sources: Array<CspSourceSpec> = [
	// Allow for specific directives (adds to what trust level allows):
	{source: 'https://a.domain/', trust: 'low', directives: ['connect-src']},
	
	// Trust-level provides baseline permissions, explicit directives add specific ones:
	{source: 'https://b.domain/', trust: 'medium', directives: ['script-src-elem']},
	
	// Both mechanisms work together - trust level provides baseline permissions
	// and explicit directives add specific permissions
];`,lang:"ts"}),r(l,a)},$$slots:{default:!0}});var ee=e(Z,2);D(ee,{children:(l,k)=>{var a=Be(),d=v(a);O(d,{text:"Base defaults"});var i=e(d,2),p=e(s(i),3);y(p,{name:"csp_directive_value_defaults"});var w=e(p,4);y(w,{name:"csp_directive_required_trust_defaults"}),n(),t(i);var _=e(i,2);q(_,{content:`// Start with completely empty defaults (fully declarative):
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
});`,lang:"ts"}),r(l,a)},$$slots:{default:!0}});var te=e(ee,2);D(te,{children:(l,k)=>{var a=Ue(),d=v(a);O(d,{text:"Directive specs"});var i=e(d,2),p=e(s(i));y(p,{name:"csp_directive_specs"});var w=e(p,2);de(w,{path:"Web/HTTP/Reference/Headers/Content-Security-Policy",children:(m,h)=>{n();var b=M("CSP directives");r(m,b)},$$slots:{default:!0}}),n(),t(i);var _=e(i,2),x=e(s(_));ce(x,21,()=>ue,m=>m.name,(m,h)=>{var b=Ge(),S=s(b),z=s(S,!0);t(S);var f=e(S),A=s(f,!0);t(f);var $=e(f),G=s($,!0);t($),t(b),le((I,U)=>{L(z,E(h).name),L(A,I),L(G,U)},[()=>E(h).fallback?.join(", ")||"",()=>E(h).fallback_of?.join(", ")||""]),r(m,b)}),t(x),t(_),r(l,a)},$$slots:{default:!0}});var se=e(te,2),re=e(s(se));ne(re,{path:"fuzdev/fuz_ui/blob/main/src/lib/csp.ts",children:(l,k)=>{n();var a=M("source code");r(l,a)},$$slots:{default:!0}});var he=e(re,2);ne(he,{path:"fuzdev/fuz_ui/blob/main/src/lib/csp.test.ts",children:(l,k)=>{n();var a=M("tests");r(l,a)},$$slots:{default:!0}}),n(),t(se),r(me,J)},$$slots:{default:!0}}),ze()}export{ot as component};
