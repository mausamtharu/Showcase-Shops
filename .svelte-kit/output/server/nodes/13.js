import * as server from '../entries/pages/owner/dashboard/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/owner/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/owner/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.6EK-w2z_.js","_app/immutable/chunks/BPK6X1w-.js","_app/immutable/chunks/uBIymjUX.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DUqivwNY.js"];
export const stylesheets = [];
export const fonts = [];
