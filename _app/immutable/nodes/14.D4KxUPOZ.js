import"../chunks/DsnmJJEf.js";import{p as ft,g as dt,a as E,b as n,c as xt,h as kt,ap as Rt,f as b,au as St,av as Gt,s as o,j as t,u as I,aq as oe,at as J,bA as jt,as as h,d as c,r as i,aw as ae,t as vt,n as $,i as N,e as Ct,ar as ke,bD as Te}from"../chunks/B5yXET15.js";import{T as Se}from"../chunks/B4-Ffuqp.js";import{t as Pe}from"../chunks/BNfcTSkX.js";import{c as Lt}from"../chunks/BZjyUjkX.js";import{C as Dt}from"../chunks/BT7GbON5.js";import{M as Wt}from"../chunks/CICEJ_gn.js";import{T as At,a as zt}from"../chunks/CovPDL-5.js";import{e as Ie,t as Mt,a as re}from"../chunks/KnLsA95p.js";import{h as te,b as pe,S as he,a as ee,r as qt,f as ht,s as fe}from"../chunks/2yTaqMQ8.js";import{p as it,r as xe,i as tt,s as se}from"../chunks/BhJ5SenT.js";import{c as Ee,C as Yt,a as ge,b as ne,d as ie}from"../chunks/Crf_soRI.js";import{a as Oe,b as Ae,c as ze,d as Ne,e as Fe,f as Re,g as be,h as ye,i as Kt,j as le,k as De,l as Le,m as Xt,n as qe,o as Ue,C as ce,p as st}from"../chunks/Bv1hIeVf.js";import{D as $e,b as ue}from"../chunks/BfziWvZ-.js";import{a as de,b as ve,c as Qt}from"../chunks/DaiqdHnY.js";import{c as He,r as Me}from"../chunks/Mw5CMtSL.js";import{e as Bt}from"../chunks/CLN9BEmT.js";import{b as Zt}from"../chunks/DDjPJJwK.js";import{s as Pt}from"../chunks/V2q5a4YM.js";import{c as We,s as Be}from"../chunks/DfIpPbHs.js";import{G as Ge}from"../chunks/COHY0j-7.js";import{S as je,b as Xe}from"../chunks/C_TSrDRd.js";import{C as Ve,T as Ye}from"../chunks/d6QDfVu2.js";import{D as Ke}from"../chunks/CgpFMMnW.js";function Tt(m,e){ft(e,!0);const u=it(e,"tag",3,"span"),P=xe(e,["$$slots","$$events","$$legacy","tag","entries","children"]);var w=dt(),l=E(w);Ie(l,u,!1,(a,s)=>{te(a,()=>Ee(e.entries)),pe(a,()=>({...P,[he]:{display:"contents"}}));var r=dt(),x=E(r);kt(x,()=>e.children),n(s,r)}),n(m,w),xt()}const Ze=(m,e=Rt)=>{be(m,se(e))},Je=(m,e=Rt)=>{ye(m,se(e))},Qe=(m,e=Rt)=>{Kt(m,se(e))};var tn=b('<div class="contextmenu-root svelte-1472w04" role="region"><!></div>'),en=b('<div class="contextmenu-layout svelte-1472w04" aria-hidden="true"></div>'),nn=b('<ul class="contextmenu unstyled pane svelte-1472w04" role="menu" aria-label="context menu" tabindex="-1"></ul>'),on=b("<!> <!> <!>",1);function an(m,e){ft(e,!0);const u=it(e,"contextmenu",19,()=>new Yt),P=it(e,"longpress_move_tolerance",3,Oe),w=it(e,"longpress_duration",3,Ae),l=it(e,"bypass_with_tap_then_longpress",3,!0),a=it(e,"bypass_window",3,ze),s=it(e,"bypass_move_tolerance",3,Ne),r=it(e,"open_offset_x",3,Fe),x=it(e,"open_offset_y",3,Re),O=it(e,"scoped",3,!1),T=it(e,"link_entry",3,Ze),_=it(e,"text_entry",3,Je),d=it(e,"separator_entry",3,Qe);ge.set(()=>u());let f=J(void 0);const y=I(()=>u().layout),g=ne.set(),v=I(()=>qe(u().x,g.width,t(y).width)),C=I(()=>Ue(u().y,g.height,t(y).height));let R=J(void 0),W=J(void 0),X=J(void 0),A=J(void 0),B=J(void 0),F=J(void 0),k=J(void 0),q=J(!1);const H=()=>{document.body.classList.add("contextmenu-pending")},K=()=>{document.body.classList.remove("contextmenu-pending")},S=()=>{h(B,!1),t(A)!=null&&(clearTimeout(t(A)),h(A,null)),K()},D=()=>{h(X,null),h(R,null),h(W,null),h(F,!1),t(k)!=null&&(clearTimeout(t(k)),h(k,null))},U=()=>{S(),D()},M=p=>{if(t(F)){D();return}const{target:z}=p;if(t(B)){if(t(f)?.contains(z))return;U(),Pt(p);return}le(z,p.shiftKey)&&(t(f)?.contains(z)||ie(z,p.clientX+r(),p.clientY+x(),u(),{link_enabled:T()!==null,text_enabled:_()!==null,separator_enabled:d()!==null})&&(Pt(p),U()))},V=p=>{h(B,!1),h(q,!1);const{touches:z,target:j}=p;if(u().opened||z.length!==1||!le(j,p.shiftKey)){U();return}const{clientX:Q,clientY:Z}=z[0];if(l()){if(t(X)!=null&&performance.now()-t(X)<a()&&Math.hypot(Q-t(R),Z-t(W))<s()){h(F,!0),h(X,null),h(R,null),h(W,null),t(k)!=null&&(clearTimeout(t(k)),h(k,null));return}h(X,performance.now()),t(k)!=null&&clearTimeout(t(k)),h(k,setTimeout(()=>{D()},a()))}h(R,Q),h(W,Z),H(),t(A)!=null&&S(),h(A,setTimeout(()=>{h(B,!0),K(),ie(j,t(R)+r(),t(W)+x(),u(),{link_enabled:T()!==null,text_enabled:_()!==null,separator_enabled:d()!==null})},w()))},L=p=>{if(t(A)==null||u().opened)return;const{touches:z}=p;if(z.length!==1)return;const{clientX:j,clientY:Q}=z[0];if(Math.hypot(j-t(R),Q-t(W))>P()){S();return}p.preventDefault()},et=p=>{t(A)!=null&&(t(B)&&(Pt(p),h(q,!0)),S()),t(F)&&D()},nt=()=>{U()},ct=p=>{t(f)&&!t(f).contains(p.target)&&u().close()},wt=I(()=>Le(u())),gt=I(()=>De(t(wt))),_t=p=>{const z={passive:!0,capture:!0},j={passive:!1,capture:!0},Q=jt(p,"touchstart",V,z),Z=jt(p,"touchmove",L,j),pt=jt(p,"touchend",et,j),at=jt(p,"touchcancel",nt,z);return()=>{Q(),Z(),pt(),at()}};var lt=on();St("contextmenu",Gt,function(...p){(O()?void 0:M)?.apply(this,p)}),St("mousedown",Gt,function(...p){(u().opened?ct:void 0)?.apply(this,p)}),St("keydown",Gt,function(...p){(u().opened?t(gt):void 0)?.apply(this,p)}),te(Gt,()=>O()?void 0:_t);var mt=E(lt);{var G=p=>{var z=tn(),j=c(z);kt(j,()=>e.children),i(z),te(z,()=>_t),ae("contextmenu",z,M),n(p,z)},Y=p=>{var z=dt(),j=E(z);kt(j,()=>e.children),n(p,z)};tt(mt,p=>{O()?p(G):p(Y,-1)})}var ot=o(mt,2);{var ut=p=>{var z=en();Xt(z,"clientWidth",j=>t(y).width=j),Xt(z,"clientHeight",j=>t(y).height=j),n(p,z)};tt(ot,p=>{u().has_custom_layout||p(ut)})}var Ft=o(ot,2);{var It=p=>{var z=nn();let j;Bt(z,20,()=>u().params,Q=>Q,(Q,Z)=>{var pt=dt(),at=E(pt);{var Et=$t=>{var rt=dt(),Ot=E(rt);kt(Ot,()=>Z),n($t,rt)},bt=$t=>{var rt=dt(),Ot=E(rt);kt(Ot,()=>T()??Rt,()=>Z.props),n($t,rt)},yt=$t=>{var rt=dt(),Ot=E(rt);kt(Ot,()=>_()??Rt,()=>Z.props),n($t,rt)},Ut=$t=>{var rt=dt(),Ot=E(rt);kt(Ot,()=>d()??Rt,()=>Z.props),n($t,rt)};tt(at,$t=>{typeof Z=="function"?$t(Et):Z.snippet==="link"?$t(bt,1):Z.snippet==="text"?$t(yt,2):Z.snippet==="separator"&&$t(Ut,3)})}n(Q,pt)}),i(z),Zt(z,Q=>h(f,Q),()=>t(f)),vt(()=>j=ee(z,"",j,{transform:`translate3d(${t(v)??""}px, ${t(C)??""}px, 0)`})),St("click",z,function(...Q){(t(q)?Z=>{h(q,!1),Pt(Z)}:void 0)?.apply(this,Q)},!0),Xt(z,"offsetWidth",Q=>g.width=Q),Xt(z,"offsetHeight",Q=>g.height=Q),n(p,z)};tt(Ft,p=>{u().opened&&p(It)})}n(m,lt),xt()}oe(["contextmenu"]);const Nt=He(()=>new sn("standard"));class sn{#t=J();get variant(){return t(this.#t)}set variant(e){h(this.#t,e)}#e=I(()=>this.variant==="standard"?ce:an);get component(){return t(this.#e)}set component(e){h(this.#e,e)}#n=I(()=>this.component===ce?"ContextmenuRoot":"ContextmenuRootForSafariCompatibility");get name(){return t(this.#n)}set name(e){h(this.#n,e)}constructor(e="standard"){this.variant=e}}var rn=b('<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <code>ContextmenuRoot</code></div></label> <label class="row"><input type="radio"/> <div>iOS compat <code>ContextmenuRootForSafariCompatibility</code></div></label></fieldset>');function we(m,e){ft(e,!0);const u=[],P=Nt.get();var w=rn(),l=o(c(w),2),a=c(l);qt(a),a.value=a.__value="standard",$(2),i(l);var s=o(l,2),r=c(s);qt(r),r.value=r.__value="compat",$(2),i(s),i(w),de(u,[],a,()=>P.variant,x=>P.variant=x),de(u,[],r,()=>P.variant,x=>P.variant=x),n(m,w),xt()}var ln=b('<p class="panel p_md">alert B -- also inherits A</p>'),cn=b('<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>'),un=b("<code>navigator.vibrate</code>"),dn=b(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
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
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function vn(m,e){ft(e,!0);const u=Nt.get(),P=I(()=>u.component),w=I(()=>u.name);At(m,{children:(l,a)=>{var s=dn(),r=E(s);zt(r,{text:"Introduction"});var x=o(r,2),O=o(c(x));Wt(O,{path:"Web/API/Element/contextmenu_event"}),$(3),i(x);var T=o(x,4),_=o(c(T)),d=c(_,!0);i(_),$(5),i(T);var f=o(T,2);Lt(f,()=>t(P),(W,X)=>{X(W,{scoped:!0,children:(A,B)=>{Tt(A,{entries:k=>{st(k,{run:()=>alert("alert A"),children:(q,H)=>{$();var K=N("alert A");n(q,K)},$$slots:{default:!0}})},children:(k,q)=>{var H=cn(),K=o(c(H),2);Tt(K,{entries:D=>{st(D,{run:()=>alert("alert B"),children:(U,M)=>{$();var V=N("alert B");n(U,V)},$$slots:{default:!0}})},children:(D,U)=>{var M=ln();n(D,M)},$$slots:{entries:!0,default:!0}}),i(H),n(k,H)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var y=o(f,2);$e(y,{summary:X=>{$();var A=N("view code");n(X,A)},children:(X,A)=>{{let B=I(()=>`<${t(w)}>
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
</${t(w)}>`);Dt(X,{get content(){return t(B)}})}},$$slots:{summary:!0,default:!0}});var g=o(y,14),v=o(c(g),2),C=o(c(v));Wt(C,{path:"Web/API/Navigator/vibrate",children:(W,X)=>{var A=un();n(W,A)},$$slots:{default:!0}}),i(v),i(g);var R=o(g,2);we(R,{}),vt(()=>Ct(d,t(w))),n(l,s)},$$slots:{default:!0}}),xt()}var _n=b('<span class="font_family_mono">contextmenu</span> event',1),mn=b(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
		Safari not supporting the <code>contextmenu</code> event as of October 2025, see <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a>.</p> <p>Use <code>ContextmenuRoot</code> by default for better performance and haptic feedback. Use <code>ContextmenuRootForSafariCompatibility</code> only if you need iOS Safari support.</p> <h4>ContextmenuRoot</h4> <ul><li>standard, default implementation</li> <li>relies on the browser's <!></li> <li>much simpler, better performance with fewer and less intrusive event handlers, fewer edge
			cases that can go wrong</li> <li>does not work on iOS Safari until <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a> is fixed</li></ul> <h4>ContextmenuRootForSafariCompatibility</h4> <ul><li>opt-in for iOS</li> <li>some browsers (including mobile Chrome) block <code>navigator.vibrate</code> haptic feedback due
			to the timeout-based gesture detection (because it's not a direct user action)</li> <li>implements custom longpress detection to work around iOS Safari's lack of <code>contextmenu</code> event support</li> <li>works on all devices including iOS Safari</li> <li>more complex implementation with custom touch event handling and gesture detection</li> <li>a longpress is cancelled if you move the touch past a threshold before it triggers</li> <li>opt into this version only if you need iOS Safari support</li></ul> <!>`,1),pn=b(`<!> <p>The Fuz contextmenu provides powerful app-specific UX, but it breaks from normal browser
		behavior by replacing the system contextmenu.</p> <p>To mitigate the downsides:</p> <ul><li>The Fuz contextmenu only replaces the system contextmenu when the DOM tree has defined
			behaviors. Note that <code>a</code> links have default contextmenu behaviors unless disabled. Other
			interactive elements may have default behaviors added in the future.</li> <li>The Fuz contextmenu does not open on elements that allow clipboard pasting like inputs,
			textareas, and contenteditables -- however this may change for better app integration, or be
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),hn=b("<!> <!>",1);function fn(m){var e=hn(),u=E(e);At(u,{children:(w,l)=>{var a=mn(),s=E(a);zt(s,{text:"iOS compatibility"});var r=o(s,8),x=o(c(r),2),O=o(c(x));Wt(O,{path:"Web/API/Element/contextmenu_event",children:(_,d)=>{var f=_n();$(),n(_,f)},$$slots:{default:!0}}),i(x),$(4),i(r);var T=o(r,6);we(T,{}),n(w,a)},$$slots:{default:!0}});var P=o(u,2);At(P,{children:(w,l)=>{var a=pn(),s=E(a);zt(s,{text:"Caveats"});var r=o(s,8),x=o(c(r));Wt(x,{path:"Web/API/Element/contextmenu_event"}),$(3),i(r),n(w,a)},$$slots:{default:!0}}),n(m,e)}function xn(m){const e=m-1;return e*e*e+1}function gn(m){return--m*m*m*m*m+1}function _e(m,{from:e,to:u},P={}){var{delay:w=0,duration:l=A=>Math.sqrt(A)*120,easing:a=xn}=P,s=getComputedStyle(m),r=s.transform==="none"?"":s.transform,[x,O]=s.transformOrigin.split(" ").map(parseFloat);x/=m.clientWidth,O/=m.clientHeight;var T=bn(m),_=m.clientWidth/u.width/T,d=m.clientHeight/u.height/T,f=e.left+e.width*x,y=e.top+e.height*O,g=u.left+u.width*x,v=u.top+u.height*O,C=(f-g)*_,R=(y-v)*d,W=e.width/u.width,X=e.height/u.height;return{delay:w,duration:typeof l=="function"?l(Math.sqrt(C*C+R*R)):l,easing:a,css:(A,B)=>{var F=B*C,k=B*R,q=A+B*W,H=A+B*X;return`transform: ${r} translate(${F}px, ${k}px) scale(${q}, ${H});`}}}function bn(m){if("currentCSSZoom"in m)return m.currentCSSZoom;for(var e=m,u=1;e!==null;)u*=+getComputedStyle(e).zoom,e=e.parentElement;return u}var yn=b('<menu class="pane unstyled svelte-6kuqba"><!></menu>'),$n=b('<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-label="contextmenu submenmu" aria-haspopup="menu" tabindex="-1"><div class="content"><div class="icon"><!></div> <div class="title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>');function Jt(m,e){ft(e,!0);const u=ge.get(),P=I(u),w=u().add_submenu(),l=I(()=>t(P).layout),a=I(()=>w.selected);let s=J(void 0);const r=ne.get(),x=ne.set();let O=J(0),T=J(0);ke(()=>{t(s)&&_(t(s),t(l),r)});const _=(F,k,q)=>{const{x:H,y:K,width:S,height:D}=F.getBoundingClientRect();x.width=S,x.height=D;const U=H-t(O),M=K-t(T),V=U+S+q.width-k.width;if(V<=0)h(O,q.width);else{const L=S-U;L<=0?h(O,-S):L>V?h(O,q.width-V):h(O,L-S)}h(T,Math.min(0,k.height-(M+D)))};var d=$n();let f;var y=c(d);let g;var v=c(y),C=c(v),R=c(C);kt(R,()=>e.icon??Rt),i(C);var W=o(C,2),X=c(W);kt(X,()=>e.children),i(W),i(v),$(2),i(y);var A=o(y,2);{var B=F=>{var k=yn();let q;var H=c(k);kt(H,()=>e.menu),i(k),Zt(k,K=>h(s,K),()=>t(s)),vt(()=>q=ee(k,"",q,{transform:`translate3d(${t(O)??""}px, ${t(T)??""}px, 0)`,"max-height":`${t(l).height??""}px`})),n(F,k)};tt(A,F=>{t(a)&&F(B)})}i(d),vt(()=>{f=ee(d,"",f,{"--contextmenu_depth":w.depth}),g=ht(y,1,"menuitem plain selectable svelte-6kuqba",null,g,{selected:t(a)}),fe(y,"aria-expanded",t(a))}),St("mouseenter",y,F=>{Pt(F),setTimeout(()=>t(P).select(w))}),n(m,d),xt()}var wn=b("<!> <!>",1);function Vt(m,e){ft(e,!0);const u=it(e,"name",3,"Cat"),P=it(e,"icon",3,"😺");Jt(m,{icon:a=>{$();var s=N();vt(()=>Ct(s,P())),n(a,s)},menu:a=>{var s=wn(),r=E(s);st(r,{run:()=>e.act({type:e.position==="adventure"?"cat_go_home":"cat_go_adventure",name:u()}),icon:T=>{var _=dt(),d=E(_);{var f=g=>{var v=N("🏠");n(g,v)},y=g=>{var v=N("🌄");n(g,v)};tt(d,g=>{e.position==="adventure"?g(f):g(y,-1)})}n(T,_)},children:(T,_)=>{var d=dt(),f=E(d);{var y=v=>{var C=N("go home");n(v,C)},g=v=>{var C=N("go adventure");n(v,C)};tt(f,v=>{e.position==="adventure"?v(y):v(g,-1)})}n(T,d)},$$slots:{icon:!0,default:!0}});var x=o(r,2);st(x,{run:()=>e.act({type:"cat_be_or_do",name:u(),position:e.position}),icon:T=>{var _=dt(),d=E(_);{var f=g=>{var v=N("🌄");n(g,v)},y=g=>{var v=N("🏠");n(g,v)};tt(d,g=>{e.position==="adventure"?g(f):g(y,-1)})}n(T,_)},children:(T,_)=>{var d=dt(),f=E(d);{var y=v=>{var C=N("do adventure");n(v,C)},g=v=>{var C=N("be home");n(v,C)};tt(f,v=>{e.position==="adventure"?v(y):v(g,-1)})}n(T,d)},$$slots:{icon:!0,default:!0}}),n(a,s)},children:(a,s)=>{$();var r=N();vt(()=>Ct(r,u())),n(a,r)},$$slots:{icon:!0,menu:!0,default:!0}}),xt()}var Cn=b("<!> <!> <!>",1);function kn(m,e){var u=Cn(),P=E(u);be(P,{href:"https://github.com/fuzdev/fuz_ui",icon:s=>{je(s,{get data(){return Xe},size:"var(--icon_size_xs)"})},children:(s,r)=>{$();var x=N("Source code");n(s,x)},$$slots:{icon:!0,default:!0}});var w=o(P,2);Kt(w,{});var l=o(w,2);st(l,{get run(){return e.toggle_about_dialog},icon:s=>{$();var r=N("?");n(s,r)},children:(s,r)=>{$();var x=N("About");n(s,x)},$$slots:{icon:!0,default:!0}}),n(m,u)}const Ce=m=>{const e=m.length;if(e===2)return"cats";if(e===0)return null;const u=m[0];return u.icon+u.name};var Tn=b("<!> <!>",1),Sn=b("<!> <!>",1),Pn=b("<!> <!> <!>",1);function In(m,e){ft(e,!0);const u=I(()=>Ce(e.adventure_cats));Jt(m,{icon:l=>{$();var a=N("🏠");n(l,a)},menu:l=>{var a=Pn(),s=E(a);{var r=_=>{var d=Tn(),f=E(d);st(f,{run:()=>e.act({type:"call_cats_home"}),icon:v=>{$();var C=N("🐈‍⬛");n(v,C)},children:(v,C)=>{$();var R=N("call");n(v,R)},$$slots:{icon:!0,default:!0}});var y=o(f,2);Kt(y,{}),n(_,d)};tt(s,_=>{t(u)&&_(r)})}var x=o(s,2);Bt(x,17,()=>e.home_cats,_=>_.name,(_,d)=>{Vt(_,{get name(){return t(d).name},get icon(){return t(d).icon},get position(){return t(d).position},get act(){return e.act}})});var O=o(x,2);{var T=_=>{var d=Sn(),f=E(d);st(f,{run:()=>e.act({type:"cat_be_or_do",name:null,position:"home"}),icon:v=>{$();var C=N("🏠");n(v,C)},children:(v,C)=>{$();var R=N("be");n(v,R)},$$slots:{icon:!0,default:!0}});var y=o(f,2);st(y,{run:()=>e.act({type:"call_cats_adventure"}),icon:v=>{$();var C=N("🦋");n(v,C)},children:(v,C)=>{$();var R=N("leave");n(v,R)},$$slots:{icon:!0,default:!0}}),n(_,d)};tt(O,_=>{t(u)||_(T)})}n(l,a)},children:(l,a)=>{$();var s=N("home");n(l,s)},$$slots:{icon:!0,menu:!0,default:!0}}),xt()}var En=b("<!> <!>",1),On=b("<!> <!>",1),An=b("<!> <!> <!>",1);function zn(m,e){ft(e,!0);const u=I(()=>Ce(e.home_cats));Jt(m,{icon:l=>{$();var a=N("🌄");n(l,a)},menu:l=>{var a=An(),s=E(a);{var r=_=>{var d=En(),f=E(d);st(f,{run:()=>e.act({type:"call_cats_adventure"}),icon:v=>{$();var C=N("🦋");n(v,C)},children:(v,C)=>{$();var R=N("call");n(v,R)},$$slots:{icon:!0,default:!0}});var y=o(f,2);Kt(y,{}),n(_,d)};tt(s,_=>{t(u)&&_(r)})}var x=o(s,2);Bt(x,17,()=>e.adventure_cats,_=>_.name,(_,d)=>{Vt(_,{get name(){return t(d).name},get icon(){return t(d).icon},get position(){return t(d).position},get act(){return e.act}})});var O=o(x,2);{var T=_=>{var d=On(),f=E(d);st(f,{run:()=>e.act({type:"cat_be_or_do",name:null,position:"adventure"}),icon:v=>{$();var C=N("🌄");n(v,C)},children:(v,C)=>{$();var R=N("do");n(v,R)},$$slots:{icon:!0,default:!0}});var y=o(f,2);st(y,{run:()=>e.act({type:"call_cats_home"}),icon:v=>{$();var C=N("🐈‍⬛");n(v,C)},children:(v,C)=>{$();var R=N("leave");n(v,R)},$$slots:{icon:!0,default:!0}}),n(_,d)};tt(O,_=>{t(u)||_(T)})}n(l,a)},children:(l,a)=>{$();var s=N("adventure");n(l,s)},$$slots:{icon:!0,menu:!0,default:!0}}),xt()}var Nn=b('<span class="icon svelte-1py4cgo"> </span>'),Fn=b('<span class="name svelte-1py4cgo"><!> </span>'),Rn=b("<span><!><!></span>");function me(m,e){const u=it(e,"name",3,"Cat"),P=it(e,"icon",3,"😺"),w=it(e,"show_name",3,!0),l=it(e,"show_icon",3,!0);var a=Rn();let s;var r=c(a);{var x=_=>{var d=Nn(),f=c(d,!0);i(d),vt(()=>Ct(f,P())),n(_,d)};tt(r,_=>{l()&&_(x)})}var O=o(r);{var T=_=>{var d=Fn(),f=c(d);kt(f,()=>e.children??Rt);var y=o(f,1,!0);i(d),vt(()=>Ct(y,u())),n(_,d)};tt(O,_=>{w()&&_(T)})}i(a),vt(()=>s=ht(a,1,"cat svelte-1py4cgo",null,s,{"has-icon":l()})),n(m,a)}const Dn=`<script lang="ts">
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
`;var Ln=b("<!> <!>",1),qn=b('<div class="cat-wrapper svelte-177dlvm"><!></div>'),Un=b('<div class="position home svelte-177dlvm"><div class="icon svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>'),Hn=b('<div class="cat-wrapper svelte-177dlvm"><!></div>'),Mn=b('<div class="position adventure svelte-177dlvm"><div class="icon svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>'),Wn=b('<section class="display:flex"><div><!> <!></div></section> <section><!></section>',1),Bn=b("<!> <!>",1),Gn=b('<div class="mx_auto box"><div class="pane p_xl text-align:center"><h1>About Fuz</h1> <blockquote>Svelte UI library</blockquote> <blockquote>free and open source at<br/><!></blockquote> <code class="display:block p_md mb_lg">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui">@fuzdev/fuz_ui</a></code> <div class="p_xl box"><h2>Color scheme</h2> <!> <h2>Theme</h2> <!></div></div></div>'),jn=b("<!> <!>",1);function Xn(m,e){ft(e,!0);const u=Nt.get(),P=I(()=>u.component),w="Alyssa",l="Ben",a="home";let s=J(a),r=J(a);const x=I(()=>t(s)===t(r)?"😺":"😾"),O=I(()=>t(s)===t(r)?"😸":"😿"),T=I(()=>({name:w,icon:t(x),position:t(s)})),_=I(()=>({name:l,icon:t(O),position:t(r)}));let d=J(!1);const f=(S,D)=>{const U=[],M=[];for(const V of S){const L=V.position==="home"?U:M;D?L.unshift(V):L.push(V)}return{home_cats:U,adventure_cats:M}},y=I(()=>f([t(T),t(_)],t(d))),g=I(()=>t(y).home_cats),v=I(()=>t(y).adventure_cats),C=I(()=>t(s)!==a||t(r)!==a),R=()=>{h(s,a),h(r,a)};let W=J(!1);const X=()=>{h(W,!t(W))},A=S=>{switch(S.type){case"call_cats_adventure":{h(s,"adventure"),h(r,"adventure");break}case"call_cats_home":{h(s,"home"),h(r,"home");break}case"cat_go_adventure":{S.name===w?h(s,"adventure"):S.name===l&&h(r,"adventure");break}case"cat_go_home":{S.name===w?h(s,"home"):S.name===l&&h(r,"home");break}case"cat_be_or_do":{h(d,!t(d));break}}},[B,F]=We({fallback:(S,D)=>{const U=window.getComputedStyle(S),M=U.transform==="none"?"":U.transform;return{duration:1500,easing:gn,css:V=>`
					transform: ${M} scale(${V});
					opacity: ${V}
				`}}});var k=jn(),q=E(k);Lt(q,()=>t(P),(S,D)=>{D(S,{scoped:!0,children:(U,M)=>{At(U,{children:(V,L)=>{var et=Bn(),nt=E(et);zt(nt,{text:"Full example"});var ct=o(nt,2);Tt(ct,{entries:gt=>{var _t=Ln(),lt=E(_t);{var mt=Y=>{ye(Y,{run:R,content:"Reset",icon:"↻"})};tt(lt,Y=>{t(C)&&Y(mt)})}var G=o(lt,2);kn(G,{toggle_about_dialog:X}),n(gt,_t)},children:(gt,_t)=>{var lt=Wn(),mt=E(lt),G=c(mt),Y=c(G);Tt(Y,{entries:p=>{In(p,{act:A,get home_cats(){return t(g)},get adventure_cats(){return t(v)}})},children:(p,z)=>{var j=Un(),Q=o(c(j),2);Bt(Q,29,()=>t(g),({name:Z,icon:pt,position:at})=>Z,(Z,pt)=>{let at=()=>t(pt).name,Et=()=>t(pt).icon,bt=()=>t(pt).position;var yt=qn(),Ut=c(yt);Tt(Ut,{entries:rt=>{Vt(rt,{act:A,get name(){return at()},get icon(){return Et()},get position(){return bt()}})},children:(rt,Ot)=>{me(rt,{get name(){return at()},get icon(){return Et()}})},$$slots:{entries:!0,default:!0}}),i(yt),Mt(1,yt,()=>F,()=>({key:at()})),Mt(2,yt,()=>B,()=>({key:at()})),re(yt,()=>_e,null),n(Z,yt)}),i(Q),i(j),n(p,j)},$$slots:{entries:!0,default:!0}});var ot=o(Y,2);Tt(ot,{entries:p=>{zn(p,{act:A,get home_cats(){return t(g)},get adventure_cats(){return t(v)}})},children:(p,z)=>{var j=Mn(),Q=o(c(j),2);Bt(Q,29,()=>t(v),({name:Z,icon:pt,position:at})=>Z,(Z,pt)=>{let at=()=>t(pt).name,Et=()=>t(pt).icon,bt=()=>t(pt).position;var yt=Hn(),Ut=c(yt);Tt(Ut,{entries:rt=>{Vt(rt,{act:A,get name(){return at()},get icon(){return Et()},get position(){return bt()}})},children:(rt,Ot)=>{me(rt,{get name(){return at()},get icon(){return Et()}})},$$slots:{entries:!0,default:!0}}),i(yt),Mt(1,yt,()=>F,()=>({key:at()})),Mt(2,yt,()=>B,()=>({key:at()})),re(yt,()=>_e,null),n(Z,yt)}),i(Q),i(j),n(p,j)},$$slots:{entries:!0,default:!0}}),i(G),i(mt);var ut=o(mt,2),Ft=c(ut);$e(Ft,{summary:p=>{$();var z=N("View example source");n(p,z)},children:(p,z)=>{Dt(p,{get content(){return Dn}})},$$slots:{summary:!0,default:!0}}),i(ut),n(gt,lt)},$$slots:{entries:!0,default:!0}}),n(V,et)},$$slots:{default:!0}})},$$slots:{default:!0}})});var H=o(q,2);{var K=S=>{Ke(S,{onclose:()=>h(W,!1),children:(D,U)=>{var M=Gn(),V=c(M),L=o(c(V),4),et=o(c(L),2);Ge(et,{path:"fuzdev/fuz_ui"}),i(L);var nt=o(L,4),ct=o(c(nt),2);Ve(ct,{});var wt=o(ct,4);Ye(wt,{}),i(nt),i(V),i(M),n(D,M)},$$slots:{default:!0}})};tt(H,S=>{t(W)&&S(K)})}n(m,k),xt()}var Vn=b("<!> <!> <!>",1),Yn=b(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific element
					instead of the entire page.</aside></div>`),Kn=b("<!> <!>",1);function Zn(m,e){ft(e,!0);const u=Nt.get(),P=I(()=>u.component),w=I(()=>u.name);let l=J(!1),a=J(!1),s=J(!1);var r=dt(),x=E(r);Lt(x,()=>t(P),(O,T)=>{T(O,{scoped:!0,children:(_,d)=>{At(_,{children:(f,y)=>{var g=Kn(),v=E(g);zt(v,{text:"Basic usage"});var C=o(v,2);Tt(C,{entries:W=>{var X=Vn(),A=E(X);st(A,{run:()=>{h(l,!t(l))},children:(k,q)=>{$();var H=N("Hello world");n(k,H)},$$slots:{default:!0}});var B=o(A,2);st(B,{run:()=>{h(a,!t(a))},icon:q=>{$();var H=N("🌞");n(q,H)},children:(q,H)=>{$();var K=N("Hello with an optional icon snippet");n(q,K)},$$slots:{icon:!0,default:!0}});var F=o(B,2);st(F,{run:()=>{h(s,!t(s))},icon:"🌚",children:(k,q)=>{$();var H=N("Hello with an optional icon string");n(k,H)},$$slots:{default:!0}}),n(W,X)},children:(W,X)=>{var A=Yn(),B=o(c(A),2);{let nt=I(()=>`<${t(w)} scoped>
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
...markup without contextmenu behavior...`);Dt(B,{get content(){return t(nt)}})}var F=o(B,2),k=c(F);let q;var H=c(k);i(k),i(F);var K=o(F,2),S=c(K);let D;var U=c(S);i(S),i(K);var M=o(K,2),V=c(M);let L;var et=c(V);i(V),i(M),$(2),i(A),vt(()=>{q=ht(k,1,"",null,q,{color_g_5:t(l)}),Ct(H,`greeted = ${t(l)??""}`),D=ht(S,1,"",null,D,{color_e_5:t(a)}),Ct(U,`greeted_icon_snippet = ${t(a)??""}`),L=ht(V,1,"",null,L,{color_d_5:t(s)}),Ct(et,`greeted_icon_string = ${t(s)??""}`)}),n(W,A)},$$slots:{entries:!0,default:!0}}),n(f,g)},$$slots:{default:!0}})},$$slots:{default:!0}})}),n(m,r),xt()}var Jn=b("<span> </span>");function Ht(m,e){ft(e,!0);const u=xe(e,["$$slots","$$events","$$legacy","glyph","size"]),P="var(--font_size, 1em)",w="var(--font_size, inherit)",l=I(()=>e.size??P);var a=Jn();pe(a,()=>({...u,class:`glyph display:inline-block text-align:center line-height:1 white-space:nowrap font-weight:400 ${e.class??""}`,[he]:{width:t(l),height:t(l),"min-width":t(l),"min-height":t(l),"font-size":e.size??w}}));var s=c(a,!0);i(a),vt(()=>Ct(s,e.glyph)),n(m,a),xt()}var Qn=b('<span class="color_f_50">option f</span>'),to=b('<span class="color_g_50">option g</span>'),eo=b('<span class="color_j_50">option j</span>'),no=b("<!> <!> <!> <!>",1),oo=b('<li class="color_error">Error: <code> </code></li>'),ao=b('<div class="display:flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>'),so=b(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and control
					it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing you to select multiple colors using the activate
					button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),ro=b("<!> <!>",1);function io(m,e){ft(e,!0);const u=Nt.get(),P=I(()=>u.component),w=I(()=>u.name),l=new Yt;let a=J(void 0);const s=I(()=>t(a)?`color_${t(a)}_5`:void 0),r=I(()=>t(a)?`color_${t(a)}`:void 0);var x=dt(),O=E(x);Lt(O,()=>t(P),(T,_)=>{_(T,{get contextmenu(){return l},scoped:!0,children:(d,f)=>{At(d,{children:(y,g)=>{var v=ro(),C=E(v);zt(C,{text:"Custom instance"});var R=o(C,2);Tt(R,{entries:X=>{Jt(X,{icon:F=>{$();var k=N("🎨");n(F,k)},menu:F=>{var k=no(),q=E(k);st(q,{run:()=>(h(a,"f"),{ok:!0,close:!1}),children:(D,U)=>{var M=Qn();n(D,M)},$$slots:{default:!0}});var H=o(q,2);st(H,{run:()=>(h(a,"g"),{ok:!0,close:!1}),children:(D,U)=>{var M=to();n(D,M)},$$slots:{default:!0}});var K=o(H,2);st(K,{run:()=>(h(a,"j"),{ok:!0,close:!1}),children:(D,U)=>{var M=eo();n(D,M)},$$slots:{default:!0}});var S=o(K,2);st(S,{run:()=>(l.close(),{ok:!0}),children:(D,U)=>{$();var M=N("close contextmenu");n(D,M)},$$slots:{default:!0}}),n(F,k)},children:(F,k)=>{$();var q=N("select color");n(F,q)},$$slots:{icon:!0,menu:!0,default:!0}})},children:(X,A)=>{var B=so(),F=c(B),k=o(c(F)),q=c(k,!0);i(k),$(5),i(F);var H=o(F,2);Dt(H,{lang:"ts",dangerous_raw_html:'<span class="token_keyword">const</span> contextmenu <span class="token_operator">=</span> <span class="token_keyword">new</span> <span class="token_class_name"><span class="token_capitalized_identifier token_class_name">ContextmenuState</span></span><span class="token_punctuation">(</span><span class="token_punctuation">)</span><span class="token_punctuation">;</span>'});var K=o(H,2);{let G=I(()=>`<${t(w)} {contextmenu} scoped>...</${t(w)}>`);Dt(K,{get content(){return t(G)}})}var S=o(K,2),D=o(c(S));D.textContent="{ok: true, close: false}",$(),i(S);var U=o(S,2),M=o(c(U),2),V=c(M),L=o(c(V),2),et=c(L,!0);i(L),i(V);var nt=o(V,2),ct=o(c(nt),2),wt=c(ct);i(ct),i(nt);var gt=o(nt,2);{var _t=G=>{var Y=oo(),ot=o(c(Y)),ut=c(ot,!0);i(ot),i(Y),vt(()=>Ct(ut,l.error)),n(G,Y)};tt(gt,G=>{l.error&&G(_t)})}i(M),i(U);var lt=o(U,2);{var mt=G=>{var Y=ao(),ot=c(Y),ut=c(ot),Ft=c(ut);Ht(Ft,{glyph:"↑"}),i(ut);var It=o(ut,2),p=c(It),z=c(p);Ht(z,{glyph:"←"}),i(p);var j=o(p,2),Q=c(j);Ht(Q,{glyph:"↵"}),i(j);var Z=o(j,2),pt=c(Z);Ht(pt,{glyph:"→"}),i(Z),i(It);var at=o(It,2),Et=c(at);Ht(Et,{glyph:"↓"}),i(at),i(ot),i(Y),vt(()=>{ht(ut,1,`border_bottom_left_radius_0 border_bottom_right_radius_0 ${t(r)??""}`),ut.disabled=!l.can_select_previous,ht(p,1,`border_bottom_right_radius_0 border_top_right_radius_0 ${t(r)??""}`),p.disabled=!l.can_collapse,ht(j,1,`border-radius:0 ${t(r)??""}`),j.disabled=!l.can_activate,ht(Z,1,`border_bottom_left_radius_0 border_top_left_radius_0 ${t(r)??""}`),Z.disabled=!l.can_expand,ht(at,1,`border_top_left_radius_0 border_top_right_radius_0 ${t(r)??""}`),at.disabled=!l.can_select_next}),St("mousedown",ut,bt=>{Pt(bt),l.select_previous()},!0),St("mousedown",p,bt=>{Pt(bt),l.collapse_selected()},!0),St("mousedown",j,async bt=>{Pt(bt),await l.activate_selected()},!0),St("mousedown",Z,bt=>{Pt(bt),l.expand_selected()},!0),St("mousedown",at,bt=>{Pt(bt),l.select_next()},!0),Mt(3,Y,()=>Be),n(G,Y)};tt(lt,G=>{l.opened&&G(mt)})}i(B),vt(()=>{Ct(q,t(w)),ht(U,1,`mb_md ${t(s)??""}`),Ct(et,l.opened),Ct(wt,`${l.x??""} && contextmenu.y === ${l.y??""}`)}),n(X,B)},$$slots:{entries:!0,default:!0}}),n(y,v)},$$slots:{default:!0}})},$$slots:{default:!0}})}),n(m,x),xt()}var lo=b(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the browser's
					default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's default
					contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),co=b("<div><!></div> <!>",1);function uo(m,e){ft(e,!0);const u=Nt.get(),P=I(()=>u.component),w=new Yt;let l=J(!1),a=J(void 0);const s=()=>{const y=window.getSelection();if(!y||!t(a))return;const g=document.createRange();g.selectNodeContents(t(a)),y.removeAllRanges(),y.addRange(g)};let r=J("");const x="If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.",O=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`,T=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`,_=I(()=>t(r)===x||t(r)===O||t(r)===T);var d=dt(),f=E(d);Lt(f,()=>t(P),(y,g)=>{g(y,{get contextmenu(){return w},scoped:!0,children:(v,C)=>{At(v,{children:(R,W)=>{var X=co(),A=E(X);let B;var F=c(A);zt(F,{text:"Select text"}),i(A);var k=o(A,2);Tt(k,{entries:H=>{st(H,{run:()=>{h(l,!t(l))},children:(K,S)=>{$();var D=N("Toggle something");n(K,D)},$$slots:{default:!0}})},children:(H,K)=>{var S=lo();let D;var U=c(S),M=o(c(U),2),V=o(c(M));let L;$(),i(M),i(U),Zt(U,ot=>h(a,ot),()=>t(a));var et=o(U,2),nt=c(et);qt(nt),i(et);var ct=o(et,2);let wt;var gt=o(ct,2),_t=c(gt);Te(_t),i(gt);var lt=o(gt,2),mt=c(lt);Wt(mt,{path:"Web/HTML/Global_attributes/contenteditable"}),$(),i(lt);var G=o(lt,4),Y=o(G,4);$(2),i(S),vt(()=>{D=ht(S,1,"panel p_md",null,D,{color_g_5:t(_)}),L=ht(V,1,"",null,L,{color_a:t(l)}),wt=ht(ct,1,"",null,wt,{color_g_5:t(_)})}),ae("click",V,s),ve(nt,()=>t(r),ot=>h(r,ot)),ve(_t,()=>t(r),ot=>h(r,ot)),ue("innerText",G,()=>t(r),ot=>h(r,ot)),ue("innerText",Y,()=>t(r),ot=>h(r,ot)),n(H,S)},$$slots:{entries:!0,default:!0}}),vt(()=>B=ht(A,1,"",null,B,{color_d_5:t(_)})),n(R,X)},$$slots:{default:!0}})},$$slots:{default:!0}})}),n(m,d),xt()}oe(["click"]);var vo=b('<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>'),_o=b('<li>custom "some custom entry" entry</li>'),mo=b('<li>"copy text" entry when text is selected</li>'),po=b("<li>link entry when clicking on a link</li>"),ho=b("<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>",1),fo=b(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing the
			Fuz contextmenu.</p>`),xo=b('<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which ensures the Fuz contextmenu is used</label></div> <!>',1);function go(m,e){ft(e,!0);const u=d=>{var f=vo(),y=c(f),g=o(c(y));let v;$(),i(y),Zt(y,W=>h(T,W),()=>t(T));var C=o(y,2),R=o(c(C));$(),i(C),i(f),vt(W=>{v=ht(g,1,"",null,v,{color_h:t(O)}),fe(R,"href",W)},[()=>Me("/")]),ae("click",g,_),n(d,f)},P=Nt.get(),w=I(()=>P.component),l=I(()=>P.name),a=new Yt;let s=J(!1),r=J(!1),x=J(!0),O=J(!1),T=J(void 0);const _=()=>{const d=window.getSelection();if(!d||!t(T))return;const f=document.createRange();f.selectNodeContents(t(T)),d.removeAllRanges(),d.addRange(f)};At(m,{children:(d,f)=>{var y=xo(),g=E(y);zt(g,{text:"Disable default behaviors"});var v=o(g,4);{let L=I(()=>`<${t(l)}${t(s)?" link_entry={null}":""}${t(r)?" text_entry={null}":""}>`);Dt(v,{get content(){return t(L)}})}var C=o(v,2),R=c(C),W=c(R);qt(W);var X=o(W,2),A=o(c(X));A.textContent="link_entry={null}",i(X),i(R);var B=o(R,2),F=c(B);qt(F);var k=o(F,2),q=o(c(k));q.textContent="text_entry={null}",i(k),i(B),i(C);var H=o(C,2);{let L=I(()=>t(s)?null:void 0),et=I(()=>t(r)?null:void 0);Lt(H,()=>t(w),(nt,ct)=>{ct(nt,{get contextmenu(){return a},scoped:!0,get link_entry(){return t(L)},get text_entry(){return t(et)},children:(wt,gt)=>{var _t=dt(),lt=E(_t);{var mt=Y=>{Tt(Y,{entries:ut=>{st(ut,{icon:">",run:()=>{h(O,!t(O))},children:(Ft,It)=>{$();var p=N("some custom entry");n(Ft,p)},$$slots:{default:!0}})},children:(ut,Ft)=>{u(ut)},$$slots:{entries:!0,default:!0}})},G=Y=>{u(Y)};tt(lt,Y=>{t(x)?Y(mt):Y(G,-1)})}n(wt,_t)},$$slots:{default:!0}})})}var K=o(H,4),S=c(K),D=c(S);qt(D),$(),i(S),i(K);var U=o(K,2);{var M=L=>{var et=ho(),nt=o(E(et),2),ct=c(nt);{var wt=G=>{var Y=_o();n(G,Y)};tt(ct,G=>{t(x)&&G(wt)})}var gt=o(ct,2);{var _t=G=>{var Y=mo();n(G,Y)};tt(gt,G=>{t(r)||G(_t)})}var lt=o(gt,2);{var mt=G=>{var Y=po();n(G,Y)};tt(lt,G=>{t(s)||G(mt)})}i(nt),n(L,et)},V=L=>{var et=fo();n(L,et)};tt(U,L=>{t(x)||!t(s)||!t(r)?L(M):L(V,-1)})}Qt(W,()=>t(s),L=>h(s,L)),Qt(F,()=>t(r),L=>h(r,L)),Qt(D,()=>t(x),L=>h(x,L)),n(d,y)},$$slots:{default:!0}}),xt()}oe(["click"]);var bo=b(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function yo(m,e){ft(e,!0);const u=Nt.get(),P=I(()=>u.component),w=I(()=>u.name);var l=dt(),a=E(l);Lt(a,()=>t(P),(s,r)=>{r(s,{scoped:!0,children:(x,O)=>{At(x,{children:(T,_)=>{var d=bo(),f=E(d);zt(f,{text:"Default behaviors"});var y=o(f,2),g=c(y);{let v=I(()=>`<${t(w)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${t(w)}>`);Dt(g,{get content(){return t(v)}})}$(6),i(y),n(T,d)},$$slots:{default:!0}})},$$slots:{default:!0}})}),n(m,l),xt()}var $o=b("<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>",1);function Xo(m,e){ft(e,!0);const P=Pe("Contextmenu");Nt.set(),Se(m,{get tome(){return P},children:(w,l)=>{var a=$o(),s=E(a);vn(s,{});var r=o(s,2);Zn(r,{});var x=o(r,2);yo(x,{});var O=o(x,2);uo(O,{});var T=o(O,2);go(T,{});var _=o(T,2);io(_,{});var d=o(_,2);Xn(d,{});var f=o(d,2);fn(f),$(2),n(w,a)},$$slots:{default:!0}}),xt()}export{Xo as component};
