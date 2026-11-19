---
'@fuzdev/fuz_ui': patch
---

fix: a dotted chain in type text whose head links nowhere (a namespace import: `typeof specs.a_spec` links `a_spec`) links its last name, and a class constructor's overloads render without the instance-type return its header omits
