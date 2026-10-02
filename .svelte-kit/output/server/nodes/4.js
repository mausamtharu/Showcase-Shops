import * as server from '../entries/pages/account/orders/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/account/orders/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/account/orders/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.C7wa4ueS.js","_app/immutable/chunks/BPK6X1w-.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DUqivwNY.js"];
export const stylesheets = [];
export const fonts = [];
