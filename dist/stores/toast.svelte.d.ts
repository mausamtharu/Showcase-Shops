export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type Toast = {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
};
export declare const toast: {
    readonly toasts: Toast[];
    success(title: string, message?: string): `${string}-${string}-${string}-${string}-${string}`;
    error(title: string, message?: string): `${string}-${string}-${string}-${string}-${string}`;
    warning(title: string, message?: string): `${string}-${string}-${string}-${string}-${string}`;
    info(title: string, message?: string): `${string}-${string}-${string}-${string}-${string}`;
    remove: (id: string) => void;
};
