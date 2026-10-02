function createToastStore() {
    let toasts = $state([]);
    function add(toast) {
        const id = crypto.randomUUID();
        const duration = toast.duration ?? 4000;
        toasts.push({ ...toast, id, duration });
        if (duration > 0) {
            setTimeout(() => remove(id), duration);
        }
        return id;
    }
    function remove(id) {
        const idx = toasts.findIndex((t) => t.id === id);
        if (idx !== -1)
            toasts.splice(idx, 1);
    }
    return {
        get toasts() {
            return toasts;
        },
        success(title, message) {
            return add({ type: 'success', title, message });
        },
        error(title, message) {
            return add({ type: 'error', title, message, duration: 6000 });
        },
        warning(title, message) {
            return add({ type: 'warning', title, message });
        },
        info(title, message) {
            return add({ type: 'info', title, message });
        },
        remove
    };
}
export const toast = createToastStore();
