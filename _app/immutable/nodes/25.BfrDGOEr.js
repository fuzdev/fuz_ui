import"../chunks/DsnmJJEf.js";import{p as C,c as L,f as B,a as D,s as t,d as s,i as N,b as g,j as e,ak as c,al as v,n as m,r as a,u as P,ai as Y}from"../chunks/Byu9g8sx.js";import{b as $}from"../chunks/DRYbethR.js";import{C as y}from"../chunks/BGF--fB7.js";import{g as j}from"../chunks/Cp_vldOh.js";import{T as O}from"../chunks/DC0KDX1V.js";import{T as U}from"../chunks/CP0hT45n.js";import{T as F}from"../chunks/ByVtHSAc.js";var G=B(`<section><p>Relocates elements in the DOM, in the rare cases that's useful and the best solution. The <!> uses this to mount dialogs from any component without inheriting styles.</p> <aside><p>Use only when necessary or fun.</p></aside></section> <section><!> <!></section> <section><!> <div class="teleports svelte-1plz9q4"><div class="panel svelte-1plz9q4"></div> <div class="panel svelte-1plz9q4"></div></div> <button type="button">teleport the bunny</button></section>`,1);function ot(w,k){C(k,!0);const z=j("Teleport");let r=v(!0),n=v(void 0),i=v(void 0);U(w,{get tome(){return z},children:(M,J)=>{var u=G(),l=D(u),_=s(l),R=t(s(_));F(R,{name:"Dialog"}),m(),a(_),m(2),a(l);var p=t(l,2),f=s(p);y(f,{lang:"ts",content:"import Teleport from '@fuzdev/fuz_ui/Teleport.svelte';"});var x=t(f,2);y(x,{content:`<Teleport to={swap ? teleport_1 : teleport_2}>
	🐰
</Teleport>
<div class="teleports">
	<div class="panel" bind:this={teleport_1} />
	<div class="panel" bind:this={teleport_2} />
</div>
<button onclick={() => (swap = !swap)}>
	teleport the bunny
</button>`}),a(p);var h=t(p,2),b=s(h);{let o=P(()=>e(r)?e(n):e(i));O(b,{get to(){return e(o)},children:(I,K)=>{m();var q=N("🐰");g(I,q)},$$slots:{default:!0}})}var d=t(b,2),T=s(d);$(T,o=>c(n,o),()=>e(n));var A=t(T,2);$(A,o=>c(i,o),()=>e(i)),a(d);var E=t(d,2);E.__click=()=>c(r,!e(r)),a(h),g(M,u)},$$slots:{default:!0}}),L()}Y(["click"]);export{ot as component};
