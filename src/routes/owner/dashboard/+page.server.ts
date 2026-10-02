import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { product, productImage, order, address } from '$lib/server/db/schema';
import { eq, desc, sql, inArray } from 'drizzle-orm';
import { getOwnerShopContext } from '$lib/server/owner-shops';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { shops, selectedShop } = await getOwnerShopContext(
		locals.user!.id,
		url.searchParams.get('shop')
	);
	const shopIds = selectedShop ? [selectedShop.id] : [];

	// 1. Total products count & low stock count
	const allProducts = shopIds.length
		? await db.select().from(product).where(inArray(product.shopId, shopIds))
		: [];

	const totalProducts = allProducts.length;
	const lowStockCount = allProducts.filter((p) => p.stock <= 5).length;

	// 2. Orders & Revenue
	const ordersQuery = db
		.select({
			id: order.id,
			orderNumber: order.orderNumber,
			total: order.total,
			status: order.status,
			createdAt: order.createdAt,
			customerName: address.fullName
		})
		.from(order)
		.leftJoin(address, eq(order.addressId, address.id));

	const orders = shopIds.length
		? await ordersQuery.where(inArray(order.shopId, shopIds)).orderBy(desc(order.createdAt))
		: [];

	const totalOrders = orders.length;
	const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total || '0'), 0);

	// Status breakdown
	const statusCounts = {
		delivered: orders.filter((o) => o.status === 'delivered').length,
		processing: orders.filter((o) => o.status === 'processing').length,
		shipped: orders.filter((o) => o.status === 'shipped').length,
		pending: orders.filter((o) => o.status === 'pending').length
	};

	// 3. Top Products with images
	const topProducts = shopIds.length
		? await db
				.select({
					id: product.id,
					name: product.name,
					slug: product.slug,
					price: product.price,
					viewCount: product.viewCount,
					stock: product.stock,
					imageUrl: sql<string>`(
				SELECT url FROM ${productImage}
				WHERE ${productImage.productId} = ${product.id}
				ORDER BY ${productImage.isPrimary} DESC
				LIMIT 1
			)`
				})
				.from(product)
				.where(inArray(product.shopId, shopIds))
				.orderBy(desc(product.viewCount))
				.limit(4)
		: [];

	const revenueByDay = Array.from({ length: 7 }, (_, index) => {
		const date = new Date();
		date.setDate(date.getDate() - (6 - index));
		const dailyOrders = orders.filter(
			(item) => new Date(item.createdAt).toDateString() === date.toDateString()
		);

		return {
			label: date.toLocaleDateString('en-US', { weekday: 'short' }),
			revenue: dailyOrders.reduce((sum, item) => sum + Number(item.total || 0), 0),
			orders: dailyOrders.length
		};
	});

	return {
		user: locals.user || { name: 'Mausam Tharu' },
		shop: selectedShop,
		shops,
		stats: {
			totalRevenue,
			totalOrders,
			totalProducts,
			lowStockCount
		},
		statusCounts,
		revenueByDay,
		recentOrders: orders.slice(0, 5),
		topProducts
	};
};
