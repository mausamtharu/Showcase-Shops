import * as server from '../entries/pages/products/_page.server.ts.js';

export const index = 19;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/products/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/products/+page.server.ts";
export const imports = ["_app/immutable/nodes/19.D0vx9S-T.js","_app/immutable/chunks/BPK6X1w-.js","_app/immutable/chunks/93_DP2pG.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BPX1a_3K.js","_app/immutable/chunks/Cw1ybCL5.js","_app/immutable/chunks/DbEYwy-X.js","_app/immutable/chunks/C5oyGHFL.js","_app/immutable/chunks/9xWPsXA6.js","_app/immutable/chunks/C0dqIgtQ.js","_app/immutable/chunks/DUqivwNY.js"];
export const stylesheets = [];
export const fonts = [];
