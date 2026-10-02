import { o as product, r as category, s as productImage, t as db, u as shop } from "../../../../chunks/db.js";
import { fail } from "@sveltejs/kit";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
//#region src/routes/owner/products/+page.server.ts
var load = async ({ locals }) => {
	const shops = await db.select().from(shop).where(eq(shop.ownerId, locals.user.id));
	const shopIds = shops.map((ownedShop) => ownedShop.id);
	const productsQuery = db.select({
		id: product.id,
		name: product.name,
		slug: product.slug,
		price: product.price,
		discountPrice: product.discountPrice,
		stock: product.stock,
		sku: product.sku,
		isActive: product.isActive,
		isFeatured: product.isFeatured,
		categoryName: category.name,
		imageUrl: sql`(
				SELECT url FROM ${productImage}
				WHERE ${productImage.productId} = ${product.id}
				ORDER BY ${productImage.isPrimary} DESC, ${productImage.sortOrder} ASC
				LIMIT 1
			)`
	}).from(product).leftJoin(category, eq(product.categoryId, category.id));
	const products = shopIds.length ? await productsQuery.where(inArray(product.shopId, shopIds)).orderBy(desc(product.createdAt)) : [];
	return {
		shop: shops[0] ?? null,
		shops,
		products
	};
};
var actions = {
	delete: async ({ request, locals }) => {
		const id = (await request.formData()).get("id")?.toString();
		if (!id) return fail(400, { error: "Product ID required" });
		const shopIds = (await db.select({ id: shop.id }).from(shop).where(eq(shop.ownerId, locals.user.id))).map((ownedShop) => ownedShop.id);
		if (!shopIds.length) return fail(403, { error: "No shops are linked to this account." });
		try {
			if (!(await db.delete(product).where(and(eq(product.id, id), inArray(product.shopId, shopIds))).returning({ id: product.id })).length) return fail(404, { error: "Product not found in your shops." });
			return {
				success: true,
				message: "Product removed"
			};
		} catch (e) {
			return fail(500, { error: "Failed to delete product" });
		}
	},
	toggleStatus: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get("id")?.toString();
		const currentStatus = data.get("currentStatus") === "true";
		if (!id) return fail(400, { error: "Product ID required" });
		const shopIds = (await db.select({ id: shop.id }).from(shop).where(eq(shop.ownerId, locals.user.id))).map((ownedShop) => ownedShop.id);
		if (!shopIds.length) return fail(403, { error: "No shops are linked to this account." });
		try {
			await db.update(product).set({ isActive: !currentStatus }).where(and(eq(product.id, id), inArray(product.shopId, shopIds)));
			return { success: true };
		} catch (e) {
			return fail(500, { error: "Failed to update product status" });
		}
	}
};
//#endregion
export { actions, load };
