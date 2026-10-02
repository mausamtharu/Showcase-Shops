import { t as db, u as shop } from "../../../chunks/db.js";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/owner/+layout.server.ts
var load = async ({ locals }) => {
	if (!locals.user) throw redirect(303, "/login?mode=owner");
	const shops = await db.select({
		id: shop.id,
		name: shop.name,
		slug: shop.slug
	}).from(shop).where(eq(shop.ownerId, locals.user.id));
	if (shops.length === 0) throw redirect(303, "/login?mode=owner&error=no-shop");
	return {
		user: locals.user,
		shops
	};
};
//#endregion
export { load };
