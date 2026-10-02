<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { cart } from '../../stores/cart.svelte';
	import { wishlist } from '../../stores/wishlist.svelte';
	import { signOut } from '../../auth-client';
	import { toast } from '../../stores/toast.svelte';
	import type { User } from 'better-auth';

	let { user: initialUser }: { user?: User | null } = $props();
	let isSignedOut = $state(false);
	let user = $derived(isSignedOut ? null : initialUser);

	let isScrolled = $state(false);
	let isMobileMenuOpen = $state(false);
	let isUserMenuOpen = $state(false);
	let searchQuery = $state('');

	$effect(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function handleSearch(e: Event) {
		e.preventDefault();
		if (searchQuery.trim()) {
			goto(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
			isMobileMenuOpen = false;
		}
	}

	async function handleSignOut() {
		try {
			const result = await signOut();
			if (result.error) {
				toast.error('Sign out failed', result.error.message ?? 'Please try again.');
				return;
			}

			isSignedOut = true;
			isUserMenuOpen = false;
			await goto('/');
		} catch {
			toast.error('Sign out failed', 'Please check your connection and try again.');
		}
	}

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/products', label: 'Shop' },
		{ href: '/shops', label: 'Explore' }
	];

	function isActive(href: string) {
		if (href === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(href);
	}
</script>

<nav
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
	class:glass-dark={isScrolled}
	class:py-2={isScrolled}
	class:py-4={!isScrolled}
	style="border-bottom: 1px solid {isScrolled ? 'var(--color-border)' : 'transparent'}"
>
	<div class="container flex items-center gap-6">
		<!-- Logo -->
		<a href="/" class="group flex shrink-0 items-center gap-2">
			<div
				class="bg-gradient-gold shadow-gold flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-black)">
					<path
						d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
						stroke="currentColor"
						stroke-width="2"
						fill="none"
					/>
					<path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none" />
				</svg>
			</div>
			<span
				class="font-heading text-xl font-bold tracking-tight"
				style="background: linear-gradient(135deg, #fafaf9 0%, #d4af37 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
			>
				ShowCase
			</span>
		</a>

		<!-- Desktop Nav Links -->
		<div class="hidden flex-1 items-center gap-1 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
					class:text-gold={isActive(link.href)}
					class:bg-gold={isActive(link.href)}
					style={isActive(link.href)
						? 'background: rgba(212,175,55,0.1); color: var(--color-gold);'
						: 'color: rgba(250,250,249,0.7);'}
					onmouseenter={(e) => {
						if (!isActive(link.href)) {
							(e.target as HTMLElement).style.color = 'var(--color-white)';
							(e.target as HTMLElement).style.background = 'var(--color-surface-2)';
						}
					}}
					onmouseleave={(e) => {
						if (!isActive(link.href)) {
							(e.target as HTMLElement).style.color = 'rgba(250,250,249,0.7)';
							(e.target as HTMLElement).style.background = 'transparent';
						}
					}}
				>
					{link.label}
				</a>
			{/each}
		</div>

		<!-- Search Bar -->
		<form
			onsubmit={handleSearch}
			class="bg-surface-2 focus-within:border-gold focus-within:shadow-gold hidden max-w-sm flex-1 items-center gap-2 rounded-xl border px-4 py-2.5 transition-all duration-200 lg:flex"
			style="border-color: var(--color-border);"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="rgba(250,250,249,0.4)"
				stroke-width="2"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="M21 21l-4.35-4.35" />
			</svg>
			<input
				type="search"
				placeholder="Search products..."
				bind:value={searchQuery}
				class="flex-1 bg-transparent text-sm outline-none placeholder:text-white/30"
				style="color: var(--color-white);"
			/>
		</form>

		<!-- Right Actions -->
		<div class="ml-auto flex items-center gap-2 md:ml-0">
			<!-- Wishlist -->
			<a
				href="/account/wishlist"
				class="relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200"
				style="background: var(--color-surface-2); border: 1px solid var(--color-border);"
				title="Wishlist"
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="rgba(250,250,249,0.7)"
					stroke-width="2"
				>
					<path
						d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
					/>
				</svg>
				{#if wishlist.count > 0}
					<span
						class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
						style="background: var(--color-gold); color: var(--color-black);"
					>
						{wishlist.count}
					</span>
				{/if}
			</a>

			<!-- Cart -->
			<button
				onclick={() => cart.openDrawer()}
				class="hover:border-gold relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200"
				style="background: var(--color-surface-2); border: 1px solid var(--color-border);"
				title="Cart"
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="rgba(250,250,249,0.7)"
					stroke-width="2"
				>
					<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
					<line x1="3" y1="6" x2="21" y2="6" />
					<path d="M16 10a4 4 0 01-8 0" />
				</svg>
				{#if cart.count > 0}
					<span
						class="animate-pulse-gold absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
						style="background: var(--color-gold); color: var(--color-black);"
					>
						{cart.count}
					</span>
				{/if}
			</button>

			<!-- User Menu -->
			{#if user}
				<div class="relative">
					<button
						onclick={() => (isUserMenuOpen = !isUserMenuOpen)}
						class="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200"
						style="background: var(--color-surface-2); border: 1px solid var(--color-border);"
					>
						<div
							class="bg-gradient-gold flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
							style="color: var(--color-black);"
						>
							{user.name?.[0]?.toUpperCase() ?? 'U'}
						</div>
						<span class="hidden max-w-24 truncate text-sm font-medium md:block"
							>{user.name ?? 'Account'}</span
						>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="transition-transform duration-200"
							style="transform: rotate({isUserMenuOpen ? 180 : 0}deg)"
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</button>

					{#if isUserMenuOpen}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="fixed inset-0 z-40"
							onclick={() => (isUserMenuOpen = false)}
							onkeydown={() => {}}
						></div>
						<div
							class="shadow-elevated animate-fade-in-scale absolute top-full right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl"
							style="background: var(--color-surface); border: 1px solid var(--color-border);"
						>
							<div class="border-b p-3" style="border-color: var(--color-border);">
								<p class="text-xs font-medium tracking-wider text-white/40 uppercase">
									Signed in as
								</p>
								<p class="mt-0.5 truncate text-sm font-semibold">{user.name}</p>
								<p class="truncate text-xs text-white/40">{user.email}</p>
							</div>
							<div class="p-1.5">
								<a
									href="/account/orders"
									class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150"
									style="color: rgba(250,250,249,0.8)"
									onmouseenter={(e) =>
										((e.target as HTMLElement).style.background = 'var(--color-surface-2)')}
									onmouseleave={(e) => ((e.target as HTMLElement).style.background = 'transparent')}
									onclick={() => (isUserMenuOpen = false)}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline
											points="14 2 14 8 20 8"
										/></svg
									>
									My Orders
								</a>
								<a
									href="/account/wishlist"
									class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150"
									style="color: rgba(250,250,249,0.8)"
									onmouseenter={(e) =>
										((e.target as HTMLElement).style.background = 'var(--color-surface-2)')}
									onmouseleave={(e) => ((e.target as HTMLElement).style.background = 'transparent')}
									onclick={() => (isUserMenuOpen = false)}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										><path
											d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
										/></svg
									>
									Wishlist
								</a>
								<a
									href="/owner/dashboard"
									class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150"
									style="color: rgba(250,250,249,0.8)"
									onmouseenter={(e) =>
										((e.target as HTMLElement).style.background = 'var(--color-surface-2)')}
									onmouseleave={(e) => ((e.target as HTMLElement).style.background = 'transparent')}
									onclick={() => (isUserMenuOpen = false)}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										><rect x="3" y="3" width="7" height="7" /><rect
											x="14"
											y="3"
											width="7"
											height="7"
										/><rect x="14" y="14" width="7" height="7" /><rect
											x="3"
											y="14"
											width="7"
											height="7"
										/></svg
									>
									Owner Dashboard
								</a>
							</div>
							<div class="border-t p-1.5" style="border-color: var(--color-border);">
								<button
									onclick={handleSignOut}
									class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors duration-150"
									onmouseenter={(e) =>
										((e.target as HTMLElement).style.background = 'rgba(239,68,68,0.1)')}
									onmouseleave={(e) => ((e.target as HTMLElement).style.background = 'transparent')}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline
											points="16 17 21 12 16 7"
										/><line x1="21" y1="12" x2="9" y2="12" /></svg
									>
									Sign Out
								</button>
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<a href="/login" class="btn btn-primary btn-sm hidden md:inline-flex">Sign In</a>
				<button
					onclick={() => goto('/login')}
					class="flex h-10 w-10 items-center justify-center rounded-xl md:hidden"
					style="background: var(--color-surface-2); border: 1px solid var(--color-border);"
					aria-label="Sign in"
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="rgba(250,250,249,0.7)"
						stroke-width="2"
					>
						<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
						<circle cx="12" cy="7" r="4" />
					</svg>
				</button>
			{/if}

			<!-- Mobile Menu Toggle -->
			<button
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
				class="flex h-10 w-10 items-center justify-center rounded-xl md:hidden"
				style="background: var(--color-surface-2); border: 1px solid var(--color-border);"
				aria-label="Toggle mobile menu"
			>
				<div class="flex h-4 w-5 flex-col justify-between">
					<span
						class="block h-0.5 rounded-full transition-all duration-300"
						style="background: rgba(250,250,249,0.7); transform-origin: left; transform: rotate({isMobileMenuOpen
							? '45deg'
							: '0'}) translateY({isMobileMenuOpen ? '0' : '0'})"
					></span>
					<span
						class="block h-0.5 rounded-full transition-all duration-300"
						style="background: rgba(250,250,249,0.7); opacity: {isMobileMenuOpen ? 0 : 1};"
					></span>
					<span
						class="block h-0.5 rounded-full transition-all duration-300"
						style="background: rgba(250,250,249,0.7); transform-origin: left; transform: rotate({isMobileMenuOpen
							? '-45deg'
							: '0'})"
					></span>
				</div>
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isMobileMenuOpen}
		<div
			class="animate-slide-in-up border-t md:hidden"
			style="background: var(--color-surface); border-color: var(--color-border);"
		>
			<!-- Mobile Search -->
			<form onsubmit={handleSearch} class="px-4 pt-4">
				<div
					class="flex items-center gap-2 rounded-xl border px-4 py-3"
					style="background: var(--color-surface-2); border-color: var(--color-border);"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="rgba(250,250,249,0.4)"
						stroke-width="2"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="M21 21l-4.35-4.35" />
					</svg>
					<input
						type="search"
						placeholder="Search products..."
						bind:value={searchQuery}
						class="flex-1 bg-transparent text-sm outline-none placeholder:text-white/30"
						style="color: var(--color-white);"
					/>
				</div>
			</form>

			<!-- Mobile Nav Links -->
			<div class="flex flex-col gap-1 p-4">
				{#each navLinks as link}
					<a
						href={link.href}
						class="rounded-xl px-4 py-3 text-sm font-medium transition-all"
						style={isActive(link.href)
							? 'background: rgba(212,175,55,0.1); color: var(--color-gold);'
							: 'color: rgba(250,250,249,0.7);'}
						onclick={() => (isMobileMenuOpen = false)}
					>
						{link.label}
					</a>
				{/each}
				{#if !user}
					<a href="/login" class="btn btn-primary mt-2" onclick={() => (isMobileMenuOpen = false)}>
						Sign In
					</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>
