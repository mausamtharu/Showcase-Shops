import { S as attr, d as html, i as ensure_array_like, l as unsubscribe_stores, n as attr_style, s as store_get, t as attr_class, w as escape_html } from "../../../chunks/server.js";
import { t as page } from "../../../chunks/stores.js";
//#region src/routes/owner/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { children, data } = $$props;
		const navItems = [
			{
				href: "/owner/dashboard",
				label: "Dashboard",
				icon: "grid"
			},
			{
				href: "/owner/products",
				label: "Products",
				icon: "package"
			},
			{
				href: "/owner/orders",
				label: "Orders",
				icon: "file-text"
			},
			{
				href: "/owner/shop",
				label: "Shop Profile",
				icon: "home"
			}
		];
		function isActive(href) {
			return store_get($$store_subs ??= {}, "$page", page).url.pathname === href || store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith(href + "/");
		}
		const icons = {
			grid: "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"/>",
			package: "<line x1=\"16.5\" y1=\"9.4\" x2=\"7.5\" y2=\"4.21\"/><path d=\"M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z\"/><polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"/><line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"/>",
			"file-text": "<path d=\"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/><line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\"/><line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\"/><polyline points=\"10 9 9 9 8 9\"/>",
			home: "<path d=\"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z\"/><polyline points=\"9 22 9 12 15 12 15 22\"/>"
		};
		$$renderer.push(`<div class="min-h-screen flex" style="background: var(--color-black);"><aside class="hidden md:flex flex-col w-64 min-h-screen border-r sticky top-0 h-screen" style="background: var(--color-surface); border-color: var(--color-border);"><div class="p-6 border-b" style="border-color: var(--color-border);"><a href="/" class="flex items-center gap-2"><div class="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-black)"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" fill="none"></path><path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none"></path></svg></div> <div><div class="text-sm font-bold font-heading text-gradient-gold">ShowCase</div> <div class="text-xs" style="color: rgba(250,250,249,0.4);">Owner Panel</div></div></a></div> <nav class="flex-1 p-4 space-y-1"><!--[-->`);
		const each_array = ensure_array_like(navItems);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			$$renderer.push(`<a${attr("href", item.href)} class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"${attr_style(isActive(item.href) ? "background: rgba(212,175,55,0.12); color: var(--color-gold); border: 1px solid rgba(212,175,55,0.2);" : "color: rgba(250,250,249,0.6); border: 1px solid transparent;")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${html(icons[item.icon])}</svg> ${escape_html(item.label)}</a>`);
		}
		$$renderer.push(`<!--]--></nav> <div class="p-4 border-t" style="border-color: var(--color-border);"><a href="/owner/products/new" class="btn btn-primary w-full text-sm"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add Product</a> <a href="/" class="btn btn-ghost w-full text-sm mt-2 text-center">← View Store</a></div></aside> <div class="flex-1 min-w-0 flex flex-col"><header class="md:hidden border-b p-4 flex items-center justify-between sticky top-0 z-30 bg-surface border-white/10"><a href="/" class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-gradient-gold flex items-center justify-center font-bold text-black text-xs">SC</div> <span class="font-heading font-bold text-white text-sm">Owner Panel</span></a> <div class="flex items-center gap-2"><a href="/owner/products/new" class="btn btn-primary btn-sm text-xs py-1.5 px-3">+ Add</a> <a href="/" class="btn btn-secondary btn-sm text-xs py-1.5 px-2.5">Store</a></div></header> <nav class="md:hidden flex items-center justify-around border-b bg-surface-2 border-white/10 p-2 overflow-x-auto text-xs"><!--[-->`);
		const each_array_1 = ensure_array_like(navItems);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let item = each_array_1[$$index_1];
			$$renderer.push(`<a${attr("href", item.href)}${attr_class(`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${isActive(item.href) ? "bg-gold/15 text-gold font-semibold" : "text-white/60 hover:text-white"}`)}>${escape_html(item.label)}</a>`);
		}
		$$renderer.push(`<!--]--></nav> <div class="flex-1">`);
		children($$renderer);
		$$renderer.push(`<!----></div></div></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _layout as default };
