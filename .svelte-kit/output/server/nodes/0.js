import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.CthE0bIA.js","_app/immutable/chunks/BPK6X1w-.js","_app/immutable/chunks/93_DP2pG.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BPX1a_3K.js","_app/immutable/chunks/Cw1ybCL5.js","_app/immutable/chunks/C5oyGHFL.js","_app/immutable/chunks/9xWPsXA6.js","_app/immutable/chunks/C-2beRWQ.js","_app/immutable/chunks/C0dqIgtQ.js","_app/immutable/chunks/DUqivwNY.js"];
export const stylesheets = ["_app/immutable/assets/0.CtPqFIS2.css"];
export const fonts = [];
