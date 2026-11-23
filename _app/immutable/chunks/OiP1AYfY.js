import{$ as e,D as t,Dt as n,E as r,Et as i,Ft as a,H as o,I as s,J as c,Mt as l,N as u,P as d,S as f,St as p,T as m,U as h,W as g,X as _,Y as v,Z as y,b,c as x,dt as S,f as C,ft as w,gt as T,h as E,i as D,jt as O,k,l as A,m as j,mt as M,n as N,o as P,ot as F,p as I,pt as L,q as R,st as ee,t as z,u as B,ut as V,vt as H,w as U,wt as te,x as ne,y as re,z as W}from"./DOrLPxpd.js";import{t as ie}from"./06EB7pth.js";import{n as ae}from"./BZ7-9P4C.js";import{a as oe}from"./fAxELlHg.js";import{t as G}from"./BqEe8smv.js";import{t as K}from"./DaAu4Gol.js";import{n as q,t as J}from"./CWmRQOx5.js";import{t as Y}from"./TUcexmNC.js";import{a as se,i as ce,n as le,o as ue,r as de,t as fe}from"./CofyYnFp.js";import{a as pe,c as me,d as he,f as ge,h as _e,i as ve,l as ye,m as be,n as xe,o as Se,p as X,r as Ce,s as we,t as Te,u as Ee}from"./RgD6G5tf.js";import{t as De}from"./4Wgjlp1v.js";import{t as Oe}from"./CaWyYrcO.js";import{r as Z}from"./BNhgY4kg.js";import{l as ke}from"./DuFM53PT.js";import{r as Ae,t as je}from"./BT-35F2s.js";import{t as Me}from"./CldNTIjp.js";import{t as Ne}from"./j0ZUEpLB.js";import{f as Pe}from"./BirmrJWc.js";import{a as Fe}from"./C_d61x6a.js";import{n as Ie,t as Le}from"./DIVUKIyf.js";import{n as Re,t as ze}from"./DCTBu8fG.js";import"./bCrbH5D4.js";var Be=new Set([`$$slots`,`$$events`,`$$legacy`,`tag`,`entries`,`children`]);function Q(e,t){n(t,!0);let r=z(t,`tag`,3,`span`),a=N(t,Be);var c=h(),l=w(c);U(l,r,!1,(e,n)=>{f(e,()=>le(t.entries)),I(e,()=>({...a,[C]:{display:`contents`}}));var r=h(),i=w(r);s(i,()=>t.children),o(n,r)}),o(e,c),i()}var Ve=g(`<div class="contextmenu-root svelte-1472w04" role="group"><!></div>`),He=g(`<!> <!>`,1);function Ue(t,r){n(r,!0);let a=z(r,`contextmenu`,19,()=>new fe),c=z(r,`longpress_move_tolerance`,3,21),d=z(r,`longpress_duration`,3,633),m=z(r,`bypass_with_tap_then_longpress`,3,!0),g=z(r,`bypass_window`,3,750),b=z(r,`bypass_move_tolerance`,3,11),x=z(r,`open_offset_x`,3,-2),C=z(r,`open_offset_y`,3,-2),E=z(r,`scoped`,3,!1),D=z(r,`link_entry`,3,Ce),O=z(r,`text_entry`,3,pe),k=z(r,`separator_entry`,3,ve);ce.set(()=>a()),de(()=>E());let A=H(void 0),j=0,N=0,P=null,F=!1,I=new Se,L=new we,R=()=>{document.body.classList.add(`contextmenu-pending`)},ee=()=>{document.body.classList.remove(`contextmenu-pending`)},B=()=>{F=!1,P!==null&&(clearTimeout(P),P=null),ee()},U=()=>{B(),I.reset()},te=p(()=>({open_offset_x:x(),open_offset_y:C(),link_enabled:D()!==null,text_enabled:O()!==null,separator_enabled:k()!==null})),ne=t=>{if(!I.consume()){if(F){if(e(A)?.contains(t.target))return;U(),Z(t)}else Ee(t,a(),e(A),L,e(te))&&U()}},re=t=>{F=!1,L.touchstart();let{touches:n,target:r}=t;if(a().opened||n.length!==1||!ye(r,t.shiftKey)){U();return}let{clientX:i,clientY:o}=n[0];m()&&I.track(i,o,g(),b())||(j=i,N=o,R(),P!==null&&B(),P=setTimeout(()=>{F=!0,ee(),ue(r,j+x(),N+C(),a(),e(te))&&L.opened()},d()))},W=e=>{if(P===null||a().opened)return;let{touches:t}=e;if(t.length!==1)return;let{clientX:n,clientY:r}=t[0];Math.hypot(n-j,r-N)>c()?B():e.preventDefault()},ie=e=>{L.touchend(e),P!==null&&B(),I.consume()},ae=()=>{L.reset(),U()},oe=e=>{let t={passive:!0,capture:!0},n={passive:!1,capture:!0},r=y(e,`touchstart`,re,t),i=y(e,`touchmove`,W,n),a=y(e,`touchend`,ie,n),o=y(e,`touchcancel`,ae,t);return()=>{r(),i(),a(),o()}};var G=He();_(`contextmenu`,V,function(...e){(E()?void 0:ne)?.apply(this,e)}),f(V,()=>E()?void 0:oe);var K=w(G),q=e=>{var t=Ve(),n=S(t);s(n,()=>r.children),l(t),f(t,()=>oe),v(`contextmenu`,t,ne),o(e,t)},J=e=>{var t=h(),n=w(t);s(n,()=>r.children),o(e,t)};u(K,e=>{E()?e(q):e(J,-1)});var Y=M(K,2);xe(Y,{get contextmenu(){return a()},get open_guard(){return L},get link_entry(){return D()},get text_entry(){return O()},get separator_entry(){return k()},get el(){return e(A)},set el(e){T(A,e)}}),o(t,G),i()}c([`contextmenu`]);var $=Oe(()=>new We(`standard`)),We=class{#e=H();get variant(){return e(this.#e)}set variant(e){T(this.#e,e)}#t=p(()=>this.variant===`standard`?Te:Ue);get component(){return e(this.#t)}set component(e){T(this.#t,e)}#n=p(()=>this.component===Te?`ContextmenuRoot`:`ContextmenuRootForSafariCompatibility`);get name(){return e(this.#n)}set name(e){T(this.#n,e)}constructor(e=`standard`){this.variant=e}},Ge=g(`<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <!></div></label> <label class="row"><input type="radio"/> <div>iOS compat <!></div></label></fieldset>`);function Ke(e,t){n(t,!0);let r=[],a=$.get();var s=Ge(),c=M(S(s),2),u=S(c);j(u),u.value=u.__value=`standard`;var d=M(u,2),f=M(S(d));Y(f,{name:`ContextmenuRoot`}),l(d),l(c);var p=M(c,2),m=S(p);j(m),m.value=m.__value=`compat`;var h=M(m,2),g=M(S(h));Y(g,{name:`ContextmenuRootForSafariCompatibility`}),l(h),l(p),l(s),A(r,[],u,()=>a.variant,e=>a.variant=e),A(r,[],m,()=>a.variant,e=>a.variant=e),o(e,s),i()}var qe=g(`<p class="panel p_md">alert B -- also inherits A</p>`),Je=g(`<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>`),Ye=g(`<code>navigator.vibrate</code>`),Xe=g(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
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
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function Ze(r,a){n(a,!0);let s=$.get(),c=p(()=>s.component),u=p(()=>s.name);q(r,{children:(n,r)=>{var i=Xe(),a=w(i);J(a,{text:`Introduction`});var s=M(a,2),d=M(S(s));K(d,{path:`Web/API/Element/contextmenu_event`}),O(3),l(s);var f=M(s,2),m=M(S(f));Y(m,{name:`ContextmenuRoot`});var h=M(m,2);Y(h,{name:`Contextmenu`}),O(),l(f);var g=M(f,2),_=M(S(g)),v=L(_,!0),y=M(_,2);Y(y,{name:`Contextmenu`});var b=M(y,2);Y(b,{name:`Contextmenu`}),O(),l(g);var x=M(g,2);t(x,()=>e(c),(e,t)=>{t(e,{scoped:!0,children:(e,t)=>{Q(e,{entries:e=>{X(e,{run:()=>alert(`alert A`),children:(e,t)=>{O();var n=R(`alert A`);o(e,n)},$$slots:{default:!0}})},children:(e,t)=>{var n=Je();Q(M(S(n),2),{entries:e=>{X(e,{run:()=>alert(`alert B`),children:(e,t)=>{O();var n=R(`alert B`);o(e,n)},$$slots:{default:!0}})},children:(e,t)=>{var n=qe();o(e,n)},$$slots:{entries:!0,default:!0}}),l(n),o(e,n)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var C=M(x,2);De(C,{summary:e=>{O();var t=R(`view code`);o(e,t)},children:(t,n)=>{{let n=p(()=>`<${e(u)}>
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
</${e(u)}>`);G(t,{get content(){return e(n)}})}},$$slots:{summary:!0,default:!0}});var T=M(C,2),E=M(S(T));Y(E,{name:`Contextmenu`}),O(),l(T);var D=M(T,12),k=M(S(D),2),A=M(S(k));K(A,{path:`Web/API/Navigator/vibrate`,children:(e,t)=>{var n=Ye();o(e,n)},$$slots:{default:!0}}),l(k),l(D),Ke(M(D,2),{}),F(()=>W(v,e(u))),o(n,i)},$$slots:{default:!0}}),i()}var Qe=g(`<span class="font_family_mono">contextmenu</span> event`,1),$e=g(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
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
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),tt=g(`<!> <!>`,1);function nt(e){var t=tt(),n=w(t);q(n,{children:(e,t)=>{var n=$e(),r=w(n);J(r,{text:`iOS compatibility`});var i=M(r,4),a=M(S(i));Y(a,{name:`ContextmenuRoot`});var s=M(a,2);Y(s,{name:`ContextmenuRootForSafariCompatibility`}),O(),l(i);var c=M(i,4),u=M(S(c),2),d=M(S(u));K(d,{path:`Web/API/Element/contextmenu_event`,children:(e,t)=>{var n=Qe();O(),o(e,n)},$$slots:{default:!0}}),l(u),O(4),l(c),Ke(M(c,6),{}),o(e,n)},$$slots:{default:!0}});var r=M(n,2);q(r,{children:(e,t)=>{var n=et(),r=w(n);J(r,{text:`Caveats`});var i=M(r,8),a=M(S(i));K(a,{path:`Web/API/Element/contextmenu_event`}),O(3),l(i),o(e,n)},$$slots:{default:!0}}),o(e,t)}function rt(e){let t=e-1;return t*t*t+1}function it(e){return--e*e*e*e*e+1}function at(e,{from:t,to:n},r={}){var{delay:i=0,duration:a=e=>Math.sqrt(e)*120,easing:o=rt}=r,s=getComputedStyle(e),c=s.transform===`none`?``:s.transform,[l,u]=s.transformOrigin.split(` `).map(parseFloat);l/=e.clientWidth,u/=e.clientHeight;var d=ot(e),f=e.clientWidth/n.width/d,p=e.clientHeight/n.height/d,m=t.left+t.width*l,h=t.top+t.height*u,g=n.left+n.width*l,_=n.top+n.height*u,v=(m-g)*f,y=(h-_)*p,b=t.width/n.width,x=t.height/n.height;return{delay:i,duration:typeof a==`function`?a(Math.sqrt(v*v+y*y)):a,easing:o,css:(e,t)=>`transform: ${c} translate(${t*v}px, ${t*y}px) scale(${e+t*b}, ${e+t*x});`}}function ot(e){if(`currentCSSZoom`in e)return e.currentCSSZoom;for(var t=e,n=1;t!==null;)n*=+getComputedStyle(t).zoom,t=t.parentElement;return n}var st=g(`<menu class="pane unstyled svelte-6kuqba"><!></menu>`),ct=g(`<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-haspopup="menu" tabindex="-1"><div class="menuitem_content"><div class="menuitem_icon"><!></div> <div class="menuitem_title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>`);function lt(t,r){n(r,!0);let a=ce.get(),c=p(a),f=a().add_submenu(),m=p(()=>e(c).layout),h=p(()=>f.selected),g=H(void 0),v=se.get(),y=se.set(),x=H(0),C=H(0);ee(()=>{e(g)&&w(e(g),e(m),v)});let w=(t,n,r)=>{let{x:i,y:a,width:o,height:s}=t.getBoundingClientRect();y.width=o,y.height=s;let c=me({base_x:i-e(x),base_y:a-e(C),width:o,height:s,parent_width:r.width,layout_width:n.width,layout_height:n.height});T(x,c.x),T(C,c.y)},D=null;d(()=>{D!==null&&clearTimeout(D)});var k=ct();let A;var j=S(k),N=S(j),I=S(N),L=S(I);_e(L,{get icon(){return r.icon}}),l(I);var R=M(I,2),z=S(R);s(z,()=>r.children),l(R),l(N),O(2),l(j);var B=M(j,2),V=t=>{var n=st();let i;var a=S(n);s(a,()=>r.menu),l(n),P(n,e=>T(g,e),()=>e(g)),F(()=>i=re(n,``,i,{transform:`translate3d(${e(x)??``}px, ${e(C)??``}px, 0)`,"max-height":`${e(m).height??``}px`})),o(t,n)};u(B,t=>{e(h)&&t(V)}),l(k),F(()=>{A=re(k,``,A,{"--contextmenu_depth":f.depth}),b(j,1,ne([`menuitem plain selectable`,{selected:e(h)}])),E(j,`aria-expanded`,e(h))}),_(`mouseenter`,j,t=>{Z(t),D!==null&&clearTimeout(D),D=setTimeout(()=>{D=null,e(c).select(f)})}),o(t,k),i()}var ut=g(`<!> <!>`,1);function dt(t,r){n(r,!0);let a=z(r,`name`,3,`Cat`),s=z(r,`icon`,3,`😺`);lt(t,{get icon(){return s()},menu:t=>{var n=ut(),i=w(n);{let t=p(()=>r.position===`adventure`?`🏠`:`🌄`);X(i,{run:()=>r.act({type:r.position===`adventure`?`cat_go_home`:`cat_go_adventure`,name:a()}),get icon(){return e(t)},children:(e,t)=>{var n=h(),i=w(n),a=e=>{var t=R(`go home`);o(e,t)},s=e=>{var t=R(`go adventure`);o(e,t)};u(i,e=>{r.position===`adventure`?e(a):e(s,-1)}),o(e,n)},$$slots:{default:!0}})}var s=M(i,2);{let t=p(()=>r.position===`adventure`?`🌄`:`🏠`);X(s,{run:()=>r.act({type:`cat_be_or_do`,name:a(),position:r.position}),get icon(){return e(t)},children:(e,t)=>{var n=h(),i=w(n),a=e=>{var t=R(`do adventure`);o(e,t)},s=e=>{var t=R(`be home`);o(e,t)};u(i,e=>{r.position===`adventure`?e(a):e(s,-1)}),o(e,n)},$$slots:{default:!0}})}o(t,n)},children:(e,t)=>{O();var n=R();F(()=>W(n,a())),o(e,n)},$$slots:{menu:!0,default:!0}}),i()}var ft=g(`<!> <!> <!>`,1);function pt(e,t){var n=ft(),r=w(n);be(r,{href:`https://github.com/fuzdev/fuz_ui`,icon:e=>{Ne(e,{get data(){return Pe},size:`var(--icon_size_xs)`})},children:(e,t)=>{O();var n=R(`Source code`);o(e,n)},$$slots:{icon:!0,default:!0}});var i=M(r,2);he(i,{});var a=M(i,2);X(a,{get run(){return t.toggle_about_dialog},icon:e=>{Ne(e,{get data(){return Fe},size:`var(--icon_size_xs)`})},children:(e,t)=>{O();var n=R(`About`);o(e,n)},$$slots:{icon:!0,default:!0}}),o(e,n)}var mt=e=>{let t=e.length;if(t===2)return`cats`;if(t===0)return null;let n=e[0];return n.icon+n.name},ht=g(`<!> <!>`,1),gt=g(`<!> <!> <!>`,1);function _t(t,r){n(r,!0);let a=p(()=>mt(r.adventure_cats));lt(t,{icon:`🏠`,menu:t=>{var n=gt(),i=w(n),s=e=>{var t=ht(),n=w(t);X(n,{run:()=>r.act({type:`call_cats_home`}),icon:`🐈‍⬛`,children:(e,t)=>{O();var n=R(`call`);o(e,n)},$$slots:{default:!0}});var i=M(n,2),a=e=>{he(e,{})};u(i,e=>{r.home_cats.length>0&&e(a)}),o(e,t)};u(i,t=>{e(a)&&t(s)});var c=M(i,2);k(c,17,()=>r.home_cats,e=>e.name,(t,n)=>{dt(t,{get name(){return e(n).name},get icon(){return e(n).icon},get position(){return e(n).position},get act(){return r.act}})});var l=M(c,2),d=e=>{var t=ht(),n=w(t);X(n,{run:()=>r.act({type:`cat_be_or_do`,name:null,position:`home`}),icon:`🏠`,children:(e,t)=>{O();var n=R(`be`);o(e,n)},$$slots:{default:!0}});var i=M(n,2);X(i,{run:()=>r.act({type:`call_cats_adventure`}),icon:`🦋`,children:(e,t)=>{O();var n=R(`leave`);o(e,n)},$$slots:{default:!0}}),o(e,t)};u(l,t=>{e(a)||t(d)}),o(t,n)},children:(e,t)=>{O();var n=R(`home`);o(e,n)},$$slots:{menu:!0,default:!0}}),i()}var vt=g(`<!> <!>`,1),yt=g(`<!> <!> <!>`,1);function bt(t,r){n(r,!0);let a=p(()=>mt(r.home_cats));lt(t,{icon:`🌄`,menu:t=>{var n=yt(),i=w(n),s=e=>{var t=vt(),n=w(t);X(n,{run:()=>r.act({type:`call_cats_adventure`}),icon:`🦋`,children:(e,t)=>{O();var n=R(`call`);o(e,n)},$$slots:{default:!0}});var i=M(n,2),a=e=>{he(e,{})};u(i,e=>{r.adventure_cats.length>0&&e(a)}),o(e,t)};u(i,t=>{e(a)&&t(s)});var c=M(i,2);k(c,17,()=>r.adventure_cats,e=>e.name,(t,n)=>{dt(t,{get name(){return e(n).name},get icon(){return e(n).icon},get position(){return e(n).position},get act(){return r.act}})});var l=M(c,2),d=e=>{var t=vt(),n=w(t);X(n,{run:()=>r.act({type:`cat_be_or_do`,name:null,position:`adventure`}),icon:`🌄`,children:(e,t)=>{O();var n=R(`do`);o(e,n)},$$slots:{default:!0}});var i=M(n,2);X(i,{run:()=>r.act({type:`call_cats_home`}),icon:`🐈‍⬛`,children:(e,t)=>{O();var n=R(`leave`);o(e,n)},$$slots:{default:!0}}),o(e,t)};u(l,t=>{e(a)||t(d)}),o(t,n)},children:(e,t)=>{O();var n=R(`adventure`);o(e,n)},$$slots:{menu:!0,default:!0}}),i()}var xt=g(`<span class="cat svelte-1py4cgo"><span class="icon svelte-1py4cgo"> </span><span class="name svelte-1py4cgo"><!> </span></span>`);function St(e,t){let n=z(t,`name`,3,`Cat`),r=z(t,`icon`,3,`😺`);var i=xt(),c=S(i),u=L(c,!0),d=M(c),f=S(d);s(f,()=>t.children??a);var p=M(f,1,!0);l(d),l(i),F(()=>{W(u,r()),W(p,n())}),o(e,i)}var Ct=`<script lang="ts">
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
`,wt=g(`<!> <!>`,1),Tt=g(`<div class="cat-wrapper svelte-177dlvm"><div><!></div></div>`),Et=g(`<div class="position home svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>`),Dt=g(`<div class="position adventure svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>`),Ot=g(`<section class="flex svelte-177dlvm"><div class="svelte-177dlvm"><!> <!></div></section> <section class="svelte-177dlvm"><!></section>`,1),kt=g(`<h1 class="svelte-177dlvm">About Fuz</h1> <blockquote class="svelte-177dlvm">Svelte component library and frontend helpers</blockquote> <blockquote class="svelte-177dlvm">free and open source at<br class="svelte-177dlvm"/><!></blockquote> <code class="block p_md mb_lg svelte-177dlvm">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui" class="svelte-177dlvm">@fuzdev/fuz_ui</a></code> <div class="p_xl box svelte-177dlvm"><h2 class="svelte-177dlvm">Color scheme</h2> <!> <h2 class="svelte-177dlvm">Theme</h2> <!></div>`,1);function At(a,s){n(s,!0);let c=$.get(),d=p(()=>c.component),f=`Alyssa`,h=`home`,g=H(h),v=H(h),y=p(()=>e(g)===e(v)?`😺`:`😾`),x=p(()=>e(g)===e(v)?`😸`:`😿`),C=p(()=>({name:f,icon:e(y),position:e(g)})),E=p(()=>({name:`Ben`,icon:e(x),position:e(v)})),D=H(!1),A=new ke,j=(e,t)=>{let n=[],r=[];for(let i of e){let e=i.position===`home`?n:r;t?e.unshift(i):e.push(i)}return{home_cats:n,adventure_cats:r}},N=p(()=>j([e(C),e(E)],e(D))),P=p(()=>e(N).home_cats),I=p(()=>e(N).adventure_cats),L=p(()=>e(g)!==h||e(v)!==h),ee=()=>{T(g,h),T(v,h)},z=H(!1),B=()=>{T(z,!e(z))},V=t=>{switch(t.type){case`call_cats_adventure`:T(g,`adventure`),T(v,`adventure`);break;case`call_cats_home`:T(g,`home`),T(v,`home`);break;case`cat_go_adventure`:t.name===f?T(g,`adventure`):t.name===`Ben`&&T(v,`adventure`);break;case`cat_go_home`:t.name===f?T(g,`home`):t.name===`Ben`&&T(v,`home`);break;case`cat_be_or_do`:{let n=t.position===`home`?e(P):e(I);if(n.length>1)T(D,!e(D));else for(let e of n)A.add(e.name);break}}},[U,te]=je({fallback:(e,t)=>{let n=window.getComputedStyle(e),r=n.transform===`none`?``:n.transform;return{duration:1500,easing:it,css:e=>`
					transform: ${r} scale(${e});
					opacity: ${e}
				`}}});var ne=wt(),re=w(ne);t(re,()=>e(d),(t,n)=>{n(t,{scoped:!0,children:(t,n)=>{q(t,{children:(t,n)=>{var i=wt(),a=w(i);J(a,{text:`Full example`}),Q(M(a,2),{entries:t=>{var n=wt(),r=w(n),i=e=>{ge(e,{run:ee,content:`Reset`,icon:`↻`})};u(r,t=>{e(L)&&t(i)}),pt(M(r,2),{toggle_about_dialog:B}),o(t,n)},children:(t,n)=>{var i=Ot(),a=w(i),s=S(a),c=S(s);Q(c,{entries:t=>{_t(t,{act:V,get home_cats(){return e(P)},get adventure_cats(){return e(I)}})},children:(t,n)=>{var i=Et(),a=M(S(i),2);k(a,29,()=>e(P),({name:e,icon:t,position:n})=>e,(t,n)=>{let i=()=>e(n).name,a=()=>e(n).icon,s=()=>e(n).position;var c=Tt(),u=S(c);let d;Q(S(u),{entries:e=>{dt(e,{act:V,get name(){return i()},get icon(){return a()},get position(){return s()}})},children:(e,t)=>{St(e,{get name(){return i()},get icon(){return a()}})},$$slots:{entries:!0,default:!0}}),l(u),l(c),F(e=>d=b(u,1,`svelte-177dlvm`,null,d,{shaking:e}),[()=>A.has(i())]),_(`animationend`,u,()=>A.delete(i())),r(1,c,()=>te,()=>({key:i()})),r(2,c,()=>U,()=>({key:i()})),m(c,()=>at,null),o(t,c)}),l(a),l(i),o(t,i)},$$slots:{entries:!0,default:!0}}),Q(M(c,2),{entries:t=>{bt(t,{act:V,get home_cats(){return e(P)},get adventure_cats(){return e(I)}})},children:(t,n)=>{var i=Dt(),a=M(S(i),2);k(a,29,()=>e(I),({name:e,icon:t,position:n})=>e,(t,n)=>{let i=()=>e(n).name,a=()=>e(n).icon,s=()=>e(n).position;var c=Tt(),u=S(c);let d;Q(S(u),{entries:e=>{dt(e,{act:V,get name(){return i()},get icon(){return a()},get position(){return s()}})},children:(e,t)=>{St(e,{get name(){return i()},get icon(){return a()}})},$$slots:{entries:!0,default:!0}}),l(u),l(c),F(e=>d=b(u,1,`svelte-177dlvm`,null,d,{shaking:e}),[()=>A.has(i())]),_(`animationend`,u,()=>A.delete(i())),r(1,c,()=>te,()=>({key:i()})),r(2,c,()=>U,()=>({key:i()})),m(c,()=>at,null),o(t,c)}),l(a),l(i),o(t,i)},$$slots:{entries:!0,default:!0}}),l(s),l(a);var u=M(a,2),d=S(u);De(d,{summary:e=>{O();var t=R(`View example source`);o(e,t)},children:(e,t)=>{G(e,{get content(){return Ct}})},$$slots:{summary:!0,default:!0}}),l(u),o(t,i)},$$slots:{entries:!0,default:!0}}),o(t,i)},$$slots:{default:!0}})},$$slots:{default:!0}})});var W=M(re,2),ie=e=>{Re(e,{onclose:()=>T(z,!1),children:(e,t)=>{ze(e,{children:(e,t)=>{var n=kt(),r=M(w(n),4),i=M(S(r),2);Me(i,{path:`fuzdev/fuz_ui`}),l(r);var a=M(r,4),s=M(S(a),2);Ie(s,{});var c=M(s,4);Le(c,{}),l(a),o(e,n)},$$slots:{default:!0}})},$$slots:{default:!0}})};u(W,t=>{e(z)&&t(ie)}),o(a,ne),i()}var jt=g(`<!> <!> <!>`,1),Mt=g(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific
					element instead of the entire page.</aside></div>`),Nt=g(`<!> <!>`,1);function Pt(r,a){n(a,!0);let s=$.get(),c=p(()=>s.component),u=p(()=>s.name),d=H(!1),f=H(!1),m=H(!1);var g=h(),_=w(g);t(_,()=>e(c),(t,n)=>{n(t,{scoped:!0,children:(t,n)=>{q(t,{children:(t,n)=>{var r=Nt(),i=w(r);J(i,{text:`Basic usage`}),Q(M(i,2),{entries:t=>{var n=jt(),r=w(n);X(r,{run:()=>void T(d,!e(d)),children:(e,t)=>{O();var n=R(`Hello world`);o(e,n)},$$slots:{default:!0}});var i=M(r,2);X(i,{run:()=>void T(f,!e(f)),icon:e=>{O();var t=R(`🌞`);o(e,t)},children:(e,t)=>{O();var n=R(`Hello with an optional icon snippet`);o(e,n)},$$slots:{icon:!0,default:!0}});var a=M(i,2);X(a,{run:()=>void T(m,!e(m)),icon:`🌚`,children:(e,t)=>{O();var n=R(`Hello with an optional icon string`);o(e,n)},$$slots:{default:!0}}),o(t,n)},children:(t,n)=>{var r=Mt(),i=M(S(r),2);{let t=p(()=>`<${e(u)} scoped>
  <Contextmenu>
    {#snippet entries()}
      <ContextmenuEntry run={() => (greeted = !greeted)}>
        Hello world <!-- ${e(d)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_snippet = !greeted_icon_snippet)}>
        {#snippet icon()}🌞{/snippet}
        Hello with an optional icon snippet <!-- ${e(f)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_string = !greeted_icon_string)} icon="🌚">
        Hello with an optional icon string <!-- ${e(m)} -->
      </ContextmenuEntry>
    {/snippet}
    ...markup with the above contextmenu behavior...
  </Contextmenu>
  ...markup with only default contextmenu behavior...
</${e(u)}>
...markup without contextmenu behavior...`);G(i,{get content(){return e(t)}})}var a=M(i,2),s=S(a);let c;var h=L(s);l(a);var g=M(a,2),_=S(g);let v;var y=L(_);l(g);var x=M(g,2),C=S(x);let w;var T=L(C);l(x),O(2),l(r),F(()=>{c=b(s,1,``,null,c,{color_g_50:e(d)}),W(h,`greeted = ${e(d)??``}`),v=b(_,1,``,null,v,{color_e_50:e(f)}),W(y,`greeted_icon_snippet = ${e(f)??``}`),w=b(C,1,``,null,w,{color_d_50:e(m)}),W(T,`greeted_icon_string = ${e(m)??``}`)}),o(t,r)},$$slots:{entries:!0,default:!0}}),o(t,r)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(r,g),i()}var Ft=new Set([`$$slots`,`$$events`,`$$legacy`,`glyph`,`size`]),It=g(`<span> </span>`);function Lt(t,r){n(r,!0);let a=N(r,Ft),s=p(()=>r.size??`var(--font_size, 1em)`);var c=It();I(c,()=>({...a,class:`glyph inline-block text-align:center line-height:1 white-space:nowrap font-weight:400 ${r.class??``}`,[C]:{width:e(s),height:e(s),"min-width":e(s),"min-height":e(s),"font-size":r.size??`var(--font_size, inherit)`}}));var l=L(c,!0);F(()=>W(l,r.glyph)),o(t,c),i()}var Rt=g(`<span class="color_f_50">option f</span>`),zt=g(`<span class="color_g_50">option g</span>`),Bt=g(`<span class="color_j_50">option j</span>`),Vt=g(`<!> <!> <!> <!>`,1),Ht=g(`<li class="negative_60">Error: <code> </code></li>`),Ut=g(`<div class="flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>`),Wt=g(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and
					control it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing
					you to select multiple colors using the activate button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),Gt=g(`<!> <!>`,1);function Kt(a,s){n(s,!0);let c=$.get(),d=p(()=>c.component),f=p(()=>c.name),m=new fe,g=H(void 0),v=p(()=>e(g)?`color_${e(g)}_50`:void 0),y=p(()=>e(g)?`palette_${e(g)}`:void 0);var x=h(),C=w(x);t(C,()=>e(d),(t,n)=>{n(t,{get contextmenu(){return m},scoped:!0,children:(t,n)=>{q(t,{children:(t,n)=>{var i=Gt(),a=w(i);J(a,{text:`Custom instance`}),Q(M(a,2),{entries:e=>{lt(e,{icon:`🎨`,menu:e=>{var t=Vt(),n=w(t);X(n,{run:()=>(T(g,`f`),{ok:!0,close:!1}),children:(e,t)=>{var n=Rt();o(e,n)},$$slots:{default:!0}});var r=M(n,2);X(r,{run:()=>(T(g,`g`),{ok:!0,close:!1}),children:(e,t)=>{var n=zt();o(e,n)},$$slots:{default:!0}});var i=M(r,2);X(i,{run:()=>(T(g,`j`),{ok:!0,close:!1}),children:(e,t)=>{var n=Bt();o(e,n)},$$slots:{default:!0}});var a=M(i,2);X(a,{run:()=>(m.close(),{ok:!0}),children:(e,t)=>{O();var n=R(`close contextmenu`);o(e,n)},$$slots:{default:!0}}),o(e,t)},children:(e,t)=>{O();var n=R(`select color`);o(e,n)},$$slots:{menu:!0,default:!0}})},children:(t,n)=>{var i=Wt(),a=S(i),s=M(S(a)),c=L(s,!0);O(5),l(a);var d=M(a,2);G(d,{lang:`ts`,dangerous_raw_html:`<span class="token_keyword">const</span> contextmenu <span class="token_operator">=</span> <span class="token_keyword">new</span> <span class="token_class_name">ContextmenuState</span><span class="token_punctuation">();</span>`});var h=M(d,2);{let t=p(()=>`<${e(f)} {contextmenu} scoped>...</${e(f)}>`);G(h,{get content(){return e(t)}})}var g=M(h,2),x=M(S(g));x.textContent=`{ok: true, close: false}`,O(),l(g);var C=M(g,2),w=M(S(C),2),T=S(w),E=M(S(T),2),D=L(E,!0);l(T);var k=M(T,2),A=M(S(k),2),j=L(A);l(k);var N=M(k,2),P=e=>{var t=Ht(),n=M(S(t)),r=L(n,!0);l(t),F(()=>W(r,m.error)),o(e,t)};u(N,e=>{m.error&&e(P)}),l(w),l(C);var I=M(C,2),R=t=>{var n=Ut(),i=S(n),a=S(i);Lt(S(a),{glyph:`↑`}),l(a);var s=M(a,2),c=S(s);Lt(S(c),{glyph:`←`}),l(c);var u=M(c,2);Lt(S(u),{glyph:`↵`}),l(u);var d=M(u,2);Lt(S(d),{glyph:`→`}),l(d),l(s);var f=M(s,2);Lt(S(f),{glyph:`↓`}),l(f),l(i),l(n),F(()=>{b(a,1,`border-bottom-left-radius:0 border-bottom-right-radius:0 ${e(y)??``}`),a.disabled=!m.can_select_sibling,b(c,1,`border-bottom-right-radius:0 border-top-right-radius:0 ${e(y)??``}`),c.disabled=!m.can_collapse,b(u,1,`border-radius:0 ${e(y)??``}`),u.disabled=!m.can_activate,b(d,1,`border-bottom-left-radius:0 border-top-left-radius:0 ${e(y)??``}`),d.disabled=!m.can_expand,b(f,1,`border-top-left-radius:0 border-top-right-radius:0 ${e(y)??``}`),f.disabled=!m.can_select_sibling}),_(`mousedown`,a,e=>{Z(e),m.select_previous()},!0),_(`mousedown`,c,e=>{Z(e),m.collapse_selected()},!0),_(`mousedown`,u,async e=>{Z(e),await m.activate_selected()},!0),_(`mousedown`,d,e=>{Z(e),m.expand_selected()},!0),_(`mousedown`,f,e=>{Z(e),m.select_next()},!0),r(3,n,()=>Ae),o(t,n)};u(I,e=>{m.opened&&e(R)}),l(i),F(()=>{W(c,e(f)),b(C,1,`mb_md ${e(v)??``}`),W(D,m.opened),W(j,`${m.x??``} && contextmenu.y === ${m.y??``}`)}),o(t,i)},$$slots:{entries:!0,default:!0}}),o(t,i)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(a,x),i()}var qt=g(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the
					browser's default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's
					default contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),Jt=g(`<div><!></div> <!>`,1);function Yt(r,a){n(a,!0);let s=$.get(),c=p(()=>s.component),u=new fe,d=H(!1),f=H(void 0),m=()=>{let t=window.getSelection();if(!t||!e(f))return;let n=document.createRange();n.selectNodeContents(e(f)),t.removeAllRanges(),t.addRange(n)},g=H(``),_=p(()=>e(g)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.`||e(g)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`||e(g)===`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`);var y=h(),x=w(y);t(x,()=>e(c),(t,n)=>{n(t,{get contextmenu(){return u},scoped:!0,children:(t,n)=>{q(t,{children:(t,n)=>{var r=Jt(),i=w(r);let a;var s=S(i);J(s,{text:`Select text`}),l(i),Q(M(i,2),{entries:t=>{X(t,{run:()=>void T(d,!e(d)),children:(e,t)=>{O();var n=R(`Toggle something`);o(e,n)},$$slots:{default:!0}})},children:(t,n)=>{var r=qt();let i;var a=S(r),s=M(S(a),2),c=M(S(s));let u;O(),l(s),l(a),P(a,e=>T(f,e),()=>e(f));var p=M(a,2),h=S(p);j(h),l(p);var y=M(p,2);let x;var C=M(y,2),w=S(C);te(w),l(C);var E=M(C,2),k=S(E);K(k,{path:`Web/HTML/Global_attributes/contenteditable`}),O(),l(E);var A=M(E,4),N=M(A,4);O(2),l(r),F(()=>{i=b(r,1,`panel p_md`,null,i,{color_g_50:e(_)}),u=b(c,1,``,null,u,{palette_a:e(d)}),x=b(y,1,``,null,x,{color_g_50:e(_)})}),v(`click`,c,m),B(h,()=>e(g),e=>T(g,e)),B(w,()=>e(g),e=>T(g,e)),D(`innerText`,A,()=>e(g),e=>T(g,e)),D(`innerText`,N,()=>e(g),e=>T(g,e)),o(t,r)},$$slots:{entries:!0,default:!0}}),F(()=>a=b(i,1,``,null,a,{color_d_50:e(_)})),o(t,r)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(r,y),i()}c([`click`]);var Xt=g(`<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>`),Zt=g(`<li>custom "some custom entry" entry</li>`),Qt=g(`<li>"copy text" entry when text is selected</li>`),$t=g(`<li>link entry when clicking on a link</li>`),en=g(`<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>`,1),tn=g(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing
			the Fuz contextmenu.</p>`),nn=g(`<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which
			ensures the Fuz contextmenu is used</label></div> <!>`,1);function rn(r,a){n(a,!0);let s=t=>{var n=Xt(),r=S(n),i=M(S(r));let a;O(),l(r),P(r,e=>T(D,e),()=>e(D));var s=M(r,2),c=M(S(s));O(),l(s),l(n),F(t=>{a=b(i,1,``,null,a,{palette_h:e(C)}),E(c,`href`,t)},[()=>oe(`/`)]),v(`click`,i,k),o(t,n)},c=$.get(),d=p(()=>c.component),f=p(()=>c.name),m=new fe,g=H(!1),_=H(!1),y=H(!0),C=H(!1),D=H(void 0),k=()=>{let t=window.getSelection();if(!t||!e(D))return;let n=document.createRange();n.selectNodeContents(e(D)),t.removeAllRanges(),t.addRange(n)};q(r,{children:(n,r)=>{var i=nn(),a=w(i);J(a,{text:`Disable default behaviors`});var c=M(a,4);{let t=p(()=>`<${e(f)}${e(g)?` link_entry={null}`:``}${e(_)?` text_entry={null}`:``}>`);G(c,{get content(){return e(t)}})}var v=M(c,2),b=S(v),E=S(b);j(E);var D=M(E,2),k=M(S(D));k.textContent=`link_entry={null}`,l(D),l(b);var A=M(b,2),N=S(A);j(N);var P=M(N,2),F=M(S(P));F.textContent=`text_entry={null}`,l(P),l(A),l(v);var I=M(v,2);{let n=p(()=>e(g)?null:void 0),r=p(()=>e(_)?null:void 0);t(I,()=>e(d),(t,i)=>{i(t,{get contextmenu(){return m},scoped:!0,get link_entry(){return e(n)},get text_entry(){return e(r)},children:(t,n)=>{var r=h(),i=w(r),a=t=>{Q(t,{entries:t=>{X(t,{icon:`>`,run:()=>void T(C,!e(C)),children:(e,t)=>{O();var n=R(`some custom entry`);o(e,n)},$$slots:{default:!0}})},children:(e,t)=>{s(e)},$$slots:{entries:!0,default:!0}})},c=e=>{s(e)};u(i,t=>{e(y)?t(a):t(c,-1)}),o(t,r)},$$slots:{default:!0}})})}var L=M(I,4),ee=S(L),z=S(ee);j(z),O(),l(ee),l(L);var B=M(L,2),V=t=>{var n=en(),r=M(w(n),2),i=S(r),a=e=>{var t=Zt();o(e,t)};u(i,t=>{e(y)&&t(a)});var s=M(i,2),c=e=>{var t=Qt();o(e,t)};u(s,t=>{e(_)||t(c)});var d=M(s,2),f=e=>{var t=$t();o(e,t)};u(d,t=>{e(g)||t(f)}),l(r),o(t,n)},H=e=>{var t=tn();o(e,t)};u(B,t=>{e(y)||!e(g)||!e(_)?t(V):t(H,-1)}),x(E,()=>e(g),e=>T(g,e)),x(N,()=>e(_),e=>T(_,e)),x(z,()=>e(y),e=>T(y,e)),o(n,i)},$$slots:{default:!0}}),i()}c([`click`]);var an=g(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function on(r,a){n(a,!0);let s=$.get(),c=p(()=>s.component),u=p(()=>s.name);var d=h(),f=w(d);t(f,()=>e(c),(t,n)=>{n(t,{scoped:!0,children:(t,n)=>{q(t,{children:(t,n)=>{var r=an(),i=w(r);J(i,{text:`Default behaviors`});var a=M(i,2),s=S(a);{let t=p(()=>`<${e(u)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${e(u)}>`);G(s,{get content(){return e(t)}})}O(6),l(a),o(t,r)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(r,d),i()}var sn=g(`<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>`,1);function cn(e,t){n(t,!0);let r=ae(`Contextmenu`);$.set(),ie(e,{get tome(){return r},children:(e,t)=>{var n=sn(),r=w(n);Ze(r,{});var i=M(r,2);Pt(i,{});var a=M(i,2);on(a,{});var s=M(a,2);Yt(s,{});var c=M(s,2);rn(c,{});var l=M(c,2);Kt(l,{});var u=M(l,2);At(u,{}),nt(M(u,2),{}),O(2),o(e,n)},$$slots:{default:!0}}),i()}export{cn as t};