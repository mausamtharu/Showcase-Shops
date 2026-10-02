// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	product,
	productImage,
	productVariant,
	shop,
	review,
	category
} from '$lib/server/db/schema';
import { and, eq, desc, sql } from 'drizzle-orm';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
	const productData = await db
		.select({
			id: product.id,
			name: product.name,
			slug: product.slug,
			description: product.description,
			price: product.price,
			discountPrice: product.discountPrice,
			stock: product.stock,
			sku: product.sku,
			tags: product.tags,
			avgRating: product.avgRating,
			reviewCount: product.reviewCount,
			viewCount: product.viewCount,
			shopId: product.shopId,
			shopName: shop.name,
			shopSlug: shop.slug,
			shopLogoUrl: shop.logoUrl,
			shopLocation: shop.location,
			categoryId: product.categoryId
		})
		.from(product)
		.leftJoin(shop, eq(product.shopId, shop.id))
		.where(eq(product.id, params.id))
		.limit(1);

	if (!productData[0]) {
		throw error(404, 'Product not found');
	}

	// Increment view count (fire and forget)
	db.update(product)
		.set({ viewCount: sql`${product.viewCount} + 1` })
		.where(eq(product.id, params.id))
		.execute()
		.catch(() => {});

	const images = await db
		.select()
		.from(productImage)
		.where(eq(productImage.productId, params.id))
		.orderBy(productImage.sortOrder);

	const variants = await db
		.select()
		.from(productVariant)
		.where(eq(productVariant.productId, params.id));

	const reviews = await db
		.select()
		.from(review)
		.where(eq(review.productId, params.id))
		.orderBy(desc(review.createdAt))
		.limit(10);

	// Related products
	const relatedProducts = await db
		.select({
			id: product.id,
			name: product.name,
			slug: product.slug,
			price: product.price,
			discountPrice: product.discountPrice,
			stock: product.stock,
			avgRating: product.avgRating,
			reviewCount: product.reviewCount,
			shopId: product.shopId,
			shopName: shop.name,
			imageUrl: sql<string>`(
				SELECT url FROM product_image 
				WHERE product_id = ${product.id} AND is_primary = true 
				LIMIT 1
			)`
		})
		.from(product)
		.leftJoin(shop, eq(product.shopId, shop.id))
		.where(eq(product.shopId, productData[0].shopId))
		.limit(4);

	return {
		product: productData[0],
		images,
		variants,
		reviews,
		relatedProducts,
		user: locals.user ?? null
	};
};

export const actions = {
	rateProduct: async ({ request, params, locals }: import('./$types').RequestEvent) => {
		if (!locals.user) return fail(401, { error: 'Please sign in to rate this product.' });

		const formData = await request.formData();
		const rating = Number(formData.get('rating'));
		const title = formData.get('title')?.toString().trim().slice(0, 120) || null;
		const body = formData.get('body')?.toString().trim().slice(0, 2000) || null;
		if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
			return fail(400, { error: 'Choose a rating from 1 to 5 stars.' });
		}

		const [targetProduct] = await db
			.select({ id: product.id })
			.from(product)
			.where(eq(product.id, params.id))
			.limit(1);
		if (!targetProduct) return fail(404, { error: 'Product not found.' });

		await db.transaction(async (tx) => {
			const [existingReview] = await tx
				.select({ id: review.id })
				.from(review)
				.where(and(eq(review.productId, params.id), eq(review.userId, locals.user!.id)))
				.limit(1);

			if (existingReview) {
				await tx
					.update(review)
					.set({ rating, title, body, createdAt: new Date() })
					.where(eq(review.id, existingReview.id));
			} else {
				await tx.insert(review).values({
					productId: params.id,
					userId: locals.user!.id,
					rating,
					title,
					body
				});
			}

			const [summary] = await tx
				.select({ average: sql<string>`avg(${review.rating})`, count: sql<number>`count(*)::int` })
				.from(review)
				.where(eq(review.productId, params.id));
			await tx
				.update(product)
				.set({ avgRating: Number(summary.average ?? 0).toFixed(2), reviewCount: summary.count })
				.where(eq(product.id, params.id));
		});

		return { success: true, message: 'Your product rating has been saved.' };
	}
};
;null as any as Actions;