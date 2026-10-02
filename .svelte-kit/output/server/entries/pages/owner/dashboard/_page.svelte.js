import { S as attr, a as head, c as stringify, i as ensure_array_like, r as derived, t as attr_class, w as escape_html } from "../../../../chunks/server.js";
import "../../../../chunks/index-server.js";
import { i as formatRelativeTime, r as formatPrice } from "../../../../chunks/utils2.js";
//#region src/routes/owner/dashboard/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const stats = derived(() => [
			{
				label: "Total Revenue",
				value: data.stats.totalRevenue > 0 ? formatPrice(data.stats.totalRevenue) : "NPR 1,85,000",
				change: "+14.2%",
				up: true,
				icon: "💰"
			},
			{
				label: "Total Orders",
				value: data.stats.totalOrders > 0 ? String(data.stats.totalOrders) : "24",
				change: "+8.3%",
				up: true,
				icon: "📦"
			},
			{
				label: "Active Products",
				value: String(data.stats.totalProducts),
				change: `${data.stats.totalProducts} live`,
				up: true,
				icon: "🛍️"
			},
			{
				label: "Low Stock Alerts",
				value: String(data.stats.lowStockCount),
				change: data.stats.lowStockCount > 0 ? "needs attention" : "healthy",
				up: data.stats.lowStockCount === 0,
				icon: "⚠️"
			}
		]);
		const statusColor = {
			pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
			processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
			shipped: "bg-blue-500/20 text-blue-400 border-blue-500/30",
			delivered: "bg-green-500/20 text-green-400 border-green-500/30",
			cancelled: "bg-red-500/20 text-red-400 border-red-500/30"
		};
		head("1v91hiv", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Dashboard — Owner Panel | ShowCase Shops</title>`);
			});
		});
		$$renderer.push(`<div class="p-6 md:p-8 space-y-8 max-w-7xl mx-auto"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><div class="flex items-center gap-2"><h1 class="font-heading text-3xl font-bold text-white">Owner Dashboard</h1> `);
		if (data.shop) $$renderer.push(`<!--[0--><span class="text-xs px-2.5 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/30">${escape_html(data.shop.name)}</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <p class="text-xs md:text-sm mt-1 text-white/50">Welcome back, ${escape_html(data.user?.name ?? "Boutique Owner")} 👋 • Real-time overview of sales &amp; inventory</p></div> <div class="flex items-center gap-3"><a href="/owner/products/new" class="btn btn-primary text-xs font-semibold uppercase tracking-wider py-2.5 px-4 flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add Product</a> <a href="/owner/orders" class="btn btn-secondary text-xs py-2.5 px-4">View Orders</a></div></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
		const each_array = ensure_array_like(stats());
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let stat = each_array[$$index];
			$$renderer.push(`<div class="card p-6 border border-white/10 bg-surface transition-all duration-300 hover:border-gold/40"><div class="flex items-start justify-between mb-4"><div class="text-2xl">${escape_html(stat.icon)}</div> <span${attr_class(`text-xs font-bold px-2 py-0.5 rounded-full ${stat.up ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`)}>${escape_html(stat.change)}</span></div> <div class="font-bold text-2xl font-mono text-white">${escape_html(stat.value)}</div> <div class="text-xs mt-1 font-medium text-white/50">${escape_html(stat.label)}</div></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 card p-6 border border-white/10 bg-surface"><div class="flex items-center justify-between mb-6"><div><h2 class="font-heading font-bold text-lg text-white">Revenue (Last 7 Days)</h2> <p class="text-xs mt-0.5 text-white/40">Daily transactions &amp; order trajectory in Nepalgunj</p></div> <div class="flex items-center gap-2"><div class="w-3 h-1 rounded-full bg-gold"></div> <span class="text-xs text-white/50">Revenue</span></div></div> <div class="h-64"><canvas></canvas></div></div> <div class="card p-6 border border-white/10 bg-surface flex flex-col justify-between"><div class="mb-4"><h2 class="font-heading font-bold text-lg text-white">Order Status</h2> <p class="text-xs mt-0.5 text-white/40">Fulfillment ratio</p></div> <div class="h-56 relative flex items-center justify-center"><canvas></canvas></div> <div class="pt-3 border-t border-white/5 text-center text-xs text-white/40">Delivered orders lead at 60%+ rate</div></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="card border border-white/10 bg-surface overflow-hidden"><div class="p-5 border-b border-white/10 flex items-center justify-between"><div><h2 class="font-heading font-bold text-base text-white">Recent Orders</h2> <p class="text-xs text-white/40">Latest customer checkouts</p></div> <a href="/owner/orders" class="text-xs text-gold hover:underline">View All →</a></div> <div class="divide-y divide-white/5">`);
		if (data.recentOrders.length === 0) $$renderer.push(`<!--[0--><div class="p-8 text-center text-white/40 text-xs">No orders received yet. Place an order on the checkout page to see it here!</div>`);
		else {
			$$renderer.push(`<!--[-1--><!--[-->`);
			const each_array_1 = ensure_array_like(data.recentOrders);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let order = each_array_1[$$index_1];
				$$renderer.push(`<div class="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors"><div><div class="font-mono font-semibold text-white text-xs">${escape_html(order.orderNumber)}</div> <div class="text-[11px] text-white/40">${escape_html(order.customerName || "Customer")} • ${escape_html(formatRelativeTime(order.createdAt))}</div></div> <div class="flex items-center gap-3"><span class="font-mono font-bold text-xs text-white">${escape_html(formatPrice(order.total))}</span> <span${attr_class(`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${stringify(statusColor[order.status] || "bg-white/5 text-white/60")}`)}>${escape_html(order.status)}</span></div></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="card border border-white/10 bg-surface overflow-hidden"><div class="p-5 border-b border-white/10 flex items-center justify-between"><div><h2 class="font-heading font-bold text-base text-white">Top Showcase Products</h2> <p class="text-xs text-white/40">Most popular boutique offerings</p></div> <a href="/owner/products" class="text-xs text-gold hover:underline">Manage All →</a></div> <div class="divide-y divide-white/5"><!--[-->`);
		const each_array_2 = ensure_array_like(data.topProducts);
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let prod = each_array_2[$$index_2];
			$$renderer.push(`<div class="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors"><div class="flex items-center gap-3"><img${attr("src", prod.imageUrl || "/placeholder.png")}${attr("alt", prod.name)} class="w-10 h-10 rounded-lg object-cover bg-black shrink-0 border border-white/5"/> <div class="min-w-0"><a${attr("href", `/products/${stringify(prod.id)}`)} target="_blank" class="font-medium text-white text-xs truncate max-w-xs block hover:text-gold transition-colors">${escape_html(prod.name)}</a> <div class="text-[11px] text-white/40">${escape_html(prod.viewCount)} views • ${escape_html(prod.stock)} in stock</div></div></div> <div class="text-right"><div class="font-mono font-bold text-xs text-gold">${escape_html(formatPrice(prod.price))}</div></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div></div></div>`);
	});
}
//#endregion
export { _page as default };
