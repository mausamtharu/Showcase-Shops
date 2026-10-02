import * as server from '../entries/pages/demo/better-auth/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/demo/better-auth/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/demo/better-auth/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.kjgHVL9Q.js","_app/immutable/chunks/BPK6X1w-.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/D0C1_HAG.js","_app/immutable/chunks/93_DP2pG.js","_app/immutable/chunks/Cw1ybCL5.js"];
export const stylesheets = [];
export const fonts = [];
