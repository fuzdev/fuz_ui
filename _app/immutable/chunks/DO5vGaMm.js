import{$ as e,Dt as t,Et as n,H as r,Mt as i,W as a,dt as o,ft as s,jt as c,k as l,mt as u,ot as d,pt as f,q as p,z as m}from"./DOrLPxpd.js";import{t as h}from"./BqEe8smv.js";import{t as g}from"./CldNTIjp.js";import{n as _}from"./BZ7-9P4C.js";import{t as v}from"./DceWGCRb.js";import{t as y}from"./DaAu4Gol.js";import{n as b,t as x}from"./BYZSwKWc.js";import{t as S}from"./TUcexmNC.js";var C=[{name:`default-src`,fallback:null,fallback_of:[`script-src`,`script-src-elem`,`script-src-attr`,`style-src`,`style-src-elem`,`style-src-attr`,`img-src`,`media-src`,`font-src`,`manifest-src`,`child-src`,`connect-src`,`worker-src`,`object-src`]},{name:`script-src`,fallback:[`default-src`],fallback_of:[`script-src-elem`,`script-src-attr`,`worker-src`]},{name:`script-src-elem`,fallback:[`script-src`,`default-src`],fallback_of:null},{name:`script-src-attr`,fallback:[`script-src`,`default-src`],fallback_of:null},{name:`style-src`,fallback:[`default-src`],fallback_of:[`style-src-elem`,`style-src-attr`]},{name:`style-src-elem`,fallback:[`style-src`,`default-src`],fallback_of:null},{name:`style-src-attr`,fallback:[`style-src`,`default-src`],fallback_of:null},{name:`img-src`,fallback:[`default-src`],fallback_of:null},{name:`media-src`,fallback:[`default-src`],fallback_of:null},{name:`font-src`,fallback:[`default-src`],fallback_of:null},{name:`manifest-src`,fallback:[`default-src`],fallback_of:null},{name:`child-src`,fallback:[`default-src`],fallback_of:[`frame-src`,`worker-src`]},{name:`connect-src`,fallback:[`default-src`],fallback_of:null},{name:`frame-src`,fallback:[`child-src`],fallback_of:null},{name:`frame-ancestors`,fallback:null,fallback_of:null},{name:`form-action`,fallback:null,fallback_of:null},{name:`worker-src`,fallback:[`child-src`,`script-src`,`default-src`],fallback_of:null},{name:`object-src`,fallback:[`default-src`],fallback_of:null},{name:`base-uri`,fallback:null,fallback_of:null},{name:`upgrade-insecure-requests`,fallback:null,fallback_of:null},{name:`report-to`,fallback:null,fallback_of:null},{name:`require-trusted-types-for`,fallback:null,fallback_of:null},{name:`trusted-types`,fallback:null,fallback_of:null},{name:`sandbox`,fallback:null,fallback_of:null}];new Map(C.map(e=>[e.name,e]));var w=a(`<!> <p>Three stages run in order, and each is independent. Use the one that matches your intent.</p> <ol><li><strong><!> <code>replace_defaults</code></strong> — the starting state. Omitted, it's <!>.
				Provided, it <em>replaces the library defaults wholesale</em>: exactly the directives you
				list, nothing inherited. <code></code> starts blank; <code>null</code> throws (avoid
				the null/undefined footgun where a conditional silently disables defaults).</li> <li><strong><code>extend</code></strong> — sources to append per directive, layered left to
				right. Values append (and deduplicate) to the result of <code>replace_defaults</code> and
				prior entries. Boolean directives (e.g. <code>upgrade-insecure-requests</code>) are excluded
				by the type. Only array-typed directives can be extended. Compose multiple shared maps in
				one array.</li> <li><strong><code>overrides</code></strong> — final-pass per-directive replace or remove.
				Highest precedence. Pass <code>null</code> to drop a directive from the output entirely.</li></ol>`,1),T=a(`<!> <p><code>extend</code> is the common path: take a starting state and add per-directive sources.
			Sources land only on the directives you name. There's no cross-directive promotion.</p> <!> <p>Multiple entries compose left to right, deduplicating across layers. Useful for combining a
			"shared lib" object with app-specific extras:</p> <!> <p>Default-deny directives (those whose default value is <code>['none']</code>, including <code>default-src</code>, <code>object-src</code>, <code>base-uri</code>, <code>script-src-attr</code>, and <code>child-src</code>) cannot be extended. Attempting to <code>extend</code> them throws. Opting in must go through <code>replace_defaults</code> or <code>overrides</code> so the opt-in is visible at the call site. Note that <code>overrides</code> cannot rescue an <code>extend</code> for a default-deny directive in
			the same call: extend runs first and throws before <code>overrides</code> would replace the
			value. Move the sources into <code>overrides</code> directly, or opt in via <code>replace_defaults</code> and then extend.</p>`,1),E=a(`<!> <p>The final-pass <code>overrides</code> option replaces a directive's value or removes it
			entirely. Highest precedence. Wins over <code>replace_defaults</code> and <code>extend</code>.</p> <!>`,1),D=a(`<!> <p><code>replace_defaults</code> sets the starting state. The default is the library's curated <!>. To use your own foundation, pass a
			complete map. <strong>Anything you don't list is absent from the starting state</strong>,
			including security defaults like <code>default-src: ['none']</code>. Use <code>extend</code> and <code>overrides</code> for per-directive tweaks while keeping the library defaults.</p> <!> <p>Use <code>overrides</code> for tweaks (replace one directive while keeping the library
			defaults), and <code>replace_defaults</code> for full ownership of the starting state. <code>null</code> is rejected (top-level or per-key). Omit the option for library defaults,
			pass <code></code> to start blank, or use <code>overrides</code> to remove a specific
			directive.</p>`,1),O=a(`<!> <p><!> validates inputs and outputs at build time.
			Misconfigurations throw rather than producing a silently broken policy.</p> <ul><li>Unknown directive keys in any of <code>replace_defaults</code>, <code>extend</code>, or <code>overrides</code> throw with the offending name.</li> <li>Extending a directive whose current value is <code>['none']</code> throws. Opt in via <code>replace_defaults</code> or <code>overrides</code> instead.</li> <li><code>null</code> for <code>replace_defaults</code> (top-level or per-key) throws. Omit the
				option for library defaults, pass <code></code> to start blank, or use <code>overrides</code> to remove a specific directive.</li> <li><code>null</code> per-key in <code>extend</code> throws with a pointer to <code>overrides</code>. <code>extend</code> only appends, so removal lives on <code>overrides</code>.</li> <li><code>undefined</code> per-key in any of the three stages is treated as omitted (no-op).
				This lets conditional patterns like <code></code> work naturally.</li> <li>Non-object entries in <code>extend</code> (e.g. <code>extend: [undefined]</code>) throw a
				library error pointing at the option, instead of a cryptic native <code>TypeError</code>.</li> <li>The output is validated to ensure <code>'none'</code> never appears alongside other tokens
				(an invalid CSP that browsers reject).</li> <li>The output is validated to ensure no directive ends up with an empty array. Use <code>['none']</code> to forbid all sources, or omit the directive entirely. Empty arrays
				can be silently dropped or fall back to <code>default-src</code>, widening the policy.</li> <li>Source arrays are validated to contain only strings. Non-string elements (slipped through
				via <code>as any</code>) would render as <code>undefined</code> or <code>[object Object]</code> in the emitted header.</li></ul>`,1),k=a(`<tr><td> </td><td> </td><td> </td></tr>`),A=a(`<!> <p>The exported <!> has JSON data about the <!>.
			Fuz omits deprecated directives.</p> <table><thead><tr><th>directive</th><th>fallback</th><th>fallback of</th></tr></thead><tbody></tbody></table>`,1),j=a(`<section><p>Fuz supports <a href="https://svelte.dev/docs/kit/configuration#csp">SvelteKit's config</a> for <!> with the <!> helper. Fuz also provides related
			helpers, types, and CSP data.</p> <p>The API is designed to read as an audit log: every user-added source is named at exactly one
			site in the source code. There's no implicit promotion of sources across directives. If you
			want a domain on <code>script-src</code>, you write <code>script-src</code>. Library defaults
			are inherited unless you opt out via <code>replace_defaults</code>.</p> <p>Example usage:</p> <!></section> <!> <!> <!> <!> <!> <!> <aside>For more, see the <!> and tests in <!>.</aside>`,1);function M(a,M){t(M,!0);let N=_(`csp`);v(a,{get tome(){return N},children:(t,n)=>{var a=j(),_=s(a),v=o(_),M=u(o(v),3);y(M,{path:`https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/ContentSecurityPolicy`,children:(e,t)=>{c();var n=p(`Content Security Policies`);r(e,n)},$$slots:{default:!0}});var N=u(M,2);S(N,{name:`create_csp_directives`}),c(),i(v);var P=u(v,6);h(P,{lang:`ts`,dangerous_raw_html:`<span class="token_special_keyword">import</span> <span class="token_punctuation">{</span>create_csp_directives<span class="token_punctuation">,</span> <span class="token_keyword">type</span> <span class="token_class_name">CspDirectives</span><span class="token_punctuation">}</span> <span class="token_special_keyword">from</span> <span class="token_string">'@fuzdev/fuz_ui/csp.js'</span><span class="token_punctuation">;</span>

<span class="token_comment">// Default CSP — restrictive defaults from \`csp_directive_value_defaults\`.</span>
<span class="token_keyword">const</span> csp <span class="token_operator">=</span> <span class="token_function">create_csp_directives</span><span class="token_punctuation">();</span>
<span class="token_comment">// Use in vite.config.ts:</span>
<span class="token_comment">// sveltekit({csp: {directives: csp}})</span>

<span class="token_comment">// Layer in your own sources per directive:</span>
<span class="token_keyword">const</span> csp_with_sources <span class="token_operator">=</span> <span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>
  extend<span class="token_operator">:</span> <span class="token_punctuation">[</span>
    <span class="token_punctuation">{</span>
      <span class="token_string_property token_property">'img-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://*.my.domain/'</span><span class="token_punctuation">],</span>
      <span class="token_string_property token_property">'connect-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://api.my.domain/'</span><span class="token_punctuation">],</span>
      <span class="token_comment">// Putting a source on script-src requires naming script-src here.</span>
      <span class="token_string_property token_property">'script-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://cdn.my.domain/'</span><span class="token_punctuation">],</span>
    <span class="token_punctuation">},</span>
  <span class="token_punctuation">],</span>
<span class="token_punctuation">});</span>

<span class="token_comment">// Compose multiple "shared lib" objects (e.g. a vendor's directive map plus your own):</span>
<span class="token_special_keyword">import</span> <span class="token_punctuation">{</span>csp_directives_of_fuzdev<span class="token_punctuation">}</span> <span class="token_special_keyword">from</span> <span class="token_string">'@fuzdev/fuz_ui/csp_of_fuzdev.js'</span><span class="token_punctuation">;</span>
<span class="token_keyword">const</span> csp_composed <span class="token_operator">=</span> <span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>
  extend<span class="token_operator">:</span> <span class="token_punctuation">[</span>
    csp_directives_of_fuzdev<span class="token_punctuation">,</span>
    <span class="token_punctuation">{</span><span class="token_string_property token_property">'connect-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://api.my.domain/'</span><span class="token_punctuation">]},</span>
  <span class="token_punctuation">],</span>
<span class="token_punctuation">});</span>

<span class="token_comment">// Replace a directive wholesale via the final-pass \`overrides\`:</span>
<span class="token_keyword">const</span> csp_replaced <span class="token_operator">=</span> <span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>
  extend<span class="token_operator">:</span> <span class="token_punctuation">[{</span><span class="token_string_property token_property">'connect-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://api.my.domain/'</span><span class="token_punctuation">]}],</span>
  overrides<span class="token_operator">:</span> <span class="token_punctuation">{</span>
    <span class="token_comment">// Wins over extend; \`null\` removes a directive entirely.</span>
    <span class="token_string_property token_property">'frame-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'none'</span><span class="token_punctuation">],</span>
    <span class="token_string_property token_property">'report-to'</span><span class="token_operator">:</span> <span class="token_keyword">null</span><span class="token_punctuation">,</span>
  <span class="token_punctuation">},</span>
<span class="token_punctuation">});</span>

<span class="token_comment">// Start from your own defaults instead of the library defaults:</span>
<span class="token_keyword">const</span> csp_custom_defaults <span class="token_operator">=</span> <span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>
  replace_defaults<span class="token_operator">:</span> <span class="token_punctuation">{</span>
    <span class="token_string_property token_property">'default-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'none'</span><span class="token_punctuation">],</span>
    <span class="token_string_property token_property">'script-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'self'</span><span class="token_punctuation">],</span>
    <span class="token_string_property token_property">'connect-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'self'</span><span class="token_punctuation">,</span> <span class="token_string">'https://api.my.domain/'</span><span class="token_punctuation">],</span>
  <span class="token_punctuation">},</span>
  <span class="token_comment">// \`extend\` and \`overrides\` still layer on top.</span>
<span class="token_punctuation">});</span>

<span class="token_comment">// Start blank — fully declarative, no library defaults at all:</span>
<span class="token_keyword">const</span> csp_blank <span class="token_operator">=</span> <span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>
  replace_defaults<span class="token_operator">:</span> <span class="token_punctuation">{},</span>
  overrides<span class="token_operator">:</span> <span class="token_punctuation">{</span>
    <span class="token_string_property token_property">'script-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'self'</span><span class="token_punctuation">],</span>
    <span class="token_string_property token_property">'img-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'self'</span><span class="token_punctuation">,</span> <span class="token_string">'data:'</span><span class="token_punctuation">],</span>
  <span class="token_punctuation">},</span>
<span class="token_punctuation">});</span>`}),i(_);var F=u(_,2);b(F,{children:(e,t)=>{var n=w(),a=s(n);x(a,{text:`Pipeline`});var l=u(a,4),d=o(l),f=o(d),p=o(f);S(p,{name:`CreateCspDirectivesOptions`}),c(2),i(f);var m=u(f,2);S(m,{name:`csp_directive_value_defaults`});var h=u(m,4);h.textContent=`{}`,c(3),i(d),c(4),i(l),r(e,n)},$$slots:{default:!0}});var I=u(F,2);b(I,{children:(e,t)=>{var n=T(),i=s(n);x(i,{text:`Adding sources via extend`});var a=u(i,4);h(a,{lang:`ts`,dangerous_raw_html:`<span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>
  extend<span class="token_operator">:</span> <span class="token_punctuation">[</span>
    <span class="token_punctuation">{</span>
      <span class="token_string_property token_property">'img-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://cdn.fuz.dev/'</span><span class="token_punctuation">],</span>
      <span class="token_string_property token_property">'connect-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://api.fuz.dev/'</span><span class="token_punctuation">],</span>
    <span class="token_punctuation">},</span>
  <span class="token_punctuation">],</span>
<span class="token_punctuation">});</span>`});var o=u(a,4);h(o,{lang:`ts`,dangerous_raw_html:`<span class="token_special_keyword">import</span> <span class="token_punctuation">{</span>csp_directives_of_fuzdev<span class="token_punctuation">}</span> <span class="token_special_keyword">from</span> <span class="token_string">'@fuzdev/fuz_ui/csp_of_fuzdev.js'</span><span class="token_punctuation">;</span>

<span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>
  extend<span class="token_operator">:</span> <span class="token_punctuation">[</span>
    csp_directives_of_fuzdev<span class="token_punctuation">,</span>
    <span class="token_punctuation">{</span>
      <span class="token_string_property token_property">'connect-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://api.fuz.dev/'</span><span class="token_punctuation">],</span>
      <span class="token_string_property token_property">'img-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://media.fuz.dev/'</span><span class="token_punctuation">],</span>
    <span class="token_punctuation">},</span>
  <span class="token_punctuation">],</span>
<span class="token_punctuation">});</span>`}),c(2),r(e,n)},$$slots:{default:!0}});var L=u(I,2);b(L,{children:(e,t)=>{var n=E(),i=s(n);x(i,{text:`Replacing values via overrides`});var a=u(i,4);h(a,{lang:`ts`,dangerous_raw_html:`<span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>
  extend<span class="token_operator">:</span> <span class="token_punctuation">[{</span><span class="token_string_property token_property">'connect-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://api.fuz.dev/'</span><span class="token_punctuation">]}],</span>
  overrides<span class="token_operator">:</span> <span class="token_punctuation">{</span>
    <span class="token_comment">// Wholesale replace — drops the connect-src extend output above.</span>
    <span class="token_string_property token_property">'connect-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'self'</span><span class="token_punctuation">],</span>

    <span class="token_comment">// Remove a directive entirely from the output.</span>
    <span class="token_string_property token_property">'report-to'</span><span class="token_operator">:</span> <span class="token_keyword">null</span><span class="token_punctuation">,</span>

    <span class="token_comment">// Set a default-deny directive's value explicitly.</span>
    <span class="token_string_property token_property">'object-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'none'</span><span class="token_punctuation">],</span>

    <span class="token_comment">// Boolean directives are supported.</span>
    <span class="token_string_property token_property">'upgrade-insecure-requests'</span><span class="token_operator">:</span> <span class="token_boolean">false</span><span class="token_punctuation">,</span>
  <span class="token_punctuation">},</span>
<span class="token_punctuation">});</span>`}),r(e,n)},$$slots:{default:!0}});var R=u(L,2);b(R,{children:(e,t)=>{var n=D(),a=s(n);x(a,{text:`Custom defaults via replace_defaults`});var l=u(a,2),d=u(o(l),2);S(d,{name:`csp_directive_value_defaults`}),c(9),i(l);var f=u(l,2);h(f,{lang:`ts`,dangerous_raw_html:`<span class="token_comment">// Fully declarative — no library defaults at all.</span>
<span class="token_keyword">const</span> csp <span class="token_operator">=</span> <span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>
  replace_defaults<span class="token_operator">:</span> <span class="token_punctuation">{</span>
    <span class="token_string_property token_property">'default-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'none'</span><span class="token_punctuation">],</span>
    <span class="token_string_property token_property">'script-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'self'</span><span class="token_punctuation">],</span>
    <span class="token_string_property token_property">'connect-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'self'</span><span class="token_punctuation">],</span>
  <span class="token_punctuation">},</span>
<span class="token_punctuation">});</span>
<span class="token_comment">// assert.deepEqual(csp, {</span>
<span class="token_comment">//   'default-src': ['none'],</span>
<span class="token_comment">//   'script-src': ['self'],</span>
<span class="token_comment">//   'connect-src': ['self'],</span>
<span class="token_comment">// });</span>

<span class="token_comment">// Same shape as a hand-written directives map — still gets input and output validation.</span>
<span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>replace_defaults<span class="token_operator">:</span> <span class="token_punctuation">{},</span> overrides<span class="token_operator">:</span> <span class="token_punctuation">{</span><span class="token_comment">/* ... */</span><span class="token_punctuation">}});</span>`});var p=u(f,2),m=u(o(p),7);m.textContent=`{}`,c(3),i(p),r(e,n)},$$slots:{default:!0}});var z=u(R,2);b(z,{children:(e,t)=>{var n=O(),a=s(n);x(a,{text:`Validation`});var l=u(a,2),d=o(l);S(d,{name:`create_csp_directives`}),c(),i(l);var f=u(l,2),p=u(o(f),4),m=u(o(p),4);m.textContent=`{}`,c(3),i(p);var h=u(p,4),g=u(o(h),2);g.textContent=`{'connect-src': is_prod ? [API_URL] : undefined}`,c(),i(h),c(8),i(f),r(e,n)},$$slots:{default:!0}});var B=u(z,2);b(B,{children:(t,n)=>{var a=A(),h=s(a);x(h,{text:`Directive specs`});var g=u(h,2),_=u(o(g));S(_,{name:`csp_directive_specs`});var v=u(_,2);y(v,{path:`Web/HTTP/Reference/Headers/Content-Security-Policy`,children:(e,t)=>{c();var n=p(`CSP directives`);r(e,n)},$$slots:{default:!0}}),c(),i(g);var b=u(g,2),w=u(o(b));l(w,21,()=>C,e=>e.name,(t,n)=>{var a=k(),s=o(a),c=f(s,!0),l=u(s),p=f(l,!0),h=u(l),g=f(h,!0);i(a),d((t,r)=>{m(c,e(n).name),m(p,t),m(g,r)},[()=>e(n).fallback?.join(`, `)||``,()=>e(n).fallback_of?.join(`, `)||``]),r(t,a)}),i(w),i(b),r(t,a)},$$slots:{default:!0}});var V=u(B,2),H=u(o(V));g(H,{path:`fuzdev/fuz_ui/blob/main/src/lib/csp.ts`,children:(e,t)=>{c();var n=p(`source code`);r(e,n)},$$slots:{default:!0}});var U=u(H,2);g(U,{path:`fuzdev/fuz_ui/tree/main/src/test`,children:(e,t)=>{c();var n=p(`src/test/csp.*.test.ts`);r(e,n)},$$slots:{default:!0}}),c(),i(V),r(t,a)},$$slots:{default:!0}}),n()}export{M as t};