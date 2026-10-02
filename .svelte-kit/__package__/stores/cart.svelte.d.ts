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
export declare const cart: {
    readonly items: CartItem[];
    readonly isOpen: boolean;
    readonly count: number;
    readonly subtotal: number;
    openDrawer(): void;
    closeDrawer(): void;
    toggleDrawer(): void;
    add(item: CartItem): void;
    remove(id: string): void;
    updateQuantity(id: string, quantity: number): void;
    clear(): void;
};
