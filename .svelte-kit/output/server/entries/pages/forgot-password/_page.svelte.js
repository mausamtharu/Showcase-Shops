import { S as attr, a as head, r as derived, w as escape_html } from "../../../chunks/server.js";
import "../../../chunks/paths.js";
import "../../../chunks/navigation.js";
import { t as page } from "../../../chunks/state.js";
//#region src/routes/forgot-password/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let email = "";
		let password = "";
		let confirmPassword = "";
		let loading = false;
		const token = derived(() => page.url.searchParams.get("token") ?? "");
		const accountMode = derived(() => page.url.searchParams.get("mode") === "owner" ? "owner" : "customer");
		derived(() => accountMode() === "owner" ? "/login?mode=owner" : "/login");
		head("1wx4tso", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Forgot Password — ShowCase Shops</title>`);
			});
		});
		$$renderer.push(`<main class="flex min-h-screen items-center justify-center bg-black px-5 py-12 text-white"><section class="w-full max-w-md space-y-6"><a${attr("href", accountMode() === "owner" ? "/login?mode=owner" : "/login")} class="text-gold text-sm hover:underline">← Back to ${escape_html(accountMode() === "owner" ? "owner" : "customer")} sign in</a> <div><p class="text-gold mb-2 text-xs font-semibold tracking-widest uppercase">ShowCase Shops</p> <h1 class="font-heading text-3xl font-bold">${escape_html(token() ? "Choose a new password" : "Reset your password")}</h1> <p class="mt-2 text-sm text-white/60">${escape_html(token() ? `Set a new password for your ${accountMode() === "owner" ? "shop owner" : "customer"} account.` : `Enter the email address for your ${accountMode() === "owner" ? "shop owner" : "customer"} account.`)}</p></div> `);
		if (token()) $$renderer.push(`<!--[0--><form class="space-y-4"><div class="space-y-1.5"><label for="newPassword" class="text-sm text-white/70">New password</label> <input id="newPassword" type="password"${attr("value", password)} class="input" autocomplete="new-password" minlength="8" required=""/></div> <div class="space-y-1.5"><label for="confirmPassword" class="text-sm text-white/70">Confirm new password</label> <input id="confirmPassword" type="password"${attr("value", confirmPassword)} class="input" autocomplete="new-password" minlength="8" required=""/></div> <button class="btn btn-primary w-full" type="submit"${attr("disabled", loading, true)}>${escape_html("Update password")}</button></form>`);
		else $$renderer.push(`<!--[-1--><form class="space-y-4"><div class="space-y-1.5"><label for="email" class="text-sm text-white/70">Email address</label> <input id="email" type="email"${attr("value", email)} class="input" autocomplete="email" required=""/></div> <button class="btn btn-primary w-full" type="submit"${attr("disabled", loading, true)}>${escape_html("Send reset link")}</button></form>`);
		$$renderer.push(`<!--]--></section></main>`);
	});
}
//#endregion
export { _page as default };
