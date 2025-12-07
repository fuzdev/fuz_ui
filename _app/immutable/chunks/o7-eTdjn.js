import"./DsnmJJEf.js";import{m as De,n as Ne,y as ze,D as Ce,p as Ee,c as Re,f as u,a as $,s as e,aa as Be,b as v,d,ag as R,r as n,i as p,u as Se,al as M,br as ee,ak as B,ai as He,t as P,e as T}from"./DuI-xSAA.js";import{e as A}from"./D0KECqjk.js";import{r as H,s as h,i as Oe,g as I}from"./CQ48wsHn.js";import{b as O}from"./BQ5J6NaD.js";import{C as y}from"./Be4uwsUc.js";import{g as Ye}from"./CurcFKJC.js";import{i as D}from"./DvyKjXrD.js";import{T as je}from"./DdALwvgf.js";import{T as N,a as z}from"./CDpV4nCL.js";import{M as Fe}from"./DxSM8fMb.js";import{M as ye}from"./CsYsuKce.js";import{D as Ue}from"./DfSIkStk.js";function te(Y,j,ne){Ne&&ze();var F=new Ce(Y);De(()=>{var U=j();F.ensure(U,ne)})}var We=u('<li class="svelte-149pnxa"> </li>'),qe=u(`<!> <p>Triggers when the element enters the viewport by at least a pixel. Scroll to see items change
			state.</p> <!> <ul class="demo_list svelte-149pnxa"></ul>`,1),Ge=u('<li class="svelte-149pnxa"> </li>'),Je=u('<!> <p>Triggers when 50% of the element is visible.</p> <!> <ul class="demo_list svelte-149pnxa"></ul>',1),Ke=u('<li class="svelte-149pnxa"> </li>'),Qe=u('<!> <p>Triggers only when the element is fully visible.</p> <!> <ul class="demo_list svelte-149pnxa"></ul>',1),Ve=u('<li class="svelte-149pnxa"> </li>'),Xe=u('<ul class="demo_list svelte-149pnxa"></ul>'),Ze=u(`<!> <p>Disconnects after the first intersection cycle (enter and leave). A <code>count</code> of <code>0</code> disables observation. Negative or <code>undefined</code> never disconnects. (the
			default)</p> <!> <!> <button type="button">reset</button>`,1),et=u('<li class="svelte-149pnxa"> </li>'),tt=u('<ul class="demo_list svelte-149pnxa"></ul>'),nt=u('<!> <p>Disconnects after two intersection cycles.</p> <!> <!> <button type="button">reset</button>',1),ot=u('<li class="svelte-149pnxa"> </li>'),st=u('<ul class="demo_list svelte-149pnxa"></ul>'),at=u(`<!> <p>Try different parameter combinations. Positive <code>count</code> values disconnect after N
			cycles. <code>0</code> disables observation. Negative or <code>undefined</code> never disconnects. (the
			default)</p> <div class="controls svelte-149pnxa"><label class="svelte-149pnxa"><code>count</code> <div class="control_inputs svelte-149pnxa"><input type="number" class="svelte-149pnxa"/> <input type="range" class="svelte-149pnxa"/></div></label> <label class="svelte-149pnxa"><code>options.threshold</code> <div class="control_inputs svelte-149pnxa"><input type="number" class="svelte-149pnxa"/> <input type="range" class="svelte-149pnxa"/></div></label> <label class="svelte-149pnxa"><code>options.rootMargin</code> <select><option>0px</option><option>50px</option><option>100px</option><option>-25px</option><option>-50px</option></select></label></div> <!> <button type="button">reset</button>`,1),rt=u(`<section><p>The <!> helper in <!> creates an attachment that observes when an element enters or leaves the viewport using the <!>.</p> <p>Uses the lazy function pattern to optimize reactivity: callbacks can update without recreating
			the observer, preserving state.</p></section> <section><!> <!> <p>The callback receives <code>intersecting</code> (boolean), <code>intersections</code> (number
			count), <code>el</code>, <code>observer</code>, and <code>disconnect</code>.</p></section> <!> <!> <!> <!> <!> <!> <p>Full API docs at <!>.</p>`,1);function bt(Y,j){Ee(j,!0);const F=Ye("intersect"),U=()=>typeof window>"u"?15:Math.max(10,Math.floor(window.innerHeight/60)),k=Se(()=>Array.from({length:U()},(re,ie)=>ie));let C=M(0),E=M(3),W=M("0px"),oe=M(0),se=M(0),ae=M(0);je(Y,{get tome(){return F},children:(re,ie)=>{var le=rt(),q=$(le),ce=d(q),ve=e(d(ce));Ue(ve,{name:"intersect"});var de=e(ve,2);ye(de,{module_path:"intersect.svelte.ts"});var ke=e(de,2);Fe(ke,{path:"Web/API/Intersection_Observer_API",children:(g,L)=>{R();var s=Be("Intersection Observer API");v(g,s)},$$slots:{default:!0}}),R(),n(ce),R(2),n(q);var G=e(q,2),pe=d(G);y(pe,{content:"import {intersect} from '@fuzdev/fuz_ui/intersect.svelte.js';",lang:"ts"});var Le=e(pe,2);y(Le,{content:`<div {@attach intersect(() => ({intersecting}) => {
  console.log(intersecting ? 'entered' : 'left');
})}>
  scroll me into view
</div>`}),R(2),n(G);var _e=e(G,2);N(_e,{children:(g,L)=>{var s=qe(),l=$(s);z(l,{text:"threshold: 0 (default)"});var a=e(l,4);y(a,{content:`<div {@attach intersect(() => ({
  onintersect: ({intersecting, el}) => {
    el.classList.toggle('intersecting', intersecting);
  }
}))}>
  content
</div>`});var r=e(a,2);A(r,20,()=>p(k),i=>i,(i,_)=>{var t=We(),c=d(t);n(t),I(t,()=>D(()=>({onintersect:({intersecting:m,el:o})=>{o.classList.toggle("intersecting",m)}}))),P(()=>T(c,`item ${_??""}`)),v(i,t)}),n(r),v(g,s)},$$slots:{default:!0}});var ue=e(_e,2);N(ue,{children:(g,L)=>{var s=Je(),l=$(s);z(l,{text:"threshold: 0.5"});var a=e(l,4);y(a,{content:`<div {@attach intersect(() => ({
  onintersect: ({intersecting, el}) => {
    el.classList.toggle('intersecting', intersecting);
  },
  options: {threshold: 0.5}
}))}>
  content
</div>`});var r=e(a,2);A(r,20,()=>p(k),i=>i,(i,_)=>{var t=Ge(),c=d(t);n(t),I(t,()=>D(()=>({onintersect:({intersecting:m,el:o})=>{o.classList.toggle("intersecting",m)},options:{threshold:.5}}))),P(()=>T(c,`item ${_??""}`)),v(i,t)}),n(r),v(g,s)},$$slots:{default:!0}});var ge=e(ue,2);N(ge,{children:(g,L)=>{var s=Qe(),l=$(s);z(l,{text:"threshold: 1"});var a=e(l,4);y(a,{content:`<div {@attach intersect(() => ({
  onintersect: ({intersecting, el}) => {
    el.classList.toggle('intersecting', intersecting);
  },
  options: {threshold: 1}
}))}>
  content
</div>`});var r=e(a,2);A(r,20,()=>p(k),i=>i,(i,_)=>{var t=Ke(),c=d(t);n(t),I(t,()=>D(()=>({onintersect:({intersecting:m,el:o})=>{o.classList.toggle("intersecting",m)},options:{threshold:1}}))),P(()=>T(c,`item ${_??""}`)),v(i,t)}),n(r),v(g,s)},$$slots:{default:!0}});var me=e(ge,2);N(me,{children:(g,L)=>{var s=Ze(),l=$(s);z(l,{text:"count: 1"});var a=e(l,4);y(a,{content:`<div {@attach intersect(() => ({
  onintersect: ({intersecting, el}) => {
    el.classList.toggle('intersecting', intersecting);
  },
  count: 1
}))}>
  content
</div>`});var r=e(a,2);te(r,()=>p(oe),_=>{var t=Xe();A(t,20,()=>p(k),c=>c,(c,m)=>{var o=Ve(),x=d(o);n(o),I(o,()=>D(()=>({onintersect:({intersecting:w,el:b})=>{b.classList.toggle("intersecting",w)},count:1}))),P(()=>T(x,`item ${m??""}`)),v(c,o)}),n(t),v(_,t)});var i=e(r,2);i.__click=()=>ee(oe),v(g,s)},$$slots:{default:!0}});var he=e(me,2);N(he,{children:(g,L)=>{var s=nt(),l=$(s);z(l,{text:"count: 2"});var a=e(l,4);y(a,{content:`<div {@attach intersect(() => ({
  onintersect: ({intersecting, el}) => {
    el.classList.toggle('intersecting', intersecting);
  },
  count: 2
}))}>
  content
</div>`});var r=e(a,2);te(r,()=>p(se),_=>{var t=tt();A(t,20,()=>p(k),c=>c,(c,m)=>{var o=et(),x=d(o);n(o),I(o,()=>D(()=>({onintersect:({intersecting:w,el:b})=>{b.classList.toggle("intersecting",w)},count:2}))),P(()=>T(x,`item ${m??""}`)),v(c,o)}),n(t),v(_,t)});var i=e(r,2);i.__click=()=>ee(se),v(g,s)},$$slots:{default:!0}});var fe=e(he,2);N(fe,{children:(g,L)=>{var s=at(),l=$(s);z(l,{text:"Configurable"});var a=e(l,4),r=d(a),i=e(d(r),2),_=d(i);H(_),h(_,"min",-1),h(_,"max",3),h(_,"step",1);var t=e(_,2);H(t),h(t,"min",-1),h(t,"max",3),h(t,"step",1),n(i),n(r);var c=e(r,2),m=e(d(c),2),o=d(m);H(o),h(o,"step",.1),h(o,"min",0),h(o,"max",1);var x=e(o,2);H(x),h(x,"step",.1),h(x,"min",0),h(x,"max",1),n(m),n(c);var w=e(c,2),b=e(d(w),2),J=d(b);J.value=J.__value="0px";var K=e(J);K.value=K.__value="50px";var Q=e(K);Q.value=Q.__value="100px";var V=e(Q);V.value=V.__value="-25px";var be=e(V);be.value=be.__value="-50px",n(b),n(w),n(a);var $e=e(a,2);te($e,()=>p(ae),f=>{var X=st();A(X,20,()=>p(k),Z=>Z,(Z,Pe)=>{var S=ot(),Te=d(S);n(S),I(S,()=>D(()=>({onintersect:({intersecting:Ae,el:Ie})=>{Ie.classList.toggle("intersecting",Ae)},count:p(E),options:{threshold:p(C),rootMargin:p(W)}}))),P(()=>T(Te,`item ${Pe??""}`)),v(Z,S)}),n(X),v(f,X)});var Me=e($e,2);Me.__click=()=>ee(ae),O(_,()=>p(E),f=>B(E,f)),O(t,()=>p(E),f=>B(E,f)),O(o,()=>p(C),f=>B(C,f)),O(x,()=>p(C),f=>B(C,f)),Oe(b,()=>p(W),f=>B(W,f)),v(g,s)},$$slots:{default:!0}});var xe=e(fe,2),we=e(d(xe));ye(we,{module_path:"intersect.svelte.ts"}),R(),n(xe),v(re,le)},$$slots:{default:!0}}),Re()}He(["click"]);export{bt as _,te as k};
