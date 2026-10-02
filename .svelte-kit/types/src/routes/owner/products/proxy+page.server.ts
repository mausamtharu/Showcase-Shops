// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { product, productImage, category } from '$lib/server/db/schema';
import { and, eq, desc, sql } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { getOwnedShop, getOwnerShopContext } from '$lib/server/owner-shops';

export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
	const { shops, selectedShop } = await getOwnerShopContext(
		locals.user!.id,
		url.searchParams.get('shop')
	);

	// Load products
	const productsQuery = db
		.select({
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
			imageUrl: sql<string>`(
				SELECT url FROM ${productImage}
				WHERE ${productImage.productId} = ${product.id}
				ORDER BY ${productImage.isPrimary} DESC, ${productImage.sortOrder} ASC
				LIMIT 1
			)`
		})
		.from(product)
		.leftJoin(category, eq(product.categoryId, category.id));

	const products = selectedShop
		? await productsQuery
				.where(eq(product.shopId, selectedShop.id))
				.orderBy(desc(product.createdAt))
		: [];

	return {
		shop: selectedShop,
		shops,
		products
	};
};

export const actions = {
	delete: async ({ request, locals }: import('./$types').RequestEvent) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const shopId = data.get('shopId')?.toString();
		if (!id) return fail(400, { error: 'Product ID required' });
		if (!shopId) return fail(400, { error: 'Choose a shop first.' });
		const ownedShop = await getOwnedShop(locals.user!.id, shopId);
		if (!ownedShop) return fail(403, { error: 'That shop is not linked to your account.' });

		try {
			const deleted = await db
				.delete(product)
				.where(and(eq(product.id, id), eq(product.shopId, ownedShop.id)))
				.returning({ id: product.id });
			if (!deleted.length) return fail(404, { error: 'Product not found in your shops.' });
			return { success: true, message: 'Product removed' };
		} catch (e: any) {
			return fail(500, { error: 'Failed to delete product' });
		}
	},
	toggleStatus: async ({ request, locals }: import('./$types').RequestEvent) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const shopId = data.get('shopId')?.toString();
		const currentStatus = data.get('currentStatus') === 'true';
		if (!id) return fail(400, { error: 'Product ID required' });
		if (!shopId) return fail(400, { error: 'Choose a shop first.' });
		const ownedShop = await getOwnedShop(locals.user!.id, shopId);
		if (!ownedShop) return fail(403, { error: 'That shop is not linked to your account.' });

		try {
			await db
				.update(product)
				.set({ isActive: !currentStatus })
				.where(and(eq(product.id, id), eq(product.shopId, ownedShop.id)));
			return { success: true };
		} catch (e: any) {
			return fail(500, { error: 'Failed to update product status' });
		}
	}
};
;null as any as Actions;