import {test, assert} from 'vitest';
import {mdz_parse} from '$lib/mdz.js';
import {MdzStreamParser} from '$lib/mdz_stream_parser.js';
import {mdz_opcodes_to_nodes} from '$lib/mdz_opcodes_to_nodes.js';

const input = 'Visit HTTPS://fuz.dev for details.';
for (let cs = 2; cs <= 16; cs++) {
  test(`chunk_size=${cs}`, () => {
    const p = new MdzStreamParser();
    for (let i = 0; i < input.length; i += cs) p.feed(input.slice(i, i + cs));
    p.finish();
    const streamed = mdz_opcodes_to_nodes(p.take_opcodes());
    const oneShot = mdz_parse(input);
    if (JSON.stringify(streamed) !== JSON.stringify(oneShot)) {
      console.error(`cs=${cs} STREAMED:`, JSON.stringify(streamed));
    }
    assert.deepEqual(streamed, oneShot);
  });
}
