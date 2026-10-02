// ── Wishlist Store (Svelte 5 Runes) ───────────────────────────────────────────
function createWishlistStore() {
	let productIds = $state<string[]>([]);

	if (typeof localStorage !== 'undefined') {
		try {
			const stored = localStorage.getItem('showcase_wishlist');
			if (stored) productIds = JSON.parse(stored);
		} catch {
			productIds = [];
		}
	}

	function persist() {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('showcase_wishlist', JSON.stringify(productIds));
		}
	}

	return {
		get productIds() {
			return productIds;
		},
		get count() {
			return productIds.length;
		},
		isWishlisted(productId: string) {
			return productIds.includes(productId);
		},
		toggle(productId: string) {
			const idx = productIds.indexOf(productId);
			if (idx !== -1) {
				productIds.splice(idx, 1);
			} else {
				productIds.push(productId);
			}
			persist();
		},
		add(productId: string) {
			if (!productIds.includes(productId)) {
				productIds.push(productId);
				persist();
			}
		},
		remove(productId: string) {
			const idx = productIds.indexOf(productId);
			if (idx !== -1) {
				productIds.splice(idx, 1);
				persist();
			}
		}
	};
}

export const wishlist = createWishlistStore();
