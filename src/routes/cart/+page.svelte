<script lang="ts">
	import { cart } from '$lib/stores/cart.svelte';
	import { formatPrice } from '$lib/utils';
	import { toast } from '$lib/stores/toast.svelte';

	let couponCode = $state('');
	let appliedDiscount = $state(0);
	let couponApplied = $state(false);

	const freeShippingThreshold = 5000;
	const shippingFee = $derived(cart.subtotal >= freeShippingThreshold || cart.subtotal === 0 ? 0 : 250);
	const discountAmount = $derived(couponApplied ? Math.round(cart.subtotal * (appliedDiscount / 100)) : 0);
	const finalTotal = $derived(Math.max(0, cart.subtotal - discountAmount + shippingFee));
	const progressPercent = $derived(
		Math.min(100, Math.round((cart.subtotal / freeShippingThreshold) * 100))
	);

	function applyCoupon() {
		const code = couponCode.trim().toUpperCase();
		if (code === 'SHOWCASE10' || code === 'LUXURY10') {
			appliedDiscount = 10;
			couponApplied = true;
			toast.success('Coupon applied! 10% discount added.');
		} else if (code === 'VIP20') {
			appliedDiscount = 20;
			couponApplied = true;
			toast.success('VIP Coupon applied! 20% discount added.');
		} else {
			toast.error('Invalid coupon code. Try SHOWCASE10 or VIP20');
		}
	}

	function removeCoupon() {
		couponCode = '';
		couponApplied = false;
		appliedDiscount = 0;
		toast.info('Coupon removed.');
	}
</script>

<svelte:head>
	<title>Shopping Bag — ShowCase Shops</title>
</svelte:head>

