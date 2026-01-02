import"../chunks/DsnmJJEf.js";import{p as L,c as B,f as D,a as N,s as t,d as s,i as P,b as T,j as e,ak as c,al as m,n as _,r as o,u as Y,ai as j}from"../chunks/Byu9g8sx.js";import{b as $}from"../chunks/DRYbethR.js";import{C as y}from"../chunks/5p1xnsGN.js";import{g as O}from"../chunks/BCqvLWAP.js";import{T as U}from"../chunks/DtsT7KJR.js";import{T as F}from"../chunks/DtuZrZ8y.js";import{T as G}from"../chunks/CXMp6MqH.js";var H=D(`<section><p>Relocates elements in the DOM, in the rare cases that's useful and the best solution. The <!> uses this to mount dialogs from any component without inheriting styles.</p> <aside><p>Use only when necessary or fun.</p></aside></section> <section><div class="mb_lg"><!></div> <!></section> <section><!> <div class="teleports svelte-1plz9q4"><div class="panel svelte-1plz9q4"></div> <div class="panel svelte-1plz9q4"></div></div> <button type="button">teleport the bunny</button></section>`,1);function ot(w,k){L(k,!0);const z=O("Teleport");let r=m(!0),n=m(void 0),i=m(void 0);F(w,{get tome(){return z},children:(M,K)=>{var u=H(),l=N(u),f=s(l),R=t(s(f));G(R,{name:"Dialog"}),_(),o(f),_(2),o(l);var p=t(l,2),d=s(p),x=s(d);y(x,{content:"import Teleport from '@fuzdev/fuz_ui/Teleport.svelte';",lang:"ts"}),o(d);var A=t(d,2);y(A,{content:`<Teleport to={swap ? teleport_1 : teleport_2}>
	🐰
</Teleport>
<div class="teleports">
	<div class="panel" bind:this={teleport_1} />
	<div class="panel" bind:this={teleport_2} />
</div>
<button onclick={() => (swap = !swap)}>
	teleport the bunny
</button>`}),o(p);var h=t(p,2),b=s(h);{let a=Y(()=>e(r)?e(n):e(i));U(b,{get to(){return e(a)},children:(q,Q)=>{_();var C=P("🐰");T(q,C)},$$slots:{default:!0}})}var v=t(b,2),g=s(v);$(g,a=>c(n,a),()=>e(n));var E=t(g,2);$(E,a=>c(i,a),()=>e(i)),o(v);var I=t(v,2);I.__click=()=>c(r,!e(r)),o(h),T(M,u)},$$slots:{default:!0}}),B()}j(["click"]);export{ot as component};
