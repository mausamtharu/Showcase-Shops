<script lang="ts">
	import type { PageData } from './$types';
	import { cart } from '$lib/stores/cart.svelte';
	import { wishlist } from '$lib/stores/wishlist.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { formatPrice, calcDiscount, formatRelativeTime } from '$lib/utils';
	import StarRating from '$lib/components/ui/StarRating.svelte';
	import ProductCard from '$lib/components/product/ProductCard.svelte';

	let { data }: { data: PageData } = $props();
	const p = $derived(data.product);

	// Image gallery
	let activeImageIdx = $state(0);
	let isZoomed = $state(false);
	let zoomPos = $state({ x: 50, y: 50 });

	const allImages = $derived(
		data.images.length > 0
			? data.images.map((i: { url: string; altText: string | null }) => i.url)
			: [`https://picsum.photos/seed/${p.id}/600/600`]
	);

	// Variants
	let selectedVariants = $state<Record<string, string>>({});

	// Quantity
	let quantity = $state(1);

	const isWishlisted = $derived(wishlist.isWishlisted(p.id));
	const effectivePrice = $derived(
		p.discountPrice ? parseFloat(p.discountPrice) : parseFloat(p.price)
	);
	const discount = $derived(calcDiscount(p.price, p.discountPrice));

	function handleImageMouseMove(e: MouseEvent) {
		if (!isZoomed) return;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		zoomPos = {
			x: ((e.clientX - rect.left) / rect.width) * 100,
			y: ((e.clientY - rect.top) / rect.height) * 100
		};
	}

	function handleAddToCart() {
		if (p.stock === 0) return;
		cart.add({
			id: crypto.randomUUID(),
			productId: p.id,
			name: p.name,
			price: parseFloat(p.price),
			discountPrice: p.discountPrice ? parseFloat(p.discountPrice) : null,
			imageUrl: allImages[0],
			quantity,
			stock: p.stock,
			shopId: p.shopId,
			shopName: p.shopName ?? '',
			variantSelections: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined
		});
		toast.success('Added to cart!', `${p.name} × ${quantity}`);
	}

	function handleWishlist() {
		wishlist.toggle(p.id);
		toast.info(
			wishlist.isWishlisted(p.id) ? 'Saved to wishlist' : 'Removed from wishlist',
			p.name
		);
	}

	function handleShare() {
		if (navigator.share) {
			navigator.share({ title: p.name, url: window.location.href });
		} else {
			navigator.clipboard.writeText(window.location.href);
			toast.success('Link copied!');
		}
	}

	// Rating distribution (mock)
	const ratingDist = [
		{ stars: 5, pct: 62 },
		{ stars: 4, pct: 21 },
		{ stars: 3, pct: 10 },
		{ stars: 2, pct: 4 },
		{ stars: 1, pct: 3 }
	];
</script>

<svelte:head>
	<title>{p.name} — ShowCase Shops</title>
	<meta name="description" content={p.description ?? `Buy ${p.name} from ${p.shopName}`} />
</svelte:head>

