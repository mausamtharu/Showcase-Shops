import * as server from '../entries/pages/shops/_page.server.ts.js';

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/shops/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/shops/+page.server.ts";
export const imports = ["_app/immutable/nodes/24.Rlt_10ZH.js","_app/immutable/chunks/BPK6X1w-.js","_app/immutable/chunks/xihTtKlq.js"];
export const stylesheets = [];
export const fonts = [];
