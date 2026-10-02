import { S as attr, a as head, c as stringify, i as ensure_array_like, r as derived, w as escape_html } from "../../../chunks/server.js";
//#region src/routes/shops/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let searchQuery = "";
		const filteredShops = derived(() => data.shops.filter((s) => {
			const q = searchQuery.toLowerCase().trim();
			if (!q) return true;
			return s.name.toLowerCase().includes(q) || s.location && s.location.toLowerCase().includes(q) || s.category && s.category.toLowerCase().includes(q);
		}));
		head("15x4vte", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Explore Verified Boutiques — ShowCase Shops</title>`);
			});
		});
		$$renderer.push(`<div class="mx-auto min-h-screen max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8"><div class="mx-auto max-w-2xl space-y-3 text-center"><span class="text-gold text-xs font-semibold tracking-widest uppercase">Nepalgunj &amp; Western Nepal</span> <h1 class="font-heading text-3xl font-bold text-white md:text-5xl">Verified Boutiques</h1> <p class="text-sm leading-relaxed text-white/60 md:text-base">Discover independent master artisans, traditional silk weavers, and luxury goldsmiths across
			Nepalgunj.</p></div> <div class="relative mx-auto max-w-md"><input type="text"${attr("value", searchQuery)} placeholder="Search by boutique name, craft, or location..." class="input py-3 pr-4 pl-10 text-sm" style="padding-left: 2.75rem;"/> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="absolute top-1/2 left-3.5 -translate-y-1/2 text-white/40"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div> <div class="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2 lg:grid-cols-3"><!--[-->`);
		const each_array = ensure_array_like(filteredShops());
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let sh = each_array[$$index];
			$$renderer.push(`<div class="card bg-surface group hover:border-gold/50 flex flex-col justify-between overflow-hidden border border-white/10 transition-all duration-300"><div class="bg-surface-2 relative h-44 overflow-hidden">`);
			if (sh.bannerUrl) $$renderer.push(`<!--[0--><img${attr("src", sh.bannerUrl)}${attr("alt", sh.name)} class="h-full w-full object-cover brightness-75 transition-transform duration-500 group-hover:scale-105"/>`);
			else $$renderer.push(`<!--[-1--><div class="h-full w-full bg-gradient-to-r from-stone-900 to-stone-800"></div>`);
			$$renderer.push(`<!--]--> <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div> <div class="absolute bottom-3 left-4 flex items-center gap-3"><img${attr("src", sh.logoUrl || "/placeholder.png")}${attr("alt", sh.name)} class="border-gold h-14 w-14 shrink-0 rounded-xl border bg-black object-cover shadow-lg"/> <div><div class="flex items-center gap-1.5"><span class="font-heading text-base leading-tight font-bold text-white drop-shadow-md">${escape_html(sh.name)}</span> <span class="bg-gold flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-black">✓</span></div> <span class="flex items-center gap-1 text-[11px] text-white/70 drop-shadow"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${escape_html(sh.location || "Nepalgunj")}</span></div></div></div> <div class="flex flex-1 flex-col justify-between space-y-4 p-5"><div>`);
			if (sh.tagline) $$renderer.push(`<!--[0--><div class="text-gold mb-1.5 line-clamp-1 text-xs font-medium">${escape_html(sh.tagline)}</div>`);
			else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <p class="line-clamp-3 text-xs leading-relaxed text-white/60">${escape_html(sh.description || "Verified merchant providing authentic local products.")}</p></div> <div class="flex items-center justify-between border-t border-white/5 pt-3"><span class="font-mono text-xs text-white/70"><strong class="font-semibold text-white">${escape_html(sh.productCount)}</strong> items available</span> <a${attr("href", `/shop/${stringify(sh.slug)}`)} class="btn btn-secondary group-hover:bg-gold group-hover:border-gold inline-flex items-center gap-1.5 px-3 py-2 text-xs transition-colors group-hover:text-black">Visit Store <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
