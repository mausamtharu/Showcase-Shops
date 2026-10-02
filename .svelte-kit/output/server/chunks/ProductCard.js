import { S as attr, c as stringify, i as ensure_array_like, n as attr_style, r as derived, t as attr_class, w as escape_html } from "./server.js";
import { o as getStarArray, r as formatPrice, t as calcDiscount } from "./utils2.js";
import { t as wishlist } from "./wishlist.svelte.js";
//#region src/lib/components/ui/StarRating.svelte
function StarRating($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { rating, count, size = "sm" } = $$props;
		const stars = derived(() => getStarArray(rating));
		const starSize = derived(() => size === "xs" ? 12 : size === "sm" ? 14 : 18);
		$$renderer.push(`<div class="flex items-center gap-1.5"><div class="flex items-center gap-0.5"><!--[-->`);
		const each_array = ensure_array_like(stars());
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let star = each_array[$$index];
			$$renderer.push(`<svg${attr("width", starSize())}${attr("height", starSize())} viewBox="0 0 24 24">`);
			if (star === "full") $$renderer.push(`<!--[0--><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="var(--color-gold)" stroke="var(--color-gold)" stroke-width="1"></polygon>`);
			else if (star === "half") $$renderer.push(`<!--[1--><defs><linearGradient id="half-star"><stop offset="50%" stop-color="var(--color-gold)"></stop><stop offset="50%" stop-color="transparent"></stop></linearGradient></defs><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half-star)" stroke="var(--color-gold)" stroke-width="1"></polygon>`);
			else $$renderer.push(`<!--[-1--><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="var(--color-border)" stroke-width="1.5"></polygon>`);
			$$renderer.push(`<!--]--></svg>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (count !== void 0) $$renderer.push(`<!--[0--><span class="text-xs" style="color: rgba(250,250,249,0.5);">(${escape_html(count)})</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/product/ProductCard.svelte
function ProductCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { product } = $$props;
		const discount = derived(() => calcDiscount(product.price, product.discountPrice ?? null));
		const isWishlisted = derived(() => wishlist.isWishlisted(product.id));
		const effectivePrice = derived(() => typeof (product.discountPrice ?? product.price) === "string" ? parseFloat(product.discountPrice ?? product.price) : product.discountPrice ?? product.price);
		const originalPrice = derived(() => typeof product.price === "string" ? parseFloat(product.price) : product.price);
		$$renderer.push(`<a${attr("href", `/products/${stringify(product.id)}`)} class="card group block relative"><div class="relative aspect-square overflow-hidden" style="background: var(--color-surface-2);">`);
		$$renderer.push(`<!--[0--><div class="shimmer w-full h-full"></div>`);
		$$renderer.push(`<!--]--> <img${attr("src", product.imageUrl ?? `https://picsum.photos/seed/${product.id}/400/400`)}${attr("alt", product.name)}${attr_class("w-full h-full object-cover transition-transform duration-500 group-hover:scale-110", void 0, { "opacity-0": true })} onload="this.__e=event"/> <div class="absolute top-3 left-3 flex flex-col gap-1.5">`);
		if (discount() > 0) $$renderer.push(`<!--[0--><span class="badge badge-gold text-xs">${escape_html(discount())}% OFF</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (product.stock === 0) $$renderer.push(`<!--[0--><span class="badge badge-error text-xs">Out of Stock</span>`);
		else if (product.stock <= 5) $$renderer.push(`<!--[1--><span class="badge badge-warning text-xs">Only ${escape_html(product.stock)} left</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <button class="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0" style="background: rgba(10,10,10,0.8); backdrop-filter: blur(8px);"${attr("title", isWishlisted() ? "Remove from wishlist" : "Add to wishlist")}><svg width="16" height="16" viewBox="0 0 24 24"${attr("fill", isWishlisted() ? "var(--color-gold)" : "none")}${attr("stroke", isWishlisted() ? "var(--color-gold)" : "rgba(250,250,249,0.8)")} stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg></button> <div class="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"><button${attr("disabled", product.stock === 0, true)} class="btn btn-primary w-full text-sm"${attr_style(product.stock === 0 ? "opacity: 0.5;" : "")}>${escape_html(product.stock === 0 ? "Out of Stock" : "Add to Cart")}</button></div></div> <div class="p-4">`);
		if (product.shopName) $$renderer.push(`<!--[0--><p class="text-xs mb-1 font-medium" style="color: var(--color-gold);">${escape_html(product.shopName)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <h3 class="font-semibold font-heading text-sm leading-snug line-clamp-2 group-hover:text-gold transition-colors duration-200" style="color: var(--color-white);">${escape_html(product.name)}</h3> `);
		if (product.avgRating && parseFloat(product.avgRating) > 0) {
			$$renderer.push(`<!--[0--><div class="mt-2">`);
			StarRating($$renderer, {
				rating: parseFloat(product.avgRating),
				count: product.reviewCount,
				size: "xs"
			});
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex items-center gap-2 mt-3"><span class="font-bold text-base text-gold">${escape_html(formatPrice(effectivePrice()))}</span> `);
		if (discount() > 0) $$renderer.push(`<!--[0--><span class="text-xs line-through" style="color: rgba(250,250,249,0.35);">${escape_html(formatPrice(originalPrice()))}</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></a>`);
	});
}
//#endregion
export { StarRating as n, ProductCard as t };
