import { and, asc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { shop } from '$lib/server/db/schema';

export async function getOwnerShopContext(ownerId: string, requestedShopId?: string | null) {
	const shops = await db
		.select()
		.from(shop)
		.where(eq(shop.ownerId, ownerId))
		.orderBy(asc(shop.createdAt), asc(shop.id));

	const selectedShop =
		shops.find((ownedShop) => ownedShop.id === requestedShopId) ?? shops[0] ?? null;

	return { shops, selectedShop };
}

export async function getOwnedShop(ownerId: string, shopId: string) {
	const [ownedShop] = await db
		.select()
		.from(shop)
		.where(and(eq(shop.id, shopId), eq(shop.ownerId, ownerId)))
		.limit(1);

	return ownedShop ?? null;
}
