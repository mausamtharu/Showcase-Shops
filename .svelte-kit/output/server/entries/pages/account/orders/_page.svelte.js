import { S as attr, a as head, c as stringify, i as ensure_array_like, n as attr_style, t as attr_class, w as escape_html } from "../../../../chunks/server.js";
import { n as formatDate, r as formatPrice } from "../../../../chunks/utils2.js";
//#region src/routes/account/orders/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		function getStepIndex(status) {
			switch (status) {
				case "pending": return 1;
				case "processing": return 2;
				case "shipped": return 3;
				case "delivered": return 4;
				default: return 1;
			}
		}
		head("itfzfa", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>My Orders — ShowCase Shops</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8"><div><nav class="flex items-center gap-2 text-xs text-white/50 mb-3 uppercase tracking-wider"><a href="/" class="hover:text-gold transition-colors">Home</a> <span>/</span> <span class="text-white">Account Orders</span></nav> <div class="flex items-center justify-between"><h1 class="font-heading font-bold text-3xl text-white">Orders &amp; Shipments</h1> <a href="/products" class="btn btn-secondary text-xs">Browse Catalog</a></div></div> `);
		if (data.orders.length === 0) $$renderer.push(`<!--[0--><div class="card p-12 text-center border border-white/10 max-w-md mx-auto my-12 bg-surface"><div class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-surface-2 text-white/30"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div> <h2 class="font-heading text-xl font-semibold text-white mb-2">No Active Orders Yet</h2> <p class="text-xs text-white/50 mb-6 leading-relaxed">When you purchase an item from our curated merchant collection, its live tracking and invoices will appear here.</p> <a href="/products" class="btn btn-primary">Start Shopping</a></div>`);
		else {
			$$renderer.push(`<!--[-1--><div class="space-y-6"><!--[-->`);
			const each_array = ensure_array_like(data.orders);
			for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
				let ord = each_array[$$index_2];
				const currentStep = getStepIndex(ord.status);
				$$renderer.push(`<div class="card p-6 border border-white/10 bg-surface space-y-6"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10"><div><div class="flex items-center gap-2"><span class="text-xs uppercase tracking-wider text-white/50">Order #</span> <span class="font-mono font-bold text-gold text-base">${escape_html(ord.orderNumber)}</span></div> <div class="text-xs text-white/40 mt-0.5">Placed on ${escape_html(formatDate(ord.createdAt))} • Boutique: `);
				if (ord.shopSlug) $$renderer.push(`<!--[0--><a${attr("href", `/shop/${stringify(ord.shopSlug)}`)} class="text-gold hover:underline font-medium">${escape_html(ord.shopName)}</a>`);
				else $$renderer.push(`<!--[-1--><span class="text-white">${escape_html(ord.shopName)}</span>`);
				$$renderer.push(`<!--]--></div></div> <div class="text-left sm:text-right"><span class="text-[11px] uppercase tracking-wider text-white/50 block">Total</span> <span class="font-mono font-bold text-lg text-white">${escape_html(formatPrice(ord.total))}</span></div></div> <div class="py-2"><div class="flex items-center justify-between relative"><div class="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 -z-0"><div class="h-full bg-gold transition-all duration-500"${attr_style(`width: ${stringify((currentStep - 1) / 3 * 100)}%;`)}></div></div> <!--[-->`);
				const each_array_1 = ensure_array_like([
					{
						step: 1,
						title: "Confirmed"
					},
					{
						step: 2,
						title: "Preparing"
					},
					{
						step: 3,
						title: "Dispatched"
					},
					{
						step: 4,
						title: "Delivered"
					}
				]);
				for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
					let s = each_array_1[$$index];
					$$renderer.push(`<div class="relative z-10 flex flex-col items-center"><div${attr_class(`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border ${s.step <= currentStep ? "bg-gold border-gold text-black shadow-lg shadow-gold/20" : "bg-surface-2 border-white/20 text-white/40"}`)}>${escape_html(s.step < currentStep ? "✓" : s.step)}</div> <span${attr_class(`text-[10px] uppercase tracking-wider mt-1 font-medium ${s.step <= currentStep ? "text-gold" : "text-white/40"}`)}>${escape_html(s.title)}</span></div>`);
				}
				$$renderer.push(`<!--]--></div></div> <div class="space-y-3 pt-4 border-t border-white/5"><!--[-->`);
				const each_array_2 = ensure_array_like(ord.items);
				for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
					let it = each_array_2[$$index_1];
					$$renderer.push(`<div class="flex items-center gap-4"><img${attr("src", it.productImageUrl || "/placeholder.png")}${attr("alt", it.productName)} class="w-14 h-14 rounded-lg object-cover bg-surface-2 border border-white/5 shrink-0"/> <div class="flex-1 min-w-0"><h4 class="text-sm font-medium text-white truncate hover:text-gold transition-colors"><a${attr("href", `/products/${stringify(it.productId)}`)}>${escape_html(it.productName)}</a></h4> <p class="text-xs text-white/50">Qty: ${escape_html(it.quantity)}</p></div> <div class="text-sm font-mono font-medium text-white">${escape_html(formatPrice(it.price * it.quantity))}</div></div>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
