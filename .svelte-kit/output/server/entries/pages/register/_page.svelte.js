import { S as attr, a as head, i as ensure_array_like, n as attr_style, r as derived, t as attr_class, w as escape_html } from "../../../chunks/server.js";
import "../../../chunks/paths.js";
import "../../../chunks/navigation.js";
import { t as page } from "../../../chunks/state.js";
//#region src/routes/register/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let name = "";
		let email = "";
		let password = "";
		let confirmPassword = "";
		let acceptTerms = false;
		let shopName = "";
		let ownerAccountCreated = false;
		const accountMode = derived(() => page.url.searchParams.get("mode") === "owner" ? "owner" : "customer");
		const passwordStrength = derived(() => () => {
			return 0;
		});
		derived(() => () => {
			const s = passwordStrength()();
			if (s === 0) return "";
			if (s === 1) return "Weak";
			if (s === 2) return "Fair";
			if (s === 3) return "Good";
			return "Strong";
		});
		derived(() => () => {
			const s = passwordStrength()();
			if (s <= 1) return "#ef4444";
			if (s === 2) return "#f59e0b";
			if (s === 3) return "#22c55e";
			return "#d4af37";
		});
		head("52fghe", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Create Account — ShowCase Shops</title>`);
			});
		});
		$$renderer.push(`<div class="flex min-h-screen" style="background: var(--color-black);"><div class="relative hidden w-[45%] flex-col justify-between overflow-hidden p-12 lg:flex" style="background: linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 100%); border-right: 1px solid var(--color-border);"><div class="absolute inset-0 opacity-5" style="background-image: linear-gradient(var(--color-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold) 1px, transparent 1px); background-size: 60px 60px;"></div> <div class="relative z-10 flex items-center gap-3"><div class="bg-gradient-gold shadow-gold flex h-10 w-10 items-center justify-center rounded-xl"><svg width="22" height="22" viewBox="0 0 24 24" fill="var(--color-black)"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" fill="none"></path><path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none"></path></svg></div> <span class="font-heading text-gradient-gold text-2xl font-bold">ShowCase</span></div> <div class="relative z-10"><h1 class="font-display mb-6 text-5xl leading-tight font-bold">Join the<br/> <span class="text-gradient-gold">Community</span></h1> <p class="mb-10 text-lg leading-relaxed" style="color: rgba(250,250,249,0.5);">Create your free account and access thousands of premium products from local shops in
				Nepalgunj.</p> <div class="space-y-4"><!--[-->`);
		const each_array = ensure_array_like([
			{
				icon: "🛍️",
				text: "Access 10,000+ premium products"
			},
			{
				icon: "🚀",
				text: "Fast delivery across Banke district"
			},
			{
				icon: "💳",
				text: "Secure payments via eSewa & Khalti"
			},
			{
				icon: "⭐",
				text: "Exclusive deals for members"
			}
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let benefit = each_array[$$index];
			$$renderer.push(`<div class="flex items-center gap-3"><span class="text-xl">${escape_html(benefit.icon)}</span> <span class="text-sm" style="color: rgba(250,250,249,0.6);">${escape_html(benefit.text)}</span></div>`);
		}
		$$renderer.push(`<!--]--></div></div></div> <div class="flex flex-1 items-center justify-center overflow-y-auto p-6 lg:p-12"><div class="w-full max-w-md py-8"><div class="mb-8 flex items-center gap-2 lg:hidden"><div class="bg-gradient-gold flex h-9 w-9 items-center justify-center rounded-lg"><svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-black)"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" fill="none"></path><path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none"></path></svg></div> <span class="font-heading text-gradient-gold text-xl font-bold">ShowCase</span></div> <h2 class="font-display mb-2 text-3xl font-bold">${escape_html(accountMode() === "owner" ? "Open Your Shop" : "Create Account")}</h2> <p class="mb-8 text-sm" style="color: rgba(250,250,249,0.5);">Already have an account? <a${attr("href", accountMode() === "owner" ? "/login?mode=owner" : "/login")} class="text-gold ml-1 font-medium hover:underline">Sign in</a></p> <div class="mb-6 grid grid-cols-2 gap-1 rounded-xl p-1" style="background: var(--color-surface); border: 1px solid var(--color-border);"><a href="/register" class="rounded-lg px-3 py-2.5 text-center text-sm font-medium"${attr_style(accountMode() === "customer" ? "background: var(--color-gold); color: var(--color-black);" : "color: rgba(250,250,249,0.6);")}>Customer</a> <a href="/register?mode=owner" class="rounded-lg px-3 py-2.5 text-center text-sm font-medium"${attr_style(accountMode() === "owner" ? "background: var(--color-gold); color: var(--color-black);" : "color: rgba(250,250,249,0.6);")}>Shop Owner</a></div> <form class="space-y-5">`);
		if (accountMode() === "owner") $$renderer.push(`<!--[0--><div class="space-y-1.5"><label for="shopName" class="block text-sm font-medium" style="color: rgba(250,250,249,0.7);">First Shop Name</label> <input id="shopName" type="text"${attr("value", shopName)} placeholder="e.g. Himalayan Handcrafts" class="input" required=""${attr("disabled", ownerAccountCreated, true)}/></div>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="space-y-1.5"><label for="name" class="block text-sm font-medium" style="color: rgba(250,250,249,0.7);">Full Name</label> <input id="name" type="text"${attr("value", name)} placeholder="Mausam Tharu" class="input" required=""/></div> <div class="space-y-1.5"><label for="email" class="block text-sm font-medium" style="color: rgba(250,250,249,0.7);">Email Address</label> <input id="email" type="email"${attr("value", email)} placeholder="you@example.com" class="input" required="" autocomplete="email"/></div> <div class="space-y-1.5"><label for="password" class="block text-sm font-medium" style="color: rgba(250,250,249,0.7);">Password</label> <div class="relative"><input id="password"${attr("type", "password")}${attr("value", password)} placeholder="Min. 8 characters" class="input pr-12" required="" minlength="8"/> <button type="button" class="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center" style="color: rgba(250,250,249,0.4);"${attr("aria-label", "Show password")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">`);
		$$renderer.push(`<!--[-1--><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`);
		$$renderer.push(`<!--]--></svg></button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="space-y-1.5"><label for="confirm" class="block text-sm font-medium" style="color: rgba(250,250,249,0.7);">Confirm Password</label> <input id="confirm" type="password"${attr("value", confirmPassword)} placeholder="Repeat password"${attr_class("input", void 0, { "border-red-500": confirmPassword })} required=""/> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <label class="group flex cursor-pointer items-start gap-3"><input type="checkbox"${attr("checked", acceptTerms, true)} class="sr-only"/> <div class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-200"${attr_style("background: var(--color-surface-2); border-color: var(--color-border);")}>`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <span class="text-sm" style="color: rgba(250,250,249,0.6);">I agree to the <a href="/terms" class="text-gold hover:underline">Terms of Service</a> and <a href="/privacy" class="text-gold hover:underline">Privacy Policy</a></span></label> <button type="submit" class="btn btn-primary btn-lg w-full"${attr("disabled", true, true)}>`);
		$$renderer.push(`<!--[-1-->Create Account <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`);
		$$renderer.push(`<!--]--></button></form></div></div></div>`);
	});
}
//#endregion
export { _page as default };
