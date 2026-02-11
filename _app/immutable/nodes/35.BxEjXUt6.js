import"../chunks/DsnmJJEf.js";import{f as a,b as r,d as i,r as o}from"../chunks/D3znixZ8.js";import{M as s}from"../chunks/CV8SfpGc.js";const d=`# mdz Formal Grammar Specification

> ⚠️ AI-generated and unverified

This document defines the precise syntax and parsing rules for mdz (minimal markdown dialect) using Rust-inspired notation.

For a high-level introduction, see \`mdz.mdz\`. For practical examples and usage patterns, see \`mdz_spec.mdz\`.

## Grammar Notation

The following notations are used throughout this specification:

\`\`\`
Notation              Examples                      Meaning
--------              --------                      -------
CAPITAL               TEXT, NEWLINE, BACKTICK       A terminal token
_ItalicCamelCase_     _Paragraph_, _Heading_        A non-terminal production
\`literal\`             \`**\`, \`#\`, \`---\`              The exact character(s)
x?                    \`pub\`?                        An optional item
x*                    _InlineNode_*                 0 or more of x
x+                    _InlineNode_+                 1 or more of x
x{a..b}               BACKTICK{3..}                 a to b repetitions of x
Rule1 Rule2           \`#\` SPACE _Text_              Sequence of rules in order
|                     _Bold_ | _Italic_             Either one or another
[ ]                   [\`a\`-\`z\`]                     Any character in the set
~[ ]                  ~[\`\\n\`]                       Any character except those listed
( )                   (\`*\` _InlineNode_)?           Groups items
<column 0>            <must start at column 0>      Special constraint
<followed by>         <followed by blank line>      Lookahead constraint
\`\`\`

Sequences have higher precedence than \`|\` alternation.

---

## Character Classes

\`\`\`
NEWLINE           = \`\\n\`
SPACE             = \` \` | \`\\t\`
WHITESPACE        = SPACE | NEWLINE
NON_NEWLINE       = ~[\`\\n\`]
LETTER            = [\`a\`-\`z\`] | [\`A\`-\`Z\`]
DIGIT             = [\`0\`-\`9\`]
ALPHANUMERIC      = LETTER | DIGIT
\`\`\`

---

## Document Structure

\`\`\`
_Document_ = _Node_*

_Node_ = _Paragraph_
       | _Heading_
       | _HorizontalRule_
       | _Codeblock_

_Paragraph_ = <column 0> _InlineNode_+ (_ParagraphBreak_ | EOF)

_ParagraphBreak_ = NEWLINE NEWLINE+
\`\`\`

A document consists of zero or more block-level nodes. Paragraphs contain inline content and are separated by one or more blank lines.

---

## Inline Formatting

\`\`\`
_InlineNode_ = _Bold_
             | _Italic_
             | _Strikethrough_
             | _InlineCode_
             | _Link_
             | _Component_
             | _Element_
             | _Text_
             | NEWLINE

_Bold_ = \`**\` _InlineNode_+ \`**\`

_Italic_ = \`_\` _InlineNode_+ \`_\`

_Strikethrough_ = \`~\` _InlineNode_+ \`~\`

_InlineCode_ = BACKTICK _CodeContent_ BACKTICK
_CodeContent_ = ~[BACKTICK | NEWLINE]+
\`\`\`

**Nesting rules:**

All inline formatting can nest within each other. For example, \`**~_text_~**\` produces bold text containing strikethrough containing italic.

**Validation:**

Bold, italic, and strikethrough require at least one character between delimiters. Empty formatting renders as literal text:

- \`****\` → literal text "\\*\\*\\*\\*" (empty bold)
- \`__\` → literal text "\\_\\_" (empty italic)
- \`~~\` → literal text "~~" (empty strikethrough)

Inline code cannot contain newlines - if a newline appears before the closing backtick, both backticks render as literal text.
Empty inline code \` \`\` \` renders as literal backticks.

**Word boundary requirements:**

Different delimiters have different word boundary rules:

**Bold (\`**\`) has no word boundary restrictions\\*\\* - works everywhere including intraword:

- \`foo**bar**baz\` → foo**bar**baz (creates bold)
- \`snake**_case_**\` → snake***case*** (bold containing italic)
- \`word **bold** word\` → word **bold** word (also works with boundaries)

**Italic (\`_\`) and strikethrough (\`~\`) require word boundaries:**

Underscores and tildes cannot create formatting in the middle of words (prevents false positives with \`snake_case\` identifiers):

- \`foo_bar_baz\` → literal text (underscores intraword)
- \`foo~bar~baz\` → literal text (tildes intraword)
- \`word _emphasis_ word\` → word _emphasis_ word (at boundaries)
- \`word ~strike~ word\` → word ~strike~ word (at boundaries)

**Delimiter transparency:**

Formatting delimiters (\`*\`, \`_\`, \`~\`) are NOT considered word characters for boundary checks - they are transparent:

- \`**bold**_italic_\` → **bold**_italic_ (both work, delimiters don't interfere)
- \`_italic_~strike~\` → _italic_~strike~ (both work)

**Word character definition:**

For italic and strikethrough: \`a-z\`, \`A-Z\`, \`0-9\`

Notably, underscores (\`_\`), asterisks (\`*\`), and tildes (\`~\`) are NOT word characters - they are transparent for boundary detection.

**Inline code has no word boundary requirement** - backticks work anywhere:

- \`foo\\\`bar\\\`baz\` → foo<code>bar</code>baz

**Implementation note:**

The parser validates that opening delimiters have matching closing delimiters. For italic and strikethrough, it also checks word boundaries. If validation fails, the delimiter renders as literal text.

Delimiter matching uses greedy/bounded parsing: each opening delimiter finds its first matching closing delimiter, then parses children only within that range. This prevents nested formatters from consuming parent delimiters.

---

## Links

\`\`\`
_Link_ = _MarkdownLink_
       | _AutoUrl_
       | _AutoPath_

_MarkdownLink_ = \`[\` _LinkText_ \`]\` \`(\` _LinkUrl_ \`)\`
_LinkText_     = _InlineNode_+
_LinkUrl_      = _UrlChar_+
_UrlChar_      = ~[\`)\` | \`\\n\` | WHITESPACE]

_AutoUrl_ = (\`https://\` | \`http://\`) _UrlChar_+

_AutoPath_ = \`/\` _PathChar_+
_PathChar_ = ~[WHITESPACE | _TrailingPunctuation_]

_TrailingPunctuation_ = \`.\` | \`,\` | \`;\` | \`:\` | \`!\` | \`?\` | \`]\`
\`\`\`

**Markdown links:**

Display text can contain any inline formatting including nested links.
URL must contain valid RFC 3986 characters.
URLs cannot contain whitespace or newlines.
Closing \`)\` terminates the URL.

Link nodes have a \`link_type\` field:

- \`'external'\` - URL starts with \`https://\` or \`http://\`
- \`'internal'\` - URL starts with \`/\` (root-relative path)

**Auto-detected URLs:**

Must start with \`https://\` or \`http://\` (case-sensitive).
Continues until whitespace or certain trailing punctuation.
Trailing punctuation is trimmed: \`.,;:!?]\`
Balanced parentheses: \`https://fuz.dev/page_(disambiguation)\` keeps the closing \`)\`.

**Auto-detected paths:**

Must start with \`/\` (root-relative only).
Relative paths (\`./\`, \`../\`) are NOT supported.
Continues until whitespace or trailing punctuation.
Trailing punctuation handling same as auto-URLs.

**Rationale for path restrictions:**

mdz content may be rendered at different URLs than where the source file lives. Relative paths would be ambiguous. Root-relative paths (\`/docs/api\`) have unambiguous meaning regardless of where the mdz content is rendered.

---

## Headings

\`\`\`
_Heading_ = <column 0> _HeadingMarker_ SPACE _HeadingContent_ <followed by blank line or EOF>

_HeadingMarker_ = \`#\`{1..6}

_HeadingContent_ = _InlineNode_+
\`\`\`

**Requirements:**

Must start at column 0 (no leading whitespace).
Must have exactly 1-6 \`#\` characters.
Must have at least one space after the hashes.
Must have non-whitespace content after the space.
Must be followed by a blank line or end of file.

**Invalid patterns:**

\`#No space\` - missing space after hash
\` # Indented\` - leading whitespace
\`#######\` - more than 6 hashes
\`## \` - no content after space

**Content:**

Heading content can include any inline formatting: \`## **Bold** and _italic_\`

---

## Horizontal Rules

\`\`\`
_HorizontalRule_ = <column 0> \`---\` SPACE* <followed by blank line or EOF>
\`\`\`

**Requirements:**

Must be exactly 3 hyphens (not 2, not 4 or more).
Must start at column 0 (no leading whitespace).
Trailing spaces allowed after the three hyphens.
Must be followed by a blank line or end of file.

**Invalid patterns:**

\`- - -\` - spaces between hyphens
\` ---\` - leading whitespace
\`----\` - four hyphens
\`---text\` - content on same line

**Rationale:**

Other markdown flavors support \`***\`, \`___\`, or variable numbers of hyphens. mdz requires exactly \`---\` to avoid ambiguity and maintain the "one way to do things" principle.

---

## Codeblocks

\`\`\`
_Codeblock_ = <column 0> _OpenFence_ NEWLINE _CodeContent_ _CloseFence_ <followed by blank line or EOF>

_OpenFence_  = BACKTICK{3..} _LanguageHint_?
_CloseFence_ = BACKTICK{n}
               <where n matches the opening fence length>

_LanguageHint_ = _LanguageChar_+
_LanguageChar_ = ~[NEWLINE]

_CodeContent_ = (~[BACKTICK] | BACKTICK{1..n-1})*
                <any text that doesn't start a valid closing fence>
\`\`\`

**Requirements:**

Opening fence must start at column 0 (no leading whitespace).
Opening fence must have 3 or more backticks.
Closing fence must exactly match opening fence length.
Opening fence must be followed by newline.
Closing fence must be followed by blank line or EOF.
Codeblocks cannot be empty (must have at least one line of content).

**Language hints:**

Optional text after opening fence: \` \`\`\`typescript \`
Can contain any characters except newline.
Used for syntax highlighting hints.

**Nesting:**

Codeblocks with different fence lengths can nest:

\`\`\`\`
\`\`\`
Use \`\`\` to create codeblocks.
\`\`\`
\`\`\`\`

The inner \`\`\` does not close the outer \`\`\`\` fence.

**Invalid patterns:**

\` \`\`\` \` - leading whitespace
Unclosed blocks (no matching closing fence).
Empty blocks (no content between fences).
Mismatched fence lengths.

---

## Components and Elements

\`\`\`
_Component_ = _SelfClosingComponent_
            | _ComponentWithChildren_

_Element_ = _SelfClosingElement_
          | _ElementWithChildren_

_SelfClosingComponent_ = \`<\` _ComponentName_ SPACE* \`/>\`
_ComponentWithChildren_ = \`<\` _ComponentName_ \`>\` _InlineNode_* \`</\` _ComponentName_ \`>\`

_SelfClosingElement_ = \`<\` _ElementName_ SPACE* \`/>\`
_ElementWithChildren_ = \`<\` _ElementName_ \`>\` _InlineNode_* \`</\` _ElementName_ \`>\`

_ComponentName_ = [\`A\`-\`Z\`] _TagChar_*
_ElementName_   = [\`a\`-\`z\`] _TagChar_*
_TagChar_       = LETTER | DIGIT | \`-\` | \`_\`
\`\`\`

**Differentiation:**

Components start with uppercase letter: \`<Alert>\`, \`<Card>\`
Elements start with lowercase letter: \`<aside>\`, \`<code>\`

**Requirements:**

Tag names must start with a letter.
Tag names can contain letters, digits, hyphens, underscores.
Self-closing syntax requires \`/>\` with optional whitespace before.
Opening and closing tags must match exactly.

**Opt-in system:**

Components must be registered via \`mdz_components_context\`.
Elements must be registered via \`mdz_elements_context\`.
Unregistered components render as \`<ComponentName />\` placeholder.
Unregistered elements render as \`<element-name />\` placeholder.

**Children:**

Component/element children can include any inline formatting.
Nesting is supported: \`<Alert>This is _italic_ inside.</Alert>\`

**Attributes:**

Current version does NOT support attributes.
Future consideration: \`<Alert status="error">\` or \`<div class="container">\`

**MDX convention:**

If a paragraph consists solely of a single component/element with no other content, it does not get wrapped in a \`<p>\` tag. This matches MDX behavior.

---

## Whitespace Handling

**Single newline:**

Within paragraphs, a single newline is preserved in text node content.

\`\`\`
First line.
Second line.
\`\`\`

The newline character is preserved exactly as authored in the text content. When rendered by the \`Mdz\` component with CSS \`white-space: pre-wrap\`, it displays as a line break. No explicit \`<br>\` nodes are created in the AST.

**Double newline:**

Creates a paragraph break.

\`\`\`
First paragraph.

Second paragraph.
\`\`\`

**Triple or more newlines:**

Creates paragraphs with preserved blank lines between them.

\`\`\`
First paragraph.


Second paragraph separated by an extra newline.
\`\`\`

**Trailing whitespace:**

Preserved exactly as authored within inline content.

**Leading whitespace:**

Block-level constructs (headings, hr, codeblocks) must start at column 0. Leading whitespace invalidates the construct and causes it to be treated as literal text within a paragraph.

---

## Parsing Strategy

**Single-pass:**

The parser makes a single forward pass through the input.

**Character-code based:**

Uses numeric character codes for performance.

**Text accumulation:**

Optimizes by accumulating consecutive text characters.

**Strict validation:**

Prefers false negatives over false positives - when in doubt, treat as literal text.

**Position tracking:**

All AST nodes track start and end position in the source.

**Error recovery:**

Invalid syntax renders as literal text rather than causing parse errors.

**Greedy/bounded parsing:**

The parser uses a bounded search strategy for nested formatting delimiters to prevent nested formatters from consuming parent delimiters.

When parsing formatted content like \`**bold with _italic_**\`, the parser:

1. Finds the opening \`**\` at position X
2. Searches for the closing \`**\`, finding it at position Y
3. Sets \`#max_search_index = Y\` to create a boundary
4. Parses children only within range [X+2, Y), preventing them from finding delimiters beyond Y
5. Nested \`_italic_\` formatter inherits this boundary, so it cannot consume the closing \`**\`

This greedy matching (first occurrence within boundary) ensures proper nesting without backtracking.

**Text accumulation:**

For performance, consecutive text characters are accumulated into a single text node rather than creating individual nodes per character. The parser flushes accumulated text when encountering formatting delimiters or when parsing completes.

---

## AST Node Types

The parser produces an abstract syntax tree with these node types:

\`\`\`typescript
type MdzNode =
	| MdzTextNode
	| MdzCodeNode
	| MdzCodeblockNode
	| MdzBoldNode
	| MdzItalicNode
	| MdzStrikethroughNode
	| MdzLinkNode
	| MdzParagraphNode
	| MdzHrNode
	| MdzHeadingNode
	| MdzElementNode
	| MdzComponentNode;

interface MdzBaseNode {
	type: string;
	start: number;
	end: number;
}

interface MdzTextNode extends MdzBaseNode {
	type: 'Text';
	content: string;
}

interface MdzCodeNode extends MdzBaseNode {
	type: 'Code';
	content: string;
}

interface MdzCodeblockNode extends MdzBaseNode {
	type: 'Codeblock';
	lang: string | null;
	content: string;
}

interface MdzBoldNode extends MdzBaseNode {
	type: 'Bold';
	children: Array<MdzNode>;
}

interface MdzItalicNode extends MdzBaseNode {
	type: 'Italic';
	children: Array<MdzNode>;
}

interface MdzStrikethroughNode extends MdzBaseNode {
	type: 'Strikethrough';
	children: Array<MdzNode>;
}

interface MdzLinkNode extends MdzBaseNode {
	type: 'Link';
	reference: string;
	children: Array<MdzNode>;
	link_type: 'external' | 'internal';
}

interface MdzParagraphNode extends MdzBaseNode {
	type: 'Paragraph';
	children: Array<MdzNode>;
}

interface MdzHrNode extends MdzBaseNode {
	type: 'Hr';
}

interface MdzHeadingNode extends MdzBaseNode {
	type: 'Heading';
	level: 1 | 2 | 3 | 4 | 5 | 6;
	children: Array<MdzNode>;
}

interface MdzElementNode extends MdzBaseNode {
	type: 'Element';
	name: string;
	children: Array<MdzNode>;
}

interface MdzComponentNode extends MdzBaseNode {
	type: 'Component';
	name: string;
	children: Array<MdzNode>;
}
\`\`\`

**Position tracking:**

\`start\` and \`end\` are 0-based indices into the source string.

**Node-specific fields:**

- Text nodes have \`content\` field with the text string
- Code nodes have \`content\` field with the code string (identifier/module name)
- Codeblock nodes have \`lang\` (language hint, nullable) and \`content\` (raw code)
- Heading nodes have \`level\` (1-6) and \`children\` (inline content)
- Link nodes have \`reference\` (URL/path), \`link_type\` ('external' | 'internal'), and \`children\` (display content)
- Component and Element nodes have \`name\` and \`children\`
- Bold, Italic, Strikethrough, and Paragraph nodes have \`children\` arrays
`;var l=a('<div class="mt_xl5"><!></div>');function p(e){var n=l(),t=i(n);s(t,{get content(){return d}}),o(n),r(e,n)}export{p as component};
