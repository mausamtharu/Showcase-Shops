import { S as attr } from "../../../chunks/server.js";
import { t as resolve } from "../../../chunks/paths.js";
//#region src/routes/demo/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<a${attr("href", resolve("/demo/better-auth"))}>better-auth</a>`);
	});
}
//#endregion
export { _page as default };
