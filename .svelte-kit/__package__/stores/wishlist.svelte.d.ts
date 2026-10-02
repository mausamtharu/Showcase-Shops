export declare const wishlist: {
    readonly productIds: string[];
    readonly count: number;
    isWishlisted(productId: string): boolean;
    toggle(productId: string): void;
    add(productId: string): void;
    remove(productId: string): void;
};
