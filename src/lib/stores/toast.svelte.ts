// ── Toast Store (Svelte 5 Runes) ──────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type Toast = {
	id: string;
	type: ToastType;
	title: string;
	message?: string;
	duration?: number;
};

function createToastStore() {
	let toasts = $state<Toast[]>([]);

	function add(toast: Omit<Toast, 'id'>) {
		const id = crypto.randomUUID();
		const duration = toast.duration ?? 4000;
		toasts.push({ ...toast, id, duration });

		if (duration > 0) {
			setTimeout(() => remove(id), duration);
		}
		return id;
	}

	function remove(id: string) {
		const idx = toasts.findIndex((t) => t.id === id);
		if (idx !== -1) toasts.splice(idx, 1);
	}

	return {
		get toasts() {
			return toasts;
		},
		success(title: string, message?: string) {
			return add({ type: 'success', title, message });
		},
		error(title: string, message?: string) {
			return add({ type: 'error', title, message, duration: 6000 });
		},
		warning(title: string, message?: string) {
			return add({ type: 'warning', title, message });
		},
		info(title: string, message?: string) {
			return add({ type: 'info', title, message });
		},
		remove
	};
}

export const toast = createToastStore();
