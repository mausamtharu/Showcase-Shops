// @ts-nocheck
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { shop, product } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export const load = async () => {
	const allShops = await db
		.select({
			id: shop.id,
			name: shop.name,
			slug: shop.slug,
			tagline: shop.tagline,
			description: shop.description,
			logoUrl: shop.logoUrl,
			bannerUrl: shop.bannerUrl,
			category: shop.category,
			location: shop.location,
			phone: shop.phone,
			productCount: sql<number>`(
				SELECT COUNT(*)::int FROM ${product}
				WHERE ${product.shopId} = ${shop.id} AND ${product.isActive} = true
			)`
		})
		.from(shop)
		.where(eq(shop.isActive, true));

	return { shops: allShops };
};
;null as any as PageServerLoad;