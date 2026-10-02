<script lang="ts">
	import { cart } from '../../stores/cart.svelte';
	import { wishlist } from '../../stores/wishlist.svelte';
	import { toast } from '../../stores/toast.svelte';
	import { formatPrice, calcDiscount } from '../../utils';
	import StarRating from '../ui/StarRating.svelte';

	type Product = {
		id: string;
		name: string;
		slug: string;
		price: number | string;
		discountPrice?: number | string | null;
		avgRating?: number | string;
		reviewCount?: number;
		stock: number;
		shopId: string;
		shopName?: string;
		imageUrl?: string;
	};

	let { product }: { product: Product } = $props();

	const discount = $derived(calcDiscount(product.price, product.discountPrice ?? null));
	const isWishlisted = $derived(wishlist.isWishlisted(product.id));
	const effectivePrice = $derived(
		typeof (product.discountPrice ?? product.price) === 'string'
			? parseFloat((product.discountPrice ?? product.price) as string)
			: (product.discountPrice ?? product.price) as number
	);
	const originalPrice = $derived(
		typeof product.price === 'string' ? parseFloat(product.price) : product.price
	);

	function handleAddToCart(e: Event) {
		e.preventDefault();
		e.stopPropagation();
		if (product.stock === 0) return;
		cart.add({
			id: crypto.randomUUID(),
			productId: product.id,
			name: product.name,
			price: originalPrice,
			discountPrice: product.discountPrice ? (typeof product.discountPrice === 'string' ? parseFloat(product.discountPrice) : product.discountPrice) : null,
			imageUrl: product.imageUrl ?? '/placeholder.jpg',
			quantity: 1,
			stock: product.stock,
			shopId: product.shopId,
			shopName: product.shopName ?? ''
		});
		toast.success('Added to cart', product.name);
	}

	function handleWishlist(e: Event) {
		e.preventDefault();
		e.stopPropagation();
		wishlist.toggle(product.id);
		toast.info(
			wishlist.isWishlisted(product.id) ? 'Added to wishlist' : 'Removed from wishlist',
			product.name
		);
	}

	let imageLoaded = $state(false);
</script>

<a
	href="/products/{product.id}"
	class="card group block relative"
>
	<!-- Image Container -->
	<div class="relative aspect-square overflow-hidden" style="background: var(--color-surface-2);">
		{#if !imageLoaded}
			<div class="shimmer w-full h-full"></div>
		{/if}
		<img
			src={product.imageUrl ?? `https://picsum.photos/seed/${product.id}/400/400`}
			alt={product.name}
			class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
			class:opacity-0={!imageLoaded}
			onload={() => (imageLoaded = true)}
		/>

		<!-- Badges -->
		<div class="absolute top-3 left-3 flex flex-col gap-1.5">
			{#if discount > 0}
				<span class="badge badge-gold text-xs">{discount}% OFF</span>
			{/if}
			{#if product.stock === 0}
				<span class="badge badge-error text-xs">Out of Stock</span>
			{:else if product.stock <= 5}
				<span class="badge badge-warning text-xs">Only {product.stock} left</span>
			{/if}
		</div>

		<!-- Wishlist Button -->
		<button
			onclick={handleWishlist}
			class="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0"
			style="background: rgba(10,10,10,0.8); backdrop-filter: blur(8px);"
			title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill={isWishlisted ? 'var(--color-gold)' : 'none'}
				stroke={isWishlisted ? 'var(--color-gold)' : 'rgba(250,250,249,0.8)'}
				stroke-width="2"
			>
				<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
			</svg>
		</button>

		<!-- Quick Add Overlay -->
		<div
			class="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
		>
			<button
				onclick={handleAddToCart}
				disabled={product.stock === 0}
				class="btn btn-primary w-full text-sm"
				style={product.stock === 0 ? 'opacity: 0.5;' : ''}
			>
				{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
			</button>
		</div>
	</div>

	<!-- Info -->
	<div class="p-4">
		{#if product.shopName}
			<p class="text-xs mb-1 font-medium" style="color: var(--color-gold);">
				{product.shopName}
			</p>
		{/if}
		<h3
			class="font-semibold font-heading text-sm leading-snug line-clamp-2 group-hover:text-gold transition-colors duration-200"
			style="color: var(--color-white);"
		>
			{product.name}
		</h3>

		{#if product.avgRating && parseFloat(product.avgRating as string) > 0}
			<div class="mt-2">
				<StarRating
					rating={parseFloat(product.avgRating as string)}
					count={product.reviewCount}
					size="xs"
				/>
			</div>
		{/if}

		<div class="flex items-center gap-2 mt-3">
			<span class="font-bold text-base text-gold">{formatPrice(effectivePrice)}</span>
			{#if discount > 0}
				<span class="text-xs line-through" style="color: rgba(250,250,249,0.35);">
					{formatPrice(originalPrice)}
				</span>
			{/if}
		</div>
	</div>
</a>
