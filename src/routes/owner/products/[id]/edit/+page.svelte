<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { formatPrice } from '$lib/utils';
	import { toast } from '$lib/stores/toast.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let name = $state('');
	let price = $state('');
	let discountPrice = $state('');
	let stock = $state('');
	let categoryId = $state('');
	let sku = $state('');
	let description = $state('');
	let imageUrl = $state('');
	let isFeatured = $state(false);
	let isSubmitting = $state(false);

	$effect(() => {
		name = data.product.name ?? '';
		price = String(data.product.price ?? '');
		discountPrice = data.product.discountPrice ? String(data.product.discountPrice) : '';
		stock = String(data.product.stock ?? '');
		categoryId = data.product.categoryId ?? '';
		sku = data.product.sku ?? '';
		description = data.product.description ?? '';
		imageUrl = data.product.imageUrl ?? '';
		isFeatured = data.product.isFeatured ?? false;
	});

	$effect(() => {
		if (form?.error) {
			toast.error(form.error);
		}
	});
</script>

<svelte:head>
	<title>Edit {data.product.name} — Owner Panel</title>
</svelte:head>

<div class="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
	<!-- Breadcrumb & Header -->
	<div>
		<nav class="mb-2 flex items-center gap-2 text-xs tracking-wider text-white/50 uppercase">
			<a href="/owner/dashboard?shop={data.shop.id}" class="hover:text-gold transition-colors"
				>Owner</a
			>
			<span>/</span>
			<a href="/owner/products?shop={data.shop.id}" class="hover:text-gold transition-colors"
				>Products</a
			>
			<span>/</span>
			<span class="text-white">Edit Item</span>
		</nav>
		<div class="flex items-center justify-between">
			<div>
				<h1 class="font-heading text-2xl font-bold text-white md:text-3xl">Edit Product</h1>
				<p class="mt-0.5 text-xs text-white/40">
					{data.shop.name} · Modify pricing, inventory levels, or promotional details
				</p>
			</div>
			<a href="/owner/products?shop={data.shop.id}" class="btn btn-secondary text-xs">
				Cancel & Return
			</a>
		</div>
	</div>

	<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
		<!-- Left: Form -->
		<div class="lg:col-span-8">
			<form
				method="POST"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
				class="card bg-surface space-y-6 border border-white/10 p-6 md:p-8"
			>
				<!-- Basic Details -->
				<div class="space-y-4">
					<h2 class="font-heading border-b border-white/10 pb-2 text-base font-semibold text-white">
						1. General Information
					</h2>

					<div class="space-y-1.5">
						<label for="name" class="text-xs font-medium tracking-wider text-white/70 uppercase"
							>Product Title *</label
						>
						<input
							id="name"
							name="name"
							type="text"
							required
							bind:value={name}
							class="input text-sm"
						/>
					</div>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div class="space-y-1.5">
							<label
								for="categoryId"
								class="text-xs font-medium tracking-wider text-white/70 uppercase">Category</label
							>
							<select
								id="categoryId"
								name="categoryId"
								bind:value={categoryId}
								class="input text-sm"
							>
								<option value="">Select Category...</option>
								{#each data.categories as cat}
									<option value={cat.id}>{cat.name}</option>
								{/each}
							</select>
						</div>

						<div class="space-y-1.5">
							<label for="sku" class="text-xs font-medium tracking-wider text-white/70 uppercase"
								>Stock Keeping Unit (SKU)</label
							>
							<input
								id="sku"
								name="sku"
								type="text"
								bind:value={sku}
								class="input font-mono text-sm"
							/>
						</div>
					</div>

					<div class="space-y-1.5">
						<label
							for="description"
							class="text-xs font-medium tracking-wider text-white/70 uppercase">Description</label
						>
						<textarea
							id="description"
							name="description"
							rows="4"
							bind:value={description}
							class="input py-2 text-sm leading-relaxed"></textarea>
					</div>
				</div>

				<!-- Pricing & Stock -->
				<div class="space-y-4 border-t border-white/10 pt-4">
					<h2 class="font-heading border-b border-white/10 pb-2 text-base font-semibold text-white">
						2. Pricing & Inventory
					</h2>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div class="space-y-1.5">
							<label for="price" class="text-xs font-medium tracking-wider text-white/70 uppercase"
								>Regular Price (NPR) *</label
							>
							<input
								id="price"
								name="price"
								type="number"
								step="1"
								min="0"
								required
								bind:value={price}
								class="input font-mono text-sm"
							/>
						</div>

						<div class="space-y-1.5">
							<label
								for="discountPrice"
								class="text-xs font-medium tracking-wider text-white/70 uppercase"
								>Discount Price (NPR)</label
							>
							<input
								id="discountPrice"
								name="discountPrice"
								type="number"
								step="1"
								min="0"
								bind:value={discountPrice}
								placeholder="Optional"
								class="input font-mono text-sm"
							/>
						</div>

						<div class="space-y-1.5">
							<label for="stock" class="text-xs font-medium tracking-wider text-white/70 uppercase"
								>Current Stock *</label
							>
							<input
								id="stock"
								name="stock"
								type="number"
								min="0"
								required
								bind:value={stock}
								class="input font-mono text-sm"
							/>
						</div>
					</div>
				</div>

				<!-- Media -->
				<div class="space-y-4 border-t border-white/10 pt-4">
					<h2 class="font-heading border-b border-white/10 pb-2 text-base font-semibold text-white">
						3. Media & Showcase
					</h2>

					<div class="space-y-1.5">
						<label for="imageUrl" class="text-xs font-medium tracking-wider text-white/70 uppercase"
							>Primary Image URL</label
						>
						<input
							id="imageUrl"
							name="imageUrl"
							type="url"
							bind:value={imageUrl}
							class="input text-sm"
						/>
					</div>

					<label class="flex cursor-pointer items-center gap-3 pt-2">
						<input
							type="checkbox"
							name="isFeatured"
							bind:checked={isFeatured}
							class="text-gold focus:ring-gold bg-surface-2 h-4 w-4 rounded border-white/20"
						/>
						<span class="text-sm font-medium text-white">Feature in Homepage Showcase</span>
					</label>
				</div>

				<!-- Submit Button -->
				<div class="flex justify-end gap-4 border-t border-white/10 pt-6">
					<a href="/owner/products?shop={data.shop.id}" class="btn btn-secondary">Cancel</a>
					<button
						type="submit"
						disabled={isSubmitting}
						class="btn btn-primary flex items-center gap-2 px-8 font-semibold"
					>
						{#if isSubmitting}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"
							></div>
							Saving...
						{:else}
							Save Changes
						{/if}
					</button>
				</div>
			</form>
		</div>

		<!-- Right: Live Card Preview -->
		<div class="sticky top-24 lg:col-span-4">
			<div class="card bg-surface space-y-4 border border-white/10 p-5">
				<div
					class="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-semibold tracking-wider text-white/50 uppercase"
				>
					<span>Live Storefront Preview</span>
					<span class="text-gold">Card View</span>
				</div>

				<div class="bg-surface-2 group overflow-hidden rounded-xl border border-white/10">
					<div class="relative aspect-square overflow-hidden bg-black/40">
						{#if imageUrl}
							<img src={imageUrl} alt="Preview" class="h-full w-full object-cover" />
						{:else}
							<div class="flex h-full w-full items-center justify-center text-xs text-white/30">
								Image Preview
							</div>
						{/if}
						{#if isFeatured}
							<div
								class="bg-gold absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider text-black uppercase"
							>
								Featured
							</div>
						{/if}
					</div>

					<div class="space-y-2 p-4">
						<h3 class="font-heading line-clamp-1 text-sm font-medium text-white">
							{name || 'Product Title Goes Here'}
						</h3>
						<div class="flex items-center gap-2 font-mono text-sm">
							<span class="font-bold text-white">
								{price ? formatPrice(discountPrice || price) : 'NPR 0'}
							</span>
							{#if discountPrice && price}
								<span class="text-xs text-white/40 line-through">
									{formatPrice(price)}
								</span>
							{/if}
						</div>
						<div
							class="flex items-center justify-between border-t border-white/5 pt-2 text-[11px] text-white/40"
						>
							<span>Stock: {stock || 0}</span>
							<span class={Number(stock) > 0 ? 'text-green-400' : 'text-red-400'}>
								{Number(stock) > 0 ? 'In Stock' : 'Out of Stock'}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
