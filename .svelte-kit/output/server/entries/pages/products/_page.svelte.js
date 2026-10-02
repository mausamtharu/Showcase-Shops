import { a as head, i as ensure_array_like, n as attr_style, r as derived, w as escape_html } from "../../../chunks/server.js";
import { t as goto } from "../../../chunks/client.js";
import "../../../chunks/stores.js";
import "../../../chunks/navigation.js";
import { t as ProductCard } from "../../../chunks/ProductCard.js";
//#region src/routes/products/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let sortBy = "popular";
		function applyFilters() {
			const params = new URLSearchParams();
			params.set("sort", sortBy);
			goto(`/products?${params.toString()}`);
		}
		const hasActiveFilters = derived(() => false);
		const demoProducts = [
			{
				id: "1",
				name: "Premium Handmade Dhaka Topi",
				slug: "dhaka-topi",
				price: "850",
				discountPrice: "699",
				stock: 15,
				avgRating: "4.7",
				reviewCount: 23,
				shopId: "shop1",
				shopName: "Tharu Crafts",
				imageUrl: "https://picsum.photos/seed/topi/400/400"
			},
			{
				id: "2",
				name: "Organic Nepali Tea Collection",
				slug: "nepali-tea",
				price: "450",
				discountPrice: null,
				stock: 50,
				avgRating: "4.5",
				reviewCount: 45,
				shopId: "shop2",
				shopName: "Hill Tea House",
				imageUrl: "https://picsum.photos/seed/tea/400/400"
			},
			{
				id: "3",
				name: "Traditional Dhaka Fabric (5m)",
				slug: "dhaka-fabric",
				price: "2200",
				discountPrice: "1899",
				stock: 8,
				avgRating: "4.8",
				reviewCount: 12,
				shopId: "shop1",
				shopName: "Tharu Crafts",
				imageUrl: "https://picsum.photos/seed/fabric/400/400"
			},
			{
				id: "4",
				name: "Himalayan Rock Salt Lamp",
				slug: "salt-lamp",
				price: "1500",
				discountPrice: "1299",
				stock: 20,
				avgRating: "4.6",
				reviewCount: 34,
				shopId: "shop3",
				shopName: "Natural Store",
				imageUrl: "https://picsum.photos/seed/lamp/400/400"
			},
			{
				id: "5",
				name: "Khukuri Knife (Traditional)",
				slug: "khukuri",
				price: "3500",
				discountPrice: null,
				stock: 5,
				avgRating: "4.9",
				reviewCount: 8,
				shopId: "shop4",
				shopName: "Gurkha Crafts",
				imageUrl: "https://picsum.photos/seed/knife/400/400"
			},
			{
				id: "6",
				name: "Pashmina Shawl (Pure Wool)",
				slug: "pashmina",
				price: "5000",
				discountPrice: "4200",
				stock: 12,
				avgRating: "4.7",
				reviewCount: 19,
				shopId: "shop5",
				shopName: "Luxury Textiles",
				imageUrl: "https://picsum.photos/seed/pashmina/400/400"
			},
			{
				id: "7",
				name: "Singing Bowl Set",
				slug: "singing-bowl",
				price: "2800",
				discountPrice: "2400",
				stock: 30,
				avgRating: "4.8",
				reviewCount: 56,
				shopId: "shop6",
				shopName: "Meditation World",
				imageUrl: "https://picsum.photos/seed/bowl/400/400"
			},
			{
				id: "8",
				name: "Local Honey (500g)",
				slug: "local-honey",
				price: "600",
				discountPrice: null,
				stock: 3,
				avgRating: "4.9",
				reviewCount: 67,
				shopId: "shop7",
				shopName: "Forest Harvest",
				imageUrl: "https://picsum.photos/seed/honey/400/400"
			},
			{
				id: "9",
				name: "Royal Silk Wedding Sherwani",
				slug: "royal-silk-wedding-sherwani",
				price: "18000",
				discountPrice: "14900",
				stock: 7,
				avgRating: "4.9",
				reviewCount: 21,
				shopId: "shop8",
				shopName: "Royal Threads",
				imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80"
			},
			{
				id: "10",
				name: "Classic Leather Satchel",
				slug: "classic-leather-satchel",
				price: "9000",
				discountPrice: "7600",
				stock: 12,
				avgRating: "4.8",
				reviewCount: 18,
				shopId: "shop9",
				shopName: "Nomad Atelier",
				imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80"
			},
			{
				id: "11",
				name: "Himalayan Spa Gift Box",
				slug: "himalayan-spa-gift-box",
				price: "3200",
				discountPrice: "2699",
				stock: 25,
				avgRating: "4.7",
				reviewCount: 40,
				shopId: "shop10",
				shopName: "Mountain Ritual",
				imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&auto=format&fit=crop&q=80"
			},
			{
				id: "12",
				name: "Signature Gold Watch",
				slug: "signature-gold-watch",
				price: "24500",
				discountPrice: "20900",
				stock: 9,
				avgRating: "4.9",
				reviewCount: 28,
				shopId: "shop11",
				shopName: "Golden Hour",
				imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&auto=format&fit=crop&q=80"
			}
		];
		const displayProducts = derived(() => data.products.length > 0 ? data.products : demoProducts);
		const sortOptions = [
			{
				value: "popular",
				label: "Most Popular"
			},
			{
				value: "newest",
				label: "Newest First"
			},
			{
				value: "rating",
				label: "Highest Rated"
			},
			{
				value: "price-asc",
				label: "Price: Low to High"
			},
			{
				value: "price-desc",
				label: "Price: High to Low"
			}
		];
		head("1dj9mz1", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Shop All Products — ShowCase Shops</title>`);
			});
			$$renderer.push(`<meta name="description" content="Browse thousands of premium products from local shops in Nepalgunj."/>`);
		});
		$$renderer.push(`<div class="min-h-screen"><div class="section-sm" style="background: var(--color-surface); border-bottom: 1px solid var(--color-border);"><div class="container"><div class="flex items-center gap-2 mb-2 text-sm" style="color: rgba(250,250,249,0.4);"><a href="/" class="hover:text-gold transition-colors">Home</a> <span>/</span> <span style="color: var(--color-white);">Products</span></div> <div class="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><h1 class="font-display text-3xl md:text-4xl font-bold">${escape_html(data.q ? `Search: "${data.q}"` : data.cat ? `${data.cat}` : "All Products")}</h1> <p class="text-sm mt-1" style="color: rgba(250,250,249,0.5);">${escape_html(displayProducts().length)} products found</p></div> <div class="flex items-center gap-3">`);
		$$renderer.select({
			value: sortBy,
			onchange: applyFilters,
			class: "input w-auto text-sm py-2"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(sortOptions);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let opt = each_array[$$index];
				$$renderer.option({ value: opt.value }, ($$renderer) => {
					$$renderer.push(`${escape_html(opt.label)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(` <button class="btn btn-ghost btn-sm flex items-center gap-2"${attr_style(hasActiveFilters() ? "border-color: var(--color-gold); color: var(--color-gold);" : "")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="8" y1="12" x2="16" y2="12"></line><line x1="11" y1="18" x2="13" y2="18"></line></svg> Filters `);
		if (hasActiveFilters()) $$renderer.push(`<!--[0--><span class="w-2 h-2 rounded-full" style="background: var(--color-gold);"></span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></button></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> <div class="section-sm"><div class="container">`);
		if (displayProducts().length === 0) $$renderer.push(`<!--[0--><div class="flex flex-col items-center justify-center py-24 text-center"><div class="text-6xl mb-4">🔍</div> <h3 class="font-heading font-bold text-xl mb-2">No products found</h3> <p class="text-sm mb-6" style="color: rgba(250,250,249,0.5);">Try adjusting your search or filters</p> <button class="btn btn-primary">Clear Filters</button></div>`);
		else {
			$$renderer.push(`<!--[-1--><div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 stagger-children"><!--[-->`);
			const each_array_2 = ensure_array_like(displayProducts());
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let p = each_array_2[$$index_2];
				ProductCard($$renderer, { product: {
					id: p.id,
					name: p.name,
					slug: p.slug,
					price: p.price,
					discountPrice: p.discountPrice,
					avgRating: p.avgRating ?? void 0,
					reviewCount: p.reviewCount,
					stock: p.stock,
					shopId: p.shopId,
					shopName: p.shopName ?? void 0,
					imageUrl: p.imageUrl ?? void 0
				} });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div></div></div>`);
	});
}
//#endregion
export { _page as default };
