import"../chunks/DsnmJJEf.js";import{p as lt,g as $t,a as N,b as o,c as ct,h as Lt,f as y,bx as Tt,by as ae,s as e,l as D,k as et,j as t,b0 as te,u as P,bA as Xt,d as s,r as a,a$ as ee,t as vt,i as Z,n as k,e as ft,ax as Se,at as Pe,bD as Ie}from"../chunks/BjUGcBtz.js";import{T as Ee}from"../chunks/DbJLKAAi.js";import{t as Oe}from"../chunks/CoC6Kc7k.js";import{c as Nt}from"../chunks/DOLCB8w7.js";import{C as Dt}from"../chunks/BMR_bq1y.js";import{M as Bt}from"../chunks/j7eztE0W.js";import{T as Pt,a as It}from"../chunks/CE5LwNH6.js";import{D as St}from"../chunks/Cy2bmOp2.js";import{e as Ae,t as Ht,a as se}from"../chunks/Basby7de.js";import{h as Qt,b as ge,S as xe,r as Rt,a as re,g as it,s as be}from"../chunks/8gdhxqlr.js";import{p as rt,r as ye,i as at}from"../chunks/BppSZfeB.js";import{c as ze,C as jt,a as $e,b as De,d as ie}from"../chunks/CVOT_Ykt.js";import{a as Ne,b as Fe,c as Re,d as Le,e as qe,f as Ue,l as Me,t as He,s as Be,g as Xe,h as We,i as Ge,j as je,k as Ve,C as le,m as nt,n as Ye,o as Ze,p as Ke,q as ne,r as Je}from"../chunks/C4nQk7cx.js";import{D as we,b as ce}from"../chunks/BZ3k8HUP.js";import{a as de,b as ue,c as Kt}from"../chunks/ZvgWJnOa.js";import{c as Qe}from"../chunks/BJ1aVY7m.js";import{s as zt}from"../chunks/V2q5a4YM.js";import{e as Wt}from"../chunks/ukwGoxL4.js";import{c as tn,s as en}from"../chunks/DfIpPbHs.js";import{S as nn}from"../chunks/DdDp7b3K.js";import{G as on}from"../chunks/BIG3DeCd.js";import{o as an}from"../chunks/SjO0nV3W.js";import{b as oe}from"../chunks/HUEqMiw_.js";import{S as me}from"../chunks/DbzEYvrK.js";import{b as sn}from"../chunks/CIZy9vDr.js";import{d as rn}from"../chunks/COpzMoZb.js";import{C as ln,T as cn}from"../chunks/BuJnYqTM.js";import{D as dn,a as un}from"../chunks/C4wGE72h.js";import{r as mn}from"../chunks/DmjO0G1o.js";var vn=new Set(["$$slots","$$events","$$legacy","tag","entries","children"]);function yt(v,n){lt(n,!0);const d=rt(n,"tag",3,"span"),C=ye(n,vn);var _=$t(),r=N(_);Ae(r,d,!1,(i,l)=>{Qt(i,()=>ze(n.entries)),ge(i,()=>({...C,[xe]:{display:"contents"}}));var c=$t(),h=N(c);Lt(h,()=>n.children),o(l,c)}),o(v,_),ct()}var _n=y('<div class="contextmenu-root svelte-1472w04" role="group"><!></div>'),pn=y("<!> <!>",1);function hn(v,n){lt(n,!0);const d=rt(n,"contextmenu",19,()=>new jt),C=rt(n,"longpress_move_tolerance",3,Ne),_=rt(n,"longpress_duration",3,Fe),r=rt(n,"bypass_with_tap_then_longpress",3,!0),i=rt(n,"bypass_window",3,Re),l=rt(n,"bypass_move_tolerance",3,Le),c=rt(n,"open_offset_x",3,qe),h=rt(n,"open_offset_y",3,Ue),w=rt(n,"scoped",3,!1),m=rt(n,"link_entry",3,Me),f=rt(n,"text_entry",3,He),p=rt(n,"separator_entry",3,Be);$e.set(()=>d());let x=et(void 0),b=0,u=0,g=null,F=!1;const G=new Ge,B=new We,X=()=>{document.body.classList.add("contextmenu-pending")},W=()=>{document.body.classList.remove("contextmenu-pending")},I=()=>{F=!1,g!==null&&(clearTimeout(g),g=null),W()},L=()=>{I(),G.reset()},E=P(()=>({open_offset_x:c(),open_offset_y:h(),link_enabled:m()!==null,text_enabled:f()!==null,separator_enabled:p()!==null})),R=$=>{if(!G.consume()){if(F){if(t(x)?.contains($.target))return;L(),zt($);return}je($,d(),t(x),B,t(E))&&L()}},A=$=>{F=!1,B.touchstart();const{touches:q,target:j}=$;if(d().opened||q.length!==1||!Ve(j,$.shiftKey)){L();return}const{clientX:J,clientY:ot}=q[0];r()&&G.track(J,ot,i(),l())||(b=J,u=ot,X(),g!==null&&I(),g=setTimeout(()=>{F=!0,W(),De(j,b+c(),u+h(),d(),t(E))&&B.opened()},_()))},M=$=>{if(g===null||d().opened)return;const{touches:q}=$;if(q.length!==1)return;const{clientX:j,clientY:J}=q[0];if(Math.hypot(j-b,J-u)>C()){I();return}$.preventDefault()},O=$=>{B.touchend($),g!==null&&I(),G.consume()},S=()=>{B.reset(),L()},z=$=>{const q={passive:!0,capture:!0},j={passive:!1,capture:!0},J=Xt($,"touchstart",A,q),ot=Xt($,"touchmove",M,j),dt=Xt($,"touchend",O,j),U=Xt($,"touchcancel",S,q);return()=>{J(),ot(),dt(),U()}};var H=pn();Tt("contextmenu",ae,function(...$){(w()?void 0:R)?.apply(this,$)}),Qt(ae,()=>w()?void 0:z);var K=N(H);{var T=$=>{var q=_n(),j=s(q);Lt(j,()=>n.children),a(q),Qt(q,()=>z),ee("contextmenu",q,R),o($,q)},Y=$=>{var q=$t(),j=N(q);Lt(j,()=>n.children),o($,q)};at(K,$=>{w()?$(T):$(Y,-1)})}var Q=e(K,2);Xe(Q,{get contextmenu(){return d()},get open_guard(){return B},get link_entry(){return m()},get text_entry(){return f()},get separator_entry(){return p()},get el(){return t(x)},set el($){D(x,$)}}),o(v,H),ct()}te(["contextmenu"]);const Et=Qe(()=>new fn("standard"));class fn{#t=et();get variant(){return t(this.#t)}set variant(n){D(this.#t,n)}#e=P(()=>this.variant==="standard"?le:hn);get component(){return t(this.#e)}set component(n){D(this.#e,n)}#n=P(()=>this.component===le?"ContextmenuRoot":"ContextmenuRootForSafariCompatibility");get name(){return t(this.#n)}set name(n){D(this.#n,n)}constructor(n="standard"){this.variant=n}}var gn=y('<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <!></div></label> <label class="row"><input type="radio"/> <div>iOS compat <!></div></label></fieldset>');function Ce(v,n){lt(n,!0);const d=[],C=Et.get();var _=gn(),r=e(s(_),2),i=s(r);Rt(i),i.value=i.__value="standard";var l=e(i,2),c=e(s(l));St(c,{name:"ContextmenuRoot"}),a(l),a(r);var h=e(r,2),w=s(h);Rt(w),w.value=w.__value="compat";var m=e(w,2),f=e(s(m));St(f,{name:"ContextmenuRootForSafariCompatibility"}),a(m),a(h),a(_),de(d,[],i,()=>C.variant,p=>C.variant=p),de(d,[],w,()=>C.variant,p=>C.variant=p),o(v,_),ct()}var xn=y('<p class="panel p_md">alert B -- also inherits A</p>'),bn=y('<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>'),yn=y("<code>navigator.vibrate</code>"),$n=y(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
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
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function wn(v,n){lt(n,!0);const d=Et.get(),C=P(()=>d.component),_=P(()=>d.name);Pt(v,{children:(r,i)=>{var l=$n(),c=N(l);It(c,{text:"Introduction"});var h=e(c,2),w=e(s(h));Bt(w,{path:"Web/API/Element/contextmenu_event"}),k(3),a(h);var m=e(h,2),f=e(s(m));St(f,{name:"ContextmenuRoot"});var p=e(f,2);St(p,{name:"Contextmenu"}),k(),a(m);var x=e(m,2),b=e(s(x)),u=s(b,!0);a(b);var g=e(b,2);St(g,{name:"Contextmenu"});var F=e(g,2);St(F,{name:"Contextmenu"}),k(),a(x);var G=e(x,2);Nt(G,()=>t(C),(A,M)=>{M(A,{scoped:!0,children:(O,S)=>{yt(O,{entries:H=>{nt(H,{run:()=>alert("alert A"),children:(K,T)=>{k();var Y=Z("alert A");o(K,Y)},$$slots:{default:!0}})},children:(H,K)=>{var T=bn(),Y=e(s(T),2);yt(Y,{entries:$=>{nt($,{run:()=>alert("alert B"),children:(q,j)=>{k();var J=Z("alert B");o(q,J)},$$slots:{default:!0}})},children:($,q)=>{var j=xn();o($,j)},$$slots:{entries:!0,default:!0}}),a(T),o(H,T)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var B=e(G,2);we(B,{summary:M=>{k();var O=Z("view code");o(M,O)},children:(M,O)=>{{let S=P(()=>`<${t(_)}>
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
</${t(_)}>`);Dt(M,{get content(){return t(S)}})}},$$slots:{summary:!0,default:!0}});var X=e(B,2),W=e(s(X));St(W,{name:"Contextmenu"}),k(),a(X);var I=e(X,12),L=e(s(I),2),E=e(s(L));Bt(E,{path:"Web/API/Navigator/vibrate",children:(A,M)=>{var O=yn();o(A,O)},$$slots:{default:!0}}),a(L),a(I);var R=e(I,2);Ce(R,{}),vt(()=>ft(u,t(_))),o(r,l)},$$slots:{default:!0}}),ct()}var Cn=y('<span class="font_family_mono">contextmenu</span> event',1),kn=y(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
		Safari not supporting the <code>contextmenu</code> event as of October 2025, see <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a>.</p> <p>Use <!> by default for better performance and haptic feedback.
		Use <!> only if you need iOS Safari support.</p> <h4>ContextmenuRoot</h4> <ul><li>standard, default implementation</li> <li>relies on the browser's <!></li> <li>much simpler, better performance with fewer and less intrusive event handlers, fewer edge
			cases that can go wrong</li> <li>does not work on iOS Safari until <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a> is fixed</li></ul> <h4>ContextmenuRootForSafariCompatibility</h4> <ul><li>opt-in hacky alternative when iOS support is needed</li> <li>implements custom longpress detection to work around iOS Safari's lacking <a href="https://bugs.webkit.org/show_bug.cgi?id=213953"><code>contextmenu</code> event support</a></li> <li>degraded experience because some browsers (including mobile Chrome) block <code>navigator.vibrate</code> haptic feedback due to the timeout-based gesture detection (because it's not a direct user action)</li> <li>works on all devices including iOS Safari</li> <li>more complex implementation with custom touch event handling and gesture detection, may cause
			edge case UX problems on some devices</li> <li>a longpress is cancelled if you move the touch past a threshold before it triggers</li> <li>opt into this version only if you need iOS Safari support</li></ul> <!>`,1),Tn=y(`<!> <p>The Fuz contextmenu provides powerful app-specific UX, but it breaks from normal browser
		behavior by replacing the system contextmenu.</p> <p>To mitigate the downsides:</p> <ul><li>The Fuz contextmenu only replaces the system contextmenu when the DOM tree has defined
			behaviors. Note that <code>a</code> links have default contextmenu behaviors unless disabled. Other
			interactive elements may have default behaviors added in the future.</li> <li>The Fuz contextmenu does not open on elements that allow clipboard pasting like inputs,
			textareas, and contenteditables -- however this may change for better app integration, or be
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),Sn=y("<!> <!>",1);function Pn(v){var n=Sn(),d=N(n);Pt(d,{children:(_,r)=>{var i=kn(),l=N(i);It(l,{text:"iOS compatibility"});var c=e(l,4),h=e(s(c));St(h,{name:"ContextmenuRoot"});var w=e(h,2);St(w,{name:"ContextmenuRootForSafariCompatibility"}),k(),a(c);var m=e(c,4),f=e(s(m),2),p=e(s(f));Bt(p,{path:"Web/API/Element/contextmenu_event",children:(b,u)=>{var g=Cn();k(),o(b,g)},$$slots:{default:!0}}),a(f),k(4),a(m);var x=e(m,6);Ce(x,{}),o(_,i)},$$slots:{default:!0}});var C=e(d,2);Pt(C,{children:(_,r)=>{var i=Tn(),l=N(i);It(l,{text:"Caveats"});var c=e(l,8),h=e(s(c));Bt(h,{path:"Web/API/Element/contextmenu_event"}),k(3),a(c),o(_,i)},$$slots:{default:!0}}),o(v,n)}function In(v){const n=v-1;return n*n*n+1}function En(v){return--v*v*v*v*v+1}function ve(v,{from:n,to:d},C={}){var{delay:_=0,duration:r=W=>Math.sqrt(W)*120,easing:i=In}=C,l=getComputedStyle(v),c=l.transform==="none"?"":l.transform,[h,w]=l.transformOrigin.split(" ").map(parseFloat);h/=v.clientWidth,w/=v.clientHeight;var m=On(v),f=v.clientWidth/d.width/m,p=v.clientHeight/d.height/m,x=n.left+n.width*h,b=n.top+n.height*w,u=d.left+d.width*h,g=d.top+d.height*w,F=(x-u)*f,G=(b-g)*p,B=n.width/d.width,X=n.height/d.height;return{delay:_,duration:typeof r=="function"?r(Math.sqrt(F*F+G*G)):r,easing:i,css:(W,I)=>{var L=I*F,E=I*G,R=W+I*B,A=W+I*X;return`transform: ${c} translate(${L}px, ${E}px) scale(${R}, ${A});`}}}function On(v){if("currentCSSZoom"in v)return v.currentCSSZoom;for(var n=v,d=1;n!==null;)d*=+getComputedStyle(n).zoom,n=n.parentElement;return d}var An=y('<menu class="pane unstyled svelte-6kuqba"><!></menu>'),zn=y('<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-haspopup="menu" tabindex="-1"><div class="content"><div class="icon"><!></div> <div class="title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>');function Vt(v,n){lt(n,!0);const d=$e.get(),C=P(d),_=d().add_submenu(),r=P(()=>t(C).layout),i=P(()=>_.selected);let l=et(void 0);const c=ie.get(),h=ie.set();let w=et(0),m=et(0);Se(()=>{t(l)&&f(t(l),t(r),c)});const f=(E,R,A)=>{const{x:M,y:O,width:S,height:z}=E.getBoundingClientRect();h.width=S,h.height=z;const H=Ze({base_x:M-t(w),base_y:O-t(m),width:S,height:z,parent_width:A.width,layout_width:R.width,layout_height:R.height});D(w,H.x),D(m,H.y)};let p=null;an(()=>{p!==null&&clearTimeout(p)});var x=zn();let b;var u=s(x);let g;var F=s(u),G=s(F),B=s(G);Ye(B,{get icon(){return n.icon}}),a(G);var X=e(G,2),W=s(X);Lt(W,()=>n.children),a(X),a(F),k(2),a(u);var I=e(u,2);{var L=E=>{var R=An();let A;var M=s(R);Lt(M,()=>n.menu),a(R),oe(R,O=>D(l,O),()=>t(l)),vt(()=>A=re(R,"",A,{transform:`translate3d(${t(w)??""}px, ${t(m)??""}px, 0)`,"max-height":`${t(r).height??""}px`})),o(E,R)};at(I,E=>{t(i)&&E(L)})}a(x),vt(()=>{b=re(x,"",b,{"--contextmenu_depth":_.depth}),g=it(u,1,"menuitem plain selectable",null,g,{selected:t(i)}),be(u,"aria-expanded",t(i))}),Tt("mouseenter",u,E=>{zt(E),p!==null&&clearTimeout(p),p=setTimeout(()=>{p=null,t(C).select(_)})}),o(v,x),ct()}var Dn=y("<!> <!>",1);function Gt(v,n){lt(n,!0);const d=rt(n,"name",3,"Cat"),C=rt(n,"icon",3,"😺");Vt(v,{get icon(){return C()},menu:r=>{var i=Dn(),l=N(i);{let h=P(()=>n.position==="adventure"?"🏠":"🌄");nt(l,{run:()=>n.act({type:n.position==="adventure"?"cat_go_home":"cat_go_adventure",name:d()}),get icon(){return t(h)},children:(w,m)=>{var f=$t(),p=N(f);{var x=u=>{var g=Z("go home");o(u,g)},b=u=>{var g=Z("go adventure");o(u,g)};at(p,u=>{n.position==="adventure"?u(x):u(b,-1)})}o(w,f)},$$slots:{default:!0}})}var c=e(l,2);{let h=P(()=>n.position==="adventure"?"🌄":"🏠");nt(c,{run:()=>n.act({type:"cat_be_or_do",name:d(),position:n.position}),get icon(){return t(h)},children:(w,m)=>{var f=$t(),p=N(f);{var x=u=>{var g=Z("do adventure");o(u,g)},b=u=>{var g=Z("be home");o(u,g)};at(p,u=>{n.position==="adventure"?u(x):u(b,-1)})}o(w,f)},$$slots:{default:!0}})}o(r,i)},children:(r,i)=>{k();var l=Z();vt(()=>ft(l,d())),o(r,l)},$$slots:{menu:!0,default:!0}}),ct()}var Nn=y("<!> <!> <!>",1);function Fn(v,n){var d=Nn(),C=N(d);Ke(C,{href:"https://github.com/fuzdev/fuz_ui",icon:l=>{me(l,{get data(){return sn},size:"var(--icon_size_xs)"})},children:(l,c)=>{k();var h=Z("Source code");o(l,h)},$$slots:{icon:!0,default:!0}});var _=e(C,2);ne(_,{});var r=e(_,2);nt(r,{get run(){return n.toggle_about_dialog},icon:l=>{me(l,{get data(){return rn},size:"var(--icon_size_xs)"})},children:(l,c)=>{k();var h=Z("About");o(l,h)},$$slots:{icon:!0,default:!0}}),o(v,d)}const ke=v=>{const n=v.length;if(n===2)return"cats";if(n===0)return null;const d=v[0];return d.icon+d.name};var _e=y("<!> <!>",1),Rn=y("<!> <!> <!>",1);function Ln(v,n){lt(n,!0);const d=P(()=>ke(n.adventure_cats));Vt(v,{icon:"🏠",menu:_=>{var r=Rn(),i=N(r);{var l=m=>{var f=_e(),p=N(f);nt(p,{run:()=>n.act({type:"call_cats_home"}),icon:"🐈‍⬛",children:(u,g)=>{k();var F=Z("call");o(u,F)},$$slots:{default:!0}});var x=e(p,2);{var b=u=>{ne(u,{})};at(x,u=>{n.home_cats.length>0&&u(b)})}o(m,f)};at(i,m=>{t(d)&&m(l)})}var c=e(i,2);Wt(c,17,()=>n.home_cats,m=>m.name,(m,f)=>{Gt(m,{get name(){return t(f).name},get icon(){return t(f).icon},get position(){return t(f).position},get act(){return n.act}})});var h=e(c,2);{var w=m=>{var f=_e(),p=N(f);nt(p,{run:()=>n.act({type:"cat_be_or_do",name:null,position:"home"}),icon:"🏠",children:(b,u)=>{k();var g=Z("be");o(b,g)},$$slots:{default:!0}});var x=e(p,2);nt(x,{run:()=>n.act({type:"call_cats_adventure"}),icon:"🦋",children:(b,u)=>{k();var g=Z("leave");o(b,g)},$$slots:{default:!0}}),o(m,f)};at(h,m=>{t(d)||m(w)})}o(_,r)},children:(_,r)=>{k();var i=Z("home");o(_,i)},$$slots:{menu:!0,default:!0}}),ct()}var pe=y("<!> <!>",1),qn=y("<!> <!> <!>",1);function Un(v,n){lt(n,!0);const d=P(()=>ke(n.home_cats));Vt(v,{icon:"🌄",menu:_=>{var r=qn(),i=N(r);{var l=m=>{var f=pe(),p=N(f);nt(p,{run:()=>n.act({type:"call_cats_adventure"}),icon:"🦋",children:(u,g)=>{k();var F=Z("call");o(u,F)},$$slots:{default:!0}});var x=e(p,2);{var b=u=>{ne(u,{})};at(x,u=>{n.adventure_cats.length>0&&u(b)})}o(m,f)};at(i,m=>{t(d)&&m(l)})}var c=e(i,2);Wt(c,17,()=>n.adventure_cats,m=>m.name,(m,f)=>{Gt(m,{get name(){return t(f).name},get icon(){return t(f).icon},get position(){return t(f).position},get act(){return n.act}})});var h=e(c,2);{var w=m=>{var f=pe(),p=N(f);nt(p,{run:()=>n.act({type:"cat_be_or_do",name:null,position:"adventure"}),icon:"🌄",children:(b,u)=>{k();var g=Z("do");o(b,g)},$$slots:{default:!0}});var x=e(p,2);nt(x,{run:()=>n.act({type:"call_cats_home"}),icon:"🐈‍⬛",children:(b,u)=>{k();var g=Z("leave");o(b,g)},$$slots:{default:!0}}),o(m,f)};at(h,m=>{t(d)||m(w)})}o(_,r)},children:(_,r)=>{k();var i=Z("adventure");o(_,i)},$$slots:{menu:!0,default:!0}}),ct()}var Mn=y('<span class="cat svelte-1py4cgo"><span class="icon svelte-1py4cgo"> </span><span class="name svelte-1py4cgo"><!> </span></span>');function he(v,n){const d=rt(n,"name",3,"Cat"),C=rt(n,"icon",3,"😺");var _=Mn(),r=s(_),i=s(r,!0);a(r);var l=e(r),c=s(l);Lt(c,()=>n.children??Pe);var h=e(c,1,!0);a(l),a(_),vt(()=>{ft(i,C()),ft(h,d())}),o(v,_)}const Hn=`<script lang="ts">
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
`;var Jt=y("<!> <!>",1),fe=y('<div class="cat-wrapper svelte-177dlvm"><div><!></div></div>'),Bn=y('<div class="position home svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>'),Xn=y('<div class="position adventure svelte-177dlvm"><div class="icon p_md svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>'),Wn=y('<section class="display:flex svelte-177dlvm"><div class="svelte-177dlvm"><!> <!></div></section> <section class="svelte-177dlvm"><!></section>',1),Gn=y('<h1 class="svelte-177dlvm">About Fuz</h1> <blockquote class="svelte-177dlvm">Svelte UI library</blockquote> <blockquote class="svelte-177dlvm">free and open source at<br class="svelte-177dlvm"/><!></blockquote> <code class="display:block p_md mb_lg svelte-177dlvm">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui" class="svelte-177dlvm">@fuzdev/fuz_ui</a></code> <div class="p_xl box svelte-177dlvm"><h2 class="svelte-177dlvm">Color scheme</h2> <!> <h2 class="svelte-177dlvm">Theme</h2> <!></div>',1);function jn(v,n){lt(n,!0);const d=Et.get(),C=P(()=>d.component),_="Alyssa",r="Ben",i="home";let l=et(i),c=et(i);const h=P(()=>t(l)===t(c)?"😺":"😾"),w=P(()=>t(l)===t(c)?"😸":"😿"),m=P(()=>({name:_,icon:t(h),position:t(l)})),f=P(()=>({name:r,icon:t(w),position:t(c)}));let p=et(!1);const x=new nn,b=(S,z)=>{const H=[],K=[];for(const T of S){const Y=T.position==="home"?H:K;z?Y.unshift(T):Y.push(T)}return{home_cats:H,adventure_cats:K}},u=P(()=>b([t(m),t(f)],t(p))),g=P(()=>t(u).home_cats),F=P(()=>t(u).adventure_cats),G=P(()=>t(l)!==i||t(c)!==i),B=()=>{D(l,i),D(c,i)};let X=et(!1);const W=()=>{D(X,!t(X))},I=S=>{switch(S.type){case"call_cats_adventure":{D(l,"adventure"),D(c,"adventure");break}case"call_cats_home":{D(l,"home"),D(c,"home");break}case"cat_go_adventure":{S.name===_?D(l,"adventure"):S.name===r&&D(c,"adventure");break}case"cat_go_home":{S.name===_?D(l,"home"):S.name===r&&D(c,"home");break}case"cat_be_or_do":{const z=S.position==="home"?t(g):t(F);if(z.length>1)D(p,!t(p));else for(const H of z)x.add(H.name);break}}},[L,E]=tn({fallback:(S,z)=>{const H=window.getComputedStyle(S),K=H.transform==="none"?"":H.transform;return{duration:1500,easing:En,css:T=>`
					transform: ${K} scale(${T});
					opacity: ${T}
				`}}});var R=Jt(),A=N(R);Nt(A,()=>t(C),(S,z)=>{z(S,{scoped:!0,children:(H,K)=>{Pt(H,{children:(T,Y)=>{var Q=Jt(),$=N(Q);It($,{text:"Full example"});var q=e($,2);yt(q,{entries:J=>{var ot=Jt(),dt=N(ot);{var U=tt=>{Je(tt,{run:B,content:"Reset",icon:"↻"})};at(dt,tt=>{t(G)&&tt(U)})}var V=e(dt,2);Fn(V,{toggle_about_dialog:W}),o(J,ot)},children:(J,ot)=>{var dt=Wn(),U=N(dt),V=s(U),tt=s(V);yt(tt,{entries:pt=>{Ln(pt,{act:I,get home_cats(){return t(g)},get adventure_cats(){return t(F)}})},children:(pt,xt)=>{var wt=Bn(),bt=e(s(wt),2);Wt(bt,29,()=>t(g),({name:Ct,icon:ut,position:st})=>Ct,(Ct,ut)=>{let st=()=>t(ut).name,mt=()=>t(ut).icon,Yt=()=>t(ut).position;var ht=fe(),kt=s(ht);let qt;var Zt=s(kt);yt(Zt,{entries:At=>{Gt(At,{act:I,get name(){return st()},get icon(){return mt()},get position(){return Yt()}})},children:(At,Te)=>{he(At,{get name(){return st()},get icon(){return mt()}})},$$slots:{entries:!0,default:!0}}),a(kt),a(ht),vt(Ut=>qt=it(kt,1,"svelte-177dlvm",null,qt,Ut),[()=>({shaking:x.has(st())})]),Tt("animationend",kt,()=>x.delete(st())),Ht(1,ht,()=>E,()=>({key:st()})),Ht(2,ht,()=>L,()=>({key:st()})),se(ht,()=>ve,null),o(Ct,ht)}),a(bt),a(wt),o(pt,wt)},$$slots:{entries:!0,default:!0}});var _t=e(tt,2);yt(_t,{entries:pt=>{Un(pt,{act:I,get home_cats(){return t(g)},get adventure_cats(){return t(F)}})},children:(pt,xt)=>{var wt=Xn(),bt=e(s(wt),2);Wt(bt,29,()=>t(F),({name:Ct,icon:ut,position:st})=>Ct,(Ct,ut)=>{let st=()=>t(ut).name,mt=()=>t(ut).icon,Yt=()=>t(ut).position;var ht=fe(),kt=s(ht);let qt;var Zt=s(kt);yt(Zt,{entries:At=>{Gt(At,{act:I,get name(){return st()},get icon(){return mt()},get position(){return Yt()}})},children:(At,Te)=>{he(At,{get name(){return st()},get icon(){return mt()}})},$$slots:{entries:!0,default:!0}}),a(kt),a(ht),vt(Ut=>qt=it(kt,1,"svelte-177dlvm",null,qt,Ut),[()=>({shaking:x.has(st())})]),Tt("animationend",kt,()=>x.delete(st())),Ht(1,ht,()=>E,()=>({key:st()})),Ht(2,ht,()=>L,()=>({key:st()})),se(ht,()=>ve,null),o(Ct,ht)}),a(bt),a(wt),o(pt,wt)},$$slots:{entries:!0,default:!0}}),a(V),a(U);var Ot=e(U,2),Ft=s(Ot);we(Ft,{summary:pt=>{k();var xt=Z("View example source");o(pt,xt)},children:(pt,xt)=>{Dt(pt,{get content(){return Hn}})},$$slots:{summary:!0,default:!0}}),a(Ot),o(J,dt)},$$slots:{entries:!0,default:!0}}),o(T,Q)},$$slots:{default:!0}})},$$slots:{default:!0}})});var M=e(A,2);{var O=S=>{dn(S,{onclose:()=>D(X,!1),children:(z,H)=>{un(z,{children:(K,T)=>{var Y=Gn(),Q=e(N(Y),4),$=e(s(Q),2);on($,{path:"fuzdev/fuz_ui"}),a(Q);var q=e(Q,4),j=e(s(q),2);ln(j,{});var J=e(j,4);cn(J,{}),a(q),o(K,Y)},$$slots:{default:!0}})},$$slots:{default:!0}})};at(M,S=>{t(X)&&S(O)})}o(v,R),ct()}var Vn=y("<!> <!> <!>",1),Yn=y(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific element
					instead of the entire page.</aside></div>`),Zn=y("<!> <!>",1);function Kn(v,n){lt(n,!0);const d=Et.get(),C=P(()=>d.component),_=P(()=>d.name);let r=et(!1),i=et(!1),l=et(!1);var c=$t(),h=N(c);Nt(h,()=>t(C),(w,m)=>{m(w,{scoped:!0,children:(f,p)=>{Pt(f,{children:(x,b)=>{var u=Zn(),g=N(u);It(g,{text:"Basic usage"});var F=e(g,2);yt(F,{entries:B=>{var X=Vn(),W=N(X);nt(W,{run:()=>{D(r,!t(r))},children:(E,R)=>{k();var A=Z("Hello world");o(E,A)},$$slots:{default:!0}});var I=e(W,2);nt(I,{run:()=>{D(i,!t(i))},icon:R=>{k();var A=Z("🌞");o(R,A)},children:(R,A)=>{k();var M=Z("Hello with an optional icon snippet");o(R,M)},$$slots:{icon:!0,default:!0}});var L=e(I,2);nt(L,{run:()=>{D(l,!t(l))},icon:"🌚",children:(E,R)=>{k();var A=Z("Hello with an optional icon string");o(E,A)},$$slots:{default:!0}}),o(B,X)},children:(B,X)=>{var W=Yn(),I=e(s(W),2);{let Q=P(()=>`<${t(_)} scoped>
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
...markup without contextmenu behavior...`);Dt(I,{get content(){return t(Q)}})}var L=e(I,2),E=s(L);let R;var A=s(E);a(E),a(L);var M=e(L,2),O=s(M);let S;var z=s(O);a(O),a(M);var H=e(M,2),K=s(H);let T;var Y=s(K);a(K),a(H),k(2),a(W),vt(()=>{R=it(E,1,"",null,R,{color_g_5:t(r)}),ft(A,`greeted = ${t(r)??""}`),S=it(O,1,"",null,S,{color_e_5:t(i)}),ft(z,`greeted_icon_snippet = ${t(i)??""}`),T=it(K,1,"",null,T,{color_d_5:t(l)}),ft(Y,`greeted_icon_string = ${t(l)??""}`)}),o(B,W)},$$slots:{entries:!0,default:!0}}),o(x,u)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(v,c),ct()}var Jn=new Set(["$$slots","$$events","$$legacy","glyph","size"]),Qn=y("<span> </span>");function Mt(v,n){lt(n,!0);const d=ye(n,Jn),C="var(--font_size, 1em)",_="var(--font_size, inherit)",r=P(()=>n.size??C);var i=Qn();ge(i,()=>({...d,class:`glyph display:inline-block text-align:center line-height:1 white-space:nowrap font-weight:400 ${n.class??""}`,[xe]:{width:t(r),height:t(r),"min-width":t(r),"min-height":t(r),"font-size":n.size??_}}));var l=s(i,!0);a(i),vt(()=>ft(l,n.glyph)),o(v,i),ct()}var to=y('<span class="color_f_50">option f</span>'),eo=y('<span class="color_g_50">option g</span>'),no=y('<span class="color_j_50">option j</span>'),oo=y("<!> <!> <!> <!>",1),ao=y('<li class="color_error">Error: <code> </code></li>'),so=y('<div class="display:flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>'),ro=y(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and control
					it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing you to select multiple colors using the activate
					button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),io=y("<!> <!>",1);function lo(v,n){lt(n,!0);const d=Et.get(),C=P(()=>d.component),_=P(()=>d.name),r=new jt;let i=et(void 0);const l=P(()=>t(i)?`color_${t(i)}_5`:void 0),c=P(()=>t(i)?`color_${t(i)}`:void 0);var h=$t(),w=N(h);Nt(w,()=>t(C),(m,f)=>{f(m,{get contextmenu(){return r},scoped:!0,children:(p,x)=>{Pt(p,{children:(b,u)=>{var g=io(),F=N(g);It(F,{text:"Custom instance"});var G=e(F,2);yt(G,{entries:X=>{Vt(X,{icon:"🎨",menu:I=>{var L=oo(),E=N(L);nt(E,{run:()=>(D(i,"f"),{ok:!0,close:!1}),children:(O,S)=>{var z=to();o(O,z)},$$slots:{default:!0}});var R=e(E,2);nt(R,{run:()=>(D(i,"g"),{ok:!0,close:!1}),children:(O,S)=>{var z=eo();o(O,z)},$$slots:{default:!0}});var A=e(R,2);nt(A,{run:()=>(D(i,"j"),{ok:!0,close:!1}),children:(O,S)=>{var z=no();o(O,z)},$$slots:{default:!0}});var M=e(A,2);nt(M,{run:()=>(r.close(),{ok:!0}),children:(O,S)=>{k();var z=Z("close contextmenu");o(O,z)},$$slots:{default:!0}}),o(I,L)},children:(I,L)=>{k();var E=Z("select color");o(I,E)},$$slots:{menu:!0,default:!0}})},children:(X,W)=>{var I=ro(),L=s(I),E=e(s(L)),R=s(E,!0);a(E),k(5),a(L);var A=e(L,2);Dt(A,{lang:"ts",dangerous_raw_html:'<span class="token_keyword">const</span> contextmenu <span class="token_operator">=</span> <span class="token_keyword">new</span> <span class="token_class_name"><span class="token_capitalized_identifier token_class_name">ContextmenuState</span></span><span class="token_punctuation">(</span><span class="token_punctuation">)</span><span class="token_punctuation">;</span>'});var M=e(A,2);{let U=P(()=>`<${t(_)} {contextmenu} scoped>...</${t(_)}>`);Dt(M,{get content(){return t(U)}})}var O=e(M,2),S=e(s(O));S.textContent="{ok: true, close: false}",k(),a(O);var z=e(O,2),H=e(s(z),2),K=s(H),T=e(s(K),2),Y=s(T,!0);a(T),a(K);var Q=e(K,2),$=e(s(Q),2),q=s($);a($),a(Q);var j=e(Q,2);{var J=U=>{var V=ao(),tt=e(s(V)),_t=s(tt,!0);a(tt),a(V),vt(()=>ft(_t,r.error)),o(U,V)};at(j,U=>{r.error&&U(J)})}a(H),a(z);var ot=e(z,2);{var dt=U=>{var V=so(),tt=s(V),_t=s(tt),Ot=s(_t);Mt(Ot,{glyph:"↑"}),a(_t);var Ft=e(_t,2),gt=s(Ft),pt=s(gt);Mt(pt,{glyph:"←"}),a(gt);var xt=e(gt,2),wt=s(xt);Mt(wt,{glyph:"↵"}),a(xt);var bt=e(xt,2),Ct=s(bt);Mt(Ct,{glyph:"→"}),a(bt),a(Ft);var ut=e(Ft,2),st=s(ut);Mt(st,{glyph:"↓"}),a(ut),a(tt),a(V),vt(()=>{it(_t,1,`border_bottom_left_radius_0 border_bottom_right_radius_0 ${t(c)??""}`),_t.disabled=!r.can_select_sibling,it(gt,1,`border_bottom_right_radius_0 border_top_right_radius_0 ${t(c)??""}`),gt.disabled=!r.can_collapse,it(xt,1,`border-radius:0 ${t(c)??""}`),xt.disabled=!r.can_activate,it(bt,1,`border_bottom_left_radius_0 border_top_left_radius_0 ${t(c)??""}`),bt.disabled=!r.can_expand,it(ut,1,`border_top_left_radius_0 border_top_right_radius_0 ${t(c)??""}`),ut.disabled=!r.can_select_sibling}),Tt("mousedown",_t,mt=>{zt(mt),r.select_previous()},!0),Tt("mousedown",gt,mt=>{zt(mt),r.collapse_selected()},!0),Tt("mousedown",xt,async mt=>{zt(mt),await r.activate_selected()},!0),Tt("mousedown",bt,mt=>{zt(mt),r.expand_selected()},!0),Tt("mousedown",ut,mt=>{zt(mt),r.select_next()},!0),Ht(3,V,()=>en),o(U,V)};at(ot,U=>{r.opened&&U(dt)})}a(I),vt(()=>{ft(R,t(_)),it(z,1,`mb_md ${t(l)??""}`),ft(Y,r.opened),ft(q,`${r.x??""} && contextmenu.y === ${r.y??""}`)}),o(X,I)},$$slots:{entries:!0,default:!0}}),o(b,g)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(v,h),ct()}var co=y(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the browser's
					default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's default
					contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),uo=y("<div><!></div> <!>",1);function mo(v,n){lt(n,!0);const d=Et.get(),C=P(()=>d.component),_=new jt;let r=et(!1),i=et(void 0);const l=()=>{const b=window.getSelection();if(!b||!t(i))return;const u=document.createRange();u.selectNodeContents(t(i)),b.removeAllRanges(),b.addRange(u)};let c=et("");const h="If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.",w=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`,m=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`,f=P(()=>t(c)===h||t(c)===w||t(c)===m);var p=$t(),x=N(p);Nt(x,()=>t(C),(b,u)=>{u(b,{get contextmenu(){return _},scoped:!0,children:(g,F)=>{Pt(g,{children:(G,B)=>{var X=uo(),W=N(X);let I;var L=s(W);It(L,{text:"Select text"}),a(W);var E=e(W,2);yt(E,{entries:A=>{nt(A,{run:()=>{D(r,!t(r))},children:(M,O)=>{k();var S=Z("Toggle something");o(M,S)},$$slots:{default:!0}})},children:(A,M)=>{var O=co();let S;var z=s(O),H=e(s(z),2),K=e(s(H));let T;k(),a(H),a(z),oe(z,tt=>D(i,tt),()=>t(i));var Y=e(z,2),Q=s(Y);Rt(Q),a(Y);var $=e(Y,2);let q;var j=e($,2),J=s(j);Ie(J),a(j);var ot=e(j,2),dt=s(ot);Bt(dt,{path:"Web/HTML/Global_attributes/contenteditable"}),k(),a(ot);var U=e(ot,4),V=e(U,4);k(2),a(O),vt(()=>{S=it(O,1,"panel p_md",null,S,{color_g_5:t(f)}),T=it(K,1,"",null,T,{color_a:t(r)}),q=it($,1,"",null,q,{color_g_5:t(f)})}),ee("click",K,l),ue(Q,()=>t(c),tt=>D(c,tt)),ue(J,()=>t(c),tt=>D(c,tt)),ce("innerText",U,()=>t(c),tt=>D(c,tt)),ce("innerText",V,()=>t(c),tt=>D(c,tt)),o(A,O)},$$slots:{entries:!0,default:!0}}),vt(()=>I=it(W,1,"",null,I,{color_d_5:t(f)})),o(G,X)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(v,p),ct()}te(["click"]);var vo=y('<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>'),_o=y('<li>custom "some custom entry" entry</li>'),po=y('<li>"copy text" entry when text is selected</li>'),ho=y("<li>link entry when clicking on a link</li>"),fo=y("<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>",1),go=y(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing the
			Fuz contextmenu.</p>`),xo=y('<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which ensures the Fuz contextmenu is used</label></div> <!>',1);function bo(v,n){lt(n,!0);const d=p=>{var x=vo(),b=s(x),u=e(s(b));let g;k(),a(b),oe(b,B=>D(m,B),()=>t(m));var F=e(b,2),G=e(s(F));k(),a(F),a(x),vt(B=>{g=it(u,1,"",null,g,{color_h:t(w)}),be(G,"href",B)},[()=>mn("/")]),ee("click",u,f),o(p,x)},C=Et.get(),_=P(()=>C.component),r=P(()=>C.name),i=new jt;let l=et(!1),c=et(!1),h=et(!0),w=et(!1),m=et(void 0);const f=()=>{const p=window.getSelection();if(!p||!t(m))return;const x=document.createRange();x.selectNodeContents(t(m)),p.removeAllRanges(),p.addRange(x)};Pt(v,{children:(p,x)=>{var b=xo(),u=N(b);It(u,{text:"Disable default behaviors"});var g=e(u,4);{let T=P(()=>`<${t(r)}${t(l)?" link_entry={null}":""}${t(c)?" text_entry={null}":""}>`);Dt(g,{get content(){return t(T)}})}var F=e(g,2),G=s(F),B=s(G);Rt(B);var X=e(B,2),W=e(s(X));W.textContent="link_entry={null}",a(X),a(G);var I=e(G,2),L=s(I);Rt(L);var E=e(L,2),R=e(s(E));R.textContent="text_entry={null}",a(E),a(I),a(F);var A=e(F,2);{let T=P(()=>t(l)?null:void 0),Y=P(()=>t(c)?null:void 0);Nt(A,()=>t(_),(Q,$)=>{$(Q,{get contextmenu(){return i},scoped:!0,get link_entry(){return t(T)},get text_entry(){return t(Y)},children:(q,j)=>{var J=$t(),ot=N(J);{var dt=V=>{yt(V,{entries:_t=>{nt(_t,{icon:">",run:()=>{D(w,!t(w))},children:(Ot,Ft)=>{k();var gt=Z("some custom entry");o(Ot,gt)},$$slots:{default:!0}})},children:(_t,Ot)=>{d(_t)},$$slots:{entries:!0,default:!0}})},U=V=>{d(V)};at(ot,V=>{t(h)?V(dt):V(U,-1)})}o(q,J)},$$slots:{default:!0}})})}var M=e(A,4),O=s(M),S=s(O);Rt(S),k(),a(O),a(M);var z=e(M,2);{var H=T=>{var Y=fo(),Q=e(N(Y),2),$=s(Q);{var q=U=>{var V=_o();o(U,V)};at($,U=>{t(h)&&U(q)})}var j=e($,2);{var J=U=>{var V=po();o(U,V)};at(j,U=>{t(c)||U(J)})}var ot=e(j,2);{var dt=U=>{var V=ho();o(U,V)};at(ot,U=>{t(l)||U(dt)})}a(Q),o(T,Y)},K=T=>{var Y=go();o(T,Y)};at(z,T=>{t(h)||!t(l)||!t(c)?T(H):T(K,-1)})}Kt(B,()=>t(l),T=>D(l,T)),Kt(L,()=>t(c),T=>D(c,T)),Kt(S,()=>t(h),T=>D(h,T)),o(p,b)},$$slots:{default:!0}}),ct()}te(["click"]);var yo=y(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function $o(v,n){lt(n,!0);const d=Et.get(),C=P(()=>d.component),_=P(()=>d.name);var r=$t(),i=N(r);Nt(i,()=>t(C),(l,c)=>{c(l,{scoped:!0,children:(h,w)=>{Pt(h,{children:(m,f)=>{var p=yo(),x=N(p);It(x,{text:"Default behaviors"});var b=e(x,2),u=s(b);{let g=P(()=>`<${t(_)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${t(_)}>`);Dt(u,{get content(){return t(g)}})}k(6),a(b),o(m,p)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(v,r),ct()}var wo=y("<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>",1);function ta(v,n){lt(n,!0);const C=Oe("Contextmenu");Et.set(),Ee(v,{get tome(){return C},children:(_,r)=>{var i=wo(),l=N(i);wn(l,{});var c=e(l,2);Kn(c,{});var h=e(c,2);$o(h,{});var w=e(h,2);mo(w,{});var m=e(w,2);bo(m,{});var f=e(m,2);lo(f,{});var p=e(f,2);jn(p,{});var x=e(p,2);Pn(x),k(2),o(_,i)},$$slots:{default:!0}}),ct()}export{ta as component};
