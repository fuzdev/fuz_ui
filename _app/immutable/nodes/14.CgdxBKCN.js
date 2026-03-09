import"../chunks/DsnmJJEf.js";import{p as ft,g as dt,a as I,b as n,c as xt,h as kt,ap as Ft,f as b,au as St,av as jt,s as o,j as t,u as R,aq as oe,at as J,bw as Xt,as as x,d as c,r as i,aw as ae,t as vt,n as $,i as O,e as Ct,ar as ke,bA as Te}from"../chunks/5ZhStggd.js";import{T as Se}from"../chunks/BuRnkLEE.js";import{g as Pe}from"../chunks/B1F0F5Ii.js";import{c as Lt}from"../chunks/BS9WTzQV.js";import{C as Dt}from"../chunks/CTwselOz.js";import{M as Bt}from"../chunks/BXJAxVNV.js";import{T as Ot,a as zt}from"../chunks/DvfLYOKQ.js";import{e as Ie,t as Ut,a as re}from"../chunks/D99TztG4.js";import{g as te,b as pe,S as he,a as ee,r as qt,f as ht,s as fe}from"../chunks/DRnI2UPP.js";import{p as it,r as xe,i as tt,s as se}from"../chunks/B_cKiM_m.js";import{c as Ee,C as Yt,a as ge,b as ne,d as ie}from"../chunks/BE34RN2u.js";import{a as Ae,b as Oe,c as ze,d as Ne,e as Re,f as Fe,g as be,h as ye,i as Kt,j as le,k as De,l as Le,m as Gt,n as qe,o as Me,C as ce,p as st}from"../chunks/CH5AdoE3.js";import{D as $e,b as ue}from"../chunks/Ck64eDj3.js";import{a as de,b as ve,c as Qt}from"../chunks/C6nrM-XE.js";import{c as He,r as Ue}from"../chunks/AzyGFOYc.js";import{e as Wt}from"../chunks/DIcwxBgt.js";import{b as Zt}from"../chunks/CrhW4tbS.js";import{s as Pt}from"../chunks/V2q5a4YM.js";import{c as Be,s as We}from"../chunks/DfIpPbHs.js";import{G as je}from"../chunks/Bh8bGLlR.js";import{S as Xe,b as Ge}from"../chunks/CixUBYsR.js";import{C as Ve,T as Ye}from"../chunks/DhQzpmx4.js";import{D as Ke}from"../chunks/Dw5pG35h.js";function Tt(m,e){ft(e,!0);const u=it(e,"tag",3,"span"),S=xe(e,["$$slots","$$events","$$legacy","tag","entries","children"]);var w=dt(),l=I(w);Ie(l,u,!1,(a,r)=>{te(a,()=>Ee(e.entries)),pe(a,()=>({...S,[he]:{display:"contents"}}));var s=dt(),f=I(s);kt(f,()=>e.children),n(r,s)}),n(m,w),xt()}const Ze=(m,e=Ft)=>{be(m,se(e))},Je=(m,e=Ft)=>{ye(m,se(e))},Qe=(m,e=Ft)=>{Kt(m,se(e))};var tn=b('<div class="contextmenu_root svelte-1472w04" role="region"><!></div>'),en=b('<div class="contextmenu_layout svelte-1472w04" aria-hidden="true"></div>'),nn=b('<ul class="contextmenu unstyled pane svelte-1472w04" role="menu" aria-label="context menu" tabindex="-1"></ul>'),on=b("<!> <!> <!>",1);function an(m,e){ft(e,!0);const u=it(e,"contextmenu",19,()=>new Yt),S=it(e,"longpress_move_tolerance",3,Ae),w=it(e,"longpress_duration",3,Oe),l=it(e,"bypass_with_tap_then_longpress",3,!0),a=it(e,"bypass_window",3,ze),r=it(e,"bypass_move_tolerance",3,Ne),s=it(e,"open_offset_x",3,Re),f=it(e,"open_offset_y",3,Fe),D=it(e,"scoped",3,!1),T=it(e,"link_entry",3,Ze),_=it(e,"text_entry",3,Je),v=it(e,"separator_entry",3,Qe);ge.set(u());let p=J(void 0);const y=R(()=>u().layout),g=ne.set(),d=R(()=>qe(u().x,g.width,t(y).width)),C=R(()=>Me(u().y,g.height,t(y).height));let F=J(void 0),W=J(void 0),V=J(void 0),E=J(void 0),z=J(void 0),N=J(void 0),k=J(void 0),U=J(!1);const M=()=>{document.body.classList.add("contextmenu_pending")},j=()=>{document.body.classList.remove("contextmenu_pending")},P=()=>{x(z,!1),t(E)!=null&&(clearTimeout(t(E)),x(E,null)),j()},L=()=>{x(V,null),x(F,null),x(W,null),x(N,!1),t(k)!=null&&(clearTimeout(t(k)),x(k,null))},H=()=>{P(),L()},q=h=>{if(t(N)){L();return}const{target:A}=h;if(t(z)){if(t(p)?.contains(A))return;H(),Pt(h);return}le(A,h.shiftKey)&&(t(p)?.contains(A)||ie(A,h.clientX+s(),h.clientY+f(),u(),{link_enabled:T()!==null,text_enabled:_()!==null,separator_enabled:v()!==null})&&(Pt(h),H()))},Y=h=>{x(z,!1),x(U,!1);const{touches:A,target:G}=h;if(u().opened||A.length!==1||!le(G,h.shiftKey)){H();return}const{clientX:Q,clientY:Z}=A[0];if(l()){if(t(V)!=null&&performance.now()-t(V)<a()&&Math.hypot(Q-t(F),Z-t(W))<r()){x(N,!0),x(V,null),x(F,null),x(W,null),t(k)!=null&&(clearTimeout(t(k)),x(k,null));return}x(V,performance.now(),!0),t(k)!=null&&clearTimeout(t(k)),x(k,setTimeout(()=>{L()},a()),!0)}x(F,Q,!0),x(W,Z,!0),M(),t(E)!=null&&P(),x(E,setTimeout(()=>{x(z,!0),j(),ie(G,t(F)+s(),t(W)+f(),u(),{link_enabled:T()!==null,text_enabled:_()!==null,separator_enabled:v()!==null})},w()),!0)},B=h=>{if(t(E)==null||u().opened)return;const{touches:A}=h;if(A.length!==1)return;const{clientX:G,clientY:Q}=A[0];if(Math.hypot(G-t(F),Q-t(W))>S()){P();return}h.preventDefault()},et=h=>{t(E)!=null&&(t(z)&&(Pt(h),x(U,!0)),P()),t(N)&&L()},nt=()=>{H()},ct=h=>{t(p)&&!t(p).contains(h.target)&&u().close()},wt=R(()=>Le(u())),gt=R(()=>De(t(wt))),_t=h=>{const A={passive:!0,capture:!0},G={passive:!1,capture:!0},Q=Xt(h,"touchstart",Y,A),Z=Xt(h,"touchmove",B,G),pt=Xt(h,"touchend",et,G),at=Xt(h,"touchcancel",nt,A);return()=>{Q(),Z(),pt(),at()}};var lt=on();St("contextmenu",jt,function(...h){(D()?void 0:q)?.apply(this,h)}),St("mousedown",jt,function(...h){(u().opened?ct:void 0)?.apply(this,h)}),St("keydown",jt,function(...h){(u().opened?t(gt):void 0)?.apply(this,h)}),te(jt,()=>D()?void 0:_t);var mt=I(lt);{var X=h=>{var A=tn(),G=c(A);kt(G,()=>e.children),i(A),te(A,()=>_t),ae("contextmenu",A,q),n(h,A)},K=h=>{var A=dt(),G=I(A);kt(G,()=>e.children),n(h,A)};tt(mt,h=>{D()?h(X):h(K,-1)})}var ot=o(mt,2);{var ut=h=>{var A=en();Gt(A,"clientWidth",G=>t(y).width=G),Gt(A,"clientHeight",G=>t(y).height=G),n(h,A)};tt(ot,h=>{u().has_custom_layout||h(ut)})}var Rt=o(ot,2);{var It=h=>{var A=nn();let G;Wt(A,20,()=>u().params,Q=>Q,(Q,Z)=>{var pt=dt(),at=I(pt);{var Et=$t=>{var rt=dt(),At=I(rt);kt(At,()=>Z),n($t,rt)},bt=$t=>{var rt=dt(),At=I(rt);kt(At,()=>T()??Ft,()=>Z.props),n($t,rt)},yt=$t=>{var rt=dt(),At=I(rt);kt(At,()=>_()??Ft,()=>Z.props),n($t,rt)},Mt=$t=>{var rt=dt(),At=I(rt);kt(At,()=>v()??Ft,()=>Z.props),n($t,rt)};tt(at,$t=>{typeof Z=="function"?$t(Et):Z.snippet==="link"?$t(bt,1):Z.snippet==="text"?$t(yt,2):Z.snippet==="separator"&&$t(Mt,3)})}n(Q,pt)}),i(A),Zt(A,Q=>x(p,Q),()=>t(p)),vt(()=>G=ee(A,"",G,{transform:`translate3d(${t(d)??""}px, ${t(C)??""}px, 0)`})),St("click",A,function(...Q){(t(U)?Z=>{x(U,!1),Pt(Z)}:void 0)?.apply(this,Q)},!0),Gt(A,"offsetWidth",Q=>g.width=Q),Gt(A,"offsetHeight",Q=>g.height=Q),n(h,A)};tt(Rt,h=>{u().opened&&h(It)})}n(m,lt),xt()}oe(["contextmenu"]);class sn{#t=J();get variant(){return t(this.#t)}set variant(e){x(this.#t,e,!0)}#e=R(()=>this.variant==="standard"?ce:an);get component(){return t(this.#e)}set component(e){x(this.#e,e)}#n=R(()=>this.component===ce?"ContextmenuRoot":"ContextmenuRootForSafariCompatibility");get name(){return t(this.#n)}set name(e){x(this.#n,e)}constructor(e="standard"){this.variant=e}}const Nt=He(()=>new sn("standard"));var rn=b('<fieldset><legend><h4>Selected root component:</h4></legend> <label class="row"><input type="radio"/> <div>standard <code>ContextmenuRoot</code></div></label> <label class="row"><input type="radio"/> <div>iOS compat <code>ContextmenuRootForSafariCompatibility</code></div></label></fieldset>');function we(m,e){ft(e,!0);const u=[],S=Nt.get();var w=rn(),l=o(c(w),2),a=c(l);qt(a),a.value=a.__value="standard",$(2),i(l);var r=o(l,2),s=c(r);qt(s),s.value=s.__value="compat",$(2),i(r),i(w),de(u,[],a,()=>S.variant,f=>S.variant=f),de(u,[],s,()=>S.variant,f=>S.variant=f),n(m,w),xt()}var ln=b('<p class="panel p_md">alert B -- also inherits A</p>'),cn=b('<div class="panel p_md mb_lg"><p>alert A -- rightclick or longpress here to open the contextmenu</p> <!></div>'),un=b("<code>navigator.vibrate</code>"),dn=b(`<!> <p>Fuz provides a customizable contextmenu that overrides the system contextmenu to provide helpful
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
			Fuz contextmenu</li> <li>opening the contextmenu attempts haptic feedback with <!></li></ul> <!>`,1);function vn(m,e){ft(e,!0);const u=Nt.get(),S=R(()=>u.component),w=R(()=>u.name);Ot(m,{children:(l,a)=>{var r=dn(),s=I(r);zt(s,{text:"Introduction"});var f=o(s,2),D=o(c(f));Bt(D,{path:"Web/API/Element/contextmenu_event"}),$(3),i(f);var T=o(f,4),_=o(c(T)),v=c(_,!0);i(_),$(5),i(T);var p=o(T,2);Lt(p,()=>t(S),(W,V)=>{V(W,{scoped:!0,children:(E,z)=>{Tt(E,{entries:k=>{st(k,{run:()=>alert("alert A"),children:(U,M)=>{$();var j=O("alert A");n(U,j)},$$slots:{default:!0}})},children:(k,U)=>{var M=cn(),j=o(c(M),2);Tt(j,{entries:L=>{st(L,{run:()=>alert("alert B"),children:(H,q)=>{$();var Y=O("alert B");n(H,Y)},$$slots:{default:!0}})},children:(L,H)=>{var q=ln();n(L,q)},$$slots:{entries:!0,default:!0}}),i(M),n(k,M)},$$slots:{entries:!0,default:!0}})},$$slots:{default:!0}})});var y=o(p,2);$e(y,{summary:V=>{$();var E=O("view code");n(V,E)},children:(V,E)=>{{let z=R(()=>`<${t(w)}>
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
</${t(w)}>`);Dt(V,{get content(){return t(z)}})}},$$slots:{summary:!0,default:!0}});var g=o(y,14),d=o(c(g),2),C=o(c(d));Bt(C,{path:"Web/API/Navigator/vibrate",children:(W,V)=>{var E=un();n(W,E)},$$slots:{default:!0}}),i(d),i(g);var F=o(g,2);we(F,{}),vt(()=>Ct(v,t(w))),n(l,r)},$$slots:{default:!0}}),xt()}var _n=b('<span class="font_family_mono">contextmenu</span> event',1),mn=b(`<!> <p>Fuz provides two versions of the contextmenu root component with different tradeoffs due to iOS
		Safari not supporting the <code>contextmenu</code> event as of October 2025, see <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a>.</p> <p>Use <code>ContextmenuRoot</code> by default for better performance and haptic feedback. Use <code>ContextmenuRootForSafariCompatibility</code> only if you need iOS Safari support.</p> <h4>ContextmenuRoot</h4> <ul><li>standard, default implementation</li> <li>relies on the browser's <!></li> <li>much simpler, better performance with fewer and less intrusive event handlers, fewer edge
			cases that can go wrong</li> <li>does not work on iOS Safari until <a href="https://bugs.webkit.org/show_bug.cgi?id=213953">WebKit bug #213953</a> is fixed</li></ul> <h4>ContextmenuRootForSafariCompatibility</h4> <ul><li>opt-in for iOS</li> <li>some browsers (including mobile Chrome) block <code>navigator.vibrate</code> haptic feedback due
			to the timeout-based gesture detection (because it's not a direct user action)</li> <li>implements custom longpress detection to work around iOS Safari's lack of <code>contextmenu</code> event support</li> <li>works on all devices including iOS Safari</li> <li>more complex implementation with custom touch event handling and gesture detection</li> <li>a longpress is cancelled if you move the touch past a threshold before it triggers</li> <li>opt into this version only if you need iOS Safari support</li></ul> <!>`,1),pn=b(`<!> <p>The Fuz contextmenu provides powerful app-specific UX, but it breaks from normal browser
		behavior by replacing the system contextmenu.</p> <p>To mitigate the downsides:</p> <ul><li>The Fuz contextmenu only replaces the system contextmenu when the DOM tree has defined
			behaviors. Note that <code>a</code> links have default contextmenu behaviors unless disabled. Other
			interactive elements may have default behaviors added in the future.</li> <li>The Fuz contextmenu does not open on elements that allow clipboard pasting like inputs,
			textareas, and contenteditables -- however this may change for better app integration, or be
			configurable.</li> <li>To bypass on devices with a keyboard, hold Shift while rightclicking.</li> <li>To bypass on touch devices (e.g. to select text), use tap-then-longpress instead of longpress.</li> <li>Triggering the contextmenu inside the Fuz contextmenu shows the system contextmenu.</li></ul> <p>See also the <!> docs and the <a href="https://www.w3.org/TR/uievents/#event-type-contextmenu">w3 spec</a>.</p>`,1),hn=b("<!> <!>",1);function fn(m){var e=hn(),u=I(e);Ot(u,{children:(w,l)=>{var a=mn(),r=I(a);zt(r,{text:"iOS compatibility"});var s=o(r,8),f=o(c(s),2),D=o(c(f));Bt(D,{path:"Web/API/Element/contextmenu_event",children:(_,v)=>{var p=_n();$(),n(_,p)},$$slots:{default:!0}}),i(f),$(4),i(s);var T=o(s,6);we(T,{}),n(w,a)},$$slots:{default:!0}});var S=o(u,2);Ot(S,{children:(w,l)=>{var a=pn(),r=I(a);zt(r,{text:"Caveats"});var s=o(r,8),f=o(c(s));Bt(f,{path:"Web/API/Element/contextmenu_event"}),$(3),i(s),n(w,a)},$$slots:{default:!0}}),n(m,e)}function xn(m){const e=m-1;return e*e*e+1}function gn(m){return--m*m*m*m*m+1}function _e(m,{from:e,to:u},S={}){var{delay:w=0,duration:l=E=>Math.sqrt(E)*120,easing:a=xn}=S,r=getComputedStyle(m),s=r.transform==="none"?"":r.transform,[f,D]=r.transformOrigin.split(" ").map(parseFloat);f/=m.clientWidth,D/=m.clientHeight;var T=bn(m),_=m.clientWidth/u.width/T,v=m.clientHeight/u.height/T,p=e.left+e.width*f,y=e.top+e.height*D,g=u.left+u.width*f,d=u.top+u.height*D,C=(p-g)*_,F=(y-d)*v,W=e.width/u.width,V=e.height/u.height;return{delay:w,duration:typeof l=="function"?l(Math.sqrt(C*C+F*F)):l,easing:a,css:(E,z)=>{var N=z*C,k=z*F,U=E+z*W,M=E+z*V;return`transform: ${s} translate(${N}px, ${k}px) scale(${U}, ${M});`}}}function bn(m){if("currentCSSZoom"in m)return m.currentCSSZoom;for(var e=m,u=1;e!==null;)u*=+getComputedStyle(e).zoom,e=e.parentElement;return u}var yn=b('<menu class="pane unstyled svelte-6kuqba"><!></menu>'),$n=b('<li role="none" class="svelte-6kuqba"><div role="menuitem" aria-label="contextmenu submenmu" aria-haspopup="menu" tabindex="-1"><div class="content"><div class="icon"><!></div> <div class="title"><!></div></div> <div class="chevron svelte-6kuqba" aria-hidden="true"></div></div> <!></li>');function Jt(m,e){ft(e,!0);const u=ge.get(),S=u.add_submenu(),{layout:w}=u,l=R(()=>S.selected);let a=J(void 0);const r=ne.get(),s=ne.set();let f=J(0),D=J(0);ke(()=>{t(a)&&T(t(a),w,r)});const T=(z,N,k)=>{const{x:U,y:M,width:j,height:P}=z.getBoundingClientRect();s.width=j,s.height=P;const L=U-t(f),H=M-t(D),q=L+j+k.width-N.width;if(q<=0)x(f,k.width,!0);else{const Y=j-L;Y<=0?x(f,-j):Y>q?x(f,k.width-q):x(f,Y-j)}x(D,Math.min(0,N.height-(H+P)),!0)};var _=$n();let v;var p=c(_);let y;var g=c(p),d=c(g),C=c(d);kt(C,()=>e.icon??Ft),i(d);var F=o(d,2),W=c(F);kt(W,()=>e.children),i(F),i(g),$(2),i(p);var V=o(p,2);{var E=z=>{var N=yn();let k;var U=c(N);kt(U,()=>e.menu),i(N),Zt(N,M=>x(a,M),()=>t(a)),vt(()=>k=ee(N,"",k,{transform:`translate3d(${t(f)??""}px, ${t(D)??""}px, 0)`,"max-height":`${w.height??""}px`})),n(z,N)};tt(V,z=>{t(l)&&z(E)})}i(_),vt(()=>{v=ee(_,"",v,{"--contextmenu_depth":S.depth}),y=ht(p,1,"menu_item plain selectable svelte-6kuqba",null,y,{selected:t(l)}),fe(p,"aria-expanded",t(l))}),St("mouseenter",p,z=>{Pt(z),setTimeout(()=>u.select(S))}),n(m,_),xt()}var wn=b("<!> <!>",1);function Vt(m,e){ft(e,!0);const u=it(e,"name",3,"Cat"),S=it(e,"icon",3,"😺");Jt(m,{icon:a=>{$();var r=O();vt(()=>Ct(r,S())),n(a,r)},menu:a=>{var r=wn(),s=I(r);st(s,{run:()=>e.act({type:e.position==="adventure"?"cat_go_home":"cat_go_adventure",name:u()}),icon:T=>{var _=dt(),v=I(_);{var p=g=>{var d=O("🏠");n(g,d)},y=g=>{var d=O("🌄");n(g,d)};tt(v,g=>{e.position==="adventure"?g(p):g(y,-1)})}n(T,_)},children:(T,_)=>{var v=dt(),p=I(v);{var y=d=>{var C=O("go home");n(d,C)},g=d=>{var C=O("go adventure");n(d,C)};tt(p,d=>{e.position==="adventure"?d(y):d(g,-1)})}n(T,v)},$$slots:{icon:!0,default:!0}});var f=o(s,2);st(f,{run:()=>e.act({type:"cat_be_or_do",name:u(),position:e.position}),icon:T=>{var _=dt(),v=I(_);{var p=g=>{var d=O("🌄");n(g,d)},y=g=>{var d=O("🏠");n(g,d)};tt(v,g=>{e.position==="adventure"?g(p):g(y,-1)})}n(T,_)},children:(T,_)=>{var v=dt(),p=I(v);{var y=d=>{var C=O("do adventure");n(d,C)},g=d=>{var C=O("be home");n(d,C)};tt(p,d=>{e.position==="adventure"?d(y):d(g,-1)})}n(T,v)},$$slots:{icon:!0,default:!0}}),n(a,r)},children:(a,r)=>{$();var s=O();vt(()=>Ct(s,u())),n(a,s)},$$slots:{icon:!0,menu:!0,default:!0}}),xt()}var Cn=b("<!> <!> <!>",1);function kn(m,e){var u=Cn(),S=I(u);be(S,{href:"https://github.com/fuzdev/fuz_ui",icon:r=>{Xe(r,{get data(){return Ge},size:"var(--icon_size_xs)"})},children:(r,s)=>{$();var f=O("Source code");n(r,f)},$$slots:{icon:!0,default:!0}});var w=o(S,2);Kt(w,{});var l=o(w,2);st(l,{get run(){return e.toggle_about_dialog},icon:r=>{$();var s=O("?");n(r,s)},children:(r,s)=>{$();var f=O("About");n(r,f)},$$slots:{icon:!0,default:!0}}),n(m,u)}const Ce=m=>{const e=m.length;if(e===2)return"cats";if(e===0)return null;const u=m[0];return u.icon+u.name};var Tn=b("<!> <!>",1),Sn=b("<!> <!>",1),Pn=b("<!> <!> <!>",1);function In(m,e){ft(e,!0);const u=R(()=>Ce(e.adventure_cats));Jt(m,{icon:l=>{$();var a=O("🏠");n(l,a)},menu:l=>{var a=Pn(),r=I(a);{var s=_=>{var v=Tn(),p=I(v);st(p,{run:()=>e.act({type:"call_cats_home"}),icon:d=>{$();var C=O("🐈‍⬛");n(d,C)},children:(d,C)=>{$();var F=O("call");n(d,F)},$$slots:{icon:!0,default:!0}});var y=o(p,2);Kt(y,{}),n(_,v)};tt(r,_=>{t(u)&&_(s)})}var f=o(r,2);Wt(f,17,()=>e.home_cats,_=>_.name,(_,v)=>{Vt(_,{get name(){return t(v).name},get icon(){return t(v).icon},get position(){return t(v).position},get act(){return e.act}})});var D=o(f,2);{var T=_=>{var v=Sn(),p=I(v);st(p,{run:()=>e.act({type:"cat_be_or_do",name:null,position:"home"}),icon:d=>{$();var C=O("🏠");n(d,C)},children:(d,C)=>{$();var F=O("be");n(d,F)},$$slots:{icon:!0,default:!0}});var y=o(p,2);st(y,{run:()=>e.act({type:"call_cats_adventure"}),icon:d=>{$();var C=O("🦋");n(d,C)},children:(d,C)=>{$();var F=O("leave");n(d,F)},$$slots:{icon:!0,default:!0}}),n(_,v)};tt(D,_=>{t(u)||_(T)})}n(l,a)},children:(l,a)=>{$();var r=O("home");n(l,r)},$$slots:{icon:!0,menu:!0,default:!0}}),xt()}var En=b("<!> <!>",1),An=b("<!> <!>",1),On=b("<!> <!> <!>",1);function zn(m,e){ft(e,!0);const u=R(()=>Ce(e.home_cats));Jt(m,{icon:l=>{$();var a=O("🌄");n(l,a)},menu:l=>{var a=On(),r=I(a);{var s=_=>{var v=En(),p=I(v);st(p,{run:()=>e.act({type:"call_cats_adventure"}),icon:d=>{$();var C=O("🦋");n(d,C)},children:(d,C)=>{$();var F=O("call");n(d,F)},$$slots:{icon:!0,default:!0}});var y=o(p,2);Kt(y,{}),n(_,v)};tt(r,_=>{t(u)&&_(s)})}var f=o(r,2);Wt(f,17,()=>e.adventure_cats,_=>_.name,(_,v)=>{Vt(_,{get name(){return t(v).name},get icon(){return t(v).icon},get position(){return t(v).position},get act(){return e.act}})});var D=o(f,2);{var T=_=>{var v=An(),p=I(v);st(p,{run:()=>e.act({type:"cat_be_or_do",name:null,position:"adventure"}),icon:d=>{$();var C=O("🌄");n(d,C)},children:(d,C)=>{$();var F=O("do");n(d,F)},$$slots:{icon:!0,default:!0}});var y=o(p,2);st(y,{run:()=>e.act({type:"call_cats_home"}),icon:d=>{$();var C=O("🐈‍⬛");n(d,C)},children:(d,C)=>{$();var F=O("leave");n(d,F)},$$slots:{icon:!0,default:!0}}),n(_,v)};tt(D,_=>{t(u)||_(T)})}n(l,a)},children:(l,a)=>{$();var r=O("adventure");n(l,r)},$$slots:{icon:!0,menu:!0,default:!0}}),xt()}var Nn=b('<span class="icon svelte-1py4cgo"> </span>'),Rn=b('<span class="name svelte-1py4cgo"><!> </span>'),Fn=b("<span><!><!></span>");function me(m,e){const u=it(e,"name",3,"Cat"),S=it(e,"icon",3,"😺"),w=it(e,"show_name",3,!0),l=it(e,"show_icon",3,!0);var a=Fn();let r;var s=c(a);{var f=_=>{var v=Nn(),p=c(v,!0);i(v),vt(()=>Ct(p,S())),n(_,v)};tt(s,_=>{l()&&_(f)})}var D=o(s);{var T=_=>{var v=Rn(),p=c(v);kt(p,()=>e.children??Ft);var y=o(p,1,!0);i(v),vt(()=>Ct(y,u())),n(_,v)};tt(D,_=>{w()&&_(T)})}i(a),vt(()=>r=ht(a,1,"cat svelte-1py4cgo",null,r,{"has-icon":l()})),n(m,a)}const Dn=`<script lang="ts">
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
	.cat_wrapper {
		display: flex;
		flex-direction: column;
		width: 130px;
	}
</style>
`;var Ln=b("<!> <!>",1),qn=b('<div class="cat_wrapper svelte-177dlvm"><!></div>'),Mn=b('<div class="position home svelte-177dlvm"><div class="icon svelte-177dlvm">🏠</div> <div class="cats svelte-177dlvm"></div></div>'),Hn=b('<div class="cat_wrapper svelte-177dlvm"><!></div>'),Un=b('<div class="position adventure svelte-177dlvm"><div class="icon svelte-177dlvm">🌄</div> <div class="cats svelte-177dlvm"></div></div>'),Bn=b('<section class="display:flex"><div><!> <!></div></section> <section><!></section>',1),Wn=b("<!> <!>",1),jn=b('<div class="mx_auto box"><div class="pane p_xl text-align:center"><h1>About Fuz</h1> <blockquote>Svelte UI library</blockquote> <blockquote>free and open source at<br/><!></blockquote> <code class="display:block p_md mb_lg">npm i -D <a href="https://www.npmjs.com/package/@fuzdev/fuz_ui">@fuzdev/fuz_ui</a></code> <div class="p_xl box"><h2>Color scheme</h2> <!> <h2>Theme</h2> <!></div></div></div>'),Xn=b("<!> <!>",1);function Gn(m,e){ft(e,!0);const u=Nt.get(),S=R(()=>u.component),w="Alyssa",l="Ben",a="home";let r=J(a),s=J(a);const f=R(()=>t(r)===t(s)?"😺":"😾"),D=R(()=>t(r)===t(s)?"😸":"😿"),T=R(()=>({name:w,icon:t(f),position:t(r)})),_=R(()=>({name:l,icon:t(D),position:t(s)}));let v=J(!1);const p=(P,L)=>{const H=[],q=[];for(const Y of P){const B=Y.position==="home"?H:q;L?B.unshift(Y):B.push(Y)}return{home_cats:H,adventure_cats:q}},y=R(()=>p([t(T),t(_)],t(v))),g=R(()=>t(y).home_cats),d=R(()=>t(y).adventure_cats),C=R(()=>t(r)!==a||t(s)!==a),F=()=>{x(r,a),x(s,a)};let W=J(!1);const V=()=>{x(W,!t(W))},E=P=>{switch(P.type){case"call_cats_adventure":{x(r,"adventure"),x(s,"adventure");break}case"call_cats_home":{x(r,"home"),x(s,"home");break}case"cat_go_adventure":{P.name===w?x(r,"adventure"):P.name===l&&x(s,"adventure");break}case"cat_go_home":{P.name===w?x(r,"home"):P.name===l&&x(s,"home");break}case"cat_be_or_do":{x(v,!t(v));break}}},[z,N]=Be({fallback:(P,L)=>{const H=window.getComputedStyle(P),q=H.transform==="none"?"":H.transform;return{duration:1500,easing:gn,css:Y=>`
					transform: ${q} scale(${Y});
					opacity: ${Y}
				`}}});var k=Xn(),U=I(k);Lt(U,()=>t(S),(P,L)=>{L(P,{scoped:!0,children:(H,q)=>{Ot(H,{children:(Y,B)=>{var et=Wn(),nt=I(et);zt(nt,{text:"Full example"});var ct=o(nt,2);Tt(ct,{entries:gt=>{var _t=Ln(),lt=I(_t);{var mt=K=>{ye(K,{run:F,content:"Reset",icon:"↻"})};tt(lt,K=>{t(C)&&K(mt)})}var X=o(lt,2);kn(X,{toggle_about_dialog:V}),n(gt,_t)},children:(gt,_t)=>{var lt=Bn(),mt=I(lt),X=c(mt),K=c(X);Tt(K,{entries:h=>{In(h,{act:E,get home_cats(){return t(g)},get adventure_cats(){return t(d)}})},children:(h,A)=>{var G=Mn(),Q=o(c(G),2);Wt(Q,29,()=>t(g),({name:Z,icon:pt,position:at})=>Z,(Z,pt)=>{let at=()=>t(pt).name,Et=()=>t(pt).icon,bt=()=>t(pt).position;var yt=qn(),Mt=c(yt);Tt(Mt,{entries:rt=>{Vt(rt,{act:E,get name(){return at()},get icon(){return Et()},get position(){return bt()}})},children:(rt,At)=>{me(rt,{get name(){return at()},get icon(){return Et()}})},$$slots:{entries:!0,default:!0}}),i(yt),Ut(1,yt,()=>N,()=>({key:at()})),Ut(2,yt,()=>z,()=>({key:at()})),re(yt,()=>_e,null),n(Z,yt)}),i(Q),i(G),n(h,G)},$$slots:{entries:!0,default:!0}});var ot=o(K,2);Tt(ot,{entries:h=>{zn(h,{act:E,get home_cats(){return t(g)},get adventure_cats(){return t(d)}})},children:(h,A)=>{var G=Un(),Q=o(c(G),2);Wt(Q,29,()=>t(d),({name:Z,icon:pt,position:at})=>Z,(Z,pt)=>{let at=()=>t(pt).name,Et=()=>t(pt).icon,bt=()=>t(pt).position;var yt=Hn(),Mt=c(yt);Tt(Mt,{entries:rt=>{Vt(rt,{act:E,get name(){return at()},get icon(){return Et()},get position(){return bt()}})},children:(rt,At)=>{me(rt,{get name(){return at()},get icon(){return Et()}})},$$slots:{entries:!0,default:!0}}),i(yt),Ut(1,yt,()=>N,()=>({key:at()})),Ut(2,yt,()=>z,()=>({key:at()})),re(yt,()=>_e,null),n(Z,yt)}),i(Q),i(G),n(h,G)},$$slots:{entries:!0,default:!0}}),i(X),i(mt);var ut=o(mt,2),Rt=c(ut);$e(Rt,{summary:h=>{$();var A=O("View example source");n(h,A)},children:(h,A)=>{Dt(h,{get content(){return Dn}})},$$slots:{summary:!0,default:!0}}),i(ut),n(gt,lt)},$$slots:{entries:!0,default:!0}}),n(Y,et)},$$slots:{default:!0}})},$$slots:{default:!0}})});var M=o(U,2);{var j=P=>{Ke(P,{onclose:()=>x(W,!1),children:(L,H)=>{var q=jn(),Y=c(q),B=o(c(Y),4),et=o(c(B),2);je(et,{path:"fuzdev/fuz_ui"}),i(B);var nt=o(B,4),ct=o(c(nt),2);Ve(ct,{});var wt=o(ct,4);Ye(wt,{}),i(nt),i(Y),i(q),n(L,q)},$$slots:{default:!0}})};tt(M,P=>{t(W)&&P(j)})}n(m,k),xt()}var Vn=b("<!> <!> <!>",1),Yn=b(`<div class="panel p_md"><p>Try opening the contextmenu on this panel with rightclick or tap-and-hold.</p> <!> <div><code> </code></div> <div><code> </code></div> <div><code> </code></div> <aside class="mt_lg">The <code>scoped</code> prop is only needed when mounting a contextmenu inside a specific element
					instead of the entire page.</aside></div>`),Kn=b("<!> <!>",1);function Zn(m,e){ft(e,!0);const u=Nt.get(),S=R(()=>u.component),w=R(()=>u.name);let l=J(!1),a=J(!1),r=J(!1);var s=dt(),f=I(s);Lt(f,()=>t(S),(D,T)=>{T(D,{scoped:!0,children:(_,v)=>{Ot(_,{children:(p,y)=>{var g=Kn(),d=I(g);zt(d,{text:"Basic usage"});var C=o(d,2);Tt(C,{entries:W=>{var V=Vn(),E=I(V);st(E,{run:()=>void x(l,!t(l)),children:(k,U)=>{$();var M=O("Hello world");n(k,M)},$$slots:{default:!0}});var z=o(E,2);st(z,{run:()=>void x(a,!t(a)),icon:U=>{$();var M=O("🌞");n(U,M)},children:(U,M)=>{$();var j=O("Hello with an optional icon snippet");n(U,j)},$$slots:{icon:!0,default:!0}});var N=o(z,2);st(N,{run:()=>void x(r,!t(r)),icon:"🌚",children:(k,U)=>{$();var M=O("Hello with an optional icon string");n(k,M)},$$slots:{default:!0}}),n(W,V)},children:(W,V)=>{var E=Yn(),z=o(c(E),2);{let nt=R(()=>`<${t(w)} scoped>
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
        Hello with an optional icon string <!-- ${t(r)} -->
      </ContextmenuEntry>
    {/snippet}
    ...markup with the above contextmenu behavior...
  </Contextmenu>
  ...markup with only default contextmenu behavior...
</${t(w)}>
...markup without contextmenu behavior...`);Dt(z,{get content(){return t(nt)}})}var N=o(z,2),k=c(N);let U;var M=c(k);i(k),i(N);var j=o(N,2),P=c(j);let L;var H=c(P);i(P),i(j);var q=o(j,2),Y=c(q);let B;var et=c(Y);i(Y),i(q),$(2),i(E),vt(()=>{U=ht(k,1,"",null,U,{color_g_5:t(l)}),Ct(M,`greeted = ${t(l)??""}`),L=ht(P,1,"",null,L,{color_e_5:t(a)}),Ct(H,`greeted_icon_snippet = ${t(a)??""}`),B=ht(Y,1,"",null,B,{color_d_5:t(r)}),Ct(et,`greeted_icon_string = ${t(r)??""}`)}),n(W,E)},$$slots:{entries:!0,default:!0}}),n(p,g)},$$slots:{default:!0}})},$$slots:{default:!0}})}),n(m,s),xt()}var Jn=b("<span> </span>");function Ht(m,e){ft(e,!0);const u=xe(e,["$$slots","$$events","$$legacy","glyph","size"]),S="var(--font_size, 1em)",w="var(--font_size, inherit)",l=R(()=>e.size??S);var a=Jn();pe(a,()=>({...u,class:`glyph display:inline-block text-align:center line-height:1 white-space:nowrap font-weight:400 ${e.class??""}`,[he]:{width:t(l),height:t(l),"min-width":t(l),"min-height":t(l),"font-size":e.size??w}}));var r=c(a,!0);i(a),vt(()=>Ct(r,e.glyph)),n(m,a),xt()}var Qn=b('<span class="color_f_50">option f</span>'),to=b('<span class="color_g_50">option g</span>'),eo=b('<span class="color_j_50">option j</span>'),no=b("<!> <!> <!> <!>",1),oo=b('<li class="color_error">Error: <code> </code></li>'),ao=b('<div class="display:flex"><div class="box"><button type="button"><!></button> <div class="row"><button type="button"><!></button> <button type="button"><!></button> <button type="button"><!></button></div> <button type="button"><!></button></div></div>'),so=b(`<div class="panel p_md"><p class="mb_md">The <code> </code> prop <code>contextmenu</code> accepts a custom <code>ContextmenuState</code> instance, allowing you to observe its reactive state and control
					it programmatically.</p> <!> <!> <p class="mb_md">Try opening the contextmenu on this panel, then use the navigation buttons below to cycle
					through entries -- just like the arrow keys. The color entries return <code></code> to keep the menu open after activation, allowing you to select multiple colors using the activate
					button (↵).</p> <div><p>Reactive state:</p> <ul><li><code>contextmenu.opened</code> === <code> </code></li> <li><code>contextmenu.x</code> === <code> </code></li> <!></ul></div> <!></div>`),ro=b("<!> <!>",1);function io(m,e){ft(e,!0);const u=Nt.get(),S=R(()=>u.component),w=R(()=>u.name),l=new Yt;let a=J(void 0);const r=R(()=>t(a)?`color_${t(a)}_5`:void 0),s=R(()=>t(a)?`color_${t(a)}`:void 0);var f=dt(),D=I(f);Lt(D,()=>t(S),(T,_)=>{_(T,{get contextmenu(){return l},scoped:!0,children:(v,p)=>{Ot(v,{children:(y,g)=>{var d=ro(),C=I(d);zt(C,{text:"Custom instance"});var F=o(C,2);Tt(F,{entries:V=>{Jt(V,{icon:N=>{$();var k=O("🎨");n(N,k)},menu:N=>{var k=no(),U=I(k);st(U,{run:()=>(x(a,"f"),{ok:!0,close:!1}),children:(L,H)=>{var q=Qn();n(L,q)},$$slots:{default:!0}});var M=o(U,2);st(M,{run:()=>(x(a,"g"),{ok:!0,close:!1}),children:(L,H)=>{var q=to();n(L,q)},$$slots:{default:!0}});var j=o(M,2);st(j,{run:()=>(x(a,"j"),{ok:!0,close:!1}),children:(L,H)=>{var q=eo();n(L,q)},$$slots:{default:!0}});var P=o(j,2);st(P,{run:()=>(l.close(),{ok:!0}),children:(L,H)=>{$();var q=O("close contextmenu");n(L,q)},$$slots:{default:!0}}),n(N,k)},children:(N,k)=>{$();var U=O("select color");n(N,U)},$$slots:{icon:!0,menu:!0,default:!0}})},children:(V,E)=>{var z=so(),N=c(z),k=o(c(N)),U=c(k,!0);i(k),$(5),i(N);var M=o(N,2);Dt(M,{lang:"ts",dangerous_raw_html:'<span class="token_keyword">const</span> contextmenu <span class="token_operator">=</span> <span class="token_keyword">new</span> <span class="token_class_name"><span class="token_capitalized_identifier token_class_name">ContextmenuState</span></span><span class="token_punctuation">(</span><span class="token_punctuation">)</span><span class="token_punctuation">;</span>'});var j=o(M,2);{let X=R(()=>`<${t(w)} {contextmenu} scoped>...</${t(w)}>`);Dt(j,{get content(){return t(X)}})}var P=o(j,2),L=o(c(P));L.textContent="{ok: true, close: false}",$(),i(P);var H=o(P,2),q=o(c(H),2),Y=c(q),B=o(c(Y),2),et=c(B,!0);i(B),i(Y);var nt=o(Y,2),ct=o(c(nt),2),wt=c(ct);i(ct),i(nt);var gt=o(nt,2);{var _t=X=>{var K=oo(),ot=o(c(K)),ut=c(ot,!0);i(ot),i(K),vt(()=>Ct(ut,l.error)),n(X,K)};tt(gt,X=>{l.error&&X(_t)})}i(q),i(H);var lt=o(H,2);{var mt=X=>{var K=ao(),ot=c(K),ut=c(ot),Rt=c(ut);Ht(Rt,{glyph:"↑"}),i(ut);var It=o(ut,2),h=c(It),A=c(h);Ht(A,{glyph:"←"}),i(h);var G=o(h,2),Q=c(G);Ht(Q,{glyph:"↵"}),i(G);var Z=o(G,2),pt=c(Z);Ht(pt,{glyph:"→"}),i(Z),i(It);var at=o(It,2),Et=c(at);Ht(Et,{glyph:"↓"}),i(at),i(ot),i(K),vt(()=>{ht(ut,1,`border_bottom_left_radius_0 border_bottom_right_radius_0 ${t(s)??""}`),ut.disabled=!l.can_select_previous,ht(h,1,`border_bottom_right_radius_0 border_top_right_radius_0 ${t(s)??""}`),h.disabled=!l.can_collapse,ht(G,1,`border_radius_0 ${t(s)??""}`),G.disabled=!l.can_activate,ht(Z,1,`border_bottom_left_radius_0 border_top_left_radius_0 ${t(s)??""}`),Z.disabled=!l.can_expand,ht(at,1,`border_top_left_radius_0 border_top_right_radius_0 ${t(s)??""}`),at.disabled=!l.can_select_next}),St("mousedown",ut,bt=>{Pt(bt),l.select_previous()},!0),St("mousedown",h,bt=>{Pt(bt),l.collapse_selected()},!0),St("mousedown",G,async bt=>{Pt(bt),await l.activate_selected()},!0),St("mousedown",Z,bt=>{Pt(bt),l.expand_selected()},!0),St("mousedown",at,bt=>{Pt(bt),l.select_next()},!0),Ut(3,K,()=>We),n(X,K)};tt(lt,X=>{l.opened&&X(mt)})}i(z),vt(()=>{Ct(U,t(w)),ht(H,1,`mb_md ${t(r)??""}`),Ct(et,l.opened),Ct(wt,`${l.x??""} && contextmenu.y === ${l.y??""}`)}),n(V,z)},$$slots:{entries:!0,default:!0}}),n(y,d)},$$slots:{default:!0}})},$$slots:{default:!0}})}),n(m,f),xt()}var lo=b(`<div><div class="mb_lg"><p>When the Fuz contextmenu opens and the user has selected text, the menu includes a <code>copy text</code> entry.</p> <p>Try <button type="button">selecting text</button> and then opening the contextmenu on it.</p></div> <label class="svelte-1abzq1c"><input type="text" placeholder="paste text here?"/></label> <p>Opening the contextmenu on an <code>input</code> or <code>textarea</code> opens the browser's
					default contextmenu.</p> <label class="svelte-1abzq1c"><textarea placeholder="paste text here?"></textarea></label> <p><!> likewise has your browser's default
					contextmenu behavior.</p> <p><code>contenteditable</code></p> <blockquote contenteditable=""></blockquote> <p><code>contenteditable="plaintext-only"</code></p> <blockquote contenteditable="plaintext-only"></blockquote> <aside>Note that if there are no actions found (like the toggle here) the system contextmenu
					opens instead, bypassing the Fuz contextmenu, as demonstrated in the default behaviors.</aside></div>`),co=b("<div><!></div> <!>",1);function uo(m,e){ft(e,!0);const u=Nt.get(),S=R(()=>u.component),w=new Yt;let l=J(!1),a=J(void 0);const r=()=>{const y=window.getSelection();if(!y||!t(a))return;const g=document.createRange();g.selectNodeContents(t(a)),y.removeAllRanges(),y.addRange(g)};let s=J("");const f="If a contextmenu is triggered on selected text, it includes a 'copy text' entry.  Try selecting text and then opening the contextmenu on it.",D=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.


Try selecting text and then opening the contextmenu on it.`,T=`If a contextmenu is triggered on selected text, it includes a 'copy text' entry.

Try selecting text and then opening the contextmenu on it.`,_=R(()=>t(s)===f||t(s)===D||t(s)===T);var v=dt(),p=I(v);Lt(p,()=>t(S),(y,g)=>{g(y,{get contextmenu(){return w},scoped:!0,children:(d,C)=>{Ot(d,{children:(F,W)=>{var V=co(),E=I(V);let z;var N=c(E);zt(N,{text:"Select text"}),i(E);var k=o(E,2);Tt(k,{entries:M=>{st(M,{run:()=>void x(l,!t(l)),children:(j,P)=>{$();var L=O("Toggle something");n(j,L)},$$slots:{default:!0}})},children:(M,j)=>{var P=lo();let L;var H=c(P),q=o(c(H),2),Y=o(c(q));let B;$(),i(q),i(H),Zt(H,ot=>x(a,ot),()=>t(a));var et=o(H,2),nt=c(et);qt(nt),i(et);var ct=o(et,2);let wt;var gt=o(ct,2),_t=c(gt);Te(_t),i(gt);var lt=o(gt,2),mt=c(lt);Bt(mt,{path:"Web/HTML/Global_attributes/contenteditable"}),$(),i(lt);var X=o(lt,4),K=o(X,4);$(2),i(P),vt(()=>{L=ht(P,1,"panel p_md",null,L,{color_g_5:t(_)}),B=ht(Y,1,"",null,B,{color_a:t(l)}),wt=ht(ct,1,"",null,wt,{color_g_5:t(_)})}),ae("click",Y,r),ve(nt,()=>t(s),ot=>x(s,ot)),ve(_t,()=>t(s),ot=>x(s,ot)),ue("innerText",X,()=>t(s),ot=>x(s,ot)),ue("innerText",K,()=>t(s),ot=>x(s,ot)),n(M,P)},$$slots:{entries:!0,default:!0}}),vt(()=>z=ht(E,1,"",null,z,{color_d_5:t(_)})),n(F,V)},$$slots:{default:!0}})},$$slots:{default:!0}})}),n(m,v),xt()}oe(["click"]);var vo=b('<div class="panel p_md mb_lg"><p>Try <button type="button">selecting some text</button> and opening the contextmenu in this panel.</p> <p>Try opening the contextmenu on <a>this link</a>.</p></div>'),_o=b('<li>custom "some custom entry" entry</li>'),mo=b('<li>"copy text" entry when text is selected</li>'),po=b("<li>link entry when clicking on a link</li>"),ho=b("<p><strong>Expected:</strong> the Fuz contextmenu will open and show:</p> <ul><!> <!> <!></ul>",1),fo=b(`<p><strong>Expected:</strong> no behaviors defined. The system contextmenu will show, bypassing the
			Fuz contextmenu.</p>`),xo=b('<!> <p>Check the boxes below to disable automatic <code>a</code> link detection and <code>copy text</code> detection, and see how the contextmenu behaves.</p> <!> <fieldset><label class="row"><input type="checkbox"/> <span>disable automatic link entries, <code></code></span></label> <label class="row"><input type="checkbox"/> <span>disable automatic copy text entries, <code></code></span></label></fieldset> <!> <p>When no behaviors are defined, the system contextmenu is shown instead.</p> <div class="mb_md"><label class="row"><input type="checkbox"/> include a custom entry, which ensures the Fuz contextmenu is used</label></div> <!>',1);function go(m,e){ft(e,!0);const u=v=>{var p=vo(),y=c(p),g=o(c(y));let d;$(),i(y),Zt(y,W=>x(T,W),()=>t(T));var C=o(y,2),F=o(c(C));$(),i(C),i(p),vt(W=>{d=ht(g,1,"",null,d,{color_h:t(D)}),fe(F,"href",W)},[()=>Ue("/")]),ae("click",g,_),n(v,p)},S=Nt.get(),w=R(()=>S.component),l=R(()=>S.name),a=new Yt;let r=J(!1),s=J(!1),f=J(!0),D=J(!1),T=J(void 0);const _=()=>{const v=window.getSelection();if(!v||!t(T))return;const p=document.createRange();p.selectNodeContents(t(T)),v.removeAllRanges(),v.addRange(p)};Ot(m,{children:(v,p)=>{var y=xo(),g=I(y);zt(g,{text:"Disable default behaviors"});var d=o(g,4);{let B=R(()=>`<${t(l)}${t(r)?" link_entry={null}":""}${t(s)?" text_entry={null}":""}>`);Dt(d,{get content(){return t(B)}})}var C=o(d,2),F=c(C),W=c(F);qt(W);var V=o(W,2),E=o(c(V));E.textContent="link_entry={null}",i(V),i(F);var z=o(F,2),N=c(z);qt(N);var k=o(N,2),U=o(c(k));U.textContent="text_entry={null}",i(k),i(z),i(C);var M=o(C,2);{let B=R(()=>t(r)?null:void 0),et=R(()=>t(s)?null:void 0);Lt(M,()=>t(w),(nt,ct)=>{ct(nt,{get contextmenu(){return a},scoped:!0,get link_entry(){return t(B)},get text_entry(){return t(et)},children:(wt,gt)=>{var _t=dt(),lt=I(_t);{var mt=K=>{Tt(K,{entries:ut=>{st(ut,{icon:">",run:()=>void x(D,!t(D)),children:(Rt,It)=>{$();var h=O("some custom entry");n(Rt,h)},$$slots:{default:!0}})},children:(ut,Rt)=>{u(ut)},$$slots:{entries:!0,default:!0}})},X=K=>{u(K)};tt(lt,K=>{t(f)?K(mt):K(X,-1)})}n(wt,_t)},$$slots:{default:!0}})})}var j=o(M,4),P=c(j),L=c(P);qt(L),$(),i(P),i(j);var H=o(j,2);{var q=B=>{var et=ho(),nt=o(I(et),2),ct=c(nt);{var wt=X=>{var K=_o();n(X,K)};tt(ct,X=>{t(f)&&X(wt)})}var gt=o(ct,2);{var _t=X=>{var K=mo();n(X,K)};tt(gt,X=>{t(s)||X(_t)})}var lt=o(gt,2);{var mt=X=>{var K=po();n(X,K)};tt(lt,X=>{t(r)||X(mt)})}i(nt),n(B,et)},Y=B=>{var et=fo();n(B,et)};tt(H,B=>{t(f)||!t(r)||!t(s)?B(q):B(Y,-1)})}Qt(W,()=>t(r),B=>x(r,B)),Qt(N,()=>t(s),B=>x(s,B)),Qt(L,()=>t(f),B=>x(f,B)),n(v,y)},$$slots:{default:!0}}),xt()}oe(["click"]);var bo=b(`<!> <div class="panel p_md"><!> <p>Opening the contextmenu on <a href="https://ui.fuz.dev/">a link like this one</a> has
				special behavior by default. To accesss your browser's normal contextmenu, open the
				contextmenu on the link inside the contextmenu itself or hold <code>Shift</code>.</p> <p>Although disruptive to default browser behavior, this allows links to have contextmenu
				behaviors, and it allows you to open the contextmenu anywhere to access all contextual
				behaviors.</p> <aside>Notice that opening the contextmenu on anything here except the link passes through to the
				browser's default contextmenu, because we didn't include any behaviors.</aside></div>`,1);function yo(m,e){ft(e,!0);const u=Nt.get(),S=R(()=>u.component),w=R(()=>u.name);var l=dt(),a=I(l);Lt(a,()=>t(S),(r,s)=>{s(r,{scoped:!0,children:(f,D)=>{Ot(f,{children:(T,_)=>{var v=bo(),p=I(v);zt(p,{text:"Default behaviors"});var y=o(p,2),g=c(y);{let d=R(()=>`<${t(w)} scoped>
  ...<a href="https://ui.fuz.dev/">
    a link like this one
  </a>...
</${t(w)}>`);Dt(g,{get content(){return t(d)}})}$(6),i(y),n(T,v)},$$slots:{default:!0}})},$$slots:{default:!0}})}),n(m,l),xt()}var $o=b("<!> <!> <!> <!> <!> <!> <!> <!> <section><aside><p>todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element</p></aside> <aside><p>todo: for mobile, probably change to a drawer-from-bottom design</p></aside></section>",1);function Go(m,e){ft(e,!0);const S=Pe("Contextmenu");Nt.set(),Se(m,{get tome(){return S},children:(w,l)=>{var a=$o(),r=I(a);vn(r,{});var s=o(r,2);Zn(s,{});var f=o(s,2);yo(f,{});var D=o(f,2);uo(D,{});var T=o(D,2);go(T,{});var _=o(T,2);io(_,{});var v=o(_,2);Gn(v,{});var p=o(v,2);fn(p),$(2),n(w,a)},$$slots:{default:!0}}),xt()}export{Go as component};
