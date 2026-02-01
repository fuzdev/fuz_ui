import"../chunks/DsnmJJEf.js";import{f as i,b as a,d as r,r as s}from"../chunks/D3znixZ8.js";import{M as o}from"../chunks/BA20bzA1.js";const l=`# mdz Specification

⚠️ AI-generated and unverified

This document provides a comprehensive guide to mdz syntax, features, and usage patterns.

For a high-level introduction, see \`mdz.mdz\`. For formal grammar rules, see \`mdz_grammar.mdz\`.

---

## Design Philosophy

mdz prioritizes _predictability_ over _flexibility_. It follows these principles:

**False negatives over false positives** - strict syntax prevents accidentally interpreting plain text as formatting.

**One way to do things** - single unambiguous syntax per feature, no alternatives.

**Explicit over implicit** - clear delimiters and column-0 requirements avoid ambiguity.

**Simple over complete** - prefer simple parsing rules over complex edge case handling.

**Whitespace preservation** - render all whitespace exactly as authored.

---

## Inline Formatting

### Bold

Use double asterisks \`**text**\` for bold text.

\`\`\`
**Bold text** in a sentence.
\`\`\`

Renders as: **Bold text** in a sentence.

### Italic

Use single underscores \`_text_\` for italic text.

\`\`\`
_Italic text_ in a sentence.
\`\`\`

Renders as: _Italic text_ in a sentence.

**Note:** Unlike CommonMark, single asterisks \`*text*\` do NOT create italics in mdz. This creates clear visual distinction between bold and italic syntax.

### Strikethrough

Use tildes \`~text~\` for strikethrough.

\`\`\`
~Strikethrough text~ in a sentence.
\`\`\`

Renders as: ~Strikethrough text~ in a sentence.

### Inline Code

Use backticks \`\` \`code\` \`\` for inline code.

\`\`\`
Use \`mdz_parse\` to parse mdz content.
\`\`\`

Renders as \`<code>\` elements.

**Restrictions:**
- Cannot contain newlines (newline before closing backtick makes both backticks literal)
- Empty code \` \`\` \` renders as literal backticks

### Nesting

All inline formatting can nest:

\`\`\`
**Bold with _italic_ inside**
_Italic with **bold** and ~strikethrough~_
**~_All three combined_~**
\`\`\`

### Intraword Emphasis

mdz has different word boundary rules for different delimiters to balance flexibility with preventing false positives in code.

**Bold works everywhere** - including in the middle of words:

\`\`\`
foo**bar**baz → foo<strong>bar</strong>baz (creates bold)
snake**_case_** → snake<strong><em>case</em></strong> (bold containing italic)
word **bold** word → word <strong>bold</strong> word (also works at boundaries)
\`\`\`

**Underscores cannot create emphasis in the middle of words:**

\`\`\`
foo_bar_baz → literal text (no emphasis)
snake_case_identifier → literal text
CONSTANT_CASE_NAME → literal text
word _emphasis_ word → word <em>emphasis</em> word
\`\`\`

This is intentional to support \`snake_case\` and \`CONSTANT_CASE\` identifiers common in programming.

**Strikethrough also requires word boundaries:**

\`\`\`
foo~bar~baz → literal text (no strikethrough)
word ~strike~ word → word <s>strike</s> word
\`\`\`

**Formatting delimiters are transparent:**

When checking word boundaries for italic and strikethrough, formatting delimiters (\`*\`, \`_\`, \`~\`) are NOT considered word characters - they are invisible:

\`\`\`
**bold**_italic_ → <strong>bold</strong><em>italic</em> (both work)
_italic_~strike~ → <em>italic</em><s>strike</s> (both work)
\`\`\`

**Inline code works anywhere:**

\`\`\`
foo\`bar\`baz → foo<code>bar</code>baz
\`\`\`

**Word boundary definition**:
- **Bold**: No word boundary restrictions (works everywhere)
- **Italic and strikethrough**: At word boundary if not surrounded by \`a-z\`, \`A-Z\`, \`0-9\`
- Formatting delimiters (\`*\`, \`_\`, \`~\`) are NOT word characters for boundary checks

### Multiline Formatting

Bold, italic, and strikethrough can span single newlines (line breaks):

\`\`\`
**bold text
continues here**
\`\`\`

This creates a single bold element containing text with a line break. Inline code CANNOT span newlines - a newline before the closing backtick makes both backticks literal text.

Double newlines (paragraph breaks) interrupt all inline formatting:

---

## Links

mdz supports three types of links:

### Markdown Links

Standard markdown syntax with explicit display text:

\`\`\`
[Fuz documentation](https://fuz.dev/docs)
\`\`\`

The display text can include inline formatting:

\`\`\`
[**Bold link** with _italic_](https://fuz.dev)
\`\`\`

### Auto-Detected External URLs

URLs starting with \`https://\` or \`http://\` are automatically linked:

\`\`\`
Visit https://fuz.dev for more information.
\`\`\`

**Trailing punctuation handling:**

mdz automatically trims these characters from the end of URLs: \`.,;:!?]\`

\`\`\`
See https://fuz.dev.
Check out https://fuz.dev!
\`\`\`

The period and exclamation mark are NOT part of the URL.

**Balanced parentheses:**

URLs with balanced parentheses work correctly:

\`\`\`
https://en.wikipedia.org/wiki/Markdown_(markup_language)
\`\`\`

The closing \`)\` is included in the URL.

### Auto-Detected Internal Paths

Paths starting with \`/\` are automatically linked (root-relative paths):

\`\`\`
See /docs/api for the API documentation.
Visit /docs/mdz/grammar for the formal grammar.
\`\`\`

**Important:** Relative paths (\`./\`, \`../\`) are NOT supported. mdz content may be rendered at different URLs than its source location, making relative paths ambiguous. Root-relative paths have unambiguous meaning regardless of context.

---

## Paragraphs and Line Breaks

### Single Newline

A single newline is preserved in the text node content:

\`\`\`
First line.
Second line.
Third line.
\`\`\`

The newline character is preserved exactly as authored in text nodes. When rendered, the \`<Mdz>\` component applies CSS \`white-space: pre-wrap\` to display line breaks visually. No explicit \`<br>\` elements are created - whitespace preservation is purely CSS-based.

### Double Newline

A double newline creates a paragraph break:

\`\`\`
First paragraph.

Second paragraph.
\`\`\`

Renders as separate \`<p>\` elements.

### Multiple Newlines

Three or more newlines create paragraphs with preserved blank lines:

\`\`\`
First paragraph.


Second paragraph with extra spacing.
\`\`\`

**Key principle:** mdz preserves ALL whitespace exactly as authored, minimizing surprise for nontechnical users.

---

## Headings

Use 1-6 hashes followed by a space and content:

\`\`\`
# Level 1 Heading

## Level 2 Heading

### Level 3 Heading

#### Level 4 Heading

##### Level 5 Heading

###### Level 6 Heading
\`\`\`

**Requirements:**
- **Must start at column 0** (no leading whitespace) - any indentation makes it literal text
- Must have exactly 1-6 \`#\` characters
- Must have space after hashes
- Must have non-whitespace content after space
- Must be followed by blank line or EOF

The column-0 requirement is a key differentiator from CommonMark - mdz requires block elements to start at the line beginning for unambiguous parsing.

**Invalid patterns:**
- \`#No space\` - missing space
- \` # Indented\` - leading whitespace
- \`####### Seven\` - more than 6 hashes
- \`## \` - no content

**Headings can include inline formatting:**

\`\`\`
## **Bold** Heading with _Italic_
\`\`\`

---

## Horizontal Rules

Use exactly three hyphens \`---\` at column 0:

\`\`\`
Section one.

---

Section two.
\`\`\`

**Requirements:**
- Must be exactly 3 hyphens (not 2, not 4+)
- **Must start at column 0** (no leading whitespace) - indented \`---\` is treated as literal text
- Trailing whitespace allowed
- Must be followed by blank line or EOF

**Invalid patterns:**
- \`- - -\` - spaces between hyphens
- \` ---\` - leading whitespace
- \`----\` - four hyphens
- \`---text\` - content on same line

**Rationale:** Other markdown variants support \`***\`, \`___\`, or variable lengths. mdz requires exactly \`---\` for clarity and the "one way to do things" principle.

---

## Codeblocks

Use three or more backticks at column 0 with optional language hint:

\`\`\`\`
\`\`\`ts
const x: number = 42;
\`\`\`
\`\`\`\`

**Language hints:**

\`\`\`\`
\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`
\`\`\`\`

The language hint can contain any characters except newline.

**Nesting with different fence lengths:**

\`\`\`\`\`
\`\`\`\`
Use \`\`\` for codeblocks.
\`\`\`\`
\`\`\`\`\`

The inner \` \`\`\` \` does not close the outer \`\`\`\` fence.

**Requirements:**
- **Opening fence must start at column 0** (no leading whitespace) - indented fences are literal text
- Opening fence must have 3+ backticks
- Closing fence must match opening length
- Opening fence followed by newline
- Closing fence followed by blank line or EOF
- Cannot be empty (must have content)

Like all mdz block elements, the strict column-0 requirement distinguishes codeblocks from inline code and prevents ambiguity.

**Invalid patterns:**
- \` \`\`\` \` - leading whitespace
- Unclosed blocks
- Empty blocks (no content)
- Mismatched fence lengths

---

## HTML Elements

mdz supports opt-in HTML elements for semantic markup. Elements are distinguished by lowercase first letter.

\`\`\`
<aside>This is an aside element.</aside>
<code>inline code element</code>
\`\`\`

**Self-closing elements:**

\`\`\`
<br />
<hr />
\`\`\`

**Elements with inline formatting:**

\`\`\`
<aside>This has _italic_ and **bold** inside.</aside>
\`\`\`

**Registration required:**

Elements must be registered via context:

\`\`\`typescript
import {mdz_elements_context} from '@fuzdev/fuz_ui/mdz_components.js';

mdz_elements_context.set(new Map([
  ['aside', true],
  ['code', true],
  ['marquee', true],
]));
\`\`\`

Unregistered elements render as \`<element-name />\` placeholders for security.

**Tag name rules:**
- First character must be lowercase letter
- Can contain letters, numbers, hyphens, underscores
- Must have matching opening/closing tags

**Limitations:**
- Attributes are NOT currently supported
- Future consideration: \`<div class="container">\`

---

## Svelte Components

mdz supports Svelte components distinguished by uppercase first letter.

\`\`\`
<Alert>This is an alert component.</Alert>
<Card>Content in a card.</Card>
\`\`\`

**Components with inline formatting:**

\`\`\`
<Alert>This has _italic_ **bold** and \`code\`.</Alert>
\`\`\`

**Self-closing components:**

\`\`\`
<Divider />
\`\`\`

**Registration required:**

\`\`\`typescript
import {mdz_components_context} from '@fuzdev/fuz_ui/mdz_components.js';
import Alert from '@fuzdev/fuz_ui/Alert.svelte';
import Card from '@fuzdev/fuz_ui/Card.svelte';

mdz_components_context.set(new Map([
  ['Alert', Alert],
  ['Card', Card],
]));
\`\`\`

Unregistered components render as \`<ComponentName />\` placeholders.

**MDX convention:**

If a paragraph consists solely of a single component with no other content, it does not get wrapped in \`<p>\` tags. This matches MDX behavior.

**Limitations:**
- Props/attributes NOT currently supported
- Future consideration: \`<Alert status="error">\`

---

## Whitespace Handling

mdz preserves whitespace exactly as authored:

**Leading/trailing spaces:**

\`\`\`
 text with leading space
text with trailing space
\`\`\`

Both spaces are preserved in output.

**Multiple spaces:**

\`\`\`
text    with       many     spaces
\`\`\`

All spaces preserved.

**Tabs and mixed whitespace:**

\`\`\`
	tab-indented
 space then	tab
\`\`\`

Exact whitespace characters preserved.

**Column-0 requirement:**

Block elements (headings, hr, codeblocks) must start at column 0. Leading whitespace invalidates them and causes them to be treated as paragraph text.

---

## Intentional Differences from CommonMark/GFM

mdz deliberately diverges from CommonMark and GitHub Flavored Markdown to minimize surprise for nontechnical users:

| Feature | CommonMark/GFM | mdz |
|---------|----------------|-----|
| Bold | \`**text**\` or \`__text__\` | \`**text**\` only |
| Italic | \`*text*\` or \`_text_\` | \`_text_\` only |
| Single \`*\` | Creates italic | Literal text |
| Intraword underscore | \`foo_bar_baz\` = literal (GFM) | Same: literal (word boundaries required) |
| Intraword asterisk | \`foo*bar*baz\` = emphasis (allowed) | Same: \`foo**bar**baz\` = **bold** (allowed, no restrictions) |
| Strikethrough | Not in CommonMark, \`~~text~~\` in GFM | \`~text~\` with word boundaries |
| Horizontal rule | \`---\`, \`***\`, \`___\`, variable lengths | \`---\` exactly (3 hyphens) |
| Indented code | 4 spaces creates codeblock | NOT supported |
| Codeblock indent | Can be indented | Must be column 0 |
| Heading no space | \`#text\` valid | Invalid (space required) |
| Block spacing | Flexible | Requires blank lines |

**Rationale:**

Strict syntax with one canonical way per feature reduces cognitive load and makes mdz more predictable for nontechnical users.

---

## Use Cases

mdz is designed for documentation and content where predictability and simplicity matter:

**Technical documentation** - Whitespace preservation makes mdz ideal for code examples and technical content where spacing is meaningful. The strict syntax prevents accidental formatting.

**Component-based content** - Integration with Svelte components and HTML elements allows rich, interactive documentation while keeping the markup simple and readable.

**User-facing documentation** - Simple, unambiguous syntax makes mdz accessible for nontechnical writers. When syntax is strict, users can predict what will render.

**Embedded help text** - Lightweight formatting without markdown's complexity or edge cases. Good for tooltips, error messages, and UI strings that need basic formatting.

**Reference documentation** - Inline code formatting works well for documenting APIs, configuration options, and technical references.

---

## Future Features

Under consideration for future versions:

**Lists** (next priority) - bulleted (\`-\`, \`*\`) and numbered (\`1.\`, \`2.\`) with nesting support

**Blockquotes** - standard markdown \`>\` prefix with nesting

**Tag Attributes** - component props \`<Alert status="error">\` and element classes \`<div class="container">\`

**Images** - standard markdown \`![alt](url)\` with optional titles

**Tables** - appropriate syntax TBD, considering alignment options

**Definition Lists** - key-value format for API documentation

**Footnotes** - inline references with definitions for academic/technical writing

**Line Break Opt-Out** - possibly trailing \`\\\` to suppress \`<br>\` rendering

---

## Status and Stability

mdz is an **early proof of concept**:

**Current capabilities:**
- Well-defined syntax and parsing rules
- Core inline formatting (bold, italic, strikethrough, code)
- Links (markdown, auto-detected URLs and paths)
- Block elements (headings, horizontal rules, codeblocks)
- Component and element integration
- Whitespace preservation

**Known limitations:**
- No lists, blockquotes, or tables
- No attributes/props for components/elements
- Syntax may evolve based on real-world usage
- Breaking changes expected as the format matures
`;var d=i('<div class="mt_xl5"><!></div>');function h(e){var n=d(),t=r(n);o(t,{get content(){return l}}),s(n),a(e,n)}export{h as component};
