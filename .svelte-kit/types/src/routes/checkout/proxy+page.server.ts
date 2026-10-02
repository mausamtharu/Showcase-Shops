// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { order, orderItem, address, shop, product } from '$lib/server/db/schema';
import { generateOrderNumber } from '$lib/utils';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const user = locals.user;

	// Load user addresses if logged in
	let userAddresses: any[] = [];
	if (user) {
		userAddresses = await db
			.select()
			.from(address)
			.where(eq(address.userId, user.id));
	}

	return {
		user,
		addresses: userAddresses
	};
};

export const actions = {
	placeOrder: async ({ request, locals }: import('./$types').RequestEvent) => {
		const data = await request.formData();

		const fullName = data.get('fullName')?.toString().trim();
		const phone = data.get('phone')?.toString().trim();
		const street = data.get('street')?.toString().trim();
		const city = data.get('city')?.toString().trim();
		const province = data.get('province')?.toString().trim() || 'Lumbini';
		const postalCode = data.get('postalCode')?.toString().trim() || '';
		const paymentMethod = data.get('paymentMethod')?.toString() as 'esewa' | 'khalti' | 'stripe' | 'cod';
		const itemsJson = data.get('items')?.toString();
		const notes = data.get('notes')?.toString().trim() || null;

		if (!fullName || !phone || !street || !city) {
			return fail(400, { error: 'Please fill in all required shipping address fields.' });
		}

		if (!['esewa', 'khalti', 'stripe', 'cod'].includes(paymentMethod)) {
			return fail(400, { error: 'Invalid payment method selected.' });
		}

		let items: any[] = [];
		try {
			items = JSON.parse(itemsJson || '[]');
		} catch {
			return fail(400, { error: 'Invalid items in cart.' });
		}

		if (items.length === 0) {
			return fail(400, { error: 'Your cart is empty.' });
		}

		// Calculate total
		let subtotal = 0;
		for (const it of items) {
			const price = Number(it.discountPrice ?? it.price ?? 0);
			const qty = Number(it.quantity || 1);
			subtotal += price * qty;
		}

		const shippingFee = subtotal >= 5000 ? 0 : 250;
		const total = subtotal + shippingFee;

		const userId = locals.user?.id || `guest_${Date.now()}`;

		try {
			// Save address
			const [newAddr] = await db
				.insert(address)
				.values({
					userId,
					fullName,
					phone,
					street,
					city,
					province,
					postalCode,
					isDefault: true
				})
				.returning();

			// Group items by shop or find shopId
			// For simplicity, take shopId from first item or fallback to a shop in DB
			let shopId = items[0]?.shopId;
			if (!shopId) {
				const [firstShop] = await db.select().from(shop).limit(1);
				shopId = firstShop?.id;
			}

			const orderNumber = generateOrderNumber();

			// Insert Order
			const [createdOrder] = await db
				.insert(order)
				.values({
					orderNumber,
					userId,
					shopId,
					addressId: newAddr?.id,
					status: 'pending',
					paymentMethod,
					paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
					subtotal: subtotal.toFixed(2),
					shippingFee: shippingFee.toFixed(2),
					total: total.toFixed(2),
					notes
				})
				.returning();

			// Insert Order Items
			for (const item of items) {
				await db.insert(orderItem).values({
					orderId: createdOrder.id,
					productId: item.productId,
					productName: item.name,
					productImageUrl: item.imageUrl,
					price: String(item.discountPrice ?? item.price),
					quantity: Number(item.quantity),
					variantSelections: item.variantSelections || null
				});
			}

			return {
				success: true,
				orderNumber,
				orderId: createdOrder.id,
				total: total.toFixed(2)
			};
		} catch (err: any) {
			console.error('Order placement error:', err);
			return fail(500, { error: 'Failed to process order. Please try again.' });
		}
	}
};
;null as any as Actions;