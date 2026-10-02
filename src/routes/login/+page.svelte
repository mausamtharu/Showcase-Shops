<script lang="ts">
	import { page } from '$app/state';
	import { signIn } from '$lib/auth-client';
	import { toast } from '$lib/stores/toast.svelte';
	import { resolve } from '$app/paths';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let showPassword = $state(false);
	const accountMode = $derived(
		page.url.searchParams.get('mode') === 'owner' ? 'owner' : 'customer'
	);
	const ownerNeedsShop = $derived(
		accountMode === 'owner' && page.url.searchParams.get('error') === 'no-shop'
	);

	async function handleLogin(e: Event) {
		e.preventDefault();
		if (!email || !password) return;
		loading = true;
		try {
			const result = await signIn.email({ email, password });
			if (result.error) {
				toast.error('Login failed', result.error.message ?? 'Invalid credentials');
			} else {
				toast.success(
					accountMode === 'owner' ? 'Owner signed in' : 'Welcome back!',
					'Redirecting...'
				);
				window.location.assign(resolve(accountMode === 'owner' ? '/owner/dashboard' : '/'));
			}
		} catch (err) {
			toast.error('Something went wrong', 'Please try again.');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign In — ShowCase Shops</title>
</svelte:head>

<div class="flex min-h-screen" style="background: var(--color-black);">
	<!-- Left Panel - Branding -->
	<div
		class="relative hidden w-[45%] flex-col justify-between overflow-hidden p-12 lg:flex"
		style="background: linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0) 100%); border-right: 1px solid var(--color-border);"
	>
		<!-- BG decoration -->
		<div
			class="absolute inset-0 opacity-5"
			style="background-image: linear-gradient(var(--color-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold) 1px, transparent 1px); background-size: 60px 60px;"
		></div>
		<div
			class="absolute bottom-0 left-0 h-96 w-96 rounded-full opacity-5"
			style="background: radial-gradient(circle, var(--color-gold), transparent 70%); transform: translate(-50%, 50%); filter: blur(40px);"
		></div>

		<!-- Logo -->
		<div class="relative z-10 flex items-center gap-3">
			<div
				class="bg-gradient-gold shadow-gold flex h-10 w-10 items-center justify-center rounded-xl"
			>
				<svg width="22" height="22" viewBox="0 0 24 24" fill="var(--color-black)">
					<path
						d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
						stroke="currentColor"
						stroke-width="2"
						fill="none"
					/>
					<path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none" />
				</svg>
			</div>
			<span class="font-heading text-gradient-gold text-2xl font-bold">ShowCase</span>
		</div>

		<!-- Content -->
		<div class="relative z-10">
			<h1 class="font-display mb-6 text-5xl leading-tight font-bold">
				Welcome<br />
				<span class="text-gradient-gold">Back</span>
			</h1>
			<p class="mb-10 text-lg leading-relaxed" style="color: rgba(250,250,249,0.5);">
				Sign in to access your orders, wishlist, and exclusive deals from the finest shops in
				Nepalgunj.
			</p>

			<!-- Testimonial -->
			<div class="glass rounded-2xl p-6">
				<div class="mb-4 flex items-center gap-3">
					<div
						class="bg-gradient-gold flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
						style="color: var(--color-black);"
					>
						M
					</div>
					<div>
						<p class="text-sm font-semibold">Mausam Tharu</p>
						<p class="text-xs" style="color: rgba(250,250,249,0.4);">Regular Customer</p>
					</div>
					<div class="ml-auto flex gap-0.5">
						{#each Array(5) as _}
							<svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-gold)"
								><polygon
									points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
								/></svg
							>
						{/each}
					</div>
				</div>
				<p class="text-sm italic" style="color: rgba(250,250,249,0.6);">
					"ShowCase Shops made it incredibly easy to find authentic local products. The checkout
					with eSewa was seamless!"
				</p>
			</div>
		</div>
	</div>

	<!-- Right Panel - Form -->
	<div class="flex flex-1 items-center justify-center p-6 lg:p-12">
		<div class="w-full max-w-md">
			<!-- Mobile Logo -->
			<div class="mb-8 flex items-center gap-2 lg:hidden">
				<div class="bg-gradient-gold flex h-9 w-9 items-center justify-center rounded-lg">
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
				<span class="font-heading text-gradient-gold text-xl font-bold">ShowCase</span>
			</div>

			<h2 class="font-display mb-2 text-3xl font-bold">
				{accountMode === 'owner' ? 'Shop Owner Sign In' : 'Customer Sign In'}
			</h2>
			<p class="mb-8 text-sm" style="color: rgba(250,250,249,0.5);">
				{#if accountMode === 'customer'}
					Don't have an account?
					<a href="/register" class="text-gold ml-1 font-medium hover:underline">Create one free</a>
				{:else}
					Sign in with your shop-owner account. New owner?
					<a href="/register?mode=owner" class="text-gold ml-1 font-medium hover:underline"
						>Register your first shop</a
					>
				{/if}
			</p>

			<div
				class="mb-6 grid grid-cols-2 gap-1 rounded-xl p-1"
				style="background: var(--color-surface); border: 1px solid var(--color-border);"
			>
				<a
					href="/login"
					class="rounded-lg px-3 py-2.5 text-center text-sm font-medium transition-colors"
					style={accountMode === 'customer'
						? 'background: var(--color-gold); color: var(--color-black);'
						: 'color: rgba(250,250,249,0.6);'}>Customer</a
				>
				<a
					href="/login?mode=owner"
					class="rounded-lg px-3 py-2.5 text-center text-sm font-medium transition-colors"
					style={accountMode === 'owner'
						? 'background: var(--color-gold); color: var(--color-black);'
						: 'color: rgba(250,250,249,0.6);'}>Shop Owner</a
				>
			</div>
			{#if ownerNeedsShop}
				<p
					class="mb-5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200"
					role="status"
				>
					This account has no shop linked yet.
					<a href="/register?mode=owner" class="font-semibold underline">Register your first shop</a
					>
					to open the owner dashboard.
				</p>
			{/if}

			<form onsubmit={handleLogin} class="space-y-5">
				<!-- Email -->
				<div class="space-y-1.5">
					<label for="email" class="block text-sm font-medium" style="color: rgba(250,250,249,0.7);"
						>Email Address</label
					>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						class="input"
						required
						autocomplete="email"
					/>
				</div>

				<!-- Password -->
				<div class="space-y-1.5">
					<div class="flex items-center justify-between">
						<label
							for="password"
							class="block text-sm font-medium"
							style="color: rgba(250,250,249,0.7);">Password</label
						>
						<a
							href={accountMode === 'owner' ? '/forgot-password?mode=owner' : '/forgot-password'}
							class="text-gold text-xs hover:underline">Forgot password?</a
						>
					</div>
					<div class="relative">
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder="••••••••"
							class="input pr-12"
							required
							autocomplete="current-password"
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition-colors"
							style="color: rgba(250,250,249,0.4);"
						>
							{#if showPassword}
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									><path
										d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
									/><line x1="1" y1="1" x2="23" y2="23" /></svg
								>
							{:else}
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle
										cx="12"
										cy="12"
										r="3"
									/></svg
								>
							{/if}
						</button>
					</div>
				</div>

				<button type="submit" class="btn btn-primary btn-lg w-full" disabled={loading}>
					{#if loading}
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
						></div>
						Signing In...
					{:else}
						Sign In
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<polyline points="9 18 15 12 9 6" />
						</svg>
					{/if}
				</button>
			</form>

			<!-- Divider -->
			<div class="my-6 flex items-center gap-4">
				<div class="h-px flex-1" style="background: var(--color-border);"></div>
				<span class="text-xs font-medium" style="color: rgba(250,250,249,0.3);"
					>OR CONTINUE WITH</span
				>
				<div class="h-px flex-1" style="background: var(--color-border);"></div>
			</div>

			<!-- Social Buttons (UI only) -->
			<div class="grid grid-cols-2 gap-3">
				<button class="btn btn-ghost flex items-center justify-center gap-2">
					<svg width="18" height="18" viewBox="0 0 24 24">
						<path
							fill="#4285F4"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="#34A853"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="#FBBC05"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="#EA4335"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					Google
				</button>
				<button class="btn btn-ghost flex items-center justify-center gap-2">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="white">
						<path
							d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
						/>
					</svg>
					Facebook
				</button>
			</div>

			<p class="mt-6 text-center text-xs" style="color: rgba(250,250,249,0.3);">
				By signing in, you agree to our
				<a href="/terms" class="text-gold hover:underline">Terms of Service</a> and
				<a href="/privacy" class="text-gold hover:underline">Privacy Policy</a>
			</p>
		</div>
	</div>
</div>
