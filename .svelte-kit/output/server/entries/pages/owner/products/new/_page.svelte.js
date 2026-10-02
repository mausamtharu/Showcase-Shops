import { S as attr, a as head, i as ensure_array_like, w as escape_html } from "../../../../../chunks/server.js";
import "../../../../../chunks/forms.js";
//#region src/routes/owner/products/new/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let name = "";
		let price = "";
		let discountPrice = "";
		let stock = "15";
		let categoryId = "";
		let sku = "";
		let description = "";
		let imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80";
		let isFeatured = false;
		let isSubmitting = false;
		let selectedShopId = "";
		head("z77yza", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Add New Product — Owner Panel</title>`);
			});
		});
		$$renderer.push(`<div class="mx-auto max-w-6xl space-y-8 p-6 md:p-10"><div><nav class="mb-2 flex items-center gap-2 text-xs tracking-wider text-white/50 uppercase"><a href="/owner/dashboard" class="hover:text-gold transition-colors">Owner</a> <span>/</span> <a href="/owner/products" class="hover:text-gold transition-colors">Products</a> <span>/</span> <span class="text-white">New Item</span></nav> <div class="flex items-center justify-between"><h1 class="font-heading text-2xl font-bold text-white md:text-3xl">Add New Product</h1> <a href="/owner/products" class="btn btn-secondary text-xs">Cancel &amp; Return</a></div></div> <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"><div class="lg:col-span-8"><form method="POST" class="card bg-surface space-y-6 border border-white/10 p-6 md:p-8"><div class="space-y-1.5"><label for="shopId" class="text-xs font-medium tracking-wider text-white/70 uppercase">Shop *</label> `);
		$$renderer.select({
			id: "shopId",
			name: "shopId",
			value: selectedShopId,
			required: true,
			class: "input text-sm"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(data.shops);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let ownedShop = each_array[$$index];
				$$renderer.option({ value: ownedShop.id }, ($$renderer) => {
					$$renderer.push(`${escape_html(ownedShop.name)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div> <div class="space-y-4"><h2 class="font-heading border-b border-white/10 pb-2 text-base font-semibold text-white">1. General Information</h2> <div class="space-y-1.5"><label for="name" class="text-xs font-medium tracking-wider text-white/70 uppercase">Product Title *</label> <input id="name" name="name" type="text" required=""${attr("value", name)} placeholder="e.g. Master-Crafted Banarasi Silk Kurta" class="input text-sm"/></div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="space-y-1.5"><label for="categoryId" class="text-xs font-medium tracking-wider text-white/70 uppercase">Category</label> `);
		$$renderer.select({
			id: "categoryId",
			name: "categoryId",
			value: categoryId,
			class: "input text-sm"
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`Select Category...`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(data.categories);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let cat = each_array_1[$$index_1];
				$$renderer.option({ value: cat.id }, ($$renderer) => {
					$$renderer.push(`${escape_html(cat.name)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div> <div class="space-y-1.5"><label for="sku" class="text-xs font-medium tracking-wider text-white/70 uppercase">Stock Keeping Unit (SKU)</label> <input id="sku" name="sku" type="text"${attr("value", sku)} placeholder="e.g. RS-SILK-09" class="input font-mono text-sm"/></div></div> <div class="space-y-1.5"><label for="description" class="text-xs font-medium tracking-wider text-white/70 uppercase">Description</label> <textarea id="description" name="description" rows="4" placeholder="Describe materials, heritage craftsmanship, provenance, and specifications..." class="input py-2 text-sm leading-relaxed">`);
		const $$body = escape_html(description);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></div></div> <div class="space-y-4 border-t border-white/10 pt-4"><h2 class="font-heading border-b border-white/10 pb-2 text-base font-semibold text-white">2. Pricing &amp; Inventory</h2> <div class="grid grid-cols-1 gap-4 sm:grid-cols-3"><div class="space-y-1.5"><label for="price" class="text-xs font-medium tracking-wider text-white/70 uppercase">Regular Price (NPR) *</label> <input id="price" name="price" type="number" step="1" min="0" required=""${attr("value", price)} placeholder="25000" class="input font-mono text-sm"/></div> <div class="space-y-1.5"><label for="discountPrice" class="text-xs font-medium tracking-wider text-white/70 uppercase">Discount Price (NPR)</label> <input id="discountPrice" name="discountPrice" type="number" step="1" min="0"${attr("value", discountPrice)} placeholder="21000" class="input font-mono text-sm"/></div> <div class="space-y-1.5"><label for="stock" class="text-xs font-medium tracking-wider text-white/70 uppercase">Initial Stock *</label> <input id="stock" name="stock" type="number" min="0" required=""${attr("value", stock)} class="input font-mono text-sm"/></div></div></div> <div class="space-y-4 border-t border-white/10 pt-4"><h2 class="font-heading border-b border-white/10 pb-2 text-base font-semibold text-white">3. Media &amp; Showcase</h2> <div class="space-y-1.5"><label for="imageUrl" class="text-xs font-medium tracking-wider text-white/70 uppercase">Primary Image URL *</label> <input id="imageUrl" name="imageUrl" type="url" required=""${attr("value", imageUrl)} placeholder="https://images.unsplash.com/..." class="input text-sm"/></div> <label class="flex cursor-pointer items-center gap-3 pt-2"><input type="checkbox" name="isFeatured"${attr("checked", isFeatured, true)} class="text-gold focus:ring-gold bg-surface-2 h-4 w-4 rounded border-white/20"/> <div><span class="text-sm font-medium text-white">Feature in Homepage Showcase</span> <p class="text-xs text-white/50">Displayed in top tier carousel on the main platform landing page</p></div></label></div> <div class="flex justify-end gap-4 border-t border-white/10 pt-6"><a href="/owner/products" class="btn btn-secondary">Cancel</a> <button type="submit"${attr("disabled", isSubmitting, true)} class="btn btn-primary flex items-center gap-2 px-8 font-semibold">`);
		$$renderer.push(`<!--[-1-->Publish to Storefront`);
		$$renderer.push(`<!--]--></button></div></form></div> <div class="sticky top-24 lg:col-span-4"><div class="card bg-surface space-y-4 border border-white/10 p-5"><div class="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-semibold tracking-wider text-white/50 uppercase"><span>Live Storefront Preview</span> <span class="text-gold">Card View</span></div> <div class="bg-surface-2 group overflow-hidden rounded-xl border border-white/10"><div class="relative aspect-square overflow-hidden bg-black/40">`);
		$$renderer.push(`<!--[0--><img${attr("src", imageUrl)} alt="Preview" class="h-full w-full object-cover"/>`);
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="space-y-2 p-4"><div class="text-gold truncate text-[11px] font-semibold tracking-wider uppercase">${escape_html(data.shops.find((ownedShop) => ownedShop.id === selectedShopId)?.name || "Your Boutique")}</div> <h3 class="font-heading line-clamp-1 text-sm font-medium text-white">${escape_html("Product Title Goes Here")}</h3> <div class="flex items-center gap-2 font-mono text-sm"><span class="font-bold text-white">${escape_html("NPR 0")}</span> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="flex items-center justify-between border-t border-white/5 pt-2 text-[11px] text-white/40"><span>Stock: ${escape_html(stock)}</span> <span class="text-green-400">Available</span></div></div></div></div></div></div></div>`);
	});
}
//#endregion
export { _page as default };
