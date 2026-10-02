<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { formatPrice } from '$lib/utils';
	import { toast } from '$lib/stores/toast.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let searchQuery = $state('');

	const filteredProducts = $derived(
		data.products.filter((p) => {
			const query = searchQuery.toLowerCase().trim();
			if (!query) return true;
			return (
				p.name.toLowerCase().includes(query) ||
				(p.sku && p.sku.toLowerCase().includes(query)) ||
				(p.categoryName && p.categoryName.toLowerCase().includes(query))
			);
		})
	);

	const totalActive = $derived(data.products.filter((p) => p.isActive).length);
	const lowStockCount = $derived(data.products.filter((p) => p.stock <= 5).length);

	$effect(() => {
		if (form?.success) {
			toast.success(form.message || 'Updated successfully');
		} else if (form?.error) {
			toast.error(form.error);
		}
	});
</script>

<svelte:head>
	<title>Product Inventory — Owner Panel</title>
</svelte:head>

<div class="mx-auto max-w-7xl space-y-8 p-6 md:p-10">
	<!-- Page Header -->
	<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<div class="mb-1 flex items-center gap-2">
				<h1 class="font-heading text-2xl font-bold text-white md:text-3xl">Product Inventory</h1>
				{#if data.shop}
					<span
						class="bg-gold/10 text-gold border-gold/30 rounded-full border px-2.5 py-0.5 text-xs"
					>
						{data.shop.name}
					</span>
				{/if}
			</div>
			<p class="text-xs text-white/50 md:text-sm">
				Manage items, stock counts, pricing, and live catalog visibility
			</p>
		</div>

		<a
			href="/owner/products/new?shop={data.shop?.id}"
			class="btn btn-primary inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold tracking-wider uppercase"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
			>
				<line x1="12" y1="5" x2="12" y2="19"></line>
				<line x1="5" y1="12" x2="19" y2="12"></line>
			</svg>
			Add New Product
		</a>
	</div>

	<!-- Mini Stats Cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<div class="card bg-surface border border-white/10 p-5">
			<div class="text-xs font-medium tracking-wider text-white/50 uppercase">Total Catalog</div>
			<div class="mt-1 font-mono text-2xl font-bold text-white">{data.products.length}</div>
		</div>
		<div class="card bg-surface border border-white/10 p-5">
			<div class="text-xs font-medium tracking-wider text-white/50 uppercase">
				Live On Storefront
			</div>
			<div class="mt-1 font-mono text-2xl font-bold text-green-400">{totalActive}</div>
		</div>
		<div class="card bg-surface border border-white/10 p-5">
			<div class="text-xs font-medium tracking-wider text-white/50 uppercase">
				Low Stock Warning (&le; 5)
			</div>
			<div
				class="font-mono text-2xl font-bold {lowStockCount > 0
					? 'text-amber-400'
					: 'text-white/40'} mt-1"
			>
				{lowStockCount}
			</div>
		</div>
	</div>

	<!-- Table Card -->
	<div class="card bg-surface overflow-hidden border border-white/10">
		<!-- Search Toolbar -->
		<div class="flex items-center justify-between gap-4 border-b border-white/10 p-4">
			<div class="relative w-full max-w-sm">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search products by title, SKU, category..."
					class="input py-2 pr-4 pl-9 text-xs"
				/>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="absolute top-1/2 left-3 -translate-y-1/2 text-white/40"
				>
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
			</div>

			<span class="hidden text-xs text-white/40 sm:block">
				Showing {filteredProducts.length} of {data.products.length} items
			</span>
		</div>

		<!-- Table -->
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm text-white/70">
				<thead
					class="border-b border-white/5 bg-white/2 text-xs tracking-wider text-white/50 uppercase"
				>
					<tr>
						<th class="px-4 py-3.5 font-semibold">Product</th>
						<th class="px-4 py-3.5 font-semibold">Category</th>
						<th class="px-4 py-3.5 font-semibold">Price</th>
						<th class="px-4 py-3.5 font-semibold">Stock</th>
						<th class="px-4 py-3.5 font-semibold">Status</th>
						<th class="px-4 py-3.5 text-right font-semibold">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-white/5 font-sans">
					{#if filteredProducts.length === 0}
						<tr>
							<td colspan="6" class="p-8 text-center text-xs text-white/40">
								No products match your search.
							</td>
						</tr>
					{:else}
						{#each filteredProducts as p (p.id)}
							<tr class="transition-colors hover:bg-white/2">
								<!-- Product Info -->
								<td class="px-4 py-4">
									<div class="flex items-center gap-3">
										<img
											src={p.imageUrl || '/placeholder.png'}
											alt={p.name}
											class="bg-surface-2 h-12 w-12 shrink-0 rounded-lg border border-white/5 object-cover"
										/>
										<div class="min-w-0">
											<div
												class="hover:text-gold max-w-xs truncate text-sm font-medium text-white transition-colors"
											>
												<a href="/products/{p.id}" target="_blank">{p.name}</a>
											</div>
											<div class="font-mono text-[11px] text-white/40">
												SKU: {p.sku || 'N/A'}
											</div>
										</div>
									</div>
								</td>

								<!-- Category -->
								<td class="px-4 py-4 text-xs whitespace-nowrap text-white/70">
									{p.categoryName || 'Uncategorized'}
								</td>

								<!-- Price -->
								<td class="px-4 py-4 font-mono text-xs whitespace-nowrap">
									<div class="font-semibold text-white">
										{formatPrice(p.discountPrice ?? p.price)}
									</div>
									{#if p.discountPrice}
										<div class="text-[10px] text-white/40 line-through">{formatPrice(p.price)}</div>
									{/if}
								</td>

								<!-- Stock -->
								<td class="px-4 py-4 text-xs whitespace-nowrap">
									{#if p.stock <= 0}
										<span
											class="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400"
										>
											Out of Stock
										</span>
									{:else if p.stock <= 5}
										<span
											class="rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400"
										>
											{p.stock} left (Low)
										</span>
									{:else}
										<span
											class="rounded-full bg-green-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-green-400"
										>
											{p.stock} in stock
										</span>
									{/if}
								</td>

								<!-- Status toggle -->
								<td class="px-4 py-4 text-xs whitespace-nowrap">
									<form method="POST" action="?/toggleStatus" use:enhance>
										<input type="hidden" name="id" value={p.id} />
										<input type="hidden" name="shopId" value={data.shop?.id} />
										<input type="hidden" name="currentStatus" value={String(p.isActive)} />
										<button
											type="submit"
											class="rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors {p.isActive
												? 'bg-gold/10 border-gold/40 text-gold hover:bg-gold/20'
												: 'border-white/10 bg-white/5 text-white/40 hover:text-white'}"
										>
											{p.isActive ? 'Active' : 'Draft'}
										</button>
									</form>
								</td>

								<!-- Actions -->
								<td class="px-4 py-4 text-right whitespace-nowrap">
									<div class="flex items-center justify-end gap-2">
										<a
											href="/owner/products/{p.id}/edit?shop={data.shop?.id}"
											class="hover:text-gold p-2 text-white/50 transition-colors"
											title="Edit product"
										>
											<svg
												width="15"
												height="15"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
											>
												<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
												<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
											</svg>
										</a>
										<a
											href="/products/{p.id}"
											target="_blank"
											class="hover:text-gold p-2 text-white/50 transition-colors"
											title="View on store"
										>
											<svg
												width="15"
												height="15"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
											>
												<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
												<circle cx="12" cy="12" r="3"></circle>
											</svg>
										</a>

										<form method="POST" action="?/delete" use:enhance>
											<input type="hidden" name="id" value={p.id} />
											<input type="hidden" name="shopId" value={data.shop?.id} />
											<button
												type="submit"
												class="p-2 text-white/40 transition-colors hover:text-red-400"
												title="Delete product"
												onclick={(e) => {
													if (!confirm(`Are you sure you want to delete "${p.name}"?`)) {
														e.preventDefault();
													}
												}}
											>
												<svg
													width="15"
													height="15"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
												>
													<polyline points="3 6 5 6 21 6"></polyline>
													<path
														d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
													></path>
												</svg>
											</button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
