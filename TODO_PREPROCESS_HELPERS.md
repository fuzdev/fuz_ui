# Preprocess Helpers: Identifier Reference Detection

Improve `has_identifier_in_tree` in `src/lib/svelte_preprocess_helpers.ts` to correctly distinguish binding references from non-reference Identifier nodes in ESTree ASTs.

## Problem

The current implementation does a naive recursive walk — any `{type: 'Identifier', name: target}` node is treated as a reference. This produces false positives for Identifier nodes that are syntactically present but don't reference a binding:

```javascript
obj.Mdz          // Mdz is a property name, not a reference to imported Mdz
{ Mdz: value }   // Mdz is an object key, not a reference
label: for(...)   // label is a statement label, not a reference
```

**Current behavior**: Conservative — false positives keep imports that could be removed. Safe but imprecise.

**Impact**: Near zero in practice. Nobody writes `obj.Mdz` in a file that imports the `Mdz` component. The bundler tree-shakes unused imports anyway. But if `has_identifier_in_tree` is promoted to a general-purpose utility for other preprocessors, correctness matters.

## ESTree Non-Reference Identifier Positions

These node types contain Identifier nodes that are NOT binding references:

### MemberExpression (non-computed)

```javascript
obj.Mdz    // property is Identifier("Mdz") but NOT a reference
obj[Mdz]   // property is Identifier("Mdz") and IS a reference (computed)
```

AST:

```json
{
  "type": "MemberExpression",
  "object": { "type": "Identifier", "name": "obj" },
  "property": { "type": "Identifier", "name": "Mdz" },
  "computed": false
}
```

**Rule**: Skip `property` field when `computed: false`.

### Property / PropertyDefinition (non-computed)

```javascript
{ Mdz: value }     // key is Identifier("Mdz") but NOT a reference
{ [Mdz]: value }   // key IS a reference (computed)
{ Mdz }            // shorthand: key is NOT a ref, but value IS a ref
```

AST for non-shorthand:

```json
{
  "type": "Property",
  "key": { "type": "Identifier", "name": "Mdz" },
  "value": { "type": "Identifier", "name": "someValue" },
  "shorthand": false,
  "computed": false
}
```

AST for shorthand `{ Mdz }`:

```json
{
  "type": "Property",
  "key": { "type": "Identifier", "name": "Mdz" },
  "value": { "type": "Identifier", "name": "Mdz" },
  "shorthand": true,
  "computed": false
}
```

**Rule**: Skip `key` field when `computed: false`. Shorthand still detected via `value`.

Same rule applies to `PropertyDefinition` (class fields) and `MethodDefinition` (class methods).

### Labels

```javascript
Mdz: for (...) {}   // label, not a reference
break Mdz;          // label reference, not a binding reference
continue Mdz;       // label reference, not a binding reference
```

**Rule**: Skip `label` field on `LabeledStatement`, `BreakStatement`, `ContinueStatement`.

### ObjectPattern (destructuring) — key vs value

```javascript
const { Mdz: renamed } = obj;  // key is NOT a ref, value is a new binding
const { Mdz } = obj;           // shorthand: value IS a ref to Mdz
```

Same Property rules apply — ObjectPattern contains Property nodes with the same `key`/`value`/`computed`/`shorthand` structure.

## Positions That ARE References

These all correctly match as references with the current implementation:

```javascript
const X = Mdz;           // VariableDeclarator.init
fn(Mdz);                 // CallExpression.arguments
Mdz.something;           // MemberExpression.object (the object, not property)
x = Mdz;                 // AssignmentExpression.right
export { Mdz };          // ExportSpecifier.local
$derived(Mdz);           // CallExpression.arguments
{ Mdz }                  // Property.value (shorthand)
const arr = [Mdz];       // ArrayExpression.elements
obj[Mdz]                 // MemberExpression.property (computed: true)
{ [Mdz]: value }         // Property.key (computed: true)
```

And in Svelte template ASTs:

```svelte
{Mdz}                    <!-- ExpressionTag.expression -->
<Foo comp={Mdz} />       <!-- Attribute expression -->
{#if Mdz}                <!-- IfBlock.test -->
{@const x = Mdz}         <!-- ConstTag -->
```

Note: `<Mdz>` in Svelte templates does NOT produce an Identifier — `Component.name` is a plain string. No false positive here.

## Proposed Implementation

