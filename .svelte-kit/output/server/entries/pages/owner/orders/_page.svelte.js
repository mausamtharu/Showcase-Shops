import { S as attr, a as head, c as stringify, i as ensure_array_like, r as derived, t as attr_class, w as escape_html } from "../../../../chunks/server.js";
import { n as formatDate, r as formatPrice } from "../../../../chunks/utils2.js";
import "../../../../chunks/forms.js";
//#region src/routes/owner/orders/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let selectedStatus = "all";
		const filteredOrders = derived(() => data.orders.filter((o) => {
			return true;
		}));
		function getStatusBadgeClass(status) {
			switch (status) {
				case "delivered": return "bg-green-500/20 text-green-400 border-green-500/30";
				case "shipped": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
				case "processing": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
				case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/30";
				default: return "bg-amber-500/20 text-amber-400 border-amber-500/30";
			}
		}
		head("1xp91ee", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Customer Orders — Owner Panel</title>`);
			});
		});
		$$renderer.push(`<div class="p-6 md:p-10 max-w-7xl mx-auto space-y-8"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="font-heading font-bold text-2xl md:text-3xl text-white">Customer Orders</h1> <p class="text-xs md:text-sm text-white/50">Track incoming shipments, update delivery statuses, and view customer details</p></div> <div class="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 bg-surface p-1 rounded-xl border border-white/10"><!--[-->`);
		const each_array = ensure_array_like([
			"all",
			"pending",
			"processing",
			"shipped",
			"delivered"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let st = each_array[$$index];
			$$renderer.push(`<button${attr_class(`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${selectedStatus === st ? "bg-gold text-black font-semibold" : "text-white/60 hover:text-white"}`)}>${escape_html(st)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		if (filteredOrders().length === 0) $$renderer.push(`<!--[0--><div class="card p-12 text-center border border-white/10 max-w-md mx-auto my-12 bg-surface"><div class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-surface-2 text-white/30"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></div> <h3 class="font-heading font-semibold text-lg text-white mb-1">No Orders Found</h3> <p class="text-xs text-white/50">${escape_html("No orders have been received yet.")}</p></div>`);
		else {
			$$renderer.push(`<!--[-1--><div class="space-y-4"><!--[-->`);
			const each_array_1 = ensure_array_like(filteredOrders());
			for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
				let ord = each_array_1[$$index_2];
				$$renderer.push(`<div class="card p-6 border border-white/10 bg-surface space-y-4 hover:border-white/20 transition-colors"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5"><div class="flex items-center gap-3"><span class="font-mono font-bold text-gold text-base">${escape_html(ord.orderNumber)}</span> <span class="text-xs text-white/40">${escape_html(formatDate(ord.createdAt))}</span></div> <div class="flex items-center gap-3"><span class="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-white/5 border border-white/10 text-white/70">${escape_html(ord.paymentMethod)} • ${escape_html(ord.paymentStatus)}</span> <form method="POST" action="?/updateStatus" class="flex items-center gap-2"><input type="hidden" name="orderId"${attr("value", ord.id)}/> `);
				$$renderer.select({
					name: "status",
					value: ord.status,
					onchange: (e) => e.currentTarget.form?.requestSubmit(),
					class: `px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border cursor-pointer ${stringify(getStatusBadgeClass(ord.status))} bg-black/40 focus:outline-none`
				}, ($$renderer) => {
					$$renderer.option({ value: "pending" }, ($$renderer) => {
						$$renderer.push(`Pending`);
					});
					$$renderer.option({ value: "processing" }, ($$renderer) => {
						$$renderer.push(`Processing`);
					});
					$$renderer.option({ value: "shipped" }, ($$renderer) => {
						$$renderer.push(`Shipped`);
					});
					$$renderer.option({ value: "delivered" }, ($$renderer) => {
						$$renderer.push(`Delivered`);
					});
					$$renderer.option({ value: "cancelled" }, ($$renderer) => {
						$$renderer.push(`Cancelled`);
					});
				});
				$$renderer.push(`</form></div></div> <div class="grid grid-cols-1 md:grid-cols-12 gap-6"><div class="md:col-span-4 space-y-1.5 text-xs text-white/70 border-r md:border-r border-white/5 pr-4"><div class="uppercase tracking-wider text-[10px] text-white/40 font-semibold mb-1">Shipping Details</div> <div class="font-semibold text-white text-sm">${escape_html(ord.customerName || "Guest Customer")}</div> <div>Phone: <span class="font-mono text-white/90">${escape_html(ord.customerPhone || "N/A")}</span></div> <div>Address: ${escape_html(ord.customerStreet || "Standard Address")}, ${escape_html(ord.customerCity || "Nepalgunj")}</div> `);
				if (ord.notes) $$renderer.push(`<!--[0--><div class="p-2 rounded bg-white/5 text-[11px] text-white/60 italic mt-2">"${escape_html(ord.notes)}"</div>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="md:col-span-8 flex flex-col justify-between"><div class="space-y-2"><div class="uppercase tracking-wider text-[10px] text-white/40 font-semibold mb-1">Purchased Items (${escape_html(ord.items.length)})</div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-2"><!--[-->`);
				const each_array_2 = ensure_array_like(ord.items);
				for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
					let it = each_array_2[$$index_1];
					$$renderer.push(`<div class="flex items-center gap-2.5 p-2 rounded bg-surface-2 border border-white/5"><img${attr("src", it.productImageUrl || "/placeholder.png")}${attr("alt", it.productName)} class="w-10 h-10 rounded object-cover bg-black shrink-0"/> <div class="min-w-0 flex-1"><div class="text-xs font-medium text-white truncate">${escape_html(it.productName)}</div> <div class="text-[10px] text-white/50 flex justify-between"><span>Qty: ${escape_html(it.quantity)}</span> <span class="font-mono text-gold">${escape_html(formatPrice(it.price))}</span></div></div></div>`);
				}
				$$renderer.push(`<!--]--></div></div> <div class="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs"><span class="text-white/50">Subtotal: ${escape_html(formatPrice(ord.subtotal))} | Delivery: ${escape_html(formatPrice(ord.shippingFee))}</span> <div class="text-right"><span class="text-white/50 text-[10px] uppercase tracking-wider block">Total Amount</span> <span class="text-base font-bold font-mono text-gold">${escape_html(formatPrice(ord.total))}</span></div></div></div></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
