<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { signUp } from '$lib/auth-client';
	import { toast } from '$lib/stores/toast.svelte';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let loading = $state(false);
	let acceptTerms = $state(false);
	let shopName = $state('');
	let ownerAccountCreated = $state(false);
	const accountMode = $derived(
		page.url.searchParams.get('mode') === 'owner' ? 'owner' : 'customer'
	);

	async function finishOwnerShopSetup() {
		const response = await fetch(resolve('/api/owner/shops'), {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ name: shopName })
		});
		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			toast.error('Shop setup incomplete', result.error ?? 'Please try again.');
			return false;
		}
		window.location.assign(resolve('/owner/dashboard'));
		return true;
	}

	async function handleRegister(e: Event) {
		e.preventDefault();
		if (accountMode === 'owner' && !shopName.trim()) {
			toast.error('Shop name required', 'Enter the name of your first shop.');
			return;
		}
		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}
		if (!acceptTerms) {
			toast.warning('Please accept the terms');
			return;
		}
		loading = true;
		try {
			if (accountMode === 'owner' && ownerAccountCreated) {
				await finishOwnerShopSetup();
			} else {
				const result = await signUp.email({ name, email, password });
				if (result.error) {
					toast.error('Registration failed', result.error.message ?? 'Please try again.');
				} else if (accountMode === 'owner') {
					ownerAccountCreated = true;
					await finishOwnerShopSetup();
				} else {
					toast.success('Account created!', 'Welcome to ShowCase Shops');
					await goto('/');
				}
			}
		} catch {
			toast.error('Something went wrong', 'Please try again.');
		} finally {
			loading = false;
		}
	}

	const passwordStrength = $derived(() => {
		if (!password) return 0;
		let score = 0;
		if (password.length >= 8) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;
		return score;
	});

	const strengthLabel = $derived(() => {
		const s = passwordStrength();
		if (s === 0) return '';
		if (s === 1) return 'Weak';
		if (s === 2) return 'Fair';
		if (s === 3) return 'Good';
		return 'Strong';
	});

	const strengthColor = $derived(() => {
		const s = passwordStrength();
		if (s <= 1) return '#ef4444';
		if (s === 2) return '#f59e0b';
		if (s === 3) return '#22c55e';
		return '#d4af37';
	});
</script>

<svelte:head>
	<title>Create Account — ShowCase Shops</title>
</svelte:head>

