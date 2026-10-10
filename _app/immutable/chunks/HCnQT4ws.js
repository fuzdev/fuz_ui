const e=n=>n.length>1&&n.endsWith("/")?n.slice(0,-1):n,i=(n,s)=>{if(!URL.canParse(n,s))return!1;const t=new URL(n,s);return t.origin===s.origin&&e(t.pathname)===e(s.pathname)};export{i as h};
