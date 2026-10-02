<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resetPassword } from '$lib/auth-client';
	import { toast } from '$lib/stores/toast.svelte';

	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	const token = $derived(page.url.searchParams.get('token') ?? '');
	const accountMode = $derived(
		page.url.searchParams.get('mode') === 'owner' ? 'owner' : 'customer'
	);
	const loginHref = $derived(accountMode === 'owner' ? '/login?mode=owner' : '/login');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!token) {
			toast.error('Reset link is invalid', 'Request a new password reset link.');
			return;
		}
		if (password.length < 8) {
			toast.error('Password too short', 'Use at least 8 characters.');
			return;
		}
		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		loading = true;
		try {
			const result = await resetPassword({ newPassword: password, token });
			if (result.error) {
				toast.error('Password reset failed', result.error.message ?? 'Request a new reset link.');
				return;
			}
			toast.success('Password updated', 'Sign in with your new password.');
			await goto(loginHref);
		} catch {
			toast.error('Password reset failed', 'Request a new reset link and try again.');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Choose a New Password — ShowCase Shops</title>
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-black px-5 py-12 text-white">
	<section class="w-full max-w-md space-y-6">
		<a href={loginHref} class="text-gold text-sm hover:underline">← Back to sign in</a>
		<div>
			<p class="text-gold mb-2 text-xs font-semibold tracking-widest uppercase">ShowCase Shops</p>
			<h1 class="font-heading text-3xl font-bold">Choose a new password</h1>
			<p class="mt-2 text-sm text-white/60">
				Set a new password for your {accountMode === 'owner' ? 'shop owner' : 'customer'} account.
			</p>
		</div>
		{#if !token}
			<div
				class="rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100"
				role="alert"
			>
				This reset link is missing or invalid. Request a new one to continue.
			</div>
			<a
				href={accountMode === 'owner' ? '/forgot-password?mode=owner' : '/forgot-password'}
				class="btn btn-primary inline-flex">Request another link</a
			>
		{:else}
			<form onsubmit={handleSubmit} class="space-y-4">
				<div class="space-y-1.5">
					<label for="password" class="text-sm text-white/70">New password</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						class="input"
						autocomplete="new-password"
						minlength="8"
						required
					/>
				</div>
				<div class="space-y-1.5">
					<label for="confirmPassword" class="text-sm text-white/70">Confirm new password</label>
					<input
						id="confirmPassword"
						type="password"
						bind:value={confirmPassword}
						class="input"
						autocomplete="new-password"
						minlength="8"
						required
					/>
				</div>
				<button class="btn btn-primary w-full" type="submit" disabled={loading}>
					{loading ? 'Updating…' : 'Update password'}
				</button>
			</form>
		{/if}
	</section>
</main>
