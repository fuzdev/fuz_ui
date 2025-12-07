import"../chunks/DsnmJJEf.js";import{p as F,c as G,f as d,s as r,a as f,d as C,b as a,ag as e,r as P,aa as J,i as T,u as x}from"../chunks/DuI-xSAA.js";import{r as j,a as y}from"../chunks/dSz7a-9Z.js";import{C as _}from"../chunks/Be4uwsUc.js";import{g as K}from"../chunks/CurcFKJC.js";import{C as $}from"../chunks/Dj6A8FjS.js";import{T as Q}from"../chunks/DdALwvgf.js";import{T as g,a as m}from"../chunks/CDpV4nCL.js";var U=d("just<br/> a card",1),V=d("custom<br/> icon",1),X=d("<!> <!> <!>",1),Z=d("a<br/> link",1),rr=d("<!> <!> <!>",1),tr=d("href is<br/> selected",1),er=d("<!> <!> <!>",1),or=d("custom<br/> tag",1),ar=d("<!> <!> <!>",1),nr=d("align<br/> icon right",1),sr=d("<!> <!> <!>",1),dr=d("align<br/> icon above",1),ir=d("align<br/> icon below",1),lr=d("<section><aside>⚠️ This API is unfinished and will likely change.</aside></section> <section><!> <!> <!></section> <!> <!> <!> <!> <!> <section><!> <!></section> <section><!> <!></section>",1);function br(z,B){F(B,!0);const N=K("Card");Q(z,{get tome(){return N},children:(Y,_r)=>{var A=lr(),p=r(f(A),2),k=C(p);_(k,{content:"import Card from '@fuzdev/fuz_ui/Card.svelte';",lang:"ts"});var w=r(k,2);_(w,{content:`<Card>
  just<br />
  a card
</Card>`});var D=r(w,2);$(D,{children:(o,u)=>{e();var t=U();e(2),a(o,t)},$$slots:{default:!0}}),P(p);var I=r(p,2);g(I,{children:(o,u)=>{var t=X(),n=f(t);m(n,{text:"With a custom icon"});var s=r(n,2);_(s,{content:`<Card>
  custom<br />
  icon
  {#snippet icon()}📖{/snippet}
</Card>`});var l=r(s,2);$(l,{icon:v=>{e();var c=J("📖");a(v,c)},children:(v,c)=>{e();var b=V();e(2),a(v,b)},$$slots:{icon:!0,default:!0}}),a(o,t)},$$slots:{default:!0}});var M=r(I,2);g(M,{children:(o,u)=>{var t=rr(),n=f(t);m(n,{text:"As a link"});var s=r(n,2);{let i=x(()=>`<Card href="${j("/")}">
  a<br />
  link
</Card>`);_(s,{get content(){return T(i)}})}var l=r(s,2);{let i=x(()=>j("/"));$(l,{get href(){return T(i)},children:(v,c)=>{e();var b=Z();e(2),a(v,b)},$$slots:{default:!0}})}a(o,t)},$$slots:{default:!0}});var E=r(M,2);g(E,{children:(o,u)=>{var t=er(),n=f(t);m(n,{text:"As the selected link"});var s=r(n,2);{let i=x(()=>`<Card href="${y}/Card">
  href is<br />
  selected
</Card>`);_(s,{get content(){return T(i)}})}var l=r(s,2);$(l,{get href(){return`${y??""}/Card`},children:(i,v)=>{e();var c=tr();e(2),a(i,c)},$$slots:{default:!0}}),a(o,t)},$$slots:{default:!0}});var R=r(E,2);g(R,{children:(o,u)=>{var t=ar(),n=f(t);m(n,{text:"With a custom HTML tag"});var s=r(n,2);_(s,{content:`<Card tag="button">
  custom<br />
  tag
</Card>`});var l=r(s,2);$(l,{tag:"button",children:(i,v)=>{e();var c=or();e(2),a(i,c)},$$slots:{default:!0}}),a(o,t)},$$slots:{default:!0}});var H=r(R,2);g(H,{children:(o,u)=>{var t=sr(),n=f(t);m(n,{text:"With custom alignment"});var s=r(n,2);_(s,{content:`<Card align="right">
  align<br />
  icon right
</Card>`});var l=r(s,2);$(l,{align:"right",children:(i,v)=>{e();var c=nr();e(2),a(i,c)},$$slots:{default:!0}}),a(o,t)},$$slots:{default:!0}});var h=r(H,2),L=C(h);_(L,{content:`<Card align="above">
  align<br />
  icon above
</Card>`});var O=r(L,2);$(O,{align:"above",children:(o,u)=>{e();var t=dr();e(2),a(o,t)},$$slots:{default:!0}}),P(h);var S=r(h,2),W=C(S);_(W,{content:`<Card align="below">
  align<br />
  icon below
</Card>`});var q=r(W,2);$(q,{align:"below",children:(o,u)=>{e();var t=ir();e(2),a(o,t)},$$slots:{default:!0}}),P(S),a(Y,A)},$$slots:{default:!0}}),G()}export{br as component};
