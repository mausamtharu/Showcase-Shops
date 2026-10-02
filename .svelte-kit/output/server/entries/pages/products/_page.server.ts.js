import { o as product, r as category, t as db, u as shop } from "../../../chunks/db.js";
import { and, asc, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";
//#region src/routes/products/+page.server.ts
var load = async ({ url }) => {
	const q = url.searchParams.get("q") ?? "";
	const cat = url.searchParams.get("category") ?? "";
	const minPrice = url.searchParams.get("minPrice") ? parseFloat(url.searchParams.get("minPrice")) : null;
	const maxPrice = url.searchParams.get("maxPrice") ? parseFloat(url.searchParams.get("maxPrice")) : null;
	const sortBy = url.searchParams.get("sort") ?? "popular";
	const page = parseInt(url.searchParams.get("page") ?? "1");
	const limit = 20;
	const conditions = [eq(product.isActive, true)];
	if (q) conditions.push(ilike(product.name, `%${q}%`));
	if (cat) {
		const catRecord = await db.select().from(category).where(eq(category.slug, cat)).limit(1);
		if (catRecord[0]) conditions.push(eq(product.categoryId, catRecord[0].id));
	}
	if (minPrice !== null) conditions.push(gte(product.price, String(minPrice)));
	if (maxPrice !== null) conditions.push(lte(product.price, String(maxPrice)));
	const orderBy = sortBy === "price-asc" ? asc(product.price) : sortBy === "price-desc" ? desc(product.price) : sortBy === "newest" ? desc(product.createdAt) : sortBy === "rating" ? desc(product.avgRating) : desc(product.viewCount);
	return {
		products: await db.select({
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
		}).from(product).leftJoin(shop, eq(product.shopId, shop.id)).where(and(...conditions)).orderBy(orderBy).limit(limit).offset((page - 1) * limit),
		categories: await db.select().from(category),
		q,
		cat,
		sortBy,
		minPrice,
		maxPrice,
		page
	};
};
//#endregion
export { load };
