import"../chunks/DsnmJJEf.js";import{p as gt,g as _t,a as I,b as o,c as bt,h as kt,at as Rt,f as w,bx as St,by as jt,s as e,j as t,u as A,aN as se,k as J,bA as Xt,l as f,d as i,r,aO as re,t as pt,i as N,n as y,e as Ct,ax as Ee,bD as Oe}from"../chunks/HfSnbY9A.js";import{T as Ae}from"../chunks/pYdM7io7.js";import{t as ze}from"../chunks/5-_K99ph.js";import{c as qt}from"../chunks/CEIpRyZF.js";import{C as Lt}from"../chunks/UtDx1IsX.js";import{M as Bt}from"../chunks/BWNYP576.js";import{T as zt,a as Dt}from"../chunks/DmHsw19q.js";import{D as At}from"../chunks/D137-bx0.js";import{e as De,t as Wt,a as le}from"../chunks/C69eiurG.js";import{c as ne,b as be,S as ye,a as oe,r as Ut,h as xt,s as $e}from"../chunks/D1cokGW9.js";import{p as ct,r as we,i as et,s as ie}from"../chunks/CrKWhix4.js";import{c as Ne,C as Kt,a as Ce,b as ae,d as ce}from"../chunks/C7DxfHDG.js";import{a as Fe,b as Re,c as Le,d as qe,e as Ue,f as He,g as ke,h as Te,i as Zt,j as ue,k as Me,l as We,m as Vt,n as Be,o as Ge,C as de,p as it}from"../chunks/Csy_391v.js";import{D as Se,b as ve}from"../chunks/CfPBLPVI.js";import{a as me,b as _e,c as te}from"../chunks/DsPy9F__.js";import{c as je}from"../chunks/B2rfFgsW.js";import{e as Gt}from"../chunks/Dw_tH-en.js";import{b as Jt}from"../chunks/BP3O1JAn.js";import{s as Pt}from"../chunks/V2q5a4YM.js";import{c as Xe,s as Ve}from"../chunks/DfIpPbHs.js";import{G as Ye}from"../chunks/JtuLUdcI.js";import{S as Ke}from"../chunks/BkwKEJjz.js";import{b as Ze}from"../chunks/0Fc78T_k.js";import{C as Je,T as Qe}from"../chunks/Bra1dr6A.js";import{D as tn}from"../chunks/DgRCfFSn.js";import{D as en}from"../chunks/DEzU2rUf.js";import{r as nn}from"../chunks/1df4YqJY.js";var on=new Set(["$$slots","$$events","$$legacy","tag","entries","children"]);function Tt(_,n){gt(n,!0);const d=ct(n,"tag",3,"span"),E=we(n,on);var C=_t(),c=I(C);De(c,d,!1,(a,s)=>{ne(a,()=>Ne(n.entries)),be(a,()=>({...E,[ye]:{display:"contents"}}));var l=_t(),g=I(l);kt(g,()=>n.children),o(s,l)}),o(_,C),bt()}const an=(_,n=Rt)=>{ke(_,ie(n))},sn=(_,n=Rt)=>{Te(_,ie(n))},rn=(_,n=Rt)=>{Zt(_,ie(n))};var ln=w('<div class="contextmenu-root svelte-1472w04" role="region"><!></div>'),cn=w('<div class="contextmenu-layout svelte-1472w04" aria-hidden="true"></div>'),un=w('<ul class="contextmenu unstyled pane svelte-1472w04" role="menu" aria-label="context menu" tabindex="-1"></ul>'),dn=w("<!> <!> <!>",1);function vn(_,n){gt(n,!0);const d=ct(n,"contextmenu",19,()=>new Kt),E=ct(n,"longpress_move_tolerance",3,Fe),C=ct(n,"longpress_duration",3,Re),c=ct(n,"bypass_with_tap_then_longpress",3,!0),a=ct(n,"bypass_window",3,Le),s=ct(n,"bypass_move_tolerance",3,qe),l=ct(n,"open_offset_x",3,Ue),g=ct(n,"open_offset_y",3,He),S=ct(n,"scoped",3,!1),$=ct(n,"link_entry",3,an),m=ct(n,"text_entry",3,sn),u=ct(n,"separator_entry",3,rn);Ce.set(()=>d());let h=J(void 0);const x=A(()=>d().layout),b=ae.set(),v=A(()=>Be(d().x,b.width,t(x).width)),k=A(()=>Ge(d().y,b.height,t(x).height));let F=J(void 0),G=J(void 0),Z=J(void 0),L=J(void 0),U=J(void 0),z=J(void 0),P=J(void 0),q=J(!1);const H=()=>{document.body.classList.add("contextmenu-pending")},B=()=>{document.body.classList.remove("contextmenu-pending")},T=()=>{f(U,!1),t(L)!=null&&(clearTimeout(t(L)),f(L,null)),B()},R=()=>{f(Z,null),f(F,null),f(G,null),f(z,!1),t(P)!=null&&(clearTimeout(t(P)),f(P,null))},M=()=>{T(),R()},W=p=>{if(t(z)){R();return}const{target:D}=p;if(t(U)){if(t(h)?.contains(D))return;M(),Pt(p);return}ue(D,p.shiftKey)&&(t(h)?.contains(D)||ce(D,p.clientX+l(),p.clientY+g(),d(),{link_enabled:$()!==null,text_enabled:m()!==null,separator_enabled:u()!==null})&&(Pt(p),M()))},Y=p=>{f(U,!1),f(q,!1);const{touches:D,target:X}=p;if(d().opened||D.length!==1||!ue(X,p.shiftKey)){M();return}const{clientX:tt,clientY:K}=D[0];if(c()){if(t(Z)!=null&&performance.now()-t(Z)<a()&&Math.hypot(tt-t(F),K-t(G))<s()){f(z,!0),f(Z,null),f(F,null),f(G,null),t(P)!=null&&(clearTimeout(t(P)),f(P,null));return}f(Z,performance.now()),t(P)!=null&&clearTimeout(t(P)),f(P,setTimeout(()=>{R()},a()))}f(F,tt),f(G,K),H(),t(L)!=null&&T(),f(L,setTimeout(()=>{f(U,!0),B(),ce(X,t(F)+l(),t(G)+g(),d(),{link_enabled:$()!==null,text_enabled:m()!==null,separator_enabled:u()!==null})},C()))},O=p=>{if(t(L)==null||d().opened)return;const{touches:D}=p;if(D.length!==1)return;const{clientX:X,clientY:tt}=D[0];if(Math.hypot(X-t(F),tt-t(G))>E()){T();return}p.preventDefault()},Q=p=>{t(L)!=null&&(t(U)&&(Pt(p),f(q,!0)),T()),t(z)&&R()},nt=()=>{M()},ot=p=>{t(h)&&!t(h).contains(p.target)&&d().close()},vt=A(()=>We(d())),rt=A(()=>Me(t(vt))),ut=p=>{const D={passive:!0,capture:!0},X={passive:!1,capture:!0},tt=Xt(p,"touchstart",Y,D),K=Xt(p,"touchmove",O,X),ft=Xt(p,"touchend",Q,X),st=Xt(p,"touchcancel",nt,D);return()=>{tt(),K(),ft(),st()}};var dt=dn();St("contextmenu",jt,function(...p){(S()?void 0:W)?.apply(this,p)}),St("mousedown",jt,function(...p){(d().opened?ot:void 0)?.apply(this,p)}),St("keydown",jt,function(...p){(d().opened?t(rt):void 0)?.apply(this,p)}),ne(jt,()=>S()?void 0:ut);var ht=I(dt);{var j=p=>{var D=ln(),X=i(D);kt(X,()=>n.children),r(D),ne(D,()=>ut),re("contextmenu",D,W),o(p,D)},V=p=>{var D=_t(),X=I(D);kt(X,()=>n.children),o(p,D)};et(ht,p=>{S()?p(j):p(V,-1)})}var at=e(ht,2);{var mt=p=>{var D=cn();Vt(D,"clientWidth",X=>t(x).width=X),Vt(D,"clientHeight",X=>t(x).height=X),o(p,D)};et(at,p=>{d().has_custom_layout||p(mt)})}var Ft=e(at,2);{var It=p=>{var D=un();let X;Gt(D,20,()=>d().params,tt=>tt,(tt,K)=>{var ft=_t(),st=I(ft);{var Et=wt=>{var lt=_t(),Ot=I(lt);kt(Ot,()=>K),o(wt,lt)},yt=wt=>{var lt=_t(),Ot=I(lt);kt(Ot,()=>$()??Rt,()=>K.props),o(wt,lt)},$t=wt=>{var lt=_t(),Ot=I(lt);kt(Ot,()=>m()??Rt,()=>K.props),o(wt,lt)},Ht=wt=>{var lt=_t(),Ot=I(lt);kt(Ot,()=>u()??Rt,()=>K.props),o(wt,lt)};et(st,wt=>{typeof K=="function"?wt(Et):K.snippet==="link"?wt(yt,1):K.snippet==="text"?wt($t,2):K.snippet==="separator"&&wt(Ht,3)})}o(tt,ft)}),r(D),Jt(D,tt=>f(h,tt),()=>t(h)),pt(()=>X=oe(D,"",X,{transform:`translate3d(${t(v)??""}px, ${t(k)??""}px, 0)`})),St("click",D,function(...tt){(t(q)?K=>{f(q,!1),Pt(K)}:void 0)?.apply(this,tt)},!0),Vt(D,"offsetWidth",tt=>b.width=tt),Vt(D,"offsetHeight",tt=>b.height=tt),o(p,D)};et(Ft,p=>{d().opened&&p(It)})}o(_,dt),bt()}se(["contextmenu"]);const Nt=je(()=>new mn("standard"));class mn{#t=J();get variant(){return t(this.#t)}set variant(n){f(this.#t,n)}#e=A(()=>this.variant==="standard"?de:vn);get component(){return t(this.#e)}set component(n){f(this.#e,n)}#n=A(()=>this.component===de?"ContextmenuRoot":"ContextmenuRootForSafariCompatibility");get name(){return t(this.#n)}set name(n){f(this.#n,n)}constructor(n="standard"){this.variant=n}}var _n=w('<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <!></div></label> <label class="row"><input type="radio"/> <div>iOS compat <!></div></label></fieldset>');function Pe(_,n){gt(n,!0);const d=[],E=Nt.get();var C=_n(),c=e(i(C),2),a=i(c);Ut(a),a.value=a.__value="standard";var s=e(a,2),l=e(i(s));At(l,{name:"ContextmenuRoot"}),r(s),r(c);var g=e(c,2),S=i(g);Ut(S),S.value=S.__value="compat";var $=e(S,2),m=e(i($));At(m,{name:"ContextmenuRootForSafariCompatibility"}),r($),r(g),r(C),me(d,[],a,()=>E.variant,u=>E.variant=u),me(d,[],S,()=>E.variant,u=>E.variant=u),o(_,C),bt()}var pn=w('<p class="panel p_md">alert B -- also inherits A</p>'),hn=w('<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>'),fn=w("<code>navigator.vibrate</code>"),xn=w(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
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
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function gn(_,n){gt(n,!0);const d=Nt.get(),E=A(()=>d.component),C=A(()=>d.name);zt(_,{children:(c,a)=>{var s=xn(),l=I(s);Dt(l,{text:"Introduction"});var g=e(l,2),S=e(i(g));Bt(S,{path:"Web/API/Element/contextmenu_event"}),y(3),r(g);var $=e(g,2),m=e(i($));At(m,{name:"ContextmenuRoot"});var u=e(m,2);At(u,{name:"Contextmenu"}),y(),r($);var h=e($,2),x=e(i(h)),b=i(x,!0);r(x);var v=e(x,2);At(v,{name:"Contextmenu"});var k=e(v,2);At(k,{name:"Contextmenu"}),y(),r(h);var F=e(h,2);qt(F,()=>t(E),(H,B)=>{B(H,{scoped:!0,children:(T,R)=>{Tt(T,{entries:W=>{it(W,{run:()=>alert("alert A"),children:(Y,O)=>{y();var Q=N("alert A");o(Y,Q)},$$slots:{default:!0}})},children:(W,Y)=>{var O=hn(),Q=e(i(O),2);Tt(Q,{entries:ot=>{it(ot,{run:()=>alert("alert B"),children:(vt,rt)=>{y();var ut=N("alert B");o(vt,ut)},$$slots:{default:!0}})},children:(ot,vt)=>{var rt=pn();o(ot,rt)},$$slots:{entries:!0,default:!0}}),r(O),o(W,O)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var G=e(F,2);Se(G,{summary:B=>{y();var T=N("view code");o(B,T)},children:(B,T)=>{{let R=A(()=>`<${t(C)}>
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
</${t(C)}>`);Lt(B,{get content(){return t(R)}})}},$$slots:{summary:!0,default:!0}});var Z=e(G,2),L=e(i(Z));At(L,{name:"Contextmenu"}),y(),r(Z);var U=e(Z,12),z=e(i(U),2),P=e(i(z));Bt(P,{path:"Web/API/Navigator/vibrate",children:(H,B)=>{var T=fn();o(H,T)},$$slots:{default:!0}}),r(z),r(U);var q=e(U,2);Pe(q,{}),pt(()=>Ct(b,t(C))),o(c,s)},$$slots:{default:!0}}),bt()}var bn=w('<span class="font_family_mono">contextmenu</span> event',1),yn=w(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
		Safari not supporting the <code>contextmenu</code> event as of October 2025, see <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a>.</p> <p>Use <!> by default for better performance and haptic feedback.
		Use <!> only if you need iOS Safari support.</p> <h4>ContextmenuRoot</h4> <ul><li>standard, default implementation</li> <li>relies on the browser's <!></li> <li>much simpler, better performance with fewer and less intrusive event handlers, fewer edge
			cases that can go wrong</li> <li>does not work on iOS Safari until <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a> is fixed</li></ul> <h4>ContextmenuRootForSafariCompatibility</h4> <ul><li>opt-in for iOS</li> <li>some browsers (including mobile Chrome) block <code>navigator.vibrate</code> haptic feedback due
			to the timeout-based gesture detection (because it's not a direct user action)</li> <li>implements custom longpress detection to work around iOS Safari's lack of <code>contextmenu</code> event support</li> <li>works on all devices including iOS Safari</li> <li>more complex implementation with custom touch event handling and gesture detection</li> <li>a longpress is cancelled if you move the touch past a threshold before it triggers</li> <li>opt into this version only if you need iOS Safari support</li></ul> <!>`,1),$n=w(`<!> <p>The Fuz contextmenu provides powerful app-specific UX, but it breaks from normal browser
		behavior by replacing the system contextmenu.</p> <p>To mitigate the downsides:</p> <ul><li>The Fuz contextmenu only replaces the system contextmenu when the DOM tree has defined
			behaviors. Note that <code>a</code> links have default contextmenu behaviors unless disabled. Other
			interactive elements may have default behaviors added in the future.</li> <li>The Fuz contextmenu does not open on elements that allow clipboard pasting like inputs,
			textareas, and contenteditables -- however this may change for better app integration, or be
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),wn=w("<!> <!>",1);function Cn(_){var n=wn(),d=I(n);zt(d,{children:(C,c)=>{var a=yn(),s=I(a);Dt(s,{text:"iOS compatibility"});var l=e(s,4),g=e(i(l));At(g,{name:"ContextmenuRoot"});var S=e(g,2);At(S,{name:"ContextmenuRootForSafariCompatibility"}),y(),r(l);var $=e(l,4),m=e(i($),2),u=e(i(m));Bt(u,{path:"Web/API/Element/contextmenu_event",children:(x,b)=>{var v=bn();y(),o(x,v)},$$slots:{default:!0}}),r(m),y(4),r($);var h=e($,6);Pe(h,{}),o(C,a)},$$slots:{default:!0}});var E=e(d,2);zt(E,{children:(C,c)=>{var a=$n(),s=I(a);Dt(s,{text:"Caveats"});var l=e(s,8),g=e(i(l));Bt(g,{path:"Web/API/Element/contextmenu_event"}),y(3),r(l),o(C,a)},$$slots:{default:!0}}),o(_,n)}function kn(_){const n=_-1;return n*n*n+1}function Tn(_){return--_*_*_*_*_+1}function pe(_,{from:n,to:d},E={}){var{delay:C=0,duration:c=L=>Math.sqrt(L)*120,easing:a=kn}=E,s=getComputedStyle(_),l=s.transform==="none"?"":s.transform,[g,S]=s.transformOrigin.split(" ").map(parseFloat);g/=_.clientWidth,S/=_.clientHeight;var $=Sn(_),m=_.clientWidth/d.width/$,u=_.clientHeight/d.height/$,h=n.left+n.width*g,x=n.top+n.height*S,b=d.left+d.width*g,v=d.top+d.height*S,k=(h-b)*m,F=(x-v)*u,G=n.width/d.width,Z=n.height/d.height;return{delay:C,duration:typeof c=="function"?c(Math.sqrt(k*k+F*F)):c,easing:a,css:(L,U)=>{var z=U*k,P=U*F,q=L+U*G,H=L+U*Z;return`transform: ${l} translate(${z}px, ${P}px) scale(${q}, ${H});`}}}function Sn(_){if("currentCSSZoom"in _)return _.currentCSSZoom;for(var n=_,d=1;n!==null;)d*=+getComputedStyle(n).zoom,n=n.parentElement;return d}var Pn=w('<menu class="pane unstyled svelte-6kuqba"><!></menu>'),In=w('<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-label="contextmenu submenmu" aria-haspopup="menu" tabindex="-1"><div class="content"><div class="icon"><!></div> <div class="title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>');function Qt(_,n){gt(n,!0);const d=Ce.get(),E=A(d),C=d().add_submenu(),c=A(()=>t(E).layout),a=A(()=>C.selected);let s=J(void 0);const l=ae.get(),g=ae.set();let S=J(0),$=J(0);Ee(()=>{t(s)&&m(t(s),t(c),l)});const m=(z,P,q)=>{const{x:H,y:B,width:T,height:R}=z.getBoundingClientRect();g.width=T,g.height=R;const M=H-t(S),W=B-t($),Y=M+T+q.width-P.width;if(Y<=0)f(S,q.width);else{const O=T-M;O<=0?f(S,-T):O>Y?f(S,q.width-Y):f(S,O-T)}f($,Math.min(0,P.height-(W+R)))};var u=In();let h;var x=i(u);let b;var v=i(x),k=i(v),F=i(k);kt(F,()=>n.icon??Rt),r(k);var G=e(k,2),Z=i(G);kt(Z,()=>n.children),r(G),r(v),y(2),r(x);var L=e(x,2);{var U=z=>{var P=Pn();let q;var H=i(P);kt(H,()=>n.menu),r(P),Jt(P,B=>f(s,B),()=>t(s)),pt(()=>q=oe(P,"",q,{transform:`translate3d(${t(S)??""}px, ${t($)??""}px, 0)`,"max-height":`${t(c).height??""}px`})),o(z,P)};et(L,z=>{t(a)&&z(U)})}r(u),pt(()=>{h=oe(u,"",h,{"--contextmenu_depth":C.depth}),b=xt(x,1,"menuitem plain selectable svelte-6kuqba",null,b,{selected:t(a)}),$e(x,"aria-expanded",t(a))}),St("mouseenter",x,z=>{Pt(z),setTimeout(()=>t(E).select(C))}),o(_,u),bt()}var En=w("<!> <!>",1);function Yt(_,n){gt(n,!0);const d=ct(n,"name",3,"Cat"),E=ct(n,"icon",3,"😺");Qt(_,{icon:a=>{y();var s=N();pt(()=>Ct(s,E())),o(a,s)},menu:a=>{var s=En(),l=I(s);it(l,{run:()=>n.act({type:n.position==="adventure"?"cat_go_home":"cat_go_adventure",name:d()}),icon:$=>{var m=_t(),u=I(m);{var h=b=>{var v=N("🏠");o(b,v)},x=b=>{var v=N("🌄");o(b,v)};et(u,b=>{n.position==="adventure"?b(h):b(x,-1)})}o($,m)},children:($,m)=>{var u=_t(),h=I(u);{var x=v=>{var k=N("go home");o(v,k)},b=v=>{var k=N("go adventure");o(v,k)};et(h,v=>{n.position==="adventure"?v(x):v(b,-1)})}o($,u)},$$slots:{icon:!0,default:!0}});var g=e(l,2);it(g,{run:()=>n.act({type:"cat_be_or_do",name:d(),position:n.position}),icon:$=>{var m=_t(),u=I(m);{var h=b=>{var v=N("🌄");o(b,v)},x=b=>{var v=N("🏠");o(b,v)};et(u,b=>{n.position==="adventure"?b(h):b(x,-1)})}o($,m)},children:($,m)=>{var u=_t(),h=I(u);{var x=v=>{var k=N("do adventure");o(v,k)},b=v=>{var k=N("be home");o(v,k)};et(h,v=>{n.position==="adventure"?v(x):v(b,-1)})}o($,u)},$$slots:{icon:!0,default:!0}}),o(a,s)},children:(a,s)=>{y();var l=N();pt(()=>Ct(l,d())),o(a,l)},$$slots:{icon:!0,menu:!0,default:!0}}),bt()}var On=w("<!> <!> <!>",1);function An(_,n){var d=On(),E=I(d);ke(E,{href:"https://github.com/fuzdev/fuz_ui",icon:s=>{Ke(s,{get data(){return Ze},size:"var(--icon_size_xs)"})},children:(s,l)=>{y();var g=N("Source code");o(s,g)},$$slots:{icon:!0,default:!0}});var C=e(E,2);Zt(C,{});var c=e(C,2);it(c,{get run(){return n.toggle_about_dialog},icon:s=>{y();var l=N("?");o(s,l)},children:(s,l)=>{y();var g=N("About");o(s,g)},$$slots:{icon:!0,default:!0}}),o(_,d)}const Ie=_=>{const n=_.length;if(n===2)return"cats";if(n===0)return null;const d=_[0];return d.icon+d.name};var he=w("<!> <!>",1),zn=w("<!> <!> <!>",1);function Dn(_,n){gt(n,!0);const d=A(()=>Ie(n.adventure_cats));Qt(_,{icon:c=>{y();var a=N("🏠");o(c,a)},menu:c=>{var a=zn(),s=I(a);{var l=m=>{var u=he(),h=I(u);it(h,{run:()=>n.act({type:"call_cats_home"}),icon:v=>{y();var k=N("🐈‍⬛");o(v,k)},children:(v,k)=>{y();var F=N("call");o(v,F)},$$slots:{icon:!0,default:!0}});var x=e(h,2);Zt(x,{}),o(m,u)};et(s,m=>{t(d)&&m(l)})}var g=e(s,2);Gt(g,17,()=>n.home_cats,m=>m.name,(m,u)=>{Yt(m,{get name(){return t(u).name},get icon(){return t(u).icon},get position(){return t(u).position},get act(){return n.act}})});var S=e(g,2);{var $=m=>{var u=he(),h=I(u);it(h,{run:()=>n.act({type:"cat_be_or_do",name:null,position:"home"}),icon:v=>{y();var k=N("🏠");o(v,k)},children:(v,k)=>{y();var F=N("be");o(v,F)},$$slots:{icon:!0,default:!0}});var x=e(h,2);it(x,{run:()=>n.act({type:"call_cats_adventure"}),icon:v=>{y();var k=N("🦋");o(v,k)},children:(v,k)=>{y();var F=N("leave");o(v,F)},$$slots:{icon:!0,default:!0}}),o(m,u)};et(S,m=>{t(d)||m($)})}o(c,a)},children:(c,a)=>{y();var s=N("home");o(c,s)},$$slots:{icon:!0,menu:!0,default:!0}}),bt()}var fe=w("<!> <!>",1),Nn=w("<!> <!> <!>",1);function Fn(_,n){gt(n,!0);const d=A(()=>Ie(n.home_cats));Qt(_,{icon:c=>{y();var a=N("🌄");o(c,a)},menu:c=>{var a=Nn(),s=I(a);{var l=m=>{var u=fe(),h=I(u);it(h,{run:()=>n.act({type:"call_cats_adventure"}),icon:v=>{y();var k=N("🦋");o(v,k)},children:(v,k)=>{y();var F=N("call");o(v,F)},$$slots:{icon:!0,default:!0}});var x=e(h,2);Zt(x,{}),o(m,u)};et(s,m=>{t(d)&&m(l)})}var g=e(s,2);Gt(g,17,()=>n.adventure_cats,m=>m.name,(m,u)=>{Yt(m,{get name(){return t(u).name},get icon(){return t(u).icon},get position(){return t(u).position},get act(){return n.act}})});var S=e(g,2);{var $=m=>{var u=fe(),h=I(u);it(h,{run:()=>n.act({type:"cat_be_or_do",name:null,position:"adventure"}),icon:v=>{y();var k=N("🌄");o(v,k)},children:(v,k)=>{y();var F=N("do");o(v,F)},$$slots:{icon:!0,default:!0}});var x=e(h,2);it(x,{run:()=>n.act({type:"call_cats_home"}),icon:v=>{y();var k=N("🐈‍⬛");o(v,k)},children:(v,k)=>{y();var F=N("leave");o(v,F)},$$slots:{icon:!0,default:!0}}),o(m,u)};et(S,m=>{t(d)||m($)})}o(c,a)},children:(c,a)=>{y();var s=N("adventure");o(c,s)},$$slots:{icon:!0,menu:!0,default:!0}}),bt()}var Rn=w('<span class="icon svelte-1py4cgo"> </span>'),Ln=w('<span class="name svelte-1py4cgo"><!> </span>'),qn=w("<span><!><!></span>");function xe(_,n){const d=ct(n,"name",3,"Cat"),E=ct(n,"icon",3,"😺"),C=ct(n,"show_name",3,!0),c=ct(n,"show_icon",3,!0);var a=qn();let s;var l=i(a);{var g=m=>{var u=Rn(),h=i(u,!0);r(u),pt(()=>Ct(h,E())),o(m,u)};et(l,m=>{c()&&m(g)})}var S=e(l);{var $=m=>{var u=Ln(),h=i(u);kt(h,()=>n.children??Rt);var x=e(h,1,!0);r(u),pt(()=>Ct(x,d())),o(m,u)};et(S,m=>{C()&&m($)})}r(a),pt(()=>s=xt(a,1,"cat svelte-1py4cgo",null,s,{"has-icon":c()})),o(_,a)}const Un=`<script lang="ts">
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
		width: 130px;
	}
</style>
`;var ee=w("<!> <!>",1),ge=w('<div class="cat-wrapper svelte-177dlvm"><!></div>'),Hn=w('<div class="position home svelte-177dlvm"><div class="icon svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>'),Mn=w('<div class="position adventure svelte-177dlvm"><div class="icon svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>'),Wn=w('<section class="display:flex"><div><!> <!></div></section> <section><!></section>',1),Bn=w('<h1>About Fuz</h1> <blockquote>Svelte UI library</blockquote> <blockquote>free and open source at<br/><!></blockquote> <code class="display:block p_md mb_lg">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui">@fuzdev/fuz_ui</a></code> <div class="p_xl box"><h2>Color scheme</h2> <!> <h2>Theme</h2> <!></div>',1);function Gn(_,n){gt(n,!0);const d=Nt.get(),E=A(()=>d.component),C="Alyssa",c="Ben",a="home";let s=J(a),l=J(a);const g=A(()=>t(s)===t(l)?"😺":"😾"),S=A(()=>t(s)===t(l)?"😸":"😿"),$=A(()=>({name:C,icon:t(g),position:t(s)})),m=A(()=>({name:c,icon:t(S),position:t(l)}));let u=J(!1);const h=(T,R)=>{const M=[],W=[];for(const Y of T){const O=Y.position==="home"?M:W;R?O.unshift(Y):O.push(Y)}return{home_cats:M,adventure_cats:W}},x=A(()=>h([t($),t(m)],t(u))),b=A(()=>t(x).home_cats),v=A(()=>t(x).adventure_cats),k=A(()=>t(s)!==a||t(l)!==a),F=()=>{f(s,a),f(l,a)};let G=J(!1);const Z=()=>{f(G,!t(G))},L=T=>{switch(T.type){case"call_cats_adventure":{f(s,"adventure"),f(l,"adventure");break}case"call_cats_home":{f(s,"home"),f(l,"home");break}case"cat_go_adventure":{T.name===C?f(s,"adventure"):T.name===c&&f(l,"adventure");break}case"cat_go_home":{T.name===C?f(s,"home"):T.name===c&&f(l,"home");break}case"cat_be_or_do":{f(u,!t(u));break}}},[U,z]=Xe({fallback:(T,R)=>{const M=window.getComputedStyle(T),W=M.transform==="none"?"":M.transform;return{duration:1500,easing:Tn,css:Y=>`
					transform: ${W} scale(${Y});
					opacity: ${Y}
				`}}});var P=ee(),q=I(P);qt(q,()=>t(E),(T,R)=>{R(T,{scoped:!0,children:(M,W)=>{zt(M,{children:(Y,O)=>{var Q=ee(),nt=I(Q);Dt(nt,{text:"Full example"});var ot=e(nt,2);Tt(ot,{entries:rt=>{var ut=ee(),dt=I(ut);{var ht=V=>{Te(V,{run:F,content:"Reset",icon:"↻"})};et(dt,V=>{t(k)&&V(ht)})}var j=e(dt,2);An(j,{toggle_about_dialog:Z}),o(rt,ut)},children:(rt,ut)=>{var dt=Wn(),ht=I(dt),j=i(ht),V=i(j);Tt(V,{entries:p=>{Dn(p,{act:L,get home_cats(){return t(b)},get adventure_cats(){return t(v)}})},children:(p,D)=>{var X=Hn(),tt=e(i(X),2);Gt(tt,29,()=>t(b),({name:K,icon:ft,position:st})=>K,(K,ft)=>{let st=()=>t(ft).name,Et=()=>t(ft).icon,yt=()=>t(ft).position;var $t=ge(),Ht=i($t);Tt(Ht,{entries:lt=>{Yt(lt,{act:L,get name(){return st()},get icon(){return Et()},get position(){return yt()}})},children:(lt,Ot)=>{xe(lt,{get name(){return st()},get icon(){return Et()}})},$$slots:{entries:!0,default:!0}}),r($t),Wt(1,$t,()=>z,()=>({key:st()})),Wt(2,$t,()=>U,()=>({key:st()})),le($t,()=>pe,null),o(K,$t)}),r(tt),r(X),o(p,X)},$$slots:{entries:!0,default:!0}});var at=e(V,2);Tt(at,{entries:p=>{Fn(p,{act:L,get home_cats(){return t(b)},get adventure_cats(){return t(v)}})},children:(p,D)=>{var X=Mn(),tt=e(i(X),2);Gt(tt,29,()=>t(v),({name:K,icon:ft,position:st})=>K,(K,ft)=>{let st=()=>t(ft).name,Et=()=>t(ft).icon,yt=()=>t(ft).position;var $t=ge(),Ht=i($t);Tt(Ht,{entries:lt=>{Yt(lt,{act:L,get name(){return st()},get icon(){return Et()},get position(){return yt()}})},children:(lt,Ot)=>{xe(lt,{get name(){return st()},get icon(){return Et()}})},$$slots:{entries:!0,default:!0}}),r($t),Wt(1,$t,()=>z,()=>({key:st()})),Wt(2,$t,()=>U,()=>({key:st()})),le($t,()=>pe,null),o(K,$t)}),r(tt),r(X),o(p,X)},$$slots:{entries:!0,default:!0}}),r(j),r(ht);var mt=e(ht,2),Ft=i(mt);Se(Ft,{summary:p=>{y();var D=N("View example source");o(p,D)},children:(p,D)=>{Lt(p,{get content(){return Un}})},$$slots:{summary:!0,default:!0}}),r(mt),o(rt,dt)},$$slots:{entries:!0,default:!0}}),o(Y,Q)},$$slots:{default:!0}})},$$slots:{default:!0}})});var H=e(q,2);{var B=T=>{tn(T,{onclose:()=>f(G,!1),children:(R,M)=>{en(R,{children:(W,Y)=>{var O=Bn(),Q=e(I(O),4),nt=e(i(Q),2);Ye(nt,{path:"fuzdev/fuz_ui"}),r(Q);var ot=e(Q,4),vt=e(i(ot),2);Je(vt,{});var rt=e(vt,4);Qe(rt,{}),r(ot),o(W,O)},$$slots:{default:!0}})},$$slots:{default:!0}})};et(H,T=>{t(G)&&T(B)})}o(_,P),bt()}var jn=w("<!> <!> <!>",1),Xn=w(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific element
					instead of the entire page.</aside></div>`),Vn=w("<!> <!>",1);function Yn(_,n){gt(n,!0);const d=Nt.get(),E=A(()=>d.component),C=A(()=>d.name);let c=J(!1),a=J(!1),s=J(!1);var l=_t(),g=I(l);qt(g,()=>t(E),(S,$)=>{$(S,{scoped:!0,children:(m,u)=>{zt(m,{children:(h,x)=>{var b=Vn(),v=I(b);Dt(v,{text:"Basic usage"});var k=e(v,2);Tt(k,{entries:G=>{var Z=jn(),L=I(Z);it(L,{run:()=>{f(c,!t(c))},children:(P,q)=>{y();var H=N("Hello world");o(P,H)},$$slots:{default:!0}});var U=e(L,2);it(U,{run:()=>{f(a,!t(a))},icon:q=>{y();var H=N("🌞");o(q,H)},children:(q,H)=>{y();var B=N("Hello with an optional icon snippet");o(q,B)},$$slots:{icon:!0,default:!0}});var z=e(U,2);it(z,{run:()=>{f(s,!t(s))},icon:"🌚",children:(P,q)=>{y();var H=N("Hello with an optional icon string");o(P,H)},$$slots:{default:!0}}),o(G,Z)},children:(G,Z)=>{var L=Xn(),U=e(i(L),2);{let nt=A(()=>`<${t(C)} scoped>
  <Contextmenu>
    {#snippet entries()}
      <ContextmenuEntry run={() => (greeted = !greeted)}>
        Hello world <!-- ${t(c)} -->
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
</${t(C)}>
...markup without contextmenu behavior...`);Lt(U,{get content(){return t(nt)}})}var z=e(U,2),P=i(z);let q;var H=i(P);r(P),r(z);var B=e(z,2),T=i(B);let R;var M=i(T);r(T),r(B);var W=e(B,2),Y=i(W);let O;var Q=i(Y);r(Y),r(W),y(2),r(L),pt(()=>{q=xt(P,1,"",null,q,{color_g_5:t(c)}),Ct(H,`greeted = ${t(c)??""}`),R=xt(T,1,"",null,R,{color_e_5:t(a)}),Ct(M,`greeted_icon_snippet = ${t(a)??""}`),O=xt(Y,1,"",null,O,{color_d_5:t(s)}),Ct(Q,`greeted_icon_string = ${t(s)??""}`)}),o(G,L)},$$slots:{entries:!0,default:!0}}),o(h,b)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(_,l),bt()}var Kn=new Set(["$$slots","$$events","$$legacy","glyph","size"]),Zn=w("<span> </span>");function Mt(_,n){gt(n,!0);const d=we(n,Kn),E="var(--font_size, 1em)",C="var(--font_size, inherit)",c=A(()=>n.size??E);var a=Zn();be(a,()=>({...d,class:`glyph display:inline-block text-align:center line-height:1 white-space:nowrap font-weight:400 ${n.class??""}`,[ye]:{width:t(c),height:t(c),"min-width":t(c),"min-height":t(c),"font-size":n.size??C}}));var s=i(a,!0);r(a),pt(()=>Ct(s,n.glyph)),o(_,a),bt()}var Jn=w('<span class="color_f_50">option f</span>'),Qn=w('<span class="color_g_50">option g</span>'),to=w('<span class="color_j_50">option j</span>'),eo=w("<!> <!> <!> <!>",1),no=w('<li class="color_error">Error: <code> </code></li>'),oo=w('<div class="display:flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>'),ao=w(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and control
					it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing you to select multiple colors using the activate
					button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),so=w("<!> <!>",1);function ro(_,n){gt(n,!0);const d=Nt.get(),E=A(()=>d.component),C=A(()=>d.name),c=new Kt;let a=J(void 0);const s=A(()=>t(a)?`color_${t(a)}_5`:void 0),l=A(()=>t(a)?`color_${t(a)}`:void 0);var g=_t(),S=I(g);qt(S,()=>t(E),($,m)=>{m($,{get contextmenu(){return c},scoped:!0,children:(u,h)=>{zt(u,{children:(x,b)=>{var v=so(),k=I(v);Dt(k,{text:"Custom instance"});var F=e(k,2);Tt(F,{entries:Z=>{Qt(Z,{icon:z=>{y();var P=N("🎨");o(z,P)},menu:z=>{var P=eo(),q=I(P);it(q,{run:()=>(f(a,"f"),{ok:!0,close:!1}),children:(R,M)=>{var W=Jn();o(R,W)},$$slots:{default:!0}});var H=e(q,2);it(H,{run:()=>(f(a,"g"),{ok:!0,close:!1}),children:(R,M)=>{var W=Qn();o(R,W)},$$slots:{default:!0}});var B=e(H,2);it(B,{run:()=>(f(a,"j"),{ok:!0,close:!1}),children:(R,M)=>{var W=to();o(R,W)},$$slots:{default:!0}});var T=e(B,2);it(T,{run:()=>(c.close(),{ok:!0}),children:(R,M)=>{y();var W=N("close contextmenu");o(R,W)},$$slots:{default:!0}}),o(z,P)},children:(z,P)=>{y();var q=N("select color");o(z,q)},$$slots:{icon:!0,menu:!0,default:!0}})},children:(Z,L)=>{var U=ao(),z=i(U),P=e(i(z)),q=i(P,!0);r(P),y(5),r(z);var H=e(z,2);Lt(H,{lang:"ts",dangerous_raw_html:'<span class="token_keyword">const</span> contextmenu <span class="token_operator">=</span> <span class="token_keyword">new</span> <span class="token_class_name"><span class="token_capitalized_identifier token_class_name">ContextmenuState</span></span><span class="token_punctuation">(</span><span class="token_punctuation">)</span><span class="token_punctuation">;</span>'});var B=e(H,2);{let j=A(()=>`<${t(C)} {contextmenu} scoped>...</${t(C)}>`);Lt(B,{get content(){return t(j)}})}var T=e(B,2),R=e(i(T));R.textContent="{ok: true, close: false}",y(),r(T);var M=e(T,2),W=e(i(M),2),Y=i(W),O=e(i(Y),2),Q=i(O,!0);r(O),r(Y);var nt=e(Y,2),ot=e(i(nt),2),vt=i(ot);r(ot),r(nt);var rt=e(nt,2);{var ut=j=>{var V=no(),at=e(i(V)),mt=i(at,!0);r(at),r(V),pt(()=>Ct(mt,c.error)),o(j,V)};et(rt,j=>{c.error&&j(ut)})}r(W),r(M);var dt=e(M,2);{var ht=j=>{var V=oo(),at=i(V),mt=i(at),Ft=i(mt);Mt(Ft,{glyph:"↑"}),r(mt);var It=e(mt,2),p=i(It),D=i(p);Mt(D,{glyph:"←"}),r(p);var X=e(p,2),tt=i(X);Mt(tt,{glyph:"↵"}),r(X);var K=e(X,2),ft=i(K);Mt(ft,{glyph:"→"}),r(K),r(It);var st=e(It,2),Et=i(st);Mt(Et,{glyph:"↓"}),r(st),r(at),r(V),pt(()=>{xt(mt,1,`border_bottom_left_radius_0 border_bottom_right_radius_0 ${t(l)??""}`),mt.disabled=!c.can_select_previous,xt(p,1,`border_bottom_right_radius_0 border_top_right_radius_0 ${t(l)??""}`),p.disabled=!c.can_collapse,xt(X,1,`border-radius:0 ${t(l)??""}`),X.disabled=!c.can_activate,xt(K,1,`border_bottom_left_radius_0 border_top_left_radius_0 ${t(l)??""}`),K.disabled=!c.can_expand,xt(st,1,`border_top_left_radius_0 border_top_right_radius_0 ${t(l)??""}`),st.disabled=!c.can_select_next}),St("mousedown",mt,yt=>{Pt(yt),c.select_previous()},!0),St("mousedown",p,yt=>{Pt(yt),c.collapse_selected()},!0),St("mousedown",X,async yt=>{Pt(yt),await c.activate_selected()},!0),St("mousedown",K,yt=>{Pt(yt),c.expand_selected()},!0),St("mousedown",st,yt=>{Pt(yt),c.select_next()},!0),Wt(3,V,()=>Ve),o(j,V)};et(dt,j=>{c.opened&&j(ht)})}r(U),pt(()=>{Ct(q,t(C)),xt(M,1,`mb_md ${t(s)??""}`),Ct(Q,c.opened),Ct(vt,`${c.x??""} && contextmenu.y === ${c.y??""}`)}),o(Z,U)},$$slots:{entries:!0,default:!0}}),o(x,v)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(_,g),bt()}var io=w(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the browser's
					default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's default
					contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),lo=w("<div><!></div> <!>",1);function co(_,n){gt(n,!0);const d=Nt.get(),E=A(()=>d.component),C=new Kt;let c=J(!1),a=J(void 0);const s=()=>{const x=window.getSelection();if(!x||!t(a))return;const b=document.createRange();b.selectNodeContents(t(a)),x.removeAllRanges(),x.addRange(b)};let l=J("");const g="If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.",S=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`,$=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`,m=A(()=>t(l)===g||t(l)===S||t(l)===$);var u=_t(),h=I(u);qt(h,()=>t(E),(x,b)=>{b(x,{get contextmenu(){return C},scoped:!0,children:(v,k)=>{zt(v,{children:(F,G)=>{var Z=lo(),L=I(Z);let U;var z=i(L);Dt(z,{text:"Select text"}),r(L);var P=e(L,2);Tt(P,{entries:H=>{it(H,{run:()=>{f(c,!t(c))},children:(B,T)=>{y();var R=N("Toggle something");o(B,R)},$$slots:{default:!0}})},children:(H,B)=>{var T=io();let R;var M=i(T),W=e(i(M),2),Y=e(i(W));let O;y(),r(W),r(M),Jt(M,at=>f(a,at),()=>t(a));var Q=e(M,2),nt=i(Q);Ut(nt),r(Q);var ot=e(Q,2);let vt;var rt=e(ot,2),ut=i(rt);Oe(ut),r(rt);var dt=e(rt,2),ht=i(dt);Bt(ht,{path:"Web/HTML/Global_attributes/contenteditable"}),y(),r(dt);var j=e(dt,4),V=e(j,4);y(2),r(T),pt(()=>{R=xt(T,1,"panel p_md",null,R,{color_g_5:t(m)}),O=xt(Y,1,"",null,O,{color_a:t(c)}),vt=xt(ot,1,"",null,vt,{color_g_5:t(m)})}),re("click",Y,s),_e(nt,()=>t(l),at=>f(l,at)),_e(ut,()=>t(l),at=>f(l,at)),ve("innerText",j,()=>t(l),at=>f(l,at)),ve("innerText",V,()=>t(l),at=>f(l,at)),o(H,T)},$$slots:{entries:!0,default:!0}}),pt(()=>U=xt(L,1,"",null,U,{color_d_5:t(m)})),o(F,Z)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(_,u),bt()}se(["click"]);var uo=w('<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>'),vo=w('<li>custom "some custom entry" entry</li>'),mo=w('<li>"copy text" entry when text is selected</li>'),_o=w("<li>link entry when clicking on a link</li>"),po=w("<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>",1),ho=w(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing the
			Fuz contextmenu.</p>`),fo=w('<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which ensures the Fuz contextmenu is used</label></div> <!>',1);function xo(_,n){gt(n,!0);const d=u=>{var h=uo(),x=i(h),b=e(i(x));let v;y(),r(x),Jt(x,G=>f($,G),()=>t($));var k=e(x,2),F=e(i(k));y(),r(k),r(h),pt(G=>{v=xt(b,1,"",null,v,{color_h:t(S)}),$e(F,"href",G)},[()=>nn("/")]),re("click",b,m),o(u,h)},E=Nt.get(),C=A(()=>E.component),c=A(()=>E.name),a=new Kt;let s=J(!1),l=J(!1),g=J(!0),S=J(!1),$=J(void 0);const m=()=>{const u=window.getSelection();if(!u||!t($))return;const h=document.createRange();h.selectNodeContents(t($)),u.removeAllRanges(),u.addRange(h)};zt(_,{children:(u,h)=>{var x=fo(),b=I(x);Dt(b,{text:"Disable default behaviors"});var v=e(b,4);{let O=A(()=>`<${t(c)}${t(s)?" link_entry={null}":""}${t(l)?" text_entry={null}":""}>`);Lt(v,{get content(){return t(O)}})}var k=e(v,2),F=i(k),G=i(F);Ut(G);var Z=e(G,2),L=e(i(Z));L.textContent="link_entry={null}",r(Z),r(F);var U=e(F,2),z=i(U);Ut(z);var P=e(z,2),q=e(i(P));q.textContent="text_entry={null}",r(P),r(U),r(k);var H=e(k,2);{let O=A(()=>t(s)?null:void 0),Q=A(()=>t(l)?null:void 0);qt(H,()=>t(C),(nt,ot)=>{ot(nt,{get contextmenu(){return a},scoped:!0,get link_entry(){return t(O)},get text_entry(){return t(Q)},children:(vt,rt)=>{var ut=_t(),dt=I(ut);{var ht=V=>{Tt(V,{entries:mt=>{it(mt,{icon:">",run:()=>{f(S,!t(S))},children:(Ft,It)=>{y();var p=N("some custom entry");o(Ft,p)},$$slots:{default:!0}})},children:(mt,Ft)=>{d(mt)},$$slots:{entries:!0,default:!0}})},j=V=>{d(V)};et(dt,V=>{t(g)?V(ht):V(j,-1)})}o(vt,ut)},$$slots:{default:!0}})})}var B=e(H,4),T=i(B),R=i(T);Ut(R),y(),r(T),r(B);var M=e(B,2);{var W=O=>{var Q=po(),nt=e(I(Q),2),ot=i(nt);{var vt=j=>{var V=vo();o(j,V)};et(ot,j=>{t(g)&&j(vt)})}var rt=e(ot,2);{var ut=j=>{var V=mo();o(j,V)};et(rt,j=>{t(l)||j(ut)})}var dt=e(rt,2);{var ht=j=>{var V=_o();o(j,V)};et(dt,j=>{t(s)||j(ht)})}r(nt),o(O,Q)},Y=O=>{var Q=ho();o(O,Q)};et(M,O=>{t(g)||!t(s)||!t(l)?O(W):O(Y,-1)})}te(G,()=>t(s),O=>f(s,O)),te(z,()=>t(l),O=>f(l,O)),te(R,()=>t(g),O=>f(g,O)),o(u,x)},$$slots:{default:!0}}),bt()}se(["click"]);var go=w(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function bo(_,n){gt(n,!0);const d=Nt.get(),E=A(()=>d.component),C=A(()=>d.name);var c=_t(),a=I(c);qt(a,()=>t(E),(s,l)=>{l(s,{scoped:!0,children:(g,S)=>{zt(g,{children:($,m)=>{var u=go(),h=I(u);Dt(h,{text:"Default behaviors"});var x=e(h,2),b=i(x);{let v=A(()=>`<${t(C)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${t(C)}>`);Lt(b,{get content(){return t(v)}})}y(6),r(x),o($,u)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(_,c),bt()}var yo=w("<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>",1);function Ko(_,n){gt(n,!0);const E=ze("Contextmenu");Nt.set(),Ae(_,{get tome(){return E},children:(C,c)=>{var a=yo(),s=I(a);gn(s,{});var l=e(s,2);Yn(l,{});var g=e(l,2);bo(g,{});var S=e(g,2);co(S,{});var $=e(S,2);xo($,{});var m=e($,2);ro(m,{});var u=e(m,2);Gn(u,{});var h=e(u,2);Cn(h),y(2),o(C,a)},$$slots:{default:!0}}),bt()}export{Ko as component};
