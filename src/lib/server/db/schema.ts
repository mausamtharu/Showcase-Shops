import {
	pgTable,
	text,
	timestamp,
	boolean,
	integer,
	decimal,
	pgEnum,
	uuid,
	jsonb,
	index,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export * from './auth.schema';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum('user_role', ['customer', 'owner', 'admin']);
export const orderStatusEnum = pgEnum('order_status', [
	'pending',
	'processing',
	'shipped',
	'delivered',
	'cancelled'
]);
export const paymentMethodEnum = pgEnum('payment_method', ['esewa', 'khalti', 'stripe', 'cod']);
export const paymentStatusEnum = pgEnum('payment_status', [
	'pending',
	'paid',
	'failed',
	'refunded'
]);

// ── User Profile (extends better-auth user) ────────────────────────────────────
export const userProfile = pgTable('user_profile', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id').notNull().unique(),
	role: userRoleEnum('role').notNull().default('customer'),
	avatarUrl: text('avatar_url'),
	phone: text('phone'),
	bio: text('bio'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// ── Shop ───────────────────────────────────────────────────────────────────────
export const shop = pgTable(
	'shop',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		ownerId: text('owner_id').notNull(),
		slug: text('slug').notNull().unique(),
		name: text('name').notNull(),
		tagline: text('tagline'),
		description: text('description'),
		logoUrl: text('logo_url'),
		bannerUrl: text('banner_url'),
		category: text('category'),
		phone: text('phone'),
		location: text('location'),
		address: text('address'),
		googleMapUrl: text('google_map_url'),
		isActive: boolean('is_active').notNull().default(true),
		totalSales: decimal('total_sales', { precision: 10, scale: 2 }).default('0'),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow()
	},
	(t) => [index('shop_slug_idx').on(t.slug), index('shop_owner_idx').on(t.ownerId)]
);

// ── Category ───────────────────────────────────────────────────────────────────
export const category = pgTable('category', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique(),
	iconUrl: text('icon_url'),
	description: text('description'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// ── Product ────────────────────────────────────────────────────────────────────
export const product = pgTable(
	'product',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		shopId: uuid('shop_id')
			.notNull()
			.references(() => shop.id, { onDelete: 'cascade' }),
		categoryId: uuid('category_id').references(() => category.id),
		name: text('name').notNull(),
		slug: text('slug').notNull(),
		description: text('description'),
		price: decimal('price', { precision: 10, scale: 2 }).notNull(),
		discountPrice: decimal('discount_price', { precision: 10, scale: 2 }),
		stock: integer('stock').notNull().default(0),
		sku: text('sku'),
		tags: text('tags').array(),
		isActive: boolean('is_active').notNull().default(true),
		isFeatured: boolean('is_featured').notNull().default(false),
		viewCount: integer('view_count').notNull().default(0),
		avgRating: decimal('avg_rating', { precision: 3, scale: 2 }).default('0'),
		reviewCount: integer('review_count').notNull().default(0),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow()
	},
	(t) => [
		index('product_shop_idx').on(t.shopId),
		index('product_category_idx').on(t.categoryId),
		index('product_slug_idx').on(t.slug)
	]
);

// ── Product Image ──────────────────────────────────────────────────────────────
export const productImage = pgTable('product_image', {
	id: uuid('id').primaryKey().defaultRandom(),
	productId: uuid('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' }),
	url: text('url').notNull(),
	altText: text('alt_text'),
	isPrimary: boolean('is_primary').notNull().default(false),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// ── Product Variant ────────────────────────────────────────────────────────────
export const productVariant = pgTable('product_variant', {
	id: uuid('id').primaryKey().defaultRandom(),
	productId: uuid('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' }),
	name: text('name').notNull(), // e.g. "Size", "Color"
	options: jsonb('options').notNull(), // e.g. ["S","M","L"] or ["Red","Blue"]
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// ── Address ────────────────────────────────────────────────────────────────────
export const address = pgTable('address', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id').notNull(),
	fullName: text('full_name').notNull(),
	phone: text('phone').notNull(),
	street: text('street').notNull(),
	city: text('city').notNull(),
	province: text('province').notNull(),
	postalCode: text('postal_code'),
	isDefault: boolean('is_default').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// ── Cart ───────────────────────────────────────────────────────────────────────
export const cart = pgTable('cart', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id').notNull().unique(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const cartItem = pgTable('cart_item', {
	id: uuid('id').primaryKey().defaultRandom(),
	cartId: uuid('cart_id')
		.notNull()
		.references(() => cart.id, { onDelete: 'cascade' }),
	productId: uuid('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' }),
	quantity: integer('quantity').notNull().default(1),
	variantSelections: jsonb('variant_selections'), // { "Size": "M", "Color": "Red" }
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// ── Wishlist ───────────────────────────────────────────────────────────────────
export const wishlist = pgTable('wishlist', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id').notNull(),
	productId: uuid('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// ── Order ──────────────────────────────────────────────────────────────────────
export const order = pgTable(
	'order',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		orderNumber: text('order_number').notNull().unique(),
		userId: text('user_id').notNull(),
		shopId: uuid('shop_id')
			.notNull()
			.references(() => shop.id),
		addressId: uuid('address_id').references(() => address.id),
		status: orderStatusEnum('status').notNull().default('pending'),
		paymentMethod: paymentMethodEnum('payment_method').notNull(),
		paymentStatus: paymentStatusEnum('payment_status').notNull().default('pending'),
		subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
		shippingFee: decimal('shipping_fee', { precision: 10, scale: 2 }).notNull().default('0'),
		total: decimal('total', { precision: 10, scale: 2 }).notNull(),
		notes: text('notes'),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow()
	},
	(t) => [index('order_user_idx').on(t.userId), index('order_shop_idx').on(t.shopId)]
);

export const orderItem = pgTable('order_item', {
	id: uuid('id').primaryKey().defaultRandom(),
	orderId: uuid('order_id')
		.notNull()
		.references(() => order.id, { onDelete: 'cascade' }),
	productId: uuid('product_id')
		.notNull()
		.references(() => product.id),
	productName: text('product_name').notNull(),
	productImageUrl: text('product_image_url'),
	price: decimal('price', { precision: 10, scale: 2 }).notNull(),
	quantity: integer('quantity').notNull(),
	variantSelections: jsonb('variant_selections'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// ── Review ─────────────────────────────────────────────────────────────────────
export const review = pgTable(
	'review',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		productId: uuid('product_id')
			.notNull()
			.references(() => product.id, { onDelete: 'cascade' }),
		userId: text('user_id').notNull(),
		orderId: uuid('order_id').references(() => order.id),
		rating: integer('rating').notNull(), // 1-5
		title: text('title'),
		body: text('body'),
		imageUrls: text('image_urls').array(),
		isVerified: boolean('is_verified').notNull().default(false),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow()
	},
	(t) => [index('review_product_idx').on(t.productId), index('review_user_idx').on(t.userId)]
);

export const shopReview = pgTable(
	'shop_review',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		shopId: uuid('shop_id')
			.notNull()
			.references(() => shop.id, { onDelete: 'cascade' }),
		userId: text('user_id').notNull(),
		rating: integer('rating').notNull(),
		comment: text('comment'),
		createdAt: timestamp('created_at').notNull().defaultNow()
	},
	(t) => [
		index('shop_review_shop_idx').on(t.shopId),
		uniqueIndex('shop_review_shop_user_idx').on(t.shopId, t.userId)
	]
);

// ── Relations ──────────────────────────────────────────────────────────────────
export const shopRelations = relations(shop, ({ many }) => ({
	products: many(product),
	orders: many(order)
}));

export const productRelations = relations(product, ({ one, many }) => ({
	shop: one(shop, { fields: [product.shopId], references: [shop.id] }),
	category: one(category, { fields: [product.categoryId], references: [category.id] }),
	images: many(productImage),
	variants: many(productVariant),
	reviews: many(review),
	cartItems: many(cartItem),
	orderItems: many(orderItem),
	wishlists: many(wishlist)
}));

export const orderRelations = relations(order, ({ one, many }) => ({
	shop: one(shop, { fields: [order.shopId], references: [shop.id] }),
	items: many(orderItem),
	reviews: many(review)
}));

export const cartRelations = relations(cart, ({ many }) => ({
	items: many(cartItem)
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
	cart: one(cart, { fields: [cartItem.cartId], references: [cart.id] }),
	product: one(product, { fields: [cartItem.productId], references: [product.id] })
}));

export const reviewRelations = relations(review, ({ one }) => ({
	product: one(product, { fields: [review.productId], references: [product.id] }),
	order: one(order, { fields: [review.orderId], references: [order.id] })
}));
