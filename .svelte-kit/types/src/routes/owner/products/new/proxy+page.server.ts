// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { product, productImage, category, shop } from '$lib/server/db/schema';
import { slugify } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { getOwnedShop, getOwnerShopContext } from '$lib/server/owner-shops';

export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
	const { shops, selectedShop } = await getOwnerShopContext(
		locals.user!.id,
		url.searchParams.get('shop')
	);

	const categories = await db.select().from(category);

	return { shops, selectedShop, categories };
};

export const actions = {
	default: async ({ request, locals, url }: import('./$types').RequestEvent) => {
		const data = await request.formData();

		const name = data.get('name')?.toString().trim();
		const description = data.get('description')?.toString().trim() || null;
		const priceStr = data.get('price')?.toString();
		const discountPriceStr = data.get('discountPrice')?.toString() || null;
		const stockStr = data.get('stock')?.toString() || '10';
		const sku = data.get('sku')?.toString().trim() || null;
		const categoryId = data.get('categoryId')?.toString() || null;
		const shopId = url.searchParams.get('shop');
		const imageUrl =
			data.get('imageUrl')?.toString().trim() ||
			'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80';
		const isFeatured = data.get('isFeatured') === 'on';

		if (!name || !priceStr) {
			return fail(400, { error: 'Product name and price are required.' });
		}

		const price = parseFloat(priceStr);
		const discountPrice = discountPriceStr ? parseFloat(discountPriceStr) : null;
		const stock = parseInt(stockStr, 10) || 0;

		if (!shopId) return fail(400, { error: 'Choose a shop for this product.' });
		const userShop = await getOwnedShop(locals.user!.id, shopId);
		if (!userShop) return fail(403, { error: 'That shop is not linked to your account.' });

		const slug = slugify(name) + '-' + Math.floor(Math.random() * 1000);

		try {
			const [newProduct] = await db
				.insert(product)
				.values({
					shopId: userShop.id,
					categoryId: categoryId || null,
					name,
					slug,
					description,
					price: price.toFixed(2),
					discountPrice: discountPrice ? discountPrice.toFixed(2) : null,
					stock,
					sku,
					isFeatured,
					isActive: true
				})
				.returning();

			// Add primary image
			if (imageUrl) {
				await db.insert(productImage).values({
					productId: newProduct.id,
					url: imageUrl,
					isPrimary: true,
					sortOrder: 0
				});
			}

			throw redirect(303, `/owner/products?shop=${userShop.id}`);
		} catch (err: any) {
			if (err?.status === 303) throw err;
			console.error('Error creating product:', err);
			return fail(500, { error: 'Failed to create product. Please try again.' });
		}
	}
};
;null as any as Actions;