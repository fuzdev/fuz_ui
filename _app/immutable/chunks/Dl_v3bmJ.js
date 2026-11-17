import{a as e}from"./Dup6ps5H.js";import{$ as t,At as n,Ct as r,D as i,E as a,Et as o,H as s,I as c,J as l,N as u,Nt as d,P as f,S as p,T as m,Tt as h,U as g,W as _,X as v,Y as y,Z as b,b as x,c as S,dt as C,f as w,ft as T,gt as E,h as D,i as O,jt as k,k as A,l as j,m as M,mt as N,n as P,o as F,ot as I,p as L,pt as R,q as z,st as B,t as V,u as H,ut as ee,vt as U,w as te,x as ne,xt as W,y as re,z as G}from"./DsGYhQl8.js";import{t as ie}from"./CQSYb-FL.js";import{a as ae,i as oe,n as se,o as ce,r as le,t as ue}from"./C-6Ar-M8.js";import{a as de}from"./C37wyYAN.js";import{r as K}from"./BNhgY4kg.js";import{t as fe}from"./0niUPEvH.js";import{a as pe,c as me,d as he,f as ge,h as _e,i as ve,l as ye,m as be,n as xe,o as Se,p as q,r as Ce,s as we,t as Te,u as Ee}from"./CPEbwAu8.js";import{f as De}from"./DvpQ0q8G.js";import{l as Oe}from"./CBJjMNNl.js";import"./DnxtbSHO.js";import{n as ke}from"./ae6BBA9t.js";import{t as J}from"./Bubb6Arq.js";import{t as Y}from"./Cfol1miK.js";import{t as Ae}from"./DEIUt7Wu.js";import{n as X,t as Z}from"./DRMqvraY.js";import{r as je,t as Me}from"./Cy7GxLtR.js";import{t as Ne}from"./BYb1iYvQ.js";import{n as Pe,t as Fe}from"./DvbHPRIo.js";import{n as Ie,t as Le}from"./DkqHb1NF.js";import{t as Re}from"./CFRggMvy.js";import{t as ze}from"./OPwA1gfD.js";var Be=new Set([`$$slots`,`$$events`,`$$legacy`,`tag`,`entries`,`children`]);function Q(e,t){o(t,!0);let n=V(t,`tag`,3,`span`),r=P(t,Be);var i=g(),a=T(i);te(a,n,!1,(e,n)=>{p(e,()=>se(t.entries)),L(e,()=>({...r,[w]:{display:`contents`}}));var i=g(),a=T(i);c(a,()=>t.children),s(n,i)}),s(e,i),h()}var Ve=_(`<div class="contextmenu-root svelte-1472w04" role="group"><!></div>`),He=_(`<!> <!>`,1);function Ue(e,n){o(n,!0);let r=V(n,`contextmenu`,19,()=>new ue),i=V(n,`longpress_move_tolerance`,3,21),a=V(n,`longpress_duration`,3,633),l=V(n,`bypass_with_tap_then_longpress`,3,!0),d=V(n,`bypass_window`,3,750),f=V(n,`bypass_move_tolerance`,3,11),m=V(n,`open_offset_x`,3,-2),_=V(n,`open_offset_y`,3,-2),x=V(n,`scoped`,3,!1),S=V(n,`link_entry`,3,Ce),w=V(n,`text_entry`,3,pe),D=V(n,`separator_entry`,3,ve);oe.set(()=>r()),le(()=>x());let O=U(void 0),A=0,j=0,M=null,P=!1,F=new Se,I=new we,L=()=>{document.body.classList.add(`contextmenu-pending`)},R=()=>{document.body.classList.remove(`contextmenu-pending`)},z=()=>{P=!1,M!==null&&(clearTimeout(M),M=null),R()},B=()=>{z(),F.reset()},H=W(()=>({open_offset_x:m(),open_offset_y:_(),link_enabled:S()!==null,text_enabled:w()!==null,separator_enabled:D()!==null})),te=e=>{if(!F.consume()){if(P){if(t(O)?.contains(e.target))return;B(),K(e)}else Ee(e,r(),t(O),I,t(H))&&B()}},ne=e=>{P=!1,I.touchstart();let{touches:n,target:i}=e;if(r().opened||n.length!==1||!ye(i,e.shiftKey)){B();return}let{clientX:o,clientY:s}=n[0];l()&&F.track(o,s,d(),f())||(A=o,j=s,L(),M!==null&&z(),M=setTimeout(()=>{P=!0,R(),ce(i,A+m(),j+_(),r(),t(H))&&I.opened()},a()))},re=e=>{if(M===null||r().opened)return;let{touches:t}=e;if(t.length!==1)return;let{clientX:n,clientY:a}=t[0];Math.hypot(n-A,a-j)>i()?z():e.preventDefault()},G=e=>{I.touchend(e),M!==null&&z(),F.consume()},ie=()=>{I.reset(),B()},ae=e=>{let t={passive:!0,capture:!0},n={passive:!1,capture:!0},r=b(e,`touchstart`,ne,t),i=b(e,`touchmove`,re,n),a=b(e,`touchend`,G,n),o=b(e,`touchcancel`,ie,t);return()=>{r(),i(),a(),o()}};var se=He();v(`contextmenu`,ee,function(...e){(x()?void 0:te)?.apply(this,e)}),p(ee,()=>x()?void 0:ae);var de=T(se),fe=e=>{var t=Ve(),r=C(t);c(r,()=>n.children),k(t),p(t,()=>ae),y(`contextmenu`,t,te),s(e,t)},me=e=>{var t=g(),r=T(t);c(r,()=>n.children),s(e,t)};u(de,e=>{x()?e(fe):e(me,-1)});var he=N(de,2);xe(he,{get contextmenu(){return r()},get open_guard(){return I},get link_entry(){return S()},get text_entry(){return w()},get separator_entry(){return D()},get el(){return t(O)},set el(e){E(O,e)}}),s(e,se),h()}l([`contextmenu`]);var $=ie(()=>new We(`standard`)),We=class{#e=U();get variant(){return t(this.#e)}set variant(e){E(this.#e,e)}#t=W(()=>this.variant===`standard`?Te:Ue);get component(){return t(this.#t)}set component(e){E(this.#t,e)}#n=W(()=>this.component===Te?`ContextmenuRoot`:`ContextmenuRootForSafariCompatibility`);get name(){return t(this.#n)}set name(e){E(this.#n,e)}constructor(e=`standard`){this.variant=e}},Ge=_(`<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <!></div></label> <label class="row"><input type="radio"/> <div>iOS compat <!></div></label></fieldset>`);function Ke(e,t){o(t,!0);let n=[],r=$.get();var i=Ge(),a=N(C(i),2),c=C(a);M(c),c.value=c.__value=`standard`;var l=N(c,2),u=N(C(l));J(u,{name:`ContextmenuRoot`}),k(l),k(a);var d=N(a,2),f=C(d);M(f),f.value=f.__value=`compat`;var p=N(f,2),m=N(C(p));J(m,{name:`ContextmenuRootForSafariCompatibility`}),k(p),k(d),k(i),j(n,[],c,()=>r.variant,e=>r.variant=e),j(n,[],f,()=>r.variant,e=>r.variant=e),s(e,i),h()}var qe=_(`<p class="panel p_md">alert B -- also inherits A</p>`),Je=_(`<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>`),Ye=_(`<code>navigator.vibrate</code>`),Xe=_(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
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
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function Ze(e,r){o(r,!0);let a=$.get(),c=W(()=>a.component),l=W(()=>a.name);X(e,{children:(e,r)=>{var a=Xe(),o=T(a);Z(o,{text:`Introduction`});var u=N(o,2),d=N(C(u));Re(d,{path:`Web/API/Element/contextmenu_event`}),n(3),k(u);var f=N(u,2),p=N(C(f));J(p,{name:`ContextmenuRoot`});var m=N(p,2);J(m,{name:`Contextmenu`}),n(),k(f);var h=N(f,2),g=N(C(h)),_=R(g,!0),v=N(g,2);J(v,{name:`Contextmenu`});var y=N(v,2);J(y,{name:`Contextmenu`}),n(),k(h);var b=N(h,2);i(b,()=>t(c),(e,t)=>{t(e,{scoped:!0,children:(e,t)=>{Q(e,{entries:e=>{q(e,{run:()=>alert(`alert A`),children:(e,t)=>{n();var r=z(`alert A`);s(e,r)},$$slots:{default:!0}})},children:(e,t)=>{var r=Je();Q(N(C(r),2),{entries:e=>{q(e,{run:()=>alert(`alert B`),children:(e,t)=>{n();var r=z(`alert B`);s(e,r)},$$slots:{default:!0}})},children:(e,t)=>{var n=qe();s(e,n)},$$slots:{entries:!0,default:!0}}),k(r),s(e,r)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var x=N(b,2);Ne(x,{summary:e=>{n();var t=z(`view code`);s(e,t)},children:(e,n)=>{{let n=W(()=>`<${t(l)}>
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
</${t(l)}>`);Y(e,{get content(){return t(n)}})}},$$slots:{summary:!0,default:!0}});var S=N(x,2),w=N(C(S));J(w,{name:`Contextmenu`}),n(),k(S);var E=N(S,12),D=N(C(E),2),O=N(C(D));Re(O,{path:`Web/API/Navigator/vibrate`,children:(e,t)=>{var n=Ye();s(e,n)},$$slots:{default:!0}}),k(D),k(E),Ke(N(E,2),{}),I(()=>G(_,t(l))),s(e,a)},$$slots:{default:!0}}),h()}var Qe=_(`<span class="font_family_mono">contextmenu</span> event`,1),$e=_(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
		Safari not supporting the <code>contextmenu</code> event as of October 2025, see <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a>.</p> <p>Use <!> by default for better performance and haptic
		feedback. Use <!> only if you need
		iOS Safari support.</p> <h4>ContextmenuRoot</h4> <ul><li>standard, default implementation</li> <li>relies on the browser's <!></li> <li>much simpler, better performance with fewer and less intrusive event handlers, fewer edge
			cases that can go wrong</li> <li>does not work on iOS Safari until <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a> is fixed</li></ul> <h4>ContextmenuRootForSafariCompatibility</h4> <ul><li>opt-in hacky alternative when iOS support is needed</li> <li>implements custom longpress detection to work around iOS Safari's lacking <a href="https://bugs.webkit.org/show_bug.cgi?id=213953"><code>contextmenu</code> event support</a></li> <li>degraded experience because some browsers (including mobile Chrome) block <code>navigator.vibrate</code> haptic feedback due to the timeout-based gesture detection
			(because it's not a direct user action)</li> <li>works on all devices including iOS Safari</li> <li>more complex implementation with custom touch event handling and gesture detection, may cause
			edge case UX problems on some devices</li> <li>a longpress is cancelled if you move the touch past a threshold before it triggers</li> <li>opt into this version only if you need iOS Safari support</li></ul> <!>`,1),et=_(`<!> <p>The Fuz contextmenu provides powerful app-specific UX, but it breaks from normal browser
		behavior by replacing the system contextmenu.</p> <p>To mitigate the downsides:</p> <ul><li>The Fuz contextmenu only replaces the system contextmenu when the DOM tree has defined
			behaviors. Note that <code>a</code> links have default contextmenu behaviors unless disabled.
			Other interactive elements may have default behaviors added in the future.</li> <li>The Fuz contextmenu does not open on elements that allow clipboard pasting like inputs,
			textareas, and contenteditables -- however this may change for better app integration, or be
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),tt=_(`<!> <!>`,1);function nt(e){var t=tt(),r=T(t);X(r,{children:(e,t)=>{var r=$e(),i=T(r);Z(i,{text:`iOS compatibility`});var a=N(i,4),o=N(C(a));J(o,{name:`ContextmenuRoot`});var c=N(o,2);J(c,{name:`ContextmenuRootForSafariCompatibility`}),n(),k(a);var l=N(a,4),u=N(C(l),2),d=N(C(u));Re(d,{path:`Web/API/Element/contextmenu_event`,children:(e,t)=>{var r=Qe();n(),s(e,r)},$$slots:{default:!0}}),k(u),n(4),k(l),Ke(N(l,6),{}),s(e,r)},$$slots:{default:!0}});var i=N(r,2);X(i,{children:(e,t)=>{var r=et(),i=T(r);Z(i,{text:`Caveats`});var a=N(i,8),o=N(C(a));Re(o,{path:`Web/API/Element/contextmenu_event`}),n(3),k(a),s(e,r)},$$slots:{default:!0}}),s(e,t)}function rt(e){let t=e-1;return t*t*t+1}function it(e){return--e*e*e*e*e+1}function at(e,{from:t,to:n},r={}){var{delay:i=0,duration:a=e=>Math.sqrt(e)*120,easing:o=rt}=r,s=getComputedStyle(e),c=s.transform===`none`?``:s.transform,[l,u]=s.transformOrigin.split(` `).map(parseFloat);l/=e.clientWidth,u/=e.clientHeight;var d=ot(e),f=e.clientWidth/n.width/d,p=e.clientHeight/n.height/d,m=t.left+t.width*l,h=t.top+t.height*u,g=n.left+n.width*l,_=n.top+n.height*u,v=(m-g)*f,y=(h-_)*p,b=t.width/n.width,x=t.height/n.height;return{delay:i,duration:typeof a==`function`?a(Math.sqrt(v*v+y*y)):a,easing:o,css:(e,t)=>`transform: ${c} translate(${t*v}px, ${t*y}px) scale(${e+t*b}, ${e+t*x});`}}function ot(e){if(`currentCSSZoom`in e)return e.currentCSSZoom;for(var t=e,n=1;t!==null;)n*=+getComputedStyle(t).zoom,t=t.parentElement;return n}var st=_(`<menu class="pane unstyled svelte-6kuqba"><!></menu>`),ct=_(`<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-haspopup="menu" tabindex="-1"><div class="menuitem_content"><div class="menuitem_icon"><!></div> <div class="menuitem_title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>`);function lt(e,r){o(r,!0);let i=oe.get(),a=W(i),l=i().add_submenu(),d=W(()=>t(a).layout),p=W(()=>l.selected),m=U(void 0),g=ae.get(),_=ae.set(),y=U(0),b=U(0);B(()=>{t(m)&&S(t(m),t(d),g)});let S=(e,n,r)=>{let{x:i,y:a,width:o,height:s}=e.getBoundingClientRect();_.width=o,_.height=s;let c=me({base_x:i-t(y),base_y:a-t(b),width:o,height:s,parent_width:r.width,layout_width:n.width,layout_height:n.height});E(y,c.x),E(b,c.y)},w=null;f(()=>{w!==null&&clearTimeout(w)});var T=ct();let O;var A=C(T),j=C(A),M=C(j),P=C(M);_e(P,{get icon(){return r.icon}}),k(M);var L=N(M,2),R=C(L);c(R,()=>r.children),k(L),k(j),n(2),k(A);var z=N(A,2),V=e=>{var n=st();let i;var a=C(n);c(a,()=>r.menu),k(n),F(n,e=>E(m,e),()=>t(m)),I(()=>i=re(n,``,i,{transform:`translate3d(${t(y)??``}px, ${t(b)??``}px, 0)`,"max-height":`${t(d).height??``}px`})),s(e,n)};u(z,e=>{t(p)&&e(V)}),k(T),I(()=>{O=re(T,``,O,{"--contextmenu_depth":l.depth}),x(A,1,ne([`menuitem plain selectable`,{selected:t(p)}])),D(A,`aria-expanded`,t(p))}),v(`mouseenter`,A,e=>{K(e),w!==null&&clearTimeout(w),w=setTimeout(()=>{w=null,t(a).select(l)})}),s(e,T),h()}var ut=_(`<!> <!>`,1);function dt(e,r){o(r,!0);let i=V(r,`name`,3,`Cat`),a=V(r,`icon`,3,`😺`);lt(e,{get icon(){return a()},menu:e=>{var n=ut(),a=T(n);{let e=W(()=>r.position===`adventure`?`🏠`:`🌄`);q(a,{run:()=>r.act({type:r.position===`adventure`?`cat_go_home`:`cat_go_adventure`,name:i()}),get icon(){return t(e)},children:(e,t)=>{var n=g(),i=T(n),a=e=>{var t=z(`go home`);s(e,t)},o=e=>{var t=z(`go adventure`);s(e,t)};u(i,e=>{r.position===`adventure`?e(a):e(o,-1)}),s(e,n)},$$slots:{default:!0}})}var o=N(a,2);{let e=W(()=>r.position===`adventure`?`🌄`:`🏠`);q(o,{run:()=>r.act({type:`cat_be_or_do`,name:i(),position:r.position}),get icon(){return t(e)},children:(e,t)=>{var n=g(),i=T(n),a=e=>{var t=z(`do adventure`);s(e,t)},o=e=>{var t=z(`be home`);s(e,t)};u(i,e=>{r.position===`adventure`?e(a):e(o,-1)}),s(e,n)},$$slots:{default:!0}})}s(e,n)},children:(e,t)=>{n();var r=z();I(()=>G(r,i())),s(e,r)},$$slots:{menu:!0,default:!0}}),h()}var ft=_(`<!> <!> <!>`,1);function pt(t,r){var i=ft(),a=T(i);be(a,{href:`https://github.com/fuzdev/fuz_ui`,icon:e=>{fe(e,{get data(){return De},size:`var(--icon_size_xs)`})},children:(e,t)=>{n();var r=z(`Source code`);s(e,r)},$$slots:{icon:!0,default:!0}});var o=N(a,2);he(o,{});var c=N(o,2);q(c,{get run(){return r.toggle_about_dialog},icon:t=>{fe(t,{get data(){return e},size:`var(--icon_size_xs)`})},children:(e,t)=>{n();var r=z(`About`);s(e,r)},$$slots:{icon:!0,default:!0}}),s(t,i)}var mt=e=>{let t=e.length;if(t===2)return`cats`;if(t===0)return null;let n=e[0];return n.icon+n.name},ht=_(`<!> <!>`,1),gt=_(`<!> <!> <!>`,1);function _t(e,r){o(r,!0);let i=W(()=>mt(r.adventure_cats));lt(e,{icon:`🏠`,menu:e=>{var a=gt(),o=T(a),c=e=>{var t=ht(),i=T(t);q(i,{run:()=>r.act({type:`call_cats_home`}),icon:`🐈‍⬛`,children:(e,t)=>{n();var r=z(`call`);s(e,r)},$$slots:{default:!0}});var a=N(i,2),o=e=>{he(e,{})};u(a,e=>{r.home_cats.length>0&&e(o)}),s(e,t)};u(o,e=>{t(i)&&e(c)});var l=N(o,2);A(l,17,()=>r.home_cats,e=>e.name,(e,n)=>{dt(e,{get name(){return t(n).name},get icon(){return t(n).icon},get position(){return t(n).position},get act(){return r.act}})});var d=N(l,2),f=e=>{var t=ht(),i=T(t);q(i,{run:()=>r.act({type:`cat_be_or_do`,name:null,position:`home`}),icon:`🏠`,children:(e,t)=>{n();var r=z(`be`);s(e,r)},$$slots:{default:!0}});var a=N(i,2);q(a,{run:()=>r.act({type:`call_cats_adventure`}),icon:`🦋`,children:(e,t)=>{n();var r=z(`leave`);s(e,r)},$$slots:{default:!0}}),s(e,t)};u(d,e=>{t(i)||e(f)}),s(e,a)},children:(e,t)=>{n();var r=z(`home`);s(e,r)},$$slots:{menu:!0,default:!0}}),h()}var vt=_(`<!> <!>`,1),yt=_(`<!> <!> <!>`,1);function bt(e,r){o(r,!0);let i=W(()=>mt(r.home_cats));lt(e,{icon:`🌄`,menu:e=>{var a=yt(),o=T(a),c=e=>{var t=vt(),i=T(t);q(i,{run:()=>r.act({type:`call_cats_adventure`}),icon:`🦋`,children:(e,t)=>{n();var r=z(`call`);s(e,r)},$$slots:{default:!0}});var a=N(i,2),o=e=>{he(e,{})};u(a,e=>{r.adventure_cats.length>0&&e(o)}),s(e,t)};u(o,e=>{t(i)&&e(c)});var l=N(o,2);A(l,17,()=>r.adventure_cats,e=>e.name,(e,n)=>{dt(e,{get name(){return t(n).name},get icon(){return t(n).icon},get position(){return t(n).position},get act(){return r.act}})});var d=N(l,2),f=e=>{var t=vt(),i=T(t);q(i,{run:()=>r.act({type:`cat_be_or_do`,name:null,position:`adventure`}),icon:`🌄`,children:(e,t)=>{n();var r=z(`do`);s(e,r)},$$slots:{default:!0}});var a=N(i,2);q(a,{run:()=>r.act({type:`call_cats_home`}),icon:`🐈‍⬛`,children:(e,t)=>{n();var r=z(`leave`);s(e,r)},$$slots:{default:!0}}),s(e,t)};u(d,e=>{t(i)||e(f)}),s(e,a)},children:(e,t)=>{n();var r=z(`adventure`);s(e,r)},$$slots:{menu:!0,default:!0}}),h()}var xt=_(`<span class="cat svelte-1py4cgo"><span class="icon svelte-1py4cgo"> </span><span class="name svelte-1py4cgo"><!> </span></span>`);function St(e,t){let n=V(t,`name`,3,`Cat`),r=V(t,`icon`,3,`😺`);var i=xt(),a=C(i),o=R(a,!0),l=N(a),u=C(l);c(u,()=>t.children??d);var f=N(u,1,!0);k(l),k(i),I(()=>{G(o,r()),G(f,n())}),s(e,i)}var Ct=`<script lang="ts">
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
`,wt=_(`<!> <!>`,1),Tt=_(`<div class="cat-wrapper svelte-177dlvm"><div><!></div></div>`),Et=_(`<div class="position home svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>`),Dt=_(`<div class="position adventure svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>`),Ot=_(`<section class="flex svelte-177dlvm"><div class="svelte-177dlvm"><!> <!></div></section> <section class="svelte-177dlvm"><!></section>`,1),kt=_(`<h1 class="svelte-177dlvm">About Fuz</h1> <blockquote class="svelte-177dlvm">Svelte component library and frontend helpers</blockquote> <blockquote class="svelte-177dlvm">free and open source at<br class="svelte-177dlvm"/><!></blockquote> <code class="block p_md mb_lg svelte-177dlvm">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui" class="svelte-177dlvm">@fuzdev/fuz_ui</a></code> <div class="p_xl box svelte-177dlvm"><h2 class="svelte-177dlvm">Color scheme</h2> <!> <h2 class="svelte-177dlvm">Theme</h2> <!></div>`,1);function At(e,r){o(r,!0);let c=$.get(),l=W(()=>c.component),d=`Alyssa`,f=`home`,p=U(f),g=U(f),_=W(()=>t(p)===t(g)?`😺`:`😾`),y=W(()=>t(p)===t(g)?`😸`:`😿`),b=W(()=>({name:d,icon:t(_),position:t(p)})),S=W(()=>({name:`Ben`,icon:t(y),position:t(g)})),w=U(!1),D=new Oe,O=(e,t)=>{let n=[],r=[];for(let i of e){let e=i.position===`home`?n:r;t?e.unshift(i):e.push(i)}return{home_cats:n,adventure_cats:r}},j=W(()=>O([t(b),t(S)],t(w))),M=W(()=>t(j).home_cats),P=W(()=>t(j).adventure_cats),F=W(()=>t(p)!==f||t(g)!==f),L=()=>{E(p,f),E(g,f)},R=U(!1),B=()=>{E(R,!t(R))},V=e=>{switch(e.type){case`call_cats_adventure`:E(p,`adventure`),E(g,`adventure`);break;case`call_cats_home`:E(p,`home`),E(g,`home`);break;case`cat_go_adventure`:e.name===d?E(p,`adventure`):e.name===`Ben`&&E(g,`adventure`);break;case`cat_go_home`:e.name===d?E(p,`home`):e.name===`Ben`&&E(g,`home`);break;case`cat_be_or_do`:{let n=e.position===`home`?t(M):t(P);if(n.length>1)E(w,!t(w));else for(let e of n)D.add(e.name);break}}},[H,ee]=Me({fallback:(e,t)=>{let n=window.getComputedStyle(e),r=n.transform===`none`?``:n.transform;return{duration:1500,easing:it,css:e=>`
					transform: ${r} scale(${e});
					opacity: ${e}
				`}}});var te=wt(),ne=T(te);i(ne,()=>t(l),(e,r)=>{r(e,{scoped:!0,children:(e,r)=>{X(e,{children:(e,r)=>{var i=wt(),o=T(i);Z(o,{text:`Full example`}),Q(N(o,2),{entries:e=>{var n=wt(),r=T(n),i=e=>{ge(e,{run:L,content:`Reset`,icon:`↻`})};u(r,e=>{t(F)&&e(i)}),pt(N(r,2),{toggle_about_dialog:B}),s(e,n)},children:(e,r)=>{var i=Ot(),o=T(i),c=C(o),l=C(c);Q(l,{entries:e=>{_t(e,{act:V,get home_cats(){return t(M)},get adventure_cats(){return t(P)}})},children:(e,n)=>{var r=Et(),i=N(C(r),2);A(i,29,()=>t(M),({name:e,icon:t,position:n})=>e,(e,n)=>{let r=()=>t(n).name,i=()=>t(n).icon,o=()=>t(n).position;var c=Tt(),l=C(c);let u;Q(C(l),{entries:e=>{dt(e,{act:V,get name(){return r()},get icon(){return i()},get position(){return o()}})},children:(e,t)=>{St(e,{get name(){return r()},get icon(){return i()}})},$$slots:{entries:!0,default:!0}}),k(l),k(c),I(e=>u=x(l,1,`svelte-177dlvm`,null,u,{shaking:e}),[()=>D.has(r())]),v(`animationend`,l,()=>D.delete(r())),a(1,c,()=>ee,()=>({key:r()})),a(2,c,()=>H,()=>({key:r()})),m(c,()=>at,null),s(e,c)}),k(i),k(r),s(e,r)},$$slots:{entries:!0,default:!0}}),Q(N(l,2),{entries:e=>{bt(e,{act:V,get home_cats(){return t(M)},get adventure_cats(){return t(P)}})},children:(e,n)=>{var r=Dt(),i=N(C(r),2);A(i,29,()=>t(P),({name:e,icon:t,position:n})=>e,(e,n)=>{let r=()=>t(n).name,i=()=>t(n).icon,o=()=>t(n).position;var c=Tt(),l=C(c);let u;Q(C(l),{entries:e=>{dt(e,{act:V,get name(){return r()},get icon(){return i()},get position(){return o()}})},children:(e,t)=>{St(e,{get name(){return r()},get icon(){return i()}})},$$slots:{entries:!0,default:!0}}),k(l),k(c),I(e=>u=x(l,1,`svelte-177dlvm`,null,u,{shaking:e}),[()=>D.has(r())]),v(`animationend`,l,()=>D.delete(r())),a(1,c,()=>ee,()=>({key:r()})),a(2,c,()=>H,()=>({key:r()})),m(c,()=>at,null),s(e,c)}),k(i),k(r),s(e,r)},$$slots:{entries:!0,default:!0}}),k(c),k(o);var u=N(o,2),d=C(u);Ne(d,{summary:e=>{n();var t=z(`View example source`);s(e,t)},children:(e,t)=>{Y(e,{get content(){return Ct}})},$$slots:{summary:!0,default:!0}}),k(u),s(e,i)},$$slots:{entries:!0,default:!0}}),s(e,i)},$$slots:{default:!0}})},$$slots:{default:!0}})});var re=N(ne,2),G=e=>{Pe(e,{onclose:()=>E(R,!1),children:(e,t)=>{Fe(e,{children:(e,t)=>{var n=kt(),r=N(T(n),4),i=N(C(r),2);ze(i,{path:`fuzdev/fuz_ui`}),k(r);var a=N(r,4),o=N(C(a),2);Ie(o,{});var c=N(o,4);Le(c,{}),k(a),s(e,n)},$$slots:{default:!0}})},$$slots:{default:!0}})};u(re,e=>{t(R)&&e(G)}),s(e,te),h()}var jt=_(`<!> <!> <!>`,1),Mt=_(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific
					element instead of the entire page.</aside></div>`),Nt=_(`<!> <!>`,1);function Pt(e,r){o(r,!0);let a=$.get(),c=W(()=>a.component),l=W(()=>a.name),u=U(!1),d=U(!1),f=U(!1);var p=g(),m=T(p);i(m,()=>t(c),(e,r)=>{r(e,{scoped:!0,children:(e,r)=>{X(e,{children:(e,r)=>{var i=Nt(),a=T(i);Z(a,{text:`Basic usage`}),Q(N(a,2),{entries:e=>{var r=jt(),i=T(r);q(i,{run:()=>void E(u,!t(u)),children:(e,t)=>{n();var r=z(`Hello world`);s(e,r)},$$slots:{default:!0}});var a=N(i,2);q(a,{run:()=>void E(d,!t(d)),icon:e=>{n();var t=z(`🌞`);s(e,t)},children:(e,t)=>{n();var r=z(`Hello with an optional icon snippet`);s(e,r)},$$slots:{icon:!0,default:!0}});var o=N(a,2);q(o,{run:()=>void E(f,!t(f)),icon:`🌚`,children:(e,t)=>{n();var r=z(`Hello with an optional icon string`);s(e,r)},$$slots:{default:!0}}),s(e,r)},children:(e,r)=>{var i=Mt(),a=N(C(i),2);{let e=W(()=>`<${t(l)} scoped>
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
</${t(l)}>
...markup without contextmenu behavior...`);Y(a,{get content(){return t(e)}})}var o=N(a,2),c=C(o);let p;var m=R(c);k(o);var h=N(o,2),g=C(h);let _;var v=R(g);k(h);var y=N(h,2),b=C(y);let S;var w=R(b);k(y),n(2),k(i),I(()=>{p=x(c,1,``,null,p,{color_g_50:t(u)}),G(m,`greeted = ${t(u)??``}`),_=x(g,1,``,null,_,{color_e_50:t(d)}),G(v,`greeted_icon_snippet = ${t(d)??``}`),S=x(b,1,``,null,S,{color_d_50:t(f)}),G(w,`greeted_icon_string = ${t(f)??``}`)}),s(e,i)},$$slots:{entries:!0,default:!0}}),s(e,i)},$$slots:{default:!0}})},$$slots:{default:!0}})}),s(e,p),h()}var Ft=new Set([`$$slots`,`$$events`,`$$legacy`,`glyph`,`size`]),It=_(`<span> </span>`);function Lt(e,n){o(n,!0);let r=P(n,Ft),i=W(()=>n.size??`var(--font_size, 1em)`);var a=It();L(a,()=>({...r,class:`glyph inline-block text-align:center line-height:1 white-space:nowrap font-weight:400 ${n.class??``}`,[w]:{width:t(i),height:t(i),"min-width":t(i),"min-height":t(i),"font-size":n.size??`var(--font_size, inherit)`}}));var c=R(a,!0);I(()=>G(c,n.glyph)),s(e,a),h()}var Rt=_(`<span class="color_f_50">option f</span>`),zt=_(`<span class="color_g_50">option g</span>`),Bt=_(`<span class="color_j_50">option j</span>`),Vt=_(`<!> <!> <!> <!>`,1),Ht=_(`<li class="negative_60">Error: <code> </code></li>`),Ut=_(`<div class="flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>`),Wt=_(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and
					control it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing
					you to select multiple colors using the activate button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),Gt=_(`<!> <!>`,1);function Kt(e,r){o(r,!0);let c=$.get(),l=W(()=>c.component),d=W(()=>c.name),f=new ue,p=U(void 0),m=W(()=>t(p)?`color_${t(p)}_50`:void 0),_=W(()=>t(p)?`palette_${t(p)}`:void 0);var y=g(),b=T(y);i(b,()=>t(l),(e,r)=>{r(e,{get contextmenu(){return f},scoped:!0,children:(e,r)=>{X(e,{children:(e,r)=>{var i=Gt(),o=T(i);Z(o,{text:`Custom instance`}),Q(N(o,2),{entries:e=>{lt(e,{icon:`🎨`,menu:e=>{var t=Vt(),r=T(t);q(r,{run:()=>(E(p,`f`),{ok:!0,close:!1}),children:(e,t)=>{var n=Rt();s(e,n)},$$slots:{default:!0}});var i=N(r,2);q(i,{run:()=>(E(p,`g`),{ok:!0,close:!1}),children:(e,t)=>{var n=zt();s(e,n)},$$slots:{default:!0}});var a=N(i,2);q(a,{run:()=>(E(p,`j`),{ok:!0,close:!1}),children:(e,t)=>{var n=Bt();s(e,n)},$$slots:{default:!0}});var o=N(a,2);q(o,{run:()=>(f.close(),{ok:!0}),children:(e,t)=>{n();var r=z(`close contextmenu`);s(e,r)},$$slots:{default:!0}}),s(e,t)},children:(e,t)=>{n();var r=z(`select color`);s(e,r)},$$slots:{menu:!0,default:!0}})},children:(e,r)=>{var i=Wt(),o=C(i),c=N(C(o)),l=R(c,!0);n(5),k(o);var p=N(o,2);Y(p,{lang:`ts`,dangerous_raw_html:`<span class="token_keyword">const</span> contextmenu <span class="token_operator">=</span> <span class="token_keyword">new</span> <span class="token_class_name">ContextmenuState</span><span class="token_punctuation">();</span>`});var h=N(p,2);{let e=W(()=>`<${t(d)} {contextmenu} scoped>...</${t(d)}>`);Y(h,{get content(){return t(e)}})}var g=N(h,2),y=N(C(g));y.textContent=`{ok: true, close: false}`,n(),k(g);var b=N(g,2),S=N(C(b),2),w=C(S),T=N(C(w),2),E=R(T,!0);k(w);var D=N(w,2),O=N(C(D),2),A=R(O);k(D);var j=N(D,2),M=e=>{var t=Ht(),n=N(C(t)),r=R(n,!0);k(t),I(()=>G(r,f.error)),s(e,t)};u(j,e=>{f.error&&e(M)}),k(S),k(b);var P=N(b,2),F=e=>{var n=Ut(),r=C(n),i=C(r);Lt(C(i),{glyph:`↑`}),k(i);var o=N(i,2),c=C(o);Lt(C(c),{glyph:`←`}),k(c);var l=N(c,2);Lt(C(l),{glyph:`↵`}),k(l);var u=N(l,2);Lt(C(u),{glyph:`→`}),k(u),k(o);var d=N(o,2);Lt(C(d),{glyph:`↓`}),k(d),k(r),k(n),I(()=>{x(i,1,`border-bottom-left-radius:0 border-bottom-right-radius:0 ${t(_)??``}`),i.disabled=!f.can_select_sibling,x(c,1,`border-bottom-right-radius:0 border-top-right-radius:0 ${t(_)??``}`),c.disabled=!f.can_collapse,x(l,1,`border-radius:0 ${t(_)??``}`),l.disabled=!f.can_activate,x(u,1,`border-bottom-left-radius:0 border-top-left-radius:0 ${t(_)??``}`),u.disabled=!f.can_expand,x(d,1,`border-top-left-radius:0 border-top-right-radius:0 ${t(_)??``}`),d.disabled=!f.can_select_sibling}),v(`mousedown`,i,e=>{K(e),f.select_previous()},!0),v(`mousedown`,c,e=>{K(e),f.collapse_selected()},!0),v(`mousedown`,l,async e=>{K(e),await f.activate_selected()},!0),v(`mousedown`,u,e=>{K(e),f.expand_selected()},!0),v(`mousedown`,d,e=>{K(e),f.select_next()},!0),a(3,n,()=>je),s(e,n)};u(P,e=>{f.opened&&e(F)}),k(i),I(()=>{G(l,t(d)),x(b,1,`mb_md ${t(m)??``}`),G(E,f.opened),G(A,`${f.x??``} && contextmenu.y === ${f.y??``}`)}),s(e,i)},$$slots:{entries:!0,default:!0}}),s(e,i)},$$slots:{default:!0}})},$$slots:{default:!0}})}),s(e,y),h()}var qt=_(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the
					browser's default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's
					default contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),Jt=_(`<div><!></div> <!>`,1);function Yt(e,a){o(a,!0);let c=$.get(),l=W(()=>c.component),u=new ue,d=U(!1),f=U(void 0),p=()=>{let e=window.getSelection();if(!e||!t(f))return;let n=document.createRange();n.selectNodeContents(t(f)),e.removeAllRanges(),e.addRange(n)},m=U(``),_=W(()=>t(m)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.`||t(m)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`||t(m)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`);var v=g(),b=T(v);i(b,()=>t(l),(e,i)=>{i(e,{get contextmenu(){return u},scoped:!0,children:(e,i)=>{X(e,{children:(e,i)=>{var a=Jt(),o=T(a);let c;var l=C(o);Z(l,{text:`Select text`}),k(o),Q(N(o,2),{entries:e=>{q(e,{run:()=>void E(d,!t(d)),children:(e,t)=>{n();var r=z(`Toggle something`);s(e,r)},$$slots:{default:!0}})},children:(e,i)=>{var a=qt();let o;var c=C(a),l=N(C(c),2),u=N(C(l));let h;n(),k(l),k(c),F(c,e=>E(f,e),()=>t(f));var g=N(c,2),v=C(g);M(v),k(g);var b=N(g,2);let S;var w=N(b,2),T=C(w);r(T),k(w);var D=N(w,2),A=C(D);Re(A,{path:`Web/HTML/Global_attributes/contenteditable`}),n(),k(D);var j=N(D,4),P=N(j,4);n(2),k(a),I(()=>{o=x(a,1,`panel p_md`,null,o,{color_g_50:t(_)}),h=x(u,1,``,null,h,{palette_a:t(d)}),S=x(b,1,``,null,S,{color_g_50:t(_)})}),y(`click`,u,p),H(v,()=>t(m),e=>E(m,e)),H(T,()=>t(m),e=>E(m,e)),O(`innerText`,j,()=>t(m),e=>E(m,e)),O(`innerText`,P,()=>t(m),e=>E(m,e)),s(e,a)},$$slots:{entries:!0,default:!0}}),I(()=>c=x(o,1,``,null,c,{color_d_50:t(_)})),s(e,a)},$$slots:{default:!0}})},$$slots:{default:!0}})}),s(e,v),h()}l([`click`]);var Xt=_(`<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>`),Zt=_(`<li>custom "some custom entry" entry</li>`),Qt=_(`<li>"copy text" entry when text is selected</li>`),$t=_(`<li>link entry when clicking on a link</li>`),en=_(`<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>`,1),tn=_(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing
			the Fuz contextmenu.</p>`),nn=_(`<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which
			ensures the Fuz contextmenu is used</label></div> <!>`,1);function rn(e,r){o(r,!0);let a=e=>{var r=Xt(),i=C(r),a=N(C(i));let o;n(),k(i),F(i,e=>E(b,e),()=>t(b));var c=N(i,2),l=N(C(c));n(),k(c),k(r),I(e=>{o=x(a,1,``,null,o,{palette_h:t(v)}),D(l,`href`,e)},[()=>de(`/`)]),y(`click`,a,w),s(e,r)},c=$.get(),l=W(()=>c.component),d=W(()=>c.name),f=new ue,p=U(!1),m=U(!1),_=U(!0),v=U(!1),b=U(void 0),w=()=>{let e=window.getSelection();if(!e||!t(b))return;let n=document.createRange();n.selectNodeContents(t(b)),e.removeAllRanges(),e.addRange(n)};X(e,{children:(e,r)=>{var o=nn(),c=T(o);Z(c,{text:`Disable default behaviors`});var h=N(c,4);{let e=W(()=>`<${t(d)}${t(p)?` link_entry={null}`:``}${t(m)?` text_entry={null}`:``}>`);Y(h,{get content(){return t(e)}})}var y=N(h,2),b=C(y),x=C(b);M(x);var w=N(x,2),D=N(C(w));D.textContent=`link_entry={null}`,k(w),k(b);var O=N(b,2),A=C(O);M(A);var j=N(A,2),P=N(C(j));P.textContent=`text_entry={null}`,k(j),k(O),k(y);var F=N(y,2);{let e=W(()=>t(p)?null:void 0),r=W(()=>t(m)?null:void 0);i(F,()=>t(l),(i,o)=>{o(i,{get contextmenu(){return f},scoped:!0,get link_entry(){return t(e)},get text_entry(){return t(r)},children:(e,r)=>{var i=g(),o=T(i),c=e=>{Q(e,{entries:e=>{q(e,{icon:`>`,run:()=>void E(v,!t(v)),children:(e,t)=>{n();var r=z(`some custom entry`);s(e,r)},$$slots:{default:!0}})},children:(e,t)=>{a(e)},$$slots:{entries:!0,default:!0}})},l=e=>{a(e)};u(o,e=>{t(_)?e(c):e(l,-1)}),s(e,i)},$$slots:{default:!0}})})}var I=N(F,4),L=C(I),R=C(L);M(R),n(),k(L),k(I);var B=N(I,2),V=e=>{var n=en(),r=N(T(n),2),i=C(r),a=e=>{var t=Zt();s(e,t)};u(i,e=>{t(_)&&e(a)});var o=N(i,2),c=e=>{var t=Qt();s(e,t)};u(o,e=>{t(m)||e(c)});var l=N(o,2),d=e=>{var t=$t();s(e,t)};u(l,e=>{t(p)||e(d)}),k(r),s(e,n)},H=e=>{var t=tn();s(e,t)};u(B,e=>{t(_)||!t(p)||!t(m)?e(V):e(H,-1)}),S(x,()=>t(p),e=>E(p,e)),S(A,()=>t(m),e=>E(m,e)),S(R,()=>t(_),e=>E(_,e)),s(e,o)},$$slots:{default:!0}}),h()}l([`click`]);var an=_(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function on(e,r){o(r,!0);let a=$.get(),c=W(()=>a.component),l=W(()=>a.name);var u=g(),d=T(u);i(d,()=>t(c),(e,r)=>{r(e,{scoped:!0,children:(e,r)=>{X(e,{children:(e,r)=>{var i=an(),a=T(i);Z(a,{text:`Default behaviors`});var o=N(a,2),c=C(o);{let e=W(()=>`<${t(l)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${t(l)}>`);Y(c,{get content(){return t(e)}})}n(6),k(o),s(e,i)},$$slots:{default:!0}})},$$slots:{default:!0}})}),s(e,u),h()}var sn=_(`<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>`,1);function cn(e,t){o(t,!0);let r=ke(`Contextmenu`);$.set(),Ae(e,{get tome(){return r},children:(e,t)=>{var r=sn(),i=T(r);Ze(i,{});var a=N(i,2);Pt(a,{});var o=N(a,2);on(o,{});var c=N(o,2);Yt(c,{});var l=N(c,2);rn(l,{});var u=N(l,2);Kt(u,{});var d=N(u,2);At(d,{}),nt(N(d,2),{}),n(2),s(e,r)},$$slots:{default:!0}}),h()}export{cn as t};