<div class="min-h-screen">
	<!-- Breadcrumb -->
	<div class="container pt-6 pb-2">
		<div class="flex items-center gap-2 text-sm" style="color: rgba(250,250,249,0.4);">
			<a href="/" class="hover:text-gold transition-colors">Home</a>
			<span>/</span>
			<a href="/products" class="hover:text-gold transition-colors">Products</a>
			<span>/</span>
			<span class="truncate max-w-48" style="color: var(--color-white);">{p.name}</span>
		</div>
	</div>

	<!-- Product Section -->
	<div class="container py-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
			<!-- ── Image Gallery ── -->
			<div class="space-y-4">
				<!-- Main Image -->
				<div
					class="relative aspect-square rounded-2xl overflow-hidden cursor-zoom-in"
					style="background: var(--color-surface-2);"
					onmouseenter={() => (isZoomed = true)}
					onmouseleave={() => (isZoomed = false)}
					onmousemove={handleImageMouseMove}
					role="img"
					aria-label={p.name}
				>
					<img
						src={allImages[activeImageIdx]}
						alt={p.name}
						class="w-full h-full object-cover transition-transform duration-300"
						style={isZoomed
							? `transform: scale(2); transform-origin: ${zoomPos.x}% ${zoomPos.y}%;`
							: ''}
					/>
					{#if discount > 0}
						<div class="absolute top-4 left-4">
							<span class="badge badge-gold text-sm">{discount}% OFF</span>
						</div>
					{/if}
					{#if p.stock === 0}
						<div class="absolute inset-0 flex items-center justify-center" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);">
							<span class="badge badge-error text-base px-5 py-2">Out of Stock</span>
						</div>
					{/if}
				</div>

				<!-- Thumbnails -->
				{#if allImages.length > 1}
					<div class="flex gap-3 overflow-x-auto pb-2">
						{#each allImages as img, i}
							<button
								onclick={() => (activeImageIdx = i)}
								class="shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200"
								style={activeImageIdx === i
									? 'border-color: var(--color-gold);'
									: 'border-color: var(--color-border);'}
							>
								<img src={img} alt="Product view {i + 1}" class="w-full h-full object-cover" />
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- ── Product Info ── -->
			<div class="space-y-6">
				<!-- Shop link -->
				{#if p.shopName}
					<a
						href="/shop/{p.shopSlug}"
						class="inline-flex items-center gap-2 transition-colors duration-200 hover:opacity-80"
					>
						<div class="w-8 h-8 rounded-lg overflow-hidden" style="background: var(--color-surface-2);">
							{#if p.shopLogoUrl}
								<img src={p.shopLogoUrl} alt={p.shopName} class="w-full h-full object-cover" />
							{:else}
								<div class="w-full h-full flex items-center justify-center text-sm">🏪</div>
							{/if}
						</div>
						<span class="text-sm font-semibold text-gold">{p.shopName}</span>
						{#if p.shopLocation}
							<span class="text-xs" style="color: rgba(250,250,249,0.4);">· {p.shopLocation}</span>
						{/if}
					</a>
				{/if}

				<h1 class="font-display text-3xl md:text-4xl font-bold leading-tight">{p.name}</h1>

				<!-- Rating -->
				{#if p.avgRating && parseFloat(p.avgRating) > 0}
					<div class="flex items-center gap-3">
						<StarRating rating={parseFloat(p.avgRating)} count={p.reviewCount} size="md" />
						<span class="text-sm font-bold text-gold">{parseFloat(p.avgRating).toFixed(1)}</span>
					</div>
				{/if}

				<!-- Price -->
				<div class="flex items-end gap-4">
					<span class="font-bold text-4xl text-gold font-heading">{formatPrice(effectivePrice)}</span>
					{#if discount > 0}
						<div class="flex flex-col">
							<span class="text-lg line-through" style="color: rgba(250,250,249,0.35);">{formatPrice(parseFloat(p.price))}</span>
							<span class="text-sm text-green-400 font-semibold">Save {formatPrice(parseFloat(p.price) - effectivePrice)}</span>
						</div>
					{/if}
				</div>

				<!-- SKU + Stock -->
				<div class="flex items-center gap-6 text-sm">
					{#if p.sku}
						<span style="color: rgba(250,250,249,0.4);">SKU: {p.sku}</span>
					{/if}
					<div class="flex items-center gap-1.5">
						<div
							class="w-2 h-2 rounded-full"
							style="background: {p.stock > 10 ? '#22c55e' : p.stock > 0 ? '#f59e0b' : '#ef4444'};"
						></div>
						<span
							style="color: {p.stock > 10 ? '#4ade80' : p.stock > 0 ? '#fbbf24' : '#f87171'};"
						>
							{p.stock > 10 ? 'In Stock' : p.stock > 0 ? `Only ${p.stock} left` : 'Out of Stock'}
						</span>
					</div>
				</div>

				<!-- Divider -->
				<div class="divider-gold"></div>

				<!-- Variants -->
				{#each data.variants as variant}
					<div class="space-y-2.5">
						<p class="text-sm font-semibold" style="color: rgba(250,250,249,0.7);">
							{variant.name}:
							<span class="text-gold">{selectedVariants[variant.name] ?? 'Select'}</span>
						</p>
						<div class="flex flex-wrap gap-2">
							{#each (variant.options as string[]) as option}
								<button
									onclick={() => (selectedVariants[variant.name] = option)}
									class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border"
									style={selectedVariants[variant.name] === option
										? 'background: rgba(212,175,55,0.15); border-color: var(--color-gold); color: var(--color-gold);'
										: 'background: var(--color-surface-2); border-color: var(--color-border); color: rgba(250,250,249,0.7);'}
								>
									{option}
								</button>
							{/each}
						</div>
					</div>
				{/each}

				<!-- Quantity -->
				<div class="flex items-center gap-4">
					<span class="text-sm font-medium" style="color: rgba(250,250,249,0.7);">Quantity:</span>
					<div
						class="flex items-center gap-3 rounded-xl px-1 py-1"
						style="background: var(--color-surface-2); border: 1px solid var(--color-border);"
					>
						<button
							onclick={() => quantity > 1 && quantity--}
							class="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-colors hover:bg-surface-3"
						>
							−
						</button>
						<span class="w-8 text-center font-bold">{quantity}</span>
						<button
							onclick={() => quantity < p.stock && quantity++}
							disabled={quantity >= p.stock}
							class="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-colors hover:bg-surface-3 disabled:opacity-40"
						>
							+
						</button>
					</div>
				</div>

				<!-- CTA Buttons -->
				<div class="flex gap-3">
					<button
						onclick={handleAddToCart}
						disabled={p.stock === 0}
						class="btn btn-primary btn-lg flex-1"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
							<line x1="3" y1="6" x2="21" y2="6"/>
							<path d="M16 10a4 4 0 01-8 0"/>
						</svg>
						{p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
					</button>

					<button
						onclick={handleWishlist}
						class="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 border"
						style={isWishlisted
							? 'background: rgba(212,175,55,0.15); border-color: var(--color-gold);'
							: 'background: var(--color-surface-2); border-color: var(--color-border);'}
						title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill={isWishlisted ? 'var(--color-gold)' : 'none'}
							stroke={isWishlisted ? 'var(--color-gold)' : 'rgba(250,250,249,0.7)'}
							stroke-width="2"
						>
							<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
						</svg>
					</button>

					<button
						onclick={handleShare}
						class="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 border"
						style="background: var(--color-surface-2); border-color: var(--color-border);"
						title="Share"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(250,250,249,0.7)" stroke-width="2">
							<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
							<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
						</svg>
					</button>
				</div>

				<!-- Buy Now -->
				<a href="/checkout?buy={p.id}" class="btn btn-secondary btn-lg w-full text-center">
					Buy Now
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="9 18 15 12 9 6" />
					</svg>
				</a>

				<!-- Payment methods -->
				<div class="flex flex-wrap gap-2">
					{#each ['eSewa', 'Khalti', 'Stripe', 'COD'] as method}
						<span class="badge badge-gold text-xs">{method}</span>
					{/each}
				</div>
			</div>
		</div>

		<!-- ── Description ── -->
		{#if p.description}
			<div class="mt-16">
				<div class="flex items-center gap-4 mb-6">
					<div class="accent-line"></div>
					<h2 class="font-heading font-bold text-xl">Product Description</h2>
				</div>
				<div
					class="prose prose-invert max-w-none p-6 rounded-2xl leading-relaxed text-sm"
					style="background: var(--color-surface); border: 1px solid var(--color-border); color: rgba(250,250,249,0.7);"
				>
					{p.description}
				</div>
			</div>
		{/if}

		<!-- ── Reviews ── -->
		<div class="mt-16">
			<div class="flex items-center gap-4 mb-8">
				<div class="accent-line"></div>
				<h2 class="font-heading font-bold text-xl">Customer Reviews</h2>
				{#if p.reviewCount > 0}
					<span class="badge badge-gold">{p.reviewCount} reviews</span>
				{/if}
			</div>

			{#if p.avgRating && parseFloat(p.avgRating) > 0}
				<!-- Rating Summary -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 p-6 rounded-2xl" style="background: var(--color-surface); border: 1px solid var(--color-border);">
					<div class="flex flex-col items-center justify-center text-center">
						<div class="font-display text-7xl font-bold text-gradient-gold">{parseFloat(p.avgRating).toFixed(1)}</div>
						<StarRating rating={parseFloat(p.avgRating)} size="md" />
						<p class="text-sm mt-2" style="color: rgba(250,250,249,0.4);">Based on {p.reviewCount} reviews</p>
					</div>
					<div class="space-y-2">
						{#each ratingDist as dist}
							<div class="flex items-center gap-3">
								<div class="flex items-center gap-1 w-12 shrink-0">
									<svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-gold)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
									<span class="text-xs">{dist.stars}</span>
								</div>
								<div class="flex-1 h-2 rounded-full overflow-hidden" style="background: var(--color-surface-2);">
									<div class="h-full rounded-full bg-gradient-gold transition-all duration-1000" style="width: {dist.pct}%;"></div>
								</div>
								<span class="text-xs w-8 text-right" style="color: rgba(250,250,249,0.4);">{dist.pct}%</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Review List -->
			{#if data.reviews.length === 0}
				<div class="text-center py-12">
					<div class="text-4xl mb-3">⭐</div>
					<p class="font-semibold mb-1">No reviews yet</p>
					<p class="text-sm" style="color: rgba(250,250,249,0.4);">Be the first to review this product</p>
				</div>
			{:else}
				<div class="space-y-4">
					{#each data.reviews as rev}
						<div class="p-5 rounded-2xl" style="background: var(--color-surface); border: 1px solid var(--color-border);">
							<div class="flex items-start justify-between gap-3">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-sm font-bold" style="color: var(--color-black);">
										{rev.userId?.[0]?.toUpperCase() ?? 'U'}
									</div>
									<div>
										<p class="font-semibold text-sm">Customer</p>
										<p class="text-xs" style="color: rgba(250,250,249,0.4);">{formatRelativeTime(rev.createdAt)}</p>
									</div>
								</div>
								<div class="flex items-center gap-1">
									<StarRating rating={rev.rating} size="xs" />
								</div>
							</div>
							{#if rev.title}
								<h4 class="font-semibold mt-3 text-sm">{rev.title}</h4>
							{/if}
							{#if rev.body}
								<p class="text-sm mt-1 leading-relaxed" style="color: rgba(250,250,249,0.6);">{rev.body}</p>
							{/if}
							{#if rev.isVerified}
								<span class="badge badge-success text-xs mt-3">✓ Verified Purchase</span>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- ── Related Products ── -->
		{#if data.relatedProducts.length > 0}
			<div class="mt-20">
				<div class="flex items-center gap-4 mb-8">
					<div class="accent-line"></div>
					<h2 class="font-heading font-bold text-xl">More from {p.shopName}</h2>
				</div>
				<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
					{#each (data.relatedProducts || []).filter((rp: any) => rp.id !== p.id).slice(0, 4) as rp}
						<ProductCard product={{
							id: rp.id,
							name: rp.name,
							slug: rp.slug,
							price: rp.price,
							discountPrice: rp.discountPrice,
							avgRating: rp.avgRating ?? undefined,
							reviewCount: rp.reviewCount,
							stock: rp.stock,
							shopId: rp.shopId,
							shopName: rp.shopName ?? undefined,
							imageUrl: rp.imageUrl ?? undefined
						}} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
