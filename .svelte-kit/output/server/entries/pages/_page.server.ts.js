import { i as order, o as product, r as category, t as db, u as shop } from "../../chunks/db.js";
import { count, countDistinct, desc, eq, sql } from "drizzle-orm";
//#region src/routes/+page.server.ts
var load = async () => {
	const featuredProducts = await db.select({
		id: product.id,
		name: product.name,
		slug: product.slug,
		price: product.price,
		discountPrice: product.discountPrice,
		stock: product.stock,
		avgRating: product.avgRating,
		reviewCount: product.reviewCount,
		shopId: product.shopId,
		shopName: shop.name,
		imageUrl: sql`(
				SELECT url FROM product_image 
				WHERE product_id = ${product.id} AND is_primary = true 
				LIMIT 1
			)`
	}).from(product).leftJoin(shop, eq(product.shopId, shop.id)).where(eq(product.isActive, true)).orderBy(desc(product.viewCount)).limit(8);
	const featuredShops = await db.select({
		id: shop.id,
		name: shop.name,
		slug: shop.slug,
		tagline: shop.tagline,
		logoUrl: shop.logoUrl,
		bannerUrl: shop.bannerUrl,
		category: shop.category,
		location: shop.location
	}).from(shop).where(eq(shop.isActive, true)).limit(6);
	const categories = await db.select().from(category).limit(8);
	const [activeShops, activeProducts, customers, deliveredOrders] = await Promise.all([
		db.select({ total: count() }).from(shop).where(eq(shop.isActive, true)),
		db.select({ total: count() }).from(product).where(eq(product.isActive, true)),
		db.select({ total: countDistinct(order.userId) }).from(order).where(eq(order.status, "delivered")),
		db.select({ total: count() }).from(order).where(eq(order.status, "delivered"))
	]);
	return {
		featuredProducts,
		featuredShops,
		categories,
		stats: {
			activeShops: activeShops[0].total,
			productsListed: activeProducts[0].total,
			happyCustomers: customers[0].total,
			deliveredOrders: deliveredOrders[0].total
		}
	};
};
//#endregion
export { load };
