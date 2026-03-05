/**
 * Shared character code constants for mdz parsers.
 *
 * @module
 */

// Character codes for performance
export const BACKTICK = 96; // `
export const ASTERISK = 42; // *
export const UNDERSCORE = 95; // _
export const TILDE = 126; // ~
export const NEWLINE = 10; // \n
export const HYPHEN = 45; // -
export const HASH = 35; // #
export const SPACE = 32; // (space)
export const TAB = 9; // \t
export const LEFT_ANGLE = 60; // <
export const RIGHT_ANGLE = 62; // >
export const SLASH = 47; // /
export const LEFT_BRACKET = 91; // [
export const RIGHT_BRACKET = 93; // ]
export const LEFT_PAREN = 40; // (
export const RIGHT_PAREN = 41; // )
export const COLON = 58; // :
export const PERIOD = 46; // .
export const COMMA = 44; // ,
export const SEMICOLON = 59; // ;
export const EXCLAMATION = 33; // !
export const QUESTION = 63; // ?
// RFC 3986 URI characters
export const DOLLAR = 36; // $
export const PERCENT = 37; // %
export const AMPERSAND = 38; // &
export const APOSTROPHE = 39; // '
export const PLUS = 43; // +
export const EQUALS = 61; // =
export const AT = 64; // @
// Character ranges
export const A_UPPER = 65; // A
export const Z_UPPER = 90; // Z
export const A_LOWER = 97; // a
export const Z_LOWER = 122; // z
export const ZERO = 48; // 0
export const NINE = 57; // 9
// mdz specification constants
export const HR_HYPHEN_COUNT = 3; // Horizontal rule requires exactly 3 hyphens
export const MIN_CODEBLOCK_BACKTICKS = 3; // Code blocks require minimum 3 backticks
export const MAX_HEADING_LEVEL = 6; // Headings support levels 1-6
export const HTTPS_PREFIX_LENGTH = 8; // Length of "https://"
export const HTTP_PREFIX_LENGTH = 7; // Length of "http://"
