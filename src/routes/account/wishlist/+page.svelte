<script lang="ts">
	import type { PageData } from './$types';
	import { wishlist } from '$lib/stores/wishlist.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { formatPrice } from '$lib/utils';
	import { toast } from '$lib/stores/toast.svelte';

	let { data }: { data: PageData } = $props();

	const wishlistedProducts = $derived(
		data.allProducts.filter((p) => wishlist.isWishlisted(p.id))
	);

	function moveToCart(p: any) {
		cart.add({
			id: p.id,
			productId: p.id,
			name: p.name,
			price: Number(p.price),
			discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
			imageUrl: p.imageUrl || '/placeholder.png',
			stock: p.stock || 10,
			shopId: p.shopId || '',
			shopName: p.shopName || 'ShowCase Boutique',
			quantity: 1
		});
		wishlist.remove(p.id);
		toast.success(`"${p.name}" moved to bag!`);
	}
</script>

<svelte:head>
	<title>My Wishlist — ShowCase Shops</title>
</svelte:head>

<div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
	<!-- Header -->
	<div>
		<nav class="flex items-center gap-2 text-xs text-white/50 mb-3 uppercase tracking-wider">
			<a href="/" class="hover:text-gold transition-colors">Home</a>
			<span>/</span>
			<span class="text-white">Wishlist</span>
		</nav>
		<div class="flex items-center justify-between">
			<h1 class="font-heading font-bold text-3xl text-white">Saved Collections</h1>
			<span class="text-xs px-3 py-1 rounded-full border border-white/10 text-white/70 bg-surface">
				{wishlist.count} {wishlist.count === 1 ? 'item' : 'items'}
			</span>
		</div>
	</div>

	{#if wishlistedProducts.length === 0}
		<div class="card p-12 text-center border border-white/10 max-w-md mx-auto my-12 bg-surface">
			<div class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-surface-2 text-white/30">
				<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
				</svg>
			</div>
			<h2 class="font-heading text-xl font-semibold text-white mb-2">Your Wishlist is Empty</h2>
			<p class="text-xs text-white/50 mb-6 leading-relaxed">
				Save your favorite handcrafted items, traditional silks, and fine jewels to purchase them later.
			</p>
			<a href="/products" class="btn btn-primary">Discover Products</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each wishlistedProducts as item (item.id)}
				<div class="card border border-white/10 overflow-hidden bg-surface flex flex-col justify-between group hover:border-white/20 transition-all duration-300">
					<div class="relative aspect-square overflow-hidden bg-black">
						<img
							src={item.imageUrl}
							alt={item.name}
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						/>
						<button
							class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-red-400 transition-colors"
							onclick={() => wishlist.remove(item.id)}
							aria-label="Remove from wishlist"
						>
							✕
						</button>
					</div>

					<div class="p-5 flex-1 flex flex-col justify-between space-y-4">
						<div>
							<div class="text-[11px] uppercase tracking-wider text-gold font-semibold">
								{item.shopName || 'Boutique'}
							</div>
							<h3 class="font-heading font-medium text-white text-base mt-1 hover:text-gold transition-colors">
								<a href="/products/{item.id}">{item.name}</a>
							</h3>
							<div class="mt-2 text-sm font-mono font-bold text-white">
								{formatPrice(item.discountPrice ?? item.price)}
							</div>
						</div>

						<button
							class="btn btn-primary w-full py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
							onclick={() => moveToCart(item)}
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
								<line x1="3" y1="6" x2="21" y2="6"></line>
								<path d="M16 10a4 4 0 0 1-8 0"></path>
							</svg>
							Move to Bag
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
