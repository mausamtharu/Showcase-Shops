// @ts-nocheck
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { order, orderItem, address, shop } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const user = locals.user;

	// Load orders: either by user ID, or for preview show recent orders
	const ordersQuery = db
		.select({
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
		})
		.from(order)
		.leftJoin(shop, eq(order.shopId, shop.id))
		.leftJoin(address, eq(order.addressId, address.id))
		.orderBy(desc(order.createdAt));

	const orders = user
		? await ordersQuery.where(eq(order.userId, user.id))
		: await ordersQuery.limit(5);

	// Load items
	const orderIds = orders.map((o) => o.id);
	let allItems: any[] = [];
	if (orderIds.length > 0) {
		allItems = await db.select().from(orderItem);
	}

	const ordersWithItems = orders.map((o) => ({
		...o,
		items: allItems.filter((i) => i.orderId === o.id)
	}));

	return {
		user,
		orders: ordersWithItems
	};
};
