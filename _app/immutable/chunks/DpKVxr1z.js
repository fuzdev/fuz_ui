import{$ as e,At as t,Ct as n,D as r,E as i,Et as a,H as o,I as s,J as c,N as l,Nt as u,P as d,S as f,T as p,Tt as m,U as h,W as g,X as _,Y as v,Z as y,b,c as x,dt as S,f as C,ft as w,gt as T,h as E,i as D,jt as O,k,l as A,m as j,mt as M,n as N,o as P,ot as F,p as I,pt as L,q as R,st as z,t as B,u as V,ut as ee,vt as H,w as te,x as ne,xt as U,y as re,z as W}from"./CdZb0m0G.js";import{t as ie}from"./BZahLXCT.js";import{n as ae}from"./DMlZ70BW.js";import{a as oe}from"./DEwCLd6F.js";import{t as G}from"./CUFvjskU.js";import{t as K}from"./5vpu1i_m.js";import{n as q,t as J}from"./BQ6dE2IG.js";import{t as Y}from"./YPvxrjbR.js";import{a as se,i as ce,n as le,o as ue,r as de,t as fe}from"./D9DURZLJ.js";import{a as pe,c as me,d as he,f as ge,h as _e,i as ve,l as ye,m as be,n as xe,o as Se,p as X,r as Ce,s as we,t as Te,u as Ee}from"./C7j_F7LB.js";import{t as De}from"./BwKeqKZL.js";import{t as Oe}from"./6yBUANmj.js";import{r as Z}from"./BNhgY4kg.js";import{l as ke}from"./DGgEJT3R.js";import{r as Ae,t as je}from"./Cp8gYu05.js";import{t as Me}from"./qDh-hErF.js";import{t as Ne}from"./DtcbAKPq.js";import{f as Pe}from"./DvpQ0q8G.js";import{a as Fe}from"./C_d61x6a.js";import{n as Ie,t as Le}from"./CIaiZgeC.js";import{n as Re,t as ze}from"./D2S6owPq.js";import"./DFQtZFUt.js";var Be=new Set([`$$slots`,`$$events`,`$$legacy`,`tag`,`entries`,`children`]);function Q(e,t){a(t,!0);let n=B(t,`tag`,3,`span`),r=N(t,Be);var i=h(),c=w(i);te(c,n,!1,(e,n)=>{f(e,()=>le(t.entries)),I(e,()=>({...r,[C]:{display:`contents`}}));var i=h(),a=w(i);s(a,()=>t.children),o(n,i)}),o(e,i),m()}var Ve=g(`<div class="contextmenu-root svelte-1472w04" role="group"><!></div>`),He=g(`<!> <!>`,1);function Ue(t,n){a(n,!0);let r=B(n,`contextmenu`,19,()=>new fe),i=B(n,`longpress_move_tolerance`,3,21),c=B(n,`longpress_duration`,3,633),u=B(n,`bypass_with_tap_then_longpress`,3,!0),d=B(n,`bypass_window`,3,750),p=B(n,`bypass_move_tolerance`,3,11),g=B(n,`open_offset_x`,3,-2),b=B(n,`open_offset_y`,3,-2),x=B(n,`scoped`,3,!1),C=B(n,`link_entry`,3,Ce),E=B(n,`text_entry`,3,pe),D=B(n,`separator_entry`,3,ve);ce.set(()=>r()),de(()=>x());let k=H(void 0),A=0,j=0,N=null,P=!1,F=new Se,I=new we,L=()=>{document.body.classList.add(`contextmenu-pending`)},R=()=>{document.body.classList.remove(`contextmenu-pending`)},z=()=>{P=!1,N!==null&&(clearTimeout(N),N=null),R()},V=()=>{z(),F.reset()},te=U(()=>({open_offset_x:g(),open_offset_y:b(),link_enabled:C()!==null,text_enabled:E()!==null,separator_enabled:D()!==null})),ne=t=>{if(!F.consume()){if(P){if(e(k)?.contains(t.target))return;V(),Z(t)}else Ee(t,r(),e(k),I,e(te))&&V()}},re=t=>{P=!1,I.touchstart();let{touches:n,target:i}=t;if(r().opened||n.length!==1||!ye(i,t.shiftKey)){V();return}let{clientX:a,clientY:o}=n[0];u()&&F.track(a,o,d(),p())||(A=a,j=o,L(),N!==null&&z(),N=setTimeout(()=>{P=!0,R(),ue(i,A+g(),j+b(),r(),e(te))&&I.opened()},c()))},W=e=>{if(N===null||r().opened)return;let{touches:t}=e;if(t.length!==1)return;let{clientX:n,clientY:a}=t[0];Math.hypot(n-A,a-j)>i()?z():e.preventDefault()},ie=e=>{I.touchend(e),N!==null&&z(),F.consume()},ae=()=>{I.reset(),V()},oe=e=>{let t={passive:!0,capture:!0},n={passive:!1,capture:!0},r=y(e,`touchstart`,re,t),i=y(e,`touchmove`,W,n),a=y(e,`touchend`,ie,n),o=y(e,`touchcancel`,ae,t);return()=>{r(),i(),a(),o()}};var G=He();_(`contextmenu`,ee,function(...e){(x()?void 0:ne)?.apply(this,e)}),f(ee,()=>x()?void 0:oe);var K=w(G),q=e=>{var t=Ve(),r=S(t);s(r,()=>n.children),O(t),f(t,()=>oe),v(`contextmenu`,t,ne),o(e,t)},J=e=>{var t=h(),r=w(t);s(r,()=>n.children),o(e,t)};l(K,e=>{x()?e(q):e(J,-1)});var Y=M(K,2);xe(Y,{get contextmenu(){return r()},get open_guard(){return I},get link_entry(){return C()},get text_entry(){return E()},get separator_entry(){return D()},get el(){return e(k)},set el(e){T(k,e)}}),o(t,G),m()}c([`contextmenu`]);var $=Oe(()=>new We(`standard`)),We=class{#e=H();get variant(){return e(this.#e)}set variant(e){T(this.#e,e)}#t=U(()=>this.variant===`standard`?Te:Ue);get component(){return e(this.#t)}set component(e){T(this.#t,e)}#n=U(()=>this.component===Te?`ContextmenuRoot`:`ContextmenuRootForSafariCompatibility`);get name(){return e(this.#n)}set name(e){T(this.#n,e)}constructor(e=`standard`){this.variant=e}},Ge=g(`<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <!></div></label> <label class="row"><input type="radio"/> <div>iOS compat <!></div></label></fieldset>`);function Ke(e,t){a(t,!0);let n=[],r=$.get();var i=Ge(),s=M(S(i),2),c=S(s);j(c),c.value=c.__value=`standard`;var l=M(c,2),u=M(S(l));Y(u,{name:`ContextmenuRoot`}),O(l),O(s);var d=M(s,2),f=S(d);j(f),f.value=f.__value=`compat`;var p=M(f,2),h=M(S(p));Y(h,{name:`ContextmenuRootForSafariCompatibility`}),O(p),O(d),O(i),A(n,[],c,()=>r.variant,e=>r.variant=e),A(n,[],f,()=>r.variant,e=>r.variant=e),o(e,i),m()}var qe=g(`<p class="panel p_md">alert B -- also inherits A</p>`),Je=g(`<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>`),Ye=g(`<code>navigator.vibrate</code>`),Xe=g(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
		capabilities to users. Popular websites with similar features include Google Docs and Discord.
		Below are caveats about this breaking some user expectations, and a workaround for iOS Safari
		support. See also the <!> docs and <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p> <p>When you rightclick inside a <!>, or longpress on touch
		devices, it searches the DOM tree for behaviors defined with <!> starting from the target element up to the root. If any
		behaviors are found, the Fuz contextmenu opens, showing all contextually available actions. If
		no behaviors are found, the default system contextmenu opens.</p> <p>Here's a <code> </code> with a <!> inside
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
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function Ze(n,i){a(i,!0);let s=$.get(),c=U(()=>s.component),l=U(()=>s.name);q(n,{children:(n,i)=>{var a=Xe(),s=w(a);J(s,{text:`Introduction`});var u=M(s,2),d=M(S(u));K(d,{path:`Web/API/Element/contextmenu_event`}),t(3),O(u);var f=M(u,2),p=M(S(f));Y(p,{name:`ContextmenuRoot`});var m=M(p,2);Y(m,{name:`Contextmenu`}),t(),O(f);var h=M(f,2),g=M(S(h)),_=L(g,!0),v=M(g,2);Y(v,{name:`Contextmenu`});var y=M(v,2);Y(y,{name:`Contextmenu`}),t(),O(h);var b=M(h,2);r(b,()=>e(c),(e,n)=>{n(e,{scoped:!0,children:(e,n)=>{Q(e,{entries:e=>{X(e,{run:()=>alert(`alert A`),children:(e,n)=>{t();var r=R(`alert A`);o(e,r)},$$slots:{default:!0}})},children:(e,n)=>{var r=Je();Q(M(S(r),2),{entries:e=>{X(e,{run:()=>alert(`alert B`),children:(e,n)=>{t();var r=R(`alert B`);o(e,r)},$$slots:{default:!0}})},children:(e,t)=>{var n=qe();o(e,n)},$$slots:{entries:!0,default:!0}}),O(r),o(e,r)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var x=M(b,2);De(x,{summary:e=>{t();var n=R(`view code`);o(e,n)},children:(t,n)=>{{let n=U(()=>`<${e(l)}>
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
</${e(l)}>`);G(t,{get content(){return e(n)}})}},$$slots:{summary:!0,default:!0}});var C=M(x,2),T=M(S(C));Y(T,{name:`Contextmenu`}),t(),O(C);var E=M(C,12),D=M(S(E),2),k=M(S(D));K(k,{path:`Web/API/Navigator/vibrate`,children:(e,t)=>{var n=Ye();o(e,n)},$$slots:{default:!0}}),O(D),O(E),Ke(M(E,2),{}),F(()=>W(_,e(l))),o(n,a)},$$slots:{default:!0}}),m()}var Qe=g(`<span class="font_family_mono">contextmenu</span> event`,1),$e=g(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
		Safari not supporting the <code>contextmenu</code> event as of October 2025, see <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a>.</p> <p>Use <!> by default for better performance and haptic
		feedback. Use <!> only if you need
		iOS Safari support.</p> <h4>ContextmenuRoot</h4> <ul><li>standard, default implementation</li> <li>relies on the browser's <!></li> <li>much simpler, better performance with fewer and less intrusive event handlers, fewer edge
			cases that can go wrong</li> <li>does not work on iOS Safari until <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a> is fixed</li></ul> <h4>ContextmenuRootForSafariCompatibility</h4> <ul><li>opt-in hacky alternative when iOS support is needed</li> <li>implements custom longpress detection to work around iOS Safari's lacking <a href="https://bugs.webkit.org/show_bug.cgi?id=213953"><code>contextmenu</code> event support</a></li> <li>degraded experience because some browsers (including mobile Chrome) block <code>navigator.vibrate</code> haptic feedback due to the timeout-based gesture detection
			(because it's not a direct user action)</li> <li>works on all devices including iOS Safari</li> <li>more complex implementation with custom touch event handling and gesture detection, may cause
			edge case UX problems on some devices</li> <li>a longpress is cancelled if you move the touch past a threshold before it triggers</li> <li>opt into this version only if you need iOS Safari support</li></ul> <!>`,1),et=g(`<!> <p>The Fuz contextmenu provides powerful app-specific UX, but it breaks from normal browser
		behavior by replacing the system contextmenu.</p> <p>To mitigate the downsides:</p> <ul><li>The Fuz contextmenu only replaces the system contextmenu when the DOM tree has defined
			behaviors. Note that <code>a</code> links have default contextmenu behaviors unless disabled.
			Other interactive elements may have default behaviors added in the future.</li> <li>The Fuz contextmenu does not open on elements that allow clipboard pasting like inputs,
			textareas, and contenteditables -- however this may change for better app integration, or be
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),tt=g(`<!> <!>`,1);function nt(e){var n=tt(),r=w(n);q(r,{children:(e,n)=>{var r=$e(),i=w(r);J(i,{text:`iOS compatibility`});var a=M(i,4),s=M(S(a));Y(s,{name:`ContextmenuRoot`});var c=M(s,2);Y(c,{name:`ContextmenuRootForSafariCompatibility`}),t(),O(a);var l=M(a,4),u=M(S(l),2),d=M(S(u));K(d,{path:`Web/API/Element/contextmenu_event`,children:(e,n)=>{var r=Qe();t(),o(e,r)},$$slots:{default:!0}}),O(u),t(4),O(l),Ke(M(l,6),{}),o(e,r)},$$slots:{default:!0}});var i=M(r,2);q(i,{children:(e,n)=>{var r=et(),i=w(r);J(i,{text:`Caveats`});var a=M(i,8),s=M(S(a));K(s,{path:`Web/API/Element/contextmenu_event`}),t(3),O(a),o(e,r)},$$slots:{default:!0}}),o(e,n)}function rt(e){let t=e-1;return t*t*t+1}function it(e){return--e*e*e*e*e+1}function at(e,{from:t,to:n},r={}){var{delay:i=0,duration:a=e=>Math.sqrt(e)*120,easing:o=rt}=r,s=getComputedStyle(e),c=s.transform===`none`?``:s.transform,[l,u]=s.transformOrigin.split(` `).map(parseFloat);l/=e.clientWidth,u/=e.clientHeight;var d=ot(e),f=e.clientWidth/n.width/d,p=e.clientHeight/n.height/d,m=t.left+t.width*l,h=t.top+t.height*u,g=n.left+n.width*l,_=n.top+n.height*u,v=(m-g)*f,y=(h-_)*p,b=t.width/n.width,x=t.height/n.height;return{delay:i,duration:typeof a==`function`?a(Math.sqrt(v*v+y*y)):a,easing:o,css:(e,t)=>`transform: ${c} translate(${t*v}px, ${t*y}px) scale(${e+t*b}, ${e+t*x});`}}function ot(e){if(`currentCSSZoom`in e)return e.currentCSSZoom;for(var t=e,n=1;t!==null;)n*=+getComputedStyle(t).zoom,t=t.parentElement;return n}var st=g(`<menu class="pane unstyled svelte-6kuqba"><!></menu>`),ct=g(`<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-haspopup="menu" tabindex="-1"><div class="menuitem_content"><div class="menuitem_icon"><!></div> <div class="menuitem_title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>`);function lt(n,r){a(r,!0);let i=ce.get(),c=U(i),u=i().add_submenu(),f=U(()=>e(c).layout),p=U(()=>u.selected),h=H(void 0),g=se.get(),v=se.set(),y=H(0),x=H(0);z(()=>{e(h)&&C(e(h),e(f),g)});let C=(t,n,r)=>{let{x:i,y:a,width:o,height:s}=t.getBoundingClientRect();v.width=o,v.height=s;let c=me({base_x:i-e(y),base_y:a-e(x),width:o,height:s,parent_width:r.width,layout_width:n.width,layout_height:n.height});T(y,c.x),T(x,c.y)},w=null;d(()=>{w!==null&&clearTimeout(w)});var D=ct();let k;var A=S(D),j=S(A),N=S(j),I=S(N);_e(I,{get icon(){return r.icon}}),O(N);var L=M(N,2),R=S(L);s(R,()=>r.children),O(L),O(j),t(2),O(A);var B=M(A,2),V=t=>{var n=st();let i;var a=S(n);s(a,()=>r.menu),O(n),P(n,e=>T(h,e),()=>e(h)),F(()=>i=re(n,``,i,{transform:`translate3d(${e(y)??``}px, ${e(x)??``}px, 0)`,"max-height":`${e(f).height??``}px`})),o(t,n)};l(B,t=>{e(p)&&t(V)}),O(D),F(()=>{k=re(D,``,k,{"--contextmenu_depth":u.depth}),b(A,1,ne([`menuitem plain selectable`,{selected:e(p)}])),E(A,`aria-expanded`,e(p))}),_(`mouseenter`,A,t=>{Z(t),w!==null&&clearTimeout(w),w=setTimeout(()=>{w=null,e(c).select(u)})}),o(n,D),m()}var ut=g(`<!> <!>`,1);function dt(n,r){a(r,!0);let i=B(r,`name`,3,`Cat`),s=B(r,`icon`,3,`😺`);lt(n,{get icon(){return s()},menu:t=>{var n=ut(),a=w(n);{let t=U(()=>r.position===`adventure`?`🏠`:`🌄`);X(a,{run:()=>r.act({type:r.position===`adventure`?`cat_go_home`:`cat_go_adventure`,name:i()}),get icon(){return e(t)},children:(e,t)=>{var n=h(),i=w(n),a=e=>{var t=R(`go home`);o(e,t)},s=e=>{var t=R(`go adventure`);o(e,t)};l(i,e=>{r.position===`adventure`?e(a):e(s,-1)}),o(e,n)},$$slots:{default:!0}})}var s=M(a,2);{let t=U(()=>r.position===`adventure`?`🌄`:`🏠`);X(s,{run:()=>r.act({type:`cat_be_or_do`,name:i(),position:r.position}),get icon(){return e(t)},children:(e,t)=>{var n=h(),i=w(n),a=e=>{var t=R(`do adventure`);o(e,t)},s=e=>{var t=R(`be home`);o(e,t)};l(i,e=>{r.position===`adventure`?e(a):e(s,-1)}),o(e,n)},$$slots:{default:!0}})}o(t,n)},children:(e,n)=>{t();var r=R();F(()=>W(r,i())),o(e,r)},$$slots:{menu:!0,default:!0}}),m()}var ft=g(`<!> <!> <!>`,1);function pt(e,n){var r=ft(),i=w(r);be(i,{href:`https://github.com/fuzdev/fuz_ui`,icon:e=>{Ne(e,{get data(){return Pe},size:`var(--icon_size_xs)`})},children:(e,n)=>{t();var r=R(`Source code`);o(e,r)},$$slots:{icon:!0,default:!0}});var a=M(i,2);he(a,{});var s=M(a,2);X(s,{get run(){return n.toggle_about_dialog},icon:e=>{Ne(e,{get data(){return Fe},size:`var(--icon_size_xs)`})},children:(e,n)=>{t();var r=R(`About`);o(e,r)},$$slots:{icon:!0,default:!0}}),o(e,r)}var mt=e=>{let t=e.length;if(t===2)return`cats`;if(t===0)return null;let n=e[0];return n.icon+n.name},ht=g(`<!> <!>`,1),gt=g(`<!> <!> <!>`,1);function _t(n,r){a(r,!0);let i=U(()=>mt(r.adventure_cats));lt(n,{icon:`🏠`,menu:n=>{var a=gt(),s=w(a),c=e=>{var n=ht(),i=w(n);X(i,{run:()=>r.act({type:`call_cats_home`}),icon:`🐈‍⬛`,children:(e,n)=>{t();var r=R(`call`);o(e,r)},$$slots:{default:!0}});var a=M(i,2),s=e=>{he(e,{})};l(a,e=>{r.home_cats.length>0&&e(s)}),o(e,n)};l(s,t=>{e(i)&&t(c)});var u=M(s,2);k(u,17,()=>r.home_cats,e=>e.name,(t,n)=>{dt(t,{get name(){return e(n).name},get icon(){return e(n).icon},get position(){return e(n).position},get act(){return r.act}})});var d=M(u,2),f=e=>{var n=ht(),i=w(n);X(i,{run:()=>r.act({type:`cat_be_or_do`,name:null,position:`home`}),icon:`🏠`,children:(e,n)=>{t();var r=R(`be`);o(e,r)},$$slots:{default:!0}});var a=M(i,2);X(a,{run:()=>r.act({type:`call_cats_adventure`}),icon:`🦋`,children:(e,n)=>{t();var r=R(`leave`);o(e,r)},$$slots:{default:!0}}),o(e,n)};l(d,t=>{e(i)||t(f)}),o(n,a)},children:(e,n)=>{t();var r=R(`home`);o(e,r)},$$slots:{menu:!0,default:!0}}),m()}var vt=g(`<!> <!>`,1),yt=g(`<!> <!> <!>`,1);function bt(n,r){a(r,!0);let i=U(()=>mt(r.home_cats));lt(n,{icon:`🌄`,menu:n=>{var a=yt(),s=w(a),c=e=>{var n=vt(),i=w(n);X(i,{run:()=>r.act({type:`call_cats_adventure`}),icon:`🦋`,children:(e,n)=>{t();var r=R(`call`);o(e,r)},$$slots:{default:!0}});var a=M(i,2),s=e=>{he(e,{})};l(a,e=>{r.adventure_cats.length>0&&e(s)}),o(e,n)};l(s,t=>{e(i)&&t(c)});var u=M(s,2);k(u,17,()=>r.adventure_cats,e=>e.name,(t,n)=>{dt(t,{get name(){return e(n).name},get icon(){return e(n).icon},get position(){return e(n).position},get act(){return r.act}})});var d=M(u,2),f=e=>{var n=vt(),i=w(n);X(i,{run:()=>r.act({type:`cat_be_or_do`,name:null,position:`adventure`}),icon:`🌄`,children:(e,n)=>{t();var r=R(`do`);o(e,r)},$$slots:{default:!0}});var a=M(i,2);X(a,{run:()=>r.act({type:`call_cats_home`}),icon:`🐈‍⬛`,children:(e,n)=>{t();var r=R(`leave`);o(e,r)},$$slots:{default:!0}}),o(e,n)};l(d,t=>{e(i)||t(f)}),o(n,a)},children:(e,n)=>{t();var r=R(`adventure`);o(e,r)},$$slots:{menu:!0,default:!0}}),m()}var xt=g(`<span class="cat svelte-1py4cgo"><span class="icon svelte-1py4cgo"> </span><span class="name svelte-1py4cgo"><!> </span></span>`);function St(e,t){let n=B(t,`name`,3,`Cat`),r=B(t,`icon`,3,`😺`);var i=xt(),a=S(i),c=L(a,!0),l=M(a),d=S(l);s(d,()=>t.children??u);var f=M(d,1,!0);O(l),O(i),F(()=>{W(c,r()),W(f,n())}),o(e,i)}var Ct=`<script lang="ts">
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { SvelteSet } from 'svelte/reactivity';
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import Contextmenu from '#lib/Contextmenu.svelte';
	import Details from '#lib/Details.svelte';
	import GithubLink from '#lib/GithubLink.svelte';
	import ContextmenuTextEntry from '#lib/ContextmenuTextEntry.svelte';
	import CatContextmenu from './CatContextmenu.svelte';
	import AppContextmenu from './AppContextmenu.svelte';
	import HomeContextmenu from './HomeContextmenu.svelte';
	import AdventureContextmenu from './AdventureContextmenu.svelte';
	import CatView from './CatView.svelte';
	import type { Cat, CatPosition, HistoryItem } from './helpers.ts';
	import ColorSchemeInput from '#lib/ColorSchemeInput.svelte';
	import ThemeInput from '#lib/ThemeInput.svelte';
	import Dialog from '#lib/Dialog.svelte';
	import DialogContent from '#lib/DialogContent.svelte';
	import file_contents from './ExampleFull.svelte?raw';
	import TomeSectionHeader from '#lib/TomeSectionHeader.svelte';
	import TomeSection from '#lib/TomeSection.svelte';
	import { selected_contextmenu_root_component_context } from './selected_root_component.svelte.ts';

	const selected = selected_contextmenu_root_component_context.get();
	const ContextmenuRootComponent = $derived(selected.component);

	const alyssa = 'Alyssa';
	const ben = 'Ben';

	const INITIAL_POSITION: CatPosition = 'home';
	let alyssa_position: CatPosition = $state.raw(INITIAL_POSITION);
	let ben_position: CatPosition = $state.raw(INITIAL_POSITION);

	const alyssa_icon = $derived(alyssa_position === ben_position ? '😺' : '😾');
	const ben_icon = $derived(alyssa_position === ben_position ? '😸' : '😿');

	const alyssa_cat = $derived({ name: alyssa, icon: alyssa_icon, position: alyssa_position });
	const ben_cat = $derived({ name: ben, icon: ben_icon, position: ben_position });

	let swapped = $state.raw(false);

	// cats wiggling because a swap had nothing to reorder
	const shaking_cats: SvelteSet<string> = new SvelteSet();

	// TODO this is weird but \`animate:\` needs an \`each\`?
	const locate_cats = (
		cats: Array<Cat>,
		swapped: boolean
	): { home_cats: Array<Cat>; adventure_cats: Array<Cat> } => {
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
		return { home_cats, adventure_cats };
	};

	const { home_cats, adventure_cats } = $derived(locate_cats([alyssa_cat, ben_cat], swapped));

	// const cats = [alyssa, ben];
	// TODO use these
	// const catMoods = ['😼', '😾', '😺', '😸', '😻'];

	const can_reset = $derived(
		alyssa_position !== INITIAL_POSITION || ben_position !== INITIAL_POSITION
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
				\`
			};
		}
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
			<section class="flex">
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
										in:receive={{ key: name }}
										out:send={{ key: name }}
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
										in:receive={{ key: name }}
										out:send={{ key: name }}
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
			<blockquote>Svelte component library and frontend helpers</blockquote>
			<blockquote>
				free and open source at<br /><GithubLink path="fuzdev/fuz_ui" />
			</blockquote>
			<code class="block p_md mb_lg">
				npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui">@fuzdev/fuz_ui</a>
			</code>
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
`,wt=g(`<!> <!>`,1),Tt=g(`<div class="cat-wrapper svelte-177dlvm"><div><!></div></div>`),Et=g(`<div class="position home svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>`),Dt=g(`<div class="position adventure svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>`),Ot=g(`<section class="flex svelte-177dlvm"><div class="svelte-177dlvm"><!> <!></div></section> <section class="svelte-177dlvm"><!></section>`,1),kt=g(`<h1 class="svelte-177dlvm">About Fuz</h1> <blockquote class="svelte-177dlvm">Svelte component library and frontend helpers</blockquote> <blockquote class="svelte-177dlvm">free and open source at<br class="svelte-177dlvm"/><!></blockquote> <code class="block p_md mb_lg svelte-177dlvm">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui" class="svelte-177dlvm">@fuzdev/fuz_ui</a></code> <div class="p_xl box svelte-177dlvm"><h2 class="svelte-177dlvm">Color scheme</h2> <!> <h2 class="svelte-177dlvm">Theme</h2> <!></div>`,1);function At(n,s){a(s,!0);let c=$.get(),u=U(()=>c.component),d=`Alyssa`,f=`home`,h=H(f),g=H(f),v=U(()=>e(h)===e(g)?`😺`:`😾`),y=U(()=>e(h)===e(g)?`😸`:`😿`),x=U(()=>({name:d,icon:e(v),position:e(h)})),C=U(()=>({name:`Ben`,icon:e(y),position:e(g)})),E=H(!1),D=new ke,A=(e,t)=>{let n=[],r=[];for(let i of e){let e=i.position===`home`?n:r;t?e.unshift(i):e.push(i)}return{home_cats:n,adventure_cats:r}},j=U(()=>A([e(x),e(C)],e(E))),N=U(()=>e(j).home_cats),P=U(()=>e(j).adventure_cats),I=U(()=>e(h)!==f||e(g)!==f),L=()=>{T(h,f),T(g,f)},z=H(!1),B=()=>{T(z,!e(z))},V=t=>{switch(t.type){case`call_cats_adventure`:T(h,`adventure`),T(g,`adventure`);break;case`call_cats_home`:T(h,`home`),T(g,`home`);break;case`cat_go_adventure`:t.name===d?T(h,`adventure`):t.name===`Ben`&&T(g,`adventure`);break;case`cat_go_home`:t.name===d?T(h,`home`):t.name===`Ben`&&T(g,`home`);break;case`cat_be_or_do`:{let n=t.position===`home`?e(N):e(P);if(n.length>1)T(E,!e(E));else for(let e of n)D.add(e.name);break}}},[ee,te]=je({fallback:(e,t)=>{let n=window.getComputedStyle(e),r=n.transform===`none`?``:n.transform;return{duration:1500,easing:it,css:e=>`
					transform: ${r} scale(${e});
					opacity: ${e}
				`}}});var ne=wt(),re=w(ne);r(re,()=>e(u),(n,r)=>{r(n,{scoped:!0,children:(n,r)=>{q(n,{children:(n,r)=>{var a=wt(),s=w(a);J(s,{text:`Full example`}),Q(M(s,2),{entries:t=>{var n=wt(),r=w(n),i=e=>{ge(e,{run:L,content:`Reset`,icon:`↻`})};l(r,t=>{e(I)&&t(i)}),pt(M(r,2),{toggle_about_dialog:B}),o(t,n)},children:(n,r)=>{var a=Ot(),s=w(a),c=S(s),l=S(c);Q(l,{entries:t=>{_t(t,{act:V,get home_cats(){return e(N)},get adventure_cats(){return e(P)}})},children:(t,n)=>{var r=Et(),a=M(S(r),2);k(a,29,()=>e(N),({name:e,icon:t,position:n})=>e,(t,n)=>{let r=()=>e(n).name,a=()=>e(n).icon,s=()=>e(n).position;var c=Tt(),l=S(c);let u;Q(S(l),{entries:e=>{dt(e,{act:V,get name(){return r()},get icon(){return a()},get position(){return s()}})},children:(e,t)=>{St(e,{get name(){return r()},get icon(){return a()}})},$$slots:{entries:!0,default:!0}}),O(l),O(c),F(e=>u=b(l,1,`svelte-177dlvm`,null,u,{shaking:e}),[()=>D.has(r())]),_(`animationend`,l,()=>D.delete(r())),i(1,c,()=>te,()=>({key:r()})),i(2,c,()=>ee,()=>({key:r()})),p(c,()=>at,null),o(t,c)}),O(a),O(r),o(t,r)},$$slots:{entries:!0,default:!0}}),Q(M(l,2),{entries:t=>{bt(t,{act:V,get home_cats(){return e(N)},get adventure_cats(){return e(P)}})},children:(t,n)=>{var r=Dt(),a=M(S(r),2);k(a,29,()=>e(P),({name:e,icon:t,position:n})=>e,(t,n)=>{let r=()=>e(n).name,a=()=>e(n).icon,s=()=>e(n).position;var c=Tt(),l=S(c);let u;Q(S(l),{entries:e=>{dt(e,{act:V,get name(){return r()},get icon(){return a()},get position(){return s()}})},children:(e,t)=>{St(e,{get name(){return r()},get icon(){return a()}})},$$slots:{entries:!0,default:!0}}),O(l),O(c),F(e=>u=b(l,1,`svelte-177dlvm`,null,u,{shaking:e}),[()=>D.has(r())]),_(`animationend`,l,()=>D.delete(r())),i(1,c,()=>te,()=>({key:r()})),i(2,c,()=>ee,()=>({key:r()})),p(c,()=>at,null),o(t,c)}),O(a),O(r),o(t,r)},$$slots:{entries:!0,default:!0}}),O(c),O(s);var u=M(s,2),d=S(u);De(d,{summary:e=>{t();var n=R(`View example source`);o(e,n)},children:(e,t)=>{G(e,{get content(){return Ct}})},$$slots:{summary:!0,default:!0}}),O(u),o(n,a)},$$slots:{entries:!0,default:!0}}),o(n,a)},$$slots:{default:!0}})},$$slots:{default:!0}})});var W=M(re,2),ie=e=>{Re(e,{onclose:()=>T(z,!1),children:(e,t)=>{ze(e,{children:(e,t)=>{var n=kt(),r=M(w(n),4),i=M(S(r),2);Me(i,{path:`fuzdev/fuz_ui`}),O(r);var a=M(r,4),s=M(S(a),2);Ie(s,{});var c=M(s,4);Le(c,{}),O(a),o(e,n)},$$slots:{default:!0}})},$$slots:{default:!0}})};l(W,t=>{e(z)&&t(ie)}),o(n,ne),m()}var jt=g(`<!> <!> <!>`,1),Mt=g(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific
					element instead of the entire page.</aside></div>`),Nt=g(`<!> <!>`,1);function Pt(n,i){a(i,!0);let s=$.get(),c=U(()=>s.component),l=U(()=>s.name),u=H(!1),d=H(!1),f=H(!1);var p=h(),g=w(p);r(g,()=>e(c),(n,r)=>{r(n,{scoped:!0,children:(n,r)=>{q(n,{children:(n,r)=>{var i=Nt(),a=w(i);J(a,{text:`Basic usage`}),Q(M(a,2),{entries:n=>{var r=jt(),i=w(r);X(i,{run:()=>void T(u,!e(u)),children:(e,n)=>{t();var r=R(`Hello world`);o(e,r)},$$slots:{default:!0}});var a=M(i,2);X(a,{run:()=>void T(d,!e(d)),icon:e=>{t();var n=R(`🌞`);o(e,n)},children:(e,n)=>{t();var r=R(`Hello with an optional icon snippet`);o(e,r)},$$slots:{icon:!0,default:!0}});var s=M(a,2);X(s,{run:()=>void T(f,!e(f)),icon:`🌚`,children:(e,n)=>{t();var r=R(`Hello with an optional icon string`);o(e,r)},$$slots:{default:!0}}),o(n,r)},children:(n,r)=>{var i=Mt(),a=M(S(i),2);{let t=U(()=>`<${e(l)} scoped>
  <Contextmenu>
    {#snippet entries()}
      <ContextmenuEntry run={() => (greeted = !greeted)}>
        Hello world <!-- ${e(u)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_snippet = !greeted_icon_snippet)}>
        {#snippet icon()}🌞{/snippet}
        Hello with an optional icon snippet <!-- ${e(d)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_string = !greeted_icon_string)} icon="🌚">
        Hello with an optional icon string <!-- ${e(f)} -->
      </ContextmenuEntry>
    {/snippet}
    ...markup with the above contextmenu behavior...
  </Contextmenu>
  ...markup with only default contextmenu behavior...
</${e(l)}>
...markup without contextmenu behavior...`);G(a,{get content(){return e(t)}})}var s=M(a,2),c=S(s);let p;var m=L(c);O(s);var h=M(s,2),g=S(h);let _;var v=L(g);O(h);var y=M(h,2),x=S(y);let C;var w=L(x);O(y),t(2),O(i),F(()=>{p=b(c,1,``,null,p,{color_g_50:e(u)}),W(m,`greeted = ${e(u)??``}`),_=b(g,1,``,null,_,{color_e_50:e(d)}),W(v,`greeted_icon_snippet = ${e(d)??``}`),C=b(x,1,``,null,C,{color_d_50:e(f)}),W(w,`greeted_icon_string = ${e(f)??``}`)}),o(n,i)},$$slots:{entries:!0,default:!0}}),o(n,i)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(n,p),m()}var Ft=new Set([`$$slots`,`$$events`,`$$legacy`,`glyph`,`size`]),It=g(`<span> </span>`);function Lt(t,n){a(n,!0);let r=N(n,Ft),i=U(()=>n.size??`var(--font_size, 1em)`);var s=It();I(s,()=>({...r,class:`glyph inline-block text-align:center line-height:1 white-space:nowrap font-weight:400 ${n.class??``}`,[C]:{width:e(i),height:e(i),"min-width":e(i),"min-height":e(i),"font-size":n.size??`var(--font_size, inherit)`}}));var c=L(s,!0);F(()=>W(c,n.glyph)),o(t,s),m()}var Rt=g(`<span class="color_f_50">option f</span>`),zt=g(`<span class="color_g_50">option g</span>`),Bt=g(`<span class="color_j_50">option j</span>`),Vt=g(`<!> <!> <!> <!>`,1),Ht=g(`<li class="negative_60">Error: <code> </code></li>`),Ut=g(`<div class="flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>`),Wt=g(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and
					control it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing
					you to select multiple colors using the activate button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),Gt=g(`<!> <!>`,1);function Kt(n,s){a(s,!0);let c=$.get(),u=U(()=>c.component),d=U(()=>c.name),f=new fe,p=H(void 0),g=U(()=>e(p)?`color_${e(p)}_50`:void 0),v=U(()=>e(p)?`palette_${e(p)}`:void 0);var y=h(),x=w(y);r(x,()=>e(u),(n,r)=>{r(n,{get contextmenu(){return f},scoped:!0,children:(n,r)=>{q(n,{children:(n,r)=>{var a=Gt(),s=w(a);J(s,{text:`Custom instance`}),Q(M(s,2),{entries:e=>{lt(e,{icon:`🎨`,menu:e=>{var n=Vt(),r=w(n);X(r,{run:()=>(T(p,`f`),{ok:!0,close:!1}),children:(e,t)=>{var n=Rt();o(e,n)},$$slots:{default:!0}});var i=M(r,2);X(i,{run:()=>(T(p,`g`),{ok:!0,close:!1}),children:(e,t)=>{var n=zt();o(e,n)},$$slots:{default:!0}});var a=M(i,2);X(a,{run:()=>(T(p,`j`),{ok:!0,close:!1}),children:(e,t)=>{var n=Bt();o(e,n)},$$slots:{default:!0}});var s=M(a,2);X(s,{run:()=>(f.close(),{ok:!0}),children:(e,n)=>{t();var r=R(`close contextmenu`);o(e,r)},$$slots:{default:!0}}),o(e,n)},children:(e,n)=>{t();var r=R(`select color`);o(e,r)},$$slots:{menu:!0,default:!0}})},children:(n,r)=>{var a=Wt(),s=S(a),c=M(S(s)),u=L(c,!0);t(5),O(s);var p=M(s,2);G(p,{lang:`ts`,dangerous_raw_html:`<span class="token_keyword">const</span> contextmenu <span class="token_operator">=</span> <span class="token_keyword">new</span> <span class="token_class_name">ContextmenuState</span><span class="token_punctuation">();</span>`});var m=M(p,2);{let t=U(()=>`<${e(d)} {contextmenu} scoped>...</${e(d)}>`);G(m,{get content(){return e(t)}})}var h=M(m,2),y=M(S(h));y.textContent=`{ok: true, close: false}`,t(),O(h);var x=M(h,2),C=M(S(x),2),w=S(C),T=M(S(w),2),E=L(T,!0);O(w);var D=M(w,2),k=M(S(D),2),A=L(k);O(D);var j=M(D,2),N=e=>{var t=Ht(),n=M(S(t)),r=L(n,!0);O(t),F(()=>W(r,f.error)),o(e,t)};l(j,e=>{f.error&&e(N)}),O(C),O(x);var P=M(x,2),I=t=>{var n=Ut(),r=S(n),a=S(r);Lt(S(a),{glyph:`↑`}),O(a);var s=M(a,2),c=S(s);Lt(S(c),{glyph:`←`}),O(c);var l=M(c,2);Lt(S(l),{glyph:`↵`}),O(l);var u=M(l,2);Lt(S(u),{glyph:`→`}),O(u),O(s);var d=M(s,2);Lt(S(d),{glyph:`↓`}),O(d),O(r),O(n),F(()=>{b(a,1,`border-bottom-left-radius:0 border-bottom-right-radius:0 ${e(v)??``}`),a.disabled=!f.can_select_sibling,b(c,1,`border-bottom-right-radius:0 border-top-right-radius:0 ${e(v)??``}`),c.disabled=!f.can_collapse,b(l,1,`border-radius:0 ${e(v)??``}`),l.disabled=!f.can_activate,b(u,1,`border-bottom-left-radius:0 border-top-left-radius:0 ${e(v)??``}`),u.disabled=!f.can_expand,b(d,1,`border-top-left-radius:0 border-top-right-radius:0 ${e(v)??``}`),d.disabled=!f.can_select_sibling}),_(`mousedown`,a,e=>{Z(e),f.select_previous()},!0),_(`mousedown`,c,e=>{Z(e),f.collapse_selected()},!0),_(`mousedown`,l,async e=>{Z(e),await f.activate_selected()},!0),_(`mousedown`,u,e=>{Z(e),f.expand_selected()},!0),_(`mousedown`,d,e=>{Z(e),f.select_next()},!0),i(3,n,()=>Ae),o(t,n)};l(P,e=>{f.opened&&e(I)}),O(a),F(()=>{W(u,e(d)),b(x,1,`mb_md ${e(g)??``}`),W(E,f.opened),W(A,`${f.x??``} && contextmenu.y === ${f.y??``}`)}),o(n,a)},$$slots:{entries:!0,default:!0}}),o(n,a)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(n,y),m()}var qt=g(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the
					browser's default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's
					default contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),Jt=g(`<div><!></div> <!>`,1);function Yt(i,s){a(s,!0);let c=$.get(),l=U(()=>c.component),u=new fe,d=H(!1),f=H(void 0),p=()=>{let t=window.getSelection();if(!t||!e(f))return;let n=document.createRange();n.selectNodeContents(e(f)),t.removeAllRanges(),t.addRange(n)},g=H(``),_=U(()=>e(g)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.`||e(g)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`||e(g)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`);var y=h(),x=w(y);r(x,()=>e(l),(r,i)=>{i(r,{get contextmenu(){return u},scoped:!0,children:(r,i)=>{q(r,{children:(r,i)=>{var a=Jt(),s=w(a);let c;var l=S(s);J(l,{text:`Select text`}),O(s),Q(M(s,2),{entries:n=>{X(n,{run:()=>void T(d,!e(d)),children:(e,n)=>{t();var r=R(`Toggle something`);o(e,r)},$$slots:{default:!0}})},children:(r,i)=>{var a=qt();let s;var c=S(a),l=M(S(c),2),u=M(S(l));let m;t(),O(l),O(c),P(c,e=>T(f,e),()=>e(f));var h=M(c,2),y=S(h);j(y),O(h);var x=M(h,2);let C;var w=M(x,2),E=S(w);n(E),O(w);var k=M(w,2),A=S(k);K(A,{path:`Web/HTML/Global_attributes/contenteditable`}),t(),O(k);var N=M(k,4),I=M(N,4);t(2),O(a),F(()=>{s=b(a,1,`panel p_md`,null,s,{color_g_50:e(_)}),m=b(u,1,``,null,m,{palette_a:e(d)}),C=b(x,1,``,null,C,{color_g_50:e(_)})}),v(`click`,u,p),V(y,()=>e(g),e=>T(g,e)),V(E,()=>e(g),e=>T(g,e)),D(`innerText`,N,()=>e(g),e=>T(g,e)),D(`innerText`,I,()=>e(g),e=>T(g,e)),o(r,a)},$$slots:{entries:!0,default:!0}}),F(()=>c=b(s,1,``,null,c,{color_d_50:e(_)})),o(r,a)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(i,y),m()}c([`click`]);var Xt=g(`<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>`),Zt=g(`<li>custom "some custom entry" entry</li>`),Qt=g(`<li>"copy text" entry when text is selected</li>`),$t=g(`<li>link entry when clicking on a link</li>`),en=g(`<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>`,1),tn=g(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing
			the Fuz contextmenu.</p>`),nn=g(`<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which
			ensures the Fuz contextmenu is used</label></div> <!>`,1);function rn(n,i){a(i,!0);let s=n=>{var r=Xt(),i=S(r),a=M(S(i));let s;t(),O(i),P(i,e=>T(C,e),()=>e(C));var c=M(i,2),l=M(S(c));t(),O(c),O(r),F(t=>{s=b(a,1,``,null,s,{palette_h:e(y)}),E(l,`href`,t)},[()=>oe(`/`)]),v(`click`,a,D),o(n,r)},c=$.get(),u=U(()=>c.component),d=U(()=>c.name),f=new fe,p=H(!1),g=H(!1),_=H(!0),y=H(!1),C=H(void 0),D=()=>{let t=window.getSelection();if(!t||!e(C))return;let n=document.createRange();n.selectNodeContents(e(C)),t.removeAllRanges(),t.addRange(n)};q(n,{children:(n,i)=>{var a=nn(),c=w(a);J(c,{text:`Disable default behaviors`});var m=M(c,4);{let t=U(()=>`<${e(d)}${e(p)?` link_entry={null}`:``}${e(g)?` text_entry={null}`:``}>`);G(m,{get content(){return e(t)}})}var v=M(m,2),b=S(v),C=S(b);j(C);var E=M(C,2),D=M(S(E));D.textContent=`link_entry={null}`,O(E),O(b);var k=M(b,2),A=S(k);j(A);var N=M(A,2),P=M(S(N));P.textContent=`text_entry={null}`,O(N),O(k),O(v);var F=M(v,2);{let n=U(()=>e(p)?null:void 0),i=U(()=>e(g)?null:void 0);r(F,()=>e(u),(r,a)=>{a(r,{get contextmenu(){return f},scoped:!0,get link_entry(){return e(n)},get text_entry(){return e(i)},children:(n,r)=>{var i=h(),a=w(i),c=n=>{Q(n,{entries:n=>{X(n,{icon:`>`,run:()=>void T(y,!e(y)),children:(e,n)=>{t();var r=R(`some custom entry`);o(e,r)},$$slots:{default:!0}})},children:(e,t)=>{s(e)},$$slots:{entries:!0,default:!0}})},u=e=>{s(e)};l(a,t=>{e(_)?t(c):t(u,-1)}),o(n,i)},$$slots:{default:!0}})})}var I=M(F,4),L=S(I),z=S(L);j(z),t(),O(L),O(I);var B=M(I,2),V=t=>{var n=en(),r=M(w(n),2),i=S(r),a=e=>{var t=Zt();o(e,t)};l(i,t=>{e(_)&&t(a)});var s=M(i,2),c=e=>{var t=Qt();o(e,t)};l(s,t=>{e(g)||t(c)});var u=M(s,2),d=e=>{var t=$t();o(e,t)};l(u,t=>{e(p)||t(d)}),O(r),o(t,n)},ee=e=>{var t=tn();o(e,t)};l(B,t=>{e(_)||!e(p)||!e(g)?t(V):t(ee,-1)}),x(C,()=>e(p),e=>T(p,e)),x(A,()=>e(g),e=>T(g,e)),x(z,()=>e(_),e=>T(_,e)),o(n,a)},$$slots:{default:!0}}),m()}c([`click`]);var an=g(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function on(n,i){a(i,!0);let s=$.get(),c=U(()=>s.component),l=U(()=>s.name);var u=h(),d=w(u);r(d,()=>e(c),(n,r)=>{r(n,{scoped:!0,children:(n,r)=>{q(n,{children:(n,r)=>{var i=an(),a=w(i);J(a,{text:`Default behaviors`});var s=M(a,2),c=S(s);{let t=U(()=>`<${e(l)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${e(l)}>`);G(c,{get content(){return e(t)}})}t(6),O(s),o(n,i)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(n,u),m()}var sn=g(`<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>`,1);function cn(e,n){a(n,!0);let r=ae(`Contextmenu`);$.set(),ie(e,{get tome(){return r},children:(e,n)=>{var r=sn(),i=w(r);Ze(i,{});var a=M(i,2);Pt(a,{});var s=M(a,2);on(s,{});var c=M(s,2);Yt(c,{});var l=M(c,2);rn(l,{});var u=M(l,2);Kt(u,{});var d=M(u,2);At(d,{}),nt(M(d,2),{}),t(2),o(e,r)},$$slots:{default:!0}}),m()}export{cn as t};