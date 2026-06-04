import {library_json_from_modules} from '@fuzdev/fuz_util/library_json.js';
import {modules} from 'virtual:svelte-docinfo';
import package_json from 'virtual:pkg.json';

// `virtual:pkg.json` serves the curated `PkgJson` subset, so the full
// `package.json` (scripts, dependencies, devDependencies, config) stays out of
// the client bundle. `library_json_parse` only reads curated fields.
export const library_json = library_json_from_modules(package_json, modules);
