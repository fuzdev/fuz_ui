import"../chunks/DsnmJJEf.js";import{p as ft,g as st,a as S,b as n,c as xt,h as wt,ah as Rt,f as b,am as kt,an as Vt,s as o,ai as ue,j as t,al as J,bo as Yt,ak as x,d as c,r as i,u as L,t as _t,n as $,i as O,e as $t,aj as Fe,bs as De}from"../chunks/CZBu3nCk.js";import{T as Le}from"../chunks/D1hgK5ux.js";import{g as qe}from"../chunks/CXmaHIr4.js";import{c as Dt}from"../chunks/CksEUPeE.js";import{C as Ft}from"../chunks/DulLcNBb.js";import{M as Xt}from"../chunks/BlN-5CZu.js";import{T as At,a as Ot}from"../chunks/BHYDsn5Q.js";import{e as Me,t as jt,a as ve}from"../chunks/DfUDHxGS.js";import{g as ie,b as $e,S as we,a as le,r as Mt,f as ht,s as Ce}from"../chunks/CGbw7y6i.js";import{p as lt,r as ke,i as Q,s as de}from"../chunks/hON_zS-i.js";import{c as He,C as Jt,a as Te,b as ce,d as me}from"../chunks/lGV6QfzM.js";import{a as Ue,b as Be,c as We,d as je,e as Xe,f as Ge,g as Ve,h as Se,i as Pe,j as Qt,k as Ye,l as pe,m as Kt,n as Ke,o as Ze,C as he,p as it}from"../chunks/CHA5SxAG.js";import{D as Ie,b as fe}from"../chunks/DTEv8nrp.js";import{a as xe,b as ge,c as se}from"../chunks/Ctvn-GH-.js";import{c as Je,r as Qe}from"../chunks/CW-Phu3w.js";import{e as Gt}from"../chunks/CpN0V4Eo.js";import{b as te}from"../chunks/CP4RSCCi.js";import{s as Tt}from"../chunks/V2q5a4YM.js";import{c as tn,s as en}from"../chunks/DfIpPbHs.js";import{G as nn}from"../chunks/WueHC3Gz.js";import{S as on,b as an}from"../chunks/C8SQndp0.js";import{C as rn,T as sn}from"../chunks/ClYOCVOB.js";import{D as ln}from"../chunks/BZ2RP0kr.js";function Ct(m,e){ft(e,!0);const u=lt(e,"tag",3,"span"),P=ke(e,["$$slots","$$events","$$legacy","tag","entries","children"]);var w=st(),l=S(w);Me(l,u,!1,(a,s)=>{ie(a,()=>He(e.entries)),$e(a,()=>({...P,[we]:{display:"contents"}}));var r=st(),f=S(r);wt(f,()=>e.children),n(s,r)}),n(m,w),xt()}const cn=(m,e=Rt)=>{Se(m,de(e))},un=(m,e=Rt)=>{Pe(m,de(e))},dn=(m,e=Rt)=>{Qt(m,de(e))};var _n=b('<div class="contextmenu_root svelte-1472w04" role="region"><!></div>'),vn=b('<div class="contextmenu_layout svelte-1472w04" aria-hidden="true"></div>'),mn=b('<ul class="contextmenu unstyled pane svelte-1472w04" role="menu" aria-label="context menu" tabindex="-1"></ul>'),pn=b("<!> <!> <!>",1);function hn(m,e){ft(e,!0);const u=lt(e,"contextmenu",19,()=>new Jt),P=lt(e,"longpress_move_tolerance",3,Ue),w=lt(e,"longpress_duration",3,Be),l=lt(e,"bypass_with_tap_then_longpress",3,!0),a=lt(e,"bypass_window",3,We),s=lt(e,"bypass_move_tolerance",3,je),r=lt(e,"open_offset_x",3,Xe),f=lt(e,"open_offset_y",3,Ge),F=lt(e,"scoped",3,!1),T=lt(e,"link_entry",3,cn),v=lt(e,"text_entry",3,un),_=lt(e,"separator_entry",3,dn);Te.set(u());let p=J(void 0);const y=L(()=>u().layout),g=ce.set(),d=L(()=>Ke(u().x,g.width,t(y).width)),C=L(()=>Ze(u().y,g.height,t(y).height));let R=J(void 0),W=J(void 0),V=J(void 0),E=J(void 0),z=J(void 0),N=J(void 0),k=J(void 0),U=J(!1);const M=()=>{document.body.classList.add("contextmenu_pending")},j=()=>{document.body.classList.remove("contextmenu_pending")},I=()=>{x(z,!1),t(E)!=null&&(clearTimeout(t(E)),x(E,null)),j()},D=()=>{x(V,null),x(R,null),x(W,null),x(N,!1),t(k)!=null&&(clearTimeout(t(k)),x(k,null))},H=()=>{I(),D()},q=h=>{if(t(N)){D();return}const{target:A}=h;if(t(z)){if(t(p)?.contains(A))return;H(),Tt(h);return}pe(A,h.shiftKey)&&(t(p)?.contains(A)||me(A,h.clientX+r(),h.clientY+f(),u(),{link_enabled:T()!==null,text_enabled:v()!==null,separator_enabled:_()!==null})&&(Tt(h),H()))},Y=h=>{x(z,!1),x(U,!1);const{touches:A,target:G}=h;if(u().opened||A.length!==1||!pe(G,h.shiftKey)){H();return}const{clientX:tt,clientY:Z}=A[0];if(l()){if(t(V)!=null&&performance.now()-t(V)<a()&&Math.hypot(tt-t(R),Z-t(W))<s()){x(N,!0),x(V,null),x(R,null),x(W,null),t(k)!=null&&(clearTimeout(t(k)),x(k,null));return}x(V,performance.now(),!0),t(k)!=null&&clearTimeout(t(k)),x(k,setTimeout(()=>{D()},a()),!0)}x(R,tt,!0),x(W,Z,!0),M(),t(E)!=null&&I(),x(E,setTimeout(()=>{x(z,!0),j(),me(G,t(R)+r(),t(W)+f(),u(),{link_enabled:T()!==null,text_enabled:v()!==null,separator_enabled:_()!==null})},w()),!0)},B=h=>{if(t(E)==null||u().opened)return;const{touches:A}=h;if(A.length!==1)return;const{clientX:G,clientY:tt}=A[0];if(Math.hypot(G-t(R),tt-t(W))>P()){I();return}h.preventDefault()},et=h=>{t(E)!=null&&(t(z)&&(Tt(h),x(U,!0)),I()),t(N)&&D()},nt=()=>{H()},ut=h=>{t(p)&&!t(p).contains(h.target)&&u().close()},yt=Ve(u()),gt=Ye(yt),vt=h=>{const A={passive:!0,capture:!0},G={passive:!1,capture:!0},tt=Yt(h,"touchstart",Y,A),Z=Yt(h,"touchmove",B,G),pt=Yt(h,"touchend",et,G),at=Yt(h,"touchcancel",nt,A);return()=>{tt(),Z(),pt(),at()}};var ct=pn();kt("contextmenu",Vt,function(...h){(F()?void 0:q)?.apply(this,h)}),kt("mousedown",Vt,function(...h){(u().opened?ut:void 0)?.apply(this,h)}),kt("keydown",Vt,function(...h){(u().opened?gt:void 0)?.apply(this,h)}),ie(Vt,()=>F()?void 0:vt);var mt=S(ct);{var X=h=>{var A=_n();A.__contextmenu=q;var G=c(A);wt(G,()=>e.children),i(A),ie(A,()=>vt),n(h,A)},K=h=>{var A=st(),G=S(A);wt(G,()=>e.children),n(h,A)};Q(mt,h=>{F()?h(X):h(K,!1)})}var ot=o(mt,2);{var dt=h=>{var A=vn();Kt(A,"clientWidth",G=>t(y).width=G),Kt(A,"clientHeight",G=>t(y).height=G),n(h,A)};Q(ot,h=>{u().has_custom_layout||h(dt)})}var Nt=o(ot,2);{var St=h=>{var A=mn();let G;Gt(A,20,()=>u().params,tt=>tt,(tt,Z)=>{var pt=st(),at=S(pt);{var Pt=rt=>{var It=st(),Ht=S(It);wt(Ht,()=>Z),n(rt,It)},bt=rt=>{var It=st(),Ht=S(It);{var Et=Lt=>{var Ut=st(),oe=S(Ut);wt(oe,()=>T()??Rt,()=>Z.props),n(Lt,Ut)},ne=Lt=>{var Ut=st(),oe=S(Ut);{var Oe=qt=>{var Bt=st(),ae=S(Bt);wt(ae,()=>v()??Rt,()=>Z.props),n(qt,Bt)},ze=qt=>{var Bt=st(),ae=S(Bt);{var Ne=re=>{var _e=st(),Re=S(_e);wt(Re,()=>_()??Rt,()=>Z.props),n(re,_e)};Q(ae,re=>{Z.snippet==="separator"&&re(Ne)},!0)}n(qt,Bt)};Q(oe,qt=>{Z.snippet==="text"?qt(Oe):qt(ze,!1)},!0)}n(Lt,Ut)};Q(Ht,Lt=>{Z.snippet==="link"?Lt(Et):Lt(ne,!1)},!0)}n(rt,It)};Q(at,rt=>{typeof Z=="function"?rt(Pt):rt(bt,!1)})}n(tt,pt)}),i(A),te(A,tt=>x(p,tt),()=>t(p)),_t(()=>G=le(A,"",G,{transform:`translate3d(${t(d)??""}px, ${t(C)??""}px, 0)`})),kt("click",A,function(...tt){(t(U)?Z=>{x(U,!1),Tt(Z)}:void 0)?.apply(this,tt)},!0),Kt(A,"offsetWidth",tt=>g.width=tt),Kt(A,"offsetHeight",tt=>g.height=tt),n(h,A)};Q(Nt,h=>{u().opened&&h(St)})}n(m,ct),xt()}ue(["contextmenu"]);class fn{#t=J();get variant(){return t(this.#t)}set variant(e){x(this.#t,e,!0)}#e=L(()=>this.variant==="standard"?he:hn);get component(){return t(this.#e)}set component(e){x(this.#e,e)}#n=L(()=>this.component===he?"ContextmenuRoot":"ContextmenuRootForSafariCompatibility");get name(){return t(this.#n)}set name(e){x(this.#n,e)}constructor(e="standard"){this.variant=e}}const zt=Je(()=>new fn("standard"));var xn=b('<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <code>ContextmenuRoot</code></div></label> <label class="row"><input type="radio"/> <div>iOS compat <code>ContextmenuRootForSafariCompatibility</code></div></label></fieldset>');function Ee(m,e){ft(e,!0);const u=[],P=zt.get();var w=xn(),l=o(c(w),2),a=c(l);Mt(a),a.value=a.__value="standard",$(2),i(l);var s=o(l,2),r=c(s);Mt(r),r.value=r.__value="compat",$(2),i(s),i(w),xe(u,[],a,()=>P.variant,f=>P.variant=f),xe(u,[],r,()=>P.variant,f=>P.variant=f),n(m,w),xt()}var gn=b('<p class="panel p_md">alert B -- also inherits A</p>'),bn=b('<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>'),yn=b("<code>navigator.vibrate</code>"),$n=b(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
		capabilities to users. Popular websites with similar features include Google Docs and Discord.
		Below are caveats about this breaking some user expectations, and a workaround for iOS Safari
		support. See also the <!> docs and <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p> <p>When you rightclick inside a <code>ContextmenuRoot</code>, or longpress on touch devices, it
		searches the DOM tree for behaviors defined with <code>Contextmenu</code> starting from the target
		element up to the root. If any behaviors are found, the Fuz contextmenu opens, showing all contextually
		available actions. If no behaviors are found, the default system contextmenu opens.</p> <p>Here's a <code> </code> with a <code>Contextmenu</code> inside another <code>Contextmenu</code>:</p> <!> <!> <p>This simple hierarchical pattern gives users the full contextual actions by default -- not just
		the actions for the target being clicked, but all ancestor actions too. This means users don't
		need to hunt for specific parent elements to find the desired action, unlike many systems --
		instead, all actions in the tree are available, improving UX convenience and predictability at
		the cost of more noisy menus. Developers can opt out of this inheritance behavior by simply not
		nesting <code>Contextmenu</code> declarations, and submenus are useful for managing complexity.</p> <h4>Mouse and keyboard:</h4> <ul><li>rightclick opens the Fuz contextmenu and not the system contextmenu (minus current exceptions
			for input/textarea/contenteditable)</li> <li>holding Shift opens the system contextmenu, bypassing the Fuz contextmenu</li> <li>keyboard navigation and activation should work similarly to the W3C <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/">APG menubar pattern</a></li></ul> <h4>Touch devices:</h4> <ul><li>longpress opens the Fuz contextmenu and not the system contextmenu (minus current exceptions
			for input/textarea/contenteditable)</li> <li>tap-then-longpress opens the system contextmenu or performs other default behavior like
			selecting text, bypassing the Fuz contextmenu</li> <li>tap-then-longpress can't work for clickable elements like links; longpress on the first
			contextmenu entry for those cases (double-longpress)</li></ul> <h4>All devices:</h4> <ul><li>opening the contextmenu on the contextmenu itself shows the system contextmenu, bypassing the
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function wn(m,e){ft(e,!0);const u=zt.get(),P=L(()=>u.component),w=L(()=>u.name);At(m,{children:(l,a)=>{var s=$n(),r=S(s);Ot(r,{text:"Introduction"});var f=o(r,2),F=o(c(f));Xt(F,{path:"Web/API/Element/contextmenu_event"}),$(3),i(f);var T=o(f,4),v=o(c(T)),_=c(v,!0);i(v),$(5),i(T);var p=o(T,2);Dt(p,()=>t(P),(W,V)=>{V(W,{scoped:!0,children:(E,z)=>{Ct(E,{entries:k=>{it(k,{run:()=>alert("alert A"),children:(U,M)=>{$();var j=O("alert A");n(U,j)},$$slots:{default:!0}})},children:(k,U)=>{var M=bn(),j=o(c(M),2);Ct(j,{entries:D=>{it(D,{run:()=>alert("alert B"),children:(H,q)=>{$();var Y=O("alert B");n(H,Y)},$$slots:{default:!0}})},children:(D,H)=>{var q=gn();n(D,q)},$$slots:{entries:!0,default:!0}}),i(M),n(k,M)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var y=o(p,2);Ie(y,{summary:V=>{$();var E=O("view code");n(V,E)},children:(V,E)=>{{let z=L(()=>`<${t(w)}>
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
</${t(w)}>`);Ft(V,{get content(){return t(z)}})}},$$slots:{summary:!0,default:!0}});var g=o(y,14),d=o(c(g),2),C=o(c(d));Xt(C,{path:"Web/API/Navigator/vibrate",children:(W,V)=>{var E=yn();n(W,E)},$$slots:{default:!0}}),i(d),i(g);var R=o(g,2);Ee(R,{}),_t(()=>$t(_,t(w))),n(l,s)},$$slots:{default:!0}}),xt()}var Cn=b('<span class="font_family_mono">contextmenu</span> event',1),kn=b(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
		Safari not supporting the <code>contextmenu</code> event as of October 2025, see <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a>.</p> <p>Use <code>ContextmenuRoot</code> by default for better performance and haptic feedback. Use <code>ContextmenuRootForSafariCompatibility</code> only if you need iOS Safari support.</p> <h4>ContextmenuRoot</h4> <ul><li>standard, default implementation</li> <li>relies on the browser's <!></li> <li>much simpler, better performance with fewer and less intrusive event handlers, fewer edge
			cases that can go wrong</li> <li>does not work on iOS Safari until <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a> is fixed</li></ul> <h4>ContextmenuRootForSafariCompatibility</h4> <ul><li>opt-in for iOS</li> <li>some browsers (including mobile Chrome) block <code>navigator.vibrate</code> haptic feedback due
			to the timeout-based gesture detection (because it's not a direct user action)</li> <li>implements custom longpress detection to work around iOS Safari's lack of <code>contextmenu</code> event support</li> <li>works on all devices including iOS Safari</li> <li>more complex implementation with custom touch event handling and gesture detection</li> <li>a longpress is cancelled if you move the touch past a threshold before it triggers</li> <li>opt into this version only if you need iOS Safari support</li></ul> <!>`,1),Tn=b(`<!> <p>The Fuz contextmenu provides powerful app-specific UX, but it breaks from normal browser
		behavior by replacing the system contextmenu.</p> <p>To mitigate the downsides:</p> <ul><li>The Fuz contextmenu only replaces the system contextmenu when the DOM tree has defined
			behaviors. Note that <code>a</code> links have default contextmenu behaviors unless disabled. Other
			interactive elements may have default behaviors added in the future.</li> <li>The Fuz contextmenu does not open on elements that allow clipboard pasting like inputs,
			textareas, and contenteditables -- however this may change for better app integration, or be
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),Sn=b("<!> <!>",1);function Pn(m){var e=Sn(),u=S(e);At(u,{children:(w,l)=>{var a=kn(),s=S(a);Ot(s,{text:"iOS compatibility"});var r=o(s,8),f=o(c(r),2),F=o(c(f));Xt(F,{path:"Web/API/Element/contextmenu_event",children:(v,_)=>{var p=Cn();$(),n(v,p)},$$slots:{default:!0}}),i(f),$(4),i(r);var T=o(r,6);Ee(T,{}),n(w,a)},$$slots:{default:!0}});var P=o(u,2);At(P,{children:(w,l)=>{var a=Tn(),s=S(a);Ot(s,{text:"Caveats"});var r=o(s,8),f=o(c(r));Xt(f,{path:"Web/API/Element/contextmenu_event"}),$(3),i(r),n(w,a)},$$slots:{default:!0}}),n(m,e)}function In(m){const e=m-1;return e*e*e+1}function En(m){return--m*m*m*m*m+1}function be(m,{from:e,to:u},P={}){var{delay:w=0,duration:l=E=>Math.sqrt(E)*120,easing:a=In}=P,s=getComputedStyle(m),r=s.transform==="none"?"":s.transform,[f,F]=s.transformOrigin.split(" ").map(parseFloat);f/=m.clientWidth,F/=m.clientHeight;var T=An(m),v=m.clientWidth/u.width/T,_=m.clientHeight/u.height/T,p=e.left+e.width*f,y=e.top+e.height*F,g=u.left+u.width*f,d=u.top+u.height*F,C=(p-g)*v,R=(y-d)*_,W=e.width/u.width,V=e.height/u.height;return{delay:w,duration:typeof l=="function"?l(Math.sqrt(C*C+R*R)):l,easing:a,css:(E,z)=>{var N=z*C,k=z*R,U=E+z*W,M=E+z*V;return`transform: ${r} translate(${N}px, ${k}px) scale(${U}, ${M});`}}}function An(m){if("currentCSSZoom"in m)return m.currentCSSZoom;for(var e=m,u=1;e!==null;)u*=+getComputedStyle(e).zoom,e=e.parentElement;return u}var On=b('<menu class="pane unstyled svelte-6kuqba"><!></menu>'),zn=b('<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-label="contextmenu submenmu" aria-haspopup="menu" tabindex="-1"><div class="content"><div class="icon"><!></div> <div class="title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>');function ee(m,e){ft(e,!0);const u=Te.get(),P=u.add_submenu(),{layout:w}=u,l=L(()=>P.selected);let a=J(void 0);const s=ce.get(),r=ce.set();let f=J(0),F=J(0);Fe(()=>{t(a)&&T(t(a),w,s)});const T=(z,N,k)=>{const{x:U,y:M,width:j,height:I}=z.getBoundingClientRect();r.width=j,r.height=I;const D=U-t(f),H=M-t(F),q=D+j+k.width-N.width;if(q<=0)x(f,k.width,!0);else{const Y=j-D;Y<=0?x(f,-j):Y>q?x(f,k.width-q):x(f,Y-j)}x(F,Math.min(0,N.height-(H+I)),!0)};var v=zn();let _;var p=c(v);let y;var g=c(p),d=c(g),C=c(d);wt(C,()=>e.icon??Rt),i(d);var R=o(d,2),W=c(R);wt(W,()=>e.children),i(R),i(g),$(2),i(p);var V=o(p,2);{var E=z=>{var N=On();let k;var U=c(N);wt(U,()=>e.menu),i(N),te(N,M=>x(a,M),()=>t(a)),_t(()=>k=le(N,"",k,{transform:`translate3d(${t(f)??""}px, ${t(F)??""}px, 0)`,"max-height":`${w.height??""}px`})),n(z,N)};Q(V,z=>{t(l)&&z(E)})}i(v),_t(()=>{_=le(v,"",_,{"--contextmenu_depth":P.depth}),y=ht(p,1,"menu_item plain selectable svelte-6kuqba",null,y,{selected:t(l)}),Ce(p,"aria-expanded",t(l))}),kt("mouseenter",p,z=>{Tt(z),setTimeout(()=>u.select(P))}),n(m,v),xt()}var Nn=b("<!> <!>",1);function Zt(m,e){ft(e,!0);const u=lt(e,"name",3,"Cat"),P=lt(e,"icon",3,"😺");ee(m,{icon:a=>{$();var s=O();_t(()=>$t(s,P())),n(a,s)},menu:a=>{var s=Nn(),r=S(s);it(r,{run:()=>e.act({type:e.position==="adventure"?"cat_go_home":"cat_go_adventure",name:u()}),icon:T=>{var v=st(),_=S(v);{var p=g=>{var d=O("🏠");n(g,d)},y=g=>{var d=O("🌄");n(g,d)};Q(_,g=>{e.position==="adventure"?g(p):g(y,!1)})}n(T,v)},children:(T,v)=>{var _=st(),p=S(_);{var y=d=>{var C=O("go home");n(d,C)},g=d=>{var C=O("go adventure");n(d,C)};Q(p,d=>{e.position==="adventure"?d(y):d(g,!1)})}n(T,_)},$$slots:{icon:!0,default:!0}});var f=o(r,2);it(f,{run:()=>e.act({type:"cat_be_or_do",name:u(),position:e.position}),icon:T=>{var v=st(),_=S(v);{var p=g=>{var d=O("🌄");n(g,d)},y=g=>{var d=O("🏠");n(g,d)};Q(_,g=>{e.position==="adventure"?g(p):g(y,!1)})}n(T,v)},children:(T,v)=>{var _=st(),p=S(_);{var y=d=>{var C=O("do adventure");n(d,C)},g=d=>{var C=O("be home");n(d,C)};Q(p,d=>{e.position==="adventure"?d(y):d(g,!1)})}n(T,_)},$$slots:{icon:!0,default:!0}}),n(a,s)},children:(a,s)=>{$();var r=O();_t(()=>$t(r,u())),n(a,r)},$$slots:{icon:!0,menu:!0,default:!0}}),xt()}var Rn=b("<!> <!> <!>",1);function Fn(m,e){var u=Rn(),P=S(u);Se(P,{href:"https://github.com/fuzdev/fuz_ui",icon:s=>{on(s,{get data(){return an},size:"var(--icon_size_xs)"})},children:(s,r)=>{$();var f=O("Source code");n(s,f)},$$slots:{icon:!0,default:!0}});var w=o(P,2);Qt(w,{});var l=o(w,2);it(l,{get run(){return e.toggle_about_dialog},icon:s=>{$();var r=O("?");n(s,r)},children:(s,r)=>{$();var f=O("About");n(s,f)},$$slots:{icon:!0,default:!0}}),n(m,u)}const Ae=m=>{const e=m.length;if(e===2)return"cats";if(e===0)return null;const u=m[0];return u.icon+u.name};var Dn=b("<!> <!>",1),Ln=b("<!> <!>",1),qn=b("<!> <!> <!>",1);function Mn(m,e){ft(e,!0);const u=L(()=>Ae(e.adventure_cats));ee(m,{icon:l=>{$();var a=O("🏠");n(l,a)},menu:l=>{var a=qn(),s=S(a);{var r=v=>{var _=Dn(),p=S(_);it(p,{run:()=>e.act({type:"call_cats_home"}),icon:d=>{$();var C=O("🐈‍⬛");n(d,C)},children:(d,C)=>{$();var R=O("call");n(d,R)},$$slots:{icon:!0,default:!0}});var y=o(p,2);Qt(y,{}),n(v,_)};Q(s,v=>{t(u)&&v(r)})}var f=o(s,2);Gt(f,17,()=>e.home_cats,v=>v.name,(v,_)=>{Zt(v,{get name(){return t(_).name},get icon(){return t(_).icon},get position(){return t(_).position},get act(){return e.act}})});var F=o(f,2);{var T=v=>{var _=Ln(),p=S(_);it(p,{run:()=>e.act({type:"cat_be_or_do",name:null,position:"home"}),icon:d=>{$();var C=O("🏠");n(d,C)},children:(d,C)=>{$();var R=O("be");n(d,R)},$$slots:{icon:!0,default:!0}});var y=o(p,2);it(y,{run:()=>e.act({type:"call_cats_adventure"}),icon:d=>{$();var C=O("🦋");n(d,C)},children:(d,C)=>{$();var R=O("leave");n(d,R)},$$slots:{icon:!0,default:!0}}),n(v,_)};Q(F,v=>{t(u)||v(T)})}n(l,a)},children:(l,a)=>{$();var s=O("home");n(l,s)},$$slots:{icon:!0,menu:!0,default:!0}}),xt()}var Hn=b("<!> <!>",1),Un=b("<!> <!>",1),Bn=b("<!> <!> <!>",1);function Wn(m,e){ft(e,!0);const u=L(()=>Ae(e.home_cats));ee(m,{icon:l=>{$();var a=O("🌄");n(l,a)},menu:l=>{var a=Bn(),s=S(a);{var r=v=>{var _=Hn(),p=S(_);it(p,{run:()=>e.act({type:"call_cats_adventure"}),icon:d=>{$();var C=O("🦋");n(d,C)},children:(d,C)=>{$();var R=O("call");n(d,R)},$$slots:{icon:!0,default:!0}});var y=o(p,2);Qt(y,{}),n(v,_)};Q(s,v=>{t(u)&&v(r)})}var f=o(s,2);Gt(f,17,()=>e.adventure_cats,v=>v.name,(v,_)=>{Zt(v,{get name(){return t(_).name},get icon(){return t(_).icon},get position(){return t(_).position},get act(){return e.act}})});var F=o(f,2);{var T=v=>{var _=Un(),p=S(_);it(p,{run:()=>e.act({type:"cat_be_or_do",name:null,position:"adventure"}),icon:d=>{$();var C=O("🌄");n(d,C)},children:(d,C)=>{$();var R=O("do");n(d,R)},$$slots:{icon:!0,default:!0}});var y=o(p,2);it(y,{run:()=>e.act({type:"call_cats_home"}),icon:d=>{$();var C=O("🐈‍⬛");n(d,C)},children:(d,C)=>{$();var R=O("leave");n(d,R)},$$slots:{icon:!0,default:!0}}),n(v,_)};Q(F,v=>{t(u)||v(T)})}n(l,a)},children:(l,a)=>{$();var s=O("adventure");n(l,s)},$$slots:{icon:!0,menu:!0,default:!0}}),xt()}var jn=b('<span class="icon svelte-1py4cgo"> </span>'),Xn=b('<span class="name svelte-1py4cgo"><!> </span>'),Gn=b("<span><!><!></span>");function ye(m,e){const u=lt(e,"name",3,"Cat"),P=lt(e,"icon",3,"😺"),w=lt(e,"show_name",3,!0),l=lt(e,"show_icon",3,!0);var a=Gn();let s;var r=c(a);{var f=v=>{var _=jn(),p=c(_,!0);i(_),_t(()=>$t(p,P())),n(v,_)};Q(r,v=>{l()&&v(f)})}var F=o(r);{var T=v=>{var _=Xn(),p=c(_);wt(p,()=>e.children??Rt);var y=o(p,1,!0);i(_),_t(()=>$t(y,u())),n(v,_)};Q(F,v=>{w()&&v(T)})}i(a),_t(()=>s=ht(a,1,"cat svelte-1py4cgo",null,s,{"has-icon":l()})),n(m,a)}const Vn=`<script lang="ts">
	import {flip} from 'svelte/animate';
	import {crossfade} from 'svelte/transition';
	import {quintOut} from 'svelte/easing';
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
	import file_contents from '$routes/docs/Contextmenu/ExampleFull.svelte?raw';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import {selected_contextmenu_root_component_context} from '$routes/docs/Contextmenu/selected_root_component.svelte.js';

	const selected = selected_contextmenu_root_component_context.get();
	const ContextmenuRootComponent = $derived(selected.component);

	const alyssa = 'Alyssa';
	const ben = 'Ben';

	const INITIAL_POSITION: CatPosition = 'home';
	let alyssa_position: CatPosition = $state(INITIAL_POSITION);
	let ben_position: CatPosition = $state(INITIAL_POSITION);

	const alyssa_icon = $derived(alyssa_position === ben_position ? '😺' : '😾');
	const ben_icon = $derived(alyssa_position === ben_position ? '😸' : '😿');

	const alyssa_cat = $derived({name: alyssa, icon: alyssa_icon, position: alyssa_position});
	const ben_cat = $derived({name: ben, icon: ben_icon, position: ben_position});

	let swapped = $state(false);

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

	let show_about_dialog = $state(false);
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
				swapped = !swapped;
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
			<section class="display_flex">
				<div>
					<Contextmenu>
						{#snippet entries()}
							<HomeContextmenu {act} {home_cats} {adventure_cats} />
						{/snippet}
						<div class="position home">
							<div class="icon">🏠</div>
							<div class="cats">
								{#each home_cats as { name, icon, position } (name)}
									<div
										class="cat_wrapper"
										in:receive={{key: name}}
										out:send={{key: name}}
										animate:flip
									>
										<Contextmenu>
											{#snippet entries()}
												<CatContextmenu {act} {name} {icon} {position} />
											{/snippet}
											<CatView {name} {icon} />
										</Contextmenu>
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
							<div class="icon">🌄</div>
							<div class="cats">
								{#each adventure_cats as { name, icon, position } (name)}
									<div
										class="cat_wrapper"
										in:receive={{key: name}}
										out:send={{key: name}}
										animate:flip
									>
										<Contextmenu>
											{#snippet entries()}
												<CatContextmenu {act} {name} {icon} {position} />
											{/snippet}
											<CatView {name} {icon} />
										</Contextmenu>
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
		<div class="mx_auto box">
			<div class="pane p_xl text_align_center">
				<h1>About Fuz</h1>
				<blockquote>Svelte UI library</blockquote>
				<blockquote>
					free and open source at<br /><GithubLink path="fuzdev/fuz_ui" />
				</blockquote>
				<code class="display_block p_md mb_lg"
					>npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui">@fuzdev/fuz_ui</a></code
				>
				<div class="p_xl box">
					<h2>Color scheme</h2>
					<ColorSchemeInput />
					<h2>Theme</h2>
					<ThemeInput />
				</div>
			</div>
		</div>
	</Dialog>
{/if}

<style>
	.position {
		border-radius: var(--border_radius_md);
		background-color: var(--fg_1);
		display: flex;
		border: transparent var(--border_width_4) double;
	}
	.position:hover {
		border-color: var(--border_color_1);
	}
	.position .icon {
		font-size: var(--icon_size_xl);
	}
	.cats {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.cat_wrapper {
		display: flex;
		flex-direction: column;
		width: 130px;
	}
</style>
`;var Yn=b("<!> <!>",1),Kn=b('<div class="cat_wrapper svelte-177dlvm"><!></div>'),Zn=b('<div class="position home svelte-177dlvm"><div class="icon svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>'),Jn=b('<div class="cat_wrapper svelte-177dlvm"><!></div>'),Qn=b('<div class="position adventure svelte-177dlvm"><div class="icon svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>'),to=b('<section class="display_flex"><div><!> <!></div></section> <section><!></section>',1),eo=b("<!> <!>",1),no=b('<div class="mx_auto box"><div class="pane p_xl text_align_center"><h1>About Fuz</h1> <blockquote>Svelte UI library</blockquote> <blockquote>free and open source at<br/><!></blockquote> <code class="display_block p_md mb_lg">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui">@fuzdev/fuz_ui</a></code> <div class="p_xl box"><h2>Color scheme</h2> <!> <h2>Theme</h2> <!></div></div></div>'),oo=b("<!> <!>",1);function ao(m,e){ft(e,!0);const u=zt.get(),P=L(()=>u.component),w="Alyssa",l="Ben",a="home";let s=J(a),r=J(a);const f=L(()=>t(s)===t(r)?"😺":"😾"),F=L(()=>t(s)===t(r)?"😸":"😿"),T=L(()=>({name:w,icon:t(f),position:t(s)})),v=L(()=>({name:l,icon:t(F),position:t(r)}));let _=J(!1);const p=(I,D)=>{const H=[],q=[];for(const Y of I){const B=Y.position==="home"?H:q;D?B.unshift(Y):B.push(Y)}return{home_cats:H,adventure_cats:q}},y=L(()=>p([t(T),t(v)],t(_))),g=L(()=>t(y).home_cats),d=L(()=>t(y).adventure_cats),C=L(()=>t(s)!==a||t(r)!==a),R=()=>{x(s,a),x(r,a)};let W=J(!1);const V=()=>{x(W,!t(W))},E=I=>{switch(I.type){case"call_cats_adventure":{x(s,"adventure"),x(r,"adventure");break}case"call_cats_home":{x(s,"home"),x(r,"home");break}case"cat_go_adventure":{I.name===w?x(s,"adventure"):I.name===l&&x(r,"adventure");break}case"cat_go_home":{I.name===w?x(s,"home"):I.name===l&&x(r,"home");break}case"cat_be_or_do":{x(_,!t(_));break}}},[z,N]=tn({fallback:(I,D)=>{const H=window.getComputedStyle(I),q=H.transform==="none"?"":H.transform;return{duration:1500,easing:En,css:Y=>`
					transform: ${q} scale(${Y});
					opacity: ${Y}
				`}}});var k=oo(),U=S(k);Dt(U,()=>t(P),(I,D)=>{D(I,{scoped:!0,children:(H,q)=>{At(H,{children:(Y,B)=>{var et=eo(),nt=S(et);Ot(nt,{text:"Full example"});var ut=o(nt,2);Ct(ut,{entries:gt=>{var vt=Yn(),ct=S(vt);{var mt=K=>{Pe(K,{run:R,content:"Reset",icon:"↻"})};Q(ct,K=>{t(C)&&K(mt)})}var X=o(ct,2);Fn(X,{toggle_about_dialog:V}),n(gt,vt)},children:(gt,vt)=>{var ct=to(),mt=S(ct),X=c(mt),K=c(X);Ct(K,{entries:h=>{Mn(h,{act:E,get home_cats(){return t(g)},get adventure_cats(){return t(d)}})},children:(h,A)=>{var G=Zn(),tt=o(c(G),2);Gt(tt,29,()=>t(g),({name:Z,icon:pt,position:at})=>Z,(Z,pt)=>{let at=()=>t(pt).name,Pt=()=>t(pt).icon,bt=()=>t(pt).position;var rt=Kn(),It=c(rt);Ct(It,{entries:Et=>{Zt(Et,{act:E,get name(){return at()},get icon(){return Pt()},get position(){return bt()}})},children:(Et,ne)=>{ye(Et,{get name(){return at()},get icon(){return Pt()}})},$$slots:{entries:!0,default:!0}}),i(rt),jt(1,rt,()=>N,()=>({key:at()})),jt(2,rt,()=>z,()=>({key:at()})),ve(rt,()=>be,null),n(Z,rt)}),i(tt),i(G),n(h,G)},$$slots:{entries:!0,default:!0}});var ot=o(K,2);Ct(ot,{entries:h=>{Wn(h,{act:E,get home_cats(){return t(g)},get adventure_cats(){return t(d)}})},children:(h,A)=>{var G=Qn(),tt=o(c(G),2);Gt(tt,29,()=>t(d),({name:Z,icon:pt,position:at})=>Z,(Z,pt)=>{let at=()=>t(pt).name,Pt=()=>t(pt).icon,bt=()=>t(pt).position;var rt=Jn(),It=c(rt);Ct(It,{entries:Et=>{Zt(Et,{act:E,get name(){return at()},get icon(){return Pt()},get position(){return bt()}})},children:(Et,ne)=>{ye(Et,{get name(){return at()},get icon(){return Pt()}})},$$slots:{entries:!0,default:!0}}),i(rt),jt(1,rt,()=>N,()=>({key:at()})),jt(2,rt,()=>z,()=>({key:at()})),ve(rt,()=>be,null),n(Z,rt)}),i(tt),i(G),n(h,G)},$$slots:{entries:!0,default:!0}}),i(X),i(mt);var dt=o(mt,2),Nt=c(dt);Ie(Nt,{summary:h=>{$();var A=O("View example source");n(h,A)},children:(h,A)=>{Ft(h,{get content(){return Vn}})},$$slots:{summary:!0,default:!0}}),i(dt),n(gt,ct)},$$slots:{entries:!0,default:!0}}),n(Y,et)},$$slots:{default:!0}})},$$slots:{default:!0}})});var M=o(U,2);{var j=I=>{ln(I,{onclose:()=>x(W,!1),children:(D,H)=>{var q=no(),Y=c(q),B=o(c(Y),4),et=o(c(B),2);nn(et,{path:"fuzdev/fuz_ui"}),i(B);var nt=o(B,4),ut=o(c(nt),2);rn(ut,{});var yt=o(ut,4);sn(yt,{}),i(nt),i(Y),i(q),n(D,q)},$$slots:{default:!0}})};Q(M,I=>{t(W)&&I(j)})}n(m,k),xt()}var ro=b("<!> <!> <!>",1),so=b(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific element
					instead of the entire page.</aside></div>`),io=b("<!> <!>",1);function lo(m,e){ft(e,!0);const u=zt.get(),P=L(()=>u.component),w=L(()=>u.name);let l=J(!1),a=J(!1),s=J(!1);var r=st(),f=S(r);Dt(f,()=>t(P),(F,T)=>{T(F,{scoped:!0,children:(v,_)=>{At(v,{children:(p,y)=>{var g=io(),d=S(g);Ot(d,{text:"Basic usage"});var C=o(d,2);Ct(C,{entries:W=>{var V=ro(),E=S(V);it(E,{run:()=>void x(l,!t(l)),children:(k,U)=>{$();var M=O("Hello world");n(k,M)},$$slots:{default:!0}});var z=o(E,2);it(z,{run:()=>void x(a,!t(a)),icon:U=>{$();var M=O("🌞");n(U,M)},children:(U,M)=>{$();var j=O("Hello with an optional icon snippet");n(U,j)},$$slots:{icon:!0,default:!0}});var N=o(z,2);it(N,{run:()=>void x(s,!t(s)),icon:"🌚",children:(k,U)=>{$();var M=O("Hello with an optional icon string");n(k,M)},$$slots:{default:!0}}),n(W,V)},children:(W,V)=>{var E=so(),z=o(c(E),2);{let nt=L(()=>`<${t(w)} scoped>
  <Contextmenu>
    {#snippet entries()}
      <ContextmenuEntry run={() => (greeted = !greeted)}>
        Hello world <!-- ${t(l)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_snippet = !greeted_icon_snippet)}>
        {#snippet icon()}🌞{/snippet}
        Hello with an optional icon snippet <!-- ${t(a)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_string = !greeted_icon_string)} icon="🌚">
        Hello with an optional icon string <!-- ${t(s)} -->
      </ContextmenuEntry>
    {/snippet}
    ...markup with the above contextmenu behavior...
  </Contextmenu>
  ...markup with only default contextmenu behavior...
</${t(w)}>
...markup without contextmenu behavior...`);Ft(z,{get content(){return t(nt)}})}var N=o(z,2),k=c(N);let U;var M=c(k);i(k),i(N);var j=o(N,2),I=c(j);let D;var H=c(I);i(I),i(j);var q=o(j,2),Y=c(q);let B;var et=c(Y);i(Y),i(q),$(2),i(E),_t(()=>{U=ht(k,1,"",null,U,{color_g_5:t(l)}),$t(M,`greeted = ${t(l)??""}`),D=ht(I,1,"",null,D,{color_e_5:t(a)}),$t(H,`greeted_icon_snippet = ${t(a)??""}`),B=ht(Y,1,"",null,B,{color_d_5:t(s)}),$t(et,`greeted_icon_string = ${t(s)??""}`)}),n(W,E)},$$slots:{entries:!0,default:!0}}),n(p,g)},$$slots:{default:!0}})},$$slots:{default:!0}})}),n(m,r),xt()}var co=b("<span> </span>");function Wt(m,e){ft(e,!0);const u=ke(e,["$$slots","$$events","$$legacy","glyph","size"]),P="var(--font_size, 1em)",w="var(--font_size, inherit)",l=L(()=>e.size??P);var a=co();$e(a,()=>({...u,class:`glyph display_inline_block text_align_center line_height_1 white_space_nowrap font_weight_400 ${e.class??""}`,[we]:{width:t(l),height:t(l),"min-width":t(l),"min-height":t(l),"font-size":e.size??w}}));var s=c(a,!0);i(a),_t(()=>$t(s,e.glyph)),n(m,a),xt()}var uo=b('<span class="color_f_5">option f</span>'),_o=b('<span class="color_g_5">option g</span>'),vo=b('<span class="color_j_5">option j</span>'),mo=b("<!> <!> <!> <!>",1),po=b('<li class="color_error">Error: <code> </code></li>'),ho=b('<div class="display_flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>'),fo=b(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and control
					it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing you to select multiple colors using the
					activate button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),xo=b("<!> <!>",1);function go(m,e){ft(e,!0);const u=zt.get(),P=L(()=>u.component),w=L(()=>u.name),l=new Jt;let a=J(void 0);const s=L(()=>t(a)?`color_${t(a)}_5`:void 0),r=L(()=>t(a)?`color_${t(a)}`:void 0);var f=st(),F=S(f);Dt(F,()=>t(P),(T,v)=>{v(T,{get contextmenu(){return l},scoped:!0,children:(_,p)=>{At(_,{children:(y,g)=>{var d=xo(),C=S(d);Ot(C,{text:"Custom instance"});var R=o(C,2);Ct(R,{entries:V=>{ee(V,{icon:N=>{$();var k=O("🎨");n(N,k)},menu:N=>{var k=mo(),U=S(k);it(U,{run:()=>(x(a,"f"),{ok:!0,close:!1}),children:(D,H)=>{var q=uo();n(D,q)},$$slots:{default:!0}});var M=o(U,2);it(M,{run:()=>(x(a,"g"),{ok:!0,close:!1}),children:(D,H)=>{var q=_o();n(D,q)},$$slots:{default:!0}});var j=o(M,2);it(j,{run:()=>(x(a,"j"),{ok:!0,close:!1}),children:(D,H)=>{var q=vo();n(D,q)},$$slots:{default:!0}});var I=o(j,2);it(I,{run:()=>(l.close(),{ok:!0}),children:(D,H)=>{$();var q=O("close contextmenu");n(D,q)},$$slots:{default:!0}}),n(N,k)},children:(N,k)=>{$();var U=O("select color");n(N,U)},$$slots:{icon:!0,menu:!0,default:!0}})},children:(V,E)=>{var z=fo(),N=c(z),k=o(c(N)),U=c(k,!0);i(k),$(5),i(N);var M=o(N,2);Ft(M,{lang:"ts",content:"const contextmenu = new ContextmenuState();"});var j=o(M,2);{let X=L(()=>`<${t(w)} {contextmenu} scoped>...</${t(w)}>`);Ft(j,{get content(){return t(X)}})}var I=o(j,2),D=o(c(I));D.textContent="{ok: true, close: false}",$(),i(I);var H=o(I,2),q=o(c(H),2),Y=c(q),B=o(c(Y),2),et=c(B,!0);i(B),i(Y);var nt=o(Y,2),ut=o(c(nt),2),yt=c(ut);i(ut),i(nt);var gt=o(nt,2);{var vt=X=>{var K=po(),ot=o(c(K)),dt=c(ot,!0);i(ot),i(K),_t(()=>$t(dt,l.error)),n(X,K)};Q(gt,X=>{l.error&&X(vt)})}i(q),i(H);var ct=o(H,2);{var mt=X=>{var K=ho(),ot=c(K),dt=c(ot),Nt=c(dt);Wt(Nt,{glyph:"↑"}),i(dt);var St=o(dt,2),h=c(St),A=c(h);Wt(A,{glyph:"←"}),i(h);var G=o(h,2),tt=c(G);Wt(tt,{glyph:"↵"}),i(G);var Z=o(G,2),pt=c(Z);Wt(pt,{glyph:"→"}),i(Z),i(St);var at=o(St,2),Pt=c(at);Wt(Pt,{glyph:"↓"}),i(at),i(ot),i(K),_t(()=>{ht(dt,1,`border_bottom_left_radius_0 border_bottom_right_radius_0 ${t(r)??""}`),dt.disabled=!l.can_select_previous,ht(h,1,`border_bottom_right_radius_0 border_top_right_radius_0 ${t(r)??""}`),h.disabled=!l.can_collapse,ht(G,1,`border_radius_0 ${t(r)??""}`),G.disabled=!l.can_activate,ht(Z,1,`border_bottom_left_radius_0 border_top_left_radius_0 ${t(r)??""}`),Z.disabled=!l.can_expand,ht(at,1,`border_top_left_radius_0 border_top_right_radius_0 ${t(r)??""}`),at.disabled=!l.can_select_next}),kt("mousedown",dt,bt=>{Tt(bt),l.select_previous()},!0),kt("mousedown",h,bt=>{Tt(bt),l.collapse_selected()},!0),kt("mousedown",G,async bt=>{Tt(bt),await l.activate_selected()},!0),kt("mousedown",Z,bt=>{Tt(bt),l.expand_selected()},!0),kt("mousedown",at,bt=>{Tt(bt),l.select_next()},!0),jt(3,K,()=>en),n(X,K)};Q(ct,X=>{l.opened&&X(mt)})}i(z),_t(()=>{$t(U,t(w)),ht(H,1,`mb_md ${t(s)??""}`),$t(et,l.opened),$t(yt,`${l.x??""} && contextmenu.y === ${l.y??""}`)}),n(V,z)},$$slots:{entries:!0,default:!0}}),n(y,d)},$$slots:{default:!0}})},$$slots:{default:!0}})}),n(m,f),xt()}var bo=b(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the browser's
					default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's default
					contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),yo=b("<div><!></div> <!>",1);function $o(m,e){ft(e,!0);const u=zt.get(),P=L(()=>u.component),w=new Jt;let l=J(!1),a=J(void 0);const s=()=>{const y=window.getSelection();if(!y||!t(a))return;const g=document.createRange();g.selectNodeContents(t(a)),y.removeAllRanges(),y.addRange(g)};let r=J("");const f="If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.",F=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`,T=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`,v=L(()=>t(r)===f||t(r)===F||t(r)===T);var _=st(),p=S(_);Dt(p,()=>t(P),(y,g)=>{g(y,{get contextmenu(){return w},scoped:!0,children:(d,C)=>{At(d,{children:(R,W)=>{var V=yo(),E=S(V);let z;var N=c(E);Ot(N,{text:"Select text"}),i(E);var k=o(E,2);Ct(k,{entries:M=>{it(M,{run:()=>void x(l,!t(l)),children:(j,I)=>{$();var D=O("Toggle something");n(j,D)},$$slots:{default:!0}})},children:(M,j)=>{var I=bo();let D;var H=c(I),q=o(c(H),2),Y=o(c(q));Y.__click=s;let B;$(),i(q),i(H),te(H,ot=>x(a,ot),()=>t(a));var et=o(H,2),nt=c(et);Mt(nt),i(et);var ut=o(et,2);let yt;var gt=o(ut,2),vt=c(gt);De(vt),i(gt);var ct=o(gt,2),mt=c(ct);Xt(mt,{path:"Web/HTML/Global_attributes/contenteditable"}),$(),i(ct);var X=o(ct,4),K=o(X,4);$(2),i(I),_t(()=>{D=ht(I,1,"panel p_md",null,D,{color_g_5:t(v)}),B=ht(Y,1,"",null,B,{color_a:t(l)}),yt=ht(ut,1,"",null,yt,{color_g_5:t(v)})}),ge(nt,()=>t(r),ot=>x(r,ot)),ge(vt,()=>t(r),ot=>x(r,ot)),fe("innerText",X,()=>t(r),ot=>x(r,ot)),fe("innerText",K,()=>t(r),ot=>x(r,ot)),n(M,I)},$$slots:{entries:!0,default:!0}}),_t(()=>z=ht(E,1,"",null,z,{color_d_5:t(v)})),n(R,V)},$$slots:{default:!0}})},$$slots:{default:!0}})}),n(m,_),xt()}ue(["click"]);var wo=b('<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>'),Co=b('<li>custom "some custom entry" entry</li>'),ko=b('<li>"copy text" entry when text is selected</li>'),To=b("<li>link entry when clicking on a link</li>"),So=b("<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>",1),Po=b(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing the
			Fuz contextmenu.</p>`),Io=b('<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which ensures the Fuz contextmenu is used</label></div> <!>',1);function Eo(m,e){ft(e,!0);const u=_=>{var p=wo(),y=c(p),g=o(c(y));g.__click=v;let d;$(),i(y),te(y,W=>x(T,W),()=>t(T));var C=o(y,2),R=o(c(C));$(),i(C),i(p),_t(W=>{d=ht(g,1,"",null,d,{color_h:t(F)}),Ce(R,"href",W)},[()=>Qe("/")]),n(_,p)},P=zt.get(),w=L(()=>P.component),l=L(()=>P.name),a=new Jt;let s=J(!1),r=J(!1),f=J(!0),F=J(!1),T=J(void 0);const v=()=>{const _=window.getSelection();if(!_||!t(T))return;const p=document.createRange();p.selectNodeContents(t(T)),_.removeAllRanges(),_.addRange(p)};At(m,{children:(_,p)=>{var y=Io(),g=S(y);Ot(g,{text:"Disable default behaviors"});var d=o(g,4);{let B=L(()=>`<${t(l)}${t(s)?" link_entry={null}":""}${t(r)?" text_entry={null}":""}>`);Ft(d,{get content(){return t(B)}})}var C=o(d,2),R=c(C),W=c(R);Mt(W);var V=o(W,2),E=o(c(V));E.textContent="link_entry={null}",i(V),i(R);var z=o(R,2),N=c(z);Mt(N);var k=o(N,2),U=o(c(k));U.textContent="text_entry={null}",i(k),i(z),i(C);var M=o(C,2);{let B=L(()=>t(s)?null:void 0),et=L(()=>t(r)?null:void 0);Dt(M,()=>t(w),(nt,ut)=>{ut(nt,{get contextmenu(){return a},scoped:!0,get link_entry(){return t(B)},get text_entry(){return t(et)},children:(yt,gt)=>{var vt=st(),ct=S(vt);{var mt=K=>{Ct(K,{entries:dt=>{it(dt,{icon:">",run:()=>void x(F,!t(F)),children:(Nt,St)=>{$();var h=O("some custom entry");n(Nt,h)},$$slots:{default:!0}})},children:(dt,Nt)=>{u(dt)},$$slots:{entries:!0,default:!0}})},X=K=>{u(K)};Q(ct,K=>{t(f)?K(mt):K(X,!1)})}n(yt,vt)},$$slots:{default:!0}})})}var j=o(M,4),I=c(j),D=c(I);Mt(D),$(),i(I),i(j);var H=o(j,2);{var q=B=>{var et=So(),nt=o(S(et),2),ut=c(nt);{var yt=X=>{var K=Co();n(X,K)};Q(ut,X=>{t(f)&&X(yt)})}var gt=o(ut,2);{var vt=X=>{var K=ko();n(X,K)};Q(gt,X=>{t(r)||X(vt)})}var ct=o(gt,2);{var mt=X=>{var K=To();n(X,K)};Q(ct,X=>{t(s)||X(mt)})}i(nt),n(B,et)},Y=B=>{var et=Po();n(B,et)};Q(H,B=>{t(f)||!t(s)||!t(r)?B(q):B(Y,!1)})}se(W,()=>t(s),B=>x(s,B)),se(N,()=>t(r),B=>x(r,B)),se(D,()=>t(f),B=>x(f,B)),n(_,y)},$$slots:{default:!0}}),xt()}ue(["click"]);var Ao=b(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function Oo(m,e){ft(e,!0);const u=zt.get(),P=L(()=>u.component),w=L(()=>u.name);var l=st(),a=S(l);Dt(a,()=>t(P),(s,r)=>{r(s,{scoped:!0,children:(f,F)=>{At(f,{children:(T,v)=>{var _=Ao(),p=S(_);Ot(p,{text:"Default behaviors"});var y=o(p,2),g=c(y);{let d=L(()=>`<${t(w)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${t(w)}>`);Ft(g,{get content(){return t(d)}})}$(6),i(y),n(T,_)},$$slots:{default:!0}})},$$slots:{default:!0}})}),n(m,l),xt()}var zo=b("<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>",1);function aa(m,e){ft(e,!0);const P=qe("Contextmenu");zt.set(),Le(m,{get tome(){return P},children:(w,l)=>{var a=zo(),s=S(a);wn(s,{});var r=o(s,2);lo(r,{});var f=o(r,2);Oo(f,{});var F=o(f,2);$o(F,{});var T=o(F,2);Eo(T,{});var v=o(T,2);go(v,{});var _=o(v,2);ao(_,{});var p=o(_,2);Pn(p),$(2),n(w,a)},$$slots:{default:!0}}),xt()}export{aa as component};
