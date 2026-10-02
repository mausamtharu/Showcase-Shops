// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { shop, product, productImage, category, shopReview } from '$lib/server/db/schema';
import { and, count, desc, eq, sql } from 'drizzle-orm';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
	const shopSlug = params.slug;

	const [shopData] = await db.select().from(shop).where(eq(shop.slug, shopSlug)).limit(1);

	if (!shopData) {
		throw error(404, 'Shop not found');
	}

	// Fetch shop products with primary image
	const rawProducts = await db
		.select({
			id: product.id,
			name: product.name,
			slug: product.slug,
			price: product.price,
			discountPrice: product.discountPrice,
			stock: product.stock,
			avgRating: product.avgRating,
			reviewCount: product.reviewCount,
			isFeatured: product.isFeatured,
			categoryId: product.categoryId,
			categoryName: category.name,
			imageUrl: sql<string>`(
				SELECT url FROM ${productImage}
				WHERE ${productImage.productId} = ${product.id}
				ORDER BY ${productImage.isPrimary} DESC, ${productImage.sortOrder} ASC
				LIMIT 1
			)`
		})
		.from(product)
		.leftJoin(category, eq(product.categoryId, category.id))
		.where(eq(product.shopId, shopData.id))
		.orderBy(desc(product.createdAt));

	// Unique categories in this shop
	const shopCategories = Array.from(
		new Set(rawProducts.map((p) => p.categoryName).filter(Boolean))
	);
	const [ratingSummary] = await db
		.select({ average: sql<string>`avg(${shopReview.rating})`, count: count() })
		.from(shopReview)
		.where(eq(shopReview.shopId, shopData.id));
	const reviews = await db
		.select({
			rating: shopReview.rating,
			comment: shopReview.comment,
			createdAt: shopReview.createdAt
		})
		.from(shopReview)
		.where(eq(shopReview.shopId, shopData.id))
		.orderBy(desc(shopReview.createdAt))
		.limit(10);
	const [userReview] = locals.user
		? await db
				.select({ rating: shopReview.rating, comment: shopReview.comment })
				.from(shopReview)
				.where(and(eq(shopReview.shopId, shopData.id), eq(shopReview.userId, locals.user.id)))
				.limit(1)
		: [];

	return {
		shop: shopData,
		products: rawProducts,
		categories: shopCategories,
		rating: { average: Number(ratingSummary.average ?? 0), count: ratingSummary.count },
		reviews,
		userReview: userReview ?? null,
		user: locals.user ?? null
	};
};

export const actions = {
	rateShop: async ({ request, params, locals }: import('./$types').RequestEvent) => {
		if (!locals.user) return fail(401, { error: 'Please sign in to rate this shop.' });

		const [targetShop] = await db
			.select({ id: shop.id })
			.from(shop)
			.where(eq(shop.slug, params.slug))
			.limit(1);
		if (!targetShop) return fail(404, { error: 'Shop not found.' });

		const formData = await request.formData();
		const rating = Number(formData.get('rating'));
		const comment = formData.get('comment')?.toString().trim().slice(0, 2000) || null;
		if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
			return fail(400, { error: 'Choose a rating from 1 to 5 stars.' });
		}

		await db
			.insert(shopReview)
			.values({ shopId: targetShop.id, userId: locals.user.id, rating, comment })
			.onConflictDoUpdate({
				target: [shopReview.shopId, shopReview.userId],
				set: { rating, comment, createdAt: new Date() }
			});

		return { success: true, message: 'Your shop rating has been saved.' };
	}
};
;null as any as Actions;