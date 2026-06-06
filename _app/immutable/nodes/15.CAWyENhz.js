import"../chunks/DsnmJJEf.js";import{p as gt,g as _t,a as A,b as o,c as bt,h as kt,at as Rt,f as w,aw as St,ax as jt,s as e,j as t,u as O,au as se,k as J,bA as Xt,l as f,d as i,r as a,ay as re,t as mt,i as F,n as y,e as Ct,av as Ee,bD as Oe}from"../chunks/Bv2i3XN8.js";import{T as Ae}from"../chunks/euK4p4Jk.js";import{t as ze}from"../chunks/BURr2HFw.js";import{c as qt}from"../chunks/B9PEQVAG.js";import{C as Lt}from"../chunks/Bn9lItu2.js";import{M as Bt}from"../chunks/COv3uwka.js";import{T as zt,a as Nt}from"../chunks/BJ2ZjFLv.js";import{D as At}from"../chunks/ChI0bVKe.js";import{e as Ne,t as Wt,a as le}from"../chunks/CfwofjyR.js";import{h as ne,b as be,S as ye,a as oe,r as Ut,g as xt,s as $e}from"../chunks/xQZ-2mXU.js";import{p as lt,r as we,i as et,s as ie}from"../chunks/CHdldp82.js";import{c as Fe,C as Kt,a as Ce,b as ae,d as ce}from"../chunks/lVF5Cdgk.js";import{a as De,b as Re,c as Le,d as qe,e as Ue,f as He,g as ke,h as Te,i as Zt,j as ue,k as Me,l as We,m as Vt,n as Be,o as Ge,C as de,p as rt}from"../chunks/DfGRO_yI.js";import{D as Se,b as ve}from"../chunks/CNIC-oSp.js";import{a as _e,b as me,c as te}from"../chunks/C5xETj3Y.js";import{c as je}from"../chunks/O47ugk4J.js";import{e as Gt}from"../chunks/D9An0q8k.js";import{b as Jt}from"../chunks/C_V1EYxe.js";import{s as Pt}from"../chunks/V2q5a4YM.js";import{c as Xe,s as Ve}from"../chunks/DfIpPbHs.js";import{G as Ye}from"../chunks/DFVrs5yq.js";import{S as Ke}from"../chunks/Ds32eeZT.js";import{b as Ze}from"../chunks/DlTIwp5G.js";import{C as Je,T as Qe}from"../chunks/DdHsUCU9.js";import{D as tn}from"../chunks/Dp5w4YRd.js";import{r as en}from"../chunks/r73EgQ7T.js";var nn=new Set(["$$slots","$$events","$$legacy","tag","entries","children"]);function Tt(m,n){gt(n,!0);const d=lt(n,"tag",3,"span"),E=we(n,nn);var C=_t(),c=A(C);Ne(c,d,!1,(s,r)=>{ne(s,()=>Fe(n.entries)),be(s,()=>({...E,[ye]:{display:"contents"}}));var l=_t(),g=A(l);kt(g,()=>n.children),o(r,l)}),o(m,C),bt()}const on=(m,n=Rt)=>{ke(m,ie(n))},an=(m,n=Rt)=>{Te(m,ie(n))},sn=(m,n=Rt)=>{Zt(m,ie(n))};var rn=w('<div class="contextmenu-root svelte-1472w04" role="region"><!></div>'),ln=w('<div class="contextmenu-layout svelte-1472w04" aria-hidden="true"></div>'),cn=w('<ul class="contextmenu unstyled pane svelte-1472w04" role="menu" aria-label="context menu" tabindex="-1"></ul>'),un=w("<!> <!> <!>",1);function dn(m,n){gt(n,!0);const d=lt(n,"contextmenu",19,()=>new Kt),E=lt(n,"longpress_move_tolerance",3,De),C=lt(n,"longpress_duration",3,Re),c=lt(n,"bypass_with_tap_then_longpress",3,!0),s=lt(n,"bypass_window",3,Le),r=lt(n,"bypass_move_tolerance",3,qe),l=lt(n,"open_offset_x",3,Ue),g=lt(n,"open_offset_y",3,He),S=lt(n,"scoped",3,!1),$=lt(n,"link_entry",3,on),_=lt(n,"text_entry",3,an),u=lt(n,"separator_entry",3,sn);Ce.set(()=>d());let h=J(void 0);const x=O(()=>d().layout),b=ae.set(),v=O(()=>Be(d().x,b.width,t(x).width)),k=O(()=>Ge(d().y,b.height,t(x).height));let D=J(void 0),G=J(void 0),Z=J(void 0),L=J(void 0),H=J(void 0),z=J(void 0),P=J(void 0),q=J(!1);const M=()=>{document.body.classList.add("contextmenu-pending")},B=()=>{document.body.classList.remove("contextmenu-pending")},T=()=>{f(H,!1),t(L)!=null&&(clearTimeout(t(L)),f(L,null)),B()},R=()=>{f(Z,null),f(D,null),f(G,null),f(z,!1),t(P)!=null&&(clearTimeout(t(P)),f(P,null))},W=()=>{T(),R()},U=p=>{if(t(z)){R();return}const{target:N}=p;if(t(H)){if(t(h)?.contains(N))return;W(),Pt(p);return}ue(N,p.shiftKey)&&(t(h)?.contains(N)||ce(N,p.clientX+l(),p.clientY+g(),d(),{link_enabled:$()!==null,text_enabled:_()!==null,separator_enabled:u()!==null})&&(Pt(p),W()))},j=p=>{f(H,!1),f(q,!1);const{touches:N,target:V}=p;if(d().opened||N.length!==1||!ue(V,p.shiftKey)){W();return}const{clientX:Q,clientY:K}=N[0];if(c()){if(t(Z)!=null&&performance.now()-t(Z)<s()&&Math.hypot(Q-t(D),K-t(G))<r()){f(z,!0),f(Z,null),f(D,null),f(G,null),t(P)!=null&&(clearTimeout(t(P)),f(P,null));return}f(Z,performance.now()),t(P)!=null&&clearTimeout(t(P)),f(P,setTimeout(()=>{R()},s()))}f(D,Q),f(G,K),M(),t(L)!=null&&T(),f(L,setTimeout(()=>{f(H,!0),B(),ce(V,t(D)+l(),t(G)+g(),d(),{link_enabled:$()!==null,text_enabled:_()!==null,separator_enabled:u()!==null})},C()))},I=p=>{if(t(L)==null||d().opened)return;const{touches:N}=p;if(N.length!==1)return;const{clientX:V,clientY:Q}=N[0];if(Math.hypot(V-t(D),Q-t(G))>E()){T();return}p.preventDefault()},tt=p=>{t(L)!=null&&(t(H)&&(Pt(p),f(q,!0)),T()),t(z)&&R()},nt=()=>{W()},ot=p=>{t(h)&&!t(h).contains(p.target)&&d().close()},pt=O(()=>We(d())),ct=O(()=>Me(t(pt))),ut=p=>{const N={passive:!0,capture:!0},V={passive:!1,capture:!0},Q=Xt(p,"touchstart",j,N),K=Xt(p,"touchmove",I,V),ft=Xt(p,"touchend",tt,V),st=Xt(p,"touchcancel",nt,N);return()=>{Q(),K(),ft(),st()}};var dt=un();St("contextmenu",jt,function(...p){(S()?void 0:U)?.apply(this,p)}),St("mousedown",jt,function(...p){(d().opened?ot:void 0)?.apply(this,p)}),St("keydown",jt,function(...p){(d().opened?t(ct):void 0)?.apply(this,p)}),ne(jt,()=>S()?void 0:ut);var ht=A(dt);{var X=p=>{var N=rn(),V=i(N);kt(V,()=>n.children),a(N),ne(N,()=>ut),re("contextmenu",N,U),o(p,N)},Y=p=>{var N=_t(),V=A(N);kt(V,()=>n.children),o(p,N)};et(ht,p=>{S()?p(X):p(Y,-1)})}var at=e(ht,2);{var vt=p=>{var N=ln();Vt(N,"clientWidth",V=>t(x).width=V),Vt(N,"clientHeight",V=>t(x).height=V),o(p,N)};et(at,p=>{d().has_custom_layout||p(vt)})}var Dt=e(at,2);{var It=p=>{var N=cn();let V;Gt(N,20,()=>d().params,Q=>Q,(Q,K)=>{var ft=_t(),st=A(ft);{var Et=wt=>{var it=_t(),Ot=A(it);kt(Ot,()=>K),o(wt,it)},yt=wt=>{var it=_t(),Ot=A(it);kt(Ot,()=>$()??Rt,()=>K.props),o(wt,it)},$t=wt=>{var it=_t(),Ot=A(it);kt(Ot,()=>_()??Rt,()=>K.props),o(wt,it)},Ht=wt=>{var it=_t(),Ot=A(it);kt(Ot,()=>u()??Rt,()=>K.props),o(wt,it)};et(st,wt=>{typeof K=="function"?wt(Et):K.snippet==="link"?wt(yt,1):K.snippet==="text"?wt($t,2):K.snippet==="separator"&&wt(Ht,3)})}o(Q,ft)}),a(N),Jt(N,Q=>f(h,Q),()=>t(h)),mt(()=>V=oe(N,"",V,{transform:`translate3d(${t(v)??""}px, ${t(k)??""}px, 0)`})),St("click",N,function(...Q){(t(q)?K=>{f(q,!1),Pt(K)}:void 0)?.apply(this,Q)},!0),Vt(N,"offsetWidth",Q=>b.width=Q),Vt(N,"offsetHeight",Q=>b.height=Q),o(p,N)};et(Dt,p=>{d().opened&&p(It)})}o(m,dt),bt()}se(["contextmenu"]);const Ft=je(()=>new vn("standard"));class vn{#t=J();get variant(){return t(this.#t)}set variant(n){f(this.#t,n)}#e=O(()=>this.variant==="standard"?de:dn);get component(){return t(this.#e)}set component(n){f(this.#e,n)}#n=O(()=>this.component===de?"ContextmenuRoot":"ContextmenuRootForSafariCompatibility");get name(){return t(this.#n)}set name(n){f(this.#n,n)}constructor(n="standard"){this.variant=n}}var _n=w('<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <!></div></label> <label class="row"><input type="radio"/> <div>iOS compat <!></div></label></fieldset>');function Pe(m,n){gt(n,!0);const d=[],E=Ft.get();var C=_n(),c=e(i(C),2),s=i(c);Ut(s),s.value=s.__value="standard";var r=e(s,2),l=e(i(r));At(l,{name:"ContextmenuRoot"}),a(r),a(c);var g=e(c,2),S=i(g);Ut(S),S.value=S.__value="compat";var $=e(S,2),_=e(i($));At(_,{name:"ContextmenuRootForSafariCompatibility"}),a($),a(g),a(C),_e(d,[],s,()=>E.variant,u=>E.variant=u),_e(d,[],S,()=>E.variant,u=>E.variant=u),o(m,C),bt()}var mn=w('<p class="panel p_md">alert B -- also inherits A</p>'),pn=w('<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>'),hn=w("<code>navigator.vibrate</code>"),fn=w(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
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
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function xn(m,n){gt(n,!0);const d=Ft.get(),E=O(()=>d.component),C=O(()=>d.name);zt(m,{children:(c,s)=>{var r=fn(),l=A(r);Nt(l,{text:"Introduction"});var g=e(l,2),S=e(i(g));Bt(S,{path:"Web/API/Element/contextmenu_event"}),y(3),a(g);var $=e(g,2),_=e(i($));At(_,{name:"ContextmenuRoot"});var u=e(_,2);At(u,{name:"Contextmenu"}),y(),a($);var h=e($,2),x=e(i(h)),b=i(x,!0);a(x);var v=e(x,2);At(v,{name:"Contextmenu"});var k=e(v,2);At(k,{name:"Contextmenu"}),y(),a(h);var D=e(h,2);qt(D,()=>t(E),(M,B)=>{B(M,{scoped:!0,children:(T,R)=>{Tt(T,{entries:U=>{rt(U,{run:()=>alert("alert A"),children:(j,I)=>{y();var tt=F("alert A");o(j,tt)},$$slots:{default:!0}})},children:(U,j)=>{var I=pn(),tt=e(i(I),2);Tt(tt,{entries:ot=>{rt(ot,{run:()=>alert("alert B"),children:(pt,ct)=>{y();var ut=F("alert B");o(pt,ut)},$$slots:{default:!0}})},children:(ot,pt)=>{var ct=mn();o(ot,ct)},$$slots:{entries:!0,default:!0}}),a(I),o(U,I)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var G=e(D,2);Se(G,{summary:B=>{y();var T=F("view code");o(B,T)},children:(B,T)=>{{let R=O(()=>`<${t(C)}>
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
</${t(C)}>`);Lt(B,{get content(){return t(R)}})}},$$slots:{summary:!0,default:!0}});var Z=e(G,2),L=e(i(Z));At(L,{name:"Contextmenu"}),y(),a(Z);var H=e(Z,12),z=e(i(H),2),P=e(i(z));Bt(P,{path:"Web/API/Navigator/vibrate",children:(M,B)=>{var T=hn();o(M,T)},$$slots:{default:!0}}),a(z),a(H);var q=e(H,2);Pe(q,{}),mt(()=>Ct(b,t(C))),o(c,r)},$$slots:{default:!0}}),bt()}var gn=w('<span class="font_family_mono">contextmenu</span> event',1),bn=w(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
		Safari not supporting the <code>contextmenu</code> event as of October 2025, see <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a>.</p> <p>Use <!> by default for better performance and haptic feedback.
		Use <!> only if you need iOS Safari support.</p> <h4>ContextmenuRoot</h4> <ul><li>standard, default implementation</li> <li>relies on the browser's <!></li> <li>much simpler, better performance with fewer and less intrusive event handlers, fewer edge
			cases that can go wrong</li> <li>does not work on iOS Safari until <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a> is fixed</li></ul> <h4>ContextmenuRootForSafariCompatibility</h4> <ul><li>opt-in for iOS</li> <li>some browsers (including mobile Chrome) block <code>navigator.vibrate</code> haptic feedback due
			to the timeout-based gesture detection (because it's not a direct user action)</li> <li>implements custom longpress detection to work around iOS Safari's lack of <code>contextmenu</code> event support</li> <li>works on all devices including iOS Safari</li> <li>more complex implementation with custom touch event handling and gesture detection</li> <li>a longpress is cancelled if you move the touch past a threshold before it triggers</li> <li>opt into this version only if you need iOS Safari support</li></ul> <!>`,1),yn=w(`<!> <p>The Fuz contextmenu provides powerful app-specific UX, but it breaks from normal browser
		behavior by replacing the system contextmenu.</p> <p>To mitigate the downsides:</p> <ul><li>The Fuz contextmenu only replaces the system contextmenu when the DOM tree has defined
			behaviors. Note that <code>a</code> links have default contextmenu behaviors unless disabled. Other
			interactive elements may have default behaviors added in the future.</li> <li>The Fuz contextmenu does not open on elements that allow clipboard pasting like inputs,
			textareas, and contenteditables -- however this may change for better app integration, or be
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),$n=w("<!> <!>",1);function wn(m){var n=$n(),d=A(n);zt(d,{children:(C,c)=>{var s=bn(),r=A(s);Nt(r,{text:"iOS compatibility"});var l=e(r,4),g=e(i(l));At(g,{name:"ContextmenuRoot"});var S=e(g,2);At(S,{name:"ContextmenuRootForSafariCompatibility"}),y(),a(l);var $=e(l,4),_=e(i($),2),u=e(i(_));Bt(u,{path:"Web/API/Element/contextmenu_event",children:(x,b)=>{var v=gn();y(),o(x,v)},$$slots:{default:!0}}),a(_),y(4),a($);var h=e($,6);Pe(h,{}),o(C,s)},$$slots:{default:!0}});var E=e(d,2);zt(E,{children:(C,c)=>{var s=yn(),r=A(s);Nt(r,{text:"Caveats"});var l=e(r,8),g=e(i(l));Bt(g,{path:"Web/API/Element/contextmenu_event"}),y(3),a(l),o(C,s)},$$slots:{default:!0}}),o(m,n)}function Cn(m){const n=m-1;return n*n*n+1}function kn(m){return--m*m*m*m*m+1}function pe(m,{from:n,to:d},E={}){var{delay:C=0,duration:c=L=>Math.sqrt(L)*120,easing:s=Cn}=E,r=getComputedStyle(m),l=r.transform==="none"?"":r.transform,[g,S]=r.transformOrigin.split(" ").map(parseFloat);g/=m.clientWidth,S/=m.clientHeight;var $=Tn(m),_=m.clientWidth/d.width/$,u=m.clientHeight/d.height/$,h=n.left+n.width*g,x=n.top+n.height*S,b=d.left+d.width*g,v=d.top+d.height*S,k=(h-b)*_,D=(x-v)*u,G=n.width/d.width,Z=n.height/d.height;return{delay:C,duration:typeof c=="function"?c(Math.sqrt(k*k+D*D)):c,easing:s,css:(L,H)=>{var z=H*k,P=H*D,q=L+H*G,M=L+H*Z;return`transform: ${l} translate(${z}px, ${P}px) scale(${q}, ${M});`}}}function Tn(m){if("currentCSSZoom"in m)return m.currentCSSZoom;for(var n=m,d=1;n!==null;)d*=+getComputedStyle(n).zoom,n=n.parentElement;return d}var Sn=w('<menu class="pane unstyled svelte-6kuqba"><!></menu>'),Pn=w('<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-label="contextmenu submenmu" aria-haspopup="menu" tabindex="-1"><div class="content"><div class="icon"><!></div> <div class="title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>');function Qt(m,n){gt(n,!0);const d=Ce.get(),E=O(d),C=d().add_submenu(),c=O(()=>t(E).layout),s=O(()=>C.selected);let r=J(void 0);const l=ae.get(),g=ae.set();let S=J(0),$=J(0);Ee(()=>{t(r)&&_(t(r),t(c),l)});const _=(z,P,q)=>{const{x:M,y:B,width:T,height:R}=z.getBoundingClientRect();g.width=T,g.height=R;const W=M-t(S),U=B-t($),j=W+T+q.width-P.width;if(j<=0)f(S,q.width);else{const I=T-W;I<=0?f(S,-T):I>j?f(S,q.width-j):f(S,I-T)}f($,Math.min(0,P.height-(U+R)))};var u=Pn();let h;var x=i(u);let b;var v=i(x),k=i(v),D=i(k);kt(D,()=>n.icon??Rt),a(k);var G=e(k,2),Z=i(G);kt(Z,()=>n.children),a(G),a(v),y(2),a(x);var L=e(x,2);{var H=z=>{var P=Sn();let q;var M=i(P);kt(M,()=>n.menu),a(P),Jt(P,B=>f(r,B),()=>t(r)),mt(()=>q=oe(P,"",q,{transform:`translate3d(${t(S)??""}px, ${t($)??""}px, 0)`,"max-height":`${t(c).height??""}px`})),o(z,P)};et(L,z=>{t(s)&&z(H)})}a(u),mt(()=>{h=oe(u,"",h,{"--contextmenu_depth":C.depth}),b=xt(x,1,"menuitem plain selectable svelte-6kuqba",null,b,{selected:t(s)}),$e(x,"aria-expanded",t(s))}),St("mouseenter",x,z=>{Pt(z),setTimeout(()=>t(E).select(C))}),o(m,u),bt()}var In=w("<!> <!>",1);function Yt(m,n){gt(n,!0);const d=lt(n,"name",3,"Cat"),E=lt(n,"icon",3,"😺");Qt(m,{icon:s=>{y();var r=F();mt(()=>Ct(r,E())),o(s,r)},menu:s=>{var r=In(),l=A(r);rt(l,{run:()=>n.act({type:n.position==="adventure"?"cat_go_home":"cat_go_adventure",name:d()}),icon:$=>{var _=_t(),u=A(_);{var h=b=>{var v=F("🏠");o(b,v)},x=b=>{var v=F("🌄");o(b,v)};et(u,b=>{n.position==="adventure"?b(h):b(x,-1)})}o($,_)},children:($,_)=>{var u=_t(),h=A(u);{var x=v=>{var k=F("go home");o(v,k)},b=v=>{var k=F("go adventure");o(v,k)};et(h,v=>{n.position==="adventure"?v(x):v(b,-1)})}o($,u)},$$slots:{icon:!0,default:!0}});var g=e(l,2);rt(g,{run:()=>n.act({type:"cat_be_or_do",name:d(),position:n.position}),icon:$=>{var _=_t(),u=A(_);{var h=b=>{var v=F("🌄");o(b,v)},x=b=>{var v=F("🏠");o(b,v)};et(u,b=>{n.position==="adventure"?b(h):b(x,-1)})}o($,_)},children:($,_)=>{var u=_t(),h=A(u);{var x=v=>{var k=F("do adventure");o(v,k)},b=v=>{var k=F("be home");o(v,k)};et(h,v=>{n.position==="adventure"?v(x):v(b,-1)})}o($,u)},$$slots:{icon:!0,default:!0}}),o(s,r)},children:(s,r)=>{y();var l=F();mt(()=>Ct(l,d())),o(s,l)},$$slots:{icon:!0,menu:!0,default:!0}}),bt()}var En=w("<!> <!> <!>",1);function On(m,n){var d=En(),E=A(d);ke(E,{href:"https://github.com/fuzdev/fuz_ui",icon:r=>{Ke(r,{get data(){return Ze},size:"var(--icon_size_xs)"})},children:(r,l)=>{y();var g=F("Source code");o(r,g)},$$slots:{icon:!0,default:!0}});var C=e(E,2);Zt(C,{});var c=e(C,2);rt(c,{get run(){return n.toggle_about_dialog},icon:r=>{y();var l=F("?");o(r,l)},children:(r,l)=>{y();var g=F("About");o(r,g)},$$slots:{icon:!0,default:!0}}),o(m,d)}const Ie=m=>{const n=m.length;if(n===2)return"cats";if(n===0)return null;const d=m[0];return d.icon+d.name};var he=w("<!> <!>",1),An=w("<!> <!> <!>",1);function zn(m,n){gt(n,!0);const d=O(()=>Ie(n.adventure_cats));Qt(m,{icon:c=>{y();var s=F("🏠");o(c,s)},menu:c=>{var s=An(),r=A(s);{var l=_=>{var u=he(),h=A(u);rt(h,{run:()=>n.act({type:"call_cats_home"}),icon:v=>{y();var k=F("🐈‍⬛");o(v,k)},children:(v,k)=>{y();var D=F("call");o(v,D)},$$slots:{icon:!0,default:!0}});var x=e(h,2);Zt(x,{}),o(_,u)};et(r,_=>{t(d)&&_(l)})}var g=e(r,2);Gt(g,17,()=>n.home_cats,_=>_.name,(_,u)=>{Yt(_,{get name(){return t(u).name},get icon(){return t(u).icon},get position(){return t(u).position},get act(){return n.act}})});var S=e(g,2);{var $=_=>{var u=he(),h=A(u);rt(h,{run:()=>n.act({type:"cat_be_or_do",name:null,position:"home"}),icon:v=>{y();var k=F("🏠");o(v,k)},children:(v,k)=>{y();var D=F("be");o(v,D)},$$slots:{icon:!0,default:!0}});var x=e(h,2);rt(x,{run:()=>n.act({type:"call_cats_adventure"}),icon:v=>{y();var k=F("🦋");o(v,k)},children:(v,k)=>{y();var D=F("leave");o(v,D)},$$slots:{icon:!0,default:!0}}),o(_,u)};et(S,_=>{t(d)||_($)})}o(c,s)},children:(c,s)=>{y();var r=F("home");o(c,r)},$$slots:{icon:!0,menu:!0,default:!0}}),bt()}var fe=w("<!> <!>",1),Nn=w("<!> <!> <!>",1);function Fn(m,n){gt(n,!0);const d=O(()=>Ie(n.home_cats));Qt(m,{icon:c=>{y();var s=F("🌄");o(c,s)},menu:c=>{var s=Nn(),r=A(s);{var l=_=>{var u=fe(),h=A(u);rt(h,{run:()=>n.act({type:"call_cats_adventure"}),icon:v=>{y();var k=F("🦋");o(v,k)},children:(v,k)=>{y();var D=F("call");o(v,D)},$$slots:{icon:!0,default:!0}});var x=e(h,2);Zt(x,{}),o(_,u)};et(r,_=>{t(d)&&_(l)})}var g=e(r,2);Gt(g,17,()=>n.adventure_cats,_=>_.name,(_,u)=>{Yt(_,{get name(){return t(u).name},get icon(){return t(u).icon},get position(){return t(u).position},get act(){return n.act}})});var S=e(g,2);{var $=_=>{var u=fe(),h=A(u);rt(h,{run:()=>n.act({type:"cat_be_or_do",name:null,position:"adventure"}),icon:v=>{y();var k=F("🌄");o(v,k)},children:(v,k)=>{y();var D=F("do");o(v,D)},$$slots:{icon:!0,default:!0}});var x=e(h,2);rt(x,{run:()=>n.act({type:"call_cats_home"}),icon:v=>{y();var k=F("🐈‍⬛");o(v,k)},children:(v,k)=>{y();var D=F("leave");o(v,D)},$$slots:{icon:!0,default:!0}}),o(_,u)};et(S,_=>{t(d)||_($)})}o(c,s)},children:(c,s)=>{y();var r=F("adventure");o(c,r)},$$slots:{icon:!0,menu:!0,default:!0}}),bt()}var Dn=w('<span class="icon svelte-1py4cgo"> </span>'),Rn=w('<span class="name svelte-1py4cgo"><!> </span>'),Ln=w("<span><!><!></span>");function xe(m,n){const d=lt(n,"name",3,"Cat"),E=lt(n,"icon",3,"😺"),C=lt(n,"show_name",3,!0),c=lt(n,"show_icon",3,!0);var s=Ln();let r;var l=i(s);{var g=_=>{var u=Dn(),h=i(u,!0);a(u),mt(()=>Ct(h,E())),o(_,u)};et(l,_=>{c()&&_(g)})}var S=e(l);{var $=_=>{var u=Rn(),h=i(u);kt(h,()=>n.children??Rt);var x=e(h,1,!0);a(u),mt(()=>Ct(x,d())),o(_,u)};et(S,_=>{C()&&_($)})}a(s),mt(()=>r=xt(s,1,"cat svelte-1py4cgo",null,r,{"has-icon":c()})),o(m,s)}const qn=`<script lang="ts">
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
	let alyssa_position: CatPosition = $state.raw(INITIAL_POSITION);
	let ben_position: CatPosition = $state.raw(INITIAL_POSITION);

	const alyssa_icon = $derived(alyssa_position === ben_position ? '😺' : '😾');
	const ben_icon = $derived(alyssa_position === ben_position ? '😸' : '😿');

	const alyssa_cat = $derived({name: alyssa, icon: alyssa_icon, position: alyssa_position});
	const ben_cat = $derived({name: ben, icon: ben_icon, position: ben_position});

	let swapped = $state.raw(false);

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
			<section class="display:flex">
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
										class="cat-wrapper"
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
										class="cat-wrapper"
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
			<div class="pane p_xl text-align:center">
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
			</div>
		</div>
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
		width: 130px;
	}
</style>
`;var ee=w("<!> <!>",1),ge=w('<div class="cat-wrapper svelte-177dlvm"><!></div>'),Un=w('<div class="position home svelte-177dlvm"><div class="icon svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>'),Hn=w('<div class="position adventure svelte-177dlvm"><div class="icon svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>'),Mn=w('<section class="display:flex"><div><!> <!></div></section> <section><!></section>',1),Wn=w('<div class="mx_auto box"><div class="pane p_xl text-align:center"><h1>About Fuz</h1> <blockquote>Svelte UI library</blockquote> <blockquote>free and open source at<br/><!></blockquote> <code class="display:block p_md mb_lg">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui">@fuzdev/fuz_ui</a></code> <div class="p_xl box"><h2>Color scheme</h2> <!> <h2>Theme</h2> <!></div></div></div>');function Bn(m,n){gt(n,!0);const d=Ft.get(),E=O(()=>d.component),C="Alyssa",c="Ben",s="home";let r=J(s),l=J(s);const g=O(()=>t(r)===t(l)?"😺":"😾"),S=O(()=>t(r)===t(l)?"😸":"😿"),$=O(()=>({name:C,icon:t(g),position:t(r)})),_=O(()=>({name:c,icon:t(S),position:t(l)}));let u=J(!1);const h=(T,R)=>{const W=[],U=[];for(const j of T){const I=j.position==="home"?W:U;R?I.unshift(j):I.push(j)}return{home_cats:W,adventure_cats:U}},x=O(()=>h([t($),t(_)],t(u))),b=O(()=>t(x).home_cats),v=O(()=>t(x).adventure_cats),k=O(()=>t(r)!==s||t(l)!==s),D=()=>{f(r,s),f(l,s)};let G=J(!1);const Z=()=>{f(G,!t(G))},L=T=>{switch(T.type){case"call_cats_adventure":{f(r,"adventure"),f(l,"adventure");break}case"call_cats_home":{f(r,"home"),f(l,"home");break}case"cat_go_adventure":{T.name===C?f(r,"adventure"):T.name===c&&f(l,"adventure");break}case"cat_go_home":{T.name===C?f(r,"home"):T.name===c&&f(l,"home");break}case"cat_be_or_do":{f(u,!t(u));break}}},[H,z]=Xe({fallback:(T,R)=>{const W=window.getComputedStyle(T),U=W.transform==="none"?"":W.transform;return{duration:1500,easing:kn,css:j=>`
					transform: ${U} scale(${j});
					opacity: ${j}
				`}}});var P=ee(),q=A(P);qt(q,()=>t(E),(T,R)=>{R(T,{scoped:!0,children:(W,U)=>{zt(W,{children:(j,I)=>{var tt=ee(),nt=A(tt);Nt(nt,{text:"Full example"});var ot=e(nt,2);Tt(ot,{entries:ct=>{var ut=ee(),dt=A(ut);{var ht=Y=>{Te(Y,{run:D,content:"Reset",icon:"↻"})};et(dt,Y=>{t(k)&&Y(ht)})}var X=e(dt,2);On(X,{toggle_about_dialog:Z}),o(ct,ut)},children:(ct,ut)=>{var dt=Mn(),ht=A(dt),X=i(ht),Y=i(X);Tt(Y,{entries:p=>{zn(p,{act:L,get home_cats(){return t(b)},get adventure_cats(){return t(v)}})},children:(p,N)=>{var V=Un(),Q=e(i(V),2);Gt(Q,29,()=>t(b),({name:K,icon:ft,position:st})=>K,(K,ft)=>{let st=()=>t(ft).name,Et=()=>t(ft).icon,yt=()=>t(ft).position;var $t=ge(),Ht=i($t);Tt(Ht,{entries:it=>{Yt(it,{act:L,get name(){return st()},get icon(){return Et()},get position(){return yt()}})},children:(it,Ot)=>{xe(it,{get name(){return st()},get icon(){return Et()}})},$$slots:{entries:!0,default:!0}}),a($t),Wt(1,$t,()=>z,()=>({key:st()})),Wt(2,$t,()=>H,()=>({key:st()})),le($t,()=>pe,null),o(K,$t)}),a(Q),a(V),o(p,V)},$$slots:{entries:!0,default:!0}});var at=e(Y,2);Tt(at,{entries:p=>{Fn(p,{act:L,get home_cats(){return t(b)},get adventure_cats(){return t(v)}})},children:(p,N)=>{var V=Hn(),Q=e(i(V),2);Gt(Q,29,()=>t(v),({name:K,icon:ft,position:st})=>K,(K,ft)=>{let st=()=>t(ft).name,Et=()=>t(ft).icon,yt=()=>t(ft).position;var $t=ge(),Ht=i($t);Tt(Ht,{entries:it=>{Yt(it,{act:L,get name(){return st()},get icon(){return Et()},get position(){return yt()}})},children:(it,Ot)=>{xe(it,{get name(){return st()},get icon(){return Et()}})},$$slots:{entries:!0,default:!0}}),a($t),Wt(1,$t,()=>z,()=>({key:st()})),Wt(2,$t,()=>H,()=>({key:st()})),le($t,()=>pe,null),o(K,$t)}),a(Q),a(V),o(p,V)},$$slots:{entries:!0,default:!0}}),a(X),a(ht);var vt=e(ht,2),Dt=i(vt);Se(Dt,{summary:p=>{y();var N=F("View example source");o(p,N)},children:(p,N)=>{Lt(p,{get content(){return qn}})},$$slots:{summary:!0,default:!0}}),a(vt),o(ct,dt)},$$slots:{entries:!0,default:!0}}),o(j,tt)},$$slots:{default:!0}})},$$slots:{default:!0}})});var M=e(q,2);{var B=T=>{tn(T,{onclose:()=>f(G,!1),children:(R,W)=>{var U=Wn(),j=i(U),I=e(i(j),4),tt=e(i(I),2);Ye(tt,{path:"fuzdev/fuz_ui"}),a(I);var nt=e(I,4),ot=e(i(nt),2);Je(ot,{});var pt=e(ot,4);Qe(pt,{}),a(nt),a(j),a(U),o(R,U)},$$slots:{default:!0}})};et(M,T=>{t(G)&&T(B)})}o(m,P),bt()}var Gn=w("<!> <!> <!>",1),jn=w(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific element
					instead of the entire page.</aside></div>`),Xn=w("<!> <!>",1);function Vn(m,n){gt(n,!0);const d=Ft.get(),E=O(()=>d.component),C=O(()=>d.name);let c=J(!1),s=J(!1),r=J(!1);var l=_t(),g=A(l);qt(g,()=>t(E),(S,$)=>{$(S,{scoped:!0,children:(_,u)=>{zt(_,{children:(h,x)=>{var b=Xn(),v=A(b);Nt(v,{text:"Basic usage"});var k=e(v,2);Tt(k,{entries:G=>{var Z=Gn(),L=A(Z);rt(L,{run:()=>{f(c,!t(c))},children:(P,q)=>{y();var M=F("Hello world");o(P,M)},$$slots:{default:!0}});var H=e(L,2);rt(H,{run:()=>{f(s,!t(s))},icon:q=>{y();var M=F("🌞");o(q,M)},children:(q,M)=>{y();var B=F("Hello with an optional icon snippet");o(q,B)},$$slots:{icon:!0,default:!0}});var z=e(H,2);rt(z,{run:()=>{f(r,!t(r))},icon:"🌚",children:(P,q)=>{y();var M=F("Hello with an optional icon string");o(P,M)},$$slots:{default:!0}}),o(G,Z)},children:(G,Z)=>{var L=jn(),H=e(i(L),2);{let nt=O(()=>`<${t(C)} scoped>
  <Contextmenu>
    {#snippet entries()}
      <ContextmenuEntry run={() => (greeted = !greeted)}>
        Hello world <!-- ${t(c)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_snippet = !greeted_icon_snippet)}>
        {#snippet icon()}🌞{/snippet}
        Hello with an optional icon snippet <!-- ${t(s)} -->
      </ContextmenuEntry>
      <ContextmenuEntry run={() => (greeted_icon_string = !greeted_icon_string)} icon="🌚">
        Hello with an optional icon string <!-- ${t(r)} -->
      </ContextmenuEntry>
    {/snippet}
    ...markup with the above contextmenu behavior...
  </Contextmenu>
  ...markup with only default contextmenu behavior...
</${t(C)}>
...markup without contextmenu behavior...`);Lt(H,{get content(){return t(nt)}})}var z=e(H,2),P=i(z);let q;var M=i(P);a(P),a(z);var B=e(z,2),T=i(B);let R;var W=i(T);a(T),a(B);var U=e(B,2),j=i(U);let I;var tt=i(j);a(j),a(U),y(2),a(L),mt(()=>{q=xt(P,1,"",null,q,{color_g_5:t(c)}),Ct(M,`greeted = ${t(c)??""}`),R=xt(T,1,"",null,R,{color_e_5:t(s)}),Ct(W,`greeted_icon_snippet = ${t(s)??""}`),I=xt(j,1,"",null,I,{color_d_5:t(r)}),Ct(tt,`greeted_icon_string = ${t(r)??""}`)}),o(G,L)},$$slots:{entries:!0,default:!0}}),o(h,b)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(m,l),bt()}var Yn=new Set(["$$slots","$$events","$$legacy","glyph","size"]),Kn=w("<span> </span>");function Mt(m,n){gt(n,!0);const d=we(n,Yn),E="var(--font_size, 1em)",C="var(--font_size, inherit)",c=O(()=>n.size??E);var s=Kn();be(s,()=>({...d,class:`glyph display:inline-block text-align:center line-height:1 white-space:nowrap font-weight:400 ${n.class??""}`,[ye]:{width:t(c),height:t(c),"min-width":t(c),"min-height":t(c),"font-size":n.size??C}}));var r=i(s,!0);a(s),mt(()=>Ct(r,n.glyph)),o(m,s),bt()}var Zn=w('<span class="color_f_50">option f</span>'),Jn=w('<span class="color_g_50">option g</span>'),Qn=w('<span class="color_j_50">option j</span>'),to=w("<!> <!> <!> <!>",1),eo=w('<li class="color_error">Error: <code> </code></li>'),no=w('<div class="display:flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>'),oo=w(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and control
					it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing you to select multiple colors using the activate
					button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),ao=w("<!> <!>",1);function so(m,n){gt(n,!0);const d=Ft.get(),E=O(()=>d.component),C=O(()=>d.name),c=new Kt;let s=J(void 0);const r=O(()=>t(s)?`color_${t(s)}_5`:void 0),l=O(()=>t(s)?`color_${t(s)}`:void 0);var g=_t(),S=A(g);qt(S,()=>t(E),($,_)=>{_($,{get contextmenu(){return c},scoped:!0,children:(u,h)=>{zt(u,{children:(x,b)=>{var v=ao(),k=A(v);Nt(k,{text:"Custom instance"});var D=e(k,2);Tt(D,{entries:Z=>{Qt(Z,{icon:z=>{y();var P=F("🎨");o(z,P)},menu:z=>{var P=to(),q=A(P);rt(q,{run:()=>(f(s,"f"),{ok:!0,close:!1}),children:(R,W)=>{var U=Zn();o(R,U)},$$slots:{default:!0}});var M=e(q,2);rt(M,{run:()=>(f(s,"g"),{ok:!0,close:!1}),children:(R,W)=>{var U=Jn();o(R,U)},$$slots:{default:!0}});var B=e(M,2);rt(B,{run:()=>(f(s,"j"),{ok:!0,close:!1}),children:(R,W)=>{var U=Qn();o(R,U)},$$slots:{default:!0}});var T=e(B,2);rt(T,{run:()=>(c.close(),{ok:!0}),children:(R,W)=>{y();var U=F("close contextmenu");o(R,U)},$$slots:{default:!0}}),o(z,P)},children:(z,P)=>{y();var q=F("select color");o(z,q)},$$slots:{icon:!0,menu:!0,default:!0}})},children:(Z,L)=>{var H=oo(),z=i(H),P=e(i(z)),q=i(P,!0);a(P),y(5),a(z);var M=e(z,2);Lt(M,{lang:"ts",dangerous_raw_html:'<span class="token_keyword">const</span> contextmenu <span class="token_operator">=</span> <span class="token_keyword">new</span> <span class="token_class_name"><span class="token_capitalized_identifier token_class_name">ContextmenuState</span></span><span class="token_punctuation">(</span><span class="token_punctuation">)</span><span class="token_punctuation">;</span>'});var B=e(M,2);{let X=O(()=>`<${t(C)} {contextmenu} scoped>...</${t(C)}>`);Lt(B,{get content(){return t(X)}})}var T=e(B,2),R=e(i(T));R.textContent="{ok: true, close: false}",y(),a(T);var W=e(T,2),U=e(i(W),2),j=i(U),I=e(i(j),2),tt=i(I,!0);a(I),a(j);var nt=e(j,2),ot=e(i(nt),2),pt=i(ot);a(ot),a(nt);var ct=e(nt,2);{var ut=X=>{var Y=eo(),at=e(i(Y)),vt=i(at,!0);a(at),a(Y),mt(()=>Ct(vt,c.error)),o(X,Y)};et(ct,X=>{c.error&&X(ut)})}a(U),a(W);var dt=e(W,2);{var ht=X=>{var Y=no(),at=i(Y),vt=i(at),Dt=i(vt);Mt(Dt,{glyph:"↑"}),a(vt);var It=e(vt,2),p=i(It),N=i(p);Mt(N,{glyph:"←"}),a(p);var V=e(p,2),Q=i(V);Mt(Q,{glyph:"↵"}),a(V);var K=e(V,2),ft=i(K);Mt(ft,{glyph:"→"}),a(K),a(It);var st=e(It,2),Et=i(st);Mt(Et,{glyph:"↓"}),a(st),a(at),a(Y),mt(()=>{xt(vt,1,`border_bottom_left_radius_0 border_bottom_right_radius_0 ${t(l)??""}`),vt.disabled=!c.can_select_previous,xt(p,1,`border_bottom_right_radius_0 border_top_right_radius_0 ${t(l)??""}`),p.disabled=!c.can_collapse,xt(V,1,`border-radius:0 ${t(l)??""}`),V.disabled=!c.can_activate,xt(K,1,`border_bottom_left_radius_0 border_top_left_radius_0 ${t(l)??""}`),K.disabled=!c.can_expand,xt(st,1,`border_top_left_radius_0 border_top_right_radius_0 ${t(l)??""}`),st.disabled=!c.can_select_next}),St("mousedown",vt,yt=>{Pt(yt),c.select_previous()},!0),St("mousedown",p,yt=>{Pt(yt),c.collapse_selected()},!0),St("mousedown",V,async yt=>{Pt(yt),await c.activate_selected()},!0),St("mousedown",K,yt=>{Pt(yt),c.expand_selected()},!0),St("mousedown",st,yt=>{Pt(yt),c.select_next()},!0),Wt(3,Y,()=>Ve),o(X,Y)};et(dt,X=>{c.opened&&X(ht)})}a(H),mt(()=>{Ct(q,t(C)),xt(W,1,`mb_md ${t(r)??""}`),Ct(tt,c.opened),Ct(pt,`${c.x??""} && contextmenu.y === ${c.y??""}`)}),o(Z,H)},$$slots:{entries:!0,default:!0}}),o(x,v)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(m,g),bt()}var ro=w(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the browser's
					default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's default
					contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),io=w("<div><!></div> <!>",1);function lo(m,n){gt(n,!0);const d=Ft.get(),E=O(()=>d.component),C=new Kt;let c=J(!1),s=J(void 0);const r=()=>{const x=window.getSelection();if(!x||!t(s))return;const b=document.createRange();b.selectNodeContents(t(s)),x.removeAllRanges(),x.addRange(b)};let l=J("");const g="If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.",S=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`,$=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`,_=O(()=>t(l)===g||t(l)===S||t(l)===$);var u=_t(),h=A(u);qt(h,()=>t(E),(x,b)=>{b(x,{get contextmenu(){return C},scoped:!0,children:(v,k)=>{zt(v,{children:(D,G)=>{var Z=io(),L=A(Z);let H;var z=i(L);Nt(z,{text:"Select text"}),a(L);var P=e(L,2);Tt(P,{entries:M=>{rt(M,{run:()=>{f(c,!t(c))},children:(B,T)=>{y();var R=F("Toggle something");o(B,R)},$$slots:{default:!0}})},children:(M,B)=>{var T=ro();let R;var W=i(T),U=e(i(W),2),j=e(i(U));let I;y(),a(U),a(W),Jt(W,at=>f(s,at),()=>t(s));var tt=e(W,2),nt=i(tt);Ut(nt),a(tt);var ot=e(tt,2);let pt;var ct=e(ot,2),ut=i(ct);Oe(ut),a(ct);var dt=e(ct,2),ht=i(dt);Bt(ht,{path:"Web/HTML/Global_attributes/contenteditable"}),y(),a(dt);var X=e(dt,4),Y=e(X,4);y(2),a(T),mt(()=>{R=xt(T,1,"panel p_md",null,R,{color_g_5:t(_)}),I=xt(j,1,"",null,I,{color_a:t(c)}),pt=xt(ot,1,"",null,pt,{color_g_5:t(_)})}),re("click",j,r),me(nt,()=>t(l),at=>f(l,at)),me(ut,()=>t(l),at=>f(l,at)),ve("innerText",X,()=>t(l),at=>f(l,at)),ve("innerText",Y,()=>t(l),at=>f(l,at)),o(M,T)},$$slots:{entries:!0,default:!0}}),mt(()=>H=xt(L,1,"",null,H,{color_d_5:t(_)})),o(D,Z)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(m,u),bt()}se(["click"]);var co=w('<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>'),uo=w('<li>custom "some custom entry" entry</li>'),vo=w('<li>"copy text" entry when text is selected</li>'),_o=w("<li>link entry when clicking on a link</li>"),mo=w("<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>",1),po=w(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing the
			Fuz contextmenu.</p>`),ho=w('<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which ensures the Fuz contextmenu is used</label></div> <!>',1);function fo(m,n){gt(n,!0);const d=u=>{var h=co(),x=i(h),b=e(i(x));let v;y(),a(x),Jt(x,G=>f($,G),()=>t($));var k=e(x,2),D=e(i(k));y(),a(k),a(h),mt(G=>{v=xt(b,1,"",null,v,{color_h:t(S)}),$e(D,"href",G)},[()=>en("/")]),re("click",b,_),o(u,h)},E=Ft.get(),C=O(()=>E.component),c=O(()=>E.name),s=new Kt;let r=J(!1),l=J(!1),g=J(!0),S=J(!1),$=J(void 0);const _=()=>{const u=window.getSelection();if(!u||!t($))return;const h=document.createRange();h.selectNodeContents(t($)),u.removeAllRanges(),u.addRange(h)};zt(m,{children:(u,h)=>{var x=ho(),b=A(x);Nt(b,{text:"Disable default behaviors"});var v=e(b,4);{let I=O(()=>`<${t(c)}${t(r)?" link_entry={null}":""}${t(l)?" text_entry={null}":""}>`);Lt(v,{get content(){return t(I)}})}var k=e(v,2),D=i(k),G=i(D);Ut(G);var Z=e(G,2),L=e(i(Z));L.textContent="link_entry={null}",a(Z),a(D);var H=e(D,2),z=i(H);Ut(z);var P=e(z,2),q=e(i(P));q.textContent="text_entry={null}",a(P),a(H),a(k);var M=e(k,2);{let I=O(()=>t(r)?null:void 0),tt=O(()=>t(l)?null:void 0);qt(M,()=>t(C),(nt,ot)=>{ot(nt,{get contextmenu(){return s},scoped:!0,get link_entry(){return t(I)},get text_entry(){return t(tt)},children:(pt,ct)=>{var ut=_t(),dt=A(ut);{var ht=Y=>{Tt(Y,{entries:vt=>{rt(vt,{icon:">",run:()=>{f(S,!t(S))},children:(Dt,It)=>{y();var p=F("some custom entry");o(Dt,p)},$$slots:{default:!0}})},children:(vt,Dt)=>{d(vt)},$$slots:{entries:!0,default:!0}})},X=Y=>{d(Y)};et(dt,Y=>{t(g)?Y(ht):Y(X,-1)})}o(pt,ut)},$$slots:{default:!0}})})}var B=e(M,4),T=i(B),R=i(T);Ut(R),y(),a(T),a(B);var W=e(B,2);{var U=I=>{var tt=mo(),nt=e(A(tt),2),ot=i(nt);{var pt=X=>{var Y=uo();o(X,Y)};et(ot,X=>{t(g)&&X(pt)})}var ct=e(ot,2);{var ut=X=>{var Y=vo();o(X,Y)};et(ct,X=>{t(l)||X(ut)})}var dt=e(ct,2);{var ht=X=>{var Y=_o();o(X,Y)};et(dt,X=>{t(r)||X(ht)})}a(nt),o(I,tt)},j=I=>{var tt=po();o(I,tt)};et(W,I=>{t(g)||!t(r)||!t(l)?I(U):I(j,-1)})}te(G,()=>t(r),I=>f(r,I)),te(z,()=>t(l),I=>f(l,I)),te(R,()=>t(g),I=>f(g,I)),o(u,x)},$$slots:{default:!0}}),bt()}se(["click"]);var xo=w(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function go(m,n){gt(n,!0);const d=Ft.get(),E=O(()=>d.component),C=O(()=>d.name);var c=_t(),s=A(c);qt(s,()=>t(E),(r,l)=>{l(r,{scoped:!0,children:(g,S)=>{zt(g,{children:($,_)=>{var u=xo(),h=A(u);Nt(h,{text:"Default behaviors"});var x=e(h,2),b=i(x);{let v=O(()=>`<${t(C)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${t(C)}>`);Lt(b,{get content(){return t(v)}})}y(6),a(x),o($,u)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(m,c),bt()}var bo=w("<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>",1);function Vo(m,n){gt(n,!0);const E=ze("Contextmenu");Ft.set(),Ae(m,{get tome(){return E},children:(C,c)=>{var s=bo(),r=A(s);xn(r,{});var l=e(r,2);Vn(l,{});var g=e(l,2);go(g,{});var S=e(g,2);lo(S,{});var $=e(S,2);fo($,{});var _=e($,2);so(_,{});var u=e(_,2);Bn(u,{});var h=e(u,2);wn(h),y(2),o(C,s)},$$slots:{default:!0}}),bt()}export{Vo as component};
