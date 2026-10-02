import "./server.js";
//#region src/lib/stores/cart.svelte.ts
function createCartStore() {
	let items = [];
	let isOpen = false;
	if (typeof localStorage !== "undefined") try {
		const stored = localStorage.getItem("showcase_cart");
		if (stored) items = JSON.parse(stored);
	} catch {
		items = [];
	}
	function persist() {
		if (typeof localStorage !== "undefined") localStorage.setItem("showcase_cart", JSON.stringify(items));
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
				return sum + (item.discountPrice ?? item.price) * item.quantity;
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
		add(item) {
			const existing = items.find((i) => i.productId === item.productId && JSON.stringify(i.variantSelections) === JSON.stringify(item.variantSelections));
			if (existing) existing.quantity = Math.min(existing.quantity + item.quantity, item.stock);
			else items.push(item);
			persist();
			isOpen = true;
		},
		remove(id) {
			const idx = items.findIndex((i) => i.id === id);
			if (idx !== -1) items.splice(idx, 1);
			persist();
		},
		updateQuantity(id, quantity) {
			const item = items.find((i) => i.id === id);
			if (item) {
				if (quantity <= 0) {
					const idx = items.indexOf(item);
					items.splice(idx, 1);
				} else item.quantity = Math.min(quantity, item.stock);
			}
			persist();
		},
		clear() {
			items.splice(0, items.length);
			persist();
		}
	};
}
var cart = createCartStore();
//#endregion
export { cart as t };
