<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ProductCard from '$lib/components/product/ProductCard.svelte';
	import ProductCardSkeleton from '$lib/components/product/ProductCardSkeleton.svelte';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let selectedCategory = $state('');
	let sortBy = $state('popular');
	let minPrice = $state('');
	let maxPrice = $state('');
	let filterOpen = $state(false);

	$effect(() => {
		searchQuery = data.q ?? '';
		selectedCategory = data.cat ?? '';
		sortBy = data.sortBy ?? 'popular';
		minPrice = data.minPrice?.toString() ?? '';
		maxPrice = data.maxPrice?.toString() ?? '';
	});

	function applyFilters() {
		const params = new URLSearchParams();
		if (searchQuery) params.set('q', searchQuery);
		if (selectedCategory) params.set('category', selectedCategory);
		if (sortBy) params.set('sort', sortBy);
		if (minPrice) params.set('minPrice', minPrice);
		if (maxPrice) params.set('maxPrice', maxPrice);
		goto(`/products?${params.toString()}`);
	}

	function clearFilters() {
		searchQuery = '';
		selectedCategory = '';
		sortBy = 'popular';
		minPrice = '';
		maxPrice = '';
		goto('/products');
	}

	const hasActiveFilters = $derived(
		!!(searchQuery || selectedCategory || minPrice || maxPrice || (sortBy && sortBy !== 'popular'))
	);

	// Demo products for when DB is empty
	const demoProducts = [
		{ id: '1', name: 'Premium Handmade Dhaka Topi', slug: 'dhaka-topi', price: '850', discountPrice: '699', stock: 15, avgRating: '4.7', reviewCount: 23, shopId: 'shop1', shopName: 'Tharu Crafts', imageUrl: 'https://picsum.photos/seed/topi/400/400' },
		{ id: '2', name: 'Organic Nepali Tea Collection', slug: 'nepali-tea', price: '450', discountPrice: null, stock: 50, avgRating: '4.5', reviewCount: 45, shopId: 'shop2', shopName: 'Hill Tea House', imageUrl: 'https://picsum.photos/seed/tea/400/400' },
		{ id: '3', name: 'Traditional Dhaka Fabric (5m)', slug: 'dhaka-fabric', price: '2200', discountPrice: '1899', stock: 8, avgRating: '4.8', reviewCount: 12, shopId: 'shop1', shopName: 'Tharu Crafts', imageUrl: 'https://picsum.photos/seed/fabric/400/400' },
		{ id: '4', name: 'Himalayan Rock Salt Lamp', slug: 'salt-lamp', price: '1500', discountPrice: '1299', stock: 20, avgRating: '4.6', reviewCount: 34, shopId: 'shop3', shopName: 'Natural Store', imageUrl: 'https://picsum.photos/seed/lamp/400/400' },
		{ id: '5', name: 'Khukuri Knife (Traditional)', slug: 'khukuri', price: '3500', discountPrice: null, stock: 5, avgRating: '4.9', reviewCount: 8, shopId: 'shop4', shopName: 'Gurkha Crafts', imageUrl: 'https://picsum.photos/seed/knife/400/400' },
		{ id: '6', name: 'Pashmina Shawl (Pure Wool)', slug: 'pashmina', price: '5000', discountPrice: '4200', stock: 12, avgRating: '4.7', reviewCount: 19, shopId: 'shop5', shopName: 'Luxury Textiles', imageUrl: 'https://picsum.photos/seed/pashmina/400/400' },
		{ id: '7', name: 'Singing Bowl Set', slug: 'singing-bowl', price: '2800', discountPrice: '2400', stock: 30, avgRating: '4.8', reviewCount: 56, shopId: 'shop6', shopName: 'Meditation World', imageUrl: 'https://picsum.photos/seed/bowl/400/400' },
		{ id: '8', name: 'Local Honey (500g)', slug: 'local-honey', price: '600', discountPrice: null, stock: 3, avgRating: '4.9', reviewCount: 67, shopId: 'shop7', shopName: 'Forest Harvest', imageUrl: 'https://picsum.photos/seed/honey/400/400' },
		{ id: '9', name: 'Royal Silk Wedding Sherwani', slug: 'royal-silk-wedding-sherwani', price: '18000', discountPrice: '14900', stock: 7, avgRating: '4.9', reviewCount: 21, shopId: 'shop8', shopName: 'Royal Threads', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80' },
		{ id: '10', name: 'Classic Leather Satchel', slug: 'classic-leather-satchel', price: '9000', discountPrice: '7600', stock: 12, avgRating: '4.8', reviewCount: 18, shopId: 'shop9', shopName: 'Nomad Atelier', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80' },
		{ id: '11', name: 'Himalayan Spa Gift Box', slug: 'himalayan-spa-gift-box', price: '3200', discountPrice: '2699', stock: 25, avgRating: '4.7', reviewCount: 40, shopId: 'shop10', shopName: 'Mountain Ritual', imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&auto=format&fit=crop&q=80' },
		{ id: '12', name: 'Signature Gold Watch', slug: 'signature-gold-watch', price: '24500', discountPrice: '20900', stock: 9, avgRating: '4.9', reviewCount: 28, shopId: 'shop11', shopName: 'Golden Hour', imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&auto=format&fit=crop&q=80' }
	];

	const displayProducts = $derived(data.products.length > 0 ? data.products : demoProducts as typeof data.products);

	const sortOptions = [
		{ value: 'popular', label: 'Most Popular' },
		{ value: 'newest', label: 'Newest First' },
		{ value: 'rating', label: 'Highest Rated' },
		{ value: 'price-asc', label: 'Price: Low to High' },
		{ value: 'price-desc', label: 'Price: High to Low' }
	];
</script>

<svelte:head>
	<title>Shop All Products — ShowCase Shops</title>
	<meta name="description" content="Browse thousands of premium products from local shops in Nepalgunj." />
</svelte:head>

<div class="min-h-screen">
	<!-- Header -->
	<div class="section-sm" style="background: var(--color-surface); border-bottom: 1px solid var(--color-border);">
		<div class="container">
			<div class="flex items-center gap-2 mb-2 text-sm" style="color: rgba(250,250,249,0.4);">
				<a href="/" class="hover:text-gold transition-colors">Home</a>
				<span>/</span>
				<span style="color: var(--color-white);">Products</span>
			</div>
			<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 class="font-display text-3xl md:text-4xl font-bold">
						{data.q ? `Search: "${data.q}"` : data.cat ? `${data.cat}` : 'All Products'}
					</h1>
					<p class="text-sm mt-1" style="color: rgba(250,250,249,0.5);">
						{displayProducts.length} products found
					</p>
				</div>

				<!-- Sort -->
				<div class="flex items-center gap-3">
					<select
						bind:value={sortBy}
						onchange={applyFilters}
						class="input w-auto text-sm py-2"
					>
						{#each sortOptions as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>

					<button
						onclick={() => (filterOpen = !filterOpen)}
						class="btn btn-ghost btn-sm flex items-center gap-2"
						style={hasActiveFilters ? 'border-color: var(--color-gold); color: var(--color-gold);' : ''}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="4" y1="6" x2="20" y2="6"/>
							<line x1="8" y1="12" x2="16" y2="12"/>
							<line x1="11" y1="18" x2="13" y2="18"/>
						</svg>
						Filters
						{#if hasActiveFilters}
							<span class="w-2 h-2 rounded-full" style="background: var(--color-gold);"></span>
						{/if}
					</button>
				</div>
			</div>

			<!-- Filter Panel -->
			{#if filterOpen}
				<div class="mt-6 p-6 rounded-2xl animate-fade-in" style="background: var(--color-surface-2); border: 1px solid var(--color-border);">
					<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
						<!-- Search -->
						<div class="space-y-1.5">
							<label for="product-search" class="text-xs font-semibold uppercase tracking-wider" style="color: var(--color-gold);">Search</label>
							<input
								id="product-search"
								type="search"
								bind:value={searchQuery}
								placeholder="Search products..."
								class="input text-sm"
							/>
						</div>

						<!-- Category -->
						<div class="space-y-1.5">
							<label for="product-category" class="text-xs font-semibold uppercase tracking-wider" style="color: var(--color-gold);">Category</label>
							<select id="product-category" bind:value={selectedCategory} class="input text-sm">
								<option value="">All Categories</option>
								{#each data.categories as cat}
									<option value={cat.slug}>{cat.name}</option>
								{/each}
							</select>
						</div>

						<!-- Price Range -->
						<div class="space-y-1.5">
							<label for="product-min-price" class="text-xs font-semibold uppercase tracking-wider" style="color: var(--color-gold);">Min Price (NPR)</label>
							<input id="product-min-price" type="number" bind:value={minPrice} placeholder="0" class="input text-sm" min="0" />
						</div>
						<div class="space-y-1.5">
							<label for="product-max-price" class="text-xs font-semibold uppercase tracking-wider" style="color: var(--color-gold);">Max Price (NPR)</label>
							<input id="product-max-price" type="number" bind:value={maxPrice} placeholder="100000" class="input text-sm" min="0" />
						</div>
					</div>

					<div class="flex gap-3 mt-4">
						<button onclick={applyFilters} class="btn btn-primary">Apply Filters</button>
						<button onclick={clearFilters} class="btn btn-ghost">Clear All</button>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Products Grid -->
	<div class="section-sm">
		<div class="container">
			{#if displayProducts.length === 0}
				<div class="flex flex-col items-center justify-center py-24 text-center">
					<div class="text-6xl mb-4">🔍</div>
					<h3 class="font-heading font-bold text-xl mb-2">No products found</h3>
					<p class="text-sm mb-6" style="color: rgba(250,250,249,0.5);">Try adjusting your search or filters</p>
					<button onclick={clearFilters} class="btn btn-primary">Clear Filters</button>
				</div>
			{:else}
				<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 stagger-children">
					{#each displayProducts as p}
						<ProductCard product={{
							id: p.id,
							name: p.name,
							slug: p.slug,
							price: p.price,
							discountPrice: p.discountPrice,
							avgRating: p.avgRating ?? undefined,
							reviewCount: p.reviewCount,
							stock: p.stock,
							shopId: p.shopId,
							shopName: p.shopName ?? undefined,
							imageUrl: p.imageUrl ?? undefined
						}} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
