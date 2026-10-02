import { C as clsx, S as attr, a as head, c as stringify, i as ensure_array_like, l as unsubscribe_stores, n as attr_style, r as derived, s as store_get, t as attr_class, w as escape_html } from "../../chunks/server.js";
import { r as formatPrice } from "../../chunks/utils2.js";
import { t as page } from "../../chunks/stores.js";
import "../../chunks/navigation.js";
import { t as cart } from "../../chunks/cart.svelte.js";
import { t as wishlist } from "../../chunks/wishlist.svelte.js";
//#region src/lib/stores/toast.svelte.ts
function createToastStore() {
	let toasts = [];
	function add(toast) {
		const id = crypto.randomUUID();
		const duration = toast.duration ?? 4e3;
		toasts.push({
			...toast,
			id,
			duration
		});
		if (duration > 0) setTimeout(() => remove(id), duration);
		return id;
	}
	function remove(id) {
		const idx = toasts.findIndex((t) => t.id === id);
		if (idx !== -1) toasts.splice(idx, 1);
	}
	return {
		get toasts() {
			return toasts;
		},
		success(title, message) {
			return add({
				type: "success",
				title,
				message
			});
		},
		error(title, message) {
			return add({
				type: "error",
				title,
				message,
				duration: 6e3
			});
		},
		warning(title, message) {
			return add({
				type: "warning",
				title,
				message
			});
		},
		info(title, message) {
			return add({
				type: "info",
				title,
				message
			});
		},
		remove
	};
}
var toast = createToastStore();
//#endregion
//#region src/lib/components/layout/Navbar.svelte
function Navbar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { user: initialUser } = $$props;
		let user = derived(() => initialUser);
		let isScrolled = false;
		let searchQuery = "";
		const navLinks = [
			{
				href: "/",
				label: "Home"
			},
			{
				href: "/products",
				label: "Shop"
			},
			{
				href: "/shops",
				label: "Explore"
			}
		];
		function isActive(href) {
			if (href === "/") return store_get($$store_subs ??= {}, "$page", page).url.pathname === "/";
			return store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith(href);
		}
		$$renderer.push(`<nav${attr_class("fixed top-0 right-0 left-0 z-50 transition-all duration-300", void 0, {
			"glass-dark": isScrolled,
			"py-2": isScrolled,
			"py-4": true
		})}${attr_style(`border-bottom: 1px solid transparent`)}><div class="container flex items-center gap-6"><a href="/" class="group flex shrink-0 items-center gap-2"><div class="bg-gradient-gold shadow-gold flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"><svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-black)"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" fill="none"></path><path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none"></path></svg></div> <span class="font-heading text-xl font-bold tracking-tight" style="background: linear-gradient(135deg, #fafaf9 0%, #d4af37 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ShowCase</span></a> <div class="hidden flex-1 items-center gap-1 md:flex"><!--[-->`);
		const each_array = ensure_array_like(navLinks);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let link = each_array[$$index];
			$$renderer.push(`<a${attr("href", link.href)}${attr_class("rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200", void 0, {
				"text-gold": isActive(link.href),
				"bg-gold": isActive(link.href)
			})}${attr_style(isActive(link.href) ? "background: rgba(212,175,55,0.1); color: var(--color-gold);" : "color: rgba(250,250,249,0.7);")}>${escape_html(link.label)}</a>`);
		}
		$$renderer.push(`<!--]--></div> <form class="bg-surface-2 focus-within:border-gold focus-within:shadow-gold hidden max-w-sm flex-1 items-center gap-2 rounded-xl border px-4 py-2.5 transition-all duration-200 lg:flex" style="border-color: var(--color-border);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(250,250,249,0.4)" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> <input type="search" placeholder="Search products..."${attr("value", searchQuery)} class="flex-1 bg-transparent text-sm outline-none placeholder:text-white/30" style="color: var(--color-white);"/></form> <div class="ml-auto flex items-center gap-2 md:ml-0"><a href="/account/wishlist" class="relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200" style="background: var(--color-surface-2); border: 1px solid var(--color-border);" title="Wishlist"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(250,250,249,0.7)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg> `);
		if (wishlist.count > 0) $$renderer.push(`<!--[0--><span class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold" style="background: var(--color-gold); color: var(--color-black);">${escape_html(wishlist.count)}</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></a> <button class="hover:border-gold relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200" style="background: var(--color-surface-2); border: 1px solid var(--color-border);" title="Cart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(250,250,249,0.7)" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg> `);
		if (cart.count > 0) $$renderer.push(`<!--[0--><span class="animate-pulse-gold absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold" style="background: var(--color-gold); color: var(--color-black);">${escape_html(cart.count)}</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></button> `);
		if (user()) {
			$$renderer.push(`<!--[0--><div class="relative"><button class="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200" style="background: var(--color-surface-2); border: 1px solid var(--color-border);"><div class="bg-gradient-gold flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold" style="color: var(--color-black);">${escape_html(user().name?.[0]?.toUpperCase() ?? "U")}</div> <span class="hidden max-w-24 truncate text-sm font-medium md:block">${escape_html(user().name ?? "Account")}</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="transition-transform duration-200"${attr_style(`transform: rotate(${stringify(0)}deg)`)}><polyline points="6 9 12 15 18 9"></polyline></svg></button> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push(`<!--[-1--><a href="/login" class="btn btn-primary btn-sm hidden md:inline-flex">Sign In</a> <button class="flex h-10 w-10 items-center justify-center rounded-xl md:hidden" style="background: var(--color-surface-2); border: 1px solid var(--color-border);" aria-label="Sign in"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(250,250,249,0.7)" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></button>`);
		$$renderer.push(`<!--]--> <button class="flex h-10 w-10 items-center justify-center rounded-xl md:hidden" style="background: var(--color-surface-2); border: 1px solid var(--color-border);" aria-label="Toggle mobile menu"><div class="flex h-4 w-5 flex-col justify-between"><span class="block h-0.5 rounded-full transition-all duration-300"${attr_style(`background: rgba(250,250,249,0.7); transform-origin: left; transform: rotate(0) translateY(0)`)}></span> <span class="block h-0.5 rounded-full transition-all duration-300"${attr_style(`background: rgba(250,250,249,0.7); opacity: ${stringify(1)};`)}></span> <span class="block h-0.5 rounded-full transition-all duration-300"${attr_style(`background: rgba(250,250,249,0.7); transform-origin: left; transform: rotate(0)`)}></span></div></button></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></nav>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/components/layout/CartDrawer.svelte
function CartDrawer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		if (cart.isOpen) {
			$$renderer.push(`<!--[0--><div class="overlay"></div> <div class="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col animate-slide-in-right shadow-elevated" style="background: var(--color-surface);"><div class="flex items-center justify-between p-6 border-b" style="border-color: var(--color-border);"><div><h2 class="text-xl font-bold font-heading">Your Cart</h2> <p class="text-sm mt-0.5" style="color: rgba(250,250,249,0.5);">${escape_html(cart.count)} item${escape_html(cart.count !== 1 ? "s" : "")}</p></div> <button class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200" style="background: var(--color-surface-2); border: 1px solid var(--color-border);" aria-label="Close cart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div> <div class="flex-1 overflow-y-auto p-4 space-y-3">`);
			if (cart.items.length === 0) $$renderer.push(`<!--[0--><div class="flex flex-col items-center justify-center h-full gap-4 text-center"><div class="w-20 h-20 rounded-2xl flex items-center justify-center" style="background: var(--color-surface-2);"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg></div> <div><p class="font-semibold font-heading text-lg">Your cart is empty</p> <p class="text-sm mt-1" style="color: rgba(250,250,249,0.4);">Discover premium products</p></div> <a href="/products" class="btn btn-primary">Start Shopping</a></div>`);
			else {
				$$renderer.push(`<!--[-1--><!--[-->`);
				const each_array = ensure_array_like(cart.items);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let item = each_array[$$index];
					$$renderer.push(`<div class="flex gap-4 p-3 rounded-xl border transition-all duration-200 group" style="background: var(--color-surface-2); border-color: var(--color-border);"><div class="w-20 h-20 rounded-lg overflow-hidden shrink-0" style="background: var(--color-surface-3);"><img${attr("src", item.imageUrl)}${attr("alt", item.name)} class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/></div> <div class="flex-1 min-w-0"><h4 class="font-medium text-sm leading-tight truncate">${escape_html(item.name)}</h4> `);
					if (item.variantSelections) $$renderer.push(`<!--[0--><p class="text-xs mt-0.5" style="color: rgba(250,250,249,0.4);">${escape_html(Object.entries(item.variantSelections).map(([k, v]) => `${k}: ${v}`).join(", "))}</p>`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div class="flex items-center gap-2 mt-1"><span class="font-bold text-sm text-gold">${escape_html(formatPrice(item.discountPrice ?? item.price))}</span> `);
					if (item.discountPrice) $$renderer.push(`<!--[0--><span class="text-xs line-through" style="color: rgba(250,250,249,0.35);">${escape_html(formatPrice(item.price))}</span>`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> <div class="flex items-center gap-2 mt-2"><button class="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all" style="background: var(--color-surface-3); border: 1px solid var(--color-border);">−</button> <span class="text-sm font-semibold w-6 text-center">${escape_html(item.quantity)}</span> <button${attr("disabled", item.quantity >= item.stock, true)} class="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all" style="background: var(--color-surface-3); border: 1px solid var(--color-border);">+</button></div></div> <button class="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200" style="color: #f87171;" title="Remove"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"></path></svg></button></div>`);
				}
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]--></div> `);
			if (cart.items.length > 0) $$renderer.push(`<!--[0--><div class="p-4 border-t space-y-3" style="border-color: var(--color-border);"><div class="flex items-center justify-between"><span class="text-sm" style="color: rgba(250,250,249,0.6);">Subtotal</span> <span class="font-bold text-lg text-gold">${escape_html(formatPrice(cart.subtotal))}</span></div> <p class="text-xs" style="color: rgba(250,250,249,0.35);">Shipping &amp; taxes calculated at checkout</p> <button class="btn btn-primary btn-lg w-full">Proceed to Checkout <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button> <a href="/cart" class="btn btn-ghost w-full text-center">View Full Cart</a></div>`);
			else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/layout/ToastContainer.svelte
function ToastContainer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2" aria-live="polite"><!--[-->`);
		const each_array = ensure_array_like(toast.toasts);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let t = each_array[$$index];
			$$renderer.push(`<div class="flex items-start gap-3 p-4 rounded-xl shadow-elevated animate-slide-in-right max-w-sm w-full" style="background: var(--color-surface); border: 1px solid var(--color-border); min-width: 280px;" role="alert"><div class="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"${attr_style(t.type === "success" ? "background: rgba(34,197,94,0.15);" : t.type === "error" ? "background: rgba(239,68,68,0.15);" : t.type === "warning" ? "background: rgba(245,158,11,0.15);" : "background: rgba(59,130,246,0.15);")}>`);
			if (t.type === "success") $$renderer.push(`<!--[0--><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`);
			else if (t.type === "error") $$renderer.push(`<!--[1--><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`);
			else if (t.type === "warning") $$renderer.push(`<!--[2--><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`);
			else $$renderer.push(`<!--[-1--><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`);
			$$renderer.push(`<!--]--></div> <div class="flex-1 min-w-0"><p class="font-semibold text-sm font-heading">${escape_html(t.title)}</p> `);
			if (t.message) $$renderer.push(`<!--[0--><p class="text-xs mt-0.5" style="color: rgba(250,250,249,0.6);">${escape_html(t.message)}</p>`);
			else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <button aria-label="Close notification" class="shrink-0 w-6 h-6 flex items-center justify-center rounded-md transition-colors" style="color: rgba(250,250,249,0.4);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/layout/Footer.svelte
function Footer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const categories = [
			"Electronics",
			"Fashion",
			"Home & Living",
			"Books",
			"Sports",
			"Beauty"
		];
		$$renderer.push(`<footer style="background: var(--color-surface); border-top: 1px solid var(--color-border);"><div class="container py-16"><div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4"><div class="lg:col-span-1"><div class="mb-4 flex items-center gap-2"><div class="bg-gradient-gold flex h-9 w-9 items-center justify-center rounded-lg"><svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-black)"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" fill="none"></path><path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none"></path></svg></div> <span class="font-heading text-gradient-gold text-xl font-bold">ShowCase</span></div> <p class="mb-6 text-sm leading-relaxed" style="color: rgba(250,250,249,0.5);">Premium e-commerce platform connecting local shops in Nepalgunj, Banke with customers
					across Nepal.</p> <div class="flex gap-3"><!--[-->`);
		const each_array = ensure_array_like([
			"facebook",
			"instagram",
			"twitter"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let social = each_array[$$index];
			$$renderer.push(`<a${attr("href", `https://${stringify(social)}.com`)} target="_blank" rel="noopener" class="flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200" style="background: var(--color-surface-2); border-color: var(--color-border);"><span class="text-gold text-xs font-bold">${escape_html(social[0].toUpperCase())}</span></a>`);
		}
		$$renderer.push(`<!--]--></div></div> <div><h3 class="font-heading text-gold mb-4 text-sm font-semibold tracking-wider uppercase">Categories</h3> <ul class="space-y-2.5"><!--[-->`);
		const each_array_1 = ensure_array_like(categories);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let cat = each_array_1[$$index_1];
			$$renderer.push(`<li><a${attr("href", `/products?category=${stringify(cat.toLowerCase().replace(/\s/g, "-"))}`)} class="text-sm transition-colors duration-150" style="color: rgba(250,250,249,0.5);">${escape_html(cat)}</a></li>`);
		}
		$$renderer.push(`<!--]--></ul></div> <div><h3 class="font-heading text-gold mb-4 text-sm font-semibold tracking-wider uppercase">Quick Links</h3> <ul class="space-y-2.5"><!--[-->`);
		const each_array_2 = ensure_array_like([
			{
				href: "/products",
				label: "All Products"
			},
			{
				href: "/shops",
				label: "Explore Shops"
			},
			{
				href: "/account/orders",
				label: "Track Order"
			},
			{
				href: "/account/wishlist",
				label: "My Wishlist"
			},
			{
				href: "/owner/onboarding",
				label: "Open Your Shop"
			}
		]);
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let link = each_array_2[$$index_2];
			$$renderer.push(`<li><a${attr("href", link.href)} class="text-sm transition-colors duration-150" style="color: rgba(250,250,249,0.5);">${escape_html(link.label)}</a></li>`);
		}
		$$renderer.push(`<!--]--></ul></div> <div><h3 class="font-heading text-gold mb-4 text-sm font-semibold tracking-wider uppercase">Contact</h3> <ul class="space-y-3"><li class="flex items-start gap-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2" class="mt-0.5 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> <span class="text-sm" style="color: rgba(250,250,249,0.5);">Nepalgunj, Banke<br/>Nepal</span></li> <li class="flex items-center gap-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-.35a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"></path></svg> <span class="text-sm" style="color: rgba(250,250,249,0.5);">+977 081-XXXXXX</span></li> <li class="flex items-center gap-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> <span class="text-sm" style="color: rgba(250,250,249,0.5);">info@showcaseshops.com</span></li></ul></div></div></div> <div class="border-t" style="border-color: var(--color-border);"><div class="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row"><p class="text-xs" style="color: rgba(250,250,249,0.35);">© 2025 ShowCase Shops. Built by Mausam Tharu · BCA 4th Sem Project, Tribhuvan University</p> <div class="flex items-center gap-1"><span class="text-xs" style="color: rgba(250,250,249,0.35);">Secure payments via</span> <div class="ml-2 flex items-center gap-2"><!--[-->`);
		const each_array_3 = ensure_array_like([
			"eSewa",
			"Khalti",
			"COD"
		]);
		for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
			let method = each_array_3[$$index_3];
			$$renderer.push(`<span class="badge badge-gold text-xs">${escape_html(method)}</span>`);
		}
		$$renderer.push(`<!--]--></div></div></div></div></footer>`);
	});
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		const { children } = $$props;
		const hideNavPaths = [
			"/login",
			"/register",
			"/forgot-password",
			"/reset-password"
		];
		const hideNav = derived(() => hideNavPaths.some((p) => store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith(p)));
		head("12qhfyh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>ShowCase Shops — Premium E-Commerce Platform</title>`);
			});
			$$renderer.push(`<meta name="description" content="Discover premium products from local shops in Nepalgunj. Shop, compare and buy with ease on ShowCase Shops."/>`);
		});
		if (!hideNav()) {
			$$renderer.push("<!--[0-->");
			Navbar($$renderer, { user: store_get($$store_subs ??= {}, "$page", page).data.user });
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <main${attr_class(clsx(hideNav() ? "" : "pt-20"))}>`);
		children($$renderer);
		$$renderer.push(`<!----></main> `);
		if (!hideNav()) {
			$$renderer.push("<!--[0-->");
			Footer($$renderer, {});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		CartDrawer($$renderer, {});
		$$renderer.push(`<!----> `);
		ToastContainer($$renderer, {});
		$$renderer.push(`<!---->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _layout as default };
