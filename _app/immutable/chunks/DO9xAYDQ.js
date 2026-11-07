import{$ as e,At as t,H as n,Tt as r,W as i,dt as a,ft as o,k as s,kt as c,mt as l,ot as u,pt as d,q as f,wt as p,z as m}from"./C_nzkTy7.js";import{n as h}from"./Baly6eRw.js";import{t as g}from"./CBGvIykk.js";import{t as _}from"./CfV4cyHc.js";import{t as v}from"./DGpKSiKa.js";import{n as y,t as b}from"./Cq6Qapn3.js";import{t as x}from"./D-TU2hIY.js";import{t as S}from"./DXPBn3JQ.js";var C=[{name:`default-src`,fallback:null,fallback_of:[`script-src`,`script-src-elem`,`script-src-attr`,`style-src`,`style-src-elem`,`style-src-attr`,`img-src`,`media-src`,`font-src`,`manifest-src`,`child-src`,`connect-src`,`worker-src`,`object-src`]},{name:`script-src`,fallback:[`default-src`],fallback_of:[`script-src-elem`,`script-src-attr`,`worker-src`]},{name:`script-src-elem`,fallback:[`script-src`,`default-src`],fallback_of:null},{name:`script-src-attr`,fallback:[`script-src`,`default-src`],fallback_of:null},{name:`style-src`,fallback:[`default-src`],fallback_of:[`style-src-elem`,`style-src-attr`]},{name:`style-src-elem`,fallback:[`style-src`,`default-src`],fallback_of:null},{name:`style-src-attr`,fallback:[`style-src`,`default-src`],fallback_of:null},{name:`img-src`,fallback:[`default-src`],fallback_of:null},{name:`media-src`,fallback:[`default-src`],fallback_of:null},{name:`font-src`,fallback:[`default-src`],fallback_of:null},{name:`manifest-src`,fallback:[`default-src`],fallback_of:null},{name:`child-src`,fallback:[`default-src`],fallback_of:[`frame-src`,`worker-src`]},{name:`connect-src`,fallback:[`default-src`],fallback_of:null},{name:`frame-src`,fallback:[`child-src`],fallback_of:null},{name:`frame-ancestors`,fallback:null,fallback_of:null},{name:`form-action`,fallback:null,fallback_of:null},{name:`worker-src`,fallback:[`child-src`,`script-src`,`default-src`],fallback_of:null},{name:`object-src`,fallback:[`default-src`],fallback_of:null},{name:`base-uri`,fallback:null,fallback_of:null},{name:`upgrade-insecure-requests`,fallback:null,fallback_of:null},{name:`report-to`,fallback:null,fallback_of:null},{name:`require-trusted-types-for`,fallback:null,fallback_of:null},{name:`trusted-types`,fallback:null,fallback_of:null},{name:`sandbox`,fallback:null,fallback_of:null}];new Map(C.map(e=>[e.name,e]));var w=i(`<!> <p>Three stages run in order, and each is independent. Use the one that matches your intent.</p> <ol><li><strong><!> <code>replace_defaults</code></strong> — the starting state. Omitted, it's <!>.
				Provided, it <em>replaces the library defaults wholesale</em>: exactly the directives you
				list, nothing inherited. <code></code> starts blank; <code>null</code> throws (avoid
				the null/undefined footgun where a conditional silently disables defaults).</li> <li><strong><code>extend</code></strong> — sources to append per directive, layered left to
				right. Values append (and deduplicate) to the result of <code>replace_defaults</code> and
				prior entries. Boolean directives (e.g. <code>upgrade-insecure-requests</code>) are excluded
				by the type. Only array-typed directives can be extended. Compose multiple shared maps in
				one array.</li> <li><strong><code>overrides</code></strong> — final-pass per-directive replace or remove.
				Highest precedence. Pass <code>null</code> to drop a directive from the output entirely.</li></ol>`,1),T=i(`<!> <p><code>extend</code> is the common path: take a starting state and add per-directive sources.
			Sources land only on the directives you name. There's no cross-directive promotion.</p> <!> <p>Multiple entries compose left to right, deduplicating across layers. Useful for combining a
			"shared lib" object with app-specific extras:</p> <!> <p>Default-deny directives (those whose default value is <code>['none']</code>, including <code>default-src</code>, <code>object-src</code>, <code>base-uri</code>, <code>script-src-attr</code>, and <code>child-src</code>) cannot be extended. Attempting to <code>extend</code> them throws. Opting in must go through <code>replace_defaults</code> or <code>overrides</code> so the opt-in is visible at the call site. Note that <code>overrides</code> cannot rescue an <code>extend</code> for a default-deny directive in
			the same call: extend runs first and throws before <code>overrides</code> would replace the
			value. Move the sources into <code>overrides</code> directly, or opt in via <code>replace_defaults</code> and then extend.</p>`,1),E=i(`<!> <p>The final-pass <code>overrides</code> option replaces a directive's value or removes it
			entirely. Highest precedence. Wins over <code>replace_defaults</code> and <code>extend</code>.</p> <!>`,1),D=i(`<!> <p><code>replace_defaults</code> sets the starting state. The default is the library's curated <!>. To use your own foundation, pass a
			complete map. <strong>Anything you don't list is absent from the starting state</strong>,
			including security defaults like <code>default-src: ['none']</code>. Use <code>extend</code> and <code>overrides</code> for per-directive tweaks while keeping the library defaults.</p> <!> <p>Use <code>overrides</code> for tweaks (replace one directive while keeping the library
			defaults), and <code>replace_defaults</code> for full ownership of the starting state. <code>null</code> is rejected (top-level or per-key). Omit the option for library defaults,
			pass <code></code> to start blank, or use <code>overrides</code> to remove a specific
			directive.</p>`,1),O=i(`<!> <p><!> validates inputs and outputs at build time.
			Misconfigurations throw rather than producing a silently broken policy.</p> <ul><li>Unknown directive keys in any of <code>replace_defaults</code>, <code>extend</code>, or <code>overrides</code> throw with the offending name.</li> <li>Extending a directive whose current value is <code>['none']</code> throws. Opt in via <code>replace_defaults</code> or <code>overrides</code> instead.</li> <li><code>null</code> for <code>replace_defaults</code> (top-level or per-key) throws. Omit the
				option for library defaults, pass <code></code> to start blank, or use <code>overrides</code> to remove a specific directive.</li> <li><code>null</code> per-key in <code>extend</code> throws with a pointer to <code>overrides</code>. <code>extend</code> only appends, so removal lives on <code>overrides</code>.</li> <li><code>undefined</code> per-key in any of the three stages is treated as omitted (no-op).
				This lets conditional patterns like <code></code> work naturally.</li> <li>Non-object entries in <code>extend</code> (e.g. <code>extend: [undefined]</code>) throw a
				library error pointing at the option, instead of a cryptic native <code>TypeError</code>.</li> <li>The output is validated to ensure <code>'none'</code> never appears alongside other tokens
				(an invalid CSP that browsers reject).</li> <li>The output is validated to ensure no directive ends up with an empty array. Use <code>['none']</code> to forbid all sources, or omit the directive entirely. Empty arrays
				can be silently dropped or fall back to <code>default-src</code>, widening the policy.</li> <li>Source arrays are validated to contain only strings. Non-string elements (slipped through
				via <code>as any</code>) would render as <code>undefined</code> or <code>[object Object]</code> in the emitted header.</li></ul>`,1),k=i(`<tr><td> </td><td> </td><td> </td></tr>`),A=i(`<!> <p>The exported <!> has JSON data about the <!>.
			Fuz omits deprecated directives.</p> <table><thead><tr><th>directive</th><th>fallback</th><th>fallback of</th></tr></thead><tbody></tbody></table>`,1),j=i(`<section><p>Fuz supports <a href="https://svelte.dev/docs/kit/configuration#csp">SvelteKit's config</a> for <!> with the <!> helper. Fuz also provides related
			helpers, types, and CSP data.</p> <p>The API is designed to read as an audit log: every user-added source is named at exactly one
			site in the source code. There's no implicit promotion of sources across directives. If you
			want a domain on <code>script-src</code>, you write <code>script-src</code>. Library defaults
			are inherited unless you opt out via <code>replace_defaults</code>.</p> <p>Example usage:</p> <!></section> <!> <!> <!> <!> <!> <!> <aside>For more, see the <!> and tests in <!>.</aside>`,1);function M(i,M){r(M,!0);let N=h(`csp`);v(i,{get tome(){return N},children:(r,i)=>{var p=j(),h=o(p),v=a(h),M=l(a(v),3);x(M,{path:`https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/ContentSecurityPolicy`,children:(e,t)=>{c();var r=f(`Content Security Policies`);n(e,r)},$$slots:{default:!0}});var N=l(M,2);g(N,{name:`create_csp_directives`}),c(),t(v);var P=l(v,6);_(P,{lang:`ts`,dangerous_raw_html:`<span class="token_special_keyword">import</span> <span class="token_punctuation">{</span>create_csp_directives<span class="token_punctuation">,</span> <span class="token_keyword">type</span> <span class="token_class_name">CspDirectives</span><span class="token_punctuation">}</span> <span class="token_special_keyword">from</span> <span class="token_string">'@fuzdev/fuz_ui/csp.js'</span><span class="token_punctuation">;</span>

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
<span class="token_punctuation">});</span>`}),t(h);var F=l(h,2);y(F,{children:(e,r)=>{var i=w(),s=o(i);b(s,{text:`Pipeline`});var u=l(s,4),d=a(u),f=a(d),p=a(f);g(p,{name:`CreateCspDirectivesOptions`}),c(2),t(f);var m=l(f,2);g(m,{name:`csp_directive_value_defaults`});var h=l(m,4);h.textContent=`{}`,c(3),t(d),c(4),t(u),n(e,i)},$$slots:{default:!0}});var I=l(F,2);y(I,{children:(e,t)=>{var r=T(),i=o(r);b(i,{text:`Adding sources via extend`});var a=l(i,4);_(a,{lang:`ts`,dangerous_raw_html:`<span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>
  extend<span class="token_operator">:</span> <span class="token_punctuation">[</span>
    <span class="token_punctuation">{</span>
      <span class="token_string_property token_property">'img-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://cdn.fuz.dev/'</span><span class="token_punctuation">],</span>
      <span class="token_string_property token_property">'connect-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://api.fuz.dev/'</span><span class="token_punctuation">],</span>
    <span class="token_punctuation">},</span>
  <span class="token_punctuation">],</span>
<span class="token_punctuation">});</span>`});var s=l(a,4);_(s,{lang:`ts`,dangerous_raw_html:`<span class="token_special_keyword">import</span> <span class="token_punctuation">{</span>csp_directives_of_fuzdev<span class="token_punctuation">}</span> <span class="token_special_keyword">from</span> <span class="token_string">'@fuzdev/fuz_ui/csp_of_fuzdev.js'</span><span class="token_punctuation">;</span>

<span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>
  extend<span class="token_operator">:</span> <span class="token_punctuation">[</span>
    csp_directives_of_fuzdev<span class="token_punctuation">,</span>
    <span class="token_punctuation">{</span>
      <span class="token_string_property token_property">'connect-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://api.fuz.dev/'</span><span class="token_punctuation">],</span>
      <span class="token_string_property token_property">'img-src'</span><span class="token_operator">:</span> <span class="token_punctuation">[</span><span class="token_string">'https://media.fuz.dev/'</span><span class="token_punctuation">],</span>
    <span class="token_punctuation">},</span>
  <span class="token_punctuation">],</span>
<span class="token_punctuation">});</span>`}),c(2),n(e,r)},$$slots:{default:!0}});var L=l(I,2);y(L,{children:(e,t)=>{var r=E(),i=o(r);b(i,{text:`Replacing values via overrides`});var a=l(i,4);_(a,{lang:`ts`,dangerous_raw_html:`<span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>
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
<span class="token_punctuation">});</span>`}),n(e,r)},$$slots:{default:!0}});var R=l(L,2);y(R,{children:(e,r)=>{var i=D(),s=o(i);b(s,{text:`Custom defaults via replace_defaults`});var u=l(s,2),d=l(a(u),2);g(d,{name:`csp_directive_value_defaults`}),c(9),t(u);var f=l(u,2);_(f,{lang:`ts`,dangerous_raw_html:`<span class="token_comment">// Fully declarative — no library defaults at all.</span>
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
<span class="token_function">create_csp_directives</span><span class="token_punctuation">({</span>replace_defaults<span class="token_operator">:</span> <span class="token_punctuation">{},</span> overrides<span class="token_operator">:</span> <span class="token_punctuation">{</span><span class="token_comment">/* ... */</span><span class="token_punctuation">}});</span>`});var p=l(f,2),m=l(a(p),7);m.textContent=`{}`,c(3),t(p),n(e,i)},$$slots:{default:!0}});var z=l(R,2);y(z,{children:(e,r)=>{var i=O(),s=o(i);b(s,{text:`Validation`});var u=l(s,2),d=a(u);g(d,{name:`create_csp_directives`}),c(),t(u);var f=l(u,2),p=l(a(f),4),m=l(a(p),4);m.textContent=`{}`,c(3),t(p);var h=l(p,4),_=l(a(h),2);_.textContent=`{'connect-src': is_prod ? [API_URL] : undefined}`,c(),t(h),c(8),t(f),n(e,i)},$$slots:{default:!0}});var B=l(z,2);y(B,{children:(r,i)=>{var p=A(),h=o(p);b(h,{text:`Directive specs`});var _=l(h,2),v=l(a(_));g(v,{name:`csp_directive_specs`});var y=l(v,2);x(y,{path:`Web/HTTP/Reference/Headers/Content-Security-Policy`,children:(e,t)=>{c();var r=f(`CSP directives`);n(e,r)},$$slots:{default:!0}}),c(),t(_);var S=l(_,2),w=l(a(S));s(w,21,()=>C,e=>e.name,(r,i)=>{var o=k(),s=a(o),c=d(s,!0),f=l(s),p=d(f,!0),h=l(f),g=d(h,!0);t(o),u((t,n)=>{m(c,e(i).name),m(p,t),m(g,n)},[()=>e(i).fallback?.join(`, `)||``,()=>e(i).fallback_of?.join(`, `)||``]),n(r,o)}),t(w),t(S),n(r,p)},$$slots:{default:!0}});var V=l(B,2),H=l(a(V));S(H,{path:`fuzdev/fuz_ui/blob/main/src/lib/csp.ts`,children:(e,t)=>{c();var r=f(`source code`);n(e,r)},$$slots:{default:!0}});var U=l(H,2);S(U,{path:`fuzdev/fuz_ui/tree/main/src/test`,children:(e,t)=>{c();var r=f(`src/test/csp.*.test.ts`);n(e,r)},$$slots:{default:!0}}),c(),t(V),n(r,p)},$$slots:{default:!0}}),p()}export{M as t};