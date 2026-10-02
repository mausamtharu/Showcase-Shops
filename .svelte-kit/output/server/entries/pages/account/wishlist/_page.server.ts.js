import { o as product, s as productImage, t as db, u as shop } from "../../../../chunks/db.js";
import { eq, sql } from "drizzle-orm";
//#region src/routes/account/wishlist/+page.server.ts
var load = async () => {
	return { allProducts: await db.select({
		id: product.id,
		name: product.name,
		slug: product.slug,
		price: product.price,
		discountPrice: product.discountPrice,
		stock: product.stock,
		shopId: product.shopId,
		shopName: shop.name,
		imageUrl: sql`(
				SELECT url FROM ${productImage}
				WHERE ${productImage.productId} = ${product.id}
				ORDER BY ${productImage.isPrimary} DESC, ${productImage.sortOrder} ASC
				LIMIT 1
			)`
	}).from(product).leftJoin(shop, eq(product.shopId, shop.id)) };
};
//#endregion
export { load };