<div class="flex min-h-screen" style="background: var(--color-black);">
	<!-- Left Branding Panel -->
	<div
		class="relative hidden w-[45%] flex-col justify-between overflow-hidden p-12 lg:flex"
		style="background: linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 100%); border-right: 1px solid var(--color-border);"
	>
		<div
			class="absolute inset-0 opacity-5"
			style="background-image: linear-gradient(var(--color-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold) 1px, transparent 1px); background-size: 60px 60px;"
		></div>

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

		<div class="relative z-10">
			<h1 class="font-display mb-6 text-5xl leading-tight font-bold">
				Join the<br />
				<span class="text-gradient-gold">Community</span>
			</h1>
			<p class="mb-10 text-lg leading-relaxed" style="color: rgba(250,250,249,0.5);">
				Create your free account and access thousands of premium products from local shops in
				Nepalgunj.
			</p>

			<!-- Benefits -->
			<div class="space-y-4">
				{#each [{ icon: '🛍️', text: 'Access 10,000+ premium products' }, { icon: '🚀', text: 'Fast delivery across Banke district' }, { icon: '💳', text: 'Secure payments via eSewa & Khalti' }, { icon: '⭐', text: 'Exclusive deals for members' }] as benefit}
					<div class="flex items-center gap-3">
						<span class="text-xl">{benefit.icon}</span>
						<span class="text-sm" style="color: rgba(250,250,249,0.6);">{benefit.text}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Form Panel -->
	<div class="flex flex-1 items-center justify-center overflow-y-auto p-6 lg:p-12">
		<div class="w-full max-w-md py-8">
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
				{accountMode === 'owner' ? 'Open Your Shop' : 'Create Account'}
			</h2>
			<p class="mb-8 text-sm" style="color: rgba(250,250,249,0.5);">
				Already have an account?
				<a
					href={accountMode === 'owner' ? '/login?mode=owner' : '/login'}
					class="text-gold ml-1 font-medium hover:underline">Sign in</a
				>
			</p>

			<div
				class="mb-6 grid grid-cols-2 gap-1 rounded-xl p-1"
				style="background: var(--color-surface); border: 1px solid var(--color-border);"
			>
				<a
					href="/register"
					class="rounded-lg px-3 py-2.5 text-center text-sm font-medium"
					style={accountMode === 'customer'
						? 'background: var(--color-gold); color: var(--color-black);'
						: 'color: rgba(250,250,249,0.6);'}>Customer</a
				>
				<a
					href="/register?mode=owner"
					class="rounded-lg px-3 py-2.5 text-center text-sm font-medium"
					style={accountMode === 'owner'
						? 'background: var(--color-gold); color: var(--color-black);'
						: 'color: rgba(250,250,249,0.6);'}>Shop Owner</a
				>
			</div>

			<form onsubmit={handleRegister} class="space-y-5">
				{#if accountMode === 'owner'}
					<div class="space-y-1.5">
						<label
							for="shopName"
							class="block text-sm font-medium"
							style="color: rgba(250,250,249,0.7);">First Shop Name</label
						>
						<input
							id="shopName"
							type="text"
							bind:value={shopName}
							placeholder="e.g. Himalayan Handcrafts"
							class="input"
							required
							disabled={ownerAccountCreated}
						/>
					</div>
				{/if}
				<div class="space-y-1.5">
					<label for="name" class="block text-sm font-medium" style="color: rgba(250,250,249,0.7);"
						>Full Name</label
					>
					<input
						id="name"
						type="text"
						bind:value={name}
						placeholder="Mausam Tharu"
						class="input"
						required
					/>
				</div>

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

				<div class="space-y-1.5">
					<label
						for="password"
						class="block text-sm font-medium"
						style="color: rgba(250,250,249,0.7);">Password</label
					>
					<div class="relative">
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder="Min. 8 characters"
							class="input pr-12"
							required
							minlength="8"
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center"
							style="color: rgba(250,250,249,0.4);"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								{#if showPassword}
									<path
										d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
									/><line x1="1" y1="1" x2="23" y2="23" />
								{:else}
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle
										cx="12"
										cy="12"
										r="3"
									/>
								{/if}
							</svg>
						</button>
					</div>
					{#if password}
						<div class="space-y-1">
							<div class="mt-2 flex gap-1">
								{#each Array(4) as _, i}
									<div
										class="h-1.5 flex-1 rounded-full transition-all duration-300"
										style="background: {i < passwordStrength()
											? strengthColor()
											: 'var(--color-border)'};"
									></div>
								{/each}
							</div>
							<p class="text-xs font-medium" style="color: {strengthColor()};">{strengthLabel()}</p>
						</div>
					{/if}
				</div>

				<div class="space-y-1.5">
					<label
						for="confirm"
						class="block text-sm font-medium"
						style="color: rgba(250,250,249,0.7);">Confirm Password</label
					>
					<input
						id="confirm"
						type="password"
						bind:value={confirmPassword}
						placeholder="Repeat password"
						class="input"
						class:border-red-500={confirmPassword && confirmPassword !== password}
						required
					/>
					{#if confirmPassword && confirmPassword !== password}
						<p class="text-xs text-red-400">Passwords do not match</p>
					{/if}
				</div>

				<label class="group flex cursor-pointer items-start gap-3">
					<input type="checkbox" bind:checked={acceptTerms} class="sr-only" />
					<div
						class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-200"
						style={acceptTerms
							? 'background: var(--color-gold); border-color: var(--color-gold);'
							: 'background: var(--color-surface-2); border-color: var(--color-border);'}
					>
						{#if acceptTerms}
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="var(--color-black)"
								stroke-width="3"
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						{/if}
					</div>
					<span class="text-sm" style="color: rgba(250,250,249,0.6);">
						I agree to the
						<a href="/terms" class="text-gold hover:underline">Terms of Service</a> and
						<a href="/privacy" class="text-gold hover:underline">Privacy Policy</a>
					</span>
				</label>

				<button
					type="submit"
					class="btn btn-primary btn-lg w-full"
					disabled={loading || !acceptTerms}
				>
					{#if loading}
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
						></div>
						Creating Account...
					{:else}
						Create Account
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
		</div>
	</div>
</div>
