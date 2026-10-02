import { t as __exportAll } from "./rolldown-runtime.js";
import { t as private_env } from "./shared-server.js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { boolean, decimal, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
//#region src/lib/server/db/auth.schema.ts
var user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
var session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
}, (table) => [index("session_userId_idx").on(table.userId)]);
var account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
}, (table) => [index("account_userId_idx").on(table.userId)]);
var verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
}, (table) => [index("verification_identifier_idx").on(table.identifier)]);
var userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account)
}));
var sessionRelations = relations(session, ({ one }) => ({ user: one(user, {
	fields: [session.userId],
	references: [user.id]
}) }));
var accountRelations = relations(account, ({ one }) => ({ user: one(user, {
	fields: [account.userId],
	references: [user.id]
}) }));
//#endregion
//#region src/lib/server/db/schema.ts
var schema_exports = /* @__PURE__ */ __exportAll({
	account: () => account,
	accountRelations: () => accountRelations,
	address: () => address,
	cart: () => cart,
	cartItem: () => cartItem,
	cartItemRelations: () => cartItemRelations,
	cartRelations: () => cartRelations,
	category: () => category,
	order: () => order,
	orderItem: () => orderItem,
	orderRelations: () => orderRelations,
	orderStatusEnum: () => orderStatusEnum,
	paymentMethodEnum: () => paymentMethodEnum,
	paymentStatusEnum: () => paymentStatusEnum,
	product: () => product,
	productImage: () => productImage,
	productRelations: () => productRelations,
	productVariant: () => productVariant,
	review: () => review,
	reviewRelations: () => reviewRelations,
	session: () => session,
	sessionRelations: () => sessionRelations,
	shop: () => shop,
	shopRelations: () => shopRelations,
	shopReview: () => shopReview,
	user: () => user,
	userProfile: () => userProfile,
	userRelations: () => userRelations,
	userRoleEnum: () => userRoleEnum,
	verification: () => verification,
	wishlist: () => wishlist
});
var userRoleEnum = pgEnum("user_role", [
	"customer",
	"owner",
	"admin"
]);
var orderStatusEnum = pgEnum("order_status", [
	"pending",
	"processing",
	"shipped",
	"delivered",
	"cancelled"
]);
var paymentMethodEnum = pgEnum("payment_method", [
	"esewa",
	"khalti",
	"stripe",
	"cod"
]);
var paymentStatusEnum = pgEnum("payment_status", [
	"pending",
	"paid",
	"failed",
	"refunded"
]);
var userProfile = pgTable("user_profile", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull().unique(),
	role: userRoleEnum("role").notNull().default("customer"),
	avatarUrl: text("avatar_url"),
	phone: text("phone"),
	bio: text("bio"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var shop = pgTable("shop", {
	id: uuid("id").primaryKey().defaultRandom(),
	ownerId: text("owner_id").notNull(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	tagline: text("tagline"),
	description: text("description"),
	logoUrl: text("logo_url"),
	bannerUrl: text("banner_url"),
	category: text("category"),
	phone: text("phone"),
	location: text("location"),
	address: text("address"),
	googleMapUrl: text("google_map_url"),
	isActive: boolean("is_active").notNull().default(true),
	totalSales: decimal("total_sales", {
		precision: 10,
		scale: 2
	}).default("0"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
}, (t) => [index("shop_slug_idx").on(t.slug), index("shop_owner_idx").on(t.ownerId)]);
var category = pgTable("category", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull().unique(),
	slug: text("slug").notNull().unique(),
	iconUrl: text("icon_url"),
	description: text("description"),
	createdAt: timestamp("created_at").notNull().defaultNow()
});
var product = pgTable("product", {
	id: uuid("id").primaryKey().defaultRandom(),
	shopId: uuid("shop_id").notNull().references(() => shop.id, { onDelete: "cascade" }),
	categoryId: uuid("category_id").references(() => category.id),
	name: text("name").notNull(),
	slug: text("slug").notNull(),
	description: text("description"),
	price: decimal("price", {
		precision: 10,
		scale: 2
	}).notNull(),
	discountPrice: decimal("discount_price", {
		precision: 10,
		scale: 2
	}),
	stock: integer("stock").notNull().default(0),
	sku: text("sku"),
	tags: text("tags").array(),
	isActive: boolean("is_active").notNull().default(true),
	isFeatured: boolean("is_featured").notNull().default(false),
	viewCount: integer("view_count").notNull().default(0),
	avgRating: decimal("avg_rating", {
		precision: 3,
		scale: 2
	}).default("0"),
	reviewCount: integer("review_count").notNull().default(0),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
}, (t) => [
	index("product_shop_idx").on(t.shopId),
	index("product_category_idx").on(t.categoryId),
	index("product_slug_idx").on(t.slug)
]);
var productImage = pgTable("product_image", {
	id: uuid("id").primaryKey().defaultRandom(),
	productId: uuid("product_id").notNull().references(() => product.id, { onDelete: "cascade" }),
	url: text("url").notNull(),
	altText: text("alt_text"),
	isPrimary: boolean("is_primary").notNull().default(false),
	sortOrder: integer("sort_order").notNull().default(0),
	createdAt: timestamp("created_at").notNull().defaultNow()
});
var productVariant = pgTable("product_variant", {
	id: uuid("id").primaryKey().defaultRandom(),
	productId: uuid("product_id").notNull().references(() => product.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	options: jsonb("options").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow()
});
var address = pgTable("address", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull(),
	fullName: text("full_name").notNull(),
	phone: text("phone").notNull(),
	street: text("street").notNull(),
	city: text("city").notNull(),
	province: text("province").notNull(),
	postalCode: text("postal_code"),
	isDefault: boolean("is_default").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow()
});
var cart = pgTable("cart", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var cartItem = pgTable("cart_item", {
	id: uuid("id").primaryKey().defaultRandom(),
	cartId: uuid("cart_id").notNull().references(() => cart.id, { onDelete: "cascade" }),
	productId: uuid("product_id").notNull().references(() => product.id, { onDelete: "cascade" }),
	quantity: integer("quantity").notNull().default(1),
	variantSelections: jsonb("variant_selections"),
	createdAt: timestamp("created_at").notNull().defaultNow()
});
var wishlist = pgTable("wishlist", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull(),
	productId: uuid("product_id").notNull().references(() => product.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow()
});
var order = pgTable("order", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderNumber: text("order_number").notNull().unique(),
	userId: text("user_id").notNull(),
	shopId: uuid("shop_id").notNull().references(() => shop.id),
	addressId: uuid("address_id").references(() => address.id),
	status: orderStatusEnum("status").notNull().default("pending"),
	paymentMethod: paymentMethodEnum("payment_method").notNull(),
	paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
	subtotal: decimal("subtotal", {
		precision: 10,
		scale: 2
	}).notNull(),
	shippingFee: decimal("shipping_fee", {
		precision: 10,
		scale: 2
	}).notNull().default("0"),
	total: decimal("total", {
		precision: 10,
		scale: 2
	}).notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
}, (t) => [index("order_user_idx").on(t.userId), index("order_shop_idx").on(t.shopId)]);
var orderItem = pgTable("order_item", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id").notNull().references(() => order.id, { onDelete: "cascade" }),
	productId: uuid("product_id").notNull().references(() => product.id),
	productName: text("product_name").notNull(),
	productImageUrl: text("product_image_url"),
	price: decimal("price", {
		precision: 10,
		scale: 2
	}).notNull(),
	quantity: integer("quantity").notNull(),
	variantSelections: jsonb("variant_selections"),
	createdAt: timestamp("created_at").notNull().defaultNow()
});
var review = pgTable("review", {
	id: uuid("id").primaryKey().defaultRandom(),
	productId: uuid("product_id").notNull().references(() => product.id, { onDelete: "cascade" }),
	userId: text("user_id").notNull(),
	orderId: uuid("order_id").references(() => order.id),
	rating: integer("rating").notNull(),
	title: text("title"),
	body: text("body"),
	imageUrls: text("image_urls").array(),
	isVerified: boolean("is_verified").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
}, (t) => [index("review_product_idx").on(t.productId), index("review_user_idx").on(t.userId)]);
var shopReview = pgTable("shop_review", {
	id: uuid("id").primaryKey().defaultRandom(),
	shopId: uuid("shop_id").notNull().references(() => shop.id, { onDelete: "cascade" }),
	userId: text("user_id").notNull(),
	rating: integer("rating").notNull(),
	comment: text("comment"),
	createdAt: timestamp("created_at").notNull().defaultNow()
}, (t) => [index("shop_review_shop_idx").on(t.shopId), uniqueIndex("shop_review_shop_user_idx").on(t.shopId, t.userId)]);
var shopRelations = relations(shop, ({ many }) => ({
	products: many(product),
	orders: many(order)
}));
var productRelations = relations(product, ({ one, many }) => ({
	shop: one(shop, {
		fields: [product.shopId],
		references: [shop.id]
	}),
	category: one(category, {
		fields: [product.categoryId],
		references: [category.id]
	}),
	images: many(productImage),
	variants: many(productVariant),
	reviews: many(review),
	cartItems: many(cartItem),
	orderItems: many(orderItem),
	wishlists: many(wishlist)
}));
var orderRelations = relations(order, ({ one, many }) => ({
	shop: one(shop, {
		fields: [order.shopId],
		references: [shop.id]
	}),
	items: many(orderItem),
	reviews: many(review)
}));
var cartRelations = relations(cart, ({ many }) => ({ items: many(cartItem) }));
var cartItemRelations = relations(cartItem, ({ one }) => ({
	cart: one(cart, {
		fields: [cartItem.cartId],
		references: [cart.id]
	}),
	product: one(product, {
		fields: [cartItem.productId],
		references: [product.id]
	})
}));
var reviewRelations = relations(review, ({ one }) => ({
	product: one(product, {
		fields: [review.productId],
		references: [product.id]
	}),
	order: one(order, {
		fields: [review.orderId],
		references: [order.id]
	})
}));
//#endregion
//#region src/lib/server/db/index.ts
if (!private_env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
var client = postgres(private_env.DATABASE_URL);
var db = drizzle(client, { schema: schema_exports });
//#endregion
export { orderItem as a, productVariant as c, shopReview as d, order as i, review as l, address as n, product as o, category as r, productImage as s, db as t, shop as u };
