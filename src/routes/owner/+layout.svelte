<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ChevronDown, Store } from 'lucide-svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();

	const navItems = [
		{ href: '/owner/dashboard', label: 'Dashboard', icon: 'grid' },
		{ href: '/owner/products', label: 'Products', icon: 'package' },
		{ href: '/owner/orders', label: 'Orders', icon: 'file-text' },
		{ href: '/owner/shop', label: 'Shop Profile', icon: 'home' }
	];

	function isActive(href: string) {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	}

	function ownerHref(href: string) {
		return `${href}?shop=${data.selectedShop.id}`;
	}

	function selectShop(shopId: string) {
		const nextUrl = new URL($page.url);
		nextUrl.searchParams.set('shop', shopId);
		void goto(`${nextUrl.pathname}${nextUrl.search}`);
	}

	const icons: Record<string, string> = {
		grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
		package:
			'<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
		'file-text':
			'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
		home: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
	};
</script>

<div class="flex min-h-screen" style="background: var(--color-black);">
	<!-- Sidebar -->
	<aside
		class="sticky top-0 hidden h-screen min-h-screen w-64 flex-col border-r md:flex"
		style="background: var(--color-surface); border-color: var(--color-border);"
	>
		<!-- Logo -->
		<div class="border-b p-6" style="border-color: var(--color-border);">
			<a href="/" class="flex items-center gap-2">
				<div class="bg-gradient-gold flex h-8 w-8 items-center justify-center rounded-lg">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-black)">
						<path
							d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
							stroke="currentColor"
							stroke-width="2"
							fill="none"
						/>
						<path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none" />
					</svg>
				</div>
				<div>
					<div class="font-heading text-gradient-gold text-sm font-bold">ShowCase</div>
					<div class="text-xs" style="color: rgba(250,250,249,0.4);">Owner Panel</div>
				</div>
			</a>
		</div>

		<!-- Nav -->
		<nav class="flex-1 space-y-1 p-4">
			{#each navItems as item}
				<a
					href={ownerHref(item.href)}
					class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
					style={isActive(item.href)
						? 'background: rgba(212,175,55,0.12); color: var(--color-gold); border: 1px solid rgba(212,175,55,0.2);'
						: 'color: rgba(250,250,249,0.6); border: 1px solid transparent;'}
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						{@html icons[item.icon]}
					</svg>
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- Add Product Quick -->
		<div class="border-t p-4" style="border-color: var(--color-border);">
			<a href={ownerHref('/owner/products/new')} class="btn btn-primary w-full text-sm">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="12" y1="5" x2="12" y2="19" />
					<line x1="5" y1="12" x2="19" y2="12" />
				</svg>
				Add Product
			</a>
			<a href="/" class="btn btn-ghost mt-2 w-full text-center text-sm">← View Store</a>
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex min-w-0 flex-1 flex-col">
		<!-- Mobile Top Header -->
		<header
			class="bg-surface sticky top-0 z-30 flex items-center justify-between border-b border-white/10 p-4 md:hidden"
		>
			<a href="/" class="flex items-center gap-2">
				<div
					class="bg-gradient-gold flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-black"
				>
					SC
				</div>
				<span class="font-heading text-sm font-bold text-white">Owner Panel</span>
			</a>

			<div class="flex items-center gap-2">
				<a
					href={ownerHref('/owner/products/new')}
					class="btn btn-primary btn-sm px-3 py-1.5 text-xs"
				>
					+ Add
				</a>
				<a href="/" class="btn btn-secondary btn-sm px-2.5 py-1.5 text-xs"> Store </a>
			</div>
		</header>

		<!-- Mobile Navigation Bar -->
		<nav
			class="bg-surface-2 flex items-center justify-around overflow-x-auto border-b border-white/10 p-2 text-xs md:hidden"
		>
			{#each navItems as item}
				<a
					href={ownerHref(item.href)}
					class="rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors {isActive(item.href)
						? 'bg-gold/15 text-gold font-semibold'
						: 'text-white/60 hover:text-white'}"
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="flex-1">
			<div class="border-b border-white/10 bg-[#11110f] px-4 py-3 md:px-8">
				<div
					class="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
				>
					<div class="flex min-w-0 items-center gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c969]"
						>
							<Store size={18} strokeWidth={1.8} />
						</div>
						<div class="min-w-0">
							<div class="flex items-center gap-2">
								<span class="text-[10px] font-semibold tracking-[0.16em] text-[#c5aa59] uppercase">
									Managing shop
								</span>
								<span class="h-1 w-1 rounded-full bg-white/20"></span>
								<span class="truncate text-[10px] text-white/40">
									{data.selectedShop.isActive ? 'Published' : 'Unpublished'}
								</span>
							</div>
							<div class="truncate text-sm font-semibold text-white">
								{data.selectedShop.name}
							</div>
						</div>
					</div>

					<div class="flex items-center gap-3">
						<span class="hidden text-[11px] text-white/35 sm:inline">
							{data.shops.length}
							{data.shops.length === 1 ? 'shop' : 'shops'} in portfolio
						</span>
						<div class="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
							<label for="owner-shop-context" class="sr-only">Switch managed shop</label>
							<select
								id="owner-shop-context"
								class="w-full appearance-none rounded-lg border border-white/10 bg-white/[0.04] py-2.5 pr-10 pl-3 text-sm text-white transition-colors outline-none hover:border-[#d4af37]/40 focus:border-[#d4af37]/60 focus:ring-2 focus:ring-[#d4af37]/15"
								value={data.selectedShop.id}
								onchange={(event) => selectShop(event.currentTarget.value)}
							>
								{#each data.shops as ownedShop (ownedShop.id)}
									<option value={ownedShop.id}>{ownedShop.name}</option>
								{/each}
							</select>
							<ChevronDown
								size={15}
								strokeWidth={1.8}
								class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-white/45"
							/>
						</div>
						<a
							href={ownerHref('/owner/shop')}
							class="hidden text-xs font-medium text-white/55 transition-colors hover:text-[#e5c969] sm:inline"
						>
							Manage shops
						</a>
					</div>
				</div>
			</div>
			{@render children()}
		</div>
	</div>
</div>