```typescript
export const has_identifier_in_tree = (
	node: unknown,
	name: string,
	skip?: Set<unknown>,
): boolean => {
	if (node === null || node === undefined || typeof node !== 'object') return false;
	if (skip?.has(node)) return false;
	if (Array.isArray(node)) {
		return node.some((child) => has_identifier_in_tree(child, name, skip));
	}
	const record = node as Record<string, unknown>;
	if (record.type === 'Identifier' && record.name === name) return true;

	// Determine which child fields contain non-reference Identifiers
	const skip_fields: Set<string> | undefined = NON_REFERENCE_FIELDS.get(
		record.type as string,
		record.computed as boolean,
	);

	for (const key of Object.keys(record)) {
		if (skip_fields?.has(key)) continue;
		if (has_identifier_in_tree(record[key], name, skip)) return true;
	}
	return false;
};
```

Where `NON_REFERENCE_FIELDS` encodes the rules:

```typescript
// Skip these child fields — they contain Identifiers that aren't binding references.
// Only applies when the node's `computed` property is false (or absent).
const NON_REFERENCE_FIELDS: Array<{
	type: string;
	field: string;
	when_not_computed?: boolean;
}> = [
	{type: 'MemberExpression', field: 'property', when_not_computed: true},
	{type: 'Property', field: 'key', when_not_computed: true},
	{type: 'PropertyDefinition', field: 'key', when_not_computed: true},
	{type: 'MethodDefinition', field: 'key', when_not_computed: true},
	{type: 'LabeledStatement', field: 'label'},
	{type: 'BreakStatement', field: 'label'},
	{type: 'ContinueStatement', field: 'label'},
];
```

Exact data structure TBD — could be a `Map<string, ...>` lookup for performance, or a simple array scan (these trees are small).

## Tests to Add

In `src/test/svelte_preprocess_helpers.test.ts`, new tests for the refined behavior:

### Non-reference positions (should return false)

| Test | AST Pattern | Why |
|------|-------------|-----|
| `obj.Mdz` — non-computed member | `MemberExpression { property: Identifier, computed: false }` | Property name, not ref |
| `{ Mdz: 123 }` — object key | `Property { key: Identifier, computed: false }` | Object key, not ref |
| `const { Mdz: x } = obj` — destructuring key | `Property in ObjectPattern { key: Identifier, computed: false }` | Destructuring source key |
| `class C { Mdz() {} }` — method name | `MethodDefinition { key: Identifier, computed: false }` | Method name, not ref |
| `Mdz: for(;;){}` — label | `LabeledStatement { label: Identifier }` | Statement label |

### Reference positions (should return true)

| Test | AST Pattern | Why |
|------|-------------|-----|
| `obj[Mdz]` — computed member | `MemberExpression { property: Identifier, computed: true }` | Dynamic lookup |
| `{ [Mdz]: 123 }` — computed key | `Property { key: Identifier, computed: true }` | Dynamic key |
| `{ Mdz }` — shorthand property | `Property { value: Identifier, shorthand: true }` | Shorthand IS a ref |
| `Mdz.foo` — member object | `MemberExpression { object: Identifier }` | Object IS a ref |

### Behavioral tests (in svelte_preprocess_mdz.imports.test.ts)

| Test | Input | Expected |
|------|-------|----------|
| `obj.Mdz` in script, all transformed | `const x = obj.Mdz;` | Mdz import REMOVED (not a real reference) |

This last one is the key behavioral change — currently the import would be kept.

## Scope

- **File**: `src/lib/svelte_preprocess_helpers.ts` — `has_identifier_in_tree` function
- **Tests**: `src/test/svelte_preprocess_helpers.test.ts` — ~9 new unit tests
- **Behavioral**: `src/test/svelte_preprocess_mdz.imports.test.ts` — 1 new test
- **Risk**: Low. Change only makes import removal more aggressive (removing imports that were previously kept). All existing "keep" cases (script references, template expressions) still work because those ARE real references.
- **Complexity**: ~10 lines of implementation + ~40 lines of tests

## When to Do This

Not urgent. Current conservative behavior is safe — false positives keep imports, bundler tree-shakes them. Worth doing if:

1. `has_identifier_in_tree` is used by other preprocessors (generalization)
2. Import removal precision becomes important (e.g., for cleaner output in docs/examples)
3. Someone reports the false positive as a real issue
