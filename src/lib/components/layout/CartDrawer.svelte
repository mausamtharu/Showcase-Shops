<script lang="ts">
	import { cart } from '$lib/stores/cart.svelte';
	import { formatPrice, calcDiscount } from '$lib/utils';
	import { goto } from '$app/navigation';

	function handleCheckout() {
		cart.closeDrawer();
		goto('/checkout');
	}
</script>

<!-- Overlay -->
{#if cart.isOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="overlay" onclick={() => cart.closeDrawer()} onkeydown={() => {}}></div>

	<!-- Drawer -->
	<div
		class="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col animate-slide-in-right shadow-elevated"
		style="background: var(--color-surface);"
	>
		<!-- Header -->
		<div
			class="flex items-center justify-between p-6 border-b"
			style="border-color: var(--color-border);"
		>
			<div>
				<h2 class="text-xl font-bold font-heading">Your Cart</h2>
				<p class="text-sm mt-0.5" style="color: rgba(250,250,249,0.5);">
					{cart.count} item{cart.count !== 1 ? 's' : ''}
				</p>
			</div>
			<button
				onclick={() => cart.closeDrawer()}
				class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
				style="background: var(--color-surface-2); border: 1px solid var(--color-border);"
				aria-label="Close cart"
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>

		<!-- Items -->
		<div class="flex-1 overflow-y-auto p-4 space-y-3">
			{#if cart.items.length === 0}
				<div class="flex flex-col items-center justify-center h-full gap-4 text-center">
					<div
						class="w-20 h-20 rounded-2xl flex items-center justify-center"
						style="background: var(--color-surface-2);"
					>
						<svg
							width="36"
							height="36"
							viewBox="0 0 24 24"
							fill="none"
							stroke="rgba(212,175,55,0.4)"
							stroke-width="1.5"
						>
							<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
							<line x1="3" y1="6" x2="21" y2="6" />
							<path d="M16 10a4 4 0 01-8 0" />
						</svg>
					</div>
					<div>
						<p class="font-semibold font-heading text-lg">Your cart is empty</p>
						<p class="text-sm mt-1" style="color: rgba(250,250,249,0.4);">
							Discover premium products
						</p>
					</div>
					<a
						href="/products"
						class="btn btn-primary"
						onclick={() => cart.closeDrawer()}
					>
						Start Shopping
					</a>
				</div>
			{:else}
				{#each cart.items as item (item.id)}
					<div
						class="flex gap-4 p-3 rounded-xl border transition-all duration-200 group"
						style="background: var(--color-surface-2); border-color: var(--color-border);"
					>
						<!-- Image -->
						<div
							class="w-20 h-20 rounded-lg overflow-hidden shrink-0"
							style="background: var(--color-surface-3);"
						>
							<img
								src={item.imageUrl}
								alt={item.name}
								class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
							/>
						</div>

						<!-- Info -->
						<div class="flex-1 min-w-0">
							<h4 class="font-medium text-sm leading-tight truncate">{item.name}</h4>
							{#if item.variantSelections}
								<p class="text-xs mt-0.5" style="color: rgba(250,250,249,0.4);">
									{Object.entries(item.variantSelections)
										.map(([k, v]) => `${k}: ${v}`)
										.join(', ')}
								</p>
							{/if}
							<div class="flex items-center gap-2 mt-1">
								<span class="font-bold text-sm text-gold">
									{formatPrice(item.discountPrice ?? item.price)}
								</span>
								{#if item.discountPrice}
									<span class="text-xs line-through" style="color: rgba(250,250,249,0.35);">
										{formatPrice(item.price)}
									</span>
								{/if}
							</div>

							<!-- Quantity -->
							<div class="flex items-center gap-2 mt-2">
								<button
									onclick={() => cart.updateQuantity(item.id, item.quantity - 1)}
									class="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
									style="background: var(--color-surface-3); border: 1px solid var(--color-border);"
								>
									−
								</button>
								<span class="text-sm font-semibold w-6 text-center">{item.quantity}</span>
								<button
									onclick={() => cart.updateQuantity(item.id, item.quantity + 1)}
									disabled={item.quantity >= item.stock}
									class="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
									style="background: var(--color-surface-3); border: 1px solid var(--color-border);"
								>
									+
								</button>
							</div>
						</div>

						<!-- Remove -->
						<button
							onclick={() => cart.remove(item.id)}
							class="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
							style="color: #f87171;"
							title="Remove"
						>
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<polyline points="3 6 5 6 21 6" />
								<path
									d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"
								/>
							</svg>
						</button>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Footer -->
		{#if cart.items.length > 0}
			<div class="p-4 border-t space-y-3" style="border-color: var(--color-border);">
				<!-- Subtotal -->
				<div class="flex items-center justify-between">
					<span class="text-sm" style="color: rgba(250,250,249,0.6);">Subtotal</span>
					<span class="font-bold text-lg text-gold">{formatPrice(cart.subtotal)}</span>
				</div>
				<p class="text-xs" style="color: rgba(250,250,249,0.35);">
					Shipping & taxes calculated at checkout
				</p>

				<button onclick={handleCheckout} class="btn btn-primary btn-lg w-full">
					Proceed to Checkout
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="9 18 15 12 9 6" />
					</svg>
				</button>
				<a
					href="/cart"
					class="btn btn-ghost w-full text-center"
					onclick={() => cart.closeDrawer()}
				>
					View Full Cart
				</a>
			</div>
		{/if}
	</div>
{/if}
