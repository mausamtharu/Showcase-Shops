import { t as db, u as shop } from "../../../../chunks/db.js";
import { s as slugify } from "../../../../chunks/utils2.js";
import { fail, redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
//#region src/routes/owner/shop/+page.server.ts
var load = async ({ locals, url }) => {
	const shops = await db.select().from(shop).where(eq(shop.ownerId, locals.user.id));
	return {
		shop: shops.find((item) => item.id === url.searchParams.get("shop")) ?? shops[0] ?? null,
		shops
	};
};
var actions = {
	createShop: async ({ request, locals }) => {
		const name = (await request.formData()).get("name")?.toString().trim();
		if (!name) return fail(400, { error: "Shop name is required." });
		const slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 7)}`;
		const [createdShop] = await db.insert(shop).values({
			ownerId: locals.user.id,
			name,
			slug
		}).returning({ id: shop.id });
		throw redirect(303, `/owner/shop?shop=${createdShop.id}`);
	},
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const shopId = data.get("shopId")?.toString();
		const name = data.get("name")?.toString().trim();
		const tagline = data.get("tagline")?.toString().trim() || null;
		const description = data.get("description")?.toString().trim() || null;
		const phone = data.get("phone")?.toString().trim() || null;
		const location = data.get("location")?.toString().trim() || null;
		const address = data.get("address")?.toString().trim() || null;
		const bannerUrl = data.get("bannerUrl")?.toString().trim() || null;
		const logoUrl = data.get("logoUrl")?.toString().trim() || null;
		if (!shopId || !name) return fail(400, { error: "Shop name is required" });
		try {
			if (!(await db.update(shop).set({
				name,
				tagline,
				description,
				phone,
				location,
				address,
				bannerUrl,
				logoUrl,
				updatedAt: /* @__PURE__ */ new Date()
			}).where(and(eq(shop.id, shopId), eq(shop.ownerId, locals.user.id))).returning({ id: shop.id })).length) return fail(404, { error: "Shop not found in your account." });
			return {
				success: true,
				message: "Shop profile updated successfully!"
			};
		} catch (err) {
			return fail(500, { error: "Failed to update shop profile" });
		}
	}
};
//#endregion
export { actions, load };
