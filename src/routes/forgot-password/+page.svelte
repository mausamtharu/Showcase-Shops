<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { requestPasswordReset, resetPassword } from '$lib/auth-client';
	import { toast } from '$lib/stores/toast.svelte';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let sent = $state(false);
	const token = $derived(page.url.searchParams.get('token') ?? '');
	const accountMode = $derived(
		page.url.searchParams.get('mode') === 'owner' ? 'owner' : 'customer'
	);
	const loginHref = $derived(accountMode === 'owner' ? '/login?mode=owner' : '/login');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		loading = true;
		try {
			const result = await requestPasswordReset({
				email: email.trim(),
				redirectTo: resolve(`/forgot-password?mode=${accountMode}`)
			});
			if (result.error) {
				toast.error('Could not send reset link', result.error.message ?? 'Please try again.');
				return;
			}
			sent = true;
		} catch {
			toast.error('Could not send reset link', 'Please try again later.');
		} finally {
			loading = false;
		}
	}

	async function handlePasswordReset(event: SubmitEvent) {
		event.preventDefault();
		if (!token) return;
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
	<title>Forgot Password — ShowCase Shops</title>
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-black px-5 py-12 text-white">
	<section class="w-full max-w-md space-y-6">
		<a
			href={accountMode === 'owner' ? '/login?mode=owner' : '/login'}
			class="text-gold text-sm hover:underline"
			>← Back to {accountMode === 'owner' ? 'owner' : 'customer'} sign in</a
		>
		<div>
			<p class="text-gold mb-2 text-xs font-semibold tracking-widest uppercase">ShowCase Shops</p>
			<h1 class="font-heading text-3xl font-bold">
				{token ? 'Choose a new password' : 'Reset your password'}
			</h1>
			<p class="mt-2 text-sm text-white/60">
				{token
					? `Set a new password for your ${accountMode === 'owner' ? 'shop owner' : 'customer'} account.`
					: `Enter the email address for your ${accountMode === 'owner' ? 'shop owner' : 'customer'} account.`}
			</p>
		</div>
		{#if token}
			<form onsubmit={handlePasswordReset} class="space-y-4">
				<div class="space-y-1.5">
					<label for="newPassword" class="text-sm text-white/70">New password</label>
					<input
						id="newPassword"
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
		{:else if sent}
			<div
				class="rounded-lg border border-green-400/30 bg-green-400/10 p-4 text-sm text-green-200"
				role="status"
			>
				If an account matches that email, a secure link has been sent. Open it to enter and save
				your new password here. Check your inbox and spam folder; the link expires in one hour.
			</div>
		{:else}
			<form onsubmit={handleSubmit} class="space-y-4">
				<div class="space-y-1.5">
					<label for="email" class="text-sm text-white/70">Email address</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						class="input"
						autocomplete="email"
						required
					/>
				</div>
				<button class="btn btn-primary w-full" type="submit" disabled={loading}>
					{loading ? 'Sending…' : 'Send reset link'}
				</button>
			</form>
		{/if}
	</section>
</main>
