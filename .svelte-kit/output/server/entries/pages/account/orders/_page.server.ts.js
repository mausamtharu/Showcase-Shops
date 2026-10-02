import { a as orderItem, i as order, n as address, t as db, u as shop } from "../../../../chunks/db.js";
import { desc, eq } from "drizzle-orm";
//#region src/routes/account/orders/+page.server.ts
var load = async ({ locals }) => {
	const user = locals.user;
	const ordersQuery = db.select({
		id: order.id,
		orderNumber: order.orderNumber,
		status: order.status,
		paymentMethod: order.paymentMethod,
		paymentStatus: order.paymentStatus,
		subtotal: order.subtotal,
		shippingFee: order.shippingFee,
		total: order.total,
		createdAt: order.createdAt,
		shopName: shop.name,
		shopSlug: shop.slug,
		customerCity: address.city
	}).from(order).leftJoin(shop, eq(order.shopId, shop.id)).leftJoin(address, eq(order.addressId, address.id)).orderBy(desc(order.createdAt));
	const orders = user ? await ordersQuery.where(eq(order.userId, user.id)) : await ordersQuery.limit(5);
	const orderIds = orders.map((o) => o.id);
	let allItems = [];
	if (orderIds.length > 0) allItems = await db.select().from(orderItem);
	return {
		user,
		orders: orders.map((o) => ({
			...o,
			items: allItems.filter((i) => i.orderId === o.id)
		}))
	};
};
//#endregion
export { load };