<div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
	<!-- Breadcrumb & Title -->
	<div class="mb-8">
		<nav class="flex items-center gap-2 text-xs text-white/50 mb-3 uppercase tracking-wider">
			<a href="/" class="hover:text-gold transition-colors">Home</a>
			<span>/</span>
			<span class="text-white">Shopping Bag</span>
		</nav>
		<div class="flex items-center justify-between">
			<h1 class="font-heading font-bold text-3xl md:text-4xl text-white">Your Shopping Bag</h1>
			<span class="text-sm font-medium px-3 py-1 rounded-full border border-white/10 text-white/70 bg-surface">
				{cart.count} {cart.count === 1 ? 'item' : 'items'}
			</span>
		</div>
	</div>

	{#if cart.items.length === 0}
		<!-- Empty State -->
		<div class="card p-12 text-center max-w-lg mx-auto my-12 border border-white/10">
			<div class="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-surface-2 text-white/40">
				<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
					<line x1="3" y1="6" x2="21" y2="6"></line>
					<path d="M16 10a4 4 0 0 1-8 0"></path>
				</svg>
			</div>
			<h2 class="font-heading text-2xl font-semibold text-white mb-2">Your Bag is Empty</h2>
			<p class="text-white/60 text-sm mb-8 leading-relaxed">
				Explore our curated collection of luxury items from premier local boutiques and verified merchants.
			</p>
			<a href="/products" class="btn btn-primary inline-flex items-center gap-2">
				Explore Catalog
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="5" y1="12" x2="19" y2="12"></line>
					<polyline points="12 5 19 12 12 19"></polyline>
				</svg>
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
			<!-- Items Column -->
			<div class="lg:col-span-8 space-y-4">
				<!-- Free Shipping Progress -->
				<div class="card p-4 border border-white/10 bg-surface">
					<div class="flex items-center justify-between text-xs mb-2">
						<span class="text-white/80 font-medium">
							{#if cart.subtotal >= freeShippingThreshold}
								🎉 You have unlocked <strong class="text-gold font-semibold">Free Express Shipping</strong>!
							{:else}
								Add <strong class="text-gold">{formatPrice(freeShippingThreshold - cart.subtotal)}</strong> more for Free Shipping
							{/if}
						</span>
						<span class="text-gold font-mono">{progressPercent}%</span>
					</div>
					<div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
						<div
							class="h-full bg-gold transition-all duration-500 rounded-full"
							style="width: {progressPercent}%;"
						></div>
					</div>
				</div>

				<!-- Items List -->
				<div class="card border border-white/10 divide-y divide-white/5 overflow-hidden">
					{#each cart.items as item (item.id)}
						<div class="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-colors hover:bg-white/[0.01]">
							<div class="flex items-center gap-4">
								<img
									src={item.imageUrl}
									alt={item.name}
									class="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover bg-surface-2 border border-white/5 shrink-0"
									loading="lazy"
								/>
								<div>
									<span class="text-[11px] uppercase tracking-wider text-gold font-semibold">
										{item.shopName}
									</span>
									<h3 class="font-heading font-medium text-white text-base hover:text-gold transition-colors">
										<a href="/products/{item.productId}">{item.name}</a>
									</h3>
									{#if item.variantSelections && Object.keys(item.variantSelections).length > 0}
										<div class="flex flex-wrap gap-2 mt-1">
											{#each Object.entries(item.variantSelections) as [key, val]}
												<span class="text-xs bg-white/5 px-2 py-0.5 rounded text-white/70">
													{key}: {val}
												</span>
											{/each}
										</div>
									{/if}
									<div class="mt-2 text-sm font-mono text-white/90">
										{formatPrice(item.discountPrice ?? item.price)}
										{#if item.discountPrice}
											<span class="text-xs line-through text-white/40 ml-2">
												{formatPrice(item.price)}
											</span>
										{/if}
									</div>
								</div>
							</div>

							<!-- Controls -->
							<div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
								<!-- Quantity Stepper -->
								<div class="flex items-center border border-white/10 rounded-lg bg-surface-2">
									<button
										class="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
										onclick={() => cart.updateQuantity(item.id, item.quantity - 1)}
										aria-label="Decrease quantity"
									>
										-
									</button>
									<span class="w-8 text-center text-xs font-mono text-white font-medium">
										{item.quantity}
									</span>
									<button
										class="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
										onclick={() => cart.updateQuantity(item.id, item.quantity + 1)}
										aria-label="Increase quantity"
									>
										+
									</button>
								</div>

								<!-- Total for item -->
								<div class="text-right min-w-[80px]">
									<div class="text-sm font-bold font-mono text-white">
										{formatPrice((item.discountPrice ?? item.price) * item.quantity)}
									</div>
								</div>

								<!-- Remove -->
								<button
									class="p-2 text-white/40 hover:text-red-400 transition-colors"
									onclick={() => {
										cart.remove(item.id);
										toast.info('Item removed from bag');
									}}
									aria-label="Remove item"
								>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<polyline points="3 6 5 6 21 6"></polyline>
										<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
									</svg>
								</button>
							</div>
						</div>
					{/each}
				</div>

				<div class="flex justify-between items-center pt-2">
					<a href="/products" class="text-xs uppercase tracking-wider text-gold hover:underline flex items-center gap-1.5">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="19" y1="12" x2="5" y2="12"></line>
							<polyline points="12 19 5 12 12 5"></polyline>
						</svg>
						Continue Shopping
					</a>
					<button
						class="text-xs text-white/40 hover:text-red-400 transition-colors"
						onclick={() => {
							cart.clear();
							toast.info('Shopping bag cleared');
						}}
					>
						Clear Entire Bag
					</button>
				</div>
			</div>

			<!-- Order Summary Column -->
			<div class="lg:col-span-4">
				<div class="card p-6 border border-white/10 sticky top-24 space-y-6">
					<h2 class="font-heading font-bold text-lg text-white pb-3 border-b border-white/10">
						Order Summary
					</h2>

					<!-- Coupon Input -->
					<div class="space-y-2">
						<label class="text-xs uppercase tracking-wider text-white/60 font-semibold" for="coupon-input">Promo Code</label>
						{#if !couponApplied}
							<div class="flex gap-2">
								<input
									id="coupon-input"
									type="text"
									bind:value={couponCode}
									placeholder="e.g. SHOWCASE10"
									class="input text-xs uppercase"
								/>
								<button class="btn btn-secondary px-4 text-xs whitespace-nowrap" onclick={applyCoupon}>
									Apply
								</button>
							</div>
							<p class="text-[11px] text-white/40">Try code <span class="text-gold font-mono">SHOWCASE10</span> for 10% off</p>
						{:else}
							<div class="flex items-center justify-between p-2.5 rounded bg-gold/10 border border-gold/30 text-xs">
								<span class="text-gold font-medium">Promo code <strong>{couponCode.toUpperCase()}</strong> active</span>
								<button class="text-white/60 hover:text-white" onclick={removeCoupon}>✕</button>
							</div>
						{/if}
					</div>

					<!-- Pricing breakdown -->
					<div class="space-y-3 text-sm border-t border-white/10 pt-4">
						<div class="flex justify-between text-white/70">
							<span>Subtotal</span>
							<span class="font-mono text-white">{formatPrice(cart.subtotal)}</span>
						</div>
						{#if couponApplied}
							<div class="flex justify-between text-green-400">
								<span>Discount ({appliedDiscount}%)</span>
								<span class="font-mono">- {formatPrice(discountAmount)}</span>
							</div>
						{/if}
						<div class="flex justify-between text-white/70">
							<span>Estimated Shipping</span>
							<span class="font-mono text-white">
								{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
							</span>
						</div>
						<div class="flex justify-between text-base font-bold text-white border-t border-white/10 pt-3">
							<span>Total</span>
							<span class="font-mono text-gold text-lg">{formatPrice(finalTotal)}</span>
						</div>
					</div>

					<a href="/checkout" class="btn btn-primary w-full text-center py-3.5 flex items-center justify-center gap-2 text-sm font-semibold tracking-wide">
						Proceed to Checkout
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="5" y1="12" x2="19" y2="12"></line>
							<polyline points="12 5 19 12 12 19"></polyline>
						</svg>
					</a>

					<!-- Security guarantees -->
					<div class="pt-4 border-t border-white/5 space-y-2 text-xs text-white/50">
						<div class="flex items-center gap-2">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2">
								<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
								<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
							</svg>
							<span>Secure 256-bit SSL encrypted checkout</span>
						</div>
						<div class="flex items-center gap-2">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2">
								<polyline points="20 6 9 17 4 12"></polyline>
							</svg>
							<span>Verified boutique partners in Nepal</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
