// @ts-nocheck
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getOwnerShopContext } from '$lib/server/owner-shops';

export const load = async ({ locals, url }: Parameters<LayoutServerLoad>[0]) => {
	if (!locals.user) throw redirect(303, '/login?mode=owner');

	const { shops, selectedShop } = await getOwnerShopContext(
		locals.user.id,
		url.searchParams.get('shop')
	);

	if (shops.length === 0) throw redirect(303, '/login?mode=owner&error=no-shop');
	if (url.searchParams.get('shop') !== selectedShop?.id) {
		const nextUrl = new URL(url);
		nextUrl.searchParams.set('shop', selectedShop!.id);
		throw redirect(303, `${nextUrl.pathname}${nextUrl.search}`);
	}

	return { user: locals.user, shops, selectedShop };
};
