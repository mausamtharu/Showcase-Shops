import * as server from '../entries/pages/owner/shop/_page.server.ts.js';

export const index = 18;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/owner/shop/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/owner/shop/+page.server.ts";
export const imports = ["_app/immutable/nodes/18.CwUySeqb.js","_app/immutable/chunks/BPK6X1w-.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/C0dqIgtQ.js","_app/immutable/chunks/D0C1_HAG.js","_app/immutable/chunks/93_DP2pG.js","_app/immutable/chunks/Cw1ybCL5.js"];
export const stylesheets = [];
export const fonts = [];
