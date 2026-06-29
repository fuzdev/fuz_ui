import{A as e,B as t,C as n,D as r,Dt as i,Et as a,G as o,K as s,L as c,N as l,O as u,R as d,S as f,St as p,T as m,U as h,V as g,W as _,Y as v,_ as y,_t as b,a as x,c as S,ct as C,dt as w,f as T,g as E,ht as D,j as O,k,kt as A,lt as j,m as M,n as N,nt as P,o as F,ot as I,p as L,pt as R,q as z,rt as B,u as V,ut as H,v as U,w as ee,xt as W,y as te,z as G}from"./CRyl_OFM.js";import{l as ne}from"./Cmael5Ew.js";import"./xihTtKlq.js";import{t as re}from"./CVl7sFUu.js";import{a as ie,i as ae,n as oe,o as se,r as ce,t as le}from"./UUdbRev8.js";import{a as ue}from"./CS74e02N.js";import{i as K}from"./07-Goqe_.js";import{t as de}from"./Cza1dliX.js";import{a as fe,c as pe,d as me,f as he,h as ge,i as _e,l as ve,m as ye,n as be,o as xe,p as q,r as Se,s as Ce,t as we,u as Te}from"./C6JZMXUN.js";import{f as Ee}from"./D-low7Iu.js";import{s as De}from"./CPcsoTe0.js";import{n as Oe}from"./S2rGheCH.js";import{r as ke,t as Ae}from"./JAKkPNjv.js";import{t as J}from"./DSsv9oPT.js";import{n as je,t as Me}from"./DEPkbOTG.js";import{t as Y}from"./BPdNE2YO.js";import{t as Ne}from"./Dfv2JCPl.js";import{n as X,t as Z}from"./DxWmuSWH.js";import{t as Pe}from"./DtRh97IY.js";import{n as Fe,t as Ie}from"./ChlOLN8W.js";import{t as Le}from"./CyviipL3.js";import{t as Re}from"./AqrIRJpo.js";var ze=new Set([`$$slots`,`$$events`,`$$legacy`,`tag`,`entries`,`children`]);function Q(e,n){p(n,!0);let i=x(n,`tag`,3,`span`),a=F(n,ze);var o=t();r(H(o),i,!1,(e,r)=>{m(e,()=>oe(n.entries)),y(e,()=>({...a,[E]:{display:`contents`}}));var i=t();O(H(i),()=>n.children),G(r,i)}),G(e,o),W()}var Be=g(`<div class="contextmenu-root svelte-1472w04" role="group"><!></div>`),Ve=g(`<!> <!>`,1);function He(e,n){p(n,!0);let r=x(n,`contextmenu`,19,()=>new le),a=x(n,`longpress_move_tolerance`,3,21),l=x(n,`longpress_duration`,3,633),u=x(n,`bypass_with_tap_then_longpress`,3,!0),d=x(n,`bypass_window`,3,750),f=x(n,`bypass_move_tolerance`,3,11),h=x(n,`open_offset_x`,3,-2),g=x(n,`open_offset_y`,3,-2),_=x(n,`scoped`,3,!1),y=x(n,`link_entry`,3,Se),S=x(n,`text_entry`,3,fe),T=x(n,`separator_entry`,3,_e);ae.set(()=>r()),ce(()=>_());let E=D(void 0),k=0,A=0,M=null,N=!1,P=new xe,F=new Ce,I=()=>{document.body.classList.add(`contextmenu-pending`)},L=()=>{document.body.classList.remove(`contextmenu-pending`)},B=()=>{N=!1,M!==null&&(clearTimeout(M),M=null),L()},V=()=>{B(),P.reset()},U=b(()=>({open_offset_x:h(),open_offset_y:g(),link_enabled:y()!==null,text_enabled:S()!==null,separator_enabled:T()!==null})),ee=e=>{if(!P.consume()){if(N){if(v(E)?.contains(e.target))return;V(),K(e);return}Te(e,r(),v(E),F,v(U))&&V()}},te=e=>{N=!1,F.touchstart();let{touches:t,target:n}=e;if(r().opened||t.length!==1||!ve(n,e.shiftKey)){V();return}let{clientX:i,clientY:a}=t[0];u()&&P.track(i,a,d(),f())||(k=i,A=a,I(),M!==null&&B(),M=setTimeout(()=>{N=!0,L(),se(n,k+h(),A+g(),r(),v(U))&&F.opened()},l()))},ne=e=>{if(M===null||r().opened)return;let{touches:t}=e;if(t.length!==1)return;let{clientX:n,clientY:i}=t[0];if(Math.hypot(n-k,i-A)>a()){B();return}e.preventDefault()},re=e=>{F.touchend(e),M!==null&&B(),P.consume()},ie=()=>{F.reset(),V()},oe=e=>{let t={passive:!0,capture:!0},n={passive:!1,capture:!0},r=z(e,`touchstart`,te,t),i=z(e,`touchmove`,ne,n),a=z(e,`touchend`,re,n),o=z(e,`touchcancel`,ie,t);return()=>{r(),i(),a(),o()}};var ue=Ve();s(`contextmenu`,C,function(...e){(_()?void 0:ee)?.apply(this,e)}),m(C,()=>_()?void 0:oe);var de=H(ue),pe=e=>{var t=Be();O(j(t),()=>n.children),i(t),m(t,()=>oe),o(`contextmenu`,t,ee),G(e,t)},me=e=>{var r=t();O(H(r),()=>n.children),G(e,r)};c(de,e=>{_()?e(pe):e(me,-1)}),be(w(de,2),{get contextmenu(){return r()},get open_guard(){return F},get link_entry(){return y()},get text_entry(){return S()},get separator_entry(){return T()},get el(){return v(E)},set el(e){R(E,e)}}),G(e,ue),W()}_([`contextmenu`]);var $=re(()=>new Ue(`standard`)),Ue=class{#e=D();get variant(){return v(this.#e)}set variant(e){R(this.#e,e)}#t=b(()=>this.variant===`standard`?we:He);get component(){return v(this.#t)}set component(e){R(this.#t,e)}#n=b(()=>this.component===we?`ContextmenuRoot`:`ContextmenuRootForSafariCompatibility`);get name(){return v(this.#n)}set name(e){R(this.#n,e)}constructor(e=`standard`){this.variant=e}},We=g(`<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <!></div></label> <label class="row"><input type="radio"/> <div>iOS compat <!></div></label></fieldset>`);function Ge(e,t){p(t,!0);let n=[],r=$.get();var a=We(),o=w(j(a),2),s=j(o);U(s),s.value=s.__value=`standard`;var c=w(s,2);J(w(j(c)),{name:`ContextmenuRoot`}),i(c),i(o);var l=w(o,2),u=j(l);U(u),u.value=u.__value=`compat`;var d=w(u,2);J(w(j(d)),{name:`ContextmenuRootForSafariCompatibility`}),i(d),i(l),i(a),L(n,[],s,()=>r.variant,e=>r.variant=e),L(n,[],u,()=>r.variant,e=>r.variant=e),G(e,a),W()}var Ke=g(`<p class="panel p_md">alert B -- also inherits A</p>`),qe=g(`<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>`),Je=g(`<code>navigator.vibrate</code>`),Ye=g(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
		capabilities to users. Popular websites with similar features include Google Docs and Discord.
		Below are caveats about this breaking some user expectations, and a workaround for iOS Safari
		support. See also the <!> docs and <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p> <p>When you rightclick inside a <!>, or longpress on touch
		devices, it searches the DOM tree for behaviors defined with <!> starting from the target element up to the root. If any behaviors are found, the Fuz
		contextmenu opens, showing all contextually available actions. If no behaviors are found, the
		default system contextmenu opens.</p> <p>Here's a <code> </code> with a <!> inside
		another <!>:</p> <!> <!> <p>This simple hierarchical pattern gives users the full contextual actions by default -- not just
		the actions for the target being clicked, but all ancestor actions too. This means users don't
		need to hunt for specific parent elements to find the desired action, unlike many systems --
		instead, all actions in the tree are available, improving UX convenience and predictability at
		the cost of more noisy menus. Developers can opt out of this inheritance behavior by simply not
		nesting <!> declarations, and submenus are useful for
		managing complexity.</p> <h4>Mouse and keyboard:</h4> <ul><li>rightclick opens the Fuz contextmenu and not the system contextmenu (minus current exceptions
			for input/textarea/contenteditable)</li> <li>holding Shift opens the system contextmenu, bypassing the Fuz contextmenu</li> <li>keyboard navigation and activation should work similarly to the W3C <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/">APG menubar pattern</a></li></ul> <h4>Touch devices:</h4> <ul><li>longpress opens the Fuz contextmenu and not the system contextmenu (minus current exceptions
			for input/textarea/contenteditable)</li> <li>tap-then-longpress opens the system contextmenu or performs other default behavior like
			selecting text, bypassing the Fuz contextmenu</li> <li>tap-then-longpress can't work for clickable elements like links; longpress on the first
			contextmenu entry for those cases (double-longpress)</li></ul> <h4>All devices:</h4> <ul><li>opening the contextmenu on the contextmenu itself shows the system contextmenu, bypassing the
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function Xe(t,n){p(n,!0);let r=$.get(),o=b(()=>r.component),s=b(()=>r.name);X(t,{children:(t,n)=>{var r=Ye(),c=H(r);Z(c,{text:`Introduction`});var l=w(c,2);Le(w(j(l)),{path:`Web/API/Element/contextmenu_event`}),a(3),i(l);var u=w(l,2),f=w(j(u));J(f,{name:`ContextmenuRoot`}),J(w(f,2),{name:`Contextmenu`}),a(),i(u);var p=w(u,2),m=w(j(p)),g=j(m,!0);i(m);var _=w(m,2);J(_,{name:`Contextmenu`}),J(w(_,2),{name:`Contextmenu`}),a(),i(p);var y=w(p,2);e(y,()=>v(o),(e,t)=>{t(e,{scoped:!0,children:(e,t)=>{Q(e,{entries:e=>{q(e,{run:()=>alert(`alert A`),children:(e,t)=>{a(),G(e,h(`alert A`))},$$slots:{default:!0}})},children:(e,t)=>{var n=qe();Q(w(j(n),2),{entries:e=>{q(e,{run:()=>alert(`alert B`),children:(e,t)=>{a(),G(e,h(`alert B`))},$$slots:{default:!0}})},children:(e,t)=>{G(e,Ke())},$$slots:{entries:!0,default:!0}}),i(n),G(e,n)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var x=w(y,2);Pe(x,{summary:e=>{a(),G(e,h(`view code`))},children:(e,t)=>{{let t=b(()=>`<${v(s)}>
	<Contextmenu>
		{#snippet entries()}
			<ContextmenuEntry run={() => alert('alert A')}>
				alert A
			</ContextmenuEntry>
		{/snippet}
		<div class="panel p_md mb_lg">
			<p>alert A -- rightclick or longpress here to open the contextmenu</p>
			<Contextmenu>
				{#snippet entries()}
					<ContextmenuEntry run={() => alert('alert B')}>
						alert B
					</ContextmenuEntry>
				{/snippet}
				<p class="panel p_md">
					alert B -- also inherits A
				</p>
			</Contextmenu>
		</div>
	</Contextmenu>
</${v(s)}>`);Y(e,{get content(){return v(t)}})}},$$slots:{summary:!0,default:!0}});var S=w(x,2);J(w(j(S)),{name:`Contextmenu`}),a(),i(S);var C=w(S,12),T=w(j(C),2);Le(w(j(T)),{path:`Web/API/Navigator/vibrate`,children:(e,t)=>{G(e,Je())},$$slots:{default:!0}}),i(T),i(C),Ge(w(C,2),{}),P(()=>d(g,v(s))),G(t,r)},$$slots:{default:!0}}),W()}var Ze=g(`<span class="font_family_mono">contextmenu</span> event`,1),Qe=g(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
		Safari not supporting the <code>contextmenu</code> event as of October 2025, see <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a>.</p> <p>Use <!> by default for better performance and haptic
		feedback. Use <!> only if you need iOS Safari
		support.</p> <h4>ContextmenuRoot</h4> <ul><li>standard, default implementation</li> <li>relies on the browser's <!></li> <li>much simpler, better performance with fewer and less intrusive event handlers, fewer edge
			cases that can go wrong</li> <li>does not work on iOS Safari until <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a> is fixed</li></ul> <h4>ContextmenuRootForSafariCompatibility</h4> <ul><li>opt-in hacky alternative when iOS support is needed</li> <li>implements custom longpress detection to work around iOS Safari's lacking <a href="https://bugs.webkit.org/show_bug.cgi?id=213953"><code>contextmenu</code> event support</a></li> <li>degraded experience because some browsers (including mobile Chrome) block <code>navigator.vibrate</code> haptic feedback due to the timeout-based gesture detection (because it's not a direct user
			action)</li> <li>works on all devices including iOS Safari</li> <li>more complex implementation with custom touch event handling and gesture detection, may cause
			edge case UX problems on some devices</li> <li>a longpress is cancelled if you move the touch past a threshold before it triggers</li> <li>opt into this version only if you need iOS Safari support</li></ul> <!>`,1),$e=g(`<!> <p>The Fuz contextmenu provides powerful app-specific UX, but it breaks from normal browser
		behavior by replacing the system contextmenu.</p> <p>To mitigate the downsides:</p> <ul><li>The Fuz contextmenu only replaces the system contextmenu when the DOM tree has defined
			behaviors. Note that <code>a</code> links have default contextmenu behaviors unless disabled.
			Other interactive elements may have default behaviors added in the future.</li> <li>The Fuz contextmenu does not open on elements that allow clipboard pasting like inputs,
			textareas, and contenteditables -- however this may change for better app integration, or be
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),et=g(`<!> <!>`,1);function tt(e){var t=et(),n=H(t);X(n,{children:(e,t)=>{var n=Qe(),r=H(n);Z(r,{text:`iOS compatibility`});var o=w(r,4),s=w(j(o));J(s,{name:`ContextmenuRoot`}),J(w(s,2),{name:`ContextmenuRootForSafariCompatibility`}),a(),i(o);var c=w(o,4),l=w(j(c),2);Le(w(j(l)),{path:`Web/API/Element/contextmenu_event`,children:(e,t)=>{var n=Ze();a(),G(e,n)},$$slots:{default:!0}}),i(l),a(4),i(c),Ge(w(c,6),{}),G(e,n)},$$slots:{default:!0}}),X(w(n,2),{children:(e,t)=>{var n=$e(),r=H(n);Z(r,{text:`Caveats`});var o=w(r,8);Le(w(j(o)),{path:`Web/API/Element/contextmenu_event`}),a(3),i(o),G(e,n)},$$slots:{default:!0}}),G(e,t)}function nt(e){let t=e-1;return t*t*t+1}function rt(e){return--e*e*e*e*e+1}function it(e,{from:t,to:n},r={}){var{delay:i=0,duration:a=e=>Math.sqrt(e)*120,easing:o=nt}=r,s=getComputedStyle(e),c=s.transform===`none`?``:s.transform,[l,u]=s.transformOrigin.split(` `).map(parseFloat);l/=e.clientWidth,u/=e.clientHeight;var d=at(e),f=e.clientWidth/n.width/d,p=e.clientHeight/n.height/d,m=t.left+t.width*l,h=t.top+t.height*u,g=n.left+n.width*l,_=n.top+n.height*u,v=(m-g)*f,y=(h-_)*p,b=t.width/n.width,x=t.height/n.height;return{delay:i,duration:typeof a==`function`?a(Math.sqrt(v*v+y*y)):a,easing:o,css:(e,t)=>`transform: ${c} translate(${t*v}px, ${t*y}px) scale(${e+t*b}, ${e+t*x});`}}function at(e){if(`currentCSSZoom`in e)return e.currentCSSZoom;for(var t=e,n=1;t!==null;)n*=+getComputedStyle(t).zoom,t=t.parentElement;return n}var ot=g(`<menu class="pane unstyled svelte-6kuqba"><!></menu>`),st=g(`<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-haspopup="menu" tabindex="-1"><div class="content"><div class="icon"><!></div> <div class="title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>`);function ct(e,t){p(t,!0);let r=ae.get(),o=b(r),l=r().add_submenu(),u=b(()=>v(o).layout),d=b(()=>l.selected),m=D(void 0),h=ie.get(),g=ie.set(),_=D(0),y=D(0);B(()=>{v(m)&&x(v(m),v(u),h)});let x=(e,t,n)=>{let{x:r,y:i,width:a,height:o}=e.getBoundingClientRect();g.width=a,g.height=o;let s=pe({base_x:r-v(_),base_y:i-v(y),width:a,height:o,parent_width:n.width,layout_width:t.width,layout_height:t.height});R(_,s.x),R(y,s.y)},S=null;N(()=>{S!==null&&clearTimeout(S)});var C=st();let T;var E=j(C),k=j(E),A=j(k);ge(j(A),{get icon(){return t.icon}}),i(A);var M=w(A,2);O(j(M),()=>t.children),i(M),i(k),a(2),i(E);var F=w(E,2),I=e=>{var n=ot();let r;O(j(n),()=>t.menu),i(n),V(n,e=>R(m,e),()=>v(m)),P(()=>r=f(n,``,r,{transform:`translate3d(${v(_)??``}px, ${v(y)??``}px, 0)`,"max-height":`${v(u).height??``}px`})),G(e,n)};c(F,e=>{v(d)&&e(I)}),i(C),P(()=>{T=f(C,``,T,{"--contextmenu_depth":l.depth}),n(E,1,ee([`menuitem plain selectable`,{selected:v(d)}])),te(E,`aria-expanded`,v(d))}),s(`mouseenter`,E,e=>{K(e),S!==null&&clearTimeout(S),S=setTimeout(()=>{S=null,v(o).select(l)})}),G(e,C),W()}var lt=g(`<!> <!>`,1);function ut(e,n){p(n,!0);let r=x(n,`name`,3,`Cat`),i=x(n,`icon`,3,`😺`);ct(e,{get icon(){return i()},menu:e=>{var i=lt(),a=H(i);{let e=b(()=>n.position===`adventure`?`🏠`:`🌄`);q(a,{run:()=>n.act({type:n.position===`adventure`?`cat_go_home`:`cat_go_adventure`,name:r()}),get icon(){return v(e)},children:(e,r)=>{var i=t(),a=H(i),o=e=>{G(e,h(`go home`))},s=e=>{G(e,h(`go adventure`))};c(a,e=>{n.position===`adventure`?e(o):e(s,-1)}),G(e,i)},$$slots:{default:!0}})}var o=w(a,2);{let e=b(()=>n.position===`adventure`?`🌄`:`🏠`);q(o,{run:()=>n.act({type:`cat_be_or_do`,name:r(),position:n.position}),get icon(){return v(e)},children:(e,r)=>{var i=t(),a=H(i),o=e=>{G(e,h(`do adventure`))},s=e=>{G(e,h(`be home`))};c(a,e=>{n.position===`adventure`?e(o):e(s,-1)}),G(e,i)},$$slots:{default:!0}})}G(e,i)},children:(e,t)=>{a();var n=h();P(()=>d(n,r())),G(e,n)},$$slots:{menu:!0,default:!0}}),W()}var dt=g(`<!> <!> <!>`,1);function ft(e,t){var n=dt(),r=H(n);ye(r,{href:`https://github.com/fuzdev/fuz_ui`,icon:e=>{de(e,{get data(){return Ee},size:`var(--icon_size_xs)`})},children:(e,t)=>{a(),G(e,h(`Source code`))},$$slots:{icon:!0,default:!0}});var i=w(r,2);me(i,{}),q(w(i,2),{get run(){return t.toggle_about_dialog},icon:e=>{de(e,{get data(){return ue},size:`var(--icon_size_xs)`})},children:(e,t)=>{a(),G(e,h(`About`))},$$slots:{icon:!0,default:!0}}),G(e,n)}var pt=e=>{let t=e.length;if(t===2)return`cats`;if(t===0)return null;let n=e[0];return n.icon+n.name},mt=g(`<!> <!>`,1),ht=g(`<!> <!> <!>`,1);function gt(e,t){p(t,!0);let n=b(()=>pt(t.adventure_cats));ct(e,{icon:`🏠`,menu:e=>{var r=ht(),i=H(r),o=e=>{var n=mt(),r=H(n);q(r,{run:()=>t.act({type:`call_cats_home`}),icon:`🐈‍⬛`,children:(e,t)=>{a(),G(e,h(`call`))},$$slots:{default:!0}});var i=w(r,2),o=e=>{me(e,{})};c(i,e=>{t.home_cats.length>0&&e(o)}),G(e,n)};c(i,e=>{v(n)&&e(o)});var s=w(i,2);l(s,17,()=>t.home_cats,e=>e.name,(e,n)=>{ut(e,{get name(){return v(n).name},get icon(){return v(n).icon},get position(){return v(n).position},get act(){return t.act}})});var u=w(s,2),d=e=>{var n=mt(),r=H(n);q(r,{run:()=>t.act({type:`cat_be_or_do`,name:null,position:`home`}),icon:`🏠`,children:(e,t)=>{a(),G(e,h(`be`))},$$slots:{default:!0}}),q(w(r,2),{run:()=>t.act({type:`call_cats_adventure`}),icon:`🦋`,children:(e,t)=>{a(),G(e,h(`leave`))},$$slots:{default:!0}}),G(e,n)};c(u,e=>{v(n)||e(d)}),G(e,r)},children:(e,t)=>{a(),G(e,h(`home`))},$$slots:{menu:!0,default:!0}}),W()}var _t=g(`<!> <!>`,1),vt=g(`<!> <!> <!>`,1);function yt(e,t){p(t,!0);let n=b(()=>pt(t.home_cats));ct(e,{icon:`🌄`,menu:e=>{var r=vt(),i=H(r),o=e=>{var n=_t(),r=H(n);q(r,{run:()=>t.act({type:`call_cats_adventure`}),icon:`🦋`,children:(e,t)=>{a(),G(e,h(`call`))},$$slots:{default:!0}});var i=w(r,2),o=e=>{me(e,{})};c(i,e=>{t.adventure_cats.length>0&&e(o)}),G(e,n)};c(i,e=>{v(n)&&e(o)});var s=w(i,2);l(s,17,()=>t.adventure_cats,e=>e.name,(e,n)=>{ut(e,{get name(){return v(n).name},get icon(){return v(n).icon},get position(){return v(n).position},get act(){return t.act}})});var u=w(s,2),d=e=>{var n=_t(),r=H(n);q(r,{run:()=>t.act({type:`cat_be_or_do`,name:null,position:`adventure`}),icon:`🌄`,children:(e,t)=>{a(),G(e,h(`do`))},$$slots:{default:!0}}),q(w(r,2),{run:()=>t.act({type:`call_cats_home`}),icon:`🐈‍⬛`,children:(e,t)=>{a(),G(e,h(`leave`))},$$slots:{default:!0}}),G(e,n)};c(u,e=>{v(n)||e(d)}),G(e,r)},children:(e,t)=>{a(),G(e,h(`adventure`))},$$slots:{menu:!0,default:!0}}),W()}var bt=g(`<span class="cat svelte-1py4cgo"><span class="icon svelte-1py4cgo"> </span><span class="name svelte-1py4cgo"><!> </span></span>`);function xt(e,t){let n=x(t,`name`,3,`Cat`),r=x(t,`icon`,3,`😺`);var a=bt(),o=j(a),s=j(o,!0);i(o);var c=w(o),l=j(c);O(l,()=>t.children??A);var u=w(l,1,!0);i(c),i(a),P(()=>{d(s,r()),d(u,n())}),G(e,a)}var St=`<script lang="ts">
	import {flip} from 'svelte/animate';
	import {crossfade} from 'svelte/transition';
	import {quintOut} from 'svelte/easing';
	import {SvelteSet} from 'svelte/reactivity';
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import Contextmenu from '$lib/Contextmenu.svelte';
	import Details from '$lib/Details.svelte';
	import GithubLink from '$lib/GithubLink.svelte';
	import ContextmenuTextEntry from '$lib/ContextmenuTextEntry.svelte';
	import CatContextmenu from './CatContextmenu.svelte';
	import AppContextmenu from './AppContextmenu.svelte';
	import HomeContextmenu from './HomeContextmenu.svelte';
	import AdventureContextmenu from './AdventureContextmenu.svelte';
	import CatView from './CatView.svelte';
	import type {Cat, CatPosition, HistoryItem} from './helpers.ts';
	import ColorSchemeInput from '$lib/ColorSchemeInput.svelte';
	import ThemeInput from '$lib/ThemeInput.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import DialogContent from '$lib/DialogContent.svelte';
	import file_contents from './ExampleFull.svelte?raw';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import {selected_contextmenu_root_component_context} from './selected_root_component.svelte.ts';

	const selected = selected_contextmenu_root_component_context.get();
	const ContextmenuRootComponent = $derived(selected.component);

	const alyssa = 'Alyssa';
	const ben = 'Ben';

	const INITIAL_POSITION: CatPosition = 'home';
	let alyssa_position: CatPosition = $state.raw(INITIAL_POSITION);
	let ben_position: CatPosition = $state.raw(INITIAL_POSITION);

	const alyssa_icon = $derived(alyssa_position === ben_position ? '😺' : '😾');
	const ben_icon = $derived(alyssa_position === ben_position ? '😸' : '😿');

	const alyssa_cat = $derived({name: alyssa, icon: alyssa_icon, position: alyssa_position});
	const ben_cat = $derived({name: ben, icon: ben_icon, position: ben_position});

	let swapped = $state.raw(false);

	// cats wiggling because a swap had nothing to reorder
	const shaking_cats: SvelteSet<string> = new SvelteSet();

	// TODO this is weird but \`animate:\` needs an \`each\`?
	const locate_cats = (
		cats: Array<Cat>,
		swapped: boolean,
	): {home_cats: Array<Cat>; adventure_cats: Array<Cat>} => {
		const home_cats: Array<Cat> = [];
		const adventure_cats: Array<Cat> = [];
		for (const cat of cats) {
			const list = cat.position === 'home' ? home_cats : adventure_cats;
			if (swapped) {
				list.unshift(cat);
			} else {
				list.push(cat);
			}
		}
		return {home_cats, adventure_cats};
	};

	const {home_cats, adventure_cats} = $derived(locate_cats([alyssa_cat, ben_cat], swapped));

	// const cats = [alyssa, ben];
	// TODO use these
	// const catMoods = ['😼', '😾', '😺', '😸', '😻'];

	const can_reset = $derived(
		alyssa_position !== INITIAL_POSITION || ben_position !== INITIAL_POSITION,
	);

	// reset the tome's state
	const reset = () => {
		alyssa_position = INITIAL_POSITION;
		ben_position = INITIAL_POSITION;
	};

	let show_about_dialog = $state.raw(false);
	const toggle_about_dialog = () => {
		show_about_dialog = !show_about_dialog;
	};

	const act = (item: HistoryItem): void => {
		switch (item.type) {
			case 'call_cats_adventure': {
				alyssa_position = 'adventure';
				ben_position = 'adventure';
				break;
			}
			case 'call_cats_home': {
				alyssa_position = 'home';
				ben_position = 'home';
				break;
			}
			case 'cat_go_adventure': {
				if (item.name === alyssa) {
					alyssa_position = 'adventure';
				} else if (item.name === ben) {
					ben_position = 'adventure';
				}
				break;
			}
			case 'cat_go_home': {
				if (item.name === alyssa) {
					alyssa_position = 'home';
				} else if (item.name === ben) {
					ben_position = 'home';
				}
				break;
			}
			case 'cat_be_or_do': {
				const cats_here = item.position === 'home' ? home_cats : adventure_cats;
				if (cats_here.length > 1) {
					swapped = !swapped;
				} else {
					// swapping is invisible with a single cat, so shake it as feedback
					for (const cat of cats_here) {
						shaking_cats.add(cat.name);
					}
				}
				break;
			}
		}
	};

	const [send, receive] = crossfade({
		fallback: (node, _params) => {
			const style = window.getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 1500,
				easing: quintOut,
				css: (t) => \`
					transform: \${transform} scale(\${t});
					opacity: \${t}
				\`,
			};
		},
	});
<\/script>

<ContextmenuRootComponent scoped>
	<TomeSection>
		<TomeSectionHeader text="Full example" />
		<Contextmenu>
			{#snippet entries()}
				{#if can_reset}
					<ContextmenuTextEntry run={reset} content="Reset" icon="↻" />
				{/if}
				<AppContextmenu {toggle_about_dialog} />
			{/snippet}
			<section class="display:flex">
				<div>
					<Contextmenu>
						{#snippet entries()}
							<HomeContextmenu {act} {home_cats} {adventure_cats} />
						{/snippet}
						<div class="position home">
							<div class="icon p_md">🏠</div>
							<div class="cats">
								{#each home_cats as { name, icon, position } (name)}
									<div
										class="cat-wrapper"
										in:receive={{key: name}}
										out:send={{key: name}}
										animate:flip
									>
										<div
											class:shaking={shaking_cats.has(name)}
											onanimationend={() => shaking_cats.delete(name)}
										>
											<Contextmenu>
												{#snippet entries()}
													<CatContextmenu {act} {name} {icon} {position} />
												{/snippet}
												<CatView {name} {icon} />
											</Contextmenu>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</Contextmenu>
					<Contextmenu>
						{#snippet entries()}
							<AdventureContextmenu {act} {home_cats} {adventure_cats} />
						{/snippet}
						<div class="position adventure">
							<div class="icon p_md">🌄</div>
							<div class="cats">
								{#each adventure_cats as { name, icon, position } (name)}
									<div
										class="cat-wrapper"
										in:receive={{key: name}}
										out:send={{key: name}}
										animate:flip
									>
										<div
											class:shaking={shaking_cats.has(name)}
											onanimationend={() => shaking_cats.delete(name)}
										>
											<Contextmenu>
												{#snippet entries()}
													<CatContextmenu {act} {name} {icon} {position} />
												{/snippet}
												<CatView {name} {icon} />
											</Contextmenu>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</Contextmenu>
				</div>
			</section>
			<section>
				<Details>
					{#snippet summary()}View example source{/snippet}
					<Code content={file_contents} />
				</Details>
			</section>
		</Contextmenu>
	</TomeSection>
</ContextmenuRootComponent>

{#if show_about_dialog}
	<Dialog onclose={() => (show_about_dialog = false)}>
		<DialogContent>
			<h1>About Fuz</h1>
			<blockquote>Svelte UI library</blockquote>
			<blockquote>
				free and open source at<br /><GithubLink path="fuzdev/fuz_ui" />
			</blockquote>
			<code class="display:block p_md mb_lg"
				>npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui">@fuzdev/fuz_ui</a></code
			>
			<div class="p_xl box">
				<h2>Color scheme</h2>
				<ColorSchemeInput />
				<h2>Theme</h2>
				<ThemeInput />
			</div>
		</DialogContent>
	</Dialog>
{/if}

<style>
	.position {
		border-radius: var(--border_radius_md);
		background-color: var(--shade_10);
		display: flex;
		border: transparent var(--border_width_4) double;
	}
	.position:hover {
		border-color: var(--border_color_10);
	}
	.position .icon {
		font-size: var(--icon_size_xl);
	}
	.cats {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.cat-wrapper {
		display: flex;
		flex-direction: column;
		width: 160px;
	}
	/* \`--duration_3\` has no fallback so \`prefers-reduced-motion\` disables the animation */
	.shaking {
		animation: shake var(--duration_3) ease-in-out;
	}
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-6px) rotate(-2deg);
		}
		40% {
			transform: translateX(5px) rotate(2deg);
		}
		60% {
			transform: translateX(-4px) rotate(-1deg);
		}
		80% {
			transform: translateX(3px) rotate(1deg);
		}
	}
</style>
`,Ct=g(`<!> <!>`,1),wt=g(`<div class="cat-wrapper svelte-177dlvm"><div><!></div></div>`),Tt=g(`<div class="position home svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>`),Et=g(`<div class="position adventure svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>`),Dt=g(`<section class="display:flex svelte-177dlvm"><div class="svelte-177dlvm"><!> <!></div></section> <section class="svelte-177dlvm"><!></section>`,1),Ot=g(`<h1 class="svelte-177dlvm">About Fuz</h1> <blockquote class="svelte-177dlvm">Svelte UI library</blockquote> <blockquote class="svelte-177dlvm">free and open source at<br class="svelte-177dlvm"/><!></blockquote> <code class="display:block p_md mb_lg svelte-177dlvm">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui" class="svelte-177dlvm">@fuzdev/fuz_ui</a></code> <div class="p_xl box svelte-177dlvm"><h2 class="svelte-177dlvm">Color scheme</h2> <!> <h2 class="svelte-177dlvm">Theme</h2> <!></div>`,1);function kt(t,r){p(r,!0);let o=$.get(),d=b(()=>o.component),f=`Alyssa`,m=`home`,g=D(m),_=D(m),y=b(()=>v(g)===v(_)?`😺`:`😾`),x=b(()=>v(g)===v(_)?`😸`:`😿`),S=b(()=>({name:f,icon:v(y),position:v(g)})),C=b(()=>({name:`Ben`,icon:v(x),position:v(_)})),T=D(!1),E=new De,O=(e,t)=>{let n=[],r=[];for(let i of e){let e=i.position===`home`?n:r;t?e.unshift(i):e.push(i)}return{home_cats:n,adventure_cats:r}},A=b(()=>O([v(S),v(C)],v(T))),M=b(()=>v(A).home_cats),N=b(()=>v(A).adventure_cats),F=b(()=>v(g)!==m||v(_)!==m),I=()=>{R(g,m),R(_,m)},L=D(!1),z=()=>{R(L,!v(L))},B=e=>{switch(e.type){case`call_cats_adventure`:R(g,`adventure`),R(_,`adventure`);break;case`call_cats_home`:R(g,`home`),R(_,`home`);break;case`cat_go_adventure`:e.name===f?R(g,`adventure`):e.name===`Ben`&&R(_,`adventure`);break;case`cat_go_home`:e.name===f?R(g,`home`):e.name===`Ben`&&R(_,`home`);break;case`cat_be_or_do`:{let t=e.position===`home`?v(M):v(N);if(t.length>1)R(T,!v(T));else for(let e of t)E.add(e.name);break}}},[V,U]=Ae({fallback:(e,t)=>{let n=window.getComputedStyle(e),r=n.transform===`none`?``:n.transform;return{duration:1500,easing:rt,css:e=>`
					transform: ${r} scale(${e});
					opacity: ${e}
				`}}});var ee=Ct(),te=H(ee);e(te,()=>v(d),(e,t)=>{t(e,{scoped:!0,children:(e,t)=>{X(e,{children:(e,t)=>{var r=Ct(),o=H(r);Z(o,{text:`Full example`}),Q(w(o,2),{entries:e=>{var t=Ct(),n=H(t),r=e=>{he(e,{run:I,content:`Reset`,icon:`↻`})};c(n,e=>{v(F)&&e(r)}),ft(w(n,2),{toggle_about_dialog:z}),G(e,t)},children:(e,t)=>{var r=Dt(),o=H(r),c=j(o),d=j(c);Q(d,{entries:e=>{gt(e,{act:B,get home_cats(){return v(M)},get adventure_cats(){return v(N)}})},children:(e,t)=>{var r=Tt(),a=w(j(r),2);l(a,29,()=>v(M),({name:e,icon:t,position:n})=>e,(e,t)=>{let r=()=>v(t).name,a=()=>v(t).icon,o=()=>v(t).position;var c=wt(),l=j(c);let d;Q(j(l),{entries:e=>{ut(e,{act:B,get name(){return r()},get icon(){return a()},get position(){return o()}})},children:(e,t)=>{xt(e,{get name(){return r()},get icon(){return a()}})},$$slots:{entries:!0,default:!0}}),i(l),i(c),P(e=>d=n(l,1,`svelte-177dlvm`,null,d,e),[()=>({shaking:E.has(r())})]),s(`animationend`,l,()=>E.delete(r())),k(1,c,()=>U,()=>({key:r()})),k(2,c,()=>V,()=>({key:r()})),u(c,()=>it,null),G(e,c)}),i(a),i(r),G(e,r)},$$slots:{entries:!0,default:!0}}),Q(w(d,2),{entries:e=>{yt(e,{act:B,get home_cats(){return v(M)},get adventure_cats(){return v(N)}})},children:(e,t)=>{var r=Et(),a=w(j(r),2);l(a,29,()=>v(N),({name:e,icon:t,position:n})=>e,(e,t)=>{let r=()=>v(t).name,a=()=>v(t).icon,o=()=>v(t).position;var c=wt(),l=j(c);let d;Q(j(l),{entries:e=>{ut(e,{act:B,get name(){return r()},get icon(){return a()},get position(){return o()}})},children:(e,t)=>{xt(e,{get name(){return r()},get icon(){return a()}})},$$slots:{entries:!0,default:!0}}),i(l),i(c),P(e=>d=n(l,1,`svelte-177dlvm`,null,d,e),[()=>({shaking:E.has(r())})]),s(`animationend`,l,()=>E.delete(r())),k(1,c,()=>U,()=>({key:r()})),k(2,c,()=>V,()=>({key:r()})),u(c,()=>it,null),G(e,c)}),i(a),i(r),G(e,r)},$$slots:{entries:!0,default:!0}}),i(c),i(o);var f=w(o,2);Pe(j(f),{summary:e=>{a(),G(e,h(`View example source`))},children:(e,t)=>{Y(e,{get content(){return St}})},$$slots:{summary:!0,default:!0}}),i(f),G(e,r)},$$slots:{entries:!0,default:!0}}),G(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}})});var ne=w(te,2),re=e=>{je(e,{onclose:()=>R(L,!1),children:(e,t)=>{Me(e,{children:(e,t)=>{var n=Ot(),r=w(H(n),4);Re(w(j(r),2),{path:`fuzdev/fuz_ui`}),i(r);var a=w(r,4),o=w(j(a),2);Fe(o,{}),Ie(w(o,4),{}),i(a),G(e,n)},$$slots:{default:!0}})},$$slots:{default:!0}})};c(ne,e=>{v(L)&&e(re)}),G(t,ee),W()}var At=g(`<!> <!> <!>`,1),jt=g(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific
					element instead of the entire page.</aside></div>`),Mt=g(`<!> <!>`,1);function Nt(r,o){p(o,!0);let s=$.get(),c=b(()=>s.component),l=b(()=>s.name),u=D(!1),f=D(!1),m=D(!1);var g=t();e(H(g),()=>v(c),(e,t)=>{t(e,{scoped:!0,children:(e,t)=>{X(e,{children:(e,t)=>{var r=Mt(),o=H(r);Z(o,{text:`Basic usage`}),Q(w(o,2),{entries:e=>{var t=At(),n=H(t);q(n,{run:()=>void R(u,!v(u)),children:(e,t)=>{a(),G(e,h(`Hello world`))},$$slots:{default:!0}});var r=w(n,2);q(r,{run:()=>void R(f,!v(f)),icon:e=>{a(),G(e,h(`🌞`))},children:(e,t)=>{a(),G(e,h(`Hello with an optional icon snippet`))},$$slots:{icon:!0,default:!0}}),q(w(r,2),{run:()=>void R(m,!v(m)),icon:`🌚`,children:(e,t)=>{a(),G(e,h(`Hello with an optional icon string`))},$$slots:{default:!0}}),G(e,t)},children:(e,t)=>{var r=jt(),o=w(j(r),2);{let e=b(()=>`<${v(l)} scoped>
  <Contextmenu>
    {#snippet entries()}
      <ContextmenuEntry run={() => (greeted = !greeted)}>
        Hello world <!-- ${v(u)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_snippet = !greeted_icon_snippet)}>
        {#snippet icon()}🌞{/snippet}
        Hello with an optional icon snippet <!-- ${v(f)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_string = !greeted_icon_string)} icon="🌚">
        Hello with an optional icon string <!-- ${v(m)} -->
      </ContextmenuEntry>
    {/snippet}
    ...markup with the above contextmenu behavior...
  </Contextmenu>
  ...markup with only default contextmenu behavior...
</${v(l)}>
...markup without contextmenu behavior...`);Y(o,{get content(){return v(e)}})}var s=w(o,2),c=j(s);let p;var h=j(c);i(c),i(s);var g=w(s,2),_=j(g);let y;var x=j(_);i(_),i(g);var S=w(g,2),C=j(S);let T;var E=j(C);i(C),i(S),a(2),i(r),P(()=>{p=n(c,1,``,null,p,{color_g_5:v(u)}),d(h,`greeted = ${v(u)??``}`),y=n(_,1,``,null,y,{color_e_5:v(f)}),d(x,`greeted_icon_snippet = ${v(f)??``}`),T=n(C,1,``,null,T,{color_d_5:v(m)}),d(E,`greeted_icon_string = ${v(m)??``}`)}),G(e,r)},$$slots:{entries:!0,default:!0}}),G(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}})}),G(r,g),W()}var Pt=new Set([`$$slots`,`$$events`,`$$legacy`,`glyph`,`size`]),Ft=g(`<span> </span>`);function It(e,t){p(t,!0);let n=F(t,Pt),r=b(()=>t.size??`var(--font_size, 1em)`);var a=Ft();y(a,()=>({...n,class:`glyph display:inline-block text-align:center line-height:1 white-space:nowrap font-weight:400 ${t.class??``}`,[E]:{width:v(r),height:v(r),"min-width":v(r),"min-height":v(r),"font-size":t.size??`var(--font_size, inherit)`}}));var o=j(a,!0);i(a),P(()=>d(o,t.glyph)),G(e,a),W()}var Lt=g(`<span class="color_f_50">option f</span>`),Rt=g(`<span class="color_g_50">option g</span>`),zt=g(`<span class="color_j_50">option j</span>`),Bt=g(`<!> <!> <!> <!>`,1),Vt=g(`<li class="color_error">Error: <code> </code></li>`),Ht=g(`<div class="display:flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>`),Ut=g(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and
					control it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing you to select multiple colors using the
					activate button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),Wt=g(`<!> <!>`,1);function Gt(r,o){p(o,!0);let l=$.get(),u=b(()=>l.component),f=b(()=>l.name),m=new le,g=D(void 0),_=b(()=>v(g)?`color_${v(g)}_5`:void 0),y=b(()=>v(g)?`color_${v(g)}`:void 0);var x=t();e(H(x),()=>v(u),(e,t)=>{t(e,{get contextmenu(){return m},scoped:!0,children:(e,t)=>{X(e,{children:(e,t)=>{var r=Wt(),o=H(r);Z(o,{text:`Custom instance`}),Q(w(o,2),{entries:e=>{ct(e,{icon:`🎨`,menu:e=>{var t=Bt(),n=H(t);q(n,{run:()=>(R(g,`f`),{ok:!0,close:!1}),children:(e,t)=>{G(e,Lt())},$$slots:{default:!0}});var r=w(n,2);q(r,{run:()=>(R(g,`g`),{ok:!0,close:!1}),children:(e,t)=>{G(e,Rt())},$$slots:{default:!0}});var i=w(r,2);q(i,{run:()=>(R(g,`j`),{ok:!0,close:!1}),children:(e,t)=>{G(e,zt())},$$slots:{default:!0}}),q(w(i,2),{run:()=>(m.close(),{ok:!0}),children:(e,t)=>{a(),G(e,h(`close contextmenu`))},$$slots:{default:!0}}),G(e,t)},children:(e,t)=>{a(),G(e,h(`select color`))},$$slots:{menu:!0,default:!0}})},children:(e,t)=>{var r=Ut(),o=j(r),l=w(j(o)),u=j(l,!0);i(l),a(5),i(o);var p=w(o,2);Y(p,{lang:`ts`,dangerous_raw_html:`<span class="token_keyword">const</span> contextmenu <span class="token_operator">=</span> <span class="token_keyword">new</span> <span class="token_class_name"><span class="token_capitalized_identifier token_class_name">ContextmenuState</span></span><span class="token_punctuation">(</span><span class="token_punctuation">)</span><span class="token_punctuation">;</span>`});var h=w(p,2);{let e=b(()=>`<${v(f)} {contextmenu} scoped>...</${v(f)}>`);Y(h,{get content(){return v(e)}})}var g=w(h,2),x=w(j(g));x.textContent=`{ok: true, close: false}`,a(),i(g);var S=w(g,2),C=w(j(S),2),T=j(C),E=w(j(T),2),D=j(E,!0);i(E),i(T);var O=w(T,2),A=w(j(O),2),M=j(A);i(A),i(O);var N=w(O,2),F=e=>{var t=Vt(),n=w(j(t)),r=j(n,!0);i(n),i(t),P(()=>d(r,m.error)),G(e,t)};c(N,e=>{m.error&&e(F)}),i(C),i(S);var I=w(S,2),L=e=>{var t=Ht(),r=j(t),a=j(r);It(j(a),{glyph:`↑`}),i(a);var o=w(a,2),c=j(o);It(j(c),{glyph:`←`}),i(c);var l=w(c,2);It(j(l),{glyph:`↵`}),i(l);var u=w(l,2);It(j(u),{glyph:`→`}),i(u),i(o);var d=w(o,2);It(j(d),{glyph:`↓`}),i(d),i(r),i(t),P(()=>{n(a,1,`border_bottom_left_radius_0 border_bottom_right_radius_0 ${v(y)??``}`),a.disabled=!m.can_select_sibling,n(c,1,`border_bottom_right_radius_0 border_top_right_radius_0 ${v(y)??``}`),c.disabled=!m.can_collapse,n(l,1,`border-radius:0 ${v(y)??``}`),l.disabled=!m.can_activate,n(u,1,`border_bottom_left_radius_0 border_top_left_radius_0 ${v(y)??``}`),u.disabled=!m.can_expand,n(d,1,`border_top_left_radius_0 border_top_right_radius_0 ${v(y)??``}`),d.disabled=!m.can_select_sibling}),s(`mousedown`,a,e=>{K(e),m.select_previous()},!0),s(`mousedown`,c,e=>{K(e),m.collapse_selected()},!0),s(`mousedown`,l,async e=>{K(e),await m.activate_selected()},!0),s(`mousedown`,u,e=>{K(e),m.expand_selected()},!0),s(`mousedown`,d,e=>{K(e),m.select_next()},!0),k(3,t,()=>ke),G(e,t)};c(I,e=>{m.opened&&e(L)}),i(r),P(()=>{d(u,v(f)),n(S,1,`mb_md ${v(_)??``}`),d(D,m.opened),d(M,`${m.x??``} && contextmenu.y === ${m.y??``}`)}),G(e,r)},$$slots:{entries:!0,default:!0}}),G(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}})}),G(r,x),W()}var Kt=g(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the
					browser's default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's
					default contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),qt=g(`<div><!></div> <!>`,1);function Jt(r,s){p(s,!0);let c=$.get(),l=b(()=>c.component),u=new le,d=D(!1),f=D(void 0),m=()=>{let e=window.getSelection();if(!e||!v(f))return;let t=document.createRange();t.selectNodeContents(v(f)),e.removeAllRanges(),e.addRange(t)},g=D(``),_=b(()=>v(g)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.`||v(g)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`||v(g)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`);var y=t();e(H(y),()=>v(l),(e,t)=>{t(e,{get contextmenu(){return u},scoped:!0,children:(e,t)=>{X(e,{children:(e,t)=>{var r=qt(),s=H(r);let c;Z(j(s),{text:`Select text`}),i(s),Q(w(s,2),{entries:e=>{q(e,{run:()=>void R(d,!v(d)),children:(e,t)=>{a(),G(e,h(`Toggle something`))},$$slots:{default:!0}})},children:(e,t)=>{var r=Kt();let s;var c=j(r),l=w(j(c),2),u=w(j(l));let p;a(),i(l),i(c),V(c,e=>R(f,e),()=>v(f));var h=w(c,2),y=j(h);U(y),i(h);var b=w(h,2);let x;var C=w(b,2),T=j(C);I(T),i(C);var E=w(C,2);Le(j(E),{path:`Web/HTML/Global_attributes/contenteditable`}),a(),i(E);var D=w(E,4),O=w(D,4);a(2),i(r),P(()=>{s=n(r,1,`panel p_md`,null,s,{color_g_5:v(_)}),p=n(u,1,``,null,p,{color_a:v(d)}),x=n(b,1,``,null,x,{color_g_5:v(_)})}),o(`click`,u,m),M(y,()=>v(g),e=>R(g,e)),M(T,()=>v(g),e=>R(g,e)),S(`innerText`,D,()=>v(g),e=>R(g,e)),S(`innerText`,O,()=>v(g),e=>R(g,e)),G(e,r)},$$slots:{entries:!0,default:!0}}),P(()=>c=n(s,1,``,null,c,{color_d_5:v(_)})),G(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}})}),G(r,y),W()}_([`click`]);var Yt=g(`<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>`),Xt=g(`<li>custom "some custom entry" entry</li>`),Zt=g(`<li>"copy text" entry when text is selected</li>`),Qt=g(`<li>link entry when clicking on a link</li>`),$t=g(`<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>`,1),en=g(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing
			the Fuz contextmenu.</p>`),tn=g(`<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which ensures the Fuz contextmenu is used</label></div> <!>`,1);function nn(r,s){p(s,!0);let l=e=>{var t=Yt(),r=j(t),s=w(j(r));let c;a(),i(r),V(r,e=>R(S,e),()=>v(S));var l=w(r,2),u=w(j(l));a(),i(l),i(t),P(e=>{c=n(s,1,``,null,c,{color_h:v(x)}),te(u,`href`,e)},[()=>ne(`/`)]),o(`click`,s,C),G(e,t)},u=$.get(),d=b(()=>u.component),f=b(()=>u.name),m=new le,g=D(!1),_=D(!1),y=D(!0),x=D(!1),S=D(void 0),C=()=>{let e=window.getSelection();if(!e||!v(S))return;let t=document.createRange();t.selectNodeContents(v(S)),e.removeAllRanges(),e.addRange(t)};X(r,{children:(n,r)=>{var o=tn(),s=H(o);Z(s,{text:`Disable default behaviors`});var u=w(s,4);{let e=b(()=>`<${v(f)}${v(g)?` link_entry={null}`:``}${v(_)?` text_entry={null}`:``}>`);Y(u,{get content(){return v(e)}})}var p=w(u,2),S=j(p),C=j(S);U(C);var E=w(C,2),D=w(j(E));D.textContent=`link_entry={null}`,i(E),i(S);var O=w(S,2),k=j(O);U(k);var A=w(k,2),M=w(j(A));M.textContent=`text_entry={null}`,i(A),i(O),i(p);var N=w(p,2);{let n=b(()=>v(g)?null:void 0),r=b(()=>v(_)?null:void 0);e(N,()=>v(d),(e,i)=>{i(e,{get contextmenu(){return m},scoped:!0,get link_entry(){return v(n)},get text_entry(){return v(r)},children:(e,n)=>{var r=t(),i=H(r),o=e=>{Q(e,{entries:e=>{q(e,{icon:`>`,run:()=>void R(x,!v(x)),children:(e,t)=>{a(),G(e,h(`some custom entry`))},$$slots:{default:!0}})},children:(e,t)=>{l(e)},$$slots:{entries:!0,default:!0}})},s=e=>{l(e)};c(i,e=>{v(y)?e(o):e(s,-1)}),G(e,r)},$$slots:{default:!0}})})}var P=w(N,4),F=j(P),I=j(F);U(I),a(),i(F),i(P);var L=w(P,2),z=e=>{var t=$t(),n=w(H(t),2),r=j(n),a=e=>{G(e,Xt())};c(r,e=>{v(y)&&e(a)});var o=w(r,2),s=e=>{G(e,Zt())};c(o,e=>{v(_)||e(s)});var l=w(o,2),u=e=>{G(e,Qt())};c(l,e=>{v(g)||e(u)}),i(n),G(e,t)},B=e=>{G(e,en())};c(L,e=>{v(y)||!v(g)||!v(_)?e(z):e(B,-1)}),T(C,()=>v(g),e=>R(g,e)),T(k,()=>v(_),e=>R(_,e)),T(I,()=>v(y),e=>R(y,e)),G(n,o)},$$slots:{default:!0}}),W()}_([`click`]);var rn=g(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function an(n,r){p(r,!0);let o=$.get(),s=b(()=>o.component),c=b(()=>o.name);var l=t();e(H(l),()=>v(s),(e,t)=>{t(e,{scoped:!0,children:(e,t)=>{X(e,{children:(e,t)=>{var n=rn(),r=H(n);Z(r,{text:`Default behaviors`});var o=w(r,2),s=j(o);{let e=b(()=>`<${v(c)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${v(c)}>`);Y(s,{get content(){return v(e)}})}a(6),i(o),G(e,n)},$$slots:{default:!0}})},$$slots:{default:!0}})}),G(n,l),W()}var on=g(`<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>`,1);function sn(e,t){p(t,!0);let n=Oe(`Contextmenu`);$.set(),Ne(e,{get tome(){return n},children:(e,t)=>{var n=on(),r=H(n);Xe(r,{});var i=w(r,2);Nt(i,{});var o=w(i,2);an(o,{});var s=w(o,2);Jt(s,{});var c=w(s,2);nn(c,{});var l=w(c,2);Gt(l,{});var u=w(l,2);kt(u,{}),tt(w(u,2),{}),a(2),G(e,n)},$$slots:{default:!0}}),W()}export{sn as t};