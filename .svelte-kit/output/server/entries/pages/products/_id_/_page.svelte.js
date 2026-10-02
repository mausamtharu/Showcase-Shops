import { S as attr, a as head, c as stringify, i as ensure_array_like, n as attr_style, r as derived, w as escape_html } from "../../../../chunks/server.js";
import { i as formatRelativeTime, r as formatPrice, t as calcDiscount } from "../../../../chunks/utils2.js";
import { t as wishlist } from "../../../../chunks/wishlist.svelte.js";
import { n as StarRating, t as ProductCard } from "../../../../chunks/ProductCard.js";
//#region src/routes/products/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const p = derived(() => data.product);
		let activeImageIdx = 0;
		const allImages = derived(() => data.images.length > 0 ? data.images.map((i) => i.url) : [`https://picsum.photos/seed/${p().id}/600/600`]);
		let selectedVariants = {};
		let quantity = 1;
		const isWishlisted = derived(() => wishlist.isWishlisted(p().id));
		const effectivePrice = derived(() => p().discountPrice ? parseFloat(p().discountPrice) : parseFloat(p().price));
		const discount = derived(() => calcDiscount(p().price, p().discountPrice));
		const ratingDist = [
			{
				stars: 5,
				pct: 62
			},
			{
				stars: 4,
				pct: 21
			},
			{
				stars: 3,
				pct: 10
			},
			{
				stars: 2,
				pct: 4
			},
			{
				stars: 1,
				pct: 3
			}
		];
		head("9lltit", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(p().name)} — ShowCase Shops</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", p().description ?? `Buy ${p().name} from ${p().shopName}`)}/>`);
		});
		$$renderer.push(`<div class="min-h-screen"><div class="container pt-6 pb-2"><div class="flex items-center gap-2 text-sm" style="color: rgba(250,250,249,0.4);"><a href="/" class="hover:text-gold transition-colors">Home</a> <span>/</span> <a href="/products" class="hover:text-gold transition-colors">Products</a> <span>/</span> <span class="truncate max-w-48" style="color: var(--color-white);">${escape_html(p().name)}</span></div></div> <div class="container py-8"><div class="grid grid-cols-1 lg:grid-cols-2 gap-12"><div class="space-y-4"><div class="relative aspect-square rounded-2xl overflow-hidden cursor-zoom-in" style="background: var(--color-surface-2);" role="img"${attr("aria-label", p().name)}><img${attr("src", allImages()[activeImageIdx])}${attr("alt", p().name)} class="w-full h-full object-cover transition-transform duration-300"${attr_style("")}/> `);
		if (discount() > 0) $$renderer.push(`<!--[0--><div class="absolute top-4 left-4"><span class="badge badge-gold text-sm">${escape_html(discount())}% OFF</span></div>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (p().stock === 0) $$renderer.push(`<!--[0--><div class="absolute inset-0 flex items-center justify-center" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);"><span class="badge badge-error text-base px-5 py-2">Out of Stock</span></div>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (allImages().length > 1) {
			$$renderer.push(`<!--[0--><div class="flex gap-3 overflow-x-auto pb-2"><!--[-->`);
			const each_array = ensure_array_like(allImages());
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				let img = each_array[i];
				$$renderer.push(`<button class="shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200"${attr_style(activeImageIdx === i ? "border-color: var(--color-gold);" : "border-color: var(--color-border);")}><img${attr("src", img)}${attr("alt", `Product view ${stringify(i + 1)}`)} class="w-full h-full object-cover"/></button>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="space-y-6">`);
		if (p().shopName) {
			$$renderer.push(`<!--[0--><a${attr("href", `/shop/${stringify(p().shopSlug)}`)} class="inline-flex items-center gap-2 transition-colors duration-200 hover:opacity-80"><div class="w-8 h-8 rounded-lg overflow-hidden" style="background: var(--color-surface-2);">`);
			if (p().shopLogoUrl) $$renderer.push(`<!--[0--><img${attr("src", p().shopLogoUrl)}${attr("alt", p().shopName)} class="w-full h-full object-cover"/>`);
			else $$renderer.push(`<!--[-1--><div class="w-full h-full flex items-center justify-center text-sm">🏪</div>`);
			$$renderer.push(`<!--]--></div> <span class="text-sm font-semibold text-gold">${escape_html(p().shopName)}</span> `);
			if (p().shopLocation) $$renderer.push(`<!--[0--><span class="text-xs" style="color: rgba(250,250,249,0.4);">· ${escape_html(p().shopLocation)}</span>`);
			else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></a>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <h1 class="font-display text-3xl md:text-4xl font-bold leading-tight">${escape_html(p().name)}</h1> `);
		if (p().avgRating && parseFloat(p().avgRating) > 0) {
			$$renderer.push(`<!--[0--><div class="flex items-center gap-3">`);
			StarRating($$renderer, {
				rating: parseFloat(p().avgRating),
				count: p().reviewCount,
				size: "md"
			});
			$$renderer.push(`<!----> <span class="text-sm font-bold text-gold">${escape_html(parseFloat(p().avgRating).toFixed(1))}</span></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex items-end gap-4"><span class="font-bold text-4xl text-gold font-heading">${escape_html(formatPrice(effectivePrice()))}</span> `);
		if (discount() > 0) $$renderer.push(`<!--[0--><div class="flex flex-col"><span class="text-lg line-through" style="color: rgba(250,250,249,0.35);">${escape_html(formatPrice(parseFloat(p().price)))}</span> <span class="text-sm text-green-400 font-semibold">Save ${escape_html(formatPrice(parseFloat(p().price) - effectivePrice()))}</span></div>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="flex items-center gap-6 text-sm">`);
		if (p().sku) $$renderer.push(`<!--[0--><span style="color: rgba(250,250,249,0.4);">SKU: ${escape_html(p().sku)}</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full"${attr_style(`background: ${p().stock > 10 ? "#22c55e" : p().stock > 0 ? "#f59e0b" : "#ef4444"};`)}></div> <span${attr_style(`color: ${p().stock > 10 ? "#4ade80" : p().stock > 0 ? "#fbbf24" : "#f87171"};`)}>${escape_html(p().stock > 10 ? "In Stock" : p().stock > 0 ? `Only ${p().stock} left` : "Out of Stock")}</span></div></div> <div class="divider-gold"></div> <!--[-->`);
		const each_array_1 = ensure_array_like(data.variants);
		for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
			let variant = each_array_1[$$index_2];
			$$renderer.push(`<div class="space-y-2.5"><p class="text-sm font-semibold" style="color: rgba(250,250,249,0.7);">${escape_html(variant.name)}: <span class="text-gold">${escape_html(selectedVariants[variant.name] ?? "Select")}</span></p> <div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array_2 = ensure_array_like(variant.options);
			for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
				let option = each_array_2[$$index_1];
				$$renderer.push(`<button class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border"${attr_style(selectedVariants[variant.name] === option ? "background: rgba(212,175,55,0.15); border-color: var(--color-gold); color: var(--color-gold);" : "background: var(--color-surface-2); border-color: var(--color-border); color: rgba(250,250,249,0.7);")}>${escape_html(option)}</button>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		}
		$$renderer.push(`<!--]--> <div class="flex items-center gap-4"><span class="text-sm font-medium" style="color: rgba(250,250,249,0.7);">Quantity:</span> <div class="flex items-center gap-3 rounded-xl px-1 py-1" style="background: var(--color-surface-2); border: 1px solid var(--color-border);"><button class="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-colors hover:bg-surface-3">−</button> <span class="w-8 text-center font-bold">${escape_html(quantity)}</span> <button${attr("disabled", quantity >= p().stock, true)} class="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-colors hover:bg-surface-3 disabled:opacity-40">+</button></div></div> <div class="flex gap-3"><button${attr("disabled", p().stock === 0, true)} class="btn btn-primary btn-lg flex-1"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg> ${escape_html(p().stock === 0 ? "Out of Stock" : "Add to Cart")}</button> <button class="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 border"${attr_style(isWishlisted() ? "background: rgba(212,175,55,0.15); border-color: var(--color-gold);" : "background: var(--color-surface-2); border-color: var(--color-border);")}${attr("title", isWishlisted() ? "Remove from wishlist" : "Add to wishlist")}><svg width="20" height="20" viewBox="0 0 24 24"${attr("fill", isWishlisted() ? "var(--color-gold)" : "none")}${attr("stroke", isWishlisted() ? "var(--color-gold)" : "rgba(250,250,249,0.7)")} stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg></button> <button class="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 border" style="background: var(--color-surface-2); border-color: var(--color-border);" title="Share"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(250,250,249,0.7)" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></button></div> <a${attr("href", `/checkout?buy=${stringify(p().id)}`)} class="btn btn-secondary btn-lg w-full text-center">Buy Now <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></a> <div class="flex flex-wrap gap-2"><!--[-->`);
		const each_array_3 = ensure_array_like([
			"eSewa",
			"Khalti",
			"Stripe",
			"COD"
		]);
		for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
			let method = each_array_3[$$index_3];
			$$renderer.push(`<span class="badge badge-gold text-xs">${escape_html(method)}</span>`);
		}
		$$renderer.push(`<!--]--></div></div></div> `);
		if (p().description) $$renderer.push(`<!--[0--><div class="mt-16"><div class="flex items-center gap-4 mb-6"><div class="accent-line"></div> <h2 class="font-heading font-bold text-xl">Product Description</h2></div> <div class="prose prose-invert max-w-none p-6 rounded-2xl leading-relaxed text-sm" style="background: var(--color-surface); border: 1px solid var(--color-border); color: rgba(250,250,249,0.7);">${escape_html(p().description)}</div></div>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mt-16"><div class="flex items-center gap-4 mb-8"><div class="accent-line"></div> <h2 class="font-heading font-bold text-xl">Customer Reviews</h2> `);
		if (p().reviewCount > 0) $$renderer.push(`<!--[0--><span class="badge badge-gold">${escape_html(p().reviewCount)} reviews</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (p().avgRating && parseFloat(p().avgRating) > 0) {
			$$renderer.push(`<!--[0--><div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 p-6 rounded-2xl" style="background: var(--color-surface); border: 1px solid var(--color-border);"><div class="flex flex-col items-center justify-center text-center"><div class="font-display text-7xl font-bold text-gradient-gold">${escape_html(parseFloat(p().avgRating).toFixed(1))}</div> `);
			StarRating($$renderer, {
				rating: parseFloat(p().avgRating),
				size: "md"
			});
			$$renderer.push(`<!----> <p class="text-sm mt-2" style="color: rgba(250,250,249,0.4);">Based on ${escape_html(p().reviewCount)} reviews</p></div> <div class="space-y-2"><!--[-->`);
			const each_array_4 = ensure_array_like(ratingDist);
			for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
				let dist = each_array_4[$$index_4];
				$$renderer.push(`<div class="flex items-center gap-3"><div class="flex items-center gap-1 w-12 shrink-0"><svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-gold)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> <span class="text-xs">${escape_html(dist.stars)}</span></div> <div class="flex-1 h-2 rounded-full overflow-hidden" style="background: var(--color-surface-2);"><div class="h-full rounded-full bg-gradient-gold transition-all duration-1000"${attr_style(`width: ${stringify(dist.pct)}%;`)}></div></div> <span class="text-xs w-8 text-right" style="color: rgba(250,250,249,0.4);">${escape_html(dist.pct)}%</span></div>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (data.reviews.length === 0) $$renderer.push(`<!--[0--><div class="text-center py-12"><div class="text-4xl mb-3">⭐</div> <p class="font-semibold mb-1">No reviews yet</p> <p class="text-sm" style="color: rgba(250,250,249,0.4);">Be the first to review this product</p></div>`);
		else {
			$$renderer.push(`<!--[-1--><div class="space-y-4"><!--[-->`);
			const each_array_5 = ensure_array_like(data.reviews);
			for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
				let rev = each_array_5[$$index_5];
				$$renderer.push(`<div class="p-5 rounded-2xl" style="background: var(--color-surface); border: 1px solid var(--color-border);"><div class="flex items-start justify-between gap-3"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-sm font-bold" style="color: var(--color-black);">${escape_html(rev.userId?.[0]?.toUpperCase() ?? "U")}</div> <div><p class="font-semibold text-sm">Customer</p> <p class="text-xs" style="color: rgba(250,250,249,0.4);">${escape_html(formatRelativeTime(rev.createdAt))}</p></div></div> <div class="flex items-center gap-1">`);
				StarRating($$renderer, {
					rating: rev.rating,
					size: "xs"
				});
				$$renderer.push(`<!----></div></div> `);
				if (rev.title) $$renderer.push(`<!--[0--><h4 class="font-semibold mt-3 text-sm">${escape_html(rev.title)}</h4>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (rev.body) $$renderer.push(`<!--[0--><p class="text-sm mt-1 leading-relaxed" style="color: rgba(250,250,249,0.6);">${escape_html(rev.body)}</p>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (rev.isVerified) $$renderer.push(`<!--[0--><span class="badge badge-success text-xs mt-3">✓ Verified Purchase</span>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (data.relatedProducts.length > 0) {
			$$renderer.push(`<!--[0--><div class="mt-20"><div class="flex items-center gap-4 mb-8"><div class="accent-line"></div> <h2 class="font-heading font-bold text-xl">More from ${escape_html(p().shopName)}</h2></div> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"><!--[-->`);
			const each_array_6 = ensure_array_like((data.relatedProducts || []).filter((rp) => rp.id !== p().id).slice(0, 4));
			for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
				let rp = each_array_6[$$index_6];
				ProductCard($$renderer, { product: {
					id: rp.id,
					name: rp.name,
					slug: rp.slug,
					price: rp.price,
					discountPrice: rp.discountPrice,
					avgRating: rp.avgRating ?? void 0,
					reviewCount: rp.reviewCount,
					stock: rp.stock,
					shopId: rp.shopId,
					shopName: rp.shopName ?? void 0,
					imageUrl: rp.imageUrl ?? void 0
				} });
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
