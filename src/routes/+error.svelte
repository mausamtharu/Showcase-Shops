<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status}: Page Not Found — ShowCase Shops</title>
</svelte:head>

<div class="min-h-[80vh] flex items-center justify-center px-4 py-16">
	<div class="max-w-xl w-full text-center space-y-8">
		<!-- Error Code Badge -->
		<div class="relative inline-block">
			<div class="font-heading font-black text-8xl md:text-9xl text-white/10 select-none tracking-widest">
				{$page.status}
			</div>
			<div class="absolute inset-0 flex items-center justify-center">
				<span class="text-xs uppercase tracking-widest text-gold font-bold px-4 py-1 rounded-full bg-surface border border-gold/40 shadow-xl">
					{#if $page.status === 404}
						Boutique Not Found
					{:else}
						Service Interruption
					{/if}
				</span>
			</div>
		</div>

		<!-- Title & Message -->
		<div class="space-y-3">
			<h1 class="font-heading font-bold text-2xl md:text-4xl text-white">
				{#if $page.status === 404}
					Lost in the Luxury Showrooms?
				{:else}
					An Unexpected Encounter
				{/if}
			</h1>
			<p class="text-white/60 text-sm md:text-base leading-relaxed max-w-md mx-auto">
				{#if $page.status === 404}
					The page, collection, or boutique item you are looking for has been moved, curated into a new collection, or does not exist.
				{:else}
					{$page.error?.message || 'We encountered an unexpected issue while retrieving this collection. Please try again.'}
				{/if}
			</p>
		</div>

		<!-- Actions -->
		<div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
			<a href="/" class="btn btn-primary w-full sm:w-auto px-6 py-3 text-xs uppercase font-semibold tracking-wider flex items-center justify-center gap-2">
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
					<polyline points="9 22 9 12 15 12 15 22"></polyline>
				</svg>
				Return to Homepage
			</a>
			<a href="/products" class="btn btn-secondary w-full sm:w-auto px-6 py-3 text-xs uppercase font-semibold tracking-wider flex items-center justify-center gap-2">
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
				Explore Catalog
			</a>
		</div>

		<!-- Quick navigation shortcuts -->
		<div class="pt-8 border-t border-white/5 space-y-3">
			<span class="text-xs uppercase tracking-widest text-white/40 block">Popular Destinations</span>
			<div class="flex flex-wrap items-center justify-center gap-2 text-xs">
				<a href="/shops" class="px-3 py-1.5 rounded-lg bg-surface border border-white/10 text-white/70 hover:text-gold hover:border-gold/30 transition-all">
					Local Boutiques
				</a>
				<a href="/products?cat=Traditional%20Silks%20%26%20Attire" class="px-3 py-1.5 rounded-lg bg-surface border border-white/10 text-white/70 hover:text-gold hover:border-gold/30 transition-all">
					Traditional Silks
				</a>
				<a href="/products?cat=Fine%20Jewelry%20%26%20Gems" class="px-3 py-1.5 rounded-lg bg-surface border border-white/10 text-white/70 hover:text-gold hover:border-gold/30 transition-all">
					Fine Jewelry
				</a>
				<a href="/owner/dashboard" class="px-3 py-1.5 rounded-lg bg-surface border border-white/10 text-white/70 hover:text-gold hover:border-gold/30 transition-all">
					Owner Portal
				</a>
			</div>
		</div>
	</div>
</div>
