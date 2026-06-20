import"../chunks/DsnmJJEf.js";import{p as lt,g as $t,a as F,b as o,c as ct,h as Lt,f as y,bx as Tt,by as ae,s as e,l as N,k as et,j as t,b0 as te,u as P,bA as Xt,d as s,r as a,a$ as ee,t as vt,i as Y,n as k,e as ft,aA as Se,at as Pe,bD as Ie}from"../chunks/Du9vwFlh.js";import{T as Ee}from"../chunks/RXsC8dYo.js";import{t as Oe}from"../chunks/DAabsXfd.js";import{c as Nt}from"../chunks/BvRb4duA.js";import{C as Dt}from"../chunks/CDmzq3wV.js";import{M as Bt}from"../chunks/B-U9Qcci.js";import{T as Pt,a as It}from"../chunks/mlfp-x7X.js";import{D as St}from"../chunks/BVx9m-6R.js";import{e as Ae,t as Ht,a as se}from"../chunks/BzAEj_ua.js";import{i as Qt,b as ge,S as xe,r as Rt,a as re,g as it,h as ze,s as be}from"../chunks/kZAsh5VI.js";import{p as rt,r as ye,i as at}from"../chunks/CJlqBYE4.js";import{c as De,C as jt,a as $e,b as Ne,d as ie}from"../chunks/Ve4l-1s6.js";import{a as Fe,b as Re,c as Le,d as qe,e as Ue,f as Me,l as He,t as Be,s as Xe,g as We,h as Ge,i as je,j as Ve,k as Ye,C as le,m as nt,n as Ze,o as Ke,p as Je,q as ne,r as Qe}from"../chunks/UaUp1fFS.js";import{D as we,b as ce}from"../chunks/D-pAusS9.js";import{a as de,b as ue,c as Kt}from"../chunks/B65Ca28h.js";import{c as tn}from"../chunks/D5uoerqz.js";import{s as zt}from"../chunks/V2q5a4YM.js";import{e as Wt}from"../chunks/CFhx26gF.js";import{c as en,s as nn}from"../chunks/DfIpPbHs.js";import{S as on}from"../chunks/BqA1TS1I.js";import{G as an}from"../chunks/CTWnVI4G.js";import{o as sn}from"../chunks/C9sfRakK.js";import{b as oe}from"../chunks/oRtbtIbx.js";import{S as me}from"../chunks/DZJIcMvh.js";import{b as rn}from"../chunks/CIZy9vDr.js";import{d as ln}from"../chunks/COpzMoZb.js";import{C as cn,T as dn}from"../chunks/C4kRN0u0.js";import{D as un,a as mn}from"../chunks/C3WjE6R0.js";import{r as vn}from"../chunks/CJlKG2DX.js";var _n=new Set(["$$slots","$$events","$$legacy","tag","entries","children"]);function yt(v,n){lt(n,!0);const d=rt(n,"tag",3,"span"),C=ye(n,_n);var _=$t(),r=F(_);Ae(r,d,!1,(i,l)=>{Qt(i,()=>De(n.entries)),ge(i,()=>({...C,[xe]:{display:"contents"}}));var c=$t(),h=F(c);Lt(h,()=>n.children),o(l,c)}),o(v,_),ct()}var pn=y('<div class="contextmenu-root svelte-1472w04" role="group"><!></div>'),hn=y("<!> <!>",1);function fn(v,n){lt(n,!0);const d=rt(n,"contextmenu",19,()=>new jt),C=rt(n,"longpress_move_tolerance",3,Fe),_=rt(n,"longpress_duration",3,Re),r=rt(n,"bypass_with_tap_then_longpress",3,!0),i=rt(n,"bypass_window",3,Le),l=rt(n,"bypass_move_tolerance",3,qe),c=rt(n,"open_offset_x",3,Ue),h=rt(n,"open_offset_y",3,Me),w=rt(n,"scoped",3,!1),m=rt(n,"link_entry",3,He),f=rt(n,"text_entry",3,Be),p=rt(n,"separator_entry",3,Xe);$e.set(()=>d());let x=et(void 0),b=0,u=0,g=null,R=!1;const Z=new je,H=new Ge,X=()=>{document.body.classList.add("contextmenu-pending")},B=()=>{document.body.classList.remove("contextmenu-pending")},I=()=>{R=!1,g!==null&&(clearTimeout(g),g=null),B()},E=()=>{I(),Z.reset()},O=P(()=>({open_offset_x:c(),open_offset_y:h(),link_enabled:m()!==null,text_enabled:f()!==null,separator_enabled:p()!==null})),M=$=>{if(!Z.consume()){if(R){if(t(x)?.contains($.target))return;E(),zt($);return}Ve($,d(),t(x),H,t(O))&&E()}},D=$=>{R=!1,H.touchstart();const{touches:L,target:G}=$;if(d().opened||L.length!==1||!Ye(G,$.shiftKey)){E();return}const{clientX:J,clientY:ot}=L[0];r()&&Z.track(J,ot,i(),l())||(b=J,u=ot,X(),g!==null&&I(),g=setTimeout(()=>{R=!0,B(),Ne(G,b+c(),u+h(),d(),t(O))&&H.opened()},_()))},U=$=>{if(g===null||d().opened)return;const{touches:L}=$;if(L.length!==1)return;const{clientX:G,clientY:J}=L[0];if(Math.hypot(G-b,J-u)>C()){I();return}$.preventDefault()},A=$=>{H.touchend($),g!==null&&I(),Z.consume()},S=()=>{H.reset(),E()},z=$=>{const L={passive:!0,capture:!0},G={passive:!1,capture:!0},J=Xt($,"touchstart",D,L),ot=Xt($,"touchmove",U,G),dt=Xt($,"touchend",A,G),q=Xt($,"touchcancel",S,L);return()=>{J(),ot(),dt(),q()}};var W=hn();Tt("contextmenu",ae,function(...$){(w()?void 0:M)?.apply(this,$)}),Qt(ae,()=>w()?void 0:z);var K=F(W);{var T=$=>{var L=pn(),G=s(L);Lt(G,()=>n.children),a(L),Qt(L,()=>z),ee("contextmenu",L,M),o($,L)},V=$=>{var L=$t(),G=F(L);Lt(G,()=>n.children),o($,L)};at(K,$=>{w()?$(T):$(V,-1)})}var Q=e(K,2);We(Q,{get contextmenu(){return d()},get open_guard(){return H},get link_entry(){return m()},get text_entry(){return f()},get separator_entry(){return p()},get el(){return t(x)},set el($){N(x,$)}}),o(v,W),ct()}te(["contextmenu"]);const Et=tn(()=>new gn("standard"));class gn{#t=et();get variant(){return t(this.#t)}set variant(n){N(this.#t,n)}#e=P(()=>this.variant==="standard"?le:fn);get component(){return t(this.#e)}set component(n){N(this.#e,n)}#n=P(()=>this.component===le?"ContextmenuRoot":"ContextmenuRootForSafariCompatibility");get name(){return t(this.#n)}set name(n){N(this.#n,n)}constructor(n="standard"){this.variant=n}}var xn=y('<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <!></div></label> <label class="row"><input type="radio"/> <div>iOS compat <!></div></label></fieldset>');function Ce(v,n){lt(n,!0);const d=[],C=Et.get();var _=xn(),r=e(s(_),2),i=s(r);Rt(i),i.value=i.__value="standard";var l=e(i,2),c=e(s(l));St(c,{name:"ContextmenuRoot"}),a(l),a(r);var h=e(r,2),w=s(h);Rt(w),w.value=w.__value="compat";var m=e(w,2),f=e(s(m));St(f,{name:"ContextmenuRootForSafariCompatibility"}),a(m),a(h),a(_),de(d,[],i,()=>C.variant,p=>C.variant=p),de(d,[],w,()=>C.variant,p=>C.variant=p),o(v,_),ct()}var bn=y('<p class="panel p_md">alert B -- also inherits A</p>'),yn=y('<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>'),$n=y("<code>navigator.vibrate</code>"),wn=y(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
		capabilities to users. Popular websites with similar features include Google Docs and Discord.
		Below are caveats about this breaking some user expectations, and a workaround for iOS Safari
		support. See also the <!> docs and <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p> <p>When you rightclick inside a <!>, or longpress on touch
		devices, it searches the DOM tree for behaviors defined with <!> starting from the target element up to the root. If any behaviors are found, the Fuz contextmenu
		opens, showing all contextually available actions. If no behaviors are found, the default system contextmenu
		opens.</p> <p>Here's a <code> </code> with a <!> inside another <!>:</p> <!> <!> <p>This simple hierarchical pattern gives users the full contextual actions by default -- not just
		the actions for the target being clicked, but all ancestor actions too. This means users don't
		need to hunt for specific parent elements to find the desired action, unlike many systems --
		instead, all actions in the tree are available, improving UX convenience and predictability at
		the cost of more noisy menus. Developers can opt out of this inheritance behavior by simply not
		nesting <!> declarations, and submenus are useful for managing
		complexity.</p> <h4>Mouse and keyboard:</h4> <ul><li>rightclick opens the Fuz contextmenu and not the system contextmenu (minus current exceptions
			for input/textarea/contenteditable)</li> <li>holding Shift opens the system contextmenu, bypassing the Fuz contextmenu</li> <li>keyboard navigation and activation should work similarly to the W3C <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/">APG menubar pattern</a></li></ul> <h4>Touch devices:</h4> <ul><li>longpress opens the Fuz contextmenu and not the system contextmenu (minus current exceptions
			for input/textarea/contenteditable)</li> <li>tap-then-longpress opens the system contextmenu or performs other default behavior like
			selecting text, bypassing the Fuz contextmenu</li> <li>tap-then-longpress can't work for clickable elements like links; longpress on the first
			contextmenu entry for those cases (double-longpress)</li></ul> <h4>All devices:</h4> <ul><li>opening the contextmenu on the contextmenu itself shows the system contextmenu, bypassing the
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function Cn(v,n){lt(n,!0);const d=Et.get(),C=P(()=>d.component),_=P(()=>d.name);Pt(v,{children:(r,i)=>{var l=wn(),c=F(l);It(c,{text:"Introduction"});var h=e(c,2),w=e(s(h));Bt(w,{path:"Web/API/Element/contextmenu_event"}),k(3),a(h);var m=e(h,2),f=e(s(m));St(f,{name:"ContextmenuRoot"});var p=e(f,2);St(p,{name:"Contextmenu"}),k(),a(m);var x=e(m,2),b=e(s(x)),u=s(b,!0);a(b);var g=e(b,2);St(g,{name:"Contextmenu"});var R=e(g,2);St(R,{name:"Contextmenu"}),k(),a(x);var Z=e(x,2);Nt(Z,()=>t(C),(D,U)=>{U(D,{scoped:!0,children:(A,S)=>{yt(A,{entries:W=>{nt(W,{run:()=>alert("alert A"),children:(K,T)=>{k();var V=Y("alert A");o(K,V)},$$slots:{default:!0}})},children:(W,K)=>{var T=yn(),V=e(s(T),2);yt(V,{entries:$=>{nt($,{run:()=>alert("alert B"),children:(L,G)=>{k();var J=Y("alert B");o(L,J)},$$slots:{default:!0}})},children:($,L)=>{var G=bn();o($,G)},$$slots:{entries:!0,default:!0}}),a(T),o(W,T)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var H=e(Z,2);we(H,{summary:U=>{k();var A=Y("view code");o(U,A)},children:(U,A)=>{{let S=P(()=>`<${t(_)}>
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
</${t(_)}>`);Dt(U,{get content(){return t(S)}})}},$$slots:{summary:!0,default:!0}});var X=e(H,2),B=e(s(X));St(B,{name:"Contextmenu"}),k(),a(X);var I=e(X,12),E=e(s(I),2),O=e(s(E));Bt(O,{path:"Web/API/Navigator/vibrate",children:(D,U)=>{var A=$n();o(D,A)},$$slots:{default:!0}}),a(E),a(I);var M=e(I,2);Ce(M,{}),vt(()=>ft(u,t(_))),o(r,l)},$$slots:{default:!0}}),ct()}var kn=y('<span class="font_family_mono">contextmenu</span> event',1),Tn=y(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
		Safari not supporting the <code>contextmenu</code> event as of October 2025, see <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a>.</p> <p>Use <!> by default for better performance and haptic feedback.
		Use <!> only if you need iOS Safari support.</p> <h4>ContextmenuRoot</h4> <ul><li>standard, default implementation</li> <li>relies on the browser's <!></li> <li>much simpler, better performance with fewer and less intrusive event handlers, fewer edge
			cases that can go wrong</li> <li>does not work on iOS Safari until <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a> is fixed</li></ul> <h4>ContextmenuRootForSafariCompatibility</h4> <ul><li>opt-in hacky alternative when iOS support is needed</li> <li>implements custom longpress detection to work around iOS Safari's lacking <a href="https://bugs.webkit.org/show_bug.cgi?id=213953"><code>contextmenu</code> event support</a></li> <li>degraded experience because some browsers (including mobile Chrome) block <code>navigator.vibrate</code> haptic feedback due to the timeout-based gesture detection (because it's not a direct user action)</li> <li>works on all devices including iOS Safari</li> <li>more complex implementation with custom touch event handling and gesture detection, may cause
			edge case UX problems on some devices</li> <li>a longpress is cancelled if you move the touch past a threshold before it triggers</li> <li>opt into this version only if you need iOS Safari support</li></ul> <!>`,1),Sn=y(`<!> <p>The Fuz contextmenu provides powerful app-specific UX, but it breaks from normal browser
		behavior by replacing the system contextmenu.</p> <p>To mitigate the downsides:</p> <ul><li>The Fuz contextmenu only replaces the system contextmenu when the DOM tree has defined
			behaviors. Note that <code>a</code> links have default contextmenu behaviors unless disabled. Other
			interactive elements may have default behaviors added in the future.</li> <li>The Fuz contextmenu does not open on elements that allow clipboard pasting like inputs,
			textareas, and contenteditables -- however this may change for better app integration, or be
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),Pn=y("<!> <!>",1);function In(v){var n=Pn(),d=F(n);Pt(d,{children:(_,r)=>{var i=Tn(),l=F(i);It(l,{text:"iOS compatibility"});var c=e(l,4),h=e(s(c));St(h,{name:"ContextmenuRoot"});var w=e(h,2);St(w,{name:"ContextmenuRootForSafariCompatibility"}),k(),a(c);var m=e(c,4),f=e(s(m),2),p=e(s(f));Bt(p,{path:"Web/API/Element/contextmenu_event",children:(b,u)=>{var g=kn();k(),o(b,g)},$$slots:{default:!0}}),a(f),k(4),a(m);var x=e(m,6);Ce(x,{}),o(_,i)},$$slots:{default:!0}});var C=e(d,2);Pt(C,{children:(_,r)=>{var i=Sn(),l=F(i);It(l,{text:"Caveats"});var c=e(l,8),h=e(s(c));Bt(h,{path:"Web/API/Element/contextmenu_event"}),k(3),a(c),o(_,i)},$$slots:{default:!0}}),o(v,n)}function En(v){const n=v-1;return n*n*n+1}function On(v){return--v*v*v*v*v+1}function ve(v,{from:n,to:d},C={}){var{delay:_=0,duration:r=B=>Math.sqrt(B)*120,easing:i=En}=C,l=getComputedStyle(v),c=l.transform==="none"?"":l.transform,[h,w]=l.transformOrigin.split(" ").map(parseFloat);h/=v.clientWidth,w/=v.clientHeight;var m=An(v),f=v.clientWidth/d.width/m,p=v.clientHeight/d.height/m,x=n.left+n.width*h,b=n.top+n.height*w,u=d.left+d.width*h,g=d.top+d.height*w,R=(x-u)*f,Z=(b-g)*p,H=n.width/d.width,X=n.height/d.height;return{delay:_,duration:typeof r=="function"?r(Math.sqrt(R*R+Z*Z)):r,easing:i,css:(B,I)=>{var E=I*R,O=I*Z,M=B+I*H,D=B+I*X;return`transform: ${c} translate(${E}px, ${O}px) scale(${M}, ${D});`}}}function An(v){if("currentCSSZoom"in v)return v.currentCSSZoom;for(var n=v,d=1;n!==null;)d*=+getComputedStyle(n).zoom,n=n.parentElement;return d}var zn=y('<menu class="pane unstyled svelte-6kuqba"><!></menu>'),Dn=y('<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-haspopup="menu" tabindex="-1"><div class="content"><div class="icon"><!></div> <div class="title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>');function Vt(v,n){lt(n,!0);const d=$e.get(),C=P(d),_=d().add_submenu(),r=P(()=>t(C).layout),i=P(()=>_.selected);let l=et(void 0);const c=ie.get(),h=ie.set();let w=et(0),m=et(0);Se(()=>{t(l)&&f(t(l),t(r),c)});const f=(E,O,M)=>{const{x:D,y:U,width:A,height:S}=E.getBoundingClientRect();h.width=A,h.height=S;const z=Ke({base_x:D-t(w),base_y:U-t(m),width:A,height:S,parent_width:M.width,layout_width:O.width,layout_height:O.height});N(w,z.x),N(m,z.y)};let p=null;sn(()=>{p!==null&&clearTimeout(p)});var x=Dn();let b;var u=s(x),g=s(u),R=s(g),Z=s(R);Ze(Z,{get icon(){return n.icon}}),a(R);var H=e(R,2),X=s(H);Lt(X,()=>n.children),a(H),a(g),k(2),a(u);var B=e(u,2);{var I=E=>{var O=zn();let M;var D=s(O);Lt(D,()=>n.menu),a(O),oe(O,U=>N(l,U),()=>t(l)),vt(()=>M=re(O,"",M,{transform:`translate3d(${t(w)??""}px, ${t(m)??""}px, 0)`,"max-height":`${t(r).height??""}px`})),o(E,O)};at(B,E=>{t(i)&&E(I)})}a(x),vt(()=>{b=re(x,"",b,{"--contextmenu_depth":_.depth}),it(u,1,ze(["menuitem plain selectable",{selected:t(i)}])),be(u,"aria-expanded",t(i))}),Tt("mouseenter",u,E=>{zt(E),p!==null&&clearTimeout(p),p=setTimeout(()=>{p=null,t(C).select(_)})}),o(v,x),ct()}var Nn=y("<!> <!>",1);function Gt(v,n){lt(n,!0);const d=rt(n,"name",3,"Cat"),C=rt(n,"icon",3,"😺");Vt(v,{get icon(){return C()},menu:r=>{var i=Nn(),l=F(i);{let h=P(()=>n.position==="adventure"?"🏠":"🌄");nt(l,{run:()=>n.act({type:n.position==="adventure"?"cat_go_home":"cat_go_adventure",name:d()}),get icon(){return t(h)},children:(w,m)=>{var f=$t(),p=F(f);{var x=u=>{var g=Y("go home");o(u,g)},b=u=>{var g=Y("go adventure");o(u,g)};at(p,u=>{n.position==="adventure"?u(x):u(b,-1)})}o(w,f)},$$slots:{default:!0}})}var c=e(l,2);{let h=P(()=>n.position==="adventure"?"🌄":"🏠");nt(c,{run:()=>n.act({type:"cat_be_or_do",name:d(),position:n.position}),get icon(){return t(h)},children:(w,m)=>{var f=$t(),p=F(f);{var x=u=>{var g=Y("do adventure");o(u,g)},b=u=>{var g=Y("be home");o(u,g)};at(p,u=>{n.position==="adventure"?u(x):u(b,-1)})}o(w,f)},$$slots:{default:!0}})}o(r,i)},children:(r,i)=>{k();var l=Y();vt(()=>ft(l,d())),o(r,l)},$$slots:{menu:!0,default:!0}}),ct()}var Fn=y("<!> <!> <!>",1);function Rn(v,n){var d=Fn(),C=F(d);Je(C,{href:"https://github.com/fuzdev/fuz_ui",icon:l=>{me(l,{get data(){return rn},size:"var(--icon_size_xs)"})},children:(l,c)=>{k();var h=Y("Source code");o(l,h)},$$slots:{icon:!0,default:!0}});var _=e(C,2);ne(_,{});var r=e(_,2);nt(r,{get run(){return n.toggle_about_dialog},icon:l=>{me(l,{get data(){return ln},size:"var(--icon_size_xs)"})},children:(l,c)=>{k();var h=Y("About");o(l,h)},$$slots:{icon:!0,default:!0}}),o(v,d)}const ke=v=>{const n=v.length;if(n===2)return"cats";if(n===0)return null;const d=v[0];return d.icon+d.name};var _e=y("<!> <!>",1),Ln=y("<!> <!> <!>",1);function qn(v,n){lt(n,!0);const d=P(()=>ke(n.adventure_cats));Vt(v,{icon:"🏠",menu:_=>{var r=Ln(),i=F(r);{var l=m=>{var f=_e(),p=F(f);nt(p,{run:()=>n.act({type:"call_cats_home"}),icon:"🐈‍⬛",children:(u,g)=>{k();var R=Y("call");o(u,R)},$$slots:{default:!0}});var x=e(p,2);{var b=u=>{ne(u,{})};at(x,u=>{n.home_cats.length>0&&u(b)})}o(m,f)};at(i,m=>{t(d)&&m(l)})}var c=e(i,2);Wt(c,17,()=>n.home_cats,m=>m.name,(m,f)=>{Gt(m,{get name(){return t(f).name},get icon(){return t(f).icon},get position(){return t(f).position},get act(){return n.act}})});var h=e(c,2);{var w=m=>{var f=_e(),p=F(f);nt(p,{run:()=>n.act({type:"cat_be_or_do",name:null,position:"home"}),icon:"🏠",children:(b,u)=>{k();var g=Y("be");o(b,g)},$$slots:{default:!0}});var x=e(p,2);nt(x,{run:()=>n.act({type:"call_cats_adventure"}),icon:"🦋",children:(b,u)=>{k();var g=Y("leave");o(b,g)},$$slots:{default:!0}}),o(m,f)};at(h,m=>{t(d)||m(w)})}o(_,r)},children:(_,r)=>{k();var i=Y("home");o(_,i)},$$slots:{menu:!0,default:!0}}),ct()}var pe=y("<!> <!>",1),Un=y("<!> <!> <!>",1);function Mn(v,n){lt(n,!0);const d=P(()=>ke(n.home_cats));Vt(v,{icon:"🌄",menu:_=>{var r=Un(),i=F(r);{var l=m=>{var f=pe(),p=F(f);nt(p,{run:()=>n.act({type:"call_cats_adventure"}),icon:"🦋",children:(u,g)=>{k();var R=Y("call");o(u,R)},$$slots:{default:!0}});var x=e(p,2);{var b=u=>{ne(u,{})};at(x,u=>{n.adventure_cats.length>0&&u(b)})}o(m,f)};at(i,m=>{t(d)&&m(l)})}var c=e(i,2);Wt(c,17,()=>n.adventure_cats,m=>m.name,(m,f)=>{Gt(m,{get name(){return t(f).name},get icon(){return t(f).icon},get position(){return t(f).position},get act(){return n.act}})});var h=e(c,2);{var w=m=>{var f=pe(),p=F(f);nt(p,{run:()=>n.act({type:"cat_be_or_do",name:null,position:"adventure"}),icon:"🌄",children:(b,u)=>{k();var g=Y("do");o(b,g)},$$slots:{default:!0}});var x=e(p,2);nt(x,{run:()=>n.act({type:"call_cats_home"}),icon:"🐈‍⬛",children:(b,u)=>{k();var g=Y("leave");o(b,g)},$$slots:{default:!0}}),o(m,f)};at(h,m=>{t(d)||m(w)})}o(_,r)},children:(_,r)=>{k();var i=Y("adventure");o(_,i)},$$slots:{menu:!0,default:!0}}),ct()}var Hn=y('<span class="cat svelte-1py4cgo"><span class="icon svelte-1py4cgo"> </span><span class="name svelte-1py4cgo"><!> </span></span>');function he(v,n){const d=rt(n,"name",3,"Cat"),C=rt(n,"icon",3,"😺");var _=Hn(),r=s(_),i=s(r,!0);a(r);var l=e(r),c=s(l);Lt(c,()=>n.children??Pe);var h=e(c,1,!0);a(l),a(_),vt(()=>{ft(i,C()),ft(h,d())}),o(v,_)}const Bn=`<script lang="ts">
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
`;var Jt=y("<!> <!>",1),fe=y('<div class="cat-wrapper svelte-177dlvm"><div><!></div></div>'),Xn=y('<div class="position home svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>'),Wn=y('<div class="position adventure svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>'),Gn=y('<section class="display:flex svelte-177dlvm"><div class="svelte-177dlvm"><!> <!></div></section> <section class="svelte-177dlvm"><!></section>',1),jn=y('<h1 class="svelte-177dlvm">About Fuz</h1> <blockquote class="svelte-177dlvm">Svelte UI library</blockquote> <blockquote class="svelte-177dlvm">free and open source at<br class="svelte-177dlvm"/><!></blockquote> <code class="display:block p_md mb_lg svelte-177dlvm">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui" class="svelte-177dlvm">@fuzdev/fuz_ui</a></code> <div class="p_xl box svelte-177dlvm"><h2 class="svelte-177dlvm">Color scheme</h2> <!> <h2 class="svelte-177dlvm">Theme</h2> <!></div>',1);function Vn(v,n){lt(n,!0);const d=Et.get(),C=P(()=>d.component),_="Alyssa",r="Ben",i="home";let l=et(i),c=et(i);const h=P(()=>t(l)===t(c)?"😺":"😾"),w=P(()=>t(l)===t(c)?"😸":"😿"),m=P(()=>({name:_,icon:t(h),position:t(l)})),f=P(()=>({name:r,icon:t(w),position:t(c)}));let p=et(!1);const x=new on,b=(S,z)=>{const W=[],K=[];for(const T of S){const V=T.position==="home"?W:K;z?V.unshift(T):V.push(T)}return{home_cats:W,adventure_cats:K}},u=P(()=>b([t(m),t(f)],t(p))),g=P(()=>t(u).home_cats),R=P(()=>t(u).adventure_cats),Z=P(()=>t(l)!==i||t(c)!==i),H=()=>{N(l,i),N(c,i)};let X=et(!1);const B=()=>{N(X,!t(X))},I=S=>{switch(S.type){case"call_cats_adventure":{N(l,"adventure"),N(c,"adventure");break}case"call_cats_home":{N(l,"home"),N(c,"home");break}case"cat_go_adventure":{S.name===_?N(l,"adventure"):S.name===r&&N(c,"adventure");break}case"cat_go_home":{S.name===_?N(l,"home"):S.name===r&&N(c,"home");break}case"cat_be_or_do":{const z=S.position==="home"?t(g):t(R);if(z.length>1)N(p,!t(p));else for(const W of z)x.add(W.name);break}}},[E,O]=en({fallback:(S,z)=>{const W=window.getComputedStyle(S),K=W.transform==="none"?"":W.transform;return{duration:1500,easing:On,css:T=>`
					transform: ${K} scale(${T});
					opacity: ${T}
				`}}});var M=Jt(),D=F(M);Nt(D,()=>t(C),(S,z)=>{z(S,{scoped:!0,children:(W,K)=>{Pt(W,{children:(T,V)=>{var Q=Jt(),$=F(Q);It($,{text:"Full example"});var L=e($,2);yt(L,{entries:J=>{var ot=Jt(),dt=F(ot);{var q=tt=>{Qe(tt,{run:H,content:"Reset",icon:"↻"})};at(dt,tt=>{t(Z)&&tt(q)})}var j=e(dt,2);Rn(j,{toggle_about_dialog:B}),o(J,ot)},children:(J,ot)=>{var dt=Gn(),q=F(dt),j=s(q),tt=s(j);yt(tt,{entries:pt=>{qn(pt,{act:I,get home_cats(){return t(g)},get adventure_cats(){return t(R)}})},children:(pt,xt)=>{var wt=Xn(),bt=e(s(wt),2);Wt(bt,29,()=>t(g),({name:Ct,icon:ut,position:st})=>Ct,(Ct,ut)=>{let st=()=>t(ut).name,mt=()=>t(ut).icon,Yt=()=>t(ut).position;var ht=fe(),kt=s(ht);let qt;var Zt=s(kt);yt(Zt,{entries:At=>{Gt(At,{act:I,get name(){return st()},get icon(){return mt()},get position(){return Yt()}})},children:(At,Te)=>{he(At,{get name(){return st()},get icon(){return mt()}})},$$slots:{entries:!0,default:!0}}),a(kt),a(ht),vt(Ut=>qt=it(kt,1,"svelte-177dlvm",null,qt,Ut),[()=>({shaking:x.has(st())})]),Tt("animationend",kt,()=>x.delete(st())),Ht(1,ht,()=>O,()=>({key:st()})),Ht(2,ht,()=>E,()=>({key:st()})),se(ht,()=>ve,null),o(Ct,ht)}),a(bt),a(wt),o(pt,wt)},$$slots:{entries:!0,default:!0}});var _t=e(tt,2);yt(_t,{entries:pt=>{Mn(pt,{act:I,get home_cats(){return t(g)},get adventure_cats(){return t(R)}})},children:(pt,xt)=>{var wt=Wn(),bt=e(s(wt),2);Wt(bt,29,()=>t(R),({name:Ct,icon:ut,position:st})=>Ct,(Ct,ut)=>{let st=()=>t(ut).name,mt=()=>t(ut).icon,Yt=()=>t(ut).position;var ht=fe(),kt=s(ht);let qt;var Zt=s(kt);yt(Zt,{entries:At=>{Gt(At,{act:I,get name(){return st()},get icon(){return mt()},get position(){return Yt()}})},children:(At,Te)=>{he(At,{get name(){return st()},get icon(){return mt()}})},$$slots:{entries:!0,default:!0}}),a(kt),a(ht),vt(Ut=>qt=it(kt,1,"svelte-177dlvm",null,qt,Ut),[()=>({shaking:x.has(st())})]),Tt("animationend",kt,()=>x.delete(st())),Ht(1,ht,()=>O,()=>({key:st()})),Ht(2,ht,()=>E,()=>({key:st()})),se(ht,()=>ve,null),o(Ct,ht)}),a(bt),a(wt),o(pt,wt)},$$slots:{entries:!0,default:!0}}),a(j),a(q);var Ot=e(q,2),Ft=s(Ot);we(Ft,{summary:pt=>{k();var xt=Y("View example source");o(pt,xt)},children:(pt,xt)=>{Dt(pt,{get content(){return Bn}})},$$slots:{summary:!0,default:!0}}),a(Ot),o(J,dt)},$$slots:{entries:!0,default:!0}}),o(T,Q)},$$slots:{default:!0}})},$$slots:{default:!0}})});var U=e(D,2);{var A=S=>{un(S,{onclose:()=>N(X,!1),children:(z,W)=>{mn(z,{children:(K,T)=>{var V=jn(),Q=e(F(V),4),$=e(s(Q),2);an($,{path:"fuzdev/fuz_ui"}),a(Q);var L=e(Q,4),G=e(s(L),2);cn(G,{});var J=e(G,4);dn(J,{}),a(L),o(K,V)},$$slots:{default:!0}})},$$slots:{default:!0}})};at(U,S=>{t(X)&&S(A)})}o(v,M),ct()}var Yn=y("<!> <!> <!>",1),Zn=y(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific element
					instead of the entire page.</aside></div>`),Kn=y("<!> <!>",1);function Jn(v,n){lt(n,!0);const d=Et.get(),C=P(()=>d.component),_=P(()=>d.name);let r=et(!1),i=et(!1),l=et(!1);var c=$t(),h=F(c);Nt(h,()=>t(C),(w,m)=>{m(w,{scoped:!0,children:(f,p)=>{Pt(f,{children:(x,b)=>{var u=Kn(),g=F(u);It(g,{text:"Basic usage"});var R=e(g,2);yt(R,{entries:H=>{var X=Yn(),B=F(X);nt(B,{run:()=>{N(r,!t(r))},children:(O,M)=>{k();var D=Y("Hello world");o(O,D)},$$slots:{default:!0}});var I=e(B,2);nt(I,{run:()=>{N(i,!t(i))},icon:M=>{k();var D=Y("🌞");o(M,D)},children:(M,D)=>{k();var U=Y("Hello with an optional icon snippet");o(M,U)},$$slots:{icon:!0,default:!0}});var E=e(I,2);nt(E,{run:()=>{N(l,!t(l))},icon:"🌚",children:(O,M)=>{k();var D=Y("Hello with an optional icon string");o(O,D)},$$slots:{default:!0}}),o(H,X)},children:(H,X)=>{var B=Zn(),I=e(s(B),2);{let Q=P(()=>`<${t(_)} scoped>
  <Contextmenu>
    {#snippet entries()}
      <ContextmenuEntry run={() => (greeted = !greeted)}>
        Hello world <!-- ${t(r)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_snippet = !greeted_icon_snippet)}>
        {#snippet icon()}🌞{/snippet}
        Hello with an optional icon snippet <!-- ${t(i)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_string = !greeted_icon_string)} icon="🌚">
        Hello with an optional icon string <!-- ${t(l)} -->
      </ContextmenuEntry>
    {/snippet}
    ...markup with the above contextmenu behavior...
  </Contextmenu>
  ...markup with only default contextmenu behavior...
</${t(_)}>
...markup without contextmenu behavior...`);Dt(I,{get content(){return t(Q)}})}var E=e(I,2),O=s(E);let M;var D=s(O);a(O),a(E);var U=e(E,2),A=s(U);let S;var z=s(A);a(A),a(U);var W=e(U,2),K=s(W);let T;var V=s(K);a(K),a(W),k(2),a(B),vt(()=>{M=it(O,1,"",null,M,{color_g_5:t(r)}),ft(D,`greeted = ${t(r)??""}`),S=it(A,1,"",null,S,{color_e_5:t(i)}),ft(z,`greeted_icon_snippet = ${t(i)??""}`),T=it(K,1,"",null,T,{color_d_5:t(l)}),ft(V,`greeted_icon_string = ${t(l)??""}`)}),o(H,B)},$$slots:{entries:!0,default:!0}}),o(x,u)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(v,c),ct()}var Qn=new Set(["$$slots","$$events","$$legacy","glyph","size"]),to=y("<span> </span>");function Mt(v,n){lt(n,!0);const d=ye(n,Qn),C="var(--font_size, 1em)",_="var(--font_size, inherit)",r=P(()=>n.size??C);var i=to();ge(i,()=>({...d,class:`glyph display:inline-block text-align:center line-height:1 white-space:nowrap font-weight:400 ${n.class??""}`,[xe]:{width:t(r),height:t(r),"min-width":t(r),"min-height":t(r),"font-size":n.size??_}}));var l=s(i,!0);a(i),vt(()=>ft(l,n.glyph)),o(v,i),ct()}var eo=y('<span class="color_f_50">option f</span>'),no=y('<span class="color_g_50">option g</span>'),oo=y('<span class="color_j_50">option j</span>'),ao=y("<!> <!> <!> <!>",1),so=y('<li class="color_error">Error: <code> </code></li>'),ro=y('<div class="display:flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>'),io=y(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and control
					it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing you to select multiple colors using the activate
					button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),lo=y("<!> <!>",1);function co(v,n){lt(n,!0);const d=Et.get(),C=P(()=>d.component),_=P(()=>d.name),r=new jt;let i=et(void 0);const l=P(()=>t(i)?`color_${t(i)}_5`:void 0),c=P(()=>t(i)?`color_${t(i)}`:void 0);var h=$t(),w=F(h);Nt(w,()=>t(C),(m,f)=>{f(m,{get contextmenu(){return r},scoped:!0,children:(p,x)=>{Pt(p,{children:(b,u)=>{var g=lo(),R=F(g);It(R,{text:"Custom instance"});var Z=e(R,2);yt(Z,{entries:X=>{Vt(X,{icon:"🎨",menu:I=>{var E=ao(),O=F(E);nt(O,{run:()=>(N(i,"f"),{ok:!0,close:!1}),children:(A,S)=>{var z=eo();o(A,z)},$$slots:{default:!0}});var M=e(O,2);nt(M,{run:()=>(N(i,"g"),{ok:!0,close:!1}),children:(A,S)=>{var z=no();o(A,z)},$$slots:{default:!0}});var D=e(M,2);nt(D,{run:()=>(N(i,"j"),{ok:!0,close:!1}),children:(A,S)=>{var z=oo();o(A,z)},$$slots:{default:!0}});var U=e(D,2);nt(U,{run:()=>(r.close(),{ok:!0}),children:(A,S)=>{k();var z=Y("close contextmenu");o(A,z)},$$slots:{default:!0}}),o(I,E)},children:(I,E)=>{k();var O=Y("select color");o(I,O)},$$slots:{menu:!0,default:!0}})},children:(X,B)=>{var I=io(),E=s(I),O=e(s(E)),M=s(O,!0);a(O),k(5),a(E);var D=e(E,2);Dt(D,{lang:"ts",dangerous_raw_html:'<span class="token_keyword">const</span> contextmenu <span class="token_operator">=</span> <span class="token_keyword">new</span> <span class="token_class_name"><span class="token_capitalized_identifier token_class_name">ContextmenuState</span></span><span class="token_punctuation">(</span><span class="token_punctuation">)</span><span class="token_punctuation">;</span>'});var U=e(D,2);{let q=P(()=>`<${t(_)} {contextmenu} scoped>...</${t(_)}>`);Dt(U,{get content(){return t(q)}})}var A=e(U,2),S=e(s(A));S.textContent="{ok: true, close: false}",k(),a(A);var z=e(A,2),W=e(s(z),2),K=s(W),T=e(s(K),2),V=s(T,!0);a(T),a(K);var Q=e(K,2),$=e(s(Q),2),L=s($);a($),a(Q);var G=e(Q,2);{var J=q=>{var j=so(),tt=e(s(j)),_t=s(tt,!0);a(tt),a(j),vt(()=>ft(_t,r.error)),o(q,j)};at(G,q=>{r.error&&q(J)})}a(W),a(z);var ot=e(z,2);{var dt=q=>{var j=ro(),tt=s(j),_t=s(tt),Ot=s(_t);Mt(Ot,{glyph:"↑"}),a(_t);var Ft=e(_t,2),gt=s(Ft),pt=s(gt);Mt(pt,{glyph:"←"}),a(gt);var xt=e(gt,2),wt=s(xt);Mt(wt,{glyph:"↵"}),a(xt);var bt=e(xt,2),Ct=s(bt);Mt(Ct,{glyph:"→"}),a(bt),a(Ft);var ut=e(Ft,2),st=s(ut);Mt(st,{glyph:"↓"}),a(ut),a(tt),a(j),vt(()=>{it(_t,1,`border_bottom_left_radius_0 border_bottom_right_radius_0 ${t(c)??""}`),_t.disabled=!r.can_select_sibling,it(gt,1,`border_bottom_right_radius_0 border_top_right_radius_0 ${t(c)??""}`),gt.disabled=!r.can_collapse,it(xt,1,`border-radius:0 ${t(c)??""}`),xt.disabled=!r.can_activate,it(bt,1,`border_bottom_left_radius_0 border_top_left_radius_0 ${t(c)??""}`),bt.disabled=!r.can_expand,it(ut,1,`border_top_left_radius_0 border_top_right_radius_0 ${t(c)??""}`),ut.disabled=!r.can_select_sibling}),Tt("mousedown",_t,mt=>{zt(mt),r.select_previous()},!0),Tt("mousedown",gt,mt=>{zt(mt),r.collapse_selected()},!0),Tt("mousedown",xt,async mt=>{zt(mt),await r.activate_selected()},!0),Tt("mousedown",bt,mt=>{zt(mt),r.expand_selected()},!0),Tt("mousedown",ut,mt=>{zt(mt),r.select_next()},!0),Ht(3,j,()=>nn),o(q,j)};at(ot,q=>{r.opened&&q(dt)})}a(I),vt(()=>{ft(M,t(_)),it(z,1,`mb_md ${t(l)??""}`),ft(V,r.opened),ft(L,`${r.x??""} && contextmenu.y === ${r.y??""}`)}),o(X,I)},$$slots:{entries:!0,default:!0}}),o(b,g)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(v,h),ct()}var uo=y(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the browser's
					default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's default
					contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),mo=y("<div><!></div> <!>",1);function vo(v,n){lt(n,!0);const d=Et.get(),C=P(()=>d.component),_=new jt;let r=et(!1),i=et(void 0);const l=()=>{const b=window.getSelection();if(!b||!t(i))return;const u=document.createRange();u.selectNodeContents(t(i)),b.removeAllRanges(),b.addRange(u)};let c=et("");const h="If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.",w=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`,m=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`,f=P(()=>t(c)===h||t(c)===w||t(c)===m);var p=$t(),x=F(p);Nt(x,()=>t(C),(b,u)=>{u(b,{get contextmenu(){return _},scoped:!0,children:(g,R)=>{Pt(g,{children:(Z,H)=>{var X=mo(),B=F(X);let I;var E=s(B);It(E,{text:"Select text"}),a(B);var O=e(B,2);yt(O,{entries:D=>{nt(D,{run:()=>{N(r,!t(r))},children:(U,A)=>{k();var S=Y("Toggle something");o(U,S)},$$slots:{default:!0}})},children:(D,U)=>{var A=uo();let S;var z=s(A),W=e(s(z),2),K=e(s(W));let T;k(),a(W),a(z),oe(z,tt=>N(i,tt),()=>t(i));var V=e(z,2),Q=s(V);Rt(Q),a(V);var $=e(V,2);let L;var G=e($,2),J=s(G);Ie(J),a(G);var ot=e(G,2),dt=s(ot);Bt(dt,{path:"Web/HTML/Global_attributes/contenteditable"}),k(),a(ot);var q=e(ot,4),j=e(q,4);k(2),a(A),vt(()=>{S=it(A,1,"panel p_md",null,S,{color_g_5:t(f)}),T=it(K,1,"",null,T,{color_a:t(r)}),L=it($,1,"",null,L,{color_g_5:t(f)})}),ee("click",K,l),ue(Q,()=>t(c),tt=>N(c,tt)),ue(J,()=>t(c),tt=>N(c,tt)),ce("innerText",q,()=>t(c),tt=>N(c,tt)),ce("innerText",j,()=>t(c),tt=>N(c,tt)),o(D,A)},$$slots:{entries:!0,default:!0}}),vt(()=>I=it(B,1,"",null,I,{color_d_5:t(f)})),o(Z,X)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(v,p),ct()}te(["click"]);var _o=y('<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>'),po=y('<li>custom "some custom entry" entry</li>'),ho=y('<li>"copy text" entry when text is selected</li>'),fo=y("<li>link entry when clicking on a link</li>"),go=y("<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>",1),xo=y(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing the
			Fuz contextmenu.</p>`),bo=y('<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which ensures the Fuz contextmenu is used</label></div> <!>',1);function yo(v,n){lt(n,!0);const d=p=>{var x=_o(),b=s(x),u=e(s(b));let g;k(),a(b),oe(b,H=>N(m,H),()=>t(m));var R=e(b,2),Z=e(s(R));k(),a(R),a(x),vt(H=>{g=it(u,1,"",null,g,{color_h:t(w)}),be(Z,"href",H)},[()=>vn("/")]),ee("click",u,f),o(p,x)},C=Et.get(),_=P(()=>C.component),r=P(()=>C.name),i=new jt;let l=et(!1),c=et(!1),h=et(!0),w=et(!1),m=et(void 0);const f=()=>{const p=window.getSelection();if(!p||!t(m))return;const x=document.createRange();x.selectNodeContents(t(m)),p.removeAllRanges(),p.addRange(x)};Pt(v,{children:(p,x)=>{var b=bo(),u=F(b);It(u,{text:"Disable default behaviors"});var g=e(u,4);{let T=P(()=>`<${t(r)}${t(l)?" link_entry={null}":""}${t(c)?" text_entry={null}":""}>`);Dt(g,{get content(){return t(T)}})}var R=e(g,2),Z=s(R),H=s(Z);Rt(H);var X=e(H,2),B=e(s(X));B.textContent="link_entry={null}",a(X),a(Z);var I=e(Z,2),E=s(I);Rt(E);var O=e(E,2),M=e(s(O));M.textContent="text_entry={null}",a(O),a(I),a(R);var D=e(R,2);{let T=P(()=>t(l)?null:void 0),V=P(()=>t(c)?null:void 0);Nt(D,()=>t(_),(Q,$)=>{$(Q,{get contextmenu(){return i},scoped:!0,get link_entry(){return t(T)},get text_entry(){return t(V)},children:(L,G)=>{var J=$t(),ot=F(J);{var dt=j=>{yt(j,{entries:_t=>{nt(_t,{icon:">",run:()=>{N(w,!t(w))},children:(Ot,Ft)=>{k();var gt=Y("some custom entry");o(Ot,gt)},$$slots:{default:!0}})},children:(_t,Ot)=>{d(_t)},$$slots:{entries:!0,default:!0}})},q=j=>{d(j)};at(ot,j=>{t(h)?j(dt):j(q,-1)})}o(L,J)},$$slots:{default:!0}})})}var U=e(D,4),A=s(U),S=s(A);Rt(S),k(),a(A),a(U);var z=e(U,2);{var W=T=>{var V=go(),Q=e(F(V),2),$=s(Q);{var L=q=>{var j=po();o(q,j)};at($,q=>{t(h)&&q(L)})}var G=e($,2);{var J=q=>{var j=ho();o(q,j)};at(G,q=>{t(c)||q(J)})}var ot=e(G,2);{var dt=q=>{var j=fo();o(q,j)};at(ot,q=>{t(l)||q(dt)})}a(Q),o(T,V)},K=T=>{var V=xo();o(T,V)};at(z,T=>{t(h)||!t(l)||!t(c)?T(W):T(K,-1)})}Kt(H,()=>t(l),T=>N(l,T)),Kt(E,()=>t(c),T=>N(c,T)),Kt(S,()=>t(h),T=>N(h,T)),o(p,b)},$$slots:{default:!0}}),ct()}te(["click"]);var $o=y(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function wo(v,n){lt(n,!0);const d=Et.get(),C=P(()=>d.component),_=P(()=>d.name);var r=$t(),i=F(r);Nt(i,()=>t(C),(l,c)=>{c(l,{scoped:!0,children:(h,w)=>{Pt(h,{children:(m,f)=>{var p=$o(),x=F(p);It(x,{text:"Default behaviors"});var b=e(x,2),u=s(b);{let g=P(()=>`<${t(_)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${t(_)}>`);Dt(u,{get content(){return t(g)}})}k(6),a(b),o(m,p)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(v,r),ct()}var Co=y("<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>",1);function ea(v,n){lt(n,!0);const C=Oe("Contextmenu");Et.set(),Ee(v,{get tome(){return C},children:(_,r)=>{var i=Co(),l=F(i);Cn(l,{});var c=e(l,2);Jn(c,{});var h=e(c,2);wo(h,{});var w=e(h,2);vo(w,{});var m=e(w,2);yo(m,{});var f=e(m,2);co(f,{});var p=e(f,2);Vn(p,{});var x=e(p,2);In(x),k(2),o(_,i)},$$slots:{default:!0}}),ct()}export{ea as component};
