import"./DsnmJJEf.js";import{o as Ne,q as ze,A as Be,B as Ce,p as De,c as Ee,f as u,a as $,s as e,i as Re,b as v,d,n as E,r as n,j as p,u as Se,al as M,br as ee,ak as R,ai as je,t as P,e as T}from"./Byu9g8sx.js";import{e as A}from"./ChxZJoR6.js";import{r as j,s as h,i as He,h as I}from"./Cwqf9JOl.js";import{b as H}from"./DJxdh_PW.js";import{C as y}from"./BGF--fB7.js";import{g as Oe}from"./Cp_vldOh.js";import{i as N}from"./hqYhZDMw.js";import{T as Ye}from"./CP0hT45n.js";import{T as z,a as B}from"./JiFuVtBw.js";import{M as qe}from"./P3yIttsK.js";import{M as ye}from"./BfZepXzH.js";import{D as Fe}from"./BmS-i8jp.js";function te(O,Y,ne){ze&&Be();var q=new Ce(O);Ne(()=>{var F=Y();q.ensure(F,ne)})}var Ue=u('<li class="svelte-149pnxa"> </li>'),We=u(`<!> <p>Triggers when the element enters the viewport by at least a pixel. Scroll to see items change
			state.</p> <!> <ul class="demo_list svelte-149pnxa"></ul>`,1),Ge=u('<li class="svelte-149pnxa"> </li>'),Je=u('<!> <p>Triggers when 50% of the element is visible.</p> <!> <ul class="demo_list svelte-149pnxa"></ul>',1),Ke=u('<li class="svelte-149pnxa"> </li>'),Qe=u('<!> <p>Triggers only when the element is fully visible.</p> <!> <ul class="demo_list svelte-149pnxa"></ul>',1),Ve=u('<li class="svelte-149pnxa"> </li>'),Xe=u('<ul class="demo_list svelte-149pnxa"></ul>'),Ze=u(`<!> <p>Disconnects after the first intersection cycle (enter and leave). A <code>count</code> of <code>0</code> disables observation. Negative or <code>undefined</code> never disconnects. (the
			default)</p> <!> <!> <button type="button">reset</button>`,1),et=u('<li class="svelte-149pnxa"> </li>'),tt=u('<ul class="demo_list svelte-149pnxa"></ul>'),nt=u('<!> <p>Disconnects after two intersection cycles.</p> <!> <!> <button type="button">reset</button>',1),ot=u('<li class="svelte-149pnxa"> </li>'),st=u('<ul class="demo_list svelte-149pnxa"></ul>'),rt=u(`<!> <p>Try different parameter combinations. Positive <code>count</code> values disconnect after N
			cycles. <code>0</code> disables observation. Negative or <code>undefined</code> never disconnects. (the
			default)</p> <div class="controls svelte-149pnxa"><label class="svelte-149pnxa"><code>count</code> <div class="control_inputs svelte-149pnxa"><input type="number" class="svelte-149pnxa"/> <input type="range" class="svelte-149pnxa"/></div></label> <label class="svelte-149pnxa"><code>options.threshold</code> <div class="control_inputs svelte-149pnxa"><input type="number" class="svelte-149pnxa"/> <input type="range" class="svelte-149pnxa"/></div></label> <label class="svelte-149pnxa"><code>options.rootMargin</code> <select><option>0px</option><option>50px</option><option>100px</option><option>-25px</option><option>-50px</option></select></label></div> <!> <button type="button">reset</button>`,1),at=u(`<section><p>The <!> helper in <!> creates an attachment that observes when an element enters or leaves the viewport using the <!>.</p> <p>Uses the lazy function pattern to optimize reactivity: callbacks can update without recreating
			the observer, preserving state.</p></section> <section><!> <!> <p>The callback receives <code>intersecting</code> (boolean), <code>intersections</code> (number
			count), <code>el</code>, <code>observer</code>, and <code>disconnect</code>.</p></section> <!> <!> <!> <!> <!> <!> <p>Full API docs at <!>.</p>`,1);function bt(O,Y){De(Y,!0);const q=Oe("intersect"),F=()=>typeof window>"u"?15:Math.max(10,Math.floor(window.innerHeight/60)),k=Se(()=>Array.from({length:F()},(ae,ie)=>ie));let C=M(0),D=M(3),U=M("0px"),oe=M(0),se=M(0),re=M(0);Ye(O,{get tome(){return q},children:(ae,ie)=>{var le=at(),W=$(le),ce=d(W),ve=e(d(ce));Fe(ve,{name:"intersect"});var de=e(ve,2);ye(de,{module_path:"intersect.svelte.ts"});var ke=e(de,2);qe(ke,{path:"Web/API/Intersection_Observer_API",children:(g,L)=>{E();var s=Re("Intersection Observer API");v(g,s)},$$slots:{default:!0}}),E(),n(ce),E(2),n(W);var G=e(W,2),pe=d(G);y(pe,{lang:"ts",content:"import {intersect} from '@fuzdev/fuz_ui/intersect.svelte.js';"});var Le=e(pe,2);y(Le,{content:`<div {@attach intersect(() => ({intersecting}) => {
  console.log(intersecting ? 'entered' : 'left');
})}>
  scroll me into view
</div>`}),E(2),n(G);var _e=e(G,2);z(_e,{children:(g,L)=>{var s=We(),l=$(s);B(l,{text:"threshold: 0 (default)"});var r=e(l,4);y(r,{content:`<div {@attach intersect(() => ({
  onintersect: ({intersecting, el}) => {
    el.classList.toggle('intersecting', intersecting);
  }
}))}>
  content
</div>`});var a=e(r,2);A(a,20,()=>p(k),i=>i,(i,_)=>{var t=Ue(),c=d(t);n(t),I(t,()=>N(()=>({onintersect:({intersecting:m,el:o})=>{o.classList.toggle("intersecting",m)}}))),P(()=>T(c,`item ${_??""}`)),v(i,t)}),n(a),v(g,s)},$$slots:{default:!0}});var ue=e(_e,2);z(ue,{children:(g,L)=>{var s=Je(),l=$(s);B(l,{text:"threshold: 0.5"});var r=e(l,4);y(r,{content:`<div {@attach intersect(() => ({
  onintersect: ({intersecting, el}) => {
    el.classList.toggle('intersecting', intersecting);
  },
  options: {threshold: 0.5}
}))}>
  content
</div>`});var a=e(r,2);A(a,20,()=>p(k),i=>i,(i,_)=>{var t=Ge(),c=d(t);n(t),I(t,()=>N(()=>({onintersect:({intersecting:m,el:o})=>{o.classList.toggle("intersecting",m)},options:{threshold:.5}}))),P(()=>T(c,`item ${_??""}`)),v(i,t)}),n(a),v(g,s)},$$slots:{default:!0}});var ge=e(ue,2);z(ge,{children:(g,L)=>{var s=Qe(),l=$(s);B(l,{text:"threshold: 1"});var r=e(l,4);y(r,{content:`<div {@attach intersect(() => ({
  onintersect: ({intersecting, el}) => {
    el.classList.toggle('intersecting', intersecting);
  },
  options: {threshold: 1}
}))}>
  content
</div>`});var a=e(r,2);A(a,20,()=>p(k),i=>i,(i,_)=>{var t=Ke(),c=d(t);n(t),I(t,()=>N(()=>({onintersect:({intersecting:m,el:o})=>{o.classList.toggle("intersecting",m)},options:{threshold:1}}))),P(()=>T(c,`item ${_??""}`)),v(i,t)}),n(a),v(g,s)},$$slots:{default:!0}});var me=e(ge,2);z(me,{children:(g,L)=>{var s=Ze(),l=$(s);B(l,{text:"count: 1"});var r=e(l,4);y(r,{content:`<div {@attach intersect(() => ({
  onintersect: ({intersecting, el}) => {
    el.classList.toggle('intersecting', intersecting);
  },
  count: 1
}))}>
  content
</div>`});var a=e(r,2);te(a,()=>p(oe),_=>{var t=Xe();A(t,20,()=>p(k),c=>c,(c,m)=>{var o=Ve(),x=d(o);n(o),I(o,()=>N(()=>({onintersect:({intersecting:w,el:b})=>{b.classList.toggle("intersecting",w)},count:1}))),P(()=>T(x,`item ${m??""}`)),v(c,o)}),n(t),v(_,t)});var i=e(a,2);i.__click=()=>ee(oe),v(g,s)},$$slots:{default:!0}});var he=e(me,2);z(he,{children:(g,L)=>{var s=nt(),l=$(s);B(l,{text:"count: 2"});var r=e(l,4);y(r,{content:`<div {@attach intersect(() => ({
  onintersect: ({intersecting, el}) => {
    el.classList.toggle('intersecting', intersecting);
  },
  count: 2
}))}>
  content
</div>`});var a=e(r,2);te(a,()=>p(se),_=>{var t=tt();A(t,20,()=>p(k),c=>c,(c,m)=>{var o=et(),x=d(o);n(o),I(o,()=>N(()=>({onintersect:({intersecting:w,el:b})=>{b.classList.toggle("intersecting",w)},count:2}))),P(()=>T(x,`item ${m??""}`)),v(c,o)}),n(t),v(_,t)});var i=e(a,2);i.__click=()=>ee(se),v(g,s)},$$slots:{default:!0}});var fe=e(he,2);z(fe,{children:(g,L)=>{var s=rt(),l=$(s);B(l,{text:"Configurable"});var r=e(l,4),a=d(r),i=e(d(a),2),_=d(i);j(_),h(_,"min",-1),h(_,"max",3),h(_,"step",1);var t=e(_,2);j(t),h(t,"min",-1),h(t,"max",3),h(t,"step",1),n(i),n(a);var c=e(a,2),m=e(d(c),2),o=d(m);j(o),h(o,"step",.1),h(o,"min",0),h(o,"max",1);var x=e(o,2);j(x),h(x,"step",.1),h(x,"min",0),h(x,"max",1),n(m),n(c);var w=e(c,2),b=e(d(w),2),J=d(b);J.value=J.__value="0px";var K=e(J);K.value=K.__value="50px";var Q=e(K);Q.value=Q.__value="100px";var V=e(Q);V.value=V.__value="-25px";var be=e(V);be.value=be.__value="-50px",n(b),n(w),n(r);var $e=e(r,2);te($e,()=>p(re),f=>{var X=st();A(X,20,()=>p(k),Z=>Z,(Z,Pe)=>{var S=ot(),Te=d(S);n(S),I(S,()=>N(()=>({onintersect:({intersecting:Ae,el:Ie})=>{Ie.classList.toggle("intersecting",Ae)},count:p(D),options:{threshold:p(C),rootMargin:p(U)}}))),P(()=>T(Te,`item ${Pe??""}`)),v(Z,S)}),n(X),v(f,X)});var Me=e($e,2);Me.__click=()=>ee(re),H(_,()=>p(D),f=>R(D,f)),H(t,()=>p(D),f=>R(D,f)),H(o,()=>p(C),f=>R(C,f)),H(x,()=>p(C),f=>R(C,f)),He(b,()=>p(U),f=>R(U,f)),v(g,s)},$$slots:{default:!0}});var xe=e(fe,2),we=e(d(xe));ye(we,{module_path:"intersect.svelte.ts"}),E(),n(xe),v(ae,le)},$$slots:{default:!0}}),Ee()}je(["click"]);export{bt as _,te as k};
