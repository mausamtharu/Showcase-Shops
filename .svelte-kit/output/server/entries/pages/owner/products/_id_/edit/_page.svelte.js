import { C as clsx, S as attr, a as head, i as ensure_array_like, t as attr_class, w as escape_html } from "../../../../../../chunks/server.js";
import "../../../../../../chunks/forms.js";
//#region src/routes/owner/products/[id]/edit/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let name = "";
		let price = "";
		let discountPrice = "";
		let stock = "";
		let categoryId = "";
		let sku = "";
		let description = "";
		let imageUrl = "";
		let isFeatured = false;
		let isSubmitting = false;
		head("1iaryzk", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Edit ${escape_html(data.product.name)} — Owner Panel</title>`);
			});
		});
		$$renderer.push(`<div class="p-6 md:p-10 max-w-6xl mx-auto space-y-8"><div><nav class="flex items-center gap-2 text-xs text-white/50 mb-2 uppercase tracking-wider"><a href="/owner/dashboard" class="hover:text-gold transition-colors">Owner</a> <span>/</span> <a href="/owner/products" class="hover:text-gold transition-colors">Products</a> <span>/</span> <span class="text-white">Edit Item</span></nav> <div class="flex items-center justify-between"><div><h1 class="font-heading font-bold text-2xl md:text-3xl text-white">Edit Product</h1> <p class="text-xs text-white/40 mt-0.5">Modify pricing, inventory levels, or promotional details</p></div> <a href="/owner/products" class="btn btn-secondary text-xs">Cancel &amp; Return</a></div></div> <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"><div class="lg:col-span-8"><form method="POST" class="card p-6 md:p-8 border border-white/10 space-y-6 bg-surface"><div class="space-y-4"><h2 class="font-heading font-semibold text-base text-white border-b border-white/10 pb-2">1. General Information</h2> <div class="space-y-1.5"><label for="name" class="text-xs uppercase tracking-wider text-white/70 font-medium">Product Title *</label> <input id="name" name="name" type="text" required=""${attr("value", name)} class="input text-sm"/></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="space-y-1.5"><label for="categoryId" class="text-xs uppercase tracking-wider text-white/70 font-medium">Category</label> `);
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
			const each_array = ensure_array_like(data.categories);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let cat = each_array[$$index];
				$$renderer.option({ value: cat.id }, ($$renderer) => {
					$$renderer.push(`${escape_html(cat.name)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div> <div class="space-y-1.5"><label for="sku" class="text-xs uppercase tracking-wider text-white/70 font-medium">Stock Keeping Unit (SKU)</label> <input id="sku" name="sku" type="text"${attr("value", sku)} class="input text-sm font-mono"/></div></div> <div class="space-y-1.5"><label for="description" class="text-xs uppercase tracking-wider text-white/70 font-medium">Description</label> <textarea id="description" name="description" rows="4" class="input text-sm py-2 leading-relaxed">`);
		const $$body = escape_html(description);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></div></div> <div class="space-y-4 pt-4 border-t border-white/10"><h2 class="font-heading font-semibold text-base text-white border-b border-white/10 pb-2">2. Pricing &amp; Inventory</h2> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4"><div class="space-y-1.5"><label for="price" class="text-xs uppercase tracking-wider text-white/70 font-medium">Regular Price (NPR) *</label> <input id="price" name="price" type="number" step="1" min="0" required=""${attr("value", price)} class="input text-sm font-mono"/></div> <div class="space-y-1.5"><label for="discountPrice" class="text-xs uppercase tracking-wider text-white/70 font-medium">Discount Price (NPR)</label> <input id="discountPrice" name="discountPrice" type="number" step="1" min="0"${attr("value", discountPrice)} placeholder="Optional" class="input text-sm font-mono"/></div> <div class="space-y-1.5"><label for="stock" class="text-xs uppercase tracking-wider text-white/70 font-medium">Current Stock *</label> <input id="stock" name="stock" type="number" min="0" required=""${attr("value", stock)} class="input text-sm font-mono"/></div></div></div> <div class="space-y-4 pt-4 border-t border-white/10"><h2 class="font-heading font-semibold text-base text-white border-b border-white/10 pb-2">3. Media &amp; Showcase</h2> <div class="space-y-1.5"><label for="imageUrl" class="text-xs uppercase tracking-wider text-white/70 font-medium">Primary Image URL</label> <input id="imageUrl" name="imageUrl" type="url"${attr("value", imageUrl)} class="input text-sm"/></div> <label class="flex items-center gap-3 cursor-pointer pt-2"><input type="checkbox" name="isFeatured"${attr("checked", isFeatured, true)} class="w-4 h-4 rounded text-gold focus:ring-gold bg-surface-2 border-white/20"/> <span class="text-sm font-medium text-white">Feature in Homepage Showcase</span></label></div> <div class="pt-6 border-t border-white/10 flex justify-end gap-4"><a href="/owner/products" class="btn btn-secondary">Cancel</a> <button type="submit"${attr("disabled", isSubmitting, true)} class="btn btn-primary px-8 flex items-center gap-2 font-semibold">`);
		$$renderer.push(`<!--[-1-->Save Changes`);
		$$renderer.push(`<!--]--></button></div></form></div> <div class="lg:col-span-4 sticky top-24"><div class="card p-5 border border-white/10 bg-surface space-y-4"><div class="flex items-center justify-between text-xs text-white/50 uppercase tracking-wider font-semibold pb-2 border-b border-white/10"><span>Live Storefront Preview</span> <span class="text-gold">Card View</span></div> <div class="rounded-xl overflow-hidden border border-white/10 bg-surface-2 group"><div class="aspect-square relative overflow-hidden bg-black/40">`);
		$$renderer.push(`<!--[-1--><div class="w-full h-full flex items-center justify-center text-xs text-white/30">Image Preview</div>`);
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="p-4 space-y-2"><h3 class="font-heading font-medium text-white text-sm line-clamp-1">${escape_html("Product Title Goes Here")}</h3> <div class="flex items-center gap-2 font-mono text-sm"><span class="text-white font-bold">${escape_html("NPR 0")}</span> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="text-[11px] text-white/40 flex items-center justify-between pt-2 border-t border-white/5"><span>Stock: ${escape_html(0)}</span> <span${attr_class(clsx(Number(stock) > 0 ? "text-green-400" : "text-red-400"))}>${escape_html(Number(stock) > 0 ? "In Stock" : "Out of Stock")}</span></div></div></div></div></div></div></div>`);
	});
}
//#endregion
export { _page as default };
