import { i as order, n as address, o as product, s as productImage, t as db, u as shop } from "../../../../chunks/db.js";
import { desc, eq, inArray, sql } from "drizzle-orm";
//#region src/routes/owner/dashboard/+page.server.ts
var load = async ({ locals }) => {
	const shops = await db.select().from(shop).where(eq(shop.ownerId, locals.user.id));
	const shopIds = shops.map((ownedShop) => ownedShop.id);
	const allProducts = shopIds.length ? await db.select().from(product).where(inArray(product.shopId, shopIds)) : [];
	const totalProducts = allProducts.length;
	const lowStockCount = allProducts.filter((p) => p.stock <= 5).length;
	const ordersQuery = db.select({
		id: order.id,
		orderNumber: order.orderNumber,
		total: order.total,
		status: order.status,
		createdAt: order.createdAt,
		customerName: address.fullName
	}).from(order).leftJoin(address, eq(order.addressId, address.id));
	const orders = shopIds.length ? await ordersQuery.where(inArray(order.shopId, shopIds)).orderBy(desc(order.createdAt)) : [];
	const totalOrders = orders.length;
	const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total || "0"), 0);
	const statusCounts = {
		delivered: orders.filter((o) => o.status === "delivered").length,
		processing: orders.filter((o) => o.status === "processing").length,
		shipped: orders.filter((o) => o.status === "shipped").length,
		pending: orders.filter((o) => o.status === "pending").length
	};
	const topProducts = await db.select({
		id: product.id,
		name: product.name,
		slug: product.slug,
		price: product.price,
		viewCount: product.viewCount,
		stock: product.stock,
		imageUrl: sql`(
				SELECT url FROM ${productImage}
				WHERE ${productImage.productId} = ${product.id}
				ORDER BY ${productImage.isPrimary} DESC
				LIMIT 1
			)`
	}).from(product).where(inArray(product.shopId, shopIds)).orderBy(desc(product.viewCount)).limit(4);
	return {
		user: locals.user || { name: "Mausam Tharu" },
		shop: shops[0] ?? null,
		shops,
		stats: {
			totalRevenue,
			totalOrders,
			totalProducts,
			lowStockCount
		},
		statusCounts,
		recentOrders: orders.slice(0, 5),
		topProducts
	};
};
//#endregion
export { load };
