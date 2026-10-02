import { o as product, r as category, s as productImage, t as db, u as shop } from "../../../../../../chunks/db.js";
import { error, fail, redirect } from "@sveltejs/kit";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
//#region src/routes/owner/products/[id]/edit/+page.server.ts
var load = async ({ params, locals }) => {
	const productId = params.id;
	const shopIds = (await db.select({ id: shop.id }).from(shop).where(eq(shop.ownerId, locals.user.id))).map((ownedShop) => ownedShop.id);
	const [prod] = await db.select({
		id: product.id,
		name: product.name,
		slug: product.slug,
		description: product.description,
		price: product.price,
		discountPrice: product.discountPrice,
		stock: product.stock,
		sku: product.sku,
		categoryId: product.categoryId,
		isFeatured: product.isFeatured,
		isActive: product.isActive,
		imageUrl: sql`(
				SELECT url FROM ${productImage}
				WHERE ${productImage.productId} = ${product.id}
				ORDER BY ${productImage.isPrimary} DESC, ${productImage.sortOrder} ASC
				LIMIT 1
			)`
	}).from(product).where(and(eq(product.id, productId), inArray(product.shopId, shopIds))).limit(1);
	if (!prod) throw error(404, "Product not found");
	return {
		product: prod,
		categories: await db.select().from(category)
	};
};
var actions = { default: async ({ request, params, locals }) => {
	const productId = params.id;
	const shopIds = (await db.select({ id: shop.id }).from(shop).where(eq(shop.ownerId, locals.user.id))).map((ownedShop) => ownedShop.id);
	if (!shopIds.length) return fail(403, { error: "No shops are linked to this account." });
	const data = await request.formData();
	const name = data.get("name")?.toString().trim();
	const description = data.get("description")?.toString().trim() || null;
	const priceStr = data.get("price")?.toString();
	const discountPriceStr = data.get("discountPrice")?.toString() || null;
	const stockStr = data.get("stock")?.toString() || "0";
	const sku = data.get("sku")?.toString().trim() || null;
	const categoryId = data.get("categoryId")?.toString() || null;
	const imageUrl = data.get("imageUrl")?.toString().trim();
	const isFeatured = data.get("isFeatured") === "on";
	if (!name || !priceStr) return fail(400, { error: "Product name and price are required." });
	const price = parseFloat(priceStr);
	const discountPrice = discountPriceStr ? parseFloat(discountPriceStr) : null;
	const stock = parseInt(stockStr, 10) || 0;
	try {
		await db.update(product).set({
			name,
			description,
			price: price.toFixed(2),
			discountPrice: discountPrice ? discountPrice.toFixed(2) : null,
			stock,
			sku,
			categoryId: categoryId || null,
			isFeatured,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(and(eq(product.id, productId), inArray(product.shopId, shopIds)));
		if (imageUrl) {
			const [existingImg] = await db.select().from(productImage).where(eq(productImage.productId, productId)).orderBy(desc(productImage.isPrimary), asc(productImage.sortOrder)).limit(1);
			if (existingImg) await db.update(productImage).set({
				url: imageUrl,
				isPrimary: true
			}).where(eq(productImage.id, existingImg.id));
			else await db.insert(productImage).values({
				productId,
				url: imageUrl,
				isPrimary: true
			});
		}
		throw redirect(303, "/owner/products");
	} catch (err) {
		if (err?.status === 303) throw err;
		console.error("Error updating product:", err);
		return fail(500, { error: "Failed to update product" });
	}
} };
//#endregion
export { actions, load };
