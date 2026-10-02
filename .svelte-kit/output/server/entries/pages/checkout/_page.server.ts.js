import { a as orderItem, i as order, n as address, t as db, u as shop } from "../../../chunks/db.js";
import { a as generateOrderNumber } from "../../../chunks/utils2.js";
import { fail } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/checkout/+page.server.ts
var load = async ({ locals }) => {
	const user = locals.user;
	let userAddresses = [];
	if (user) userAddresses = await db.select().from(address).where(eq(address.userId, user.id));
	return {
		user,
		addresses: userAddresses
	};
};
var actions = { placeOrder: async ({ request, locals }) => {
	const data = await request.formData();
	const fullName = data.get("fullName")?.toString().trim();
	const phone = data.get("phone")?.toString().trim();
	const street = data.get("street")?.toString().trim();
	const city = data.get("city")?.toString().trim();
	const province = data.get("province")?.toString().trim() || "Lumbini";
	const postalCode = data.get("postalCode")?.toString().trim() || "";
	const paymentMethod = data.get("paymentMethod")?.toString();
	const itemsJson = data.get("items")?.toString();
	const notes = data.get("notes")?.toString().trim() || null;
	if (!fullName || !phone || !street || !city) return fail(400, { error: "Please fill in all required shipping address fields." });
	if (![
		"esewa",
		"khalti",
		"stripe",
		"cod"
	].includes(paymentMethod)) return fail(400, { error: "Invalid payment method selected." });
	let items = [];
	try {
		items = JSON.parse(itemsJson || "[]");
	} catch {
		return fail(400, { error: "Invalid items in cart." });
	}
	if (items.length === 0) return fail(400, { error: "Your cart is empty." });
	let subtotal = 0;
	for (const it of items) {
		const price = Number(it.discountPrice ?? it.price ?? 0);
		const qty = Number(it.quantity || 1);
		subtotal += price * qty;
	}
	const shippingFee = subtotal >= 5e3 ? 0 : 250;
	const total = subtotal + shippingFee;
	const userId = locals.user?.id || `guest_${Date.now()}`;
	try {
		const [newAddr] = await db.insert(address).values({
			userId,
			fullName,
			phone,
			street,
			city,
			province,
			postalCode,
			isDefault: true
		}).returning();
		let shopId = items[0]?.shopId;
		if (!shopId) {
			const [firstShop] = await db.select().from(shop).limit(1);
			shopId = firstShop?.id;
		}
		const orderNumber = generateOrderNumber();
		const [createdOrder] = await db.insert(order).values({
			orderNumber,
			userId,
			shopId,
			addressId: newAddr?.id,
			status: "pending",
			paymentMethod,
			paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
			subtotal: subtotal.toFixed(2),
			shippingFee: shippingFee.toFixed(2),
			total: total.toFixed(2),
			notes
		}).returning();
		for (const item of items) await db.insert(orderItem).values({
			orderId: createdOrder.id,
			productId: item.productId,
			productName: item.name,
			productImageUrl: item.imageUrl,
			price: String(item.discountPrice ?? item.price),
			quantity: Number(item.quantity),
			variantSelections: item.variantSelections || null
		});
		return {
			success: true,
			orderNumber,
			orderId: createdOrder.id,
			total: total.toFixed(2)
		};
	} catch (err) {
		console.error("Order placement error:", err);
		return fail(500, { error: "Failed to process order. Please try again." });
	}
} };
//#endregion
export { actions, load };
