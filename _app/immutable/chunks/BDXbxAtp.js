import{a as e}from"./Dup6ps5H.js";import{$ as t,At as n,D as r,E as i,H as a,I as o,J as s,Mt as c,N as l,P as u,S as d,St as f,T as p,Tt as m,U as h,W as g,X as _,Y as v,Z as y,b,bt as x,c as S,dt as C,f as w,ft as T,gt as E,h as D,i as O,k,kt as A,l as j,m as M,mt as N,n as P,o as F,ot as I,p as L,pt as R,q as z,st as B,t as V,u as H,ut as ee,vt as U,w as te,wt as W,x as ne,y as re,z as G}from"./C_nzkTy7.js";import{t as ie}from"./Cr7qWxGT.js";import{a as ae,i as oe,n as se,o as ce,r as le,t as ue}from"./kwusO2Ht.js";import{a as de}from"./CwSGVNos.js";import{i as K}from"./07-Goqe_.js";import{t as fe}from"./D20EL2i0.js";import{a as pe,c as me,d as he,f as ge,h as _e,i as ve,l as ye,m as be,n as xe,o as Se,p as q,r as Ce,s as we,t as Te,u as Ee}from"./Df_Ii7Nk.js";import{d as De}from"./DOo1fJlH.js";import{s as Oe}from"./DunzmPQl.js";import"./Vi_uO9ee.js";import{n as ke}from"./Baly6eRw.js";import{t as J}from"./CBGvIykk.js";import{n as Ae,t as je}from"./DZVOQa9V.js";import{t as Y}from"./CfV4cyHc.js";import{t as Me}from"./DGpKSiKa.js";import{n as X,t as Z}from"./Cq6Qapn3.js";import{r as Ne,t as Pe}from"./BhLy9VTx.js";import{t as Fe}from"./oI3rX4Ho.js";import{n as Ie,t as Le}from"./Bn7jVYZU.js";import{t as Re}from"./D-TU2hIY.js";import{t as ze}from"./DXPBn3JQ.js";var Be=new Set([`$$slots`,`$$events`,`$$legacy`,`tag`,`entries`,`children`]);function Q(e,t){m(t,!0);let n=V(t,`tag`,3,`span`),r=P(t,Be);var i=h(),s=T(i);te(s,n,!1,(e,n)=>{d(e,()=>se(t.entries)),L(e,()=>({...r,[w]:{display:`contents`}}));var i=h(),s=T(i);o(s,()=>t.children),a(n,i)}),a(e,i),W()}var Ve=g(`<div class="contextmenu-root svelte-1472w04" role="group"><!></div>`),He=g(`<!> <!>`,1);function Ue(e,r){m(r,!0);let i=V(r,`contextmenu`,19,()=>new ue),s=V(r,`longpress_move_tolerance`,3,21),c=V(r,`longpress_duration`,3,633),u=V(r,`bypass_with_tap_then_longpress`,3,!0),f=V(r,`bypass_window`,3,750),p=V(r,`bypass_move_tolerance`,3,11),g=V(r,`open_offset_x`,3,-2),b=V(r,`open_offset_y`,3,-2),S=V(r,`scoped`,3,!1),w=V(r,`link_entry`,3,Ce),D=V(r,`text_entry`,3,pe),O=V(r,`separator_entry`,3,ve);oe.set(()=>i()),le(()=>S());let k=U(void 0),A=0,j=0,M=null,P=!1,F=new Se,I=new we,L=()=>{document.body.classList.add(`contextmenu-pending`)},R=()=>{document.body.classList.remove(`contextmenu-pending`)},z=()=>{P=!1,M!==null&&(clearTimeout(M),M=null),R()},B=()=>{z(),F.reset()},H=x(()=>({open_offset_x:g(),open_offset_y:b(),link_enabled:w()!==null,text_enabled:D()!==null,separator_enabled:O()!==null})),te=e=>{if(!F.consume()){if(P){if(t(k)?.contains(e.target))return;B(),K(e)}else Ee(e,i(),t(k),I,t(H))&&B()}},ne=e=>{P=!1,I.touchstart();let{touches:n,target:r}=e;if(i().opened||n.length!==1||!ye(r,e.shiftKey)){B();return}let{clientX:a,clientY:o}=n[0];u()&&F.track(a,o,f(),p())||(A=a,j=o,L(),M!==null&&z(),M=setTimeout(()=>{P=!0,R(),ce(r,A+g(),j+b(),i(),t(H))&&I.opened()},c()))},re=e=>{if(M===null||i().opened)return;let{touches:t}=e;if(t.length!==1)return;let{clientX:n,clientY:r}=t[0];Math.hypot(n-A,r-j)>s()?z():e.preventDefault()},G=e=>{I.touchend(e),M!==null&&z(),F.consume()},ie=()=>{I.reset(),B()},ae=e=>{let t={passive:!0,capture:!0},n={passive:!1,capture:!0},r=y(e,`touchstart`,ne,t),i=y(e,`touchmove`,re,n),a=y(e,`touchend`,G,n),o=y(e,`touchcancel`,ie,t);return()=>{r(),i(),a(),o()}};var se=He();_(`contextmenu`,ee,function(...e){(S()?void 0:te)?.apply(this,e)}),d(ee,()=>S()?void 0:ae);var de=T(se),fe=e=>{var t=Ve(),i=C(t);o(i,()=>r.children),n(t),d(t,()=>ae),v(`contextmenu`,t,te),a(e,t)},me=e=>{var t=h(),n=T(t);o(n,()=>r.children),a(e,t)};l(de,e=>{S()?e(fe):e(me,-1)});var he=N(de,2);xe(he,{get contextmenu(){return i()},get open_guard(){return I},get link_entry(){return w()},get text_entry(){return D()},get separator_entry(){return O()},get el(){return t(k)},set el(e){E(k,e)}}),a(e,se),W()}s([`contextmenu`]);var $=ie(()=>new We(`standard`)),We=class{#e=U();get variant(){return t(this.#e)}set variant(e){E(this.#e,e)}#t=x(()=>this.variant===`standard`?Te:Ue);get component(){return t(this.#t)}set component(e){E(this.#t,e)}#n=x(()=>this.component===Te?`ContextmenuRoot`:`ContextmenuRootForSafariCompatibility`);get name(){return t(this.#n)}set name(e){E(this.#n,e)}constructor(e=`standard`){this.variant=e}},Ge=g(`<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <!></div></label> <label class="row"><input type="radio"/> <div>iOS compat <!></div></label></fieldset>`);function Ke(e,t){m(t,!0);let r=[],i=$.get();var o=Ge(),s=N(C(o),2),c=C(s);M(c),c.value=c.__value=`standard`;var l=N(c,2),u=N(C(l));J(u,{name:`ContextmenuRoot`}),n(l),n(s);var d=N(s,2),f=C(d);M(f),f.value=f.__value=`compat`;var p=N(f,2),h=N(C(p));J(h,{name:`ContextmenuRootForSafariCompatibility`}),n(p),n(d),n(o),j(r,[],c,()=>i.variant,e=>i.variant=e),j(r,[],f,()=>i.variant,e=>i.variant=e),a(e,o),W()}var qe=g(`<p class="panel p_md">alert B -- also inherits A</p>`),Je=g(`<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>`),Ye=g(`<code>navigator.vibrate</code>`),Xe=g(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
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
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function Ze(e,i){m(i,!0);let o=$.get(),s=x(()=>o.component),c=x(()=>o.name);X(e,{children:(e,i)=>{var o=Xe(),l=T(o);Z(l,{text:`Introduction`});var u=N(l,2),d=N(C(u));Re(d,{path:`Web/API/Element/contextmenu_event`}),A(3),n(u);var f=N(u,2),p=N(C(f));J(p,{name:`ContextmenuRoot`});var m=N(p,2);J(m,{name:`Contextmenu`}),A(),n(f);var h=N(f,2),g=N(C(h)),_=R(g,!0),v=N(g,2);J(v,{name:`Contextmenu`});var y=N(v,2);J(y,{name:`Contextmenu`}),A(),n(h);var b=N(h,2);r(b,()=>t(s),(e,t)=>{t(e,{scoped:!0,children:(e,t)=>{Q(e,{entries:e=>{q(e,{run:()=>alert(`alert A`),children:(e,t)=>{A();var n=z(`alert A`);a(e,n)},$$slots:{default:!0}})},children:(e,t)=>{var r=Je();Q(N(C(r),2),{entries:e=>{q(e,{run:()=>alert(`alert B`),children:(e,t)=>{A();var n=z(`alert B`);a(e,n)},$$slots:{default:!0}})},children:(e,t)=>{var n=qe();a(e,n)},$$slots:{entries:!0,default:!0}}),n(r),a(e,r)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var S=N(b,2);Fe(S,{summary:e=>{A();var t=z(`view code`);a(e,t)},children:(e,n)=>{{let n=x(()=>`<${t(c)}>
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
</${t(c)}>`);Y(e,{get content(){return t(n)}})}},$$slots:{summary:!0,default:!0}});var w=N(S,2),E=N(C(w));J(E,{name:`Contextmenu`}),A(),n(w);var D=N(w,12),O=N(C(D),2),k=N(C(O));Re(k,{path:`Web/API/Navigator/vibrate`,children:(e,t)=>{var n=Ye();a(e,n)},$$slots:{default:!0}}),n(O),n(D),Ke(N(D,2),{}),I(()=>G(_,t(c))),a(e,o)},$$slots:{default:!0}}),W()}var Qe=g(`<span class="font_family_mono">contextmenu</span> event`,1),$e=g(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
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
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),tt=g(`<!> <!>`,1);function nt(e){var t=tt(),r=T(t);X(r,{children:(e,t)=>{var r=$e(),i=T(r);Z(i,{text:`iOS compatibility`});var o=N(i,4),s=N(C(o));J(s,{name:`ContextmenuRoot`});var c=N(s,2);J(c,{name:`ContextmenuRootForSafariCompatibility`}),A(),n(o);var l=N(o,4),u=N(C(l),2),d=N(C(u));Re(d,{path:`Web/API/Element/contextmenu_event`,children:(e,t)=>{var n=Qe();A(),a(e,n)},$$slots:{default:!0}}),n(u),A(4),n(l),Ke(N(l,6),{}),a(e,r)},$$slots:{default:!0}});var i=N(r,2);X(i,{children:(e,t)=>{var r=et(),i=T(r);Z(i,{text:`Caveats`});var o=N(i,8),s=N(C(o));Re(s,{path:`Web/API/Element/contextmenu_event`}),A(3),n(o),a(e,r)},$$slots:{default:!0}}),a(e,t)}function rt(e){let t=e-1;return t*t*t+1}function it(e){return--e*e*e*e*e+1}function at(e,{from:t,to:n},r={}){var{delay:i=0,duration:a=e=>Math.sqrt(e)*120,easing:o=rt}=r,s=getComputedStyle(e),c=s.transform===`none`?``:s.transform,[l,u]=s.transformOrigin.split(` `).map(parseFloat);l/=e.clientWidth,u/=e.clientHeight;var d=ot(e),f=e.clientWidth/n.width/d,p=e.clientHeight/n.height/d,m=t.left+t.width*l,h=t.top+t.height*u,g=n.left+n.width*l,_=n.top+n.height*u,v=(m-g)*f,y=(h-_)*p,b=t.width/n.width,x=t.height/n.height;return{delay:i,duration:typeof a==`function`?a(Math.sqrt(v*v+y*y)):a,easing:o,css:(e,t)=>`transform: ${c} translate(${t*v}px, ${t*y}px) scale(${e+t*b}, ${e+t*x});`}}function ot(e){if(`currentCSSZoom`in e)return e.currentCSSZoom;for(var t=e,n=1;t!==null;)n*=+getComputedStyle(t).zoom,t=t.parentElement;return n}var st=g(`<menu class="pane unstyled svelte-6kuqba"><!></menu>`),ct=g(`<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-haspopup="menu" tabindex="-1"><div class="menuitem_content"><div class="menuitem_icon"><!></div> <div class="menuitem_title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>`);function lt(e,r){m(r,!0);let i=oe.get(),s=x(i),c=i().add_submenu(),d=x(()=>t(s).layout),f=x(()=>c.selected),p=U(void 0),h=ae.get(),g=ae.set(),v=U(0),y=U(0);B(()=>{t(p)&&S(t(p),t(d),h)});let S=(e,n,r)=>{let{x:i,y:a,width:o,height:s}=e.getBoundingClientRect();g.width=o,g.height=s;let c=me({base_x:i-t(v),base_y:a-t(y),width:o,height:s,parent_width:r.width,layout_width:n.width,layout_height:n.height});E(v,c.x),E(y,c.y)},w=null;u(()=>{w!==null&&clearTimeout(w)});var T=ct();let O;var k=C(T),j=C(k),M=C(j),P=C(M);_e(P,{get icon(){return r.icon}}),n(M);var L=N(M,2),R=C(L);o(R,()=>r.children),n(L),n(j),A(2),n(k);var z=N(k,2),V=e=>{var i=st();let s;var c=C(i);o(c,()=>r.menu),n(i),F(i,e=>E(p,e),()=>t(p)),I(()=>s=re(i,``,s,{transform:`translate3d(${t(v)??``}px, ${t(y)??``}px, 0)`,"max-height":`${t(d).height??``}px`})),a(e,i)};l(z,e=>{t(f)&&e(V)}),n(T),I(()=>{O=re(T,``,O,{"--contextmenu_depth":c.depth}),b(k,1,ne([`menuitem plain selectable`,{selected:t(f)}])),D(k,`aria-expanded`,t(f))}),_(`mouseenter`,k,e=>{K(e),w!==null&&clearTimeout(w),w=setTimeout(()=>{w=null,t(s).select(c)})}),a(e,T),W()}var ut=g(`<!> <!>`,1);function dt(e,n){m(n,!0);let r=V(n,`name`,3,`Cat`),i=V(n,`icon`,3,`😺`);lt(e,{get icon(){return i()},menu:e=>{var i=ut(),o=T(i);{let e=x(()=>n.position===`adventure`?`🏠`:`🌄`);q(o,{run:()=>n.act({type:n.position===`adventure`?`cat_go_home`:`cat_go_adventure`,name:r()}),get icon(){return t(e)},children:(e,t)=>{var r=h(),i=T(r),o=e=>{var t=z(`go home`);a(e,t)},s=e=>{var t=z(`go adventure`);a(e,t)};l(i,e=>{n.position===`adventure`?e(o):e(s,-1)}),a(e,r)},$$slots:{default:!0}})}var s=N(o,2);{let e=x(()=>n.position===`adventure`?`🌄`:`🏠`);q(s,{run:()=>n.act({type:`cat_be_or_do`,name:r(),position:n.position}),get icon(){return t(e)},children:(e,t)=>{var r=h(),i=T(r),o=e=>{var t=z(`do adventure`);a(e,t)},s=e=>{var t=z(`be home`);a(e,t)};l(i,e=>{n.position===`adventure`?e(o):e(s,-1)}),a(e,r)},$$slots:{default:!0}})}a(e,i)},children:(e,t)=>{A();var n=z();I(()=>G(n,r())),a(e,n)},$$slots:{menu:!0,default:!0}}),W()}var ft=g(`<!> <!> <!>`,1);function pt(t,n){var r=ft(),i=T(r);be(i,{href:`https://github.com/fuzdev/fuz_ui`,icon:e=>{fe(e,{get data(){return De},size:`var(--icon_size_xs)`})},children:(e,t)=>{A();var n=z(`Source code`);a(e,n)},$$slots:{icon:!0,default:!0}});var o=N(i,2);he(o,{});var s=N(o,2);q(s,{get run(){return n.toggle_about_dialog},icon:t=>{fe(t,{get data(){return e},size:`var(--icon_size_xs)`})},children:(e,t)=>{A();var n=z(`About`);a(e,n)},$$slots:{icon:!0,default:!0}}),a(t,r)}var mt=e=>{let t=e.length;if(t===2)return`cats`;if(t===0)return null;let n=e[0];return n.icon+n.name},ht=g(`<!> <!>`,1),gt=g(`<!> <!> <!>`,1);function _t(e,n){m(n,!0);let r=x(()=>mt(n.adventure_cats));lt(e,{icon:`🏠`,menu:e=>{var i=gt(),o=T(i),s=e=>{var t=ht(),r=T(t);q(r,{run:()=>n.act({type:`call_cats_home`}),icon:`🐈‍⬛`,children:(e,t)=>{A();var n=z(`call`);a(e,n)},$$slots:{default:!0}});var i=N(r,2),o=e=>{he(e,{})};l(i,e=>{n.home_cats.length>0&&e(o)}),a(e,t)};l(o,e=>{t(r)&&e(s)});var c=N(o,2);k(c,17,()=>n.home_cats,e=>e.name,(e,r)=>{dt(e,{get name(){return t(r).name},get icon(){return t(r).icon},get position(){return t(r).position},get act(){return n.act}})});var u=N(c,2),d=e=>{var t=ht(),r=T(t);q(r,{run:()=>n.act({type:`cat_be_or_do`,name:null,position:`home`}),icon:`🏠`,children:(e,t)=>{A();var n=z(`be`);a(e,n)},$$slots:{default:!0}});var i=N(r,2);q(i,{run:()=>n.act({type:`call_cats_adventure`}),icon:`🦋`,children:(e,t)=>{A();var n=z(`leave`);a(e,n)},$$slots:{default:!0}}),a(e,t)};l(u,e=>{t(r)||e(d)}),a(e,i)},children:(e,t)=>{A();var n=z(`home`);a(e,n)},$$slots:{menu:!0,default:!0}}),W()}var vt=g(`<!> <!>`,1),yt=g(`<!> <!> <!>`,1);function bt(e,n){m(n,!0);let r=x(()=>mt(n.home_cats));lt(e,{icon:`🌄`,menu:e=>{var i=yt(),o=T(i),s=e=>{var t=vt(),r=T(t);q(r,{run:()=>n.act({type:`call_cats_adventure`}),icon:`🦋`,children:(e,t)=>{A();var n=z(`call`);a(e,n)},$$slots:{default:!0}});var i=N(r,2),o=e=>{he(e,{})};l(i,e=>{n.adventure_cats.length>0&&e(o)}),a(e,t)};l(o,e=>{t(r)&&e(s)});var c=N(o,2);k(c,17,()=>n.adventure_cats,e=>e.name,(e,r)=>{dt(e,{get name(){return t(r).name},get icon(){return t(r).icon},get position(){return t(r).position},get act(){return n.act}})});var u=N(c,2),d=e=>{var t=vt(),r=T(t);q(r,{run:()=>n.act({type:`cat_be_or_do`,name:null,position:`adventure`}),icon:`🌄`,children:(e,t)=>{A();var n=z(`do`);a(e,n)},$$slots:{default:!0}});var i=N(r,2);q(i,{run:()=>n.act({type:`call_cats_home`}),icon:`🐈‍⬛`,children:(e,t)=>{A();var n=z(`leave`);a(e,n)},$$slots:{default:!0}}),a(e,t)};l(u,e=>{t(r)||e(d)}),a(e,i)},children:(e,t)=>{A();var n=z(`adventure`);a(e,n)},$$slots:{menu:!0,default:!0}}),W()}var xt=g(`<span class="cat svelte-1py4cgo"><span class="icon svelte-1py4cgo"> </span><span class="name svelte-1py4cgo"><!> </span></span>`);function St(e,t){let r=V(t,`name`,3,`Cat`),i=V(t,`icon`,3,`😺`);var s=xt(),l=C(s),u=R(l,!0),d=N(l),f=C(d);o(f,()=>t.children??c);var p=N(f,1,!0);n(d),n(s),I(()=>{G(u,i()),G(p,r())}),a(e,s)}var Ct=`<script lang="ts">
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
			<blockquote>Svelte component library and frontend helpers</blockquote>
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
`,wt=g(`<!> <!>`,1),Tt=g(`<div class="cat-wrapper svelte-177dlvm"><div><!></div></div>`),Et=g(`<div class="position home svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>`),Dt=g(`<div class="position adventure svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>`),Ot=g(`<section class="display:flex svelte-177dlvm"><div class="svelte-177dlvm"><!> <!></div></section> <section class="svelte-177dlvm"><!></section>`,1),kt=g(`<h1 class="svelte-177dlvm">About Fuz</h1> <blockquote class="svelte-177dlvm">Svelte component library and frontend helpers</blockquote> <blockquote class="svelte-177dlvm">free and open source at<br class="svelte-177dlvm"/><!></blockquote> <code class="display:block p_md mb_lg svelte-177dlvm">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui" class="svelte-177dlvm">@fuzdev/fuz_ui</a></code> <div class="p_xl box svelte-177dlvm"><h2 class="svelte-177dlvm">Color scheme</h2> <!> <h2 class="svelte-177dlvm">Theme</h2> <!></div>`,1);function At(e,o){m(o,!0);let s=$.get(),c=x(()=>s.component),u=`Alyssa`,d=`home`,f=U(d),h=U(d),g=x(()=>t(f)===t(h)?`😺`:`😾`),v=x(()=>t(f)===t(h)?`😸`:`😿`),y=x(()=>({name:u,icon:t(g),position:t(f)})),S=x(()=>({name:`Ben`,icon:t(v),position:t(h)})),w=U(!1),D=new Oe,O=(e,t)=>{let n=[],r=[];for(let i of e){let e=i.position===`home`?n:r;t?e.unshift(i):e.push(i)}return{home_cats:n,adventure_cats:r}},j=x(()=>O([t(y),t(S)],t(w))),M=x(()=>t(j).home_cats),P=x(()=>t(j).adventure_cats),F=x(()=>t(f)!==d||t(h)!==d),L=()=>{E(f,d),E(h,d)},R=U(!1),B=()=>{E(R,!t(R))},V=e=>{switch(e.type){case`call_cats_adventure`:E(f,`adventure`),E(h,`adventure`);break;case`call_cats_home`:E(f,`home`),E(h,`home`);break;case`cat_go_adventure`:e.name===u?E(f,`adventure`):e.name===`Ben`&&E(h,`adventure`);break;case`cat_go_home`:e.name===u?E(f,`home`):e.name===`Ben`&&E(h,`home`);break;case`cat_be_or_do`:{let n=e.position===`home`?t(M):t(P);if(n.length>1)E(w,!t(w));else for(let e of n)D.add(e.name);break}}},[H,ee]=Pe({fallback:(e,t)=>{let n=window.getComputedStyle(e),r=n.transform===`none`?``:n.transform;return{duration:1500,easing:it,css:e=>`
					transform: ${r} scale(${e});
					opacity: ${e}
				`}}});var te=wt(),ne=T(te);r(ne,()=>t(c),(e,r)=>{r(e,{scoped:!0,children:(e,r)=>{X(e,{children:(e,r)=>{var o=wt(),s=T(o);Z(s,{text:`Full example`}),Q(N(s,2),{entries:e=>{var n=wt(),r=T(n),i=e=>{ge(e,{run:L,content:`Reset`,icon:`↻`})};l(r,e=>{t(F)&&e(i)}),pt(N(r,2),{toggle_about_dialog:B}),a(e,n)},children:(e,r)=>{var o=Ot(),s=T(o),c=C(s),l=C(c);Q(l,{entries:e=>{_t(e,{act:V,get home_cats(){return t(M)},get adventure_cats(){return t(P)}})},children:(e,r)=>{var o=Et(),s=N(C(o),2);k(s,29,()=>t(M),({name:e,icon:t,position:n})=>e,(e,r)=>{let o=()=>t(r).name,s=()=>t(r).icon,c=()=>t(r).position;var l=Tt(),u=C(l);let d;Q(C(u),{entries:e=>{dt(e,{act:V,get name(){return o()},get icon(){return s()},get position(){return c()}})},children:(e,t)=>{St(e,{get name(){return o()},get icon(){return s()}})},$$slots:{entries:!0,default:!0}}),n(u),n(l),I(e=>d=b(u,1,`svelte-177dlvm`,null,d,{shaking:e}),[()=>D.has(o())]),_(`animationend`,u,()=>D.delete(o())),i(1,l,()=>ee,()=>({key:o()})),i(2,l,()=>H,()=>({key:o()})),p(l,()=>at,null),a(e,l)}),n(s),n(o),a(e,o)},$$slots:{entries:!0,default:!0}}),Q(N(l,2),{entries:e=>{bt(e,{act:V,get home_cats(){return t(M)},get adventure_cats(){return t(P)}})},children:(e,r)=>{var o=Dt(),s=N(C(o),2);k(s,29,()=>t(P),({name:e,icon:t,position:n})=>e,(e,r)=>{let o=()=>t(r).name,s=()=>t(r).icon,c=()=>t(r).position;var l=Tt(),u=C(l);let d;Q(C(u),{entries:e=>{dt(e,{act:V,get name(){return o()},get icon(){return s()},get position(){return c()}})},children:(e,t)=>{St(e,{get name(){return o()},get icon(){return s()}})},$$slots:{entries:!0,default:!0}}),n(u),n(l),I(e=>d=b(u,1,`svelte-177dlvm`,null,d,{shaking:e}),[()=>D.has(o())]),_(`animationend`,u,()=>D.delete(o())),i(1,l,()=>ee,()=>({key:o()})),i(2,l,()=>H,()=>({key:o()})),p(l,()=>at,null),a(e,l)}),n(s),n(o),a(e,o)},$$slots:{entries:!0,default:!0}}),n(c),n(s);var u=N(s,2),d=C(u);Fe(d,{summary:e=>{A();var t=z(`View example source`);a(e,t)},children:(e,t)=>{Y(e,{get content(){return Ct}})},$$slots:{summary:!0,default:!0}}),n(u),a(e,o)},$$slots:{entries:!0,default:!0}}),a(e,o)},$$slots:{default:!0}})},$$slots:{default:!0}})});var re=N(ne,2),G=e=>{Ae(e,{onclose:()=>E(R,!1),children:(e,t)=>{je(e,{children:(e,t)=>{var r=kt(),i=N(T(r),4),o=N(C(i),2);ze(o,{path:`fuzdev/fuz_ui`}),n(i);var s=N(i,4),c=N(C(s),2);Ie(c,{});var l=N(c,4);Le(l,{}),n(s),a(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}})};l(re,e=>{t(R)&&e(G)}),a(e,te),W()}var jt=g(`<!> <!> <!>`,1),Mt=g(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific
					element instead of the entire page.</aside></div>`),Nt=g(`<!> <!>`,1);function Pt(e,i){m(i,!0);let o=$.get(),s=x(()=>o.component),c=x(()=>o.name),l=U(!1),u=U(!1),d=U(!1);var f=h(),p=T(f);r(p,()=>t(s),(e,r)=>{r(e,{scoped:!0,children:(e,r)=>{X(e,{children:(e,r)=>{var i=Nt(),o=T(i);Z(o,{text:`Basic usage`}),Q(N(o,2),{entries:e=>{var n=jt(),r=T(n);q(r,{run:()=>void E(l,!t(l)),children:(e,t)=>{A();var n=z(`Hello world`);a(e,n)},$$slots:{default:!0}});var i=N(r,2);q(i,{run:()=>void E(u,!t(u)),icon:e=>{A();var t=z(`🌞`);a(e,t)},children:(e,t)=>{A();var n=z(`Hello with an optional icon snippet`);a(e,n)},$$slots:{icon:!0,default:!0}});var o=N(i,2);q(o,{run:()=>void E(d,!t(d)),icon:`🌚`,children:(e,t)=>{A();var n=z(`Hello with an optional icon string`);a(e,n)},$$slots:{default:!0}}),a(e,n)},children:(e,r)=>{var i=Mt(),o=N(C(i),2);{let e=x(()=>`<${t(c)} scoped>
  <Contextmenu>
    {#snippet entries()}
      <ContextmenuEntry run={() => (greeted = !greeted)}>
        Hello world <!-- ${t(l)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_snippet = !greeted_icon_snippet)}>
        {#snippet icon()}🌞{/snippet}
        Hello with an optional icon snippet <!-- ${t(u)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_string = !greeted_icon_string)} icon="🌚">
        Hello with an optional icon string <!-- ${t(d)} -->
      </ContextmenuEntry>
    {/snippet}
    ...markup with the above contextmenu behavior...
  </Contextmenu>
  ...markup with only default contextmenu behavior...
</${t(c)}>
...markup without contextmenu behavior...`);Y(o,{get content(){return t(e)}})}var s=N(o,2),f=C(s);let p;var m=R(f);n(s);var h=N(s,2),g=C(h);let _;var v=R(g);n(h);var y=N(h,2),S=C(y);let w;var T=R(S);n(y),A(2),n(i),I(()=>{p=b(f,1,``,null,p,{color_g_50:t(l)}),G(m,`greeted = ${t(l)??``}`),_=b(g,1,``,null,_,{color_e_50:t(u)}),G(v,`greeted_icon_snippet = ${t(u)??``}`),w=b(S,1,``,null,w,{color_d_50:t(d)}),G(T,`greeted_icon_string = ${t(d)??``}`)}),a(e,i)},$$slots:{entries:!0,default:!0}}),a(e,i)},$$slots:{default:!0}})},$$slots:{default:!0}})}),a(e,f),W()}var Ft=new Set([`$$slots`,`$$events`,`$$legacy`,`glyph`,`size`]),It=g(`<span> </span>`);function Lt(e,n){m(n,!0);let r=P(n,Ft),i=x(()=>n.size??`var(--font_size, 1em)`);var o=It();L(o,()=>({...r,class:`glyph display:inline-block text-align:center line-height:1 white-space:nowrap font-weight:400 ${n.class??``}`,[w]:{width:t(i),height:t(i),"min-width":t(i),"min-height":t(i),"font-size":n.size??`var(--font_size, inherit)`}}));var s=R(o,!0);I(()=>G(s,n.glyph)),a(e,o),W()}var Rt=g(`<span class="color_f_50">option f</span>`),zt=g(`<span class="color_g_50">option g</span>`),Bt=g(`<span class="color_j_50">option j</span>`),Vt=g(`<!> <!> <!> <!>`,1),Ht=g(`<li class="negative_60">Error: <code> </code></li>`),Ut=g(`<div class="display:flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>`),Wt=g(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and
					control it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing
					you to select multiple colors using the activate button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),Gt=g(`<!> <!>`,1);function Kt(e,o){m(o,!0);let s=$.get(),c=x(()=>s.component),u=x(()=>s.name),d=new ue,f=U(void 0),p=x(()=>t(f)?`color_${t(f)}_50`:void 0),g=x(()=>t(f)?`palette_${t(f)}`:void 0);var v=h(),y=T(v);r(y,()=>t(c),(e,r)=>{r(e,{get contextmenu(){return d},scoped:!0,children:(e,r)=>{X(e,{children:(e,r)=>{var o=Gt(),s=T(o);Z(s,{text:`Custom instance`}),Q(N(s,2),{entries:e=>{lt(e,{icon:`🎨`,menu:e=>{var t=Vt(),n=T(t);q(n,{run:()=>(E(f,`f`),{ok:!0,close:!1}),children:(e,t)=>{var n=Rt();a(e,n)},$$slots:{default:!0}});var r=N(n,2);q(r,{run:()=>(E(f,`g`),{ok:!0,close:!1}),children:(e,t)=>{var n=zt();a(e,n)},$$slots:{default:!0}});var i=N(r,2);q(i,{run:()=>(E(f,`j`),{ok:!0,close:!1}),children:(e,t)=>{var n=Bt();a(e,n)},$$slots:{default:!0}});var o=N(i,2);q(o,{run:()=>(d.close(),{ok:!0}),children:(e,t)=>{A();var n=z(`close contextmenu`);a(e,n)},$$slots:{default:!0}}),a(e,t)},children:(e,t)=>{A();var n=z(`select color`);a(e,n)},$$slots:{menu:!0,default:!0}})},children:(e,r)=>{var o=Wt(),s=C(o),c=N(C(s)),f=R(c,!0);A(5),n(s);var m=N(s,2);Y(m,{lang:`ts`,dangerous_raw_html:`<span class="token_keyword">const</span> contextmenu <span class="token_operator">=</span> <span class="token_keyword">new</span> <span class="token_class_name">ContextmenuState</span><span class="token_punctuation">();</span>`});var h=N(m,2);{let e=x(()=>`<${t(u)} {contextmenu} scoped>...</${t(u)}>`);Y(h,{get content(){return t(e)}})}var v=N(h,2),y=N(C(v));y.textContent=`{ok: true, close: false}`,A(),n(v);var S=N(v,2),w=N(C(S),2),T=C(w),E=N(C(T),2),D=R(E,!0);n(T);var O=N(T,2),k=N(C(O),2),j=R(k);n(O);var M=N(O,2),P=e=>{var t=Ht(),r=N(C(t)),i=R(r,!0);n(t),I(()=>G(i,d.error)),a(e,t)};l(M,e=>{d.error&&e(P)}),n(w),n(S);var F=N(S,2),L=e=>{var r=Ut(),o=C(r),s=C(o);Lt(C(s),{glyph:`↑`}),n(s);var c=N(s,2),l=C(c);Lt(C(l),{glyph:`←`}),n(l);var u=N(l,2);Lt(C(u),{glyph:`↵`}),n(u);var f=N(u,2);Lt(C(f),{glyph:`→`}),n(f),n(c);var p=N(c,2);Lt(C(p),{glyph:`↓`}),n(p),n(o),n(r),I(()=>{b(s,1,`border-bottom-left-radius:0 border-bottom-right-radius:0 ${t(g)??``}`),s.disabled=!d.can_select_sibling,b(l,1,`border-bottom-right-radius:0 border-top-right-radius:0 ${t(g)??``}`),l.disabled=!d.can_collapse,b(u,1,`border-radius:0 ${t(g)??``}`),u.disabled=!d.can_activate,b(f,1,`border-bottom-left-radius:0 border-top-left-radius:0 ${t(g)??``}`),f.disabled=!d.can_expand,b(p,1,`border-top-left-radius:0 border-top-right-radius:0 ${t(g)??``}`),p.disabled=!d.can_select_sibling}),_(`mousedown`,s,e=>{K(e),d.select_previous()},!0),_(`mousedown`,l,e=>{K(e),d.collapse_selected()},!0),_(`mousedown`,u,async e=>{K(e),await d.activate_selected()},!0),_(`mousedown`,f,e=>{K(e),d.expand_selected()},!0),_(`mousedown`,p,e=>{K(e),d.select_next()},!0),i(3,r,()=>Ne),a(e,r)};l(F,e=>{d.opened&&e(L)}),n(o),I(()=>{G(f,t(u)),b(S,1,`mb_md ${t(p)??``}`),G(D,d.opened),G(j,`${d.x??``} && contextmenu.y === ${d.y??``}`)}),a(e,o)},$$slots:{entries:!0,default:!0}}),a(e,o)},$$slots:{default:!0}})},$$slots:{default:!0}})}),a(e,v),W()}var qt=g(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the
					browser's default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's
					default contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),Jt=g(`<div><!></div> <!>`,1);function Yt(e,i){m(i,!0);let o=$.get(),s=x(()=>o.component),c=new ue,l=U(!1),u=U(void 0),d=()=>{let e=window.getSelection();if(!e||!t(u))return;let n=document.createRange();n.selectNodeContents(t(u)),e.removeAllRanges(),e.addRange(n)},p=U(``),g=x(()=>t(p)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.`||t(p)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`||t(p)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`);var _=h(),y=T(_);r(y,()=>t(s),(e,r)=>{r(e,{get contextmenu(){return c},scoped:!0,children:(e,r)=>{X(e,{children:(e,r)=>{var i=Jt(),o=T(i);let s;var c=C(o);Z(c,{text:`Select text`}),n(o),Q(N(o,2),{entries:e=>{q(e,{run:()=>void E(l,!t(l)),children:(e,t)=>{A();var n=z(`Toggle something`);a(e,n)},$$slots:{default:!0}})},children:(e,r)=>{var i=qt();let o;var s=C(i),c=N(C(s),2),m=N(C(c));let h;A(),n(c),n(s),F(s,e=>E(u,e),()=>t(u));var _=N(s,2),y=C(_);M(y),n(_);var x=N(_,2);let S;var w=N(x,2),T=C(w);f(T),n(w);var D=N(w,2),k=C(D);Re(k,{path:`Web/HTML/Global_attributes/contenteditable`}),A(),n(D);var j=N(D,4),P=N(j,4);A(2),n(i),I(()=>{o=b(i,1,`panel p_md`,null,o,{color_g_50:t(g)}),h=b(m,1,``,null,h,{palette_a:t(l)}),S=b(x,1,``,null,S,{color_g_50:t(g)})}),v(`click`,m,d),H(y,()=>t(p),e=>E(p,e)),H(T,()=>t(p),e=>E(p,e)),O(`innerText`,j,()=>t(p),e=>E(p,e)),O(`innerText`,P,()=>t(p),e=>E(p,e)),a(e,i)},$$slots:{entries:!0,default:!0}}),I(()=>s=b(o,1,``,null,s,{color_d_50:t(g)})),a(e,i)},$$slots:{default:!0}})},$$slots:{default:!0}})}),a(e,_),W()}s([`click`]);var Xt=g(`<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>`),Zt=g(`<li>custom "some custom entry" entry</li>`),Qt=g(`<li>"copy text" entry when text is selected</li>`),$t=g(`<li>link entry when clicking on a link</li>`),en=g(`<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>`,1),tn=g(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing
			the Fuz contextmenu.</p>`),nn=g(`<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which
			ensures the Fuz contextmenu is used</label></div> <!>`,1);function rn(e,i){m(i,!0);let o=e=>{var r=Xt(),i=C(r),o=N(C(i));let s;A(),n(i),F(i,e=>E(y,e),()=>t(y));var c=N(i,2),l=N(C(c));A(),n(c),n(r),I(e=>{s=b(o,1,``,null,s,{palette_h:t(_)}),D(l,`href`,e)},[()=>de(`/`)]),v(`click`,o,w),a(e,r)},s=$.get(),c=x(()=>s.component),u=x(()=>s.name),d=new ue,f=U(!1),p=U(!1),g=U(!0),_=U(!1),y=U(void 0),w=()=>{let e=window.getSelection();if(!e||!t(y))return;let n=document.createRange();n.selectNodeContents(t(y)),e.removeAllRanges(),e.addRange(n)};X(e,{children:(e,i)=>{var s=nn(),m=T(s);Z(m,{text:`Disable default behaviors`});var v=N(m,4);{let e=x(()=>`<${t(u)}${t(f)?` link_entry={null}`:``}${t(p)?` text_entry={null}`:``}>`);Y(v,{get content(){return t(e)}})}var y=N(v,2),b=C(y),w=C(b);M(w);var D=N(w,2),O=N(C(D));O.textContent=`link_entry={null}`,n(D),n(b);var k=N(b,2),j=C(k);M(j);var P=N(j,2),F=N(C(P));F.textContent=`text_entry={null}`,n(P),n(k),n(y);var I=N(y,2);{let e=x(()=>t(f)?null:void 0),n=x(()=>t(p)?null:void 0);r(I,()=>t(c),(r,i)=>{i(r,{get contextmenu(){return d},scoped:!0,get link_entry(){return t(e)},get text_entry(){return t(n)},children:(e,n)=>{var r=h(),i=T(r),s=e=>{Q(e,{entries:e=>{q(e,{icon:`>`,run:()=>void E(_,!t(_)),children:(e,t)=>{A();var n=z(`some custom entry`);a(e,n)},$$slots:{default:!0}})},children:(e,t)=>{o(e)},$$slots:{entries:!0,default:!0}})},c=e=>{o(e)};l(i,e=>{t(g)?e(s):e(c,-1)}),a(e,r)},$$slots:{default:!0}})})}var L=N(I,4),R=C(L),B=C(R);M(B),A(),n(R),n(L);var V=N(L,2),H=e=>{var r=en(),i=N(T(r),2),o=C(i),s=e=>{var t=Zt();a(e,t)};l(o,e=>{t(g)&&e(s)});var c=N(o,2),u=e=>{var t=Qt();a(e,t)};l(c,e=>{t(p)||e(u)});var d=N(c,2),m=e=>{var t=$t();a(e,t)};l(d,e=>{t(f)||e(m)}),n(i),a(e,r)},ee=e=>{var t=tn();a(e,t)};l(V,e=>{t(g)||!t(f)||!t(p)?e(H):e(ee,-1)}),S(w,()=>t(f),e=>E(f,e)),S(j,()=>t(p),e=>E(p,e)),S(B,()=>t(g),e=>E(g,e)),a(e,s)},$$slots:{default:!0}}),W()}s([`click`]);var an=g(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function on(e,i){m(i,!0);let o=$.get(),s=x(()=>o.component),c=x(()=>o.name);var l=h(),u=T(l);r(u,()=>t(s),(e,r)=>{r(e,{scoped:!0,children:(e,r)=>{X(e,{children:(e,r)=>{var i=an(),o=T(i);Z(o,{text:`Default behaviors`});var s=N(o,2),l=C(s);{let e=x(()=>`<${t(c)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${t(c)}>`);Y(l,{get content(){return t(e)}})}A(6),n(s),a(e,i)},$$slots:{default:!0}})},$$slots:{default:!0}})}),a(e,l),W()}var sn=g(`<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>`,1);function cn(e,t){m(t,!0);let n=ke(`Contextmenu`);$.set(),Me(e,{get tome(){return n},children:(e,t)=>{var n=sn(),r=T(n);Ze(r,{});var i=N(r,2);Pt(i,{});var o=N(i,2);on(o,{});var s=N(o,2);Yt(s,{});var c=N(s,2);rn(c,{});var l=N(c,2);Kt(l,{});var u=N(l,2);At(u,{}),nt(N(u,2),{}),A(2),a(e,n)},$$slots:{default:!0}}),W()}export{cn as t};