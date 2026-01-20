# @fuzdev/fuz_ui

## 0.178.0

### Minor Changes

- upgrade fuz_css ([#108](https://github.com/fuzdev/fuz_ui/pull/108))

## 0.177.1

### Patch Changes

- add `fragment` to link component props ([#109](https://github.com/fuzdev/fuz_ui/pull/109))

## 0.177.0

### Minor Changes

- rework library interfaces ([65e4c7d](https://github.com/fuzdev/fuz_ui/commit/65e4c7d))

## 0.176.1

### Patch Changes

- fix source file collection to be properly scoped ([7636cea](https://github.com/fuzdev/fuz_ui/commit/7636cea))

## 0.176.0

### Minor Changes

- improve source analysis and make it less opinionated ([#106](https://github.com/fuzdev/fuz_ui/pull/106))

## 0.175.0

### Minor Changes

- rename repo `fuz.dev` from `www.fuz.dev` ([37ad5fc](https://github.com/fuzdev/fuz_ui/commit/37ad5fc))

## 0.174.0

### Minor Changes

- upgrade gro ([1047623](https://github.com/fuzdev/fuz_ui/commit/1047623))

## 0.173.0

### Minor Changes

- add `vite_plugin_library_well_known` ([#104](https://github.com/fuzdev/fuz_ui/pull/104))
- migrate to rest props pattern from attrs ([#105](https://github.com/fuzdev/fuz_ui/pull/105))

## 0.172.0

### Minor Changes

- remove some logos and rename some identifiers ([#103](https://github.com/fuzdev/fuz_ui/pull/103))
- remove `HiddenPersonalLinks` ([#103](https://github.com/fuzdev/fuz_ui/pull/103))

## 0.171.0

### Minor Changes

- rename `fuz_css_logo` from `moss_logo` ([2b33b74](https://github.com/fuzdev/fuz_ui/commit/2b33b74))

## 0.170.0

### Minor Changes

- migrate to fuzdev and rename to fuz_ui from fuz ([#102](https://github.com/fuzdev/fuz_ui/pull/102))

## 0.169.0

### Minor Changes

- move to fuzdev and rename to fuz_ui from fuz ([3088d89](https://github.com/ryanatkn/fuz/commit/3088d89))

## 0.168.0

### Minor Changes

- upgrade deps ([#101](https://github.com/ryanatkn/fuz/pull/101))

### Patch Changes

- add `filename` option to `library_gen` ([#101](https://github.com/ryanatkn/fuz/pull/101))

## 0.167.0

### Minor Changes

- upgrade belt ([39029f7](https://github.com/ryanatkn/fuz/commit/39029f7))

## 0.166.0

### Minor Changes

- upgrade peer deps ([27b6fa3](https://github.com/ryanatkn/fuz/commit/27b6fa3))

### Patch Changes

- make `optional` optional ([3daec66](https://github.com/ryanatkn/fuz/commit/3daec66))

## 0.165.0

### Minor Changes

- change generated `library_json` interface ([768857a](https://github.com/ryanatkn/fuz/commit/768857a))

## 0.164.0

### Minor Changes

- rename library and source and declaration ([#100](https://github.com/ryanatkn/fuz/pull/100))
- unpublish `package.ts` and replace with `package_gen.ts` ([#99](https://github.com/ryanatkn/fuz/pull/99))

### Patch Changes

- tweak package.ts generated message ([#99](https://github.com/ryanatkn/fuz/pull/99))

## 0.163.0

### Minor Changes

- rename `PasteFromClipboard` prop `onclipboardtext` from `onpaste` to avoid conflict ([515f9d3](https://github.com/ryanatkn/fuz/commit/515f9d3))

## 0.162.1

### Patch Changes

- fix `CopyToClipboard` `children` type ([63efa9c](https://github.com/ryanatkn/fuz/commit/63efa9c))

## 0.162.0

### Minor Changes

- rename `PascalCase` from `Upper_Snake_Case` (lol) ([#98](https://github.com/ryanatkn/fuz/pull/98))

## 0.161.2

### Patch Changes

- fix source dir detection in `module_matches_source` ([548d3a9](https://github.com/ryanatkn/fuz/commit/548d3a9))

## 0.161.1

### Patch Changes

- remove serialized pkg section from `PackageDetail` ([b6d102d](https://github.com/ryanatkn/fuz/commit/b6d102d))

## 0.161.0

### Minor Changes

- rename `tome.Component` from `.component` and make it typesafe ([#97](https://github.com/ryanatkn/fuz/pull/97))

## 0.160.0

### Minor Changes

- use >= for fuz_code peer dep ([8d494ef](https://github.com/ryanatkn/fuz/commit/8d494ef))

## 0.159.1

### Patch Changes

- add fuz_code as a peer dep ([36c52a3](https://github.com/ryanatkn/fuz/commit/36c52a3))

## 0.159.0

### Minor Changes

- change `package_gen_collect_source_files` to return an empty array instead of throwing for no src/lib ([402f22e](https://github.com/ryanatkn/fuz/commit/402f22e))

## 0.158.0

### Minor Changes

- upgrade moss ([6852bfc](https://github.com/ryanatkn/fuz/commit/6852bfc))

### Patch Changes

- use >= for ecosystem peer deps ([6852bfc](https://github.com/ryanatkn/fuz/commit/6852bfc))

## 0.157.0

### Minor Changes

- upstream src_json fully to belt ([816d708](https://github.com/ryanatkn/fuz/commit/816d708))

## 0.156.0

### Minor Changes

- upgrade belt and gro ([9209c75](https://github.com/ryanatkn/fuz/commit/9209c75))

## 0.155.0

### Minor Changes

- rework `@internal` to `@nodocs` and support re-exports in docs ([#96](https://github.com/ryanatkn/fuz/pull/96))

## 0.154.0

### Minor Changes

- change `ts_analyze_identifier`'s interface ([#95](https://github.com/ryanatkn/fuz/pull/95))

### Patch Changes

- support `@internal` tsdoc tag ([#95](https://github.com/ryanatkn/fuz/pull/95))

## 0.153.1

### Patch Changes

- fix `package_gen_helpers.ts` belt import path for belt itself ([7d2fd14](https://github.com/ryanatkn/fuz/commit/7d2fd14))

## 0.153.0

### Minor Changes

- rework some helpers ([#94](https://github.com/ryanatkn/fuz/pull/94))

## 0.152.0

### Minor Changes

- remove outdated and useless `parse_pkg` ([6b704dc](https://github.com/ryanatkn/fuz/commit/6b704dc))

### Patch Changes

- update @sveltejs/package ([c82676e](https://github.com/ryanatkn/fuz/commit/c82676e))

## 0.151.2

### Patch Changes

- fix mdz formatting edge cases ([#93](https://github.com/ryanatkn/fuz/pull/93))

## 0.151.1

### Patch Changes

- fix package gen helper ([8cdae91](https://github.com/ryanatkn/fuz/commit/8cdae91))

## 0.151.0

### Minor Changes

- fix mdz intraword behavior ([#92](https://github.com/ryanatkn/fuz/pull/92))
- upgrade belt and gro ([9f4645a](https://github.com/ryanatkn/fuz/commit/9f4645a))

## 0.150.0

### Minor Changes

- change mdz to accept markdown links but not tsdoc ([#91](https://github.com/ryanatkn/fuz/pull/91))

## 0.149.0

### Minor Changes

- rename `get_maybe` from `maybe_get` ([#90](https://github.com/ryanatkn/fuz/pull/90))
- rename some identifiers with better suffixes ([#90](https://github.com/ryanatkn/fuz/pull/90))
- add dependencies and dependents to `ModuleJson` ([#90](https://github.com/ryanatkn/fuz/pull/90))

### Patch Changes

- public `DocsSearch` ([#90](https://github.com/ryanatkn/fuz/pull/90))

## 0.148.0

### Minor Changes

- break ContextmenuRoot compat with Safari, add ContextmenuRootForSafariCompatibility.svelte ([#86](https://github.com/ryanatkn/fuz/pull/86))
- validate csp `trusted_sources` directives ([#88](https://github.com/ryanatkn/fuz/pull/88))
- change `run` for `EntryState` to be a getter ([#86](https://github.com/ryanatkn/fuz/pull/86))
- rename EcosystemLinks from CommunityLinks ([#87](https://github.com/ryanatkn/fuz/pull/87))
- remove bold styling from the `Alert` ([8ca616b](https://github.com/ryanatkn/fuz/commit/8ca616b))
- upgrade peer deps ([714cdd6](https://github.com/ryanatkn/fuz/commit/714cdd6))
- update peer deps ([f716e28](https://github.com/ryanatkn/fuz/commit/f716e28))
- change from `attrs` props pattern to extending props directly with element attributes ([#85](https://github.com/ryanatkn/fuz/pull/85))

### Patch Changes

- remove old domains from csp ([#86](https://github.com/ryanatkn/fuz/pull/86))

## 0.147.0

### Minor Changes

- upgrade @ryanatkn/moss@0.36 ([#84](https://github.com/ryanatkn/fuz/pull/84))

## 0.146.0

### Minor Changes

- add esm-env peer dep ([#82](https://github.com/ryanatkn/fuz/pull/82))
- upgrade gro ([#83](https://github.com/ryanatkn/fuz/pull/83))

## 0.145.0

### Minor Changes

- remove freeze behavior from csp ([#78](https://github.com/ryanatkn/fuz/pull/78))
- upgrade deps ([#80](https://github.com/ryanatkn/fuz/pull/80))
- upgrade SvelteKit and use `resolve`, bump minimum version to 2.26 ([#79](https://github.com/ryanatkn/fuz/pull/79))

## 0.144.5

### Patch Changes

- loosen `Svg` `fill` prop to be nullable ([6607b03](https://github.com/ryanatkn/fuz/commit/6607b03))

## 0.144.4

### Patch Changes

- chore: tweak "copy text" capitalization ([16bb77a](https://github.com/ryanatkn/fuz/commit/16bb77a))

## 0.144.3

### Patch Changes

- fix: `PendingAnimation` flex class ([1617c87](https://github.com/ryanatkn/fuz/commit/1617c87))

## 0.144.2

### Patch Changes

- fix: make `Contextmenu` attrs override base `class` attribute ([1e74c08](https://github.com/ryanatkn/fuz/commit/1e74c08))
- feat: add `Contextmenu` `tag` prop ([1e74c08](https://github.com/ryanatkn/fuz/commit/1e74c08))

## 0.144.1

### Patch Changes

- feat: add `attrs` to `Contextmenu` ([1b73c63](https://github.com/ryanatkn/fuz/commit/1b73c63))

## 0.144.0

### Minor Changes

- upgrade moss ([9cc1502](https://github.com/ryanatkn/fuz/commit/9cc1502))

## 0.143.0

### Minor Changes

- upgrade gro dep ([6f01882](https://github.com/ryanatkn/fuz/commit/6f01882))

## 0.142.1

### Patch Changes

- tweak `PackageDetail` declarations to not render `'default'` ([f7655b0](https://github.com/ryanatkn/fuz/commit/f7655b0))

## 0.142.0

### Minor Changes

- bump node@22.15 from 22.11 ([commit](https://github.com/ryanatkn/fuz/commit/5eb3485f53c39d6bd748f64bd1c586755950db50)) ([0388e3a](https://github.com/ryanatkn/fuz/commit/0388e3a))

## 0.141.1

### Patch Changes

- add pkg.ts ([dcb7e16](https://github.com/ryanatkn/fuz/commit/dcb7e16))

## 0.141.0

### Minor Changes

- upgrade moss and gro ([#75](https://github.com/ryanatkn/fuz/pull/75)) ([0158616](https://github.com/ryanatkn/fuz/commit/0158616))

## 0.140.1

### Patch Changes

- change `PackageDetail` and `PackageSummary` headers to serif ([dc26875](https://github.com/ryanatkn/fuz/commit/dc26875))

## 0.140.0

### Minor Changes

- upgrade moss@0.27.0 from 0.26.0 ([#74](https://github.com/ryanatkn/fuz/pull/74))

## 0.139.2

### Patch Changes

- add `ImgOrSvg` ([#73](https://github.com/ryanatkn/fuz/pull/73))

## 0.139.1

### Patch Changes

- add `data:` to `media-src` in the default csp ([2947384](https://github.com/ryanatkn/fuz/commit/2947384))

## 0.139.0

### Minor Changes

- rename Docs from Library ([#72](https://github.com/ryanatkn/fuz/pull/72))

## 0.138.0

### Minor Changes

- add the `theming` tome and move the `Themed` tome to components ([54a8a95](https://github.com/ryanatkn/fuz/commit/54a8a95))

## 0.137.1

### Patch Changes

- fix color-scheme loader script to use a hash ([a68e699](https://github.com/ryanatkn/fuz/commit/a68e699))

## 0.137.0

### Minor Changes

- fix inline theme script with CSP ([#59](https://github.com/ryanatkn/fuz/pull/59))
  - remove `create_theme_style_html`
  - change `COLOR_SCHEME_STORAGE_KEY` value to have a prefix, `'fuz:color-scheme'`
  - rename `themer.svelte.ts` from `theme.svelte.ts`
  - add `storage.ts` localStorage helpers

### Patch Changes

- add `csp.ts` module ([#59](https://github.com/ryanatkn/fuz/pull/59))

## 0.136.2

### Patch Changes

- zzz.software ([98dab44](https://github.com/ryanatkn/fuz/commit/98dab44))

## 0.136.1

### Patch Changes

- fix a11y for `ContextmenuRoot` ([820d1b1](https://github.com/ryanatkn/fuz/commit/820d1b1))

## 0.136.0

### Minor Changes

- bump required node version to >=22.11 ([#69](https://github.com/ryanatkn/fuz/pull/69))

### Patch Changes

- add `animation` prop to customize `PendingButton` ([#69](https://github.com/ryanatkn/fuz/pull/69))

## 0.135.0

### Minor Changes

- break: rework `PendingAnimation` to support `inline` variants and custom attrs ([#68](https://github.com/ryanatkn/fuz/pull/68))
- break: automatic `Svg` sizing - the `size` prop now has a default that uses `--size` ([#66](https://github.com/ryanatkn/fuz/pull/66))

## 0.134.0

### Minor Changes

- change dialog to support flexible content layouts without hacks ([#67](https://github.com/ryanatkn/fuz/pull/67))

## 0.133.2

### Patch Changes

- fix `PendingButton` to accept `attrs.title` ([1a94e28](https://github.com/ryanatkn/fuz/commit/1a94e28))
- fix `PendingButton` disabled fallback ([c20bf54](https://github.com/ryanatkn/fuz/commit/c20bf54))
- add default title to `PasteFromClipboard` ([8132235](https://github.com/ryanatkn/fuz/commit/8132235))

## 0.133.1

### Patch Changes

- relax `SvgData` type to accept `null` for all values ([92f5b2a](https://github.com/ryanatkn/fuz/commit/92f5b2a))
- add `icon_button` prop to `CopyToClipboard` ([caddfe8](https://github.com/ryanatkn/fuz/commit/caddfe8))

## 0.133.0

### Minor Changes

- break: add `allow_copying_empty_string` to `CopyToClipboard` and change its default to false ([e2ef554](https://github.com/ryanatkn/fuz/commit/e2ef554))

## 0.132.5

### Patch Changes

- improve inline `Svg` rendering ([612f4dc](https://github.com/ryanatkn/fuz/commit/612f4dc))

## 0.132.4

### Patch Changes

- add logos for AI providers ([#65](https://github.com/ryanatkn/fuz/pull/65))

## 0.132.3

### Patch Changes

- improve `EcosystemLinks` ([25fe36b](https://github.com/ryanatkn/fuz/commit/25fe36b))

## 0.132.2

### Patch Changes

- improve `CopyToClipboard` ([#64](https://github.com/ryanatkn/fuz/pull/64))

## 0.132.1

### Patch Changes

- add `onerror` prop to `PasteFromClipboard` ([68e3c3e](https://github.com/ryanatkn/fuz/commit/68e3c3e))
- fix `.icon_button` for `CopyToClipboard` ([3b2c0c1](https://github.com/ryanatkn/fuz/commit/3b2c0c1))

## 0.132.0

### Minor Changes

- remove classes from props interfaces for attrs ([#63](https://github.com/ryanatkn/fuz/pull/63))
- update ([#63](https://github.com/ryanatkn/fuz/pull/63))
  - change `CopyToClipboard` to pass a status to children
  - change `onclick` to `oncopy`

### Patch Changes

- add `PasteFromClipboard` ([#63](https://github.com/ryanatkn/fuz/pull/63))

## 0.131.6

### Patch Changes

- remove hci.social Mastodon link ([88f1927](https://github.com/ryanatkn/fuz/commit/88f1927))
- improve `CopyToClipboard` style ([#62](https://github.com/ryanatkn/fuz/pull/62))

## 0.131.5

### Patch Changes

- remove funding from `EcosystemLinks` ([e5dab77](https://github.com/ryanatkn/fuz/commit/e5dab77))

## 0.131.4

### Patch Changes

- tweak `PackageDetail` package metadata text ([38f009f](https://github.com/ryanatkn/fuz/commit/38f009f))

## 0.131.3

### Patch Changes

- rearrange `ProjectLinks` ([cf2f5b9](https://github.com/ryanatkn/fuz/commit/cf2f5b9))

## 0.131.2

### Patch Changes

- use Svelte's `on` in `ContextmenuRoot` instead of DOM event API ([#61](https://github.com/ryanatkn/fuz/pull/61))

## 0.131.1

### Patch Changes

- remove Zzz from project links for now ([e342fd8](https://github.com/ryanatkn/fuz/commit/e342fd8))

## 0.131.0

### Minor Changes

- replace `effect_skip` with `effect_with_count` ([#60](https://github.com/ryanatkn/fuz/pull/60))

### Patch Changes

- add `shrink` prop to `Svg` ([fc28782](https://github.com/ryanatkn/fuz/commit/fc28782))

## 0.130.5

### Patch Changes

- add link to https://fosstodon.org/@ryanatkn ([2b7880c](https://github.com/ryanatkn/fuz/commit/2b7880c))

## 0.130.4

### Patch Changes

- remove twitter link and add bluesky ([8f7b211](https://github.com/ryanatkn/fuz/commit/8f7b211))

## 0.130.3

### Patch Changes

- linkify blog in `EcosystemLinks` ([de2652f](https://github.com/ryanatkn/fuz/commit/de2652f))

## 0.130.2

### Patch Changes

- remove spiderspace from `EcosystemLinks` for now ([66f6ec6](https://github.com/ryanatkn/fuz/commit/66f6ec6))

## 0.130.1

### Patch Changes

- fix self dep ([7d54cc3](https://github.com/ryanatkn/fuz/commit/7d54cc3))

## 0.130.0

### Minor Changes

- upgrade peer dep to Svelte 5 ([69acd1d](https://github.com/ryanatkn/fuz/commit/69acd1d))

### Patch Changes

- Updated dependencies [69acd1d]
  - @ryanatkn/fuz@0.130.0

## 0.129.5

### Patch Changes

- Zzz - bot control hq ([8342f98](https://github.com/ryanatkn/fuz/commit/8342f98))

## 0.129.4

### Patch Changes

- remove discord link ([222eb8c](https://github.com/ryanatkn/fuz/commit/222eb8c))

## 0.129.3

### Patch Changes

- update webdevladder Mastodon link to fosstodon.org/@webdevladder ([bf19a04](https://github.com/ryanatkn/fuz/commit/bf19a04))

## 0.129.2

### Patch Changes

- relax type of `CopyToClipboard` type `text` to disable when `null` ([87cddf0](https://github.com/ryanatkn/fuz/commit/87cddf0))

## 0.129.1

### Patch Changes

- add logo for `@ryanatkn/belt` ([#58](https://github.com/ryanatkn/fuz/pull/58))

## 0.129.0

### Minor Changes

- upgrade `svelte` ([fbbce1c](https://github.com/ryanatkn/fuz/commit/fbbce1c))

## 0.128.1

### Patch Changes

- webdevladder.net has a blog and YouTube channels ([d31974c](https://github.com/ryanatkn/fuz/commit/d31974c))

## 0.128.0

### Minor Changes

- migrate to use `create_context` ([18e94e5](https://github.com/ryanatkn/fuz/commit/18e94e5))

## 0.127.0

### Minor Changes

- optimize icons to use a shared component ([#50](https://github.com/ryanatkn/fuz/pull/50))

## 0.126.0

### Minor Changes

- refine `create_context` API ([#57](https://github.com/ryanatkn/fuz/pull/57))

## 0.125.0

### Minor Changes

- add a `create_context` helper ([#56](https://github.com/ryanatkn/fuz/pull/56))

## 0.124.4

### Patch Changes

- fix library nav highlight ([#55](https://github.com/ryanatkn/fuz/pull/55))

## 0.124.3

### Patch Changes

- fix library layout ([2420668](https://github.com/ryanatkn/fuz/commit/2420668))

## 0.124.2

### Patch Changes

- fix more imports ([7eec3af](https://github.com/ryanatkn/fuz/commit/7eec3af))

## 0.124.1

### Patch Changes

- fix imports ([b23c745](https://github.com/ryanatkn/fuz/commit/b23c745))

## 0.124.0

### Minor Changes

- improve library styles ([#54](https://github.com/ryanatkn/fuz/pull/54))
  - rename `TomeHeader` from `TomeTitle`
  - rename `TomeSectionHeader` from `TomeSubheading`
  - rename `LibraryLink` from `LibraryLinkData`
  - rename `get_tome_by_name` from `get_tome`
  - use belt's `slugify`, which lowercases, and remove `tome.slug` and `tome.pathname`

## 0.123.0

### Minor Changes

- rename `TomeContent` from `TomeContent` ([#53](https://github.com/ryanatkn/fuz/pull/53))
- add snippets to `LibraryContent` to customize the root page and remove the `root_path` prop ([#52](https://github.com/ryanatkn/fuz/pull/52))

## 0.122.1

### Patch Changes

- fix `Breadcrumb` when `base` is defined ([#51](https://github.com/ryanatkn/fuz/pull/51))

## 0.122.0

### Minor Changes

- bump required node version to `20.17` ([7a52122](https://github.com/ryanatkn/fuz/commit/7a52122))

## 0.121.0

### Minor Changes

- upgrade `@ryanatkn/moss@0.15.0` ([91ad06b](https://github.com/ryanatkn/fuz/commit/91ad06b))

## 0.120.11

### Patch Changes

- fix `DialogParams['dialog_props']` type to be partial ([a158542](https://github.com/ryanatkn/fuz/commit/a158542))

## 0.120.10

### Patch Changes

- fix spiders ([e8db76e](https://github.com/ryanatkn/fuz/commit/e8db76e))

## 0.120.9

### Patch Changes

- update earbetter logo again ([47d8f87](https://github.com/ryanatkn/fuz/commit/47d8f87))

## 0.120.8

### Patch Changes

- update `EarbetterLogo` ([#48](https://github.com/ryanatkn/fuz/pull/48))

## 0.120.7

### Patch Changes

- add `onclick` prop to `CopyToClipboard` ([10b7ccc](https://github.com/ryanatkn/fuz/commit/10b7ccc))

## 0.120.6

### Patch Changes

- uncenter breadcrumb text ([953f4fa](https://github.com/ryanatkn/fuz/commit/953f4fa))

## 0.120.5

### Patch Changes

- fix library sidebar nav width ([acfa03d](https://github.com/ryanatkn/fuz/commit/acfa03d))

## 0.120.4

### Patch Changes

- fix shadows after moss upgrade ([b96342f](https://github.com/ryanatkn/fuz/commit/b96342f))

## 0.120.3

### Patch Changes

- migrate svelte:component usage ([299549e](https://github.com/ryanatkn/fuz/commit/299549e))

## 0.120.2

### Patch Changes

- fix sidebar nav text overflow ([2e27112](https://github.com/ryanatkn/fuz/commit/2e27112))

## 0.120.1

### Patch Changes

- update contextmenu events for Svelte 5 ([#47](https://github.com/ryanatkn/fuz/pull/47))

## 0.120.0

### Minor Changes

- simplify `CopyToClipboard` to not include a wrapper ([4abb6ab](https://github.com/ryanatkn/fuz/commit/4abb6ab))

## 0.119.3

### Patch Changes

- fix `CopyToClipboard` text size for non-icons ([3769839](https://github.com/ryanatkn/fuz/commit/3769839))

## 0.119.2

### Patch Changes

- fix `CopyToClipboard` for non-icons ([5f904ee](https://github.com/ryanatkn/fuz/commit/5f904ee))

## 0.119.1

### Patch Changes

- add options to `CopyToClipboard` ([c4bd56e](https://github.com/ryanatkn/fuz/commit/c4bd56e))

## 0.119.0

### Minor Changes

- upgrade `@ryanatkn/moss@0.12` from `0.11.1` ([#46](https://github.com/ryanatkn/fuz/pull/46))

## 0.118.2

### Patch Changes

- fix card shadows ([6517d8c](https://github.com/ryanatkn/fuz/commit/6517d8c))

## 0.118.1

### Patch Changes

- fix shadows ([2bd4177](https://github.com/ryanatkn/fuz/commit/2bd4177))

## 0.118.0

### Minor Changes

- upgrade `@ryanatkn/moss@0.11` from `0.10.1` ([#45](https://github.com/ryanatkn/fuz/pull/45))

### Patch Changes

- add `light` class to `:root` when not auto ([#45](https://github.com/ryanatkn/fuz/pull/45))

## 0.117.0

### Minor Changes

- loosen peer deps temporarily ([ca9a88a](https://github.com/ryanatkn/fuz/commit/ca9a88a))
- rename `contextmenu_state.svelte.ts` from `contextmenu_helpers.svelte.ts` and `ContextmenuState` from `ContextmenuStore` ([ca9a88a](https://github.com/ryanatkn/fuz/commit/ca9a88a))

### Patch Changes

- fix `TomeSectionHeader` layout and add `content_attrs` prop ([ca9a88a](https://github.com/ryanatkn/fuz/commit/ca9a88a))
- fix secondary nav layout for small screens ([ca9a88a](https://github.com/ryanatkn/fuz/commit/ca9a88a))

## 0.116.0

### Minor Changes

- upgrade `@ryanatkn/moss@0.9.0` from `0.8.0` ([54be313](https://github.com/ryanatkn/fuz/commit/54be313))

## 0.115.1

### Patch Changes

- make `@ryanatkn/gro` and optional peer dep ([589aef5](https://github.com/ryanatkn/fuz/commit/589aef5))

## 0.115.0

### Minor Changes

- upgrade `@ryanatkn/gro@0.133.0` from 0.132.0 ([49b6948](https://github.com/ryanatkn/fuz/commit/49b6948))

## 0.114.0

### Minor Changes

- remove `fuz_config.ts` and replace with `@ryanatkn/fuz_gitops/gitops_config.ts` ([9b74ece](https://github.com/ryanatkn/fuz/commit/9b74ece))

## 0.113.0

### Minor Changes

- rename `FuzRepo` to `FuzRepoConfig` and its `url` property to `repo_url` ([#44](https://github.com/ryanatkn/fuz/pull/44))

## 0.112.0

### Minor Changes

- rework config ([#43](https://github.com/ryanatkn/fuz/pull/43))

## 0.111.0

### Minor Changes

- pin peer deps ([c4a48ea](https://github.com/ryanatkn/fuz/commit/c4a48ea))

## 0.110.4

### Patch Changes

- update Spiderspace logo ([7ea7a85](https://github.com/ryanatkn/fuz/commit/7ea7a85))

## 0.110.3

### Patch Changes

- update Spiderspace logo ([025154c](https://github.com/ryanatkn/fuz/commit/025154c))

## 0.110.2

### Patch Changes

- add alt text to spiderspace logo ([25f5576](https://github.com/ryanatkn/fuz/commit/25f5576))

## 0.110.1

### Patch Changes

- update Spiderspace logo ([346a5b8](https://github.com/ryanatkn/fuz/commit/346a5b8))

## 0.110.0

### Minor Changes

- upgrade `@ryanatkn/moss@0.8.0` from `0.7.1` ([#42](https://github.com/ryanatkn/fuz/pull/42))

## 0.109.0

### Minor Changes

- change `Dialogs.svelte` to take a plain array `stores` prop instead of a store (no more stores!) ([#41](https://github.com/ryanatkn/fuz/pull/41))

## 0.108.7

### Patch Changes

- update earbetter logo ([e3cddc6](https://github.com/ryanatkn/fuz/commit/e3cddc6))

## 0.108.6

### Patch Changes

- add earbetter logo ([6d167fc](https://github.com/ryanatkn/fuz/commit/6d167fc))

## 0.108.5

### Patch Changes

- add fuz logo variants ([9b161c7](https://github.com/ryanatkn/fuz/commit/9b161c7))

## 0.108.4

### Patch Changes

- publish src files ([54ed762](https://github.com/ryanatkn/fuz/commit/54ed762))
- enable tsconfig `declaration` and `declarationMap` ([0f0b344](https://github.com/ryanatkn/fuz/commit/0f0b344))
- add tsconfig `sourceRoot` ([bf9d234](https://github.com/ryanatkn/fuz/commit/bf9d234))

## 0.108.3

### Patch Changes

- add `ProjectLinks.svelte` and use it in `EcosystemLinksPanel.svelte` ([b90fb70](https://github.com/ryanatkn/fuz/commit/b90fb70))

## 0.108.2

### Patch Changes

- add base path hack to `LibraryContent.svelte` ([6b2b337](https://github.com/ryanatkn/fuz/commit/6b2b337))

## 0.108.1

### Patch Changes

- fix word-break on `EcosystemLinks.svelte` ([2a21db8](https://github.com/ryanatkn/fuz/commit/2a21db8))

## 0.108.0

### Minor Changes

- rework `Themed.svelte` ([#38](https://github.com/ryanatkn/fuz/pull/38))
  - move some helpers from `Themed.svelte` to `theme.ts`
  - replace `get_theme` and `get_color_scheme` with `get_themer`
  - remove `ThemedScope.svelte` for now because it's too broken

### Patch Changes

- add `effect_skip` helper ([#36](https://github.com/ryanatkn/fuz/pull/36))
- allow package_json logo to have a starting slash ([bed6aa2](https://github.com/ryanatkn/fuz/commit/bed6aa2))
- fix ssr ([#38](https://github.com/ryanatkn/fuz/pull/38))
- add `EcosystemLinks.svelte`, `EcosystemLinksPanel.svelte`, and `HiddenPersonalLinks.svelte` ([d422d79](https://github.com/ryanatkn/fuz/commit/d422d79))

## 0.107.1

### Patch Changes

- switch to use `esm-env` from `import.meta.env` ([#35](https://github.com/ryanatkn/fuz/pull/35))

## 0.107.0

### Minor Changes

- rename `MdnLink` prop `path` from `href` ([38ee414](https://github.com/ryanatkn/fuz/commit/38ee414))

## 0.106.4

### Patch Changes

- add `GroLogo` ([33009ce](https://github.com/ryanatkn/fuz/commit/33009ce))

## 0.106.3

### Patch Changes

- fix logo size prop ([dc8b326](https://github.com/ryanatkn/fuz/commit/dc8b326))

## 0.106.2

### Patch Changes

- fix logo colors ([619e744](https://github.com/ryanatkn/fuz/commit/619e744))

## 0.106.1

### Patch Changes

- use standard favicon size in `PackageDetail` ([2d7a92f](https://github.com/ryanatkn/fuz/commit/2d7a92f))

## 0.106.0

### Minor Changes

- bump minor for breaking changes ([45ebcbb](https://github.com/ryanatkn/fuz/commit/45ebcbb))

## 0.105.3

### Patch Changes

- add logos for webdevladder and zzz ([#33](https://github.com/ryanatkn/fuz/pull/33))
- add support for `logo` and `logo_alt` in `PackageJson` ([#33](https://github.com/ryanatkn/fuz/pull/33))
- add `sideEffects` to `package.json` ([85b92a8](https://github.com/ryanatkn/fuz/commit/85b92a8))

## 0.105.2

### Patch Changes

- upgrade gro with correctly formatted exports ([f499ced](https://github.com/ryanatkn/fuz/commit/f499ced))

## 0.105.1

### Patch Changes

- downgrade `svelte@5.0.0-next.164` to fix dist types ([1ba6a42](https://github.com/ryanatkn/fuz/commit/1ba6a42))

## 0.105.0

### Minor Changes

- support `node@20.12` and later ([3d29f10](https://github.com/ryanatkn/fuz/commit/3d29f10))

## 0.104.1

### Patch Changes

- downgrade `svelte@5.0.0-next.164` to fix dist types ([5647ac3](https://github.com/ryanatkn/fuz/commit/5647ac3))

## 0.104.0

### Minor Changes

- upgrade `node@22.3` ([#32](https://github.com/ryanatkn/fuz/pull/32))

## 0.103.0

### Minor Changes

- upgrade @ryanatkn/gro@0.119 ([d364646](https://github.com/ryanatkn/fuz/commit/d364646))

## 0.102.1

### Patch Changes

- improve `PackageSummary` logo ([#31](https://github.com/ryanatkn/fuz/pull/31))

## 0.102.0

### Minor Changes

- remove `el` from `PendingButton` props in favor of an exported `focus` method ([#29](https://github.com/ryanatkn/fuz/pull/29))

### Patch Changes

- tweak `PackageSummary` styles ([ae718b1](https://github.com/ryanatkn/fuz/commit/ae718b1))

## 0.101.5

### Patch Changes

- add `$bindable` prop `el` to `PendingButton` ([#28](https://github.com/ryanatkn/fuz/pull/28))

## 0.101.4

### Patch Changes

- improve library headings ([#27](https://github.com/ryanatkn/fuz/pull/27))

## 0.101.3

### Patch Changes

- relax `contextmenu_attachment` type to accept `null | undefined` ([#26](https://github.com/ryanatkn/fuz/pull/26))

## 0.101.2

### Patch Changes

- fix: update `text_color` from `color` ([e10330a](https://github.com/ryanatkn/fuz/commit/e10330a))

## 0.101.1

### Patch Changes

- fix: update moss color variable usage ([f8792fa](https://github.com/ryanatkn/fuz/commit/f8792fa))

## 0.101.0

### Minor Changes

- rename ts modules that differ only in case from components ([#24](https://github.com/ryanatkn/fuz/pull/24))
  - `$lib/contextmenu_helpers.svelte.ts` from `$lib/contextmenu.svelte.ts`
  - `$lib/docs_helpers.svelte.ts` from `$lib/docs.svelte.ts`

## 0.100.2

### Patch Changes

- fix: change `svelte` peer dep to `^5.0.0-next.0` from `^5` ([9e40ee2](https://github.com/ryanatkn/fuz/commit/9e40ee2))

## 0.100.1

### Patch Changes

- fix: remove accidental self-dependency ([#23](https://github.com/ryanatkn/fuz/pull/23))

## 0.100.0

### Minor Changes

- fix: pin peer deps for `svelte` and `@sveltejs/kit` ([#22](https://github.com/ryanatkn/fuz/pull/22))

### Patch Changes

- feat: add theme helpers from `@ryanatkn/moss` ([#22](https://github.com/ryanatkn/fuz/pull/22))
- Updated dependencies [401496e]
- Updated dependencies [401496e]
  - @ryanatkn/fuz@0.100.0

## 0.99.4

### Patch Changes

- show shadow on `LibraryPrimaryNav` only when scrolled down the page ([98a2798](https://github.com/ryanatkn/fuz/commit/98a2798))
- Updated dependencies [98a2798]
  - @ryanatkn/fuz@0.99.4

## 0.99.3

### Patch Changes

- fix `TomeSectionHeader` h4 links ([60a6ec1](https://github.com/ryanatkn/fuz/commit/60a6ec1))
- Updated dependencies [60a6ec1]
  - @ryanatkn/fuz@0.99.3

## 0.99.2

### Patch Changes

- fix `TomeSectionHeader` indentation ([4c4c111](https://github.com/ryanatkn/fuz/commit/4c4c111))
- Updated dependencies [4c4c111]
  - @ryanatkn/fuz@0.99.2

## 0.99.1

### Patch Changes

- add support for `tag` prop value `'h4'` to `TomeSectionHeader` ([df0bb3c](https://github.com/ryanatkn/fuz/commit/df0bb3c))
- Updated dependencies [df0bb3c]
  - @ryanatkn/fuz@0.99.1

## 0.99.0

### Minor Changes

- `@ryanatkn/moss@0.2.0` ([72056e3](https://github.com/ryanatkn/fuz/commit/72056e3)) ([upgrade](https://github.com/ryanatkn/fuz/commit/upgrade))

### Patch Changes

- Updated dependencies [72056e3]
  - @ryanatkn/fuz@0.99.0

## 0.98.1

### Patch Changes

- add `@ryanatkn/moss` to peer deps ([5acbaf2](https://github.com/ryanatkn/fuz/commit/5acbaf2))

## 0.98.0

### Minor Changes

- extract @ryanatkn/moss - ([#20](https://github.com/ryanatkn/fuz/pull/20))
  [github.com/ryanatkn/moss/pull/1](https://github.com/ryanatkn/moss/pull/1)

## 0.97.2

### Patch Changes

- improve `PackageDetail` ([b10f1ee](https://github.com/ryanatkn/fuz/commit/b10f1ee))
- Updated dependencies [b10f1ee]
  - @ryanatkn/fuz@0.97.2

## 0.97.1

### Patch Changes

- add `Card` link styling ([470608c](https://github.com/ryanatkn/fuz/commit/470608c))

## 0.97.0

### Minor Changes

- rework logo component APIs ([9222875](https://github.com/ryanatkn/fuz/commit/9222875))

## 0.96.8

### Patch Changes

- update `MossLogo` ([3e035b1](https://github.com/ryanatkn/fuz/commit/3e035b1))

## 0.96.7

### Patch Changes

- add `ZzzLogo` ([dcc26b1](https://github.com/ryanatkn/fuz/commit/dcc26b1))

## 0.96.6

### Patch Changes

- add `MossLogo` ([00edf68](https://github.com/ryanatkn/fuz/commit/00edf68))

## 0.96.5

### Patch Changes

- add `FuzTemplateLogo` ([6e6d7a6](https://github.com/ryanatkn/fuz/commit/6e6d7a6))

## 0.96.4

### Patch Changes

- add `SpiderspaceLogo` ([9b6df0f](https://github.com/ryanatkn/fuz/commit/9b6df0f))

## 0.96.3

### Patch Changes

- improve package components ([b25a4c6](https://github.com/ryanatkn/fuz/commit/b25a4c6))
- add `icon_size_xl3` ([b25a4c6](https://github.com/ryanatkn/fuz/commit/b25a4c6))

## 0.96.2

### Patch Changes

- hoist `repo_name` out of `LibraryContent` ([a7e6c77](https://github.com/ryanatkn/fuz/commit/a7e6c77))

## 0.96.1

### Patch Changes

- allow customizing the library breadcrumb children ([a521537](https://github.com/ryanatkn/fuz/commit/a521537))
- fix `PackageSummary` homepage url ([a521537](https://github.com/ryanatkn/fuz/commit/a521537))

## 0.96.0

### Minor Changes

- rename `Spider` from `FuzLogo` and publish `FuzLogo` and `Spiders` ([0f4908e](https://github.com/ryanatkn/fuz/commit/0f4908e))

## 0.95.0

### Minor Changes

- move theme Svelte helpers to `Themed.svelte` from `theme.ts` to prepare for Moss ([3ccf53c](https://github.com/ryanatkn/fuz/commit/3ccf53c))

## 0.94.0

### Minor Changes

- - use `:where` in the reset stylesheet to lower specificity of most selectors ([#21](https://github.com/ryanatkn/fuz/pull/21))
  - rename `link_color_selected` from `link_active`
  - remove generic variables to support generic fallbacks:
    - `var(--size)` becomes `var(--size, var(--size_md))`
    - `var(--icon_size)` becomes `var(--icon_size, var(--icon_size_md))`

## 0.93.3

### Patch Changes

- improve specificity of reset CSS by using `:where` instead of `:is` ([215c9d0](https://github.com/ryanatkn/fuz/commit/215c9d0))

## 0.93.2

### Patch Changes

- improve contextmenu api to have more flexible action params ([#19](https://github.com/ryanatkn/fuz/pull/19))

## 0.93.1

### Patch Changes

- fix card styles to workaround a pending Svelte 5 bug ([3f4fbd7](https://github.com/ryanatkn/fuz/commit/3f4fbd7))

## 0.93.0

### Minor Changes

- rename `font_sans` and `font_mono` from `font_family_sans` and `font_family_mono` ([#15](https://github.com/ryanatkn/fuz/pull/15))
- remove `nav` styles ([#15](https://github.com/ryanatkn/fuz/pull/15))
- remove `PageHeader` and `PageFooter` ([#15](https://github.com/ryanatkn/fuz/pull/15))
- remove the `border_radius` variable ([#15](https://github.com/ryanatkn/fuz/pull/15))
- remove `h1-6` `margin-top` and compensate by increasing `margin-bottom` ([#15](https://github.com/ryanatkn/fuz/pull/15))
- upgrade to svelte@5 including many breaking changes to components ([#15](https://github.com/ryanatkn/fuz/pull/15))
  - convert slots to snippets
  - change events to callbacks
  - remove `DevmodeControls`

- change `line_height` vaiables ([#15](https://github.com/ryanatkn/fuz/pull/15))
  - rename `line_height_xs` from `line_height_1`
  - remove `line_height_2`
  - rename `line_height_sm` from `line_height_3`
  - rename `line_height_md` from `line_height_4`
  - rename `line_height_lg` from `line_height_5`
  - remove `line_height_6`
  - rename `line_height_xl` from `line_height_7`

- change shadow variables ([#15](https://github.com/ryanatkn/fuz/pull/15))
  - rename `shadow` to `shadow_md`
  - rename `shadow_inset` to `shadow_inset_md`
  - rename `shadow_inset_active` to `shadow_inset_inverse_md`

### Patch Changes

- add `Details` ([#15](https://github.com/ryanatkn/fuz/pull/15))
- remove `.prose` ([#15](https://github.com/ryanatkn/fuz/pull/15))
  - use `.unstyled` to get the old behavior for `ul|ol|menu`
  - `a` is now the default `diplay: inline` instead of `flex`

- add the `.clickable` semantic class ([#15](https://github.com/ryanatkn/fuz/pull/15))

## 0.92.0

### Minor Changes

- upgrade `@ryanatkn/belt@0.20.10` ([5be586b](https://github.com/ryanatkn/fuz/commit/5be586b))

## 0.91.5

### Patch Changes

- fix `PackageDetail` homepage formatting ([2b22117](https://github.com/ryanatkn/fuz/commit/2b22117))

## 0.91.4

### Patch Changes

- fix `PackageSummary` homepage formatting ([37e6790](https://github.com/ryanatkn/fuz/commit/37e6790))
- make hidden `display: none` higher specificity with `!important` ([948e3e6](https://github.com/ryanatkn/fuz/commit/948e3e6))

## 0.91.3

### Patch Changes

- add `Details` component for lazy loading ([#17](https://github.com/ryanatkn/fuz/pull/17))

## 0.91.2

### Patch Changes

- add float utility classes ([38fa81e](https://github.com/ryanatkn/fuz/commit/38fa81e))

## 0.91.1

### Patch Changes

- publish CHANGELOG.md ([87f6fa0](https://github.com/ryanatkn/fuz/commit/87f6fa0))

## 0.91.0

### Minor Changes

- extract optional stylesheets from `style.css` ([#16](https://github.com/ryanatkn/fuz/pull/16))
- rename `TomeLink` from `LibraryTomeLink` ([#14](https://github.com/ryanatkn/fuz/pull/14))
- - rename `font_sans` variable from `font_family` ([#16](https://github.com/ryanatkn/fuz/pull/16))
  - remove `spaced_hz`, use `mr_lg`
  - remove `spaced`, use `mb_lg`
  - remove `padded` variables, use `p` variants
  - remove `.unspaced` and `.unspaced_hz`
  - rename `w_100` from `width_full` and `h_100` from `height_full`

### Patch Changes

- add `MdnLink`, `MdnLogo`, and `$lib/variable_data.ts` ([#14](https://github.com/ryanatkn/fuz/pull/14))

## 0.90.0

### Minor Changes

- remove variables `icon_size_xl3` and `icon_size_xl4` ([#13](https://github.com/ryanatkn/fuz/pull/13))
- rename variable pattern `xsN` from `Nxs` and `xlN` from `Nxl` ([#13](https://github.com/ryanatkn/fuz/pull/13))
- rename `border_color_N` from `border_N` ([#13](https://github.com/ryanatkn/fuz/pull/13))

## 0.89.0

### Minor Changes

- many potentially-breaking style changes ([#12](https://github.com/ryanatkn/fuz/pull/12))
- rename `StyleVariable` from `ThemeVariable` ([#12](https://github.com/ryanatkn/fuz/pull/12))
- rename `Theme` property `variables` from `items` ([#12](https://github.com/ryanatkn/fuz/pull/12))
- rename some variables ([#12](https://github.com/ryanatkn/fuz/pull/12))
  - `fade_N` from `faded_N`
  - `radius_N` from `border_radius_N`
  - `space_xs5` from `space_xs5`
  - `space_xs4` from `space_xs4`
  - `space_xs3` from `space_xs3`
  - `space_xs2` from `space_xs2`
  - `space_xs` from `space_xs`
  - `space_sm` from `space_sm`
  - `space_md` from `space_md`
  - `space_lg` from `space_lg`
  - `space_xl` from `space_1`
  - `space_xl2` from `space_2`
  - `space_xl3` from `space_3`
  - `space_xl4` from `space_4`
  - `space_xl5` from `space_5`
  - `space_xl6` from `space_6`
  - `space_xl7` from `space_7`
  - `space_xl8` from `space_8`
  - `space_xl9` from `space_9`
  - `size_xl` from `size_1`
  - `size_xl2` from `size_2`
  - `size_xl3` from `size_3`
  - `size_xl4` from `size_4`
  - `size_xl5` from `size_5`
  - `size_xl6` from `size_6`
  - `size_xl7` from `size_7`
  - `size_xl8` from `size_8`
  - `size_xl9` from `size_9`
  - `icon_size_xl` from `icon_size_1`
  - `icon_size_xl2` from `icon_size_2`
  - `icon_size_xl3` from `icon_size_3`
  - `icon_size_xl4` from `icon_size_4`

### Patch Changes

- tweak colors ([#10](https://github.com/ryanatkn/fuz/pull/10))
- rename `TomeLink` from `LibraryVocab` ([#12](https://github.com/ryanatkn/fuz/pull/12))

## 0.88.0

### Minor Changes

- remove `theme_color` from `Themed` and `THEME_COLOR` ([#9](https://github.com/ryanatkn/fuz/pull/9))
- add suffix `_5` to all base variable names ([#9](https://github.com/ryanatkn/fuz/pull/9))
  - `color_a` to `color_a_5`
  - `color_b` to `color_b_5`
  - `color_c` to `color_c_5`
  - `color_d` to `color_d_5`
  - `color_e` to `color_e_5`
  - `color_f` to `color_f_5`
  - `color_g` to `color_g_5`

### Patch Changes

- add button color classes `.color_a-g` ([#9](https://github.com/ryanatkn/fuz/pull/9))

## 0.87.0

### Minor Changes

- rename colors ([#8](https://github.com/ryanatkn/fuz/pull/8))
  - `color_1` to `color_a_5` and `hue_1` to `hue_a` (primary)
  - `color_2` to `color_b_5` and `hue_2` to `hue_b` (success)
  - `color_3` to `color_d_5` and `hue_3` to `hue_d`
  - `color_4` to `color_e_5` and `hue_4` to `hue_e`
  - `color_5` to `color_c_5` and `hue_5` to `hue_c` (danger)
  - `color_6` to `color_f_5` and `hue_6` to `hue_f`
  - `color_7` to `color_g_5` and `hue_7` to `hue_g`

## 0.86.0

### Minor Changes

- remove `.buttonlike` ([#7](https://github.com/ryanatkn/fuz/pull/7))

## 0.85.0

### Minor Changes

- remove `drop_shadow` and `drop_shadow_lg` variables and ([#1](https://github.com/ryanatkn/fuz/pull/1))
  rename `box_shadow`/`box_shadow_lg` to `shadow`/`shadow_lg`
- add button colors ([#1](https://github.com/ryanatkn/fuz/pull/1))

## 0.84.0

### Minor Changes

- extract package meta and deployments modules to fuz_gitops ([#6](https://github.com/ryanatkn/fuz/pull/6))

## 0.83.2

### Patch Changes

- fix fetch failures ([#5](https://github.com/ryanatkn/fuz/pull/5))

## 0.83.1

### Patch Changes

- publish `PageMenu` ([#4](https://github.com/ryanatkn/fuz/pull/4))

## 0.83.0

### Minor Changes

- add config and deployments feature ([#3](https://github.com/ryanatkn/fuz/pull/3))

## 0.82.0

### Minor Changes

- republish ([#2](https://github.com/ryanatkn/fuz/pull/2))

## 0.81.0

### Minor Changes

- unpublish package.ts ([3300d01](https://github.com/ryanatkn/fuz/commit/3300d01))

## 0.80.1

### Patch Changes

- add orc ([4f8617d](https://github.com/ryanatkn/fuz/commit/4f8617d))

## 0.80.0

### Minor Changes

- fix `.prose` button margins ([e651cc6](https://github.com/ryanatkn/fuz/commit/e651cc6))

## 0.79.3

### Patch Changes

- fix table head text alignment ([558a22d](https://github.com/ryanatkn/fuz/commit/558a22d))

## 0.79.2

### Patch Changes

- fix a name ([b7d77c5](https://github.com/ryanatkn/fuz/commit/b7d77c5))

## 0.79.1

### Patch Changes

- upgrade deps ([534e204](https://github.com/ryanatkn/fuz/commit/534e204))

## 0.79.0

### Minor Changes

- upgrade deps ([1265ae7](https://github.com/ryanatkn/fuz/commit/1265ae7))

## 0.78.0

### Minor Changes

- use `ProperSnakes` ([39e2af5](https://github.com/ryanatkn/fuz/commit/39e2af5))

## 0.77.1

### Patch Changes

- add `"public": true,` to `package.json` ([ea562c5](https://github.com/ryanatkn/fuz/commit/ea562c5))

## 0.77.0

### Minor Changes

- remove unused `ThemerParams` ([305546f](https://github.com/ryanatkn/fuz/commit/305546f))

### Patch Changes

- upgrade gro to fix `package.ts` ([74a56e7](https://github.com/ryanatkn/fuz/commit/74a56e7))

## 0.76.0

### Minor Changes

- upgrade gro with `modules` added to `package.json` ([4829675](https://github.com/ryanatkn/fuz/commit/4829675))

## 0.75.4

### Patch Changes

- fix textarea padding ([2ed6d56](https://github.com/ryanatkn/fuz/commit/2ed6d56))

## 0.75.3

### Patch Changes

- cleanup css ([a61c032](https://github.com/ryanatkn/fuz/commit/a61c032))

## 0.75.2

### Patch Changes

- upgrade gro to add svelte default imports ([870d1a1](https://github.com/ryanatkn/fuz/commit/870d1a1))

## 0.75.1

### Patch Changes

- fix input padding and line-height ([1814ae7](https://github.com/ryanatkn/fuz/commit/1814ae7))

## 0.75.0

### Minor Changes

- rename `Theme` property `items` from `variables` ([0756d97](https://github.com/ryanatkn/fuz/commit/0756d97))

## 0.74.0

### Minor Changes

- improve base styles in reference to CSS resets ([d8ab48d](https://github.com/ryanatkn/fuz/commit/d8ab48d))
  - set base `--line_height` to `normal` and override for `.prose` and some elements
  - set height for `body` to `100vh`
  - simplify default `--font_sans`

### Patch Changes

- add variables `--line_height_xs-xl` ([d8ab48d](https://github.com/ryanatkn/fuz/commit/d8ab48d))

## 0.73.0

### Minor Changes

- rename theme property `summary` from `comment` to match ActivityStreams ([e747fd8](https://github.com/ryanatkn/fuz/commit/e747fd8))

### Patch Changes

- publish $routes/package.ts ([beb1ac2](https://github.com/ryanatkn/fuz/commit/beb1ac2))

## 0.72.1

### Patch Changes

- add .p_xl2-5 helper classes ([e6872f0](https://github.com/ryanatkn/fuz/commit/e6872f0))

## 0.72.0

### Minor Changes

- rename xl vars to drop the xl, so `_xlX` becomes `_X` and `_xl` becomes `_1` ([6540471](https://github.com/ryanatkn/fuz/commit/6540471))

## 0.71.0

### Minor Changes

- unpublish `packages` json and task ([faf3063](https://github.com/ryanatkn/fuz/commit/faf3063))

## 0.70.3

### Patch Changes

- remove `@sveltejs/kit` peer dep ([5d3090c](https://github.com/ryanatkn/fuz/commit/5d3090c))

## 0.70.2

### Patch Changes

- remove `@ryanatkn/belt` dependency ([0d033d3](https://github.com/ryanatkn/fuz/commit/0d033d3))

## 0.70.1

### Patch Changes

- add peer deps ([fb47615](https://github.com/ryanatkn/fuz/commit/fb47615))

## 0.70.0

### Minor Changes

- extract contextmenu ([ddb3bf1](https://github.com/ryanatkn/fuz/commit/ddb3bf1))
- upgrade to @ryanatkn/gro from @feltjs/gro ([e802137](https://github.com/ryanatkn/fuz/commit/e802137))
- upgrade `@ryanatkn/belt@0.15.0` from `0.13.1` ([ddb3bf1](https://github.com/ryanatkn/fuz/commit/ddb3bf1))

### Patch Changes

- fix theme meta tags ([ddb3bf1](https://github.com/ryanatkn/fuz/commit/ddb3bf1))

## 0.69.1

### Patch Changes

- upgrade @ryanatkn/belt ([017ebe6](https://github.com/ryanatkn/fuz/commit/017ebe6))

## 0.69.0

### Minor Changes

- fix some snake_cases ([0a1c4d7](https://github.com/ryanatkn/fuz/commit/0a1c4d7))

## 0.68.0

### Minor Changes

- upgrade deps and switch to `snake_case` ([e159ea3](https://github.com/ryanatkn/fuz/commit/e159ea3))

## 0.67.0

### Minor Changes

- www.fuz.dev ([861180a](https://github.com/ryanatkn/fuz/commit/861180a))
- rename to `@ryanatkn/fuz` ([0287a9b](https://github.com/ryanatkn/fuz/commit/0287a9b))

## 0.66.2

### Patch Changes

- upgrade gro and felt-mural ([#348](https://github.com/ryanatkn/fuz/pull/348)) ([e49ce5d2](https://github.com/ryanatkn/fuz/commit/e49ce5d2))

## 0.66.1

- remove a SvelteKit import as a workaround to tests failing
  ([commit](https://github.com/ryanatkn/fuz/commit/ee1c3739c99b2054b8f07014fa68977827fb592a))

## 0.66.0

- **break**: fix contextmenu for iOS
  ([#314](https://github.com/ryanatkn/fuz/pull/314),
  [#319](https://github.com/ryanatkn/fuz/pull/319))

## 0.65.4

- improve `ColorSchemeInput`
  ([commit](https://github.com/ryanatkn/fuz/commit/028a62992cfee8375c0597247b7f74b78cd37727))

## 0.65.3

- fix `aside:hover` style
  ([commit](https://github.com/ryanatkn/fuz/commit/2d21458c3198522af6e520630941f21d5ca4edfd))

## 0.65.2

- tweak `.selectable.selected` style
  ([commit](https://github.com/ryanatkn/fuz/commit/f6167c678d4f1438a29d0ef4b3939382ef0d573a))

## 0.65.1

- fix `.chip` `font-weight`
  ([#346](https://github.com/ryanatkn/fuz/pull/346))

## 0.65.0

- **break**: remove the `highlighted` prop of `Code`, use `lang={null}` instead
  ([#337](https://github.com/ryanatkn/fuz/pull/337))
- **break**: rename `Alert` from `Message`
  ([#339](https://github.com/ryanatkn/fuz/pull/339))
- add `inline` prop to `Code`
  ([#337](https://github.com/ryanatkn/fuz/pull/337))
- add classes `.inline`, `.inline_block`, `.block`, `.flex`, and `.flex_1`
  ([#337](https://github.com/ryanatkn/fuz/pull/337))
- add `--radius_xs2`
  ([#342](https://github.com/ryanatkn/fuz/pull/342))

## 0.64.0

- **break**: rename `PendingButton` prop `buttonAttrs` to `attrs`
  ([#336](https://github.com/ryanatkn/fuz/pull/336))
- add props `title` and `disabled` to `PendingButton`
  ([#336](https://github.com/ryanatkn/fuz/pull/336))

## 0.63.0

- **break**: upgrade dep `@ryanatkn/belt@0.9.0`
  ([#326](https://github.com/ryanatkn/fuz/pull/326))
- **break**: remove the keyboard shortcut that opens the contextmenu
  ([#315](https://github.com/ryanatkn/fuz/pull/315))
- **break**: remove the helper classes for colors and background colors:
  `.color_bg`, `.color_fg`, `.color_N`, `.bg_color_N`,
  `.bg`, `.fg`, `.bg_N`, `.fg_N`, `.darken_N`, and `.lighten_N`
  ([#324](https://github.com/ryanatkn/fuz/pull/324))
- **break**: change the `.icon_button` size to match `--input_height`
  ([#318](https://github.com/ryanatkn/fuz/pull/318))
- **break**: replace `scoped` behavior of `Themed` with `ThemedScope`, publish it,
  and revamp the API of `Themed`
  ([#317](https://github.com/ryanatkn/fuz/pull/317),
  [#318](https://github.com/ryanatkn/fuz/pull/318))
- **break**: remove `PendingButton` usage of `$$restProps`, use `buttonAttrs` prop instead
  ([#330](https://github.com/ryanatkn/fuz/pull/330))
- fix theme when SSR is disabled
  ([#317](https://github.com/ryanatkn/fuz/pull/317))
- add and publish `@ryanatkn/fuz/CopyToClipboard.svelte`
  ([#318](https://github.com/ryanatkn/fuz/pull/318))
- publish `$lib/prism.css`
  ([#318](https://github.com/ryanatkn/fuz/pull/318))
- add more readable dark mode text colors
  ([#327](https://github.com/ryanatkn/fuz/pull/327))
- add `attrs` prop to `PendingAnimation`
  ([#327](https://github.com/ryanatkn/fuz/pull/327))
- improve `HueInput` a11y
  ([#334](https://github.com/ryanatkn/fuz/pull/334))
- add and publish `$lib/Card.svelte`
  ([#332](https://github.com/ryanatkn/fuz/pull/332))
- publish `@ryanatkn/fuz_code/Code.svelte` and `$lib/prism.css`
  ([#331](https://github.com/ryanatkn/fuz/pull/331))

## 0.62.0

- **break**: remove `Whiteboard`, use `@feltjs/felt-mural` instead
  ([#312](https://github.com/ryanatkn/fuz/pull/312))
- improve prose styles for `ul`, `ol`, and `menu`
  ([#313](https://github.com/ryanatkn/fuz/pull/313))

## 0.61.0

- **break**: rename the `ThemeInput` prop `theme` to `selected_theme`
  and make it and `themes` optional
  ([#310](https://github.com/ryanatkn/fuz/pull/310))

## 0.60.2

- improve defaults of `ColorSchemeInput` and `ThemeInput`
  ([commit](https://github.com/ryanatkn/fuz/commit/3b1d6fb03f25ce0eec4046c2cac993c6dc475d41))

## 0.60.1

- add store defaults for `ColorSchemeInput` and `ThemeInput`
  ([commit](https://github.com/ryanatkn/fuz/commit/5fcf82ae333a5a34e734f190d5050ab760d79729))

## 0.60.0

- **break**: change `Themed` to initialize the color scheme from `localStorage`
  and add helpers `get_color_scheme` and `set_color_scheme`,
  and rename its `sync` prop to `sync_color_scheme`
  ([#308](https://github.com/ryanatkn/fuz/pull/308))
- **break**: rename the `ColorSchemeInput` prop `color_scheme` to `selected_color_scheme`
  to match `ThemeInput`
  ([#308](https://github.com/ryanatkn/fuz/pull/308))

## 0.59.0

- **break**: remove `Dialog` `.pane` wrapper
  ([#307](https://github.com/ryanatkn/fuz/pull/307))
- **break**: remove the `max-width` of `.pane`
  ([#307](https://github.com/ryanatkn/fuz/pull/307))
- fix dialog and contextmenu stacking
  ([#307](https://github.com/ryanatkn/fuz/pull/307))

## 0.58.1

- fix the `.chip` background
  ([commit](https://github.com/ryanatkn/fuz/commit/4c82f4f7fa8b7687ee304b5ac45fb1dfbdd0a957))

## 0.58.0

- **break**: remove root exports, change to supporting only full paths
  ([commit](https://github.com/ryanatkn/fuz/commit/299ceae2dd08393f2e75038638593ea7547da7df))

## 0.57.0

- **break**: tweak some styles and components
  ([#306](https://github.com/ryanatkn/fuz/pull/306))
  - make `ColorSchemeInput` sync by default
  - rename `--button_color` to `--button_bg`, `--button_hover` to `--button_bg_hover`,
    `--button_active` to `--button_bg_active`, and `--button_disabled` to `--button_bg_disabled`
  - replace `--icon_X` with `--icon_size_X`
  - add `enable_editing` to `ThemeInput`
  - add `.formatted` CSS helper class
  - add `.chip` CSS helper class
  - add `.spaced`, `.unspaced`, and `.unspaced_hz` CSS helper classes

## 0.56.0

- **break**: add support for dark mode and systems for color-scheme and theme
  ([#247](https://github.com/ryanatkn/fuz/pull/247))
  - add and publish `$lib/theme.css` - default usage imports it alongside `$lib/style.css`
  - add and publish `$lib/theme.ts` with `create_theme_setup_script` for setting up the color scheme
  - add and publish `$lib/themes.ts` with the default theme data,
    including the base theme along with low and high contrast themes
  - add and publish `$lib/variables.ts` with the default `StyleVariable` data
  - add and publish `$lib/Themed.svelte` for mounting a theme to the page or a part of it
  - add and publish `$lib/ColorSchemeInput.svelte`
  - remove the `error` param from `createContextmenu` and add the `contextmenu.error` store
  - rename `.prose` from `.markup`
  - replace `--active_color` and `--active_color_b_5` with `--color_N`
  - rename `--button_color_X` to `--button_X`, `--border_color_X` to `--border_X`,
    and `--link_color_X` to `--link_X`
  - replace `--text_color_light` and `--text_color_lighter` with
    `--text_2` and `--text_3`, and add `--text_1`
  - replace `--green`, `--blue`, `--purple`, `--orange`, `--red`, `--brown`,
    and `--pink` with `--color_N`
  - replace `--border_color_darker`, `--border_color_dark`, `--border_color_medium`,
    `--border_color_light`, and `--border_color_lighter` with `--border_color_N`
  - replace `--icon_size_X` with `--icon_X` (reverted in 0.57.0)
  - remove `--color_N_lightness` and `--color_N_saturation`
  - rename `--color_N_hue` to `--hue_N`
  - remove `--black` and its pieces
  - remove `--error_color` and `--help_color`
  - remove `--tint_lightness`, `--tint_lightness_N`, `--tint_light`, `--tint_lighter`,
    `--tint_darker`, and `--tint_overlay`, use `--bg_X` and `--fg_X` instead
  - remove `--border_style_N`, `--border_alert`, and `--border_help`
  - remove `--active_saturation_bg_light`, `--active_lightness_bg_light`, `--active_alpha_bg_light`
  - remove `.centered-hz`, use `.box.row` instead
  - remove `--shadow`
  - remove `--button_color_dark`, `--button_color_darker`,
    `--button_color_light`, and `--button_color_lighter`
  - remove `--overlay_bg` and add `--dialog_bg` to the `Dialog` component
  - rename `--input_bg` from `--input_bg_color`
  - rename `.centered-text` to `.text_align_center`
  - remove `.plain-button`, use `.plain` on `button` instead
  - rename `.w-full` to `.width_full` and `.h-full` to `.height_full`
  - snake_case `.padded-X` to `.p_X` and `.icon-button` to `.icon_button`
  - rename `--shadow_dark` and `--shadow_dark` to `--shadow_lg`
    and `--shadow_lg`
  - drop the `font_` from `--font_size_X` (later changed to `size_`, see below)
  - rename `.column` to `.width_md` and `.column-sm` to `.width_sm`
  - rename `--column_width` to `--distance_md` and `--column_width_sm` to `--distance_sm`
  - rename `--link_text_decoration` to `--text_decoration` and
    `--link_text_decoration_X` to `--text_decoration_X`
  - rename `DialogData` to `DialogParams`
  - add `--fg` and `--fg_N`
  - add `--bg_N`
  - rename `.centered` to `.box`
  - add `.wrap` and `.nowrap` (the former is flexbox, the latter is text)
  - add `.text_align_right`
  - add `--outline_width_1` to accompany 2 and 3
- **break**: more style changes
  ([#304](https://github.com/ryanatkn/fuz/pull/304))
  - publish `$lib/ThemeInput.svelte`
  - rename `--font_X` to `--size_X`
  - rename `--input_padding_v` to `--input_padding_y` and
    `--input_padding_h` to `--input_padding_x` to disambiguate the `h`
    being "horizontal" versus the incorrect but similar "height"
  - change borders to use alpha so they stack with backgrounds

## 0.55.1

- fix root exports
  ([commit](https://github.com/ryanatkn/fuz/commit/62da32e4e48e2d51d95ee413d2585e87a8146036))

## 0.55.0

- **break**: change root exports to include no Svelte files,
  requiring the restructuring of `contextmenu` component dependencies
  ([#302](https://github.com/ryanatkn/fuz/pull/302))
- **break**: rename `ContextmenuLink.svelte` to `ContextmenuLinkEntry.svelte`
  ([#302](https://github.com/ryanatkn/fuz/pull/302))

## 0.54.2

- add `--whiteboard_bg` to replace the `Whiteboard`'s usage of `--bg`
  ([#300](https://github.com/ryanatkn/fuz/pull/300))
- fix contextmenu reactivity, support contextmenu component duplicates, and add `.chevron`
  ([#299](https://github.com/ryanatkn/fuz/pull/299))
- add and export `ContextmenuActionParams` type
  ([#298](https://github.com/ryanatkn/fuz/pull/298))

## 0.54.1

- add contextmenu and `.menu-item`
  ([#293](https://github.com/ryanatkn/fuz/pull/293))
- relax the type of `Dialog`'s `close` from `MouseEvent` to `Event`
  ([#295](https://github.com/ryanatkn/fuz/pull/295))

## 0.54.0

- **break**: improve dialog types, remove the dialog schema, and add the type-safe `toDialogData`
  ([#294](https://github.com/ryanatkn/fuz/pull/294))
- upgrade deps
  ([#294](https://github.com/ryanatkn/fuz/pull/294))

## 0.53.0

- **break**: upgrade deps
  ([#291](https://github.com/ryanatkn/fuz/pull/291))

## 0.52.2

- change the `Dialog` `close` event param to be optional
  ([commit](https://github.com/ryanatkn/fuz/commit/0e1902c162e3da6730c86e68c6d2987118f50691))

## 0.52.1

- add `close` to `Dialog` slot
  ([commit](https://github.com/ryanatkn/fuz/commit/4de4ef0ab766dd2104817a68ab9fd21842378862))

## 0.52.0

- **break**: rename `purple` CSS variables from `violet`, because of the overlap with `pink`
  ([#289](https://github.com/ryanatkn/fuz/pull/289))
- add syntax highlighting to the library on the website
  ([#288](https://github.com/ryanatkn/fuz/pull/288))

## 0.51.1

- style the `option` element
  ([commit](https://github.com/ryanatkn/fuz/commit/8bf30d8d54982d711480f3ab9222d0825368aaac))

## 0.51.0

- **break**: upgrade to Node 18.14
  ([#287](https://github.com/ryanatkn/fuz/pull/287))
- **break**: change `Surface` to default `cancelOnLeave` to `true`
  ([commit](https://github.com/ryanatkn/fuz/commit/9fac84fec3aeb91b74a8a20f08af8dd00cc064b0))

## 0.50.2

- upgrade `@ryanatkn/belt@0.7.5`
  ([commit](https://github.com/ryanatkn/fuz/commit/96bd481228618e07ad206e0148687c320bb9a132))

## 0.50.1

- upgrade `@ryanatkn/belt@0.7.4`
  ([commit](https://github.com/ryanatkn/fuz/commit/c78755d867acb0e0d372afda8be80b7c18904d5a))

## 0.50.0

- **break**: upgrade `@ryanatkn/belt@0.7.3`

## 0.49.1

- add `pointing` to `Surface`
  ([commit](https://github.com/ryanatkn/fuz/commit/9fe2722d153c7084d0e0d668463c5a263bbdff1f))
- change `Surface` to not block the contextmenu;
  might need to revert and fix mobile some other way
  ([commit](https://github.com/ryanatkn/fuz/commit/9fe2722d153c7084d0e0d668463c5a263bbdff1f))

## 0.49.0

- **break**: upgrade `@ryanatkn/belt@0.6.0`
  ([commit](https://github.com/ryanatkn/fuz/commit/14bf20c5f642588797f1611021899e480632ae9a))
- add pen brush to whiteboard
  ([#286](https://github.com/ryanatkn/fuz/pull/286))

## 0.48.2

- fix radio button style
  ([#285](https://github.com/ryanatkn/fuz/pull/285))

## 0.48.1

- add and publish component `Redirect.svelte`
  ([#284](https://github.com/ryanatkn/fuz/pull/284))

## 0.48.0

- **break**: change `.markup` to apply no `display` property and remove its `width: 100%`
  ([#281](https://github.com/ryanatkn/fuz/pull/281))
- add utility classes `.width_full` and `.height_full`
  ([#281](https://github.com/ryanatkn/fuz/pull/281))

## 0.47.1

- add [the whiteboard sketch](https://www.felt.dev/sketch/whiteboard)
  with the published components `Whiteboard.svelte`, `Surface.svelte`, and `Scaled.svelte`
  ([#269](https://github.com/ryanatkn/fuz/pull/269),
  [#274](https://github.com/ryanatkn/fuz/pull/274))
- style the `aside` element
  ([#275](https://github.com/ryanatkn/fuz/pull/275))
- delete GOVERNANCE.md for the meta-project `@feltjs/felt`'s
  [GOVERNANCE.md](https://github.com/feltjs/felt/blob/main/GOVERNANCE.md)
  ([#278](https://github.com/ryanatkn/fuz/pull/278))

## 0.47.0

- **break**: rename to `@ryanatkn/fuz` and upgrade deps
  ([#271](https://github.com/ryanatkn/fuz/pull/271))

## 0.46.0

- **break**: upgrade deps
  ([#270](https://github.com/ryanatkn/fuz/pull/270))

## 0.45.1

- support stacking dialogs
  ([#268](https://github.com/ryanatkn/fuz/pull/268))
- add `.ellipsis` CSS utility class
  ([#267](https://github.com/ryanatkn/fuz/pull/267))

## 0.45.0

- **break**: move `lib/dialog/` stuff to `lib/`
  ([#264](https://github.com/ryanatkn/fuz/pull/264))

## 0.44.0

- **break**: remove peer dependencies
  ([#263](https://github.com/ryanatkn/fuz/pull/263))

## 0.43.0

- **break**: move all of `ui/` into the base directory
  ([#261](https://github.com/ryanatkn/fuz/pull/261))
- **break**: remove `util/` directory;
  use [`@ryanatkn/belt`](https://github.com/ryanatkn/belt) instead
  ([#260](https://github.com/ryanatkn/fuz/pull/260))
- uncenter the `legend` element
  ([#259](https://github.com/ryanatkn/fuz/pull/259))
- export everything from the root (we can because it's all browser-and-SSR-friendly)

## 0.42.0

- **break**: remove export `util/async.ts` from `index.ts`
  ([#256](https://github.com/ryanatkn/fuz/pull/256))
- **break**: remove `Falsy` from `util/types.ts`
  ([#256](https://github.com/ryanatkn/fuz/pull/256))
- stop truncating unhandled error messages
  ([#258](https://github.com/ryanatkn/fuz/pull/258))

## 0.41.5

- improve default form spacing
  ([#255](https://github.com/ryanatkn/fuz/pull/255))

## 0.41.4

- add default styles for the `legend` element and tweak form layouts
  ([#254](https://github.com/ryanatkn/fuz/pull/254))

## 0.41.3

- add `line-height` to fix `input`, `textarea`, and `select`
  ([#253](https://github.com/ryanatkn/fuz/pull/253))

## 0.41.2

- change `unwrap` to throw a `ResultError` instead of a plain `Error`, forwarding the `result`
  ([#252](https://github.com/ryanatkn/fuz/pull/252))

## 0.41.1

- fix type of log prefixes and suffixes
  ([#246](https://github.com/ryanatkn/fuz/pull/246))

## 0.41.0

- **break**: rename `DevLogger` to `BaseLogger`
  ([#244](https://github.com/ryanatkn/fuz/pull/244))
- **break**: share prefix/suffix state between `Logger` and `SystemLogger` by default
  ([#244](https://github.com/ryanatkn/fuz/pull/244))
- add `Logger.prefixes`, `Logger.suffixes`, `SystemLogger.prefixes`,
  and `SystemLogger.suffixes` for simpler global configuration
  ([#244](https://github.com/ryanatkn/fuz/pull/244))
- tweak styles for `label.row` and `button.inline`
  ([#245](https://github.com/ryanatkn/fuz/pull/245))

## 0.40.1

- no-op republish attempt

## 0.40.0

- **break**: change `Logger` prefixes and suffixes to print the return value of functions
  ([#243](https://github.com/ryanatkn/fuz/pull/243))
- fix scrollbar for `Dialog.svelte`
  ([#242](https://github.com/ryanatkn/fuz/pull/242))

## 0.39.1

- add `null` to the type of the `FeltWindowHost.svelte` `tenant` prop
  ([#241](https://github.com/ryanatkn/fuz/pull/241))

## 0.39.0

- **break**: upgrade SvelteKit peer dep to `>=1.0.0-next.454`
  ([#239](https://github.com/ryanatkn/fuz/pull/239),
  [#237](https://github.com/ryanatkn/fuz/pull/237))
- **break**: require the `tenant` prop for `FeltWindowHost.svelte` instead of autodetecting
  ([#238](https://github.com/ryanatkn/fuz/pull/238))
- add the `target_origin` prop to `FeltWindowHost.svelte`
  ([#238](https://github.com/ryanatkn/fuz/pull/238))
- fix timeout bug in `FeltWindowTenant.svelte`
  ([#238](https://github.com/ryanatkn/fuz/pull/238))
- add `removeUnordered` helper to `util/array.ts`
  ([#240](https://github.com/ryanatkn/fuz/pull/240))

## 0.38.0

- **break**: remove `key` from `FeltWindowHost.svelte` and `FeltWindowTenant.svelte`
  ([#236](https://github.com/ryanatkn/fuz/pull/236))

## 0.37.0

- **break**: implement the basic window host and tenant system
  in `FeltWindowHost.svelte` and
  rename `FeltWindowTenant.svelte` from `FeltWindowGuest.svelte`
  ([#235](https://github.com/ryanatkn/fuz/pull/235))

## 0.36.0

- **break**: overhaul styles
  ([#224](https://github.com/ryanatkn/fuz/pull/224))
  - remove `--input_border_width` - use `--border_width` instead
  - remove `--border` - use each variable directly instead so they can be overidden
  - remove `--icon_max` - use `--icon_size_xl4` instead
  - remove `--button_border_width` and `--button_text_color`
  - rename `--interactive_` variables to `--button_`
  - remove `--interactive_color_active_dark`
  - remove `--avatar_height`
  - remove `--radius_N` for variants `md`/`sm`/`xs`
  - remove `--input_shadow_` variables
  - remove `--panel_color` and `--panel_color_dark`
  - remove `.panel-outset` and `.panel-inset` - use `.panel` instead
  - remove `--panel_inset_shadow`, `--panel_outset_shadow`,
    `--panel_inset_shadow_hover` and `--panel_outset_shadow_hover`
  - remove `--panel_padding`, `--panel_padding_sm`, and `--panel_padding_xs` -- use `--p_X` instead
  - add utility classes `.centered-text`, `.padded-xs`, `.padded-sm`, and `.padded-lg`
  - add `--border_width`
  - add `--input_height_sm`
  - add styles for radio inputs
- bake the golden ratio constants in `util/maths.ts`
  ([#223](https://github.com/ryanatkn/fuz/pull/223))
- bold the `.title` elements in `label` elements
  ([#231](https://github.com/ryanatkn/fuz/pull/231))
- close dialog on mousedown instead of click
  ([#230](https://github.com/ryanatkn/fuz/pull/230))

## 0.35.2

- fix dialog close event to ignore events from elements not in the DOM
  ([#222](https://github.com/ryanatkn/fuz/pull/222))

## 0.35.1

- fix dialog click event propagation
  ([#221](https://github.com/ryanatkn/fuz/pull/221))

## 0.35.0

- **break**: upgrade to Node 18.6 and `@sveltejs/kit@1.0.0-next.382`
  ([#219](https://github.com/ryanatkn/fuz/pull/219),
  [#220](https://github.com/ryanatkn/fuz/pull/220))

## 0.34.0

- **break**: change devmode hotkey to `ctrl+Backtick` and add the `should_toggle` function as a prop
  ([#218](https://github.com/ryanatkn/fuz/pull/218))

## 0.33.0

- **break**: default `a` styles to `display: flex` and `display: inline` inside `.markup`
  ([#216](https://github.com/ryanatkn/fuz/pull/216))
- loosen the type of `Teleport` prop `to` to accept `null`
  ([#217](https://github.com/ryanatkn/fuz/pull/217))

## 0.32.0

- **break**: rename `Breadcrumb.svelte` from `LinkPath.svelte`
  ([#214](https://github.com/ryanatkn/fuz/pull/214))
- **break**: unpublish `GithubLogo.svelte` and `TwitterLogo.svelte`
  ([#213](https://github.com/ryanatkn/fuz/pull/213))
- add `"separator"` slot to `Breadcrumb.svelte`
  ([#214](https://github.com/ryanatkn/fuz/pull/214))

## 0.31.0

- **break**: unset `img` stlye `display` back to the default `inline-block`
  ([#210](https://github.com/ryanatkn/fuz/pull/210))
- **break**: remove padding from `.markup` and add `.padded-md` and `.padded-xl`
  ([#212](https://github.com/ryanatkn/fuz/pull/212))
- update focus styles to use the accent color and a solid border
  ([#209](https://github.com/ryanatkn/fuz/pull/209),
  [#211](https://github.com/ryanatkn/fuz/pull/211))

## 0.30.1

- fix golden ratio values in `util/maths.ts`
  ([#206](https://github.com/ryanatkn/fuz/pull/206))
- add `util/dom.ts` helper `swallow` for stopping events concisely
  ([#208](https://github.com/ryanatkn/fuz/pull/208))
- fix `.centered-hz` to explicitly set row direction
  ([#207](https://github.com/ryanatkn/fuz/pull/207))

## 0.30.0

- **break**: replace `--radius_xl` and `--radius_xl5` with `--radius_xl2` to 5,
  and rename `--radius_xl2` and `radius_xl3` to 2 and 3, respectively
  ([#204](https://github.com/ryanatkn/fuz/pull/204))
- add `fade-in` animation
  ([#205](https://github.com/ryanatkn/fuz/pull/205))

## 0.29.0

- **break**: change `--icon_size` CSS variables a few pixels to match common standards
  ([#202](https://github.com/ryanatkn/fuz/pull/202))
- remove fixed button font size and inherit instead
  ([#201](https://github.com/ryanatkn/fuz/pull/201))

## 0.28.1

- fix `is_editable` to return `false` for checkbox, radio, and range input types
  ([#198](https://github.com/ryanatkn/fuz/pull/198))

## 0.28.0

- **break**: remove `last` from `util/array.ts`
  ([#195](https://github.com/ryanatkn/fuz/pull/195))
- add `--icon_size` which defaults to `--icon_size_md`
  ([#195](https://github.com/ryanatkn/fuz/pull/195))

## 0.27.1

- add `unwrapError` `Result` helper
  ([#194](https://github.com/ryanatkn/fuz/pull/194))
- fix type of `OK` and `NOT_OK`
  ([#194](https://github.com/ryanatkn/fuz/pull/194))

## 0.27.0

- **break**: remove `icons` module exports from root API
  ([#192](https://github.com/ryanatkn/fuz/pull/192))
- add `OK` and `NOT_OK` to `util/result.ts`
  ([#193](https://github.com/ryanatkn/fuz/pull/193))

## 0.26.0

- **break**: remove CSS variables `--border_style_v`, `--border_style_h`,
  `--border_style_disabled`, `--button_border_style`,
  `--button_border_v_style_disabled`, `--button_border_h_style_disabled`,
  and `--input_border_style`
  ([#191](https://github.com/ryanatkn/fuz/pull/191))
- make `PendingButton.svelte` type `"button"` and disable when pending
  ([#190](https://github.com/ryanatkn/fuz/pull/190))
- improve styles of disabled buttons and inputs
  ([#190](https://github.com/ryanatkn/fuz/pull/190))

## 0.25.1

- add `toGraphemeCount` to `util/string.ts`
  ([#189](https://github.com/ryanatkn/fuz/pull/189))

## 0.25.0

- **break**: remove the `ok` `Result` helper
  ([#188](https://github.com/ryanatkn/fuz/pull/188))
- change the `unwrap` `Result` helper to make `value` optional
  ([#188](https://github.com/ryanatkn/fuz/pull/188))

## 0.24.0

- **break**: rename `--duration_N` CSS variables from `--transition_duration_N` and add `--duration_6`
  ([#186](https://github.com/ryanatkn/fuz/pull/186))
- add `--animation_duration` API to `PendingAnimation.svelte`
  ([#186](https://github.com/ryanatkn/fuz/pull/186))
- relax `is_editable` type in `util/dom.js`
  ([#187](https://github.com/ryanatkn/fuz/pull/187))

## 0.23.0

- **break**: remove all `Promise` behavior from `toObtainable` because it's too error prone
  ([#185](https://github.com/ryanatkn/fuz/pull/185))
- style `summary` elements
  ([#183](https://github.com/ryanatkn/fuz/pull/183))

## 0.22.1

- add `Dialog` `layout` option
  ([#179](https://github.com/ryanatkn/fuz/pull/179))
- add `dialog_props` to `DialogData`
  ([#179](https://github.com/ryanatkn/fuz/pull/179))
- add new module `util/result.js` and move `Result` and `unwrap` from `util/types.js` to it,
  and add the new `ok` `Result` helper
  ([#178](https://github.com/ryanatkn/fuz/pull/178))
- add optional `random` arg that defaults to `Math.random` to each function in `util/random.js`
  ([#178](https://github.com/ryanatkn/fuz/pull/178))
- add optional `"icon"` slot to `Message.svelte`
  ([#178](https://github.com/ryanatkn/fuz/pull/178))
- improve env handling for log level
  ([#180](https://github.com/ryanatkn/fuz/pull/180))
- add `index` to `PendingAnimation` slot props
  ([#181](https://github.com/ryanatkn/fuz/pull/181))

## 0.22.0

- **break**: remove `font_weight` CSS variables
  ([#175](https://github.com/ryanatkn/fuz/pull/175))
- **break**: rename `util/print.ts` `printString` from `printStr`
  ([#174](https://github.com/ryanatkn/fuz/pull/174))
- improve value formatting in `util/print.ts`
  ([#174](https://github.com/ryanatkn/fuz/pull/174))
- add `traverse` helper to `util/object.ts`
  ([#173](https://github.com/ryanatkn/fuz/pull/173))

## 0.21.0

- **break**: change `DialogDataSchema` path to absolute
  ([#172](https://github.com/ryanatkn/fuz/pull/172))

## 0.20.0

- **break**: rename schema export `DialogDataSchema` from `DialogState`
  ([#170](https://github.com/ryanatkn/fuz/pull/170))

## 0.19.0

- **break**: move `dialog/Dialog.svelte` from `Dialog.svelte`
  ([#169](https://github.com/ryanatkn/fuz/pull/169))
- add and publish `dialog/Dialogs.svelte` and `dialog/dialog.ts`
  ([#169](https://github.com/ryanatkn/fuz/pull/169))

## 0.18.0

- **break**: remove `util/terminal.js` because it evolved into
  just re-exporting `kleur` with one additional helper
  ([#167](https://github.com/ryanatkn/fuz/pull/167))
- **break**: remove `util/equal.js` and the `dequal` dependency
  ([#167](https://github.com/ryanatkn/fuz/pull/167))
- **break**: rename `util/maths.js` from `util/math.js` and `mix` to `lerp`
  ([#168](https://github.com/ryanatkn/fuz/pull/168))
- add `clamp` to `util/maths.js`
  ([#168](https://github.com/ryanatkn/fuz/pull/168))

## 0.17.0

- **break**: rename `.column-min` to `.column-sm` and `--column_width_min` to `--column_width_sm`
  and remove `min-width` of `.column`/`.column-sm`
  ([#164](https://github.com/ryanatkn/fuz/pull/164))
- **break**: remove `util/lock.js`
  ([#165](https://github.com/ryanatkn/fuz/pull/165))

## 0.16.0

- **break**: rename `DevmodeControls.svelte` from `Devmode.svelte` and remove toggle button
  ([#159](https://github.com/ryanatkn/fuz/pull/159))
- **break**: remove opinionated layout CSS on the `html` and `body` elements
  ([#155](https://github.com/ryanatkn/fuz/pull/155))
- **break**: replace `--pane_shadow` with `--shadow` and `--shadow_dark`
  ([#161](https://github.com/ryanatkn/fuz/pull/161))
- add CSS variables `--transition_duration_1` to `--transition_duration_5`
  that get disabled with `prefers-reduced-motion`
  ([#163](https://github.com/ryanatkn/fuz/pull/163))

## 0.15.2

- add and publish `HueInput.svelte`
  ([#156](https://github.com/ryanatkn/fuz/pull/156))

## 0.15.1

- remove scrollbar padding hack that caused a visual error on some browsers
  ([#153](https://github.com/ryanatkn/fuz/pull/153))

## 0.15.0

- **break**: remove most of `icons.ts`
  ([#148](https://github.com/ryanatkn/fuz/pull/148))
- export `GithubLogo.svelte` and `TwitterLogo.svelte`
  ([#150](https://github.com/ryanatkn/fuz/pull/150))
- add reusable `.pane` CSS class
  ([#152](https://github.com/ryanatkn/fuz/pull/152))

## 0.14.1

- fix `LinkPath.svelte` to account for base path and make its props optional
  ([#145](https://github.com/ryanatkn/fuz/pull/145))
- add `.pixelated` utility class to `style.css`
  ([#146](https://github.com/ryanatkn/fuz/pull/146))

## 0.14.0

- **break**: unset `overflow` global styles and remove `main` element styles
  ([#141](https://github.com/ryanatkn/fuz/pull/141))
- **break**: remove `wrap` from `util/async.ts`
  ([#139](https://github.com/ryanatkn/fuz/pull/139))
- publish `LinkPath.svelte`
  ([#143](https://github.com/ryanatkn/fuz/pull/143))
- add `--text_color` to `body` element style
  ([#142](https://github.com/ryanatkn/fuz/pull/142))
- prefer `system-ui` font family
  ([#142](https://github.com/ryanatkn/fuz/pull/142))

## 0.13.0

- **break**: replace `Markup.svelte` component with class `.markup` in `style.css`
  ([#138](https://github.com/ryanatkn/fuz/pull/138))
- add `.column-min` css class for half-width layouts
  ([#137](https://github.com/ryanatkn/fuz/pull/137))

## 0.12.0

- **break**: rename `Teleport.svelte` from `Portal.svelte`
  ([#136](https://github.com/ryanatkn/fuz/pull/136))
- **break**: update styles
  ([#136](https://github.com/ryanatkn/fuz/pull/136))
- **break**: change `PendingAnimation` property `paused` to `running`
  ([#136](https://github.com/ryanatkn/fuz/pull/136))
- add optional `separator` arg to `toToClientId`
  ([#136](https://github.com/ryanatkn/fuz/pull/136))
- graduate to pre-alpha status
  ([#136](https://github.com/ryanatkn/fuz/pull/136))

## 0.11.0

- **break**: upgrade deps
  ([#133](https://github.com/ryanatkn/fuz/pull/133))
- **break**: update styles
  ([#133](https://github.com/ryanatkn/fuz/pull/133))
- **break**: change `kleur` exports to match original signatures now that we dropped `snake_case`
  ([#133](https://github.com/ryanatkn/fuz/pull/133))
- fix `unwrap` type
  ([#135](https://github.com/ryanatkn/fuz/pull/135))

## 0.10.0

- **break**: rename `Dialog` from `Modal`
  ([#134](https://github.com/ryanatkn/fuz/pull/134))

## 0.9.0

- **break**: rename to `camelCase` from `snake_case`
  ([#131](https://github.com/ryanatkn/fuz/pull/131))
- add and publish `Dialog.svelte` and `Teleport.svelte`
  ([#127](https://github.com/ryanatkn/fuz/pull/127))
- add and publish `FeltWindowHost.svelte` and `FeltWindowGuest.svelte`
  ([#128](https://github.com/ryanatkn/fuz/pull/128))

## 0.8.1

- add and publish `PendingButton.svelte`
  ([#125](https://github.com/ryanatkn/fuz/pull/125))

## 0.8.0

- **break**: rename to `PascalCase` from `ProperSnakeCase`
  ([#120](https://github.com/ryanatkn/fuz/pull/120))

## 0.7.0

- **break**: require Node >=16.6.0
  ([#116](https://github.com/ryanatkn/fuz/pull/116))
- update styles
  ([#115](https://github.com/ryanatkn/fuz/pull/115))

## 0.6.0

- **break**: rename and add exports in `icons.ts`
  ([#108](https://github.com/ryanatkn/fuz/pull/108))
- **break**: add peer deps `svelte` and `@sveltejs/kit`
  ([#112](https://github.com/ryanatkn/fuz/pull/112))
- update `PendingAnimation.svelte` with slot content and `running` prop
  ([#108](https://github.com/ryanatkn/fuz/pull/108))
- replace `Message.svelte` prop `text` with a slot
  ([#108](https://github.com/ryanatkn/fuz/pull/108))
- publish `Message.svelte`
  ([#108](https://github.com/ryanatkn/fuz/pull/108))

## 0.5.5

- update `style.css`
  ([#102](https://github.com/ryanatkn/fuz/pull/102))

## 0.5.4

- publish `util/randomSeeded.ts`
  ([#106](https://github.com/ryanatkn/fuz/pull/106))

## 0.5.3

- add `util/randomSeeded.ts` using
  [code from Johannes Baagøe'](https://github.com/nquinlan/better-random-numbers-for-javascript-mirror)
  ([#103](https://github.com/ryanatkn/fuz/pull/103))

## 0.5.2

- update `style.css`
  ([#101](https://github.com/ryanatkn/fuz/pull/101))

## 0.5.1

- publish `util/dom.ts` and `util/regexp.ts`
  ([#99](https://github.com/ryanatkn/fuz/pull/99))
- update `style.css`
  ([#100](https://github.com/ryanatkn/fuz/pull/100))

## 0.5.0

- **break**: merge `util/uuid.ts` into `util/id.ts`
  ([#96](https://github.com/ryanatkn/fuz/pull/96))
- add `util/id.ts` and `util/counter.ts`
  ([#96](https://github.com/ryanatkn/fuz/pull/96))
- update `style.css`
  ([#95](https://github.com/ryanatkn/fuz/pull/95))
- publish `devmode.ts` and `Devmode.svelte`
  ([#98](https://github.com/ryanatkn/fuz/pull/98))

## 0.4.5

- update `style.css`
  ([#94](https://github.com/ryanatkn/fuz/pull/94))

## 0.4.4

- publish `style.css` and `Markup.svelte`
  ([#93](https://github.com/ryanatkn/fuz/pull/93))

## 0.4.3

- fix published types
  ([#92](https://github.com/ryanatkn/fuz/pull/92))

## 0.4.2

- publish component `PendingAnimation.svelte`
  ([#91](https://github.com/ryanatkn/fuz/pull/91))

## 0.4.1

- export `AsyncStatus` and `wait` from root
  ([#89](https://github.com/ryanatkn/fuz/pull/89))

## 0.4.0

- **break**: remove camelCase terminal color exports and rename `color_bg` from `bg_color`
  ([#88](https://github.com/ryanatkn/fuz/pull/88))
- **break**: rename `avocado` from `avacado` 🥑
  ([#88](https://github.com/ryanatkn/fuz/pull/88))
- add `randomBool` to `util/random.ts`
  ([#88](https://github.com/ryanatkn/fuz/pull/88))
- change `randomItem` return type to exclude `undefined`
  ([#88](https://github.com/ryanatkn/fuz/pull/88))
- upgrade Gro to 0.28.2
  ([#87](https://github.com/ryanatkn/fuz/pull/87))

## 0.3.0

- **break**: swap the names of `spawn` and `spawnProcess`
  ([#63](https://github.com/ryanatkn/fuz/pull/63))
- **break**: rename `spawnRestartableProcess` from `createRestartableProcess`
  and remove its `delay` arg
  ([#63](https://github.com/ryanatkn/fuz/pull/63))
- **break**: rename `util/timings.ts` from `util/time.ts`
  ([#63](https://github.com/ryanatkn/fuz/pull/63))
- **break**: rename `Timings.get_all` from `Timings.getAll`
  ([#63](https://github.com/ryanatkn/fuz/pull/63))
- upgrade Gro to 0.28.1
  ([#63](https://github.com/ryanatkn/fuz/pull/63))

## 0.2.2

- fix another issue with published types
  ([#86](https://github.com/ryanatkn/fuz/pull/86))

## 0.2.1

- fix published types
  ([#86](https://github.com/ryanatkn/fuz/pull/86))

## 0.2.0

- **break**: convert to `snake_case` from `camelCase`
  ([#50](https://github.com/ryanatkn/fuz/pull/50))
- **break**: rename `src/util` from `src/utils`
  ([#56](https://github.com/ryanatkn/fuz/pull/56))
- add first pass at onboarding sketch
  ([#32](https://github.com/ryanatkn/fuz/pull/32))

## 0.1.4

- update Gro and publish with its new strategy
  ([#31](https://github.com/ryanatkn/fuz/pull/31))

## 0.1.3

- move utils from `@ryanatkn/gro`
  ([#30](https://github.com/ryanatkn/fuz/pull/30))

## 0.1.2

- remove remaining Svelte components from public API until the full process is ready
  ([#29](https://github.com/ryanatkn/fuz/pull/29))

## 0.1.1

- remove `Nav.svelte` from the public API
  ([#27](https://github.com/ryanatkn/fuz/pull/27))

## 0.1.0

- publish
  ([#19](https://github.com/ryanatkn/fuz/pull/19))
