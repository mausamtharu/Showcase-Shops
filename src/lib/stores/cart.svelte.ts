// ── Cart Store (Svelte 5 Runes) ───────────────────────────────────────────────
export type CartItem = {
	id: string;
	productId: string;
	name: string;
	price: number;
	discountPrice: number | null;
	imageUrl: string;
	quantity: number;
	stock: number;
	shopId: string;
	shopName: string;
	variantSelections?: Record<string, string>;
};

function createCartStore() {
	let items = $state<CartItem[]>([]);
	let isOpen = $state(false);

	// Load from localStorage on init
	if (typeof localStorage !== 'undefined') {
		try {
			const stored = localStorage.getItem('showcase_cart');
			if (stored) items = JSON.parse(stored);
		} catch {
			items = [];
		}
	}

	function persist() {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('showcase_cart', JSON.stringify(items));
		}
	}

	return {
		get items() {
			return items;
		},
		get isOpen() {
			return isOpen;
		},
		get count() {
			return items.reduce((sum, item) => sum + item.quantity, 0);
		},
		get subtotal() {
			return items.reduce((sum, item) => {
				const price = item.discountPrice ?? item.price;
				return sum + price * item.quantity;
			}, 0);
		},
		openDrawer() {
			isOpen = true;
		},
		closeDrawer() {
			isOpen = false;
		},
		toggleDrawer() {
			isOpen = !isOpen;
		},
		add(item: CartItem) {
			const existing = items.find(
				(i) =>
					i.productId === item.productId &&
					JSON.stringify(i.variantSelections) === JSON.stringify(item.variantSelections)
			);
			if (existing) {
				existing.quantity = Math.min(existing.quantity + item.quantity, item.stock);
			} else {
				items.push(item);
			}
			persist();
			isOpen = true;
		},
		remove(id: string) {
			const idx = items.findIndex((i) => i.id === id);
			if (idx !== -1) items.splice(idx, 1);
			persist();
		},
		updateQuantity(id: string, quantity: number) {
			const item = items.find((i) => i.id === id);
			if (item) {
				if (quantity <= 0) {
					const idx = items.indexOf(item);
					items.splice(idx, 1);
				} else {
					item.quantity = Math.min(quantity, item.stock);
				}
			}
			persist();
		},
		clear() {
			items.splice(0, items.length);
			persist();
		}
	};
}

export const cart = createCartStore();
