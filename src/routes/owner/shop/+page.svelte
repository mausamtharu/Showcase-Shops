<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isSubmitting = $state(false);

	$effect(() => {
		if (form?.success) {
			toast.success(form.message || 'Profile saved');
		} else if (form?.error) {
			toast.error(form.error);
		}
	});
</script>

<svelte:head>
	<title>Shop Profile — Owner Panel</title>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-8 p-6 md:p-10">
	<!-- Header -->
	<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="font-heading text-2xl font-bold text-white md:text-3xl">
				Shop Profile & Branding
			</h1>
			<p class="text-xs text-white/50 md:text-sm">
				Configure your boutique storefront, banners, contact info, and location
			</p>
		</div>

		{#if data.shop?.slug}
			<a
				href="/shop/{data.shop.slug}"
				target="_blank"
				class="btn btn-secondary inline-flex items-center gap-2 text-xs"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
					<polyline points="15 3 21 3 21 9"></polyline>
					<line x1="10" y1="14" x2="21" y2="3"></line>
				</svg>
				View Live Storefront
			</a>
		{/if}
	</div>

	<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
		{#if data.shops.length > 1}
			<form method="GET" class="space-y-1.5">
				<label for="shop" class="block text-xs tracking-wider text-white/60 uppercase"
					>Manage shop</label
				>
				<select
					id="shop"
					name="shop"
					class="input min-w-64 text-sm"
					value={data.shop?.id}
					onchange={(event) => event.currentTarget.form?.requestSubmit()}
				>
					{#each data.shops as ownedShop (ownedShop.id)}
						<option value={ownedShop.id}>{ownedShop.name}</option>
					{/each}
				</select>
			</form>
		{/if}
		<form method="POST" action="?/createShop" class="flex items-end gap-2">
			<div class="space-y-1.5">
				<label for="newShopName" class="block text-xs tracking-wider text-white/60 uppercase"
					>Add another shop</label
				>
				<input
					id="newShopName"
					name="name"
					required
					placeholder="New shop name"
					class="input text-sm"
				/>
			</div>
			<button type="submit" class="btn btn-primary text-sm">Add Shop</button>
		</form>
	</div>

	{#if data.shop}
		<div
			class="card bg-surface flex flex-col justify-between gap-4 border border-white/10 p-5 sm:flex-row sm:items-center"
		>
			<div>
				<div class="flex items-center gap-2">
					<h2 class="text-sm font-semibold text-white">Shop visibility</h2>
					<span
						class="rounded-full border px-2 py-0.5 text-[10px] font-semibold {data.shop.isActive
							? 'border-green-400/30 bg-green-400/10 text-green-300'
							: 'border-amber-400/30 bg-amber-400/10 text-amber-300'}"
					>
						{data.shop.isActive ? 'Published' : 'Unpublished'}
					</span>
				</div>
				<p class="mt-1 text-xs text-white/60">
					{data.shop.isActive
						? 'This shop is visible in the public shop directory.'
						: 'This shop is hidden from the public shop directory.'}
				</p>
			</div>
			<div class="flex flex-wrap gap-2">
				<form method="POST" action={data.shop.isActive ? '?/unpublishShop' : '?/publishShop'}>
					<input type="hidden" name="shopId" value={data.shop.id} />
					<button type="submit" class="btn btn-secondary text-sm">
						{data.shop.isActive ? 'Unpublish Shop' : 'Publish Shop'}
					</button>
				</form>
				{#if data.shops.length > 1}
					<form
						method="POST"
						action="?/deleteShop"
						onsubmit={(event) => {
							if (
								!confirm(
									`Permanently delete ${data.shop!.name}? Its products will also be removed.`
								)
							) {
								event.preventDefault();
							}
						}}
					>
						<input type="hidden" name="shopId" value={data.shop.id} />
						<button
							type="submit"
							class="btn border border-red-400/30 text-sm text-red-300 hover:bg-red-400/10"
						>
							Delete Shop
						</button>
					</form>
				{/if}
			</div>
		</div>
	{/if}
	{#if !data.shop}
		<div class="card bg-surface border border-white/10 p-12 text-center">
			<h2 class="text-lg font-semibold text-white">No Shop Registered</h2>
			<p class="mt-1 text-xs text-white/50">Please register your boutique shop first.</p>
		</div>
	{:else}
		<form
			method="POST"
			action="?/updateShop"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="card bg-surface space-y-6 border border-white/10 p-6 md:p-8"
		>
			<input type="hidden" name="shopId" value={data.shop.id} />

			<!-- Basic info -->
			<div class="space-y-4">
				<h2 class="font-heading border-b border-white/10 pb-2 text-base font-semibold text-white">
					Boutique Identity
				</h2>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="space-y-1.5 sm:col-span-2">
						<label for="name" class="text-xs font-medium tracking-wider text-white/70 uppercase"
							>Boutique Name
						</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							value={data.shop.name}
							class="input text-sm"
						/>
					</div>

					<div class="space-y-1.5 sm:col-span-2">
						<label for="tagline" class="text-xs font-medium tracking-wider text-white/70 uppercase"
							>Tagline</label
						>
						<input
							id="tagline"
							name="tagline"
							type="text"
							value={data.shop.tagline || ''}
							placeholder="e.g. Pure Himalayan Dhaka & Silk Heritage"
							class="input text-sm"
						/>
					</div>

					<div class="space-y-1.5 sm:col-span-2">
						<label
							for="description"
							class="text-xs font-medium tracking-wider text-white/70 uppercase"
							>Story & Description</label
						>
						<textarea
							id="description"
							name="description"
							rows="3"
							value={data.shop.description || ''}
							class="input py-2 text-sm leading-relaxed"></textarea>
					</div>
				</div>
			</div>

			<!-- Location & Contact -->
			<div class="space-y-4 border-t border-white/10 pt-4">
				<h2 class="font-heading border-b border-white/10 pb-2 text-base font-semibold text-white">
					Location & Contact
				</h2>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="space-y-1.5">
						<label for="phone" class="text-xs font-medium tracking-wider text-white/70 uppercase"
							>Store Phone</label
						>
						<input
							id="phone"
							name="phone"
							type="text"
							value={data.shop.phone || ''}
							placeholder="+977 81 520112"
							class="input font-mono text-sm"
						/>
					</div>

					<div class="space-y-1.5">
						<label for="location" class="text-xs font-medium tracking-wider text-white/70 uppercase"
							>City / Area</label
						>
						<input
							id="location"
							name="location"
							type="text"
							value={data.shop.location || ''}
							placeholder="Nepalgunj, Banke"
							class="input text-sm"
						/>
					</div>

					<div class="space-y-1.5 sm:col-span-2">
						<label for="address" class="text-xs font-medium tracking-wider text-white/70 uppercase"
							>Physical Address</label
						>
						<input
							id="address"
							name="address"
							type="text"
							value={data.shop.address || ''}
							placeholder="Tribhuvan Chowk, Ward No. 2, Nepalgunj"
							class="input text-sm"
						/>
					</div>
				</div>
			</div>

			<!-- Visual Assets -->
			<div class="space-y-4 border-t border-white/10 pt-4">
				<h2 class="font-heading border-b border-white/10 pb-2 text-base font-semibold text-white">
					Branding Media
				</h2>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="space-y-1.5">
						<label for="logoUrl" class="text-xs font-medium tracking-wider text-white/70 uppercase"
							>Logo Image URL</label
						>
						<input
							id="logoUrl"
							name="logoUrl"
							type="url"
							value={data.shop.logoUrl || ''}
							class="input text-sm"
						/>
					</div>

					<div class="space-y-1.5">
						<label
							for="bannerUrl"
							class="text-xs font-medium tracking-wider text-white/70 uppercase"
							>Cover Banner Image URL</label
						>
						<input
							id="bannerUrl"
							name="bannerUrl"
							type="url"
							value={data.shop.bannerUrl || ''}
							class="input text-sm"
						/>
					</div>
				</div>
			</div>

			<div class="flex justify-end border-t border-white/10 pt-4">
				<button
					type="submit"
					disabled={isSubmitting}
					class="btn btn-primary flex items-center gap-2 px-8 font-semibold"
				>
					{#if isSubmitting}
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"
						></div>
						Saving Changes...
					{:else}
						Save Profile Changes
					{/if}
				</button>
			</div>
		</form>
	{/if}
</div>
