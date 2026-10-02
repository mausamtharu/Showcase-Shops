type Product = {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    discountPrice?: number | string | null;
    avgRating?: number | string;
    reviewCount?: number;
    stock: number;
    shopId: string;
    shopName?: string;
    imageUrl?: string;
};
type $$ComponentProps = {
    product: Product;
};
declare const ProductCard: import("svelte").Component<$$ComponentProps, {}, "">;
type ProductCard = ReturnType<typeof ProductCard>;
export default ProductCard;
