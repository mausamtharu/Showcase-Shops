import { S as attr, a as head, c as stringify, i as ensure_array_like, n as attr_style, r as derived, w as escape_html } from "../../chunks/server.js";
import { t as ProductCard } from "../../chunks/ProductCard.js";
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const heroWords = [
			"Premium",
			"Curated",
			"Luxury",
			"Exclusive"
		];
		let currentWordIdx = 0;
		const fallbackCategories = [
			{
				slug: "traditional-silks",
				name: "Traditional Silks"
			},
			{
				slug: "fine-jewelry",
				name: "Fine Jewelry"
			},
			{
				slug: "himalayan-wellness",
				name: "Himalayan Wellness"
			},
			{
				slug: "luxury-timepieces",
				name: "Luxury Timepieces"
			},
			{
				slug: "leather-goods",
				name: "Leather Goods"
			},
			{
				slug: "home-living",
				name: "Home & Living"
			},
			{
				slug: "beauty-grooming",
				name: "Beauty & Grooming"
			},
			{
				slug: "gourmet-essentials",
				name: "Gourmet Essentials"
			},
			{
				slug: "travel-accessories",
				name: "Travel Accessories"
			},
			{
				slug: "tech-audio",
				name: "Tech & Audio"
			}
		];
		const catIcons = {
			electronics: "⚡",
			fashion: "👗",
			"home-living": "🏠",
			books: "📚",
			sports: "⚽",
			beauty: "✨",
			food: "🍱",
			toys: "🎮",
			"traditional-silks": "🧵",
			"fine-jewelry": "💎",
			"himalayan-wellness": "🌿",
			"luxury-timepieces": "⌚",
			"leather-goods": "👜",
			"beauty-grooming": "✨",
			"gourmet-essentials": "🍲",
			"travel-accessories": "🧳",
			"tech-audio": "🎧"
		};
		const fallbackFeaturedProducts = [
			{
				id: "demo-1",
				name: "Heritage Dhaka Kurta Set",
				slug: "heritage-dhaka-kurta-set",
				price: 28900,
				discountPrice: 24500,
				stock: 12,
				avgRating: 4.9,
				reviewCount: 38,
				shopId: "demo-shop-1",
				shopName: "Royal Silks",
				imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80"
			},
			{
				id: "demo-2",
				name: "24K Temple Gold Necklace",
				slug: "24k-temple-gold-necklace",
				price: 268e3,
				discountPrice: 239e3,
				stock: 3,
				avgRating: 5,
				reviewCount: 24,
				shopId: "demo-shop-2",
				shopName: "Kathmandu Gold",
				imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&auto=format&fit=crop&q=80"
			},
			{
				id: "demo-3",
				name: "Wild Shilajit Resin",
				slug: "wild-shilajit-resin",
				price: 6200,
				discountPrice: 4800,
				stock: 65,
				avgRating: 4.8,
				reviewCount: 118,
				shopId: "demo-shop-3",
				shopName: "Himalayan Wellness",
				imageUrl: "https://images.unsplash.com/photo-1608248597359-59751e18dc94?w=900&auto=format&fit=crop&q=80"
			},
			{
				id: "demo-4",
				name: "Premium Leather Briefcase",
				slug: "premium-leather-briefcase",
				price: 19500,
				discountPrice: 16500,
				stock: 18,
				avgRating: 4.7,
				reviewCount: 41,
				shopId: "demo-shop-4",
				shopName: "Himalayan Leather Co.",
				imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80"
			},
			{
				id: "demo-5",
				name: "Luxury Smartwatch",
				slug: "luxury-smartwatch",
				price: 32e3,
				discountPrice: 26800,
				stock: 22,
				avgRating: 4.6,
				reviewCount: 53,
				shopId: "demo-shop-5",
				shopName: "Tech & Tale",
				imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80"
			},
			{
				id: "demo-6",
				name: "Saffron Wellness Blend",
				slug: "saffron-wellness-blend",
				price: 4800,
				discountPrice: 3600,
				stock: 30,
				avgRating: 4.9,
				reviewCount: 67,
				shopId: "demo-shop-3",
				shopName: "Himalayan Wellness",
				imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&auto=format&fit=crop&q=80"
			},
			{
				id: "demo-7",
				name: "Travel Leather Duffle",
				slug: "travel-leather-duffle",
				price: 24e3,
				discountPrice: 19900,
				stock: 14,
				avgRating: 4.8,
				reviewCount: 33,
				shopId: "demo-shop-4",
				shopName: "Nomad Atelier",
				imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900&auto=format&fit=crop&q=80"
			},
			{
				id: "demo-8",
				name: "Designer Signature Perfume",
				slug: "designer-signature-perfume",
				price: 7500,
				discountPrice: 5900,
				stock: 37,
				avgRating: 4.7,
				reviewCount: 44,
				shopId: "demo-shop-6",
				shopName: "Luna Atelier",
				imageUrl: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=900&auto=format&fit=crop&q=80"
			}
		];
		const numberFormat = new Intl.NumberFormat();
		const stats = derived(() => [
			{
				label: "Active Shops",
				value: numberFormat.format(data.stats.activeShops)
			},
			{
				label: "Products Listed",
				value: numberFormat.format(data.stats.productsListed)
			},
			{
				label: "Happy Customers",
				value: numberFormat.format(data.stats.happyCustomers)
			},
			{
				label: "Orders Delivered",
				value: numberFormat.format(data.stats.deliveredOrders)
			}
		]);
		head("1uha8ag", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>ShowCase Shops — Premium E-Commerce in Nepalgunj</title>`);
			});
			$$renderer.push(`<meta name="description" content="Discover premium products from local shops in Nepalgunj, Banke. Luxury shopping experience with fast delivery and secure payments."/>`);
		});
		$$renderer.push(`<section class="relative min-h-screen flex items-center overflow-hidden"><div class="absolute inset-0 z-0"><div class="absolute inset-0" style="background: radial-gradient(ellipse 80% 80% at 50% -20%, rgba(212,175,55,0.1) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 60%, rgba(212,175,55,0.05) 0%, transparent 50%), var(--color-black);"></div> <div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 animate-float" style="background: radial-gradient(circle, var(--color-gold) 0%, transparent 70%); filter: blur(60px);"></div> <div class="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5" style="background: radial-gradient(circle, var(--color-gold-light) 0%, transparent 70%); filter: blur(40px); animation: float 4s ease-in-out 1s infinite;"></div> <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(var(--color-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold) 1px, transparent 1px); background-size: 80px 80px;"></div></div> <div class="container relative z-10 py-20"><div class="max-w-4xl"><div class="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in" style="background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.2);"><div class="w-2 h-2 rounded-full bg-gradient-gold animate-pulse"></div> <span class="text-xs font-semibold tracking-widest uppercase text-gold">Nepalgunj's #1 E-Commerce Platform</span></div> <h1 class="font-display text-5xl md:text-7xl lg:text-8xl leading-none mb-6 animate-fade-in" style="animation-delay: 0.1s;"><span class="block" style="color: var(--color-white);">Shop</span> <span class="block"><span class="text-gradient-gold transition-opacity duration-300"${attr_style(`opacity: ${stringify(1)};`)}>${escape_html(heroWords[currentWordIdx])}</span></span> <span class="block" style="color: var(--color-white);">Products</span></h1> <p class="text-lg md:text-xl mb-10 max-w-xl leading-relaxed animate-fade-in" style="color: rgba(250,250,249,0.6); animation-delay: 0.2s;">Discover curated collections from the finest local shops in Banke. 
				Experience luxury e-commerce with seamless payments and fast delivery.</p> <div class="flex flex-wrap gap-4 animate-fade-in" style="animation-delay: 0.3s;"><a href="/products" class="btn btn-primary btn-xl group">Explore Products <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="transition-transform duration-200 group-hover:translate-x-1"><polyline points="9 18 15 12 9 6"></polyline></svg></a> <a href="/shops" class="btn btn-secondary btn-xl">Browse Shops</a></div> <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in" style="animation-delay: 0.5s;"><!--[-->`);
		const each_array = ensure_array_like(stats());
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let stat = each_array[$$index];
			$$renderer.push(`<div class="text-center md:text-left"><div class="text-2xl md:text-3xl font-bold font-heading text-gradient-gold">${escape_html(stat.value)}</div> <div class="text-xs mt-1 uppercase tracking-wider font-medium" style="color: rgba(250,250,249,0.4);">${escape_html(stat.label)}</div></div>`);
		}
		$$renderer.push(`<!--]--></div></div></div></section> <section class="section-sm"><div class="container"><div class="flex items-center gap-4 mb-8"><div class="accent-line"></div> <h2 class="font-heading font-bold text-lg uppercase tracking-widest" style="color: var(--color-gold);">Shop by Category</h2></div> <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 stagger-children">`);
		if (data.categories.length === 0) {
			$$renderer.push(`<!--[0--><!--[-->`);
			const each_array_1 = ensure_array_like(fallbackCategories);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let cat = each_array_1[$$index_1];
				$$renderer.push(`<a${attr("href", `/products?category=${stringify(cat.slug)}`)} class="flex flex-col items-center gap-3 group text-center"><div class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-gold" style="background: var(--color-surface-2); border: 1px solid var(--color-border);">${escape_html(catIcons[cat.slug] ?? "🛍️")}</div> <span class="text-xs font-medium" style="color: rgba(250,250,249,0.6);">${escape_html(cat.name)}</span></a>`);
			}
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push(`<!--[-1--><!--[-->`);
			const each_array_2 = ensure_array_like(data.categories);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let cat = each_array_2[$$index_2];
				$$renderer.push(`<a${attr("href", `/products?category=${stringify(cat.slug)}`)} class="flex flex-col items-center gap-3 group text-center"><div class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-gold" style="background: var(--color-surface-2); border: 1px solid var(--color-border);">${escape_html(catIcons[cat.slug] ?? "🛍️")}</div> <span class="text-xs font-medium" style="color: rgba(250,250,249,0.6);">${escape_html(cat.name)}</span></a>`);
			}
			$$renderer.push(`<!--]--> `);
			if (data.categories.length < 6) {
				$$renderer.push(`<!--[0--><!--[-->`);
				const each_array_3 = ensure_array_like([
					"Electronics ⚡",
					"Fashion 👗",
					"Home 🏠",
					"Beauty ✨",
					"Books 📚",
					"Sports ⚽"
				]);
				for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
					const [name, icon] = each_array_3[$$index_3].split(" ");
					$$renderer.push(`<a${attr("href", `/products?category=${stringify(name.toLowerCase())}`)} class="flex flex-col items-center gap-3 group text-center"><div class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-gold" style="background: var(--color-surface-2); border: 1px solid var(--color-border);">${escape_html(icon)}</div> <span class="text-xs font-medium" style="color: rgba(250,250,249,0.6);">${escape_html(name)}</span></a>`);
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div></section> <div class="container"><div class="divider-gold"></div></div> <section class="section"><div class="container"><div class="flex items-center justify-between mb-10"><div><div class="flex items-center gap-3 mb-2"><div class="accent-line"></div> <span class="text-xs font-semibold uppercase tracking-widest text-gold">Curated For You</span></div> <h2 class="font-display text-3xl md:text-4xl font-bold">Featured <span class="text-gradient-gold">Shops</span></h2></div> <a href="/shops" class="btn btn-secondary hidden md:inline-flex">View All Shops <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></a></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">`);
		if (data.featuredShops.length === 0) {
			$$renderer.push(`<!--[0--><!--[-->`);
			const each_array_4 = ensure_array_like([
				{
					name: "Tharu Handcrafts",
					tagline: "Authentic Local Handicrafts",
					category: "Fashion",
					location: "Nepalgunj",
					color: "#8B5CF6"
				},
				{
					name: "Tech Hub Nepal",
					tagline: "Latest Electronics & Gadgets",
					category: "Electronics",
					location: "Banke",
					color: "#0EA5E9"
				},
				{
					name: "Golden Spice Kitchen",
					tagline: "Premium Spices & Organic Foods",
					category: "Food",
					location: "Nepalgunj",
					color: "#F59E0B"
				}
			]);
			for (let i = 0, $$length = each_array_4.length; i < $$length; i++) {
				let demoShop = each_array_4[i];
				$$renderer.push(`<div class="card hover-lift overflow-hidden group"><div class="relative h-40 overflow-hidden"${attr_style(`background: linear-gradient(135deg, ${stringify(demoShop.color)}20, ${stringify(demoShop.color)}05);`)}><div class="absolute inset-0 flex items-center justify-center"><span class="text-6xl opacity-20">🏪</span></div></div> <div class="p-5"><div class="flex items-start justify-between gap-3"><div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl -mt-10 relative z-10 border-2 shadow-card" style="background: var(--color-surface); border-color: var(--color-border);">🏪</div> <span class="badge badge-gold text-xs">${escape_html(demoShop.category)}</span></div> <h3 class="font-heading font-bold text-lg mt-3">${escape_html(demoShop.name)}</h3> <p class="text-sm mt-1" style="color: rgba(250,250,249,0.5);">${escape_html(demoShop.tagline)}</p> <div class="flex items-center gap-1.5 mt-3" style="color: rgba(250,250,249,0.4);"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> <span class="text-xs">${escape_html(demoShop.location)}</span></div></div></div>`);
			}
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push(`<!--[-1--><!--[-->`);
			const each_array_5 = ensure_array_like(data.featuredShops);
			for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
				let s = each_array_5[$$index_5];
				$$renderer.push(`<a${attr("href", `/shop/${stringify(s.slug)}`)} class="card hover-lift group block"><div class="relative h-40 overflow-hidden" style="background: var(--color-surface-2);">`);
				if (s.bannerUrl) $$renderer.push(`<!--[0--><img${attr("src", s.bannerUrl)}${attr("alt", s.name)} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>`);
				else $$renderer.push(`<!--[-1--><div class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, rgba(212,175,55,0.05), rgba(212,175,55,0.02));"><span class="text-5xl opacity-20">🏪</span></div>`);
				$$renderer.push(`<!--]--></div> <div class="p-5"><div class="flex items-start justify-between gap-3"><div class="w-14 h-14 rounded-xl overflow-hidden -mt-10 relative z-10 border-2 shadow-card" style="background: var(--color-surface); border-color: var(--color-border);">`);
				if (s.logoUrl) $$renderer.push(`<!--[0--><img${attr("src", s.logoUrl)}${attr("alt", s.name)} class="w-full h-full object-cover"/>`);
				else $$renderer.push(`<!--[-1--><div class="w-full h-full flex items-center justify-center text-2xl">🏪</div>`);
				$$renderer.push(`<!--]--></div> `);
				if (s.category) $$renderer.push(`<!--[0--><span class="badge badge-gold text-xs">${escape_html(s.category)}</span>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <h3 class="font-heading font-bold text-lg mt-3">${escape_html(s.name)}</h3> `);
				if (s.tagline) $$renderer.push(`<!--[0--><p class="text-sm mt-1 line-clamp-1" style="color: rgba(250,250,249,0.5);">${escape_html(s.tagline)}</p>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (s.location) $$renderer.push(`<!--[0--><div class="flex items-center gap-1.5 mt-3" style="color: rgba(250,250,249,0.4);"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> <span class="text-xs">${escape_html(s.location)}</span></div>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></a>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div></section> <section class="container mb-16"><div class="relative rounded-3xl overflow-hidden p-8 md:p-12 lg:p-16" style="background: linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 100%); border: 1px solid rgba(212,175,55,0.15);"><div class="absolute right-0 top-0 w-2/3 h-full opacity-5" style="background: radial-gradient(ellipse at right, var(--color-gold), transparent 60%);"></div> <div class="absolute right-8 top-1/2 -translate-y-1/2 text-9xl opacity-5 select-none font-bold font-display">SC</div> <div class="relative z-10 max-w-xl"><div class="badge badge-gold mb-4">Limited Time Offer</div> <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">Open Your Shop <span class="text-gradient-gold">For Free</span></h2> <p class="text-base mb-8" style="color: rgba(250,250,249,0.6);">Join 200+ local businesses showcasing their products on our platform. 
				No setup fees. Start selling in minutes.</p> <div class="flex flex-wrap gap-4"><a href="/owner/onboarding" class="btn btn-primary btn-lg">Start Selling Today <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></a> <a href="/products" class="btn btn-ghost btn-lg">Browse as Customer</a></div></div></div></section> <section class="section" style="background: var(--color-surface);"><div class="container"><div class="flex items-center justify-between mb-10"><div><div class="flex items-center gap-3 mb-2"><div class="accent-line"></div> <span class="text-xs font-semibold uppercase tracking-widest text-gold">Most Popular</span></div> <h2 class="font-display text-3xl md:text-4xl font-bold">Trending <span class="text-gradient-gold">Products</span></h2></div> <a href="/products" class="btn btn-secondary hidden md:inline-flex">View All <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></a></div> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">`);
		if (data.featuredProducts.length === 0) {
			$$renderer.push(`<!--[0--><!--[-->`);
			const each_array_6 = ensure_array_like(fallbackFeaturedProducts);
			for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
				let p = each_array_6[$$index_6];
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
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push(`<!--[-1--><!--[-->`);
			const each_array_7 = ensure_array_like(data.featuredProducts);
			for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
				let p = each_array_7[$$index_7];
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
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div> <div class="text-center mt-8 md:hidden"><a href="/products" class="btn btn-secondary">View All Products</a></div></div></section> <section class="section"><div class="container"><div class="text-center mb-12"><div class="flex items-center justify-center gap-3 mb-2"><div class="accent-line"></div> <span class="text-xs font-semibold uppercase tracking-widest text-gold">Why Choose Us</span> <div class="accent-line"></div></div> <h2 class="font-display text-3xl md:text-4xl font-bold mt-2">The <span class="text-gradient-gold">ShowCase</span> Difference</h2></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children"><!--[-->`);
		const each_array_8 = ensure_array_like([
			{
				icon: "⚡",
				title: "Lightning Fast",
				desc: "SvelteKit SSR ensures near-instant page loads and smooth transitions."
			},
			{
				icon: "🔐",
				title: "Secure Payments",
				desc: "eSewa, Khalti, Stripe & COD with bank-level encryption."
			},
			{
				icon: "📦",
				title: "Easy Tracking",
				desc: "Real-time order tracking from placement to doorstep delivery."
			},
			{
				icon: "🌟",
				title: "Local First",
				desc: "Supporting local businesses in Nepalgunj and across Banke."
			}
		]);
		for (let $$index_8 = 0, $$length = each_array_8.length; $$index_8 < $$length; $$index_8++) {
			let feature = each_array_8[$$index_8];
			$$renderer.push(`<div class="p-6 rounded-2xl transition-all duration-300 hover:border-gold group" style="background: var(--color-surface-2); border: 1px solid var(--color-border);"><div class="text-4xl mb-4">${escape_html(feature.icon)}</div> <h3 class="font-heading font-bold text-lg mb-2 group-hover:text-gold transition-colors">${escape_html(feature.title)}</h3> <p class="text-sm leading-relaxed" style="color: rgba(250,250,249,0.5);">${escape_html(feature.desc)}</p></div>`);
		}
		$$renderer.push(`<!--]--></div></div></section> <section class="section-sm" style="border-top: 1px solid var(--color-border);"><div class="container"><div class="flex flex-wrap items-center justify-center gap-8"><span class="text-sm uppercase tracking-widest font-semibold" style="color: rgba(250,250,249,0.3);">Trusted Payments</span> <!--[-->`);
		const each_array_9 = ensure_array_like([
			"eSewa",
			"Khalti",
			"Stripe",
			"Cash on Delivery"
		]);
		for (let $$index_9 = 0, $$length = each_array_9.length; $$index_9 < $$length; $$index_9++) {
			let method = each_array_9[$$index_9];
			$$renderer.push(`<div class="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:border-gold" style="background: var(--color-surface-2); border: 1px solid var(--color-border); color: rgba(250,250,249,0.5);">${escape_html(method)}</div>`);
		}
		$$renderer.push(`<!--]--></div></div></section>`);
	});
}
//#endregion
export { _page as default };
