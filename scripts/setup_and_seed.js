import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/showcase_shops';
const sql = postgres(DATABASE_URL);

async function init() {
	console.log('⚡ Initializing database schema in showcase_shops...');

	// 1. Create Enums and Tables
	await sql.unsafe(`
		DO $$ BEGIN
			CREATE TYPE "user_role" AS ENUM('customer', 'owner', 'admin');
		EXCEPTION WHEN duplicate_object THEN null;
		END $$;

		DO $$ BEGIN
			CREATE TYPE "order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');
		EXCEPTION WHEN duplicate_object THEN null;
		END $$;

		DO $$ BEGIN
			CREATE TYPE "payment_method" AS ENUM('esewa', 'khalti', 'stripe', 'cod');
		EXCEPTION WHEN duplicate_object THEN null;
		END $$;

		DO $$ BEGIN
			CREATE TYPE "payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');
		EXCEPTION WHEN duplicate_object THEN null;
		END $$;

		-- Better Auth Tables
		CREATE TABLE IF NOT EXISTS "user" (
			"id" text PRIMARY KEY,
			"name" text NOT NULL,
			"email" text NOT NULL UNIQUE,
			"email_verified" boolean DEFAULT false NOT NULL,
			"image" text,
			"created_at" timestamp DEFAULT now() NOT NULL,
			"updated_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "session" (
			"id" text PRIMARY KEY,
			"expires_at" timestamp NOT NULL,
			"token" text NOT NULL UNIQUE,
			"created_at" timestamp DEFAULT now() NOT NULL,
			"updated_at" timestamp DEFAULT now() NOT NULL,
			"ip_address" text,
			"user_agent" text,
			"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS "account" (
			"id" text PRIMARY KEY,
			"account_id" text NOT NULL,
			"provider_id" text NOT NULL,
			"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
			"access_token" text,
			"refresh_token" text,
			"id_token" text,
			"access_token_expires_at" timestamp,
			"refresh_token_expires_at" timestamp,
			"scope" text,
			"password" text,
			"created_at" timestamp DEFAULT now() NOT NULL,
			"updated_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "verification" (
			"id" text PRIMARY KEY,
			"identifier" text NOT NULL,
			"value" text NOT NULL,
			"expires_at" timestamp NOT NULL,
			"created_at" timestamp DEFAULT now() NOT NULL,
			"updated_at" timestamp DEFAULT now() NOT NULL
		);

		-- App Tables
		CREATE TABLE IF NOT EXISTS "user_profile" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			"user_id" text NOT NULL UNIQUE,
			"role" "user_role" DEFAULT 'customer' NOT NULL,
			"avatar_url" text,
			"phone" text,
			"bio" text,
			"created_at" timestamp DEFAULT now() NOT NULL,
			"updated_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "shop" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			"owner_id" text NOT NULL,
			"slug" text NOT NULL UNIQUE,
			"name" text NOT NULL,
			"tagline" text,
			"description" text,
			"logo_url" text,
			"banner_url" text,
			"category" text,
			"phone" text,
			"location" text,
			"address" text,
			"google_map_url" text,
			"is_active" boolean DEFAULT true NOT NULL,
			"total_sales" numeric(10, 2) DEFAULT '0',
			"created_at" timestamp DEFAULT now() NOT NULL,
			"updated_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "category" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			"name" text NOT NULL UNIQUE,
			"slug" text NOT NULL UNIQUE,
			"icon_url" text,
			"description" text,
			"created_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "product" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			"shop_id" uuid NOT NULL REFERENCES "shop"("id") ON DELETE CASCADE,
			"category_id" uuid REFERENCES "category"("id"),
			"name" text NOT NULL,
			"slug" text NOT NULL,
			"description" text,
			"price" numeric(10, 2) NOT NULL,
			"discount_price" numeric(10, 2),
			"stock" integer DEFAULT 0 NOT NULL,
			"sku" text,
			"tags" text[],
			"is_active" boolean DEFAULT true NOT NULL,
			"is_featured" boolean DEFAULT false NOT NULL,
			"view_count" integer DEFAULT 0 NOT NULL,
			"avg_rating" numeric(3, 2) DEFAULT '0',
			"review_count" integer DEFAULT 0 NOT NULL,
			"created_at" timestamp DEFAULT now() NOT NULL,
			"updated_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "product_image" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			"product_id" uuid NOT NULL REFERENCES "product"("id") ON DELETE CASCADE,
			"url" text NOT NULL,
			"alt_text" text,
			"is_primary" boolean DEFAULT false NOT NULL,
			"sort_order" integer DEFAULT 0 NOT NULL,
			"created_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "product_variant" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			"product_id" uuid NOT NULL REFERENCES "product"("id") ON DELETE CASCADE,
			"name" text NOT NULL,
			"options" jsonb NOT NULL,
			"created_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "address" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			"user_id" text NOT NULL,
			"full_name" text NOT NULL,
			"phone" text NOT NULL,
			"street" text NOT NULL,
			"city" text NOT NULL,
			"province" text NOT NULL,
			"postal_code" text,
			"is_default" boolean DEFAULT false NOT NULL,
			"created_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "cart" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			"user_id" text NOT NULL UNIQUE,
			"created_at" timestamp DEFAULT now() NOT NULL,
			"updated_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "cart_item" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			"cart_id" uuid NOT NULL REFERENCES "cart"("id") ON DELETE CASCADE,
			"product_id" uuid NOT NULL REFERENCES "product"("id") ON DELETE CASCADE,
			"quantity" integer DEFAULT 1 NOT NULL,
			"variant_selections" jsonb,
			"created_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "wishlist" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			"user_id" text NOT NULL,
			"product_id" uuid NOT NULL REFERENCES "product"("id") ON DELETE CASCADE,
			"created_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "order" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			"order_number" text NOT NULL UNIQUE,
			"user_id" text NOT NULL,
			"shop_id" uuid NOT NULL REFERENCES "shop"("id"),
			"address_id" uuid REFERENCES "address"("id"),
			"status" "order_status" DEFAULT 'pending' NOT NULL,
			"payment_method" "payment_method" NOT NULL,
			"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
			"subtotal" numeric(10, 2) NOT NULL,
			"shipping_fee" numeric(10, 2) DEFAULT '0' NOT NULL,
			"total" numeric(10, 2) NOT NULL,
			"notes" text,
			"created_at" timestamp DEFAULT now() NOT NULL,
			"updated_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "order_item" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			"order_id" uuid NOT NULL REFERENCES "order"("id") ON DELETE CASCADE,
			"product_id" uuid NOT NULL REFERENCES "product"("id"),
			"product_name" text NOT NULL,
			"product_image_url" text,
			"price" numeric(10, 2) NOT NULL,
			"quantity" integer NOT NULL,
			"variant_selections" jsonb,
			"created_at" timestamp DEFAULT now() NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "review" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			"product_id" uuid NOT NULL REFERENCES "product"("id") ON DELETE CASCADE,
			"user_id" text NOT NULL,
			"order_id" uuid REFERENCES "order"("id"),
			"rating" integer NOT NULL,
			"title" text,
			"body" text,
			"image_urls" text[],
			"is_verified" boolean DEFAULT false NOT NULL,
			"created_at" timestamp DEFAULT now() NOT NULL,
			"updated_at" timestamp DEFAULT now() NOT NULL
		);
	`);

	console.log('✓ All database tables successfully verified.');

	// 2. Clear existing demo data
	await sql.unsafe(`
		TRUNCATE TABLE "review", "order_item", "order", "wishlist", "cart_item", "cart",
		"product_variant", "product_image", "product", "category", "shop", "address" CASCADE;
	`);

	console.log('⚡ Seeding initial demo shops, categories, and luxury catalog...');

	// Demo Owner User
	const ownerUserId = 'usr_owner_demo_01';
	await sql`
		INSERT INTO "user" ("id", "name", "email", "email_verified")
		VALUES (${ownerUserId}, 'Mausam Tharu', 'owner@showcase.com', true)
		ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name";
	`;

	// Categories
	const catRows = await sql`
		INSERT INTO "category" ("name", "slug", "description")
		VALUES 
			('Traditional Silks & Attire', 'traditional-silks', 'Hand-woven Banarasi, Raw Silk, and Authentic Nepali Dhaka craft'),
			('Fine Jewelry & Gems', 'fine-jewelry', 'Certified 24K Gold, Kundan, Natural Diamond, and Rare Gemstones'),
			('Himalayan Wellness', 'himalayan-wellness', 'Wild-harvested Shilajit, Organic Saffron, and Ayurvedic Elixirs'),
			('Luxury Timepieces & Tech', 'luxury-timepieces', 'Master-crafted horology, Swiss movements, and premium acoustic sound'),
			('Artisan Leather & Goods', 'leather-goods', 'Full-grain Himalayan buffalo leather bags, briefcases, and travel kits')
		RETURNING "id", "slug";
	`;

	const catMap = Object.fromEntries(catRows.map(c => [c.slug, c.id]));

	// Shops
	const shopRows = await sql`
		INSERT INTO "shop" (
			"owner_id", "slug", "name", "tagline", "description", 
			"logo_url", "banner_url", "category", "phone", "location", "address", "is_active", "total_sales"
		)
		VALUES 
			(
				${ownerUserId},
				'royal-silks-nepalgunj',
				'Royal Silks Nepalgunj',
				'Finest Himalayan Dhaka & Pure Silk Heritage',
				'Established in 1984 at Tribhuvan Chowk, Royal Silks provides authentic royal handloom textiles, wedding sherwanis, and bespoke silk sarees for connoisseurs across Western Nepal.',
				'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
				'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&auto=format&fit=crop&q=80',
				'Traditional Silks & Attire',
				'+977 81 520112',
				'Nepalgunj, Banke',
				'Tribhuvan Chowk, Ward No. 2, Nepalgunj',
				true,
				'1850000.00'
			),
			(
				'usr_owner_demo_02',
				'kathmandu-gold-gems',
				'Kathmandu Gold & Gems',
				'Heritage Hallmarked Gold & Rare Jewels',
				'Precious 24K and 22K certified hallmarked jewelry, handcrafted bridal sets, and rare Himalayan emeralds with ancestral craftsmanship.',
				'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80',
				'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&auto=format&fit=crop&q=80',
				'Fine Jewelry & Gems',
				'+977 81 524890',
				'Dhamboji, Nepalgunj',
				'Main Highway Road, Dhamboji Chowk, Nepalgunj',
				true,
				'4230000.00'
			),
			(
				'usr_owner_demo_03',
				'himalayan-herbal-essence',
				'Himalayan Herbal Essence',
				'Pure High-Altitude Wellness & Elixirs',
				'Ethically harvested wild medicinal herbs from the high passes of Dolpo and Karnali. Offering pure Grade-A Shilajit, saffron threads, and organic herbal oils.',
				'https://images.unsplash.com/photo-1608248597359-59751e18dc94?w=400&auto=format&fit=crop&q=80',
				'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&auto=format&fit=crop&q=80',
				'Himalayan Wellness',
				'+977 81 532104',
				'Surkhet Road, Nepalgunj',
				'Near Karkhado Bypass, Surkhet Road, Nepalgunj',
				true,
				'980000.00'
			)
		RETURNING "id", "slug";
	`;

	const shopMap = Object.fromEntries(shopRows.map(s => [s.slug, s.id]));

	// Products
	const productsToInsert = [
		// Royal Silks
		{
			shopId: shopMap['royal-silks-nepalgunj'],
			categoryId: catMap['traditional-silks'],
			name: 'Heritage Imperial Dhaka Kurta Set',
			slug: 'heritage-imperial-dhaka-kurta-set',
			description: 'Hand-loomed with gold-wrapped Zari thread on 100% pure Mulberry silk. Worn for formal galas and royal celebrations.',
			price: 34500,
			discountPrice: 28900,
			stock: 14,
			sku: 'RS-DKS-001',
			tags: ['dhaka', 'silk', 'handloom', 'luxury', 'traditional'],
			isFeatured: true,
			viewCount: 1420,
			avgRating: 4.95,
			reviewCount: 38,
			images: [
				{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80', isPrimary: true },
				{ url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1000&auto=format&fit=crop&q=80', isPrimary: false }
			],
			variants: [
				{ name: 'Size', options: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)'] },
				{ name: 'Embroidery Color', options: ['Antique Gold', 'Burnished Bronze'] }
			]
		},
		{
			shopId: shopMap['royal-silks-nepalgunj'],
			categoryId: catMap['traditional-silks'],
			name: 'Bespoke Crimson Raw Silk Saree with Zari',
			slug: 'bespoke-crimson-raw-silk-saree',
			description: 'Artisanal crimson silk saree featuring intricate floral meenakari borders crafted by Master Weavers over 90 days.',
			price: 52000,
			discountPrice: 46500,
			stock: 8,
			sku: 'RS-SAR-002',
			tags: ['saree', 'bridal', 'crimson', 'zari', 'exclusive'],
			isFeatured: true,
			viewCount: 2890,
			avgRating: 5.0,
			reviewCount: 52,
			images: [
				{ url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1000&auto=format&fit=crop&q=80', isPrimary: true },
				{ url: 'https://images.unsplash.com/photo-1610030469888-29931b67f139?w=1000&auto=format&fit=crop&q=80', isPrimary: false }
			],
			variants: [
				{ name: 'Blouse Fabric', options: ['Unstitched Silk', 'Custom Stitched'] }
			]
		},
		{
			shopId: shopMap['royal-silks-nepalgunj'],
			categoryId: catMap['leather-goods'],
			name: 'Himalayan Buffalo Leather Executive Briefcase',
			slug: 'himalayan-buffalo-leather-briefcase',
			description: 'Hand-stitched full-grain artisan leather briefcase lined with pure raw cotton. Solid brass buckles and padded laptop divider.',
			price: 24000,
			discountPrice: 19500,
			stock: 19,
			sku: 'RS-LEA-003',
			tags: ['leather', 'briefcase', 'executive', 'handcrafted'],
			isFeatured: false,
			viewCount: 840,
			avgRating: 4.88,
			reviewCount: 16,
			images: [
				{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&auto=format&fit=crop&q=80', isPrimary: true },
				{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&auto=format&fit=crop&q=80', isPrimary: false }
			],
			variants: [
				{ name: 'Color', options: ['Vintage Cognac', 'Midnight Obsidian', 'Espresso Brown'] }
			]
		},

		// Kathmandu Gold & Gems
		{
			shopId: shopMap['kathmandu-gold-gems'],
			categoryId: catMap['fine-jewelry'],
			name: '24K Temple Floral Kundan Choker Necklace',
			slug: '24k-temple-floral-kundan-necklace',
			description: 'Certified 24 Karat gold choker embedded with unheated natural rubies and untreated emerald drops. Complete with certificate of authenticity.',
			price: 285000,
			discountPrice: 268000,
			stock: 3,
			sku: 'KGG-JWL-101',
			tags: ['gold', 'kundan', 'necklace', 'bridal', '24k'],
			isFeatured: true,
			viewCount: 4120,
			avgRating: 4.98,
			reviewCount: 29,
			images: [
				{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop&q=80', isPrimary: true },
				{ url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000&auto=format&fit=crop&q=80', isPrimary: false }
			],
			variants: [
				{ name: 'Gold Hallmarking', options: ['24K Yellow Gold', '22K Rose Gold Accent'] }
			]
		},
		{
			shopId: shopMap['kathmandu-gold-gems'],
			categoryId: catMap['fine-jewelry'],
			name: 'Solitaire Cushion-Cut Diamond Solstice Ring',
			slug: 'solitaire-cushion-cut-diamond-ring',
			description: '1.8 Carat VVS1 Clarity, E-Color cushion diamond set on platinum four-prong gallery with hidden micro-pavé halo.',
			price: 360000,
			discountPrice: null,
			stock: 5,
			sku: 'KGG-RNG-102',
			tags: ['diamond', 'solitaire', 'platinum', 'ring', 'bespoke'],
			isFeatured: true,
			viewCount: 3750,
			avgRating: 4.96,
			reviewCount: 24,
			images: [
				{ url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000&auto=format&fit=crop&q=80', isPrimary: true }
			],
			variants: [
				{ name: 'Ring Size', options: ['12', '14', '16', '18', '20'] },
				{ name: 'Metal', options: ['950 Platinum', '18K White Gold'] }
			]
		},

		// Himalayan Herbal Essence
		{
			shopId: shopMap['himalayan-herbal-essence'],
			categoryId: catMap['himalayan-wellness'],
			name: 'Wild-Harvested High Altitude Black Gold Shilajit (50g)',
			slug: 'wild-harvested-shilajit-resin',
			description: 'Harvested at 18,000 ft in Karnali Himalayas. Purified via traditional Triphala decoction with over 84+ bioactive minerals and 70% fulvic acid.',
			price: 7800,
			discountPrice: 6200,
			stock: 65,
			sku: 'HHE-SHI-201',
			tags: ['shilajit', 'ayurveda', 'organic', 'wellness', 'vitality'],
			isFeatured: true,
			viewCount: 5200,
			avgRating: 4.92,
			reviewCount: 118,
			images: [
				{ url: 'https://images.unsplash.com/photo-1608248597359-59751e18dc94?w=1000&auto=format&fit=crop&q=80', isPrimary: true }
			],
			variants: [
				{ name: 'Pack Size', options: ['50g Glass Jar', '100g Collector Brass Tin'] }
			]
		},
		{
			shopId: shopMap['himalayan-herbal-essence'],
			categoryId: catMap['himalayan-wellness'],
			name: 'Kashmiri Mogra Saffron Threads (5g Certified Grade A1)',
			slug: 'kashmiri-mogra-saffron-threads',
			description: 'Deep crimson stigma strands with intense floral aroma, natural coloring power, and therapeutic antioxidants.',
			price: 5500,
			discountPrice: 4800,
			stock: 40,
			sku: 'HHE-SAF-202',
			tags: ['saffron', 'culinary', 'wellness', 'pure'],
			isFeatured: false,
			viewCount: 1650,
			avgRating: 4.9,
			reviewCount: 33,
			images: [
				{ url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1000&auto=format&fit=crop&q=80', isPrimary: true }
			]
		}
	];

	for (const p of productsToInsert) {
		const [insertedProduct] = await sql`
			INSERT INTO "product" (
				"shop_id", "category_id", "name", "slug", "description",
				"price", "discount_price", "stock", "sku", "tags",
				"is_active", "is_featured", "view_count", "avg_rating", "review_count"
			)
			VALUES (
				${p.shopId}, ${p.categoryId}, ${p.name}, ${p.slug}, ${p.description},
				${p.price}, ${p.discountPrice}, ${p.stock}, ${p.sku}, ${p.tags},
				true, ${p.isFeatured}, ${p.viewCount}, ${p.avgRating}, ${p.reviewCount}
			)
			RETURNING "id";
		`;

		// Images
		if (p.images) {
			for (let i = 0; i < p.images.length; i++) {
				const img = p.images[i];
				await sql`
					INSERT INTO "product_image" ("product_id", "url", "is_primary", "sort_order")
					VALUES (${insertedProduct.id}, ${img.url}, ${img.isPrimary}, ${i});
				`;
			}
		}

		// Variants
		if (p.variants) {
			for (const v of p.variants) {
				await sql`
					INSERT INTO "product_variant" ("product_id", "name", "options")
					VALUES (${insertedProduct.id}, ${v.name}, ${JSON.stringify(v.options)});
				`;
			}
		}

		// Reviews
		await sql`
			INSERT INTO "review" ("product_id", "user_id", "rating", "title", "body", "is_verified")
			VALUES 
				(${insertedProduct.id}, 'usr_reviewer_01', 5, 'Unmatched Luxury & Quality', 'Arrived beautifully packaged in a silk gift box. The craftsmanship is world-class.', true),
				(${insertedProduct.id}, 'usr_reviewer_02', 5, 'Proud to support local heritage', 'Directly from Nepalgunj artisans. Authentic and exactly as described.', true);
		`;
	}

	console.log(`✓ Inserted ${productsToInsert.length} luxury products with images, variants, and verified reviews.`);
	console.log('🎉 Setup and seed complete! Ready to showcase.');
	await sql.end();
	process.exit(0);
}

init().catch(err => {
	console.error('Fatal Seed Error:', err);
	process.exit(1);
});
