import * as server from '../entries/pages/account/wishlist/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/account/wishlist/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/account/wishlist/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.oUCHA-4m.js","_app/immutable/chunks/BPK6X1w-.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/C5oyGHFL.js","_app/immutable/chunks/9xWPsXA6.js","_app/immutable/chunks/C0dqIgtQ.js","_app/immutable/chunks/DUqivwNY.js"];
export const stylesheets = [];
export const fonts = [];
