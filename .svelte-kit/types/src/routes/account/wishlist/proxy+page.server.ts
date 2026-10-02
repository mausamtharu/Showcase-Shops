// @ts-nocheck
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { product, productImage, shop } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export const load = async () => {
	const products = await db
		.select({
			id: product.id,
			name: product.name,
			slug: product.slug,
			price: product.price,
			discountPrice: product.discountPrice,
			stock: product.stock,
			shopId: product.shopId,
			shopName: shop.name,
			imageUrl: sql<string>`(
				SELECT url FROM ${productImage}
				WHERE ${productImage.productId} = ${product.id}
				ORDER BY ${productImage.isPrimary} DESC, ${productImage.sortOrder} ASC
				LIMIT 1
			)`
		})
		.from(product)
		.leftJoin(shop, eq(product.shopId, shop.id));

	return { allProducts: products };
};
;null as any as PageServerLoad;