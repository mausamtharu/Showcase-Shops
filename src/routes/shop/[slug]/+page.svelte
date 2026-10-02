<script lang="ts">
	import type { PageData } from './$types';
	import ProductCard from '$lib/components/product/ProductCard.svelte';
	import StarRating from '$lib/components/ui/StarRating.svelte';

	let { data }: { data: PageData } = $props();

	let selectedCategory = $state<string | null>(null);
	let shopSearch = $state('');

	const filteredProducts = $derived(
		data.products.filter((p) => {
			const matchesCategory = !selectedCategory || p.categoryName === selectedCategory;
			const matchesSearch =
				!shopSearch.trim() ||
				p.name.toLowerCase().includes(shopSearch.toLowerCase());
			return matchesCategory && matchesSearch;
		})
	);
</script>

<svelte:head>
	<title>{data.shop.name} — ShowCase Shops</title>
	<meta name="description" content={data.shop.tagline || data.shop.description || 'Verified merchant on ShowCase Shops'} />
</svelte:head>

<div>
	<!-- Shop Hero Banner -->
	<div class="relative h-64 md:h-80 bg-surface-2 overflow-hidden border-b border-white/10">
		{#if data.shop.bannerUrl}
			<img
				src={data.shop.bannerUrl}
				alt={data.shop.name}
				class="w-full h-full object-cover brightness-50"
			/>
		{:else}
			<div class="w-full h-full bg-gradient-to-r from-stone-900 via-stone-800 to-black"></div>
		{/if}

		<div class="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>

		<!-- Breadcrumbs in banner -->
		<div class="absolute top-6 left-4 sm:left-8 z-10">
			<nav class="flex items-center gap-2 text-xs text-white/70 uppercase tracking-wider">
				<a href="/" class="hover:text-gold transition-colors">Home</a>
				<span>/</span>
				<a href="/products" class="hover:text-gold transition-colors">Shops</a>
				<span>/</span>
				<span class="text-white">{data.shop.name}</span>
			</nav>
		</div>

		<!-- Shop Info Bar Overlay -->
		<div class="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
			<div class="flex items-center gap-4">
				{#if data.shop.logoUrl}
					<img
						src={data.shop.logoUrl}
						alt={data.shop.name}
						class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-gold shadow-2xl object-cover bg-black shrink-0"
					/>
				{:else}
					<div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-gold flex items-center justify-center font-heading font-bold text-2xl text-gold bg-surface shrink-0">
						{data.shop.name.slice(0, 2).toUpperCase()}
					</div>
				{/if}
				<div>
					<div class="flex items-center gap-2">
						<h1 class="font-heading font-bold text-2xl sm:text-3xl text-white">{data.shop.name}</h1>
						<span class="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-gold/20 text-gold border border-gold/30">
							Verified Boutique
						</span>
					</div>
					{#if data.shop.tagline}
						<p class="text-white/70 text-xs sm:text-sm mt-0.5">{data.shop.tagline}</p>
					{/if}
					<div class="flex flex-wrap items-center gap-3 mt-2 text-xs text-white/60">
						{#if data.shop.location}
							<span class="flex items-center gap-1">
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
									<circle cx="12" cy="10" r="3"></circle>
								</svg>
								{data.shop.location}
							</span>
						{/if}
						{#if data.shop.phone}
							<span class="flex items-center gap-1">
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
								</svg>
								{data.shop.phone}
							</span>
						{/if}
					</div>
				</div>
			</div>

			<!-- Quick stats -->
			<div class="flex items-center gap-4 bg-surface/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 self-start md:self-auto">
				<div class="text-center">
					<div class="text-sm font-bold text-white font-mono">{data.products.length}</div>
					<div class="text-[10px] uppercase tracking-wider text-white/50">Products</div>
				</div>
				<div class="h-6 w-px bg-white/10"></div>
				<div class="text-center">
					<div class="text-sm font-bold text-gold font-mono">4.9 ★</div>
					<div class="text-[10px] uppercase tracking-wider text-white/50">Rating</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content: Shop Catalog -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
		<!-- Description & Filters -->
		{#if data.shop.description}
			<p class="text-white/70 text-sm max-w-3xl mb-8 leading-relaxed">
				{data.shop.description}
			</p>
		{/if}

		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
			<!-- Categories Filter pills -->
			<div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
				<button
					class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all {!selectedCategory ? 'bg-gold text-black font-semibold' : 'bg-surface text-white/70 border border-white/10 hover:border-white/20'}"
					onclick={() => (selectedCategory = null)}
				>
					All Products ({data.products.length})
				</button>
				{#each data.categories as cat}
					{#if cat}
						<button
							class="px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all {selectedCategory === cat ? 'bg-gold text-black font-semibold' : 'bg-surface text-white/70 border border-white/10 hover:border-white/20'}"
							onclick={() => (selectedCategory = cat)}
						>
							{cat}
						</button>
					{/if}
				{/each}
			</div>

			<!-- Search in shop -->
			<div class="relative w-full sm:w-64">
				<input
					type="text"
					bind:value={shopSearch}
					placeholder="Search in this shop..."
					class="input text-xs py-2 pl-8 pr-3"
				/>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40"
				>
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
			</div>
		</div>

		<!-- Products Grid -->
		{#if filteredProducts.length === 0}
			<div class="card p-12 text-center border border-white/10 max-w-md mx-auto my-8">
				<h3 class="font-heading text-lg font-semibold text-white mb-2">No Products Found</h3>
				<p class="text-xs text-white/50 mb-4">No items match your search criteria in this shop.</p>
				<button
					class="btn btn-secondary text-xs"
					onclick={() => {
						selectedCategory = null;
						shopSearch = '';
					}}
				>
					Reset Filters
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
				{#each filteredProducts as p (p.id)}
					<ProductCard
						product={{
							id: p.id,
							name: p.name,
							slug: p.slug,
							price: p.price,
							discountPrice: p.discountPrice,
							avgRating: p.avgRating ? Number(p.avgRating) : undefined,
							reviewCount: p.reviewCount,
							stock: p.stock,
							shopId: data.shop.id,
							shopName: data.shop.name,
							imageUrl: p.imageUrl
						}}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
