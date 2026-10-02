import { o as product, t as db, u as shop } from "../../../chunks/db.js";
import { eq, sql } from "drizzle-orm";
//#region src/routes/shops/+page.server.ts
var load = async () => {
	return { shops: await db.select({
		id: shop.id,
		name: shop.name,
		slug: shop.slug,
		tagline: shop.tagline,
		description: shop.description,
		logoUrl: shop.logoUrl,
		bannerUrl: shop.bannerUrl,
		category: shop.category,
		location: shop.location,
		phone: shop.phone,
		productCount: sql`(
				SELECT COUNT(*)::int FROM ${product}
				WHERE ${product.shopId} = ${shop.id} AND ${product.isActive} = true
			)`
	}).from(shop).where(eq(shop.isActive, true)) };
};
//#endregion
export { load };
