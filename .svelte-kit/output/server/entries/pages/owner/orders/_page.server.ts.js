import { a as orderItem, i as order, n as address, t as db, u as shop } from "../../../../chunks/db.js";
import { fail } from "@sveltejs/kit";
import { and, desc, eq, inArray } from "drizzle-orm";
//#region src/routes/owner/orders/+page.server.ts
var load = async ({ locals }) => {
	const shops = await db.select().from(shop).where(eq(shop.ownerId, locals.user.id));
	const shopIds = shops.map((ownedShop) => ownedShop.id);
	const ordersQuery = db.select({
		id: order.id,
		orderNumber: order.orderNumber,
		userId: order.userId,
		shopId: order.shopId,
		status: order.status,
		paymentMethod: order.paymentMethod,
		paymentStatus: order.paymentStatus,
		subtotal: order.subtotal,
		shippingFee: order.shippingFee,
		total: order.total,
		notes: order.notes,
		createdAt: order.createdAt,
		customerName: address.fullName,
		customerPhone: address.phone,
		customerCity: address.city,
		customerStreet: address.street
	}).from(order).leftJoin(address, eq(order.addressId, address.id));
	const orders = shopIds.length ? await ordersQuery.where(inArray(order.shopId, shopIds)).orderBy(desc(order.createdAt)) : [];
	const orderIds = orders.map((o) => o.id);
	let allItems = [];
	if (orderIds.length > 0) allItems = await db.select().from(orderItem).where(inArray(orderItem.orderId, orderIds));
	const ordersWithItems = orders.map((o) => ({
		...o,
		items: allItems.filter((i) => i.orderId === o.id)
	}));
	return {
		shop: shops[0] ?? null,
		shops,
		orders: ordersWithItems
	};
};
var actions = { updateStatus: async ({ request, locals }) => {
	const data = await request.formData();
	const orderId = data.get("orderId")?.toString();
	const status = data.get("status")?.toString();
	if (!orderId || !status) return fail(400, { error: "Order ID and status required" });
	const shopIds = (await db.select({ id: shop.id }).from(shop).where(eq(shop.ownerId, locals.user.id))).map((ownedShop) => ownedShop.id);
	if (!shopIds.length) return fail(403, { error: "No shops are linked to this account." });
	try {
		await db.update(order).set({
			status,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(and(eq(order.id, orderId), inArray(order.shopId, shopIds)));
		return {
			success: true,
			message: `Order status updated to ${status}`
		};
	} catch (e) {
		return fail(500, { error: "Failed to update order status" });
	}
} };
//#endregion
export { actions, load };
