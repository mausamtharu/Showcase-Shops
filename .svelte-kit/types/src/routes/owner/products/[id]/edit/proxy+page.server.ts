// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { product, productImage, category, shop } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import { getOwnedShop, getOwnerShopContext } from '$lib/server/owner-shops';

export const load = async ({ params, locals, url }: Parameters<PageServerLoad>[0]) => {
	const productId = params.id;
	const { selectedShop } = await getOwnerShopContext(locals.user!.id, url.searchParams.get('shop'));
	if (!selectedShop) throw error(404, 'Shop not found');

	const [prod] = await db
		.select({
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
			imageUrl: sql<string>`(
				SELECT url FROM ${productImage}
				WHERE ${productImage.productId} = ${product.id}
				ORDER BY ${productImage.isPrimary} DESC, ${productImage.sortOrder} ASC
				LIMIT 1
			)`
		})
		.from(product)
		.where(and(eq(product.id, productId), eq(product.shopId, selectedShop.id)))
		.limit(1);

	if (!prod) {
		throw error(404, 'Product not found');
	}

	const categories = await db.select().from(category);

	return {
		product: prod,
		categories,
		shop: selectedShop
	};
};

export const actions = {
	default: async ({ request, params, locals, url }: import('./$types').RequestEvent) => {
		const productId = params.id;
		const shopId = url.searchParams.get('shop');
		if (!shopId) return fail(400, { error: 'Choose a shop first.' });
		const ownedShop = await getOwnedShop(locals.user!.id, shopId);
		if (!ownedShop) return fail(403, { error: 'That shop is not linked to your account.' });
		const data = await request.formData();

		const name = data.get('name')?.toString().trim();
		const description = data.get('description')?.toString().trim() || null;
		const priceStr = data.get('price')?.toString();
		const discountPriceStr = data.get('discountPrice')?.toString() || null;
		const stockStr = data.get('stock')?.toString() || '0';
		const sku = data.get('sku')?.toString().trim() || null;
		const categoryId = data.get('categoryId')?.toString() || null;
		const imageUrl = data.get('imageUrl')?.toString().trim();
		const isFeatured = data.get('isFeatured') === 'on';

		if (!name || !priceStr) {
			return fail(400, { error: 'Product name and price are required.' });
		}

		const price = parseFloat(priceStr);
		const discountPrice = discountPriceStr ? parseFloat(discountPriceStr) : null;
		const stock = parseInt(stockStr, 10) || 0;

		try {
			await db
				.update(product)
				.set({
					name,
					description,
					price: price.toFixed(2),
					discountPrice: discountPrice ? discountPrice.toFixed(2) : null,
					stock,
					sku,
					categoryId: categoryId || null,
					isFeatured,
					updatedAt: new Date()
				})
				.where(and(eq(product.id, productId), eq(product.shopId, ownedShop.id)));

			if (imageUrl) {
				const [existingImg] = await db
					.select()
					.from(productImage)
					.where(eq(productImage.productId, productId))
					.orderBy(desc(productImage.isPrimary), asc(productImage.sortOrder))
					.limit(1);

				if (existingImg) {
					await db
						.update(productImage)
						.set({ url: imageUrl, isPrimary: true })
						.where(eq(productImage.id, existingImg.id));
				} else {
					await db.insert(productImage).values({
						productId,
						url: imageUrl,
						isPrimary: true
					});
				}
			}

			throw redirect(303, `/owner/products?shop=${ownedShop.id}`);
		} catch (err: any) {
			if (err?.status === 303) throw err;
			console.error('Error updating product:', err);
			return fail(500, { error: 'Failed to update product' });
		}
	}
};
;null as any as Actions;