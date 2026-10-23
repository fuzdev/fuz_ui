import{a as e}from"./Dup6ps5H.js";import{$ as t,Ct as n,D as r,E as i,H as a,I as o,J as s,N as c,Ot as l,P as u,S as d,T as f,U as p,W as m,X as h,Y as g,Z as _,_t as v,at as y,b,c as x,dt as S,f as C,ft as w,h as T,ht as E,i as D,jt as O,k,kt as A,l as j,lt as M,m as N,n as P,o as F,ot as I,p as L,pt as R,q as z,t as B,u as V,ut as H,w as ee,wt as U,x as te,xt as ne,y as re,yt as W,z as G}from"./CmwoW_WP.js";import{t as ie}from"./BI7mQseu.js";import{a as ae,i as oe,n as se,o as ce,r as le,t as ue}from"./DA_vUSze.js";import{a as de}from"./DIi0oe83.js";import{i as K}from"./07-Goqe_.js";import{t as fe}from"./L3m6erA7.js";import{a as pe,c as me,d as he,f as ge,h as _e,i as ve,l as ye,m as be,n as xe,o as Se,p as q,r as Ce,s as we,t as Te,u as Ee}from"./r9zpZqBm.js";import{f as De}from"./zE9X3q7l.js";import{s as Oe}from"./kq7acyvz.js";import"./DklaXAfF.js";import{n as ke}from"./BBAXxzVJ.js";import{t as J}from"./Cbkf3F8c.js";import{n as Ae,t as je}from"./Csd1rusv.js";import{t as Y}from"./dRIM_1UX.js";import{t as Me}from"./DLXxB25I.js";import{n as X,t as Z}from"./qxTrOQPC.js";import{r as Ne,t as Pe}from"./3rDUBGrt.js";import{t as Fe}from"./CeX5MSVJ.js";import{n as Ie,t as Le}from"./eAHGyNF3.js";import{t as Re}from"./BMu3LiLT.js";import{t as ze}from"./e7pQDzjd.js";var Be=new Set([`$$slots`,`$$events`,`$$legacy`,`tag`,`entries`,`children`]);function Q(e,t){U(t,!0);let r=B(t,`tag`,3,`span`),i=P(t,Be);var s=p(),c=S(s);ee(c,r,!1,(e,n)=>{d(e,()=>se(t.entries)),L(e,()=>({...i,[C]:{display:`contents`}}));var r=p(),s=S(r);o(s,()=>t.children),a(n,r)}),a(e,s),n()}var Ve=m(`<div class="contextmenu-root svelte-1472w04" role="group"><!></div>`),He=m(`<!> <!>`,1);function Ue(e,r){U(r,!0);let i=B(r,`contextmenu`,19,()=>new ue),s=B(r,`longpress_move_tolerance`,3,21),l=B(r,`longpress_duration`,3,633),u=B(r,`bypass_with_tap_then_longpress`,3,!0),f=B(r,`bypass_window`,3,750),m=B(r,`bypass_move_tolerance`,3,11),y=B(r,`open_offset_x`,3,-2),b=B(r,`open_offset_y`,3,-2),x=B(r,`scoped`,3,!1),C=B(r,`link_entry`,3,Ce),w=B(r,`text_entry`,3,pe),T=B(r,`separator_entry`,3,ve);oe.set(()=>i()),le(()=>x());let D=v(void 0),O=0,k=0,j=null,N=!1,P=new Se,F=new we,I=()=>{document.body.classList.add(`contextmenu-pending`)},L=()=>{document.body.classList.remove(`contextmenu-pending`)},z=()=>{N=!1,j!==null&&(clearTimeout(j),j=null),L()},V=()=>{z(),P.reset()},ee=W(()=>({open_offset_x:y(),open_offset_y:b(),link_enabled:C()!==null,text_enabled:w()!==null,separator_enabled:T()!==null})),te=e=>{if(!P.consume()){if(N){if(t(D)?.contains(e.target))return;V(),K(e)}else Ee(e,i(),t(D),F,t(ee))&&V()}},ne=e=>{N=!1,F.touchstart();let{touches:n,target:r}=e;if(i().opened||n.length!==1||!ye(r,e.shiftKey)){V();return}let{clientX:a,clientY:o}=n[0];u()&&P.track(a,o,f(),m())||(O=a,k=o,I(),j!==null&&z(),j=setTimeout(()=>{N=!0,L(),ce(r,O+y(),k+b(),i(),t(ee))&&F.opened()},l()))},re=e=>{if(j===null||i().opened)return;let{touches:t}=e;if(t.length!==1)return;let{clientX:n,clientY:r}=t[0];Math.hypot(n-O,r-k)>s()?z():e.preventDefault()},G=e=>{F.touchend(e),j!==null&&z(),P.consume()},ie=()=>{F.reset(),V()},ae=e=>{let t={passive:!0,capture:!0},n={passive:!1,capture:!0},r=_(e,`touchstart`,ne,t),i=_(e,`touchmove`,re,n),a=_(e,`touchend`,G,n),o=_(e,`touchcancel`,ie,t);return()=>{r(),i(),a(),o()}};var se=He();h(`contextmenu`,M,function(...e){(x()?void 0:te)?.apply(this,e)}),d(M,()=>x()?void 0:ae);var de=S(se),fe=e=>{var t=Ve(),n=H(t);o(n,()=>r.children),A(t),d(t,()=>ae),g(`contextmenu`,t,te),a(e,t)},me=e=>{var t=p(),n=S(t);o(n,()=>r.children),a(e,t)};c(de,e=>{x()?e(fe):e(me,-1)});var he=R(de,2);xe(he,{get contextmenu(){return i()},get open_guard(){return F},get link_entry(){return C()},get text_entry(){return w()},get separator_entry(){return T()},get el(){return t(D)},set el(e){E(D,e)}}),a(e,se),n()}s([`contextmenu`]);var $=ie(()=>new We(`standard`)),We=class{#e=v();get variant(){return t(this.#e)}set variant(e){E(this.#e,e)}#t=W(()=>this.variant===`standard`?Te:Ue);get component(){return t(this.#t)}set component(e){E(this.#t,e)}#n=W(()=>this.component===Te?`ContextmenuRoot`:`ContextmenuRootForSafariCompatibility`);get name(){return t(this.#n)}set name(e){E(this.#n,e)}constructor(e=`standard`){this.variant=e}},Ge=m(`<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <!></div></label> <label class="row"><input type="radio"/> <div>iOS compat <!></div></label></fieldset>`);function Ke(e,t){U(t,!0);let r=[],i=$.get();var o=Ge(),s=R(H(o),2),c=H(s);N(c),c.value=c.__value=`standard`;var l=R(c,2),u=R(H(l));J(u,{name:`ContextmenuRoot`}),A(l),A(s);var d=R(s,2),f=H(d);N(f),f.value=f.__value=`compat`;var p=R(f,2),m=R(H(p));J(m,{name:`ContextmenuRootForSafariCompatibility`}),A(p),A(d),A(o),j(r,[],c,()=>i.variant,e=>i.variant=e),j(r,[],f,()=>i.variant,e=>i.variant=e),a(e,o),n()}var qe=m(`<p class="panel p_md">alert B -- also inherits A</p>`),Je=m(`<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>`),Ye=m(`<code>navigator.vibrate</code>`),Xe=m(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
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
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function Ze(e,i){U(i,!0);let o=$.get(),s=W(()=>o.component),c=W(()=>o.name);X(e,{children:(e,n)=>{var i=Xe(),o=S(i);Z(o,{text:`Introduction`});var u=R(o,2),d=R(H(u));Re(d,{path:`Web/API/Element/contextmenu_event`}),l(3),A(u);var f=R(u,2),p=R(H(f));J(p,{name:`ContextmenuRoot`});var m=R(p,2);J(m,{name:`Contextmenu`}),l(),A(f);var h=R(f,2),g=R(H(h)),_=w(g,!0),v=R(g,2);J(v,{name:`Contextmenu`});var b=R(v,2);J(b,{name:`Contextmenu`}),l(),A(h);var x=R(h,2);r(x,()=>t(s),(e,t)=>{t(e,{scoped:!0,children:(e,t)=>{Q(e,{entries:e=>{q(e,{run:()=>alert(`alert A`),children:(e,t)=>{l();var n=z(`alert A`);a(e,n)},$$slots:{default:!0}})},children:(e,t)=>{var n=Je();Q(R(H(n),2),{entries:e=>{q(e,{run:()=>alert(`alert B`),children:(e,t)=>{l();var n=z(`alert B`);a(e,n)},$$slots:{default:!0}})},children:(e,t)=>{var n=qe();a(e,n)},$$slots:{entries:!0,default:!0}}),A(n),a(e,n)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var C=R(x,2);Fe(C,{summary:e=>{l();var t=z(`view code`);a(e,t)},children:(e,n)=>{{let n=W(()=>`<${t(c)}>
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
</${t(c)}>`);Y(e,{get content(){return t(n)}})}},$$slots:{summary:!0,default:!0}});var T=R(C,2),E=R(H(T));J(E,{name:`Contextmenu`}),l(),A(T);var D=R(T,12),O=R(H(D),2),k=R(H(O));Re(k,{path:`Web/API/Navigator/vibrate`,children:(e,t)=>{var n=Ye();a(e,n)},$$slots:{default:!0}}),A(O),A(D),Ke(R(D,2),{}),y(()=>G(_,t(c))),a(e,i)},$$slots:{default:!0}}),n()}var Qe=m(`<span class="font_family_mono">contextmenu</span> event`,1),$e=m(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
		Safari not supporting the <code>contextmenu</code> event as of October 2025, see <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a>.</p> <p>Use <!> by default for better performance and haptic
		feedback. Use <!> only if you need
		iOS Safari support.</p> <h4>ContextmenuRoot</h4> <ul><li>standard, default implementation</li> <li>relies on the browser's <!></li> <li>much simpler, better performance with fewer and less intrusive event handlers, fewer edge
			cases that can go wrong</li> <li>does not work on iOS Safari until <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a> is fixed</li></ul> <h4>ContextmenuRootForSafariCompatibility</h4> <ul><li>opt-in hacky alternative when iOS support is needed</li> <li>implements custom longpress detection to work around iOS Safari's lacking <a href="https://bugs.webkit.org/show_bug.cgi?id=213953"><code>contextmenu</code> event support</a></li> <li>degraded experience because some browsers (including mobile Chrome) block <code>navigator.vibrate</code> haptic feedback due to the timeout-based gesture detection
			(because it's not a direct user action)</li> <li>works on all devices including iOS Safari</li> <li>more complex implementation with custom touch event handling and gesture detection, may cause
			edge case UX problems on some devices</li> <li>a longpress is cancelled if you move the touch past a threshold before it triggers</li> <li>opt into this version only if you need iOS Safari support</li></ul> <!>`,1),et=m(`<!> <p>The Fuz contextmenu provides powerful app-specific UX, but it breaks from normal browser
		behavior by replacing the system contextmenu.</p> <p>To mitigate the downsides:</p> <ul><li>The Fuz contextmenu only replaces the system contextmenu when the DOM tree has defined
			behaviors. Note that <code>a</code> links have default contextmenu behaviors unless disabled.
			Other interactive elements may have default behaviors added in the future.</li> <li>The Fuz contextmenu does not open on elements that allow clipboard pasting like inputs,
			textareas, and contenteditables -- however this may change for better app integration, or be
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),tt=m(`<!> <!>`,1);function nt(e){var t=tt(),n=S(t);X(n,{children:(e,t)=>{var n=$e(),r=S(n);Z(r,{text:`iOS compatibility`});var i=R(r,4),o=R(H(i));J(o,{name:`ContextmenuRoot`});var s=R(o,2);J(s,{name:`ContextmenuRootForSafariCompatibility`}),l(),A(i);var c=R(i,4),u=R(H(c),2),d=R(H(u));Re(d,{path:`Web/API/Element/contextmenu_event`,children:(e,t)=>{var n=Qe();l(),a(e,n)},$$slots:{default:!0}}),A(u),l(4),A(c),Ke(R(c,6),{}),a(e,n)},$$slots:{default:!0}});var r=R(n,2);X(r,{children:(e,t)=>{var n=et(),r=S(n);Z(r,{text:`Caveats`});var i=R(r,8),o=R(H(i));Re(o,{path:`Web/API/Element/contextmenu_event`}),l(3),A(i),a(e,n)},$$slots:{default:!0}}),a(e,t)}function rt(e){let t=e-1;return t*t*t+1}function it(e){return--e*e*e*e*e+1}function at(e,{from:t,to:n},r={}){var{delay:i=0,duration:a=e=>Math.sqrt(e)*120,easing:o=rt}=r,s=getComputedStyle(e),c=s.transform===`none`?``:s.transform,[l,u]=s.transformOrigin.split(` `).map(parseFloat);l/=e.clientWidth,u/=e.clientHeight;var d=ot(e),f=e.clientWidth/n.width/d,p=e.clientHeight/n.height/d,m=t.left+t.width*l,h=t.top+t.height*u,g=n.left+n.width*l,_=n.top+n.height*u,v=(m-g)*f,y=(h-_)*p,b=t.width/n.width,x=t.height/n.height;return{delay:i,duration:typeof a==`function`?a(Math.sqrt(v*v+y*y)):a,easing:o,css:(e,t)=>`transform: ${c} translate(${t*v}px, ${t*y}px) scale(${e+t*b}, ${e+t*x});`}}function ot(e){if(`currentCSSZoom`in e)return e.currentCSSZoom;for(var t=e,n=1;t!==null;)n*=+getComputedStyle(t).zoom,t=t.parentElement;return n}var st=m(`<menu class="pane unstyled svelte-6kuqba"><!></menu>`),ct=m(`<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-haspopup="menu" tabindex="-1"><div class="content"><div class="icon"><!></div> <div class="title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>`);function lt(e,r){U(r,!0);let i=oe.get(),s=W(i),d=i().add_submenu(),f=W(()=>t(s).layout),p=W(()=>d.selected),m=v(void 0),g=ae.get(),_=ae.set(),x=v(0),S=v(0);I(()=>{t(m)&&C(t(m),t(f),g)});let C=(e,n,r)=>{let{x:i,y:a,width:o,height:s}=e.getBoundingClientRect();_.width=o,_.height=s;let c=me({base_x:i-t(x),base_y:a-t(S),width:o,height:s,parent_width:r.width,layout_width:n.width,layout_height:n.height});E(x,c.x),E(S,c.y)},w=null;u(()=>{w!==null&&clearTimeout(w)});var D=ct();let O;var k=H(D),j=H(k),M=H(j),N=H(M);_e(N,{get icon(){return r.icon}}),A(M);var P=R(M,2),L=H(P);o(L,()=>r.children),A(P),A(j),l(2),A(k);var z=R(k,2),B=e=>{var n=st();let i;var s=H(n);o(s,()=>r.menu),A(n),F(n,e=>E(m,e),()=>t(m)),y(()=>i=re(n,``,i,{transform:`translate3d(${t(x)??``}px, ${t(S)??``}px, 0)`,"max-height":`${t(f).height??``}px`})),a(e,n)};c(z,e=>{t(p)&&e(B)}),A(D),y(()=>{O=re(D,``,O,{"--contextmenu_depth":d.depth}),b(k,1,te([`menuitem plain selectable`,{selected:t(p)}])),T(k,`aria-expanded`,t(p))}),h(`mouseenter`,k,e=>{K(e),w!==null&&clearTimeout(w),w=setTimeout(()=>{w=null,t(s).select(d)})}),a(e,D),n()}var ut=m(`<!> <!>`,1);function dt(e,r){U(r,!0);let i=B(r,`name`,3,`Cat`),o=B(r,`icon`,3,`😺`);lt(e,{get icon(){return o()},menu:e=>{var n=ut(),o=S(n);{let e=W(()=>r.position===`adventure`?`🏠`:`🌄`);q(o,{run:()=>r.act({type:r.position===`adventure`?`cat_go_home`:`cat_go_adventure`,name:i()}),get icon(){return t(e)},children:(e,t)=>{var n=p(),i=S(n),o=e=>{var t=z(`go home`);a(e,t)},s=e=>{var t=z(`go adventure`);a(e,t)};c(i,e=>{r.position===`adventure`?e(o):e(s,-1)}),a(e,n)},$$slots:{default:!0}})}var s=R(o,2);{let e=W(()=>r.position===`adventure`?`🌄`:`🏠`);q(s,{run:()=>r.act({type:`cat_be_or_do`,name:i(),position:r.position}),get icon(){return t(e)},children:(e,t)=>{var n=p(),i=S(n),o=e=>{var t=z(`do adventure`);a(e,t)},s=e=>{var t=z(`be home`);a(e,t)};c(i,e=>{r.position===`adventure`?e(o):e(s,-1)}),a(e,n)},$$slots:{default:!0}})}a(e,n)},children:(e,t)=>{l();var n=z();y(()=>G(n,i())),a(e,n)},$$slots:{menu:!0,default:!0}}),n()}var ft=m(`<!> <!> <!>`,1);function pt(t,n){var r=ft(),i=S(r);be(i,{href:`https://github.com/fuzdev/fuz_ui`,icon:e=>{fe(e,{get data(){return De},size:`var(--icon_size_xs)`})},children:(e,t)=>{l();var n=z(`Source code`);a(e,n)},$$slots:{icon:!0,default:!0}});var o=R(i,2);he(o,{});var s=R(o,2);q(s,{get run(){return n.toggle_about_dialog},icon:t=>{fe(t,{get data(){return e},size:`var(--icon_size_xs)`})},children:(e,t)=>{l();var n=z(`About`);a(e,n)},$$slots:{icon:!0,default:!0}}),a(t,r)}var mt=e=>{let t=e.length;if(t===2)return`cats`;if(t===0)return null;let n=e[0];return n.icon+n.name},ht=m(`<!> <!>`,1),gt=m(`<!> <!> <!>`,1);function _t(e,r){U(r,!0);let i=W(()=>mt(r.adventure_cats));lt(e,{icon:`🏠`,menu:e=>{var n=gt(),o=S(n),s=e=>{var t=ht(),n=S(t);q(n,{run:()=>r.act({type:`call_cats_home`}),icon:`🐈‍⬛`,children:(e,t)=>{l();var n=z(`call`);a(e,n)},$$slots:{default:!0}});var i=R(n,2),o=e=>{he(e,{})};c(i,e=>{r.home_cats.length>0&&e(o)}),a(e,t)};c(o,e=>{t(i)&&e(s)});var u=R(o,2);k(u,17,()=>r.home_cats,e=>e.name,(e,n)=>{dt(e,{get name(){return t(n).name},get icon(){return t(n).icon},get position(){return t(n).position},get act(){return r.act}})});var d=R(u,2),f=e=>{var t=ht(),n=S(t);q(n,{run:()=>r.act({type:`cat_be_or_do`,name:null,position:`home`}),icon:`🏠`,children:(e,t)=>{l();var n=z(`be`);a(e,n)},$$slots:{default:!0}});var i=R(n,2);q(i,{run:()=>r.act({type:`call_cats_adventure`}),icon:`🦋`,children:(e,t)=>{l();var n=z(`leave`);a(e,n)},$$slots:{default:!0}}),a(e,t)};c(d,e=>{t(i)||e(f)}),a(e,n)},children:(e,t)=>{l();var n=z(`home`);a(e,n)},$$slots:{menu:!0,default:!0}}),n()}var vt=m(`<!> <!>`,1),yt=m(`<!> <!> <!>`,1);function bt(e,r){U(r,!0);let i=W(()=>mt(r.home_cats));lt(e,{icon:`🌄`,menu:e=>{var n=yt(),o=S(n),s=e=>{var t=vt(),n=S(t);q(n,{run:()=>r.act({type:`call_cats_adventure`}),icon:`🦋`,children:(e,t)=>{l();var n=z(`call`);a(e,n)},$$slots:{default:!0}});var i=R(n,2),o=e=>{he(e,{})};c(i,e=>{r.adventure_cats.length>0&&e(o)}),a(e,t)};c(o,e=>{t(i)&&e(s)});var u=R(o,2);k(u,17,()=>r.adventure_cats,e=>e.name,(e,n)=>{dt(e,{get name(){return t(n).name},get icon(){return t(n).icon},get position(){return t(n).position},get act(){return r.act}})});var d=R(u,2),f=e=>{var t=vt(),n=S(t);q(n,{run:()=>r.act({type:`cat_be_or_do`,name:null,position:`adventure`}),icon:`🌄`,children:(e,t)=>{l();var n=z(`do`);a(e,n)},$$slots:{default:!0}});var i=R(n,2);q(i,{run:()=>r.act({type:`call_cats_home`}),icon:`🐈‍⬛`,children:(e,t)=>{l();var n=z(`leave`);a(e,n)},$$slots:{default:!0}}),a(e,t)};c(d,e=>{t(i)||e(f)}),a(e,n)},children:(e,t)=>{l();var n=z(`adventure`);a(e,n)},$$slots:{menu:!0,default:!0}}),n()}var xt=m(`<span class="cat svelte-1py4cgo"><span class="icon svelte-1py4cgo"> </span><span class="name svelte-1py4cgo"><!> </span></span>`);function St(e,t){let n=B(t,`name`,3,`Cat`),r=B(t,`icon`,3,`😺`);var i=xt(),s=H(i),c=w(s,!0),l=R(s),u=H(l);o(u,()=>t.children??O);var d=R(u,1,!0);A(l),A(i),y(()=>{G(c,r()),G(d,n())}),a(e,i)}var Ct=`<script lang="ts">
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
			<blockquote>Svelte UI library</blockquote>
			<blockquote>
				free and open source at<br /><GithubLink path="fuzdev/fuz_ui" />
			</blockquote>
			<code class="display:block p_md mb_lg">
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
`,wt=m(`<!> <!>`,1),Tt=m(`<div class="cat-wrapper svelte-177dlvm"><div><!></div></div>`),Et=m(`<div class="position home svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>`),Dt=m(`<div class="position adventure svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>`),Ot=m(`<section class="display:flex svelte-177dlvm"><div class="svelte-177dlvm"><!> <!></div></section> <section class="svelte-177dlvm"><!></section>`,1),kt=m(`<h1 class="svelte-177dlvm">About Fuz</h1> <blockquote class="svelte-177dlvm">Svelte UI library</blockquote> <blockquote class="svelte-177dlvm">free and open source at<br class="svelte-177dlvm"/><!></blockquote> <code class="display:block p_md mb_lg svelte-177dlvm">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui" class="svelte-177dlvm">@fuzdev/fuz_ui</a></code> <div class="p_xl box svelte-177dlvm"><h2 class="svelte-177dlvm">Color scheme</h2> <!> <h2 class="svelte-177dlvm">Theme</h2> <!></div>`,1);function At(e,o){U(o,!0);let s=$.get(),u=W(()=>s.component),d=`Alyssa`,p=`home`,m=v(p),g=v(p),_=W(()=>t(m)===t(g)?`😺`:`😾`),x=W(()=>t(m)===t(g)?`😸`:`😿`),C=W(()=>({name:d,icon:t(_),position:t(m)})),w=W(()=>({name:`Ben`,icon:t(x),position:t(g)})),T=v(!1),D=new Oe,O=(e,t)=>{let n=[],r=[];for(let i of e){let e=i.position===`home`?n:r;t?e.unshift(i):e.push(i)}return{home_cats:n,adventure_cats:r}},j=W(()=>O([t(C),t(w)],t(T))),M=W(()=>t(j).home_cats),N=W(()=>t(j).adventure_cats),P=W(()=>t(m)!==p||t(g)!==p),F=()=>{E(m,p),E(g,p)},I=v(!1),L=()=>{E(I,!t(I))},B=e=>{switch(e.type){case`call_cats_adventure`:E(m,`adventure`),E(g,`adventure`);break;case`call_cats_home`:E(m,`home`),E(g,`home`);break;case`cat_go_adventure`:e.name===d?E(m,`adventure`):e.name===`Ben`&&E(g,`adventure`);break;case`cat_go_home`:e.name===d?E(m,`home`):e.name===`Ben`&&E(g,`home`);break;case`cat_be_or_do`:{let n=e.position===`home`?t(M):t(N);if(n.length>1)E(T,!t(T));else for(let e of n)D.add(e.name);break}}},[V,ee]=Pe({fallback:(e,t)=>{let n=window.getComputedStyle(e),r=n.transform===`none`?``:n.transform;return{duration:1500,easing:it,css:e=>`
					transform: ${r} scale(${e});
					opacity: ${e}
				`}}});var te=wt(),ne=S(te);r(ne,()=>t(u),(e,n)=>{n(e,{scoped:!0,children:(e,n)=>{X(e,{children:(e,n)=>{var r=wt(),o=S(r);Z(o,{text:`Full example`}),Q(R(o,2),{entries:e=>{var n=wt(),r=S(n),i=e=>{ge(e,{run:F,content:`Reset`,icon:`↻`})};c(r,e=>{t(P)&&e(i)}),pt(R(r,2),{toggle_about_dialog:L}),a(e,n)},children:(e,n)=>{var r=Ot(),o=S(r),s=H(o),c=H(s);Q(c,{entries:e=>{_t(e,{act:B,get home_cats(){return t(M)},get adventure_cats(){return t(N)}})},children:(e,n)=>{var r=Et(),o=R(H(r),2);k(o,29,()=>t(M),({name:e,icon:t,position:n})=>e,(e,n)=>{let r=()=>t(n).name,o=()=>t(n).icon,s=()=>t(n).position;var c=Tt(),l=H(c);let u;Q(H(l),{entries:e=>{dt(e,{act:B,get name(){return r()},get icon(){return o()},get position(){return s()}})},children:(e,t)=>{St(e,{get name(){return r()},get icon(){return o()}})},$$slots:{entries:!0,default:!0}}),A(l),A(c),y(e=>u=b(l,1,`svelte-177dlvm`,null,u,{shaking:e}),[()=>D.has(r())]),h(`animationend`,l,()=>D.delete(r())),i(1,c,()=>ee,()=>({key:r()})),i(2,c,()=>V,()=>({key:r()})),f(c,()=>at,null),a(e,c)}),A(o),A(r),a(e,r)},$$slots:{entries:!0,default:!0}}),Q(R(c,2),{entries:e=>{bt(e,{act:B,get home_cats(){return t(M)},get adventure_cats(){return t(N)}})},children:(e,n)=>{var r=Dt(),o=R(H(r),2);k(o,29,()=>t(N),({name:e,icon:t,position:n})=>e,(e,n)=>{let r=()=>t(n).name,o=()=>t(n).icon,s=()=>t(n).position;var c=Tt(),l=H(c);let u;Q(H(l),{entries:e=>{dt(e,{act:B,get name(){return r()},get icon(){return o()},get position(){return s()}})},children:(e,t)=>{St(e,{get name(){return r()},get icon(){return o()}})},$$slots:{entries:!0,default:!0}}),A(l),A(c),y(e=>u=b(l,1,`svelte-177dlvm`,null,u,{shaking:e}),[()=>D.has(r())]),h(`animationend`,l,()=>D.delete(r())),i(1,c,()=>ee,()=>({key:r()})),i(2,c,()=>V,()=>({key:r()})),f(c,()=>at,null),a(e,c)}),A(o),A(r),a(e,r)},$$slots:{entries:!0,default:!0}}),A(s),A(o);var u=R(o,2),d=H(u);Fe(d,{summary:e=>{l();var t=z(`View example source`);a(e,t)},children:(e,t)=>{Y(e,{get content(){return Ct}})},$$slots:{summary:!0,default:!0}}),A(u),a(e,r)},$$slots:{entries:!0,default:!0}}),a(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}})});var re=R(ne,2),G=e=>{Ae(e,{onclose:()=>E(I,!1),children:(e,t)=>{je(e,{children:(e,t)=>{var n=kt(),r=R(S(n),4),i=R(H(r),2);ze(i,{path:`fuzdev/fuz_ui`}),A(r);var o=R(r,4),s=R(H(o),2);Ie(s,{});var c=R(s,4);Le(c,{}),A(o),a(e,n)},$$slots:{default:!0}})},$$slots:{default:!0}})};c(re,e=>{t(I)&&e(G)}),a(e,te),n()}var jt=m(`<!> <!> <!>`,1),Mt=m(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific
					element instead of the entire page.</aside></div>`),Nt=m(`<!> <!>`,1);function Pt(e,i){U(i,!0);let o=$.get(),s=W(()=>o.component),c=W(()=>o.name),u=v(!1),d=v(!1),f=v(!1);var m=p(),h=S(m);r(h,()=>t(s),(e,n)=>{n(e,{scoped:!0,children:(e,n)=>{X(e,{children:(e,n)=>{var r=Nt(),i=S(r);Z(i,{text:`Basic usage`}),Q(R(i,2),{entries:e=>{var n=jt(),r=S(n);q(r,{run:()=>void E(u,!t(u)),children:(e,t)=>{l();var n=z(`Hello world`);a(e,n)},$$slots:{default:!0}});var i=R(r,2);q(i,{run:()=>void E(d,!t(d)),icon:e=>{l();var t=z(`🌞`);a(e,t)},children:(e,t)=>{l();var n=z(`Hello with an optional icon snippet`);a(e,n)},$$slots:{icon:!0,default:!0}});var o=R(i,2);q(o,{run:()=>void E(f,!t(f)),icon:`🌚`,children:(e,t)=>{l();var n=z(`Hello with an optional icon string`);a(e,n)},$$slots:{default:!0}}),a(e,n)},children:(e,n)=>{var r=Mt(),i=R(H(r),2);{let e=W(()=>`<${t(c)} scoped>
  <Contextmenu>
    {#snippet entries()}
      <ContextmenuEntry run={() => (greeted = !greeted)}>
        Hello world <!-- ${t(u)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_snippet = !greeted_icon_snippet)}>
        {#snippet icon()}🌞{/snippet}
        Hello with an optional icon snippet <!-- ${t(d)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_string = !greeted_icon_string)} icon="🌚">
        Hello with an optional icon string <!-- ${t(f)} -->
      </ContextmenuEntry>
    {/snippet}
    ...markup with the above contextmenu behavior...
  </Contextmenu>
  ...markup with only default contextmenu behavior...
</${t(c)}>
...markup without contextmenu behavior...`);Y(i,{get content(){return t(e)}})}var o=R(i,2),s=H(o);let p;var m=w(s);A(o);var h=R(o,2),g=H(h);let _;var v=w(g);A(h);var x=R(h,2),S=H(x);let C;var T=w(S);A(x),l(2),A(r),y(()=>{p=b(s,1,``,null,p,{color_g_50:t(u)}),G(m,`greeted = ${t(u)??``}`),_=b(g,1,``,null,_,{color_e_50:t(d)}),G(v,`greeted_icon_snippet = ${t(d)??``}`),C=b(S,1,``,null,C,{color_d_50:t(f)}),G(T,`greeted_icon_string = ${t(f)??``}`)}),a(e,r)},$$slots:{entries:!0,default:!0}}),a(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}})}),a(e,m),n()}var Ft=new Set([`$$slots`,`$$events`,`$$legacy`,`glyph`,`size`]),It=m(`<span> </span>`);function Lt(e,r){U(r,!0);let i=P(r,Ft),o=W(()=>r.size??`var(--font_size, 1em)`);var s=It();L(s,()=>({...i,class:`glyph display:inline-block text-align:center line-height:1 white-space:nowrap font-weight:400 ${r.class??``}`,[C]:{width:t(o),height:t(o),"min-width":t(o),"min-height":t(o),"font-size":r.size??`var(--font_size, inherit)`}}));var c=w(s,!0);y(()=>G(c,r.glyph)),a(e,s),n()}var Rt=m(`<span class="color_f_50">option f</span>`),zt=m(`<span class="color_g_50">option g</span>`),Bt=m(`<span class="color_j_50">option j</span>`),Vt=m(`<!> <!> <!> <!>`,1),Ht=m(`<li class="negative_60">Error: <code> </code></li>`),Ut=m(`<div class="display:flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>`),Wt=m(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and
					control it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing
					you to select multiple colors using the activate button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),Gt=m(`<!> <!>`,1);function Kt(e,o){U(o,!0);let s=$.get(),u=W(()=>s.component),d=W(()=>s.name),f=new ue,m=v(void 0),g=W(()=>t(m)?`color_${t(m)}_50`:void 0),_=W(()=>t(m)?`palette_${t(m)}`:void 0);var x=p(),C=S(x);r(C,()=>t(u),(e,n)=>{n(e,{get contextmenu(){return f},scoped:!0,children:(e,n)=>{X(e,{children:(e,n)=>{var r=Gt(),o=S(r);Z(o,{text:`Custom instance`}),Q(R(o,2),{entries:e=>{lt(e,{icon:`🎨`,menu:e=>{var t=Vt(),n=S(t);q(n,{run:()=>(E(m,`f`),{ok:!0,close:!1}),children:(e,t)=>{var n=Rt();a(e,n)},$$slots:{default:!0}});var r=R(n,2);q(r,{run:()=>(E(m,`g`),{ok:!0,close:!1}),children:(e,t)=>{var n=zt();a(e,n)},$$slots:{default:!0}});var i=R(r,2);q(i,{run:()=>(E(m,`j`),{ok:!0,close:!1}),children:(e,t)=>{var n=Bt();a(e,n)},$$slots:{default:!0}});var o=R(i,2);q(o,{run:()=>(f.close(),{ok:!0}),children:(e,t)=>{l();var n=z(`close contextmenu`);a(e,n)},$$slots:{default:!0}}),a(e,t)},children:(e,t)=>{l();var n=z(`select color`);a(e,n)},$$slots:{menu:!0,default:!0}})},children:(e,n)=>{var r=Wt(),o=H(r),s=R(H(o)),u=w(s,!0);l(5),A(o);var p=R(o,2);Y(p,{lang:`ts`,dangerous_raw_html:`<span class="token_keyword">const</span> contextmenu <span class="token_operator">=</span> <span class="token_keyword">new</span> <span class="token_class_name">ContextmenuState</span><span class="token_punctuation">();</span>`});var m=R(p,2);{let e=W(()=>`<${t(d)} {contextmenu} scoped>...</${t(d)}>`);Y(m,{get content(){return t(e)}})}var v=R(m,2),x=R(H(v));x.textContent=`{ok: true, close: false}`,l(),A(v);var S=R(v,2),C=R(H(S),2),T=H(C),E=R(H(T),2),D=w(E,!0);A(T);var O=R(T,2),k=R(H(O),2),j=w(k);A(O);var M=R(O,2),N=e=>{var t=Ht(),n=R(H(t)),r=w(n,!0);A(t),y(()=>G(r,f.error)),a(e,t)};c(M,e=>{f.error&&e(N)}),A(C),A(S);var P=R(S,2),F=e=>{var n=Ut(),r=H(n),o=H(r);Lt(H(o),{glyph:`↑`}),A(o);var s=R(o,2),c=H(s);Lt(H(c),{glyph:`←`}),A(c);var l=R(c,2);Lt(H(l),{glyph:`↵`}),A(l);var u=R(l,2);Lt(H(u),{glyph:`→`}),A(u),A(s);var d=R(s,2);Lt(H(d),{glyph:`↓`}),A(d),A(r),A(n),y(()=>{b(o,1,`border-bottom-left-radius:0 border-bottom-right-radius:0 ${t(_)??``}`),o.disabled=!f.can_select_sibling,b(c,1,`border-bottom-right-radius:0 border-top-right-radius:0 ${t(_)??``}`),c.disabled=!f.can_collapse,b(l,1,`border-radius:0 ${t(_)??``}`),l.disabled=!f.can_activate,b(u,1,`border-bottom-left-radius:0 border-top-left-radius:0 ${t(_)??``}`),u.disabled=!f.can_expand,b(d,1,`border-top-left-radius:0 border-top-right-radius:0 ${t(_)??``}`),d.disabled=!f.can_select_sibling}),h(`mousedown`,o,e=>{K(e),f.select_previous()},!0),h(`mousedown`,c,e=>{K(e),f.collapse_selected()},!0),h(`mousedown`,l,async e=>{K(e),await f.activate_selected()},!0),h(`mousedown`,u,e=>{K(e),f.expand_selected()},!0),h(`mousedown`,d,e=>{K(e),f.select_next()},!0),i(3,n,()=>Ne),a(e,n)};c(P,e=>{f.opened&&e(F)}),A(r),y(()=>{G(u,t(d)),b(S,1,`mb_md ${t(g)??``}`),G(D,f.opened),G(j,`${f.x??``} && contextmenu.y === ${f.y??``}`)}),a(e,r)},$$slots:{entries:!0,default:!0}}),a(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}})}),a(e,x),n()}var qt=m(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the
					browser's default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's
					default contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),Jt=m(`<div><!></div> <!>`,1);function Yt(e,i){U(i,!0);let o=$.get(),s=W(()=>o.component),c=new ue,u=v(!1),d=v(void 0),f=()=>{let e=window.getSelection();if(!e||!t(d))return;let n=document.createRange();n.selectNodeContents(t(d)),e.removeAllRanges(),e.addRange(n)},m=v(``),h=W(()=>t(m)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.`||t(m)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`||t(m)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`);var _=p(),x=S(_);r(x,()=>t(s),(e,n)=>{n(e,{get contextmenu(){return c},scoped:!0,children:(e,n)=>{X(e,{children:(e,n)=>{var r=Jt(),i=S(r);let o;var s=H(i);Z(s,{text:`Select text`}),A(i),Q(R(i,2),{entries:e=>{q(e,{run:()=>void E(u,!t(u)),children:(e,t)=>{l();var n=z(`Toggle something`);a(e,n)},$$slots:{default:!0}})},children:(e,n)=>{var r=qt();let i;var o=H(r),s=R(H(o),2),c=R(H(s));let p;l(),A(s),A(o),F(o,e=>E(d,e),()=>t(d));var _=R(o,2),v=H(_);N(v),A(_);var x=R(_,2);let S;var C=R(x,2),w=H(C);ne(w),A(C);var T=R(C,2),O=H(T);Re(O,{path:`Web/HTML/Global_attributes/contenteditable`}),l(),A(T);var k=R(T,4),j=R(k,4);l(2),A(r),y(()=>{i=b(r,1,`panel p_md`,null,i,{color_g_50:t(h)}),p=b(c,1,``,null,p,{palette_a:t(u)}),S=b(x,1,``,null,S,{color_g_50:t(h)})}),g(`click`,c,f),V(v,()=>t(m),e=>E(m,e)),V(w,()=>t(m),e=>E(m,e)),D(`innerText`,k,()=>t(m),e=>E(m,e)),D(`innerText`,j,()=>t(m),e=>E(m,e)),a(e,r)},$$slots:{entries:!0,default:!0}}),y(()=>o=b(i,1,``,null,o,{color_d_50:t(h)})),a(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}})}),a(e,_),n()}s([`click`]);var Xt=m(`<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>`),Zt=m(`<li>custom "some custom entry" entry</li>`),Qt=m(`<li>"copy text" entry when text is selected</li>`),$t=m(`<li>link entry when clicking on a link</li>`),en=m(`<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>`,1),tn=m(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing
			the Fuz contextmenu.</p>`),nn=m(`<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which
			ensures the Fuz contextmenu is used</label></div> <!>`,1);function rn(e,i){U(i,!0);let o=e=>{var n=Xt(),r=H(n),i=R(H(r));let o;l(),A(r),F(r,e=>E(w,e),()=>t(w));var s=R(r,2),c=R(H(s));l(),A(s),A(n),y(e=>{o=b(i,1,``,null,o,{palette_h:t(C)}),T(c,`href`,e)},[()=>de(`/`)]),g(`click`,i,D),a(e,n)},s=$.get(),u=W(()=>s.component),d=W(()=>s.name),f=new ue,m=v(!1),h=v(!1),_=v(!0),C=v(!1),w=v(void 0),D=()=>{let e=window.getSelection();if(!e||!t(w))return;let n=document.createRange();n.selectNodeContents(t(w)),e.removeAllRanges(),e.addRange(n)};X(e,{children:(e,n)=>{var i=nn(),s=S(i);Z(s,{text:`Disable default behaviors`});var g=R(s,4);{let e=W(()=>`<${t(d)}${t(m)?` link_entry={null}`:``}${t(h)?` text_entry={null}`:``}>`);Y(g,{get content(){return t(e)}})}var v=R(g,2),y=H(v),b=H(y);N(b);var w=R(b,2),T=R(H(w));T.textContent=`link_entry={null}`,A(w),A(y);var D=R(y,2),O=H(D);N(O);var k=R(O,2),j=R(H(k));j.textContent=`text_entry={null}`,A(k),A(D),A(v);var M=R(v,2);{let e=W(()=>t(m)?null:void 0),n=W(()=>t(h)?null:void 0);r(M,()=>t(u),(r,i)=>{i(r,{get contextmenu(){return f},scoped:!0,get link_entry(){return t(e)},get text_entry(){return t(n)},children:(e,n)=>{var r=p(),i=S(r),s=e=>{Q(e,{entries:e=>{q(e,{icon:`>`,run:()=>void E(C,!t(C)),children:(e,t)=>{l();var n=z(`some custom entry`);a(e,n)},$$slots:{default:!0}})},children:(e,t)=>{o(e)},$$slots:{entries:!0,default:!0}})},u=e=>{o(e)};c(i,e=>{t(_)?e(s):e(u,-1)}),a(e,r)},$$slots:{default:!0}})})}var P=R(M,4),F=H(P),I=H(F);N(I),l(),A(F),A(P);var L=R(P,2),B=e=>{var n=en(),r=R(S(n),2),i=H(r),o=e=>{var t=Zt();a(e,t)};c(i,e=>{t(_)&&e(o)});var s=R(i,2),l=e=>{var t=Qt();a(e,t)};c(s,e=>{t(h)||e(l)});var u=R(s,2),d=e=>{var t=$t();a(e,t)};c(u,e=>{t(m)||e(d)}),A(r),a(e,n)},V=e=>{var t=tn();a(e,t)};c(L,e=>{t(_)||!t(m)||!t(h)?e(B):e(V,-1)}),x(b,()=>t(m),e=>E(m,e)),x(O,()=>t(h),e=>E(h,e)),x(I,()=>t(_),e=>E(_,e)),a(e,i)},$$slots:{default:!0}}),n()}s([`click`]);var an=m(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function on(e,i){U(i,!0);let o=$.get(),s=W(()=>o.component),c=W(()=>o.name);var u=p(),d=S(u);r(d,()=>t(s),(e,n)=>{n(e,{scoped:!0,children:(e,n)=>{X(e,{children:(e,n)=>{var r=an(),i=S(r);Z(i,{text:`Default behaviors`});var o=R(i,2),s=H(o);{let e=W(()=>`<${t(c)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${t(c)}>`);Y(s,{get content(){return t(e)}})}l(6),A(o),a(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}})}),a(e,u),n()}var sn=m(`<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>`,1);function cn(e,t){U(t,!0);let r=ke(`Contextmenu`);$.set(),Me(e,{get tome(){return r},children:(e,t)=>{var n=sn(),r=S(n);Ze(r,{});var i=R(r,2);Pt(i,{});var o=R(i,2);on(o,{});var s=R(o,2);Yt(s,{});var c=R(s,2);rn(c,{});var u=R(c,2);Kt(u,{});var d=R(u,2);At(d,{}),nt(R(d,2),{}),l(2),a(e,n)},$$slots:{default:!0}}),n()}export{cn as t};