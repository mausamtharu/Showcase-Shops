import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { order, shop } from '$lib/server/db/schema';
import { and, count, eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { slugify } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, url }) => {
	const shops = await db.select().from(shop).where(eq(shop.ownerId, locals.user!.id));
	const userShop =
		shops.find((item) => item.id === url.searchParams.get('shop')) ?? shops[0] ?? null;

	return { shop: userShop, shops };
};

export const actions: Actions = {
	createShop: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		if (!name) return fail(400, { error: 'Shop name is required.' });

		const slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 7)}`;
		const [createdShop] = await db
			.insert(shop)
			.values({ ownerId: locals.user!.id, name, slug, isActive: true })
			.returning({ id: shop.id });

		throw redirect(303, `/owner/shop?shop=${createdShop.id}`);
	},
	publishShop: async ({ request, locals }) => {
		const data = await request.formData();
		const shopId = data.get('shopId')?.toString();
		if (!shopId) return fail(400, { error: 'Shop not found.' });

		const [updatedShop] = await db
			.update(shop)
			.set({ isActive: true, updatedAt: new Date() })
			.where(and(eq(shop.id, shopId), eq(shop.ownerId, locals.user!.id)))
			.returning({ id: shop.id });
		if (!updatedShop) return fail(404, { error: 'Shop not found in your account.' });

		throw redirect(303, `/owner/shop?shop=${updatedShop.id}`);
	},
	unpublishShop: async ({ request, locals }) => {
		const data = await request.formData();
		const shopId = data.get('shopId')?.toString();
		if (!shopId) return fail(400, { error: 'Shop not found.' });

		const [updatedShop] = await db
			.update(shop)
			.set({ isActive: false, updatedAt: new Date() })
			.where(and(eq(shop.id, shopId), eq(shop.ownerId, locals.user!.id)))
			.returning({ id: shop.id });
		if (!updatedShop) return fail(404, { error: 'Shop not found in your account.' });

		throw redirect(303, `/owner/shop?shop=${updatedShop.id}`);
	},
	updateShop: async ({ request, locals }) => {
		const data = await request.formData();
		const shopId = data.get('shopId')?.toString();
		const name = data.get('name')?.toString().trim();
		const tagline = data.get('tagline')?.toString().trim() || null;
		const description = data.get('description')?.toString().trim() || null;
		const phone = data.get('phone')?.toString().trim() || null;
		const location = data.get('location')?.toString().trim() || null;
		const address = data.get('address')?.toString().trim() || null;
		const bannerUrl = data.get('bannerUrl')?.toString().trim() || null;
		const logoUrl = data.get('logoUrl')?.toString().trim() || null;

		if (!shopId || !name) return fail(400, { error: 'Shop name is required.' });

		const [updated] = await db
			.update(shop)
			.set({
				name,
				tagline,
				description,
				phone,
				location,
				address,
				bannerUrl,
				logoUrl,
				updatedAt: new Date()
			})
			.where(and(eq(shop.id, shopId), eq(shop.ownerId, locals.user!.id)))
			.returning({ id: shop.id });
		if (!updated) return fail(404, { error: 'Shop not found in your account.' });

		return { success: true, message: 'Shop profile updated successfully!' };
	},
	deleteShop: async ({ request, locals }) => {
		const data = await request.formData();
		const shopId = data.get('shopId')?.toString();
		if (!shopId) return fail(400, { error: 'Shop not found.' });

		const [ownedShops, ownedShop] = await Promise.all([
			db.select({ id: shop.id }).from(shop).where(eq(shop.ownerId, locals.user!.id)),
			db
				.select({ id: shop.id })
				.from(shop)
				.where(and(eq(shop.id, shopId), eq(shop.ownerId, locals.user!.id)))
				.limit(1)
		]);
		if (!ownedShop.length) return fail(404, { error: 'Shop not found in your account.' });
		if (ownedShops.length <= 1) {
			return fail(400, { error: 'Keep at least one shop on your owner account.' });
		}

		const [orderSummary] = await db
			.select({ total: count() })
			.from(order)
			.where(eq(order.shopId, shopId));
		if (orderSummary.total > 0) {
			return fail(409, {
				error: 'This shop has order history and cannot be deleted. Unpublish it instead.'
			});
		}

		const [deletedShop] = await db
			.delete(shop)
			.where(and(eq(shop.id, shopId), eq(shop.ownerId, locals.user!.id)))
			.returning({ id: shop.id });
		if (!deletedShop) return fail(404, { error: 'Shop not found in your account.' });

		const nextShop = ownedShops.find((owned) => owned.id !== deletedShop.id);
		if (!nextShop) return fail(500, { error: 'Could not select another shop.' });
		throw redirect(303, `/owner/shop?shop=${nextShop.id}`);
	}
};
