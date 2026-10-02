<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { formatPrice, formatDate } from '$lib/utils';
	import { toast } from '$lib/stores/toast.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let selectedStatus = $state<string>('all');

	const filteredOrders = $derived(
		data.orders.filter((o) => {
			if (selectedStatus === 'all') return true;
			return o.status === selectedStatus;
		})
	);

	function getStatusBadgeClass(status: string) {
		switch (status) {
			case 'delivered':
				return 'bg-green-500/20 text-green-400 border-green-500/30';
			case 'shipped':
				return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
			case 'processing':
				return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
			case 'cancelled':
				return 'bg-red-500/20 text-red-400 border-red-500/30';
			default:
				return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
		}
	}

	$effect(() => {
		if (form?.success) {
			toast.success(form.message || 'Status updated');
		} else if (form?.error) {
			toast.error(form.error);
		}
	});
</script>

<svelte:head>
	<title>Customer Orders — Owner Panel</title>
</svelte:head>

<div class="mx-auto max-w-7xl space-y-8 p-6 md:p-10">
	<!-- Page Header -->
	<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<div>
				<h1 class="font-heading text-2xl font-bold text-white md:text-3xl">Customer Orders</h1>
				{#if data.shop}
					<p class="text-gold mt-1 text-xs">{data.shop.name}</p>
				{/if}
			</div>
			<p class="text-xs text-white/50 md:text-sm">
				Track incoming shipments, update delivery statuses, and view customer details
			</p>
		</div>

		<!-- Status Filter Pills -->
		<div
			class="bg-surface flex items-center gap-1.5 overflow-x-auto rounded-xl border border-white/10 p-1 pb-2 sm:pb-0"
		>
			{#each ['all', 'pending', 'processing', 'shipped', 'delivered'] as st}
				<button
					class="rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors {selectedStatus ===
					st
						? 'bg-gold font-semibold text-black'
						: 'text-white/60 hover:text-white'}"
					onclick={() => (selectedStatus = st)}
				>
					{st}
				</button>
			{/each}
		</div>
	</div>

	<!-- Orders List -->
	{#if filteredOrders.length === 0}
		<div class="card bg-surface mx-auto my-12 max-w-md border border-white/10 p-12 text-center">
			<div
				class="bg-surface-2 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-white/30"
			>
				<svg
					width="28"
					height="28"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
					<polyline points="14 2 14 8 20 8"></polyline>
				</svg>
			</div>
			<h3 class="font-heading mb-1 text-lg font-semibold text-white">No Orders Found</h3>
			<p class="text-xs text-white/50">
				{selectedStatus === 'all'
					? 'No orders have been received yet.'
					: `No orders with status "${selectedStatus}".`}
			</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each filteredOrders as ord (ord.id)}
				<div
					class="card bg-surface space-y-4 border border-white/10 p-6 transition-colors hover:border-white/20"
				>
					<!-- Top Bar: Order Number, Date, Status -->
					<div
						class="flex flex-col justify-between gap-3 border-b border-white/5 pb-3 sm:flex-row sm:items-center"
					>
						<div class="flex items-center gap-3">
							<span class="text-gold font-mono text-base font-bold">{ord.orderNumber}</span>
							<span class="text-xs text-white/40">{formatDate(ord.createdAt)}</span>
						</div>

						<div class="flex items-center gap-3">
							<!-- Payment Badge -->
							<span
								class="rounded border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-white/70 uppercase"
							>
								{ord.paymentMethod} • {ord.paymentStatus}
							</span>

							<!-- Status Dropdown Form -->
							<form
								method="POST"
								action="?/updateStatus"
								use:enhance
								class="flex items-center gap-2"
							>
								<input type="hidden" name="orderId" value={ord.id} />
								<input type="hidden" name="shopId" value={data.shop?.id} />
								<select
									name="status"
									value={ord.status}
									onchange={(e) => e.currentTarget.form?.requestSubmit()}
									class="cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase {getStatusBadgeClass(
										ord.status
									)} bg-black/40 focus:outline-none"
								>
									<option value="pending">Pending</option>
									<option value="processing">Processing</option>
									<option value="shipped">Shipped</option>
									<option value="delivered">Delivered</option>
									<option value="cancelled">Cancelled</option>
								</select>
							</form>
						</div>
					</div>

					<!-- Body: Customer info & Items -->
					<div class="grid grid-cols-1 gap-6 md:grid-cols-12">
						<!-- Customer Info -->
						<div
							class="space-y-1.5 border-r border-white/5 pr-4 text-xs text-white/70 md:col-span-4 md:border-r"
						>
							<div class="mb-1 text-[10px] font-semibold tracking-wider text-white/40 uppercase">
								Shipping Details
							</div>
							<div class="text-sm font-semibold text-white">
								{ord.customerName || 'Guest Customer'}
							</div>
							<div>
								Phone: <span class="font-mono text-white/90">{ord.customerPhone || 'N/A'}</span>
							</div>
							<div>
								Address: {ord.customerStreet || 'Standard Address'}, {ord.customerCity ||
									'Nepalgunj'}
							</div>
							{#if ord.notes}
								<div class="mt-2 rounded bg-white/5 p-2 text-[11px] text-white/60 italic">
									"{ord.notes}"
								</div>
							{/if}
						</div>

						<!-- Items -->
						<div class="flex flex-col justify-between md:col-span-8">
							<div class="space-y-2">
								<div class="mb-1 text-[10px] font-semibold tracking-wider text-white/40 uppercase">
									Purchased Items ({ord.items.length})
								</div>
								<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
									{#each ord.items as it}
										<div
											class="bg-surface-2 flex items-center gap-2.5 rounded border border-white/5 p-2"
										>
											<img
												src={it.productImageUrl || '/placeholder.png'}
												alt={it.productName}
												class="h-10 w-10 shrink-0 rounded bg-black object-cover"
											/>
											<div class="min-w-0 flex-1">
												<div class="truncate text-xs font-medium text-white">{it.productName}</div>
												<div class="flex justify-between text-[10px] text-white/50">
													<span>Qty: {it.quantity}</span>
													<span class="text-gold font-mono">{formatPrice(it.price)}</span>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>

							<!-- Total footer -->
							<div
								class="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-xs"
							>
								<span class="text-white/50"
									>Subtotal: {formatPrice(ord.subtotal)} | Delivery: {formatPrice(
										ord.shippingFee
									)}</span
								>
								<div class="text-right">
									<span class="block text-[10px] tracking-wider text-white/50 uppercase"
										>Total Amount</span
									>
									<span class="text-gold font-mono text-base font-bold"
										>{formatPrice(ord.total)}</span
									>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
