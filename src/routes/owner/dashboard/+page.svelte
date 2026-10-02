<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { formatPrice, formatRelativeTime } from '$lib/utils';

	let { data }: { data: PageData } = $props();

	const stats = $derived([
		{
			label: 'Total Revenue',
			value: formatPrice(data.stats.totalRevenue),
			change: data.stats.totalOrders ? `${data.stats.totalOrders} orders` : 'No sales yet',
			up: true,
			icon: '💰'
		},
		{
			label: 'Total Orders',
			value: String(data.stats.totalOrders),
			change: data.statusCounts.pending
				? `${data.statusCounts.pending} pending`
				: 'No pending orders',
			up: true,
			icon: '📦'
		},
		{
			label: 'Active Products',
			value: String(data.stats.totalProducts),
			change: 'Selected shop',
			up: true,
			icon: '🛍️'
		},
		{
			label: 'Low Stock Alerts',
			value: String(data.stats.lowStockCount),
			change: data.stats.lowStockCount > 0 ? 'needs attention' : 'healthy',
			up: data.stats.lowStockCount === 0,
			icon: '⚠️'
		}
	]);

	const statusColor: Record<string, string> = {
		pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
		processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
		shipped: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
		delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
		cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
	};

	let lineCanvas = $state<HTMLCanvasElement>();
	let doughnutCanvas = $state<HTMLCanvasElement>();

	onMount(async () => {
		const { Chart, registerables } = await import('chart.js');
		Chart.register(...registerables);

		// Revenue Line Chart
		if (lineCanvas) {
			const labels = data.revenueByDay.map((day) => day.label);
			const salesData = data.revenueByDay.map((day) => day.revenue);
			const ordersData = data.revenueByDay.map((day) => day.orders);

			new Chart(lineCanvas, {
				type: 'line',
				data: {
					labels,
					datasets: [
						{
							label: 'Revenue (NPR)',
							data: salesData,
							borderColor: '#d4af37',
							backgroundColor: 'rgba(212,175,55,0.08)',
							tension: 0.4,
							fill: true,
							pointBackgroundColor: '#d4af37',
							pointRadius: 4,
							pointHoverRadius: 6
						},
						{
							label: 'Orders',
							data: ordersData,
							yAxisID: 'y1',
							borderColor: '#38bdf8',
							backgroundColor: 'transparent',
							tension: 0.4,
							fill: false,
							borderDash: [5, 5],
							pointRadius: 0
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { display: false },
						tooltip: {
							backgroundColor: '#161616',
							borderColor: '#222',
							borderWidth: 1,
							titleColor: '#fafaf9',
							bodyColor: 'rgba(250,250,249,0.6)',
							callbacks: {
								label: (ctx) => {
									const val = ctx.parsed.y ?? 0;
									if (ctx.datasetIndex === 0) return ` NPR ${val.toLocaleString()}`;
									return ` ${val.toFixed(0)} orders`;
								}
							}
						}
					},
					scales: {
						x: {
							grid: { color: 'rgba(255,255,255,0.05)' },
							ticks: { color: 'rgba(250,250,249,0.4)', font: { size: 12 } }
						},
						y: {
							beginAtZero: true,
							grid: { color: 'rgba(255,255,255,0.05)' },
							ticks: {
								color: 'rgba(250,250,249,0.4)',
								font: { size: 11 },
								callback: (v) => `₨${(Number(v) / 1000).toFixed(0)}K`
							}
						},
						y1: {
							beginAtZero: true,
							position: 'right',
							grid: { drawOnChartArea: false },
							ticks: { color: 'rgba(56,189,248,0.8)', precision: 0 }
						}
					}
				}
			});
		}

		// Doughnut Chart
		if (doughnutCanvas) {
			const sc = data.statusCounts;
			const counts = [sc.delivered, sc.processing, sc.shipped, sc.pending];

			new Chart(doughnutCanvas, {
				type: 'doughnut',
				data: {
					labels: ['Delivered', 'Processing', 'Shipped', 'Pending'],
					datasets: [
						{
							data: counts,
							backgroundColor: ['#22c55e', '#a855f7', '#3b82f6', '#f59e0b'],
							borderColor: '#111',
							borderWidth: 3
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					cutout: '72%',
					plugins: {
						legend: {
							position: 'bottom',
							labels: { color: 'rgba(250,250,249,0.6)', padding: 16, font: { size: 12 } }
						}
					}
				}
			});
		}
	});
</script>

<svelte:head>
	<title>Dashboard — Owner Panel | ShowCase Shops</title>
</svelte:head>

{#key data.shop?.id}
	<div class="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
		<!-- Header -->
		<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<div class="flex items-center gap-2">
					<h1 class="font-heading text-3xl font-bold text-white">Owner Dashboard</h1>
					{#if data.shop}
						<span
							class="bg-gold/10 text-gold border-gold/30 rounded-full border px-2.5 py-0.5 text-xs"
						>
							{data.shop.name}
						</span>
					{/if}
				</div>
				<p class="mt-1 text-xs text-white/50 md:text-sm">
					Welcome back, {data.user?.name ?? 'Boutique Owner'} 👋 • Real-time overview of sales & inventory
				</p>
			</div>
			<div class="flex items-center gap-3">
				<a
					href="/owner/products/new?shop={data.shop?.id}"
					class="btn btn-primary flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
					>
						<line x1="12" y1="5" x2="12" y2="19" />
						<line x1="5" y1="12" x2="19" y2="12" />
					</svg>
					Add Product
				</a>
				<a href="/owner/orders?shop={data.shop?.id}" class="btn btn-secondary px-4 py-2.5 text-xs">
					View Orders
				</a>
			</div>
		</div>

		<!-- Stat Cards -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each stats as stat}
				<div
					class="card bg-surface hover:border-gold/40 border border-white/10 p-6 transition-all duration-300"
				>
					<div class="mb-4 flex items-start justify-between">
						<div class="text-2xl">{stat.icon}</div>
						<span
							class="rounded-full px-2 py-0.5 text-xs font-bold {stat.up
								? 'bg-green-500/10 text-green-400'
								: 'bg-red-500/10 text-red-400'}"
						>
							{stat.change}
						</span>
					</div>
					<div class="font-mono text-2xl font-bold text-white">{stat.value}</div>
					<div class="mt-1 text-xs font-medium text-white/50">{stat.label}</div>
				</div>
			{/each}
		</div>

		<!-- Charts Row -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- Sales Chart -->
			<div class="card bg-surface border border-white/10 p-6 lg:col-span-2">
				<div class="mb-6 flex items-center justify-between">
					<div>
						<h2 class="font-heading text-lg font-bold text-white">Revenue (Last 7 Days)</h2>
						<p class="mt-0.5 text-xs text-white/40">
							Daily transactions & order trajectory in Nepalgunj
						</p>
					</div>
					<div class="flex items-center gap-2">
						<div class="bg-gold h-1 w-3 rounded-full"></div>
						<span class="text-xs text-white/50">Revenue</span>
					</div>
				</div>
				<div class="h-64">
					<canvas bind:this={lineCanvas}></canvas>
				</div>
			</div>

			<!-- Order Status Doughnut -->
			<div class="card bg-surface flex flex-col justify-between border border-white/10 p-6">
				<div class="mb-4">
					<h2 class="font-heading text-lg font-bold text-white">Order Status</h2>
					<p class="mt-0.5 text-xs text-white/40">Fulfillment ratio</p>
				</div>
				<div class="relative flex h-56 items-center justify-center">
					<canvas bind:this={doughnutCanvas}></canvas>
				</div>
				<div class="border-t border-white/5 pt-3 text-center text-xs text-white/40">
					{data.stats.totalOrders} orders for {data.shop?.name ?? 'this shop'}
				</div>
			</div>
		</div>

		<!-- Bottom Row: Recent Orders & Top Products -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<!-- Recent Orders -->
			<div class="card bg-surface overflow-hidden border border-white/10">
				<div class="flex items-center justify-between border-b border-white/10 p-5">
					<div>
						<h2 class="font-heading text-base font-bold text-white">Recent Orders</h2>
						<p class="text-xs text-white/40">Latest customer checkouts</p>
					</div>
					<a href="/owner/orders?shop={data.shop?.id}" class="text-gold text-xs hover:underline"
						>View All &rarr;</a
					>
				</div>
				<div class="divide-y divide-white/5">
					{#if data.recentOrders.length === 0}
						<div class="p-8 text-center text-xs text-white/40">
							No orders received yet. Place an order on the checkout page to see it here!
						</div>
					{:else}
						{#each data.recentOrders as order}
							<div class="flex items-center justify-between p-4 transition-colors hover:bg-white/1">
								<div>
									<div class="font-mono text-xs font-semibold text-white">{order.orderNumber}</div>
									<div class="text-[11px] text-white/40">
										{order.customerName || 'Customer'} • {formatRelativeTime(order.createdAt)}
									</div>
								</div>
								<div class="flex items-center gap-3">
									<span class="font-mono text-xs font-bold text-white">
										{formatPrice(order.total)}
									</span>
									<span
										class="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase {statusColor[
											order.status
										] || 'bg-white/5 text-white/60'}"
									>
										{order.status}
									</span>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>

			<!-- Top Selling Products -->
			<div class="card bg-surface overflow-hidden border border-white/10">
				<div class="flex items-center justify-between border-b border-white/10 p-5">
					<div>
						<h2 class="font-heading text-base font-bold text-white">Top Showcase Products</h2>
						<p class="text-xs text-white/40">Most popular boutique offerings</p>
					</div>
					<a href="/owner/products?shop={data.shop?.id}" class="text-gold text-xs hover:underline"
						>Manage All &rarr;</a
					>
				</div>
				<div class="divide-y divide-white/5">
					{#each data.topProducts as prod}
						<div class="flex items-center justify-between p-4 transition-colors hover:bg-white/1">
							<div class="flex items-center gap-3">
								<img
									src={prod.imageUrl || '/placeholder.png'}
									alt={prod.name}
									class="h-10 w-10 shrink-0 rounded-lg border border-white/5 bg-black object-cover"
								/>
								<div class="min-w-0">
									<a
										href="/products/{prod.id}"
										target="_blank"
										class="hover:text-gold block max-w-xs truncate text-xs font-medium text-white transition-colors"
									>
										{prod.name}
									</a>
									<div class="text-[11px] text-white/40">
										{prod.viewCount} views • {prod.stock} in stock
									</div>
								</div>
							</div>
							<div class="text-right">
								<div class="text-gold font-mono text-xs font-bold">
									{formatPrice(prod.price)}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/key}
