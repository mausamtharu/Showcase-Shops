import * as server from '../entries/pages/owner/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/owner/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/owner/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.SfNVnlwt.js","_app/immutable/chunks/BPK6X1w-.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BPX1a_3K.js","_app/immutable/chunks/93_DP2pG.js"];
export const stylesheets = [];
export const fonts = [];
