import { S as attr, a as head, r as derived, w as escape_html } from "../../../chunks/server.js";
import "../../../chunks/navigation.js";
import { t as page } from "../../../chunks/state.js";
//#region src/routes/reset-password/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let password = "";
		let confirmPassword = "";
		let loading = false;
		const token = derived(() => page.url.searchParams.get("token") ?? "");
		const accountMode = derived(() => page.url.searchParams.get("mode") === "owner" ? "owner" : "customer");
		const loginHref = derived(() => accountMode() === "owner" ? "/login?mode=owner" : "/login");
		head("gimkg8", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Choose a New Password — ShowCase Shops</title>`);
			});
		});
		$$renderer.push(`<main class="flex min-h-screen items-center justify-center bg-black px-5 py-12 text-white"><section class="w-full max-w-md space-y-6"><a${attr("href", loginHref())} class="text-gold text-sm hover:underline">← Back to sign in</a> <div><p class="text-gold mb-2 text-xs font-semibold tracking-widest uppercase">ShowCase Shops</p> <h1 class="font-heading text-3xl font-bold">Choose a new password</h1> <p class="mt-2 text-sm text-white/60">Set a new password for your ${escape_html(accountMode() === "owner" ? "shop owner" : "customer")} account.</p></div> `);
		if (!token()) $$renderer.push(`<!--[0--><div class="rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100" role="alert">This reset link is missing or invalid. Request a new one to continue.</div> <a${attr("href", accountMode() === "owner" ? "/forgot-password?mode=owner" : "/forgot-password")} class="btn btn-primary inline-flex">Request another link</a>`);
		else $$renderer.push(`<!--[-1--><form class="space-y-4"><div class="space-y-1.5"><label for="password" class="text-sm text-white/70">New password</label> <input id="password" type="password"${attr("value", password)} class="input" autocomplete="new-password" minlength="8" required=""/></div> <div class="space-y-1.5"><label for="confirmPassword" class="text-sm text-white/70">Confirm new password</label> <input id="confirmPassword" type="password"${attr("value", confirmPassword)} class="input" autocomplete="new-password" minlength="8" required=""/></div> <button class="btn btn-primary w-full" type="submit"${attr("disabled", loading, true)}>${escape_html("Update password")}</button></form>`);
		$$renderer.push(`<!--]--></section></main>`);
	});
}
//#endregion
export { _page as default };
