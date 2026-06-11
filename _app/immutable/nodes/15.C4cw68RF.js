import"../chunks/DsnmJJEf.js";import{p as ct,g as gt,a as D,b as o,c as dt,h as Dt,f as w,bx as Tt,by as ae,s as e,l as L,k as et,j as t,b0 as te,u as z,bA as Xt,d as i,r as a,a$ as ee,t as lt,i as E,n as b,e as ft,ax as Pe,at as ge,bD as Ie}from"../chunks/BjUGcBtz.js";import{T as Ee}from"../chunks/DLSDAcXM.js";import{t as Oe}from"../chunks/Lednkwdb.js";import{c as Ft}from"../chunks/DOLCB8w7.js";import{C as Nt}from"../chunks/BMR_bq1y.js";import{M as Bt}from"../chunks/CDb9N5MN.js";import{T as Pt,a as It}from"../chunks/f7Gjp3j0.js";import{D as St}from"../chunks/CpqmV14D.js";import{e as Ae,t as Ht,a as se}from"../chunks/Basby7de.js";import{h as Qt,b as xe,S as be,r as Lt,a as re,g as it,s as ye}from"../chunks/8gdhxqlr.js";import{p as rt,r as $e,i as nt}from"../chunks/BppSZfeB.js";import{c as ze,C as jt,a as we,b as De,d as ie}from"../chunks/CLihd3TM.js";import{a as Ne,b as Fe,c as Re,d as Le,e as qe,f as Ue,l as Me,t as He,s as Be,g as Xe,h as We,i as Ge,j as je,k as Ve,C as le,m as ot,n as Ye,o as Ze,p as ne,q as Ke}from"../chunks/BakD8rR9.js";import{D as Ce,b as ce}from"../chunks/BZ3k8HUP.js";import{a as de,b as ue,c as Kt}from"../chunks/ZvgWJnOa.js";import{c as Je}from"../chunks/BJ1aVY7m.js";import{s as zt}from"../chunks/V2q5a4YM.js";import{e as Wt}from"../chunks/ukwGoxL4.js";import{c as Qe,s as tn}from"../chunks/DfIpPbHs.js";import{S as en}from"../chunks/Dcza_F-V.js";import{G as nn}from"../chunks/yVbC0HZA.js";import{o as on}from"../chunks/SjO0nV3W.js";import{b as oe}from"../chunks/HUEqMiw_.js";import{S as me}from"../chunks/DHChAqjp.js";import{b as an}from"../chunks/CIZy9vDr.js";import{d as sn}from"../chunks/COpzMoZb.js";import{C as rn,T as ln}from"../chunks/BuJnYqTM.js";import{D as cn,a as dn}from"../chunks/CveNwMzW.js";import{r as un}from"../chunks/DMMCx9XS.js";var mn=new Set(["$$slots","$$events","$$legacy","tag","entries","children"]);function $t(h,n){ct(n,!0);const m=rt(n,"tag",3,"span"),T=$e(n,mn);var x=gt(),c=D(x);Ae(c,m,!1,(l,s)=>{Qt(l,()=>ze(n.entries)),xe(l,()=>({...T,[be]:{display:"contents"}}));var d=gt(),g=D(d);Dt(g,()=>n.children),o(s,d)}),o(h,x),dt()}var vn=w('<div class="contextmenu-root svelte-1472w04" role="group"><!></div>'),_n=w("<!> <!>",1);function pn(h,n){ct(n,!0);const m=rt(n,"contextmenu",19,()=>new jt),T=rt(n,"longpress_move_tolerance",3,Ne),x=rt(n,"longpress_duration",3,Fe),c=rt(n,"bypass_with_tap_then_longpress",3,!0),l=rt(n,"bypass_window",3,Re),s=rt(n,"bypass_move_tolerance",3,Le),d=rt(n,"open_offset_x",3,qe),g=rt(n,"open_offset_y",3,Ue),S=rt(n,"scoped",3,!1),$=rt(n,"link_entry",3,Me),v=rt(n,"text_entry",3,He),u=rt(n,"separator_entry",3,Be);we.set(()=>m());let _=et(void 0),y=0,p=0,r=null,f=!1;const P=new Ge,B=new We,G=()=>{document.body.classList.add("contextmenu-pending")},j=()=>{document.body.classList.remove("contextmenu-pending")},F=()=>{f=!1,r!==null&&(clearTimeout(r),r=null),j()},q=()=>{F(),P.reset()},O=z(()=>({open_offset_x:d(),open_offset_y:g(),link_enabled:$()!==null,text_enabled:v()!==null,separator_enabled:u()!==null})),R=C=>{if(!P.consume()){if(f){if(t(_)?.contains(C.target))return;q(),zt(C);return}je(C,m(),t(_),B,t(O))&&q()}},N=C=>{f=!1,B.touchstart();const{touches:M,target:V}=C;if(m().opened||M.length!==1||!Ve(V,C.shiftKey)){q();return}const{clientX:J,clientY:at}=M[0];c()&&P.track(J,at,l(),s())||(y=J,p=at,G(),r!==null&&F(),r=setTimeout(()=>{f=!0,j(),De(V,y+d(),p+g(),m(),t(O))&&B.opened()},x()))},X=C=>{if(r===null||m().opened)return;const{touches:M}=C;if(M.length!==1)return;const{clientX:V,clientY:J}=M[0];if(Math.hypot(V-y,J-p)>T()){F();return}C.preventDefault()},W=C=>{B.touchend(C),r!==null&&F(),P.consume()},k=()=>{B.reset(),q()},U=C=>{const M={passive:!0,capture:!0},V={passive:!1,capture:!0},J=Xt(C,"touchstart",N,M),at=Xt(C,"touchmove",X,V),ut=Xt(C,"touchend",W,V),H=Xt(C,"touchcancel",k,M);return()=>{J(),at(),ut(),H()}};var A=_n();Tt("contextmenu",ae,function(...C){(S()?void 0:R)?.apply(this,C)}),Qt(ae,()=>S()?void 0:U);var K=D(A);{var I=C=>{var M=vn(),V=i(M);Dt(V,()=>n.children),a(M),Qt(M,()=>U),ee("contextmenu",M,R),o(C,M)},Z=C=>{var M=gt(),V=D(M);Dt(V,()=>n.children),o(C,M)};nt(K,C=>{S()?C(I):C(Z,-1)})}var Q=e(K,2);Xe(Q,{get contextmenu(){return m()},get open_guard(){return B},get link_entry(){return $()},get text_entry(){return v()},get separator_entry(){return u()},get el(){return t(_)},set el(C){L(_,C)}}),o(h,A),dt()}te(["contextmenu"]);const Et=Je(()=>new hn("standard"));class hn{#t=et();get variant(){return t(this.#t)}set variant(n){L(this.#t,n)}#e=z(()=>this.variant==="standard"?le:pn);get component(){return t(this.#e)}set component(n){L(this.#e,n)}#n=z(()=>this.component===le?"ContextmenuRoot":"ContextmenuRootForSafariCompatibility");get name(){return t(this.#n)}set name(n){L(this.#n,n)}constructor(n="standard"){this.variant=n}}var fn=w('<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <!></div></label> <label class="row"><input type="radio"/> <div>iOS compat <!></div></label></fieldset>');function ke(h,n){ct(n,!0);const m=[],T=Et.get();var x=fn(),c=e(i(x),2),l=i(c);Lt(l),l.value=l.__value="standard";var s=e(l,2),d=e(i(s));St(d,{name:"ContextmenuRoot"}),a(s),a(c);var g=e(c,2),S=i(g);Lt(S),S.value=S.__value="compat";var $=e(S,2),v=e(i($));St(v,{name:"ContextmenuRootForSafariCompatibility"}),a($),a(g),a(x),de(m,[],l,()=>T.variant,u=>T.variant=u),de(m,[],S,()=>T.variant,u=>T.variant=u),o(h,x),dt()}var gn=w('<p class="panel p_md">alert B -- also inherits A</p>'),xn=w('<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>'),bn=w("<code>navigator.vibrate</code>"),yn=w(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
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
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function $n(h,n){ct(n,!0);const m=Et.get(),T=z(()=>m.component),x=z(()=>m.name);Pt(h,{children:(c,l)=>{var s=yn(),d=D(s);It(d,{text:"Introduction"});var g=e(d,2),S=e(i(g));Bt(S,{path:"Web/API/Element/contextmenu_event"}),b(3),a(g);var $=e(g,2),v=e(i($));St(v,{name:"ContextmenuRoot"});var u=e(v,2);St(u,{name:"Contextmenu"}),b(),a($);var _=e($,2),y=e(i(_)),p=i(y,!0);a(y);var r=e(y,2);St(r,{name:"Contextmenu"});var f=e(r,2);St(f,{name:"Contextmenu"}),b(),a(_);var P=e(_,2);Ft(P,()=>t(T),(N,X)=>{X(N,{scoped:!0,children:(W,k)=>{$t(W,{entries:A=>{ot(A,{run:()=>alert("alert A"),children:(K,I)=>{b();var Z=E("alert A");o(K,Z)},$$slots:{default:!0}})},children:(A,K)=>{var I=xn(),Z=e(i(I),2);$t(Z,{entries:C=>{ot(C,{run:()=>alert("alert B"),children:(M,V)=>{b();var J=E("alert B");o(M,J)},$$slots:{default:!0}})},children:(C,M)=>{var V=gn();o(C,V)},$$slots:{entries:!0,default:!0}}),a(I),o(A,I)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var B=e(P,2);Ce(B,{summary:X=>{b();var W=E("view code");o(X,W)},children:(X,W)=>{{let k=z(()=>`<${t(x)}>
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
</${t(x)}>`);Nt(X,{get content(){return t(k)}})}},$$slots:{summary:!0,default:!0}});var G=e(B,2),j=e(i(G));St(j,{name:"Contextmenu"}),b(),a(G);var F=e(G,12),q=e(i(F),2),O=e(i(q));Bt(O,{path:"Web/API/Navigator/vibrate",children:(N,X)=>{var W=bn();o(N,W)},$$slots:{default:!0}}),a(q),a(F);var R=e(F,2);ke(R,{}),lt(()=>ft(p,t(x))),o(c,s)},$$slots:{default:!0}}),dt()}var wn=w('<span class="font_family_mono">contextmenu</span> event',1),Cn=w(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
		Safari not supporting the <code>contextmenu</code> event as of October 2025, see <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a>.</p> <p>Use <!> by default for better performance and haptic feedback.
		Use <!> only if you need iOS Safari support.</p> <h4>ContextmenuRoot</h4> <ul><li>standard, default implementation</li> <li>relies on the browser's <!></li> <li>much simpler, better performance with fewer and less intrusive event handlers, fewer edge
			cases that can go wrong</li> <li>does not work on iOS Safari until <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a> is fixed</li></ul> <h4>ContextmenuRootForSafariCompatibility</h4> <ul><li>opt-in hacky alternative when iOS support is needed</li> <li>implements custom longpress detection to work around iOS Safari's lacking <a href="https://bugs.webkit.org/show_bug.cgi?id=213953"><code>contextmenu</code> event support</a></li> <li>degraded experience because some browsers (including mobile Chrome) block <code>navigator.vibrate</code> haptic feedback due to the timeout-based gesture detection (because it's not a direct user action)</li> <li>works on all devices including iOS Safari</li> <li>more complex implementation with custom touch event handling and gesture detection, may cause
			edge case UX problems on some devices</li> <li>a longpress is cancelled if you move the touch past a threshold before it triggers</li> <li>opt into this version only if you need iOS Safari support</li></ul> <!>`,1),kn=w(`<!> <p>The Fuz contextmenu provides powerful app-specific UX, but it breaks from normal browser
		behavior by replacing the system contextmenu.</p> <p>To mitigate the downsides:</p> <ul><li>The Fuz contextmenu only replaces the system contextmenu when the DOM tree has defined
			behaviors. Note that <code>a</code> links have default contextmenu behaviors unless disabled. Other
			interactive elements may have default behaviors added in the future.</li> <li>The Fuz contextmenu does not open on elements that allow clipboard pasting like inputs,
			textareas, and contenteditables -- however this may change for better app integration, or be
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),Tn=w("<!> <!>",1);function Sn(h){var n=Tn(),m=D(n);Pt(m,{children:(x,c)=>{var l=Cn(),s=D(l);It(s,{text:"iOS compatibility"});var d=e(s,4),g=e(i(d));St(g,{name:"ContextmenuRoot"});var S=e(g,2);St(S,{name:"ContextmenuRootForSafariCompatibility"}),b(),a(d);var $=e(d,4),v=e(i($),2),u=e(i(v));Bt(u,{path:"Web/API/Element/contextmenu_event",children:(y,p)=>{var r=wn();b(),o(y,r)},$$slots:{default:!0}}),a(v),b(4),a($);var _=e($,6);ke(_,{}),o(x,l)},$$slots:{default:!0}});var T=e(m,2);Pt(T,{children:(x,c)=>{var l=kn(),s=D(l);It(s,{text:"Caveats"});var d=e(s,8),g=e(i(d));Bt(g,{path:"Web/API/Element/contextmenu_event"}),b(3),a(d),o(x,l)},$$slots:{default:!0}}),o(h,n)}function Pn(h){const n=h-1;return n*n*n+1}function In(h){return--h*h*h*h*h+1}function ve(h,{from:n,to:m},T={}){var{delay:x=0,duration:c=j=>Math.sqrt(j)*120,easing:l=Pn}=T,s=getComputedStyle(h),d=s.transform==="none"?"":s.transform,[g,S]=s.transformOrigin.split(" ").map(parseFloat);g/=h.clientWidth,S/=h.clientHeight;var $=En(h),v=h.clientWidth/m.width/$,u=h.clientHeight/m.height/$,_=n.left+n.width*g,y=n.top+n.height*S,p=m.left+m.width*g,r=m.top+m.height*S,f=(_-p)*v,P=(y-r)*u,B=n.width/m.width,G=n.height/m.height;return{delay:x,duration:typeof c=="function"?c(Math.sqrt(f*f+P*P)):c,easing:l,css:(j,F)=>{var q=F*f,O=F*P,R=j+F*B,N=j+F*G;return`transform: ${d} translate(${q}px, ${O}px) scale(${R}, ${N});`}}}function En(h){if("currentCSSZoom"in h)return h.currentCSSZoom;for(var n=h,m=1;n!==null;)m*=+getComputedStyle(n).zoom,n=n.parentElement;return m}var On=w('<menu class="pane unstyled svelte-6kuqba"><!></menu>'),An=w('<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-haspopup="menu" tabindex="-1"><div class="content"><div class="icon"><!></div> <div class="title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>');function Vt(h,n){ct(n,!0);const m=we.get(),T=z(m),x=m().add_submenu(),c=z(()=>t(T).layout),l=z(()=>x.selected);let s=et(void 0);const d=ie.get(),g=ie.set();let S=et(0),$=et(0);Pe(()=>{t(s)&&v(t(s),t(c),d)});const v=(O,R,N)=>{const{x:X,y:W,width:k,height:U}=O.getBoundingClientRect();g.width=k,g.height=U;const A=Ye({base_x:X-t(S),base_y:W-t($),width:k,height:U,parent_width:N.width,layout_width:R.width,layout_height:R.height});L(S,A.x),L($,A.y)};let u=null;on(()=>{u!==null&&clearTimeout(u)});var _=An();let y;var p=i(_);let r;var f=i(p),P=i(f),B=i(P);Dt(B,()=>n.icon??ge),a(P);var G=e(P,2),j=i(G);Dt(j,()=>n.children),a(G),a(f),b(2),a(p);var F=e(p,2);{var q=O=>{var R=On();let N;var X=i(R);Dt(X,()=>n.menu),a(R),oe(R,W=>L(s,W),()=>t(s)),lt(()=>N=re(R,"",N,{transform:`translate3d(${t(S)??""}px, ${t($)??""}px, 0)`,"max-height":`${t(c).height??""}px`})),o(O,R)};nt(F,O=>{t(l)&&O(q)})}a(_),lt(()=>{y=re(_,"",y,{"--contextmenu_depth":x.depth}),r=it(p,1,"menuitem plain selectable",null,r,{selected:t(l)}),ye(p,"aria-expanded",t(l))}),Tt("mouseenter",p,O=>{zt(O),u!==null&&clearTimeout(u),u=setTimeout(()=>{u=null,t(T).select(x)})}),o(h,_),dt()}var zn=w("<!> <!>",1);function Gt(h,n){ct(n,!0);const m=rt(n,"name",3,"Cat"),T=rt(n,"icon",3,"😺");Vt(h,{icon:l=>{b();var s=E();lt(()=>ft(s,T())),o(l,s)},menu:l=>{var s=zn(),d=D(s);ot(d,{run:()=>n.act({type:n.position==="adventure"?"cat_go_home":"cat_go_adventure",name:m()}),icon:$=>{var v=gt(),u=D(v);{var _=p=>{var r=E("🏠");o(p,r)},y=p=>{var r=E("🌄");o(p,r)};nt(u,p=>{n.position==="adventure"?p(_):p(y,-1)})}o($,v)},children:($,v)=>{var u=gt(),_=D(u);{var y=r=>{var f=E("go home");o(r,f)},p=r=>{var f=E("go adventure");o(r,f)};nt(_,r=>{n.position==="adventure"?r(y):r(p,-1)})}o($,u)},$$slots:{icon:!0,default:!0}});var g=e(d,2);ot(g,{run:()=>n.act({type:"cat_be_or_do",name:m(),position:n.position}),icon:$=>{var v=gt(),u=D(v);{var _=p=>{var r=E("🌄");o(p,r)},y=p=>{var r=E("🏠");o(p,r)};nt(u,p=>{n.position==="adventure"?p(_):p(y,-1)})}o($,v)},children:($,v)=>{var u=gt(),_=D(u);{var y=r=>{var f=E("do adventure");o(r,f)},p=r=>{var f=E("be home");o(r,f)};nt(_,r=>{n.position==="adventure"?r(y):r(p,-1)})}o($,u)},$$slots:{icon:!0,default:!0}}),o(l,s)},children:(l,s)=>{b();var d=E();lt(()=>ft(d,m())),o(l,d)},$$slots:{icon:!0,menu:!0,default:!0}}),dt()}var Dn=w("<!> <!> <!>",1);function Nn(h,n){var m=Dn(),T=D(m);Ze(T,{href:"https://github.com/fuzdev/fuz_ui",icon:s=>{me(s,{get data(){return an},size:"var(--icon_size_xs)"})},children:(s,d)=>{b();var g=E("Source code");o(s,g)},$$slots:{icon:!0,default:!0}});var x=e(T,2);ne(x,{});var c=e(x,2);ot(c,{get run(){return n.toggle_about_dialog},icon:s=>{me(s,{get data(){return sn},size:"var(--icon_size_xs)"})},children:(s,d)=>{b();var g=E("About");o(s,g)},$$slots:{icon:!0,default:!0}}),o(h,m)}const Te=h=>{const n=h.length;if(n===2)return"cats";if(n===0)return null;const m=h[0];return m.icon+m.name};var _e=w("<!> <!>",1),Fn=w("<!> <!> <!>",1);function Rn(h,n){ct(n,!0);const m=z(()=>Te(n.adventure_cats));Vt(h,{icon:c=>{b();var l=E("🏠");o(c,l)},menu:c=>{var l=Fn(),s=D(l);{var d=v=>{var u=_e(),_=D(u);ot(_,{run:()=>n.act({type:"call_cats_home"}),icon:f=>{b();var P=E("🐈‍⬛");o(f,P)},children:(f,P)=>{b();var B=E("call");o(f,B)},$$slots:{icon:!0,default:!0}});var y=e(_,2);{var p=r=>{ne(r,{})};nt(y,r=>{n.home_cats.length>0&&r(p)})}o(v,u)};nt(s,v=>{t(m)&&v(d)})}var g=e(s,2);Wt(g,17,()=>n.home_cats,v=>v.name,(v,u)=>{Gt(v,{get name(){return t(u).name},get icon(){return t(u).icon},get position(){return t(u).position},get act(){return n.act}})});var S=e(g,2);{var $=v=>{var u=_e(),_=D(u);ot(_,{run:()=>n.act({type:"cat_be_or_do",name:null,position:"home"}),icon:r=>{b();var f=E("🏠");o(r,f)},children:(r,f)=>{b();var P=E("be");o(r,P)},$$slots:{icon:!0,default:!0}});var y=e(_,2);ot(y,{run:()=>n.act({type:"call_cats_adventure"}),icon:r=>{b();var f=E("🦋");o(r,f)},children:(r,f)=>{b();var P=E("leave");o(r,P)},$$slots:{icon:!0,default:!0}}),o(v,u)};nt(S,v=>{t(m)||v($)})}o(c,l)},children:(c,l)=>{b();var s=E("home");o(c,s)},$$slots:{icon:!0,menu:!0,default:!0}}),dt()}var pe=w("<!> <!>",1),Ln=w("<!> <!> <!>",1);function qn(h,n){ct(n,!0);const m=z(()=>Te(n.home_cats));Vt(h,{icon:c=>{b();var l=E("🌄");o(c,l)},menu:c=>{var l=Ln(),s=D(l);{var d=v=>{var u=pe(),_=D(u);ot(_,{run:()=>n.act({type:"call_cats_adventure"}),icon:f=>{b();var P=E("🦋");o(f,P)},children:(f,P)=>{b();var B=E("call");o(f,B)},$$slots:{icon:!0,default:!0}});var y=e(_,2);{var p=r=>{ne(r,{})};nt(y,r=>{n.adventure_cats.length>0&&r(p)})}o(v,u)};nt(s,v=>{t(m)&&v(d)})}var g=e(s,2);Wt(g,17,()=>n.adventure_cats,v=>v.name,(v,u)=>{Gt(v,{get name(){return t(u).name},get icon(){return t(u).icon},get position(){return t(u).position},get act(){return n.act}})});var S=e(g,2);{var $=v=>{var u=pe(),_=D(u);ot(_,{run:()=>n.act({type:"cat_be_or_do",name:null,position:"adventure"}),icon:r=>{b();var f=E("🌄");o(r,f)},children:(r,f)=>{b();var P=E("do");o(r,P)},$$slots:{icon:!0,default:!0}});var y=e(_,2);ot(y,{run:()=>n.act({type:"call_cats_home"}),icon:r=>{b();var f=E("🐈‍⬛");o(r,f)},children:(r,f)=>{b();var P=E("leave");o(r,P)},$$slots:{icon:!0,default:!0}}),o(v,u)};nt(S,v=>{t(m)||v($)})}o(c,l)},children:(c,l)=>{b();var s=E("adventure");o(c,s)},$$slots:{icon:!0,menu:!0,default:!0}}),dt()}var Un=w('<span class="cat svelte-1py4cgo"><span class="icon svelte-1py4cgo"> </span><span class="name svelte-1py4cgo"><!> </span></span>');function he(h,n){const m=rt(n,"name",3,"Cat"),T=rt(n,"icon",3,"😺");var x=Un(),c=i(x),l=i(c,!0);a(c);var s=e(c),d=i(s);Dt(d,()=>n.children??ge);var g=e(d,1,!0);a(s),a(x),lt(()=>{ft(l,T()),ft(g,m())}),o(h,x)}const Mn=`<script lang="ts">
	import {flip} from 'svelte/animate';
	import {crossfade} from 'svelte/transition';
	import {quintOut} from 'svelte/easing';
	import {SvelteSet} from 'svelte/reactivity';
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import Contextmenu from '$lib/Contextmenu.svelte';
	import Details from '$lib/Details.svelte';
	import GithubLink from '$lib/GithubLink.svelte';
	import ContextmenuTextEntry from '$lib/ContextmenuTextEntry.svelte';
	import CatContextmenu from '$routes/docs/Contextmenu/CatContextmenu.svelte';
	import AppContextmenu from '$routes/docs/Contextmenu/AppContextmenu.svelte';
	import HomeContextmenu from '$routes/docs/Contextmenu/HomeContextmenu.svelte';
	import AdventureContextmenu from '$routes/docs/Contextmenu/AdventureContextmenu.svelte';
	import CatView from '$routes/docs/Contextmenu/CatView.svelte';
	import type {Cat, CatPosition, HistoryItem} from '$routes/docs/Contextmenu/helpers.js';
	import ColorSchemeInput from '$lib/ColorSchemeInput.svelte';
	import ThemeInput from '$lib/ThemeInput.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import DialogContent from '$lib/DialogContent.svelte';
	import file_contents from '$routes/docs/Contextmenu/ExampleFull.svelte?raw';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import {selected_contextmenu_root_component_context} from '$routes/docs/Contextmenu/selected_root_component.svelte.js';

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
`;var Jt=w("<!> <!>",1),fe=w('<div class="cat-wrapper svelte-177dlvm"><div><!></div></div>'),Hn=w('<div class="position home svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>'),Bn=w('<div class="position adventure svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>'),Xn=w('<section class="display:flex svelte-177dlvm"><div class="svelte-177dlvm"><!> <!></div></section> <section class="svelte-177dlvm"><!></section>',1),Wn=w('<h1 class="svelte-177dlvm">About Fuz</h1> <blockquote class="svelte-177dlvm">Svelte UI library</blockquote> <blockquote class="svelte-177dlvm">free and open source at<br class="svelte-177dlvm"/><!></blockquote> <code class="display:block p_md mb_lg svelte-177dlvm">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui" class="svelte-177dlvm">@fuzdev/fuz_ui</a></code> <div class="p_xl box svelte-177dlvm"><h2 class="svelte-177dlvm">Color scheme</h2> <!> <h2 class="svelte-177dlvm">Theme</h2> <!></div>',1);function Gn(h,n){ct(n,!0);const m=Et.get(),T=z(()=>m.component),x="Alyssa",c="Ben",l="home";let s=et(l),d=et(l);const g=z(()=>t(s)===t(d)?"😺":"😾"),S=z(()=>t(s)===t(d)?"😸":"😿"),$=z(()=>({name:x,icon:t(g),position:t(s)})),v=z(()=>({name:c,icon:t(S),position:t(d)}));let u=et(!1);const _=new en,y=(k,U)=>{const A=[],K=[];for(const I of k){const Z=I.position==="home"?A:K;U?Z.unshift(I):Z.push(I)}return{home_cats:A,adventure_cats:K}},p=z(()=>y([t($),t(v)],t(u))),r=z(()=>t(p).home_cats),f=z(()=>t(p).adventure_cats),P=z(()=>t(s)!==l||t(d)!==l),B=()=>{L(s,l),L(d,l)};let G=et(!1);const j=()=>{L(G,!t(G))},F=k=>{switch(k.type){case"call_cats_adventure":{L(s,"adventure"),L(d,"adventure");break}case"call_cats_home":{L(s,"home"),L(d,"home");break}case"cat_go_adventure":{k.name===x?L(s,"adventure"):k.name===c&&L(d,"adventure");break}case"cat_go_home":{k.name===x?L(s,"home"):k.name===c&&L(d,"home");break}case"cat_be_or_do":{const U=k.position==="home"?t(r):t(f);if(U.length>1)L(u,!t(u));else for(const A of U)_.add(A.name);break}}},[q,O]=Qe({fallback:(k,U)=>{const A=window.getComputedStyle(k),K=A.transform==="none"?"":A.transform;return{duration:1500,easing:In,css:I=>`
					transform: ${K} scale(${I});
					opacity: ${I}
				`}}});var R=Jt(),N=D(R);Ft(N,()=>t(T),(k,U)=>{U(k,{scoped:!0,children:(A,K)=>{Pt(A,{children:(I,Z)=>{var Q=Jt(),C=D(Q);It(C,{text:"Full example"});var M=e(C,2);$t(M,{entries:J=>{var at=Jt(),ut=D(at);{var H=tt=>{Ke(tt,{run:B,content:"Reset",icon:"↻"})};nt(ut,tt=>{t(P)&&tt(H)})}var Y=e(ut,2);Nn(Y,{toggle_about_dialog:j}),o(J,at)},children:(J,at)=>{var ut=Xn(),H=D(ut),Y=i(H),tt=i(Y);$t(tt,{entries:pt=>{Rn(pt,{act:F,get home_cats(){return t(r)},get adventure_cats(){return t(f)}})},children:(pt,bt)=>{var wt=Hn(),yt=e(i(wt),2);Wt(yt,29,()=>t(r),({name:Ct,icon:mt,position:st})=>Ct,(Ct,mt)=>{let st=()=>t(mt).name,vt=()=>t(mt).icon,Yt=()=>t(mt).position;var ht=fe(),kt=i(ht);let qt;var Zt=i(kt);$t(Zt,{entries:At=>{Gt(At,{act:F,get name(){return st()},get icon(){return vt()},get position(){return Yt()}})},children:(At,Se)=>{he(At,{get name(){return st()},get icon(){return vt()}})},$$slots:{entries:!0,default:!0}}),a(kt),a(ht),lt(Ut=>qt=it(kt,1,"svelte-177dlvm",null,qt,Ut),[()=>({shaking:_.has(st())})]),Tt("animationend",kt,()=>_.delete(st())),Ht(1,ht,()=>O,()=>({key:st()})),Ht(2,ht,()=>q,()=>({key:st()})),se(ht,()=>ve,null),o(Ct,ht)}),a(yt),a(wt),o(pt,wt)},$$slots:{entries:!0,default:!0}});var _t=e(tt,2);$t(_t,{entries:pt=>{qn(pt,{act:F,get home_cats(){return t(r)},get adventure_cats(){return t(f)}})},children:(pt,bt)=>{var wt=Bn(),yt=e(i(wt),2);Wt(yt,29,()=>t(f),({name:Ct,icon:mt,position:st})=>Ct,(Ct,mt)=>{let st=()=>t(mt).name,vt=()=>t(mt).icon,Yt=()=>t(mt).position;var ht=fe(),kt=i(ht);let qt;var Zt=i(kt);$t(Zt,{entries:At=>{Gt(At,{act:F,get name(){return st()},get icon(){return vt()},get position(){return Yt()}})},children:(At,Se)=>{he(At,{get name(){return st()},get icon(){return vt()}})},$$slots:{entries:!0,default:!0}}),a(kt),a(ht),lt(Ut=>qt=it(kt,1,"svelte-177dlvm",null,qt,Ut),[()=>({shaking:_.has(st())})]),Tt("animationend",kt,()=>_.delete(st())),Ht(1,ht,()=>O,()=>({key:st()})),Ht(2,ht,()=>q,()=>({key:st()})),se(ht,()=>ve,null),o(Ct,ht)}),a(yt),a(wt),o(pt,wt)},$$slots:{entries:!0,default:!0}}),a(Y),a(H);var Ot=e(H,2),Rt=i(Ot);Ce(Rt,{summary:pt=>{b();var bt=E("View example source");o(pt,bt)},children:(pt,bt)=>{Nt(pt,{get content(){return Mn}})},$$slots:{summary:!0,default:!0}}),a(Ot),o(J,ut)},$$slots:{entries:!0,default:!0}}),o(I,Q)},$$slots:{default:!0}})},$$slots:{default:!0}})});var X=e(N,2);{var W=k=>{cn(k,{onclose:()=>L(G,!1),children:(U,A)=>{dn(U,{children:(K,I)=>{var Z=Wn(),Q=e(D(Z),4),C=e(i(Q),2);nn(C,{path:"fuzdev/fuz_ui"}),a(Q);var M=e(Q,4),V=e(i(M),2);rn(V,{});var J=e(V,4);ln(J,{}),a(M),o(K,Z)},$$slots:{default:!0}})},$$slots:{default:!0}})};nt(X,k=>{t(G)&&k(W)})}o(h,R),dt()}var jn=w("<!> <!> <!>",1),Vn=w(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific element
					instead of the entire page.</aside></div>`),Yn=w("<!> <!>",1);function Zn(h,n){ct(n,!0);const m=Et.get(),T=z(()=>m.component),x=z(()=>m.name);let c=et(!1),l=et(!1),s=et(!1);var d=gt(),g=D(d);Ft(g,()=>t(T),(S,$)=>{$(S,{scoped:!0,children:(v,u)=>{Pt(v,{children:(_,y)=>{var p=Yn(),r=D(p);It(r,{text:"Basic usage"});var f=e(r,2);$t(f,{entries:B=>{var G=jn(),j=D(G);ot(j,{run:()=>{L(c,!t(c))},children:(O,R)=>{b();var N=E("Hello world");o(O,N)},$$slots:{default:!0}});var F=e(j,2);ot(F,{run:()=>{L(l,!t(l))},icon:R=>{b();var N=E("🌞");o(R,N)},children:(R,N)=>{b();var X=E("Hello with an optional icon snippet");o(R,X)},$$slots:{icon:!0,default:!0}});var q=e(F,2);ot(q,{run:()=>{L(s,!t(s))},icon:"🌚",children:(O,R)=>{b();var N=E("Hello with an optional icon string");o(O,N)},$$slots:{default:!0}}),o(B,G)},children:(B,G)=>{var j=Vn(),F=e(i(j),2);{let Q=z(()=>`<${t(x)} scoped>
  <Contextmenu>
    {#snippet entries()}
      <ContextmenuEntry run={() => (greeted = !greeted)}>
        Hello world <!-- ${t(c)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_snippet = !greeted_icon_snippet)}>
        {#snippet icon()}🌞{/snippet}
        Hello with an optional icon snippet <!-- ${t(l)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_string = !greeted_icon_string)} icon="🌚">
        Hello with an optional icon string <!-- ${t(s)} -->
      </ContextmenuEntry>
    {/snippet}
    ...markup with the above contextmenu behavior...
  </Contextmenu>
  ...markup with only default contextmenu behavior...
</${t(x)}>
...markup without contextmenu behavior...`);Nt(F,{get content(){return t(Q)}})}var q=e(F,2),O=i(q);let R;var N=i(O);a(O),a(q);var X=e(q,2),W=i(X);let k;var U=i(W);a(W),a(X);var A=e(X,2),K=i(A);let I;var Z=i(K);a(K),a(A),b(2),a(j),lt(()=>{R=it(O,1,"",null,R,{color_g_5:t(c)}),ft(N,`greeted = ${t(c)??""}`),k=it(W,1,"",null,k,{color_e_5:t(l)}),ft(U,`greeted_icon_snippet = ${t(l)??""}`),I=it(K,1,"",null,I,{color_d_5:t(s)}),ft(Z,`greeted_icon_string = ${t(s)??""}`)}),o(B,j)},$$slots:{entries:!0,default:!0}}),o(_,p)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(h,d),dt()}var Kn=new Set(["$$slots","$$events","$$legacy","glyph","size"]),Jn=w("<span> </span>");function Mt(h,n){ct(n,!0);const m=$e(n,Kn),T="var(--font_size, 1em)",x="var(--font_size, inherit)",c=z(()=>n.size??T);var l=Jn();xe(l,()=>({...m,class:`glyph display:inline-block text-align:center line-height:1 white-space:nowrap font-weight:400 ${n.class??""}`,[be]:{width:t(c),height:t(c),"min-width":t(c),"min-height":t(c),"font-size":n.size??x}}));var s=i(l,!0);a(l),lt(()=>ft(s,n.glyph)),o(h,l),dt()}var Qn=w('<span class="color_f_50">option f</span>'),to=w('<span class="color_g_50">option g</span>'),eo=w('<span class="color_j_50">option j</span>'),no=w("<!> <!> <!> <!>",1),oo=w('<li class="color_error">Error: <code> </code></li>'),ao=w('<div class="display:flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>'),so=w(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and control
					it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing you to select multiple colors using the activate
					button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),ro=w("<!> <!>",1);function io(h,n){ct(n,!0);const m=Et.get(),T=z(()=>m.component),x=z(()=>m.name),c=new jt;let l=et(void 0);const s=z(()=>t(l)?`color_${t(l)}_5`:void 0),d=z(()=>t(l)?`color_${t(l)}`:void 0);var g=gt(),S=D(g);Ft(S,()=>t(T),($,v)=>{v($,{get contextmenu(){return c},scoped:!0,children:(u,_)=>{Pt(u,{children:(y,p)=>{var r=ro(),f=D(r);It(f,{text:"Custom instance"});var P=e(f,2);$t(P,{entries:G=>{Vt(G,{icon:q=>{b();var O=E("🎨");o(q,O)},menu:q=>{var O=no(),R=D(O);ot(R,{run:()=>(L(l,"f"),{ok:!0,close:!1}),children:(k,U)=>{var A=Qn();o(k,A)},$$slots:{default:!0}});var N=e(R,2);ot(N,{run:()=>(L(l,"g"),{ok:!0,close:!1}),children:(k,U)=>{var A=to();o(k,A)},$$slots:{default:!0}});var X=e(N,2);ot(X,{run:()=>(L(l,"j"),{ok:!0,close:!1}),children:(k,U)=>{var A=eo();o(k,A)},$$slots:{default:!0}});var W=e(X,2);ot(W,{run:()=>(c.close(),{ok:!0}),children:(k,U)=>{b();var A=E("close contextmenu");o(k,A)},$$slots:{default:!0}}),o(q,O)},children:(q,O)=>{b();var R=E("select color");o(q,R)},$$slots:{icon:!0,menu:!0,default:!0}})},children:(G,j)=>{var F=so(),q=i(F),O=e(i(q)),R=i(O,!0);a(O),b(5),a(q);var N=e(q,2);Nt(N,{lang:"ts",dangerous_raw_html:'<span class="token_keyword">const</span> contextmenu <span class="token_operator">=</span> <span class="token_keyword">new</span> <span class="token_class_name"><span class="token_capitalized_identifier token_class_name">ContextmenuState</span></span><span class="token_punctuation">(</span><span class="token_punctuation">)</span><span class="token_punctuation">;</span>'});var X=e(N,2);{let H=z(()=>`<${t(x)} {contextmenu} scoped>...</${t(x)}>`);Nt(X,{get content(){return t(H)}})}var W=e(X,2),k=e(i(W));k.textContent="{ok: true, close: false}",b(),a(W);var U=e(W,2),A=e(i(U),2),K=i(A),I=e(i(K),2),Z=i(I,!0);a(I),a(K);var Q=e(K,2),C=e(i(Q),2),M=i(C);a(C),a(Q);var V=e(Q,2);{var J=H=>{var Y=oo(),tt=e(i(Y)),_t=i(tt,!0);a(tt),a(Y),lt(()=>ft(_t,c.error)),o(H,Y)};nt(V,H=>{c.error&&H(J)})}a(A),a(U);var at=e(U,2);{var ut=H=>{var Y=ao(),tt=i(Y),_t=i(tt),Ot=i(_t);Mt(Ot,{glyph:"↑"}),a(_t);var Rt=e(_t,2),xt=i(Rt),pt=i(xt);Mt(pt,{glyph:"←"}),a(xt);var bt=e(xt,2),wt=i(bt);Mt(wt,{glyph:"↵"}),a(bt);var yt=e(bt,2),Ct=i(yt);Mt(Ct,{glyph:"→"}),a(yt),a(Rt);var mt=e(Rt,2),st=i(mt);Mt(st,{glyph:"↓"}),a(mt),a(tt),a(Y),lt(()=>{it(_t,1,`border_bottom_left_radius_0 border_bottom_right_radius_0 ${t(d)??""}`),_t.disabled=!c.can_select_sibling,it(xt,1,`border_bottom_right_radius_0 border_top_right_radius_0 ${t(d)??""}`),xt.disabled=!c.can_collapse,it(bt,1,`border-radius:0 ${t(d)??""}`),bt.disabled=!c.can_activate,it(yt,1,`border_bottom_left_radius_0 border_top_left_radius_0 ${t(d)??""}`),yt.disabled=!c.can_expand,it(mt,1,`border_top_left_radius_0 border_top_right_radius_0 ${t(d)??""}`),mt.disabled=!c.can_select_sibling}),Tt("mousedown",_t,vt=>{zt(vt),c.select_previous()},!0),Tt("mousedown",xt,vt=>{zt(vt),c.collapse_selected()},!0),Tt("mousedown",bt,async vt=>{zt(vt),await c.activate_selected()},!0),Tt("mousedown",yt,vt=>{zt(vt),c.expand_selected()},!0),Tt("mousedown",mt,vt=>{zt(vt),c.select_next()},!0),Ht(3,Y,()=>tn),o(H,Y)};nt(at,H=>{c.opened&&H(ut)})}a(F),lt(()=>{ft(R,t(x)),it(U,1,`mb_md ${t(s)??""}`),ft(Z,c.opened),ft(M,`${c.x??""} && contextmenu.y === ${c.y??""}`)}),o(G,F)},$$slots:{entries:!0,default:!0}}),o(y,r)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(h,g),dt()}var lo=w(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the browser's
					default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's default
					contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),co=w("<div><!></div> <!>",1);function uo(h,n){ct(n,!0);const m=Et.get(),T=z(()=>m.component),x=new jt;let c=et(!1),l=et(void 0);const s=()=>{const y=window.getSelection();if(!y||!t(l))return;const p=document.createRange();p.selectNodeContents(t(l)),y.removeAllRanges(),y.addRange(p)};let d=et("");const g="If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.",S=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`,$=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`,v=z(()=>t(d)===g||t(d)===S||t(d)===$);var u=gt(),_=D(u);Ft(_,()=>t(T),(y,p)=>{p(y,{get contextmenu(){return x},scoped:!0,children:(r,f)=>{Pt(r,{children:(P,B)=>{var G=co(),j=D(G);let F;var q=i(j);It(q,{text:"Select text"}),a(j);var O=e(j,2);$t(O,{entries:N=>{ot(N,{run:()=>{L(c,!t(c))},children:(X,W)=>{b();var k=E("Toggle something");o(X,k)},$$slots:{default:!0}})},children:(N,X)=>{var W=lo();let k;var U=i(W),A=e(i(U),2),K=e(i(A));let I;b(),a(A),a(U),oe(U,tt=>L(l,tt),()=>t(l));var Z=e(U,2),Q=i(Z);Lt(Q),a(Z);var C=e(Z,2);let M;var V=e(C,2),J=i(V);Ie(J),a(V);var at=e(V,2),ut=i(at);Bt(ut,{path:"Web/HTML/Global_attributes/contenteditable"}),b(),a(at);var H=e(at,4),Y=e(H,4);b(2),a(W),lt(()=>{k=it(W,1,"panel p_md",null,k,{color_g_5:t(v)}),I=it(K,1,"",null,I,{color_a:t(c)}),M=it(C,1,"",null,M,{color_g_5:t(v)})}),ee("click",K,s),ue(Q,()=>t(d),tt=>L(d,tt)),ue(J,()=>t(d),tt=>L(d,tt)),ce("innerText",H,()=>t(d),tt=>L(d,tt)),ce("innerText",Y,()=>t(d),tt=>L(d,tt)),o(N,W)},$$slots:{entries:!0,default:!0}}),lt(()=>F=it(j,1,"",null,F,{color_d_5:t(v)})),o(P,G)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(h,u),dt()}te(["click"]);var mo=w('<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>'),vo=w('<li>custom "some custom entry" entry</li>'),_o=w('<li>"copy text" entry when text is selected</li>'),po=w("<li>link entry when clicking on a link</li>"),ho=w("<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>",1),fo=w(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing the
			Fuz contextmenu.</p>`),go=w('<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which ensures the Fuz contextmenu is used</label></div> <!>',1);function xo(h,n){ct(n,!0);const m=u=>{var _=mo(),y=i(_),p=e(i(y));let r;b(),a(y),oe(y,B=>L($,B),()=>t($));var f=e(y,2),P=e(i(f));b(),a(f),a(_),lt(B=>{r=it(p,1,"",null,r,{color_h:t(S)}),ye(P,"href",B)},[()=>un("/")]),ee("click",p,v),o(u,_)},T=Et.get(),x=z(()=>T.component),c=z(()=>T.name),l=new jt;let s=et(!1),d=et(!1),g=et(!0),S=et(!1),$=et(void 0);const v=()=>{const u=window.getSelection();if(!u||!t($))return;const _=document.createRange();_.selectNodeContents(t($)),u.removeAllRanges(),u.addRange(_)};Pt(h,{children:(u,_)=>{var y=go(),p=D(y);It(p,{text:"Disable default behaviors"});var r=e(p,4);{let I=z(()=>`<${t(c)}${t(s)?" link_entry={null}":""}${t(d)?" text_entry={null}":""}>`);Nt(r,{get content(){return t(I)}})}var f=e(r,2),P=i(f),B=i(P);Lt(B);var G=e(B,2),j=e(i(G));j.textContent="link_entry={null}",a(G),a(P);var F=e(P,2),q=i(F);Lt(q);var O=e(q,2),R=e(i(O));R.textContent="text_entry={null}",a(O),a(F),a(f);var N=e(f,2);{let I=z(()=>t(s)?null:void 0),Z=z(()=>t(d)?null:void 0);Ft(N,()=>t(x),(Q,C)=>{C(Q,{get contextmenu(){return l},scoped:!0,get link_entry(){return t(I)},get text_entry(){return t(Z)},children:(M,V)=>{var J=gt(),at=D(J);{var ut=Y=>{$t(Y,{entries:_t=>{ot(_t,{icon:">",run:()=>{L(S,!t(S))},children:(Ot,Rt)=>{b();var xt=E("some custom entry");o(Ot,xt)},$$slots:{default:!0}})},children:(_t,Ot)=>{m(_t)},$$slots:{entries:!0,default:!0}})},H=Y=>{m(Y)};nt(at,Y=>{t(g)?Y(ut):Y(H,-1)})}o(M,J)},$$slots:{default:!0}})})}var X=e(N,4),W=i(X),k=i(W);Lt(k),b(),a(W),a(X);var U=e(X,2);{var A=I=>{var Z=ho(),Q=e(D(Z),2),C=i(Q);{var M=H=>{var Y=vo();o(H,Y)};nt(C,H=>{t(g)&&H(M)})}var V=e(C,2);{var J=H=>{var Y=_o();o(H,Y)};nt(V,H=>{t(d)||H(J)})}var at=e(V,2);{var ut=H=>{var Y=po();o(H,Y)};nt(at,H=>{t(s)||H(ut)})}a(Q),o(I,Z)},K=I=>{var Z=fo();o(I,Z)};nt(U,I=>{t(g)||!t(s)||!t(d)?I(A):I(K,-1)})}Kt(B,()=>t(s),I=>L(s,I)),Kt(q,()=>t(d),I=>L(d,I)),Kt(k,()=>t(g),I=>L(g,I)),o(u,y)},$$slots:{default:!0}}),dt()}te(["click"]);var bo=w(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function yo(h,n){ct(n,!0);const m=Et.get(),T=z(()=>m.component),x=z(()=>m.name);var c=gt(),l=D(c);Ft(l,()=>t(T),(s,d)=>{d(s,{scoped:!0,children:(g,S)=>{Pt(g,{children:($,v)=>{var u=bo(),_=D(u);It(_,{text:"Default behaviors"});var y=e(_,2),p=i(y);{let r=z(()=>`<${t(x)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${t(x)}>`);Nt(p,{get content(){return t(r)}})}b(6),a(y),o($,u)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(h,c),dt()}var $o=w("<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>",1);function Qo(h,n){ct(n,!0);const T=Oe("Contextmenu");Et.set(),Ee(h,{get tome(){return T},children:(x,c)=>{var l=$o(),s=D(l);$n(s,{});var d=e(s,2);Zn(d,{});var g=e(d,2);yo(g,{});var S=e(g,2);uo(S,{});var $=e(S,2);xo($,{});var v=e($,2);io(v,{});var u=e(v,2);Gn(u,{});var _=e(u,2);Sn(_),b(2),o(x,l)},$$slots:{default:!0}}),dt()}export{Qo as component};
