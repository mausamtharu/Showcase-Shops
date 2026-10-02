import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { shop } from '$lib/server/db/schema';
import { slugify } from '$lib/utils';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Sign in before creating a shop.' }, { status: 401 });

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request.' }, { status: 400 });
	}

	const name =
		typeof body === 'object' && body !== null && 'name' in body && typeof body.name === 'string'
			? body.name.trim().slice(0, 100)
			: '';
	if (!name) return json({ error: 'Enter a shop name.' }, { status: 400 });

	const baseSlug = slugify(name) || 'shop';
	const [createdShop] = await db
		.insert(shop)
		.values({
			ownerId: locals.user.id,
			name,
			slug: `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`,
			isActive: true
		})
		.returning({ id: shop.id });

	return json({ shopId: createdShop.id }, { status: 201 });
};
