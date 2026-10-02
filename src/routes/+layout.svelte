<script lang="ts">
	import './layout.css';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import CartDrawer from '$lib/components/layout/CartDrawer.svelte';
	import ToastContainer from '$lib/components/layout/ToastContainer.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	const { children } = $props();

	// Routes that should not show the standard nav/footer (auth pages, etc.)
	const hideNavPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
	const hideNav = $derived(hideNavPaths.some((p) => $page.url.pathname.startsWith(p)));
</script>

<svelte:head>
	<title>ShowCase Shops — Premium E-Commerce Platform</title>
	<meta
		name="description"
		content="Discover premium products from local shops in Nepalgunj. Shop, compare and buy with ease on ShowCase Shops."
	/>
</svelte:head>

{#if !hideNav}
	<Navbar user={$page.data.user} />
{/if}

<main class={hideNav ? '' : 'pt-20'}>
	{@render children()}
</main>

{#if !hideNav}
	<Footer />
{/if}

<CartDrawer />
<ToastContainer />
