import * as server from '../entries/pages/shop/_slug_/_page.server.ts.js';

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/shop/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/shop/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/23.Bb1jGq1L.js","_app/immutable/chunks/BPK6X1w-.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DbEYwy-X.js","_app/immutable/chunks/C5oyGHFL.js","_app/immutable/chunks/9xWPsXA6.js","_app/immutable/chunks/C0dqIgtQ.js","_app/immutable/chunks/DUqivwNY.js"];
export const stylesheets = [];
export const fonts = [];
