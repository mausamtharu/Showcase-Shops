import { S as attr, a as head, i as ensure_array_like, r as derived, t as attr_class, w as escape_html } from "../../../chunks/server.js";
import { r as formatPrice } from "../../../chunks/utils2.js";
import { t as cart } from "../../../chunks/cart.svelte.js";
import "../../../chunks/forms.js";
//#region src/routes/checkout/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let fullName = "";
		let phone = "";
		let street = "";
		let city = "Nepalgunj";
		let province = "Lumbini";
		let postalCode = "21900";
		let notes = "";
		let paymentMethod = "cod";
		let isSubmitting = false;
		const freeShippingThreshold = 5e3;
		const shippingFee = derived(() => cart.subtotal >= freeShippingThreshold || cart.subtotal === 0 ? 0 : 250);
		const finalTotal = derived(() => cart.subtotal + shippingFee());
		head("jbcej5", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Checkout — ShowCase Shops</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"><nav class="flex items-center gap-2 text-xs text-white/50 mb-6 uppercase tracking-wider"><a href="/" class="hover:text-gold transition-colors">Home</a> <span>/</span> <a href="/cart" class="hover:text-gold transition-colors">Cart</a> <span>/</span> <span class="text-white">Checkout</span></nav> `);
		if (form?.success) $$renderer.push(`<!--[0--><div class="card p-8 md:p-12 max-w-2xl mx-auto text-center border border-gold/40 shadow-2xl bg-linear-to-b from-surface to-black"><div class="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gold/20 border border-gold text-gold"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg></div> <span class="text-xs uppercase tracking-widest text-gold font-semibold">Payment Confirmed</span> <h1 class="font-heading text-3xl font-bold text-white mt-2 mb-3">Thank You for Your Order!</h1> <p class="text-white/70 text-sm max-w-md mx-auto mb-6">Your order has been forwarded to the boutique. You will receive an SMS and email notification once it is on its way.</p> <div class="card p-4 bg-surface-2 border border-white/10 max-w-md mx-auto mb-8 text-left space-y-2"><div class="flex justify-between text-xs"><span class="text-white/50 uppercase tracking-wider">Order Reference</span> <span class="text-gold font-mono font-bold text-sm">${escape_html(form.orderNumber)}</span></div> <div class="flex justify-between text-xs"><span class="text-white/50 uppercase tracking-wider">Total Amount</span> <span class="text-white font-mono font-bold text-sm">NPR ${escape_html(form.total)}</span></div> <div class="flex justify-between text-xs"><span class="text-white/50 uppercase tracking-wider">Estimated Delivery</span> <span class="text-white">24 - 48 Hours</span></div></div> <div class="flex flex-col sm:flex-row items-center justify-center gap-4"><a href="/account/orders" class="btn btn-primary w-full sm:w-auto">Track Order Status</a> <a href="/products" class="btn btn-secondary w-full sm:w-auto">Continue Shopping</a></div></div>`);
		else if (cart.items.length === 0) $$renderer.push(`<!--[1--><div class="card p-12 text-center max-w-lg mx-auto my-12 border border-white/10"><h2 class="font-heading text-2xl font-bold text-white mb-2">No Items to Checkout</h2> <p class="text-white/60 text-sm mb-6">Your shopping bag is currently empty.</p> <a href="/products" class="btn btn-primary">Browse Collections</a></div>`);
		else {
			$$renderer.push(`<!--[-1--><div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"><div class="lg:col-span-7"><form method="POST" action="?/placeOrder" class="space-y-8"><input type="hidden" name="items"${attr("value", JSON.stringify(cart.items))}/> <input type="hidden" name="paymentMethod"${attr("value", paymentMethod)}/> <div class="card p-6 border border-white/10 space-y-6"><div class="flex items-center gap-3 pb-3 border-b border-white/10"><div class="w-7 h-7 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-xs">1</div> <h2 class="font-heading font-semibold text-lg text-white">Delivery Address</h2></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="space-y-1 sm:col-span-2"><label for="fullName" class="text-xs uppercase tracking-wider text-white/70 font-medium">Full Name *</label> <input id="fullName" name="fullName" type="text" required=""${attr("value", fullName)} placeholder="e.g. Ramesh Shrestha" class="input text-sm"/></div> <div class="space-y-1 sm:col-span-2"><label for="phone" class="text-xs uppercase tracking-wider text-white/70 font-medium">Phone Number (Nepal) *</label> <input id="phone" name="phone" type="tel" required=""${attr("value", phone)} placeholder="e.g. 9801234567" class="input text-sm"/></div> <div class="space-y-1 sm:col-span-2"><label for="street" class="text-xs uppercase tracking-wider text-white/70 font-medium">Street Address / Landmark *</label> <input id="street" name="street" type="text" required=""${attr("value", street)} placeholder="e.g. Tribhuvan Chowk, Ward 2" class="input text-sm"/></div> <div class="space-y-1"><label for="city" class="text-xs uppercase tracking-wider text-white/70 font-medium">City / Municipality *</label> <input id="city" name="city" type="text" required=""${attr("value", city)} placeholder="e.g. Nepalgunj" class="input text-sm"/></div> <div class="space-y-1"><label for="province" class="text-xs uppercase tracking-wider text-white/70 font-medium">Province</label> `);
			$$renderer.select({
				id: "province",
				name: "province",
				value: province,
				class: "input text-sm"
			}, ($$renderer) => {
				$$renderer.option({ value: "Lumbini" }, ($$renderer) => {
					$$renderer.push(`Lumbini Province`);
				});
				$$renderer.option({ value: "Bagmati" }, ($$renderer) => {
					$$renderer.push(`Bagmati Province`);
				});
				$$renderer.option({ value: "Gandaki" }, ($$renderer) => {
					$$renderer.push(`Gandaki Province`);
				});
				$$renderer.option({ value: "Koshi" }, ($$renderer) => {
					$$renderer.push(`Koshi Province`);
				});
				$$renderer.option({ value: "Madhesh" }, ($$renderer) => {
					$$renderer.push(`Madhesh Province`);
				});
				$$renderer.option({ value: "Karnali" }, ($$renderer) => {
					$$renderer.push(`Karnali Province`);
				});
				$$renderer.option({ value: "Sudurpashchim" }, ($$renderer) => {
					$$renderer.push(`Sudurpashchim Province`);
				});
			});
			$$renderer.push(`</div> <div class="space-y-1"><label for="postalCode" class="text-xs uppercase tracking-wider text-white/70 font-medium">Postal Code</label> <input id="postalCode" name="postalCode" type="text"${attr("value", postalCode)} class="input text-sm"/></div> <div class="space-y-1 sm:col-span-2"><label for="notes" class="text-xs uppercase tracking-wider text-white/70 font-medium">Delivery Instructions (Optional)</label> <textarea id="notes" name="notes" rows="2" placeholder="e.g. Ring the bell twice or call on arrival" class="input text-sm py-2">`);
			const $$body = escape_html(notes);
			if ($$body) $$renderer.push(`${$$body}`);
			$$renderer.push(`</textarea></div></div></div> <div class="card p-6 border border-white/10 space-y-6"><div class="flex items-center gap-3 pb-3 border-b border-white/10"><div class="w-7 h-7 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-xs">2</div> <h2 class="font-heading font-semibold text-lg text-white">Payment Method</h2></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><button type="button"${attr_class(`p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 border-gold bg-gold/5`)}><div${attr_class(`w-4 h-4 rounded-full border flex items-center justify-center mt-1 border-gold`)}>`);
			$$renderer.push(`<!--[0--><div class="w-2 h-2 rounded-full bg-gold"></div>`);
			$$renderer.push(`<!--]--></div> <div><div class="font-semibold text-sm text-white flex items-center gap-2">Cash on Delivery <span class="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-mono">Popular</span></div> <p class="text-xs text-white/50 mt-0.5">Pay in cash or Fonepay QR upon receipt</p></div></button> <button type="button"${attr_class(`p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 border-white/10 bg-surface-2 hover:border-white/20`)}><div${attr_class(`w-4 h-4 rounded-full border flex items-center justify-center mt-1 border-white/30`)}>`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div><div class="font-semibold text-sm text-white flex items-center gap-2">eSewa Mobile Wallet <span class="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">eSewa</span></div> <p class="text-xs text-white/50 mt-0.5">Instant online payment via eSewa account</p></div></button> <button type="button"${attr_class(`p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 border-white/10 bg-surface-2 hover:border-white/20`)}><div${attr_class(`w-4 h-4 rounded-full border flex items-center justify-center mt-1 border-white/30`)}>`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div><div class="font-semibold text-sm text-white flex items-center gap-2">Khalti Digital Wallet <span class="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-bold">Khalti</span></div> <p class="text-xs text-white/50 mt-0.5">Fast checkout using Khalti digital wallet</p></div></button> <button type="button"${attr_class(`p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 border-white/10 bg-surface-2 hover:border-white/20`)}><div${attr_class(`w-4 h-4 rounded-full border flex items-center justify-center mt-1 border-white/30`)}>`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div><div class="font-semibold text-sm text-white flex items-center gap-2">Debit / Credit Card <span class="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">Visa/Mastercard</span></div> <p class="text-xs text-white/50 mt-0.5">International and domestic cards supported</p></div></button></div></div> <button type="submit"${attr("disabled", isSubmitting, true)} class="btn btn-primary w-full py-4 text-base font-bold tracking-wider uppercase flex items-center justify-center gap-3 disabled:opacity-50">`);
			$$renderer.push(`<!--[-1-->Place Order • ${escape_html(formatPrice(finalTotal()))}`);
			$$renderer.push(`<!--]--></button></form></div> <div class="lg:col-span-5"><div class="card p-6 border border-white/10 sticky top-24 space-y-4"><h3 class="font-heading font-semibold text-base text-white pb-3 border-b border-white/10">Items in Order (${escape_html(cart.count)})</h3> <div class="max-h-72 overflow-y-auto space-y-3 pr-2 divide-y divide-white/5"><!--[-->`);
			const each_array = ensure_array_like(cart.items);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				$$renderer.push(`<div class="pt-3 first:pt-0 flex items-center gap-3"><img${attr("src", item.imageUrl)}${attr("alt", item.name)} class="w-14 h-14 rounded-md object-cover bg-surface-2 border border-white/5 shrink-0"/> <div class="flex-1 min-w-0"><h4 class="text-xs font-medium text-white truncate">${escape_html(item.name)}</h4> <p class="text-[11px] text-white/50">${escape_html(item.shopName)} • Qty ${escape_html(item.quantity)}</p> <span class="text-xs font-mono text-gold">${escape_html(formatPrice((item.discountPrice ?? item.price) * item.quantity))}</span></div></div>`);
			}
			$$renderer.push(`<!--]--></div> <div class="space-y-2 text-xs border-t border-white/10 pt-4"><div class="flex justify-between text-white/70"><span>Subtotal</span> <span class="font-mono text-white">${escape_html(formatPrice(cart.subtotal))}</span></div> <div class="flex justify-between text-white/70"><span>Shipping to ${escape_html(city)}</span> <span class="font-mono text-white">${escape_html(shippingFee() === 0 ? "FREE" : formatPrice(shippingFee()))}</span></div> <div class="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-3"><span>Total Payable</span> <span class="font-mono text-gold text-base">${escape_html(formatPrice(finalTotal()))}</span></div></div></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
