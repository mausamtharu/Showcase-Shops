import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { product, shop, category, order as customerOrder } from '$lib/server/db/schema';
import { count, countDistinct, desc, eq, sql } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Fetch featured products (top 8 most viewed)
	const featuredProducts = await db
		.select({
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
			imageUrl: sql<string>`(
				SELECT url FROM product_image 
				WHERE product_id = ${product.id} AND is_primary = true 
				LIMIT 1
			)`
		})
		.from(product)
		.leftJoin(shop, eq(product.shopId, shop.id))
		.where(eq(product.isActive, true))
		.orderBy(desc(product.viewCount))
		.limit(8);

	// Fetch featured shops
	const featuredShops = await db
		.select({
			id: shop.id,
			name: shop.name,
			slug: shop.slug,
			tagline: shop.tagline,
			logoUrl: shop.logoUrl,
			bannerUrl: shop.bannerUrl,
			category: shop.category,
			location: shop.location
		})
		.from(shop)
		.where(eq(shop.isActive, true))
		.limit(6);

	// Fetch categories
	const categories = await db.select().from(category).limit(8);

	const [activeShops, activeProducts, customers, deliveredOrders] = await Promise.all([
		db.select({ total: count() }).from(shop).where(eq(shop.isActive, true)),
		db.select({ total: count() }).from(product).where(eq(product.isActive, true)),
		db
			.select({ total: countDistinct(customerOrder.userId) })
			.from(customerOrder)
			.where(eq(customerOrder.status, 'delivered')),
		db.select({ total: count() }).from(customerOrder).where(eq(customerOrder.status, 'delivered'))
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
