import { S as attr, a as head, c as stringify, i as ensure_array_like, w as escape_html } from "../../../../chunks/server.js";
import "../../../../chunks/forms.js";
//#region src/routes/owner/shop/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let isSubmitting = false;
		head("nhcph5", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Shop Profile — Owner Panel</title>`);
			});
		});
		$$renderer.push(`<div class="mx-auto max-w-4xl space-y-8 p-6 md:p-10"><div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 class="font-heading text-2xl font-bold text-white md:text-3xl">Shop Profile &amp; Branding</h1> <p class="text-xs text-white/50 md:text-sm">Configure your boutique storefront, banners, contact info, and location</p></div> `);
		if (data.shop?.slug) $$renderer.push(`<!--[0--><a${attr("href", `/shop/${stringify(data.shop.slug)}`)} target="_blank" class="btn btn-secondary inline-flex items-center gap-2 text-xs"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> View Live Storefront</a>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">`);
		if (data.shops.length > 1) {
			$$renderer.push(`<!--[0--><form method="GET" class="space-y-1.5"><label for="shop" class="block text-xs tracking-wider text-white/60 uppercase">Manage shop</label> `);
			$$renderer.select({
				id: "shop",
				name: "shop",
				class: "input min-w-64 text-sm",
				value: data.shop?.id,
				onchange: (event) => event.currentTarget.form?.requestSubmit()
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
			$$renderer.push(`</form>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <form method="POST" action="?/createShop" class="flex items-end gap-2"><div class="space-y-1.5"><label for="newShopName" class="block text-xs tracking-wider text-white/60 uppercase">Add another shop</label> <input id="newShopName" name="name" required="" placeholder="New shop name" class="input text-sm"/></div> <button type="submit" class="btn btn-primary text-sm">Add Shop</button></form></div> `);
		if (!data.shop) $$renderer.push(`<!--[0--><div class="card bg-surface border border-white/10 p-12 text-center"><h2 class="text-lg font-semibold text-white">No Shop Registered</h2> <p class="mt-1 text-xs text-white/50">Please register your boutique shop first.</p></div>`);
		else {
			$$renderer.push(`<!--[-1--><form method="POST" class="card bg-surface space-y-6 border border-white/10 p-6 md:p-8"><input type="hidden" name="shopId"${attr("value", data.shop.id)}/> <div class="space-y-4"><h2 class="font-heading border-b border-white/10 pb-2 text-base font-semibold text-white">Boutique Identity</h2> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="space-y-1.5 sm:col-span-2"><label for="name" class="text-xs font-medium tracking-wider text-white/70 uppercase">Boutique Name *</label> <input id="name" name="name" type="text" required=""${attr("value", data.shop.name)} class="input text-sm"/></div> <div class="space-y-1.5 sm:col-span-2"><label for="tagline" class="text-xs font-medium tracking-wider text-white/70 uppercase">Tagline</label> <input id="tagline" name="tagline" type="text"${attr("value", data.shop.tagline || "")} placeholder="e.g. Pure Himalayan Dhaka &amp; Silk Heritage" class="input text-sm"/></div> <div class="space-y-1.5 sm:col-span-2"><label for="description" class="text-xs font-medium tracking-wider text-white/70 uppercase">Story &amp; Description</label> <textarea id="description" name="description" rows="3" class="input py-2 text-sm leading-relaxed">`);
			const $$body = escape_html(data.shop.description || "");
			if ($$body) $$renderer.push(`${$$body}`);
			$$renderer.push(`</textarea></div></div></div> <div class="space-y-4 border-t border-white/10 pt-4"><h2 class="font-heading border-b border-white/10 pb-2 text-base font-semibold text-white">Location &amp; Contact</h2> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="space-y-1.5"><label for="phone" class="text-xs font-medium tracking-wider text-white/70 uppercase">Store Phone</label> <input id="phone" name="phone" type="text"${attr("value", data.shop.phone || "")} placeholder="+977 81 520112" class="input font-mono text-sm"/></div> <div class="space-y-1.5"><label for="location" class="text-xs font-medium tracking-wider text-white/70 uppercase">City / Area</label> <input id="location" name="location" type="text"${attr("value", data.shop.location || "")} placeholder="Nepalgunj, Banke" class="input text-sm"/></div> <div class="space-y-1.5 sm:col-span-2"><label for="address" class="text-xs font-medium tracking-wider text-white/70 uppercase">Physical Address</label> <input id="address" name="address" type="text"${attr("value", data.shop.address || "")} placeholder="Tribhuvan Chowk, Ward No. 2, Nepalgunj" class="input text-sm"/></div></div></div> <div class="space-y-4 border-t border-white/10 pt-4"><h2 class="font-heading border-b border-white/10 pb-2 text-base font-semibold text-white">Branding Media</h2> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="space-y-1.5"><label for="logoUrl" class="text-xs font-medium tracking-wider text-white/70 uppercase">Logo Image URL</label> <input id="logoUrl" name="logoUrl" type="url"${attr("value", data.shop.logoUrl || "")} class="input text-sm"/></div> <div class="space-y-1.5"><label for="bannerUrl" class="text-xs font-medium tracking-wider text-white/70 uppercase">Cover Banner Image URL</label> <input id="bannerUrl" name="bannerUrl" type="url"${attr("value", data.shop.bannerUrl || "")} class="input text-sm"/></div></div></div> <div class="flex justify-end border-t border-white/10 pt-4"><button type="submit"${attr("disabled", isSubmitting, true)} class="btn btn-primary flex items-center gap-2 px-8 font-semibold">`);
			$$renderer.push(`<!--[-1-->Save Profile Changes`);
			$$renderer.push(`<!--]--></button></div></form>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
