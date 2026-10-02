import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { order, orderItem, address } from '$lib/server/db/schema';
import { and, eq, desc, inArray } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { getOwnedShop, getOwnerShopContext } from '$lib/server/owner-shops';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { shops, selectedShop } = await getOwnerShopContext(
		locals.user!.id,
		url.searchParams.get('shop')
	);

	// Load orders
	const ordersQuery = db
		.select({
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
		})
		.from(order)
		.leftJoin(address, eq(order.addressId, address.id));

	const orders = selectedShop
		? await ordersQuery.where(eq(order.shopId, selectedShop.id)).orderBy(desc(order.createdAt))
		: [];

	// Load order items
	const orderIds = orders.map((o) => o.id);
	let allItems: any[] = [];
	if (orderIds.length > 0) {
		allItems = await db.select().from(orderItem).where(inArray(orderItem.orderId, orderIds));
	}

	const ordersWithItems = orders.map((o) => ({
		...o,
		items: allItems.filter((i) => i.orderId === o.id)
	}));

	return {
		shop: selectedShop,
		shops,
		orders: ordersWithItems
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, locals }) => {
		const data = await request.formData();
		const orderId = data.get('orderId')?.toString();
		const shopId = data.get('shopId')?.toString();
		const status = data.get('status')?.toString() as any;

		if (!orderId || !status || !shopId) {
			return fail(400, { error: 'Order, status, and shop are required.' });
		}
		const ownedShop = await getOwnedShop(locals.user!.id, shopId);
		if (!ownedShop) return fail(403, { error: 'That shop is not linked to your account.' });

		try {
			const updated = await db
				.update(order)
				.set({ status, updatedAt: new Date() })
				.where(and(eq(order.id, orderId), eq(order.shopId, ownedShop.id)))
				.returning({ id: order.id });
			if (!updated.length) return fail(404, { error: 'Order not found in this shop.' });

			return { success: true, message: `Order status updated to ${status}` };
		} catch (e: any) {
			return fail(500, { error: 'Failed to update order status' });
		}
	}
};
