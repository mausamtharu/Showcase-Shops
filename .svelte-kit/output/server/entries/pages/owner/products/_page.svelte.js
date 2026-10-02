import { S as attr, a as head, c as stringify, i as ensure_array_like, r as derived, t as attr_class, w as escape_html } from "../../../../chunks/server.js";
import { r as formatPrice } from "../../../../chunks/utils2.js";
import "../../../../chunks/forms.js";
//#region src/routes/owner/products/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let searchQuery = "";
		const filteredProducts = derived(() => data.products.filter((p) => {
			const query = searchQuery.toLowerCase().trim();
			if (!query) return true;
			return p.name.toLowerCase().includes(query) || p.sku && p.sku.toLowerCase().includes(query) || p.categoryName && p.categoryName.toLowerCase().includes(query);
		}));
		const totalActive = derived(() => data.products.filter((p) => p.isActive).length);
		const lowStockCount = derived(() => data.products.filter((p) => p.stock <= 5).length);
		head("zmgcpx", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Product Inventory — Owner Panel</title>`);
			});
		});
		$$renderer.push(`<div class="p-6 md:p-10 max-w-7xl mx-auto space-y-8"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><div class="flex items-center gap-2 mb-1"><h1 class="font-heading font-bold text-2xl md:text-3xl text-white">Product Inventory</h1> `);
		if (data.shop) $$renderer.push(`<!--[0--><span class="text-xs px-2.5 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/30">${escape_html(data.shop.name)}</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <p class="text-xs md:text-sm text-white/50">Manage items, stock counts, pricing, and live catalog visibility</p></div> <a href="/owner/products/new" class="btn btn-primary inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider py-3 px-5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add New Product</a></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4"><div class="card p-5 border border-white/10 bg-surface"><div class="text-xs uppercase tracking-wider text-white/50 font-medium">Total Catalog</div> <div class="text-2xl font-bold font-mono text-white mt-1">${escape_html(data.products.length)}</div></div> <div class="card p-5 border border-white/10 bg-surface"><div class="text-xs uppercase tracking-wider text-white/50 font-medium">Live On Storefront</div> <div class="text-2xl font-bold font-mono text-green-400 mt-1">${escape_html(totalActive())}</div></div> <div class="card p-5 border border-white/10 bg-surface"><div class="text-xs uppercase tracking-wider text-white/50 font-medium">Low Stock Warning (≤ 5)</div> <div${attr_class(`text-2xl font-bold font-mono ${lowStockCount() > 0 ? "text-amber-400" : "text-white/40"} mt-1`)}>${escape_html(lowStockCount())}</div></div></div> <div class="card border border-white/10 overflow-hidden bg-surface"><div class="p-4 border-b border-white/10 flex items-center justify-between gap-4"><div class="relative w-full max-w-sm"><input type="text"${attr("value", searchQuery)} placeholder="Search products by title, SKU, category..." class="input text-xs py-2 pl-9 pr-4"/> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div> <span class="text-xs text-white/40 hidden sm:block">Showing ${escape_html(filteredProducts().length)} of ${escape_html(data.products.length)} items</span></div> <div class="overflow-x-auto"><table class="w-full text-left text-sm text-white/70"><thead class="text-xs uppercase tracking-wider bg-white/[0.02] border-b border-white/5 text-white/50"><tr><th class="py-3.5 px-4 font-semibold">Product</th><th class="py-3.5 px-4 font-semibold">Category</th><th class="py-3.5 px-4 font-semibold">Price</th><th class="py-3.5 px-4 font-semibold">Stock</th><th class="py-3.5 px-4 font-semibold">Status</th><th class="py-3.5 px-4 font-semibold text-right">Actions</th></tr></thead><tbody class="divide-y divide-white/5 font-sans">`);
		if (filteredProducts().length === 0) $$renderer.push(`<!--[0--><tr><td colspan="6" class="p-8 text-center text-white/40 text-xs">No products match your search.</td></tr>`);
		else {
			$$renderer.push(`<!--[-1--><!--[-->`);
			const each_array = ensure_array_like(filteredProducts());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let p = each_array[$$index];
				$$renderer.push(`<tr class="hover:bg-white/[0.02] transition-colors"><td class="py-4 px-4"><div class="flex items-center gap-3"><img${attr("src", p.imageUrl || "/placeholder.png")}${attr("alt", p.name)} class="w-12 h-12 rounded-lg object-cover bg-surface-2 border border-white/5 shrink-0"/> <div class="min-w-0"><div class="font-medium text-white text-sm truncate max-w-xs hover:text-gold transition-colors"><a${attr("href", `/products/${stringify(p.id)}`)} target="_blank">${escape_html(p.name)}</a></div> <div class="text-[11px] font-mono text-white/40">SKU: ${escape_html(p.sku || "N/A")}</div></div></div></td><td class="py-4 px-4 text-xs text-white/70 whitespace-nowrap">${escape_html(p.categoryName || "Uncategorized")}</td><td class="py-4 px-4 text-xs font-mono whitespace-nowrap"><div class="text-white font-semibold">${escape_html(formatPrice(p.discountPrice ?? p.price))}</div> `);
				if (p.discountPrice) $$renderer.push(`<!--[0--><div class="line-through text-white/40 text-[10px]">${escape_html(formatPrice(p.price))}</div>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></td><td class="py-4 px-4 text-xs whitespace-nowrap">`);
				if (p.stock <= 0) $$renderer.push(`<!--[0--><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400">Out of Stock</span>`);
				else if (p.stock <= 5) $$renderer.push(`<!--[1--><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 font-mono">${escape_html(p.stock)} left (Low)</span>`);
				else $$renderer.push(`<!--[-1--><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 font-mono">${escape_html(p.stock)} in stock</span>`);
				$$renderer.push(`<!--]--></td><td class="py-4 px-4 text-xs whitespace-nowrap"><form method="POST" action="?/toggleStatus"><input type="hidden" name="id"${attr("value", p.id)}/> <input type="hidden" name="currentStatus"${attr("value", String(p.isActive))}/> <button type="submit"${attr_class(`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${p.isActive ? "bg-gold/10 border-gold/40 text-gold hover:bg-gold/20" : "bg-white/5 border-white/10 text-white/40 hover:text-white"}`)}>${escape_html(p.isActive ? "Active" : "Draft")}</button></form></td><td class="py-4 px-4 text-right whitespace-nowrap"><div class="flex items-center justify-end gap-2"><a${attr("href", `/owner/products/${stringify(p.id)}/edit`)} class="p-2 text-white/50 hover:text-gold transition-colors" title="Edit product"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></a> <a${attr("href", `/products/${stringify(p.id)}`)} target="_blank" class="p-2 text-white/50 hover:text-gold transition-colors" title="View on store"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></a> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", p.id)}/> <button type="submit" class="p-2 text-white/40 hover:text-red-400 transition-colors" title="Delete product"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button></form></div></td></tr>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></tbody></table></div></div></div>`);
	});
}
//#endregion
export { _page as default };
