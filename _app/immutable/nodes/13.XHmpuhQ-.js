import"../chunks/DsnmJJEf.js";import{p as F,c as G,f as d,s as r,a as f,d as C,b as a,n as e,r as P,i as J,j as T,u as x}from"../chunks/D3znixZ8.js";import{r as W,D as y}from"../chunks/CskBikzv.js";import{C as _}from"../chunks/BgNuPRBO.js";import{g as K}from"../chunks/CBp3YFvF.js";import{C as $}from"../chunks/BGkj7zIR.js";import{T as Q}from"../chunks/BpdRyNf9.js";import{T as m,a as g}from"../chunks/rhkmklQD.js";var U=d("just<br/> a card",1),V=d("custom<br/> icon",1),X=d("<!> <!> <!>",1),Z=d("a<br/> link",1),rr=d("<!> <!> <!>",1),tr=d("href is<br/> selected",1),er=d("<!> <!> <!>",1),or=d("custom<br/> tag",1),ar=d("<!> <!> <!>",1),nr=d("align<br/> icon right",1),sr=d("<!> <!> <!>",1),dr=d("align<br/> icon above",1),ir=d("align<br/> icon below",1),lr=d("<section><aside>⚠️ This API is unfinished and will likely change.</aside></section> <section><!> <!> <!></section> <!> <!> <!> <!> <!> <section><!> <!></section> <section><!> <!></section>",1);function br(z,B){F(B,!0);const D=K("Card");Q(z,{get tome(){return D},children:(N,_r)=>{var A=lr(),p=r(f(A),2),k=C(p);_(k,{lang:"ts",content:"import Card from '@fuzdev/fuz_ui/Card.svelte';"});var w=r(k,2);_(w,{content:`<Card>
  just<br />
  a card
</Card>`});var Y=r(w,2);$(Y,{children:(o,u)=>{e();var t=U();e(2),a(o,t)},$$slots:{default:!0}}),P(p);var I=r(p,2);m(I,{children:(o,u)=>{var t=X(),n=f(t);g(n,{text:"With a custom icon"});var s=r(n,2);_(s,{content:`<Card>
  custom<br />
  icon
  {#snippet icon()}📖{/snippet}
</Card>`});var l=r(s,2);$(l,{icon:v=>{e();var c=J("📖");a(v,c)},children:(v,c)=>{e();var b=V();e(2),a(v,b)},$$slots:{icon:!0,default:!0}}),a(o,t)},$$slots:{default:!0}});var M=r(I,2);m(M,{children:(o,u)=>{var t=rr(),n=f(t);g(n,{text:"As a link"});var s=r(n,2);{let i=x(()=>`<Card href="${W("/")}">
  a<br />
  link
</Card>`);_(s,{get content(){return T(i)}})}var l=r(s,2);{let i=x(()=>W("/"));$(l,{get href(){return T(i)},children:(v,c)=>{e();var b=Z();e(2),a(v,b)},$$slots:{default:!0}})}a(o,t)},$$slots:{default:!0}});var E=r(M,2);m(E,{children:(o,u)=>{var t=er(),n=f(t);g(n,{text:"As the selected link"});var s=r(n,2);{let i=x(()=>`<Card href="${y}/Card">
  href is<br />
  selected
</Card>`);_(s,{get content(){return T(i)}})}var l=r(s,2);$(l,{get href(){return`${y??""}/Card`},children:(i,v)=>{e();var c=tr();e(2),a(i,c)},$$slots:{default:!0}}),a(o,t)},$$slots:{default:!0}});var R=r(E,2);m(R,{children:(o,u)=>{var t=ar(),n=f(t);g(n,{text:"With a custom HTML tag"});var s=r(n,2);_(s,{content:`<Card tag="button">
  custom<br />
  tag
</Card>`});var l=r(s,2);$(l,{tag:"button",children:(i,v)=>{e();var c=or();e(2),a(i,c)},$$slots:{default:!0}}),a(o,t)},$$slots:{default:!0}});var j=r(R,2);m(j,{children:(o,u)=>{var t=sr(),n=f(t);g(n,{text:"With custom alignment"});var s=r(n,2);_(s,{content:`<Card align="right">
  align<br />
  icon right
</Card>`});var l=r(s,2);$(l,{align:"right",children:(i,v)=>{e();var c=nr();e(2),a(i,c)},$$slots:{default:!0}}),a(o,t)},$$slots:{default:!0}});var h=r(j,2),H=C(h);_(H,{content:`<Card align="above">
  align<br />
  icon above
</Card>`});var O=r(H,2);$(O,{align:"above",children:(o,u)=>{e();var t=dr();e(2),a(o,t)},$$slots:{default:!0}}),P(h);var L=r(h,2),S=C(L);_(S,{content:`<Card align="below">
  align<br />
  icon below
</Card>`});var q=r(S,2);$(q,{align:"below",children:(o,u)=>{e();var t=ir();e(2),a(o,t)},$$slots:{default:!0}}),P(L),a(N,A)},$$slots:{default:!0}}),G()}export{br as component};
