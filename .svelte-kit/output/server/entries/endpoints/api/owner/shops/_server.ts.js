import { t as db, u as shop } from "../../../../../chunks/db.js";
import { s as slugify } from "../../../../../chunks/utils2.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/owner/shops/+server.ts
var POST = async ({ request, locals }) => {
	if (!locals.user) return json({ error: "Sign in before creating a shop." }, { status: 401 });
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: "Invalid request." }, { status: 400 });
	}
	const name = typeof body === "object" && body !== null && "name" in body && typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
	if (!name) return json({ error: "Enter a shop name." }, { status: 400 });
	const baseSlug = slugify(name) || "shop";
	const [createdShop] = await db.insert(shop).values({
		ownerId: locals.user.id,
		name,
		slug: `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`
	}).returning({ id: shop.id });
	return json({ shopId: createdShop.id }, { status: 201 });
};
//#endregion
export { POST };
