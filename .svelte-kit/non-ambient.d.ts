
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/account" | "/account/orders" | "/account/wishlist" | "/api" | "/api/owner" | "/api/owner/shops" | "/cart" | "/checkout" | "/demo" | "/demo/better-auth" | "/demo/better-auth/login" | "/forgot-password" | "/login" | "/owner" | "/owner/dashboard" | "/owner/orders" | "/owner/products" | "/owner/products/new" | "/owner/products/[id]" | "/owner/products/[id]/edit" | "/owner/shop" | "/products" | "/products/[id]" | "/register" | "/reset-password" | "/shops" | "/shop" | "/shop/[slug]";
		RouteParams(): {
			"/owner/products/[id]": { id: string };
			"/owner/products/[id]/edit": { id: string };
			"/products/[id]": { id: string };
			"/shop/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { id?: string | undefined; slug?: string | undefined };
			"/account": Record<string, never>;
			"/account/orders": Record<string, never>;
			"/account/wishlist": Record<string, never>;
			"/api": Record<string, never>;
			"/api/owner": Record<string, never>;
			"/api/owner/shops": Record<string, never>;
			"/cart": Record<string, never>;
			"/checkout": Record<string, never>;
			"/demo": Record<string, never>;
			"/demo/better-auth": Record<string, never>;
			"/demo/better-auth/login": Record<string, never>;
			"/forgot-password": Record<string, never>;
			"/login": Record<string, never>;
			"/owner": { id?: string | undefined };
			"/owner/dashboard": Record<string, never>;
			"/owner/orders": Record<string, never>;
			"/owner/products": { id?: string | undefined };
			"/owner/products/new": Record<string, never>;
			"/owner/products/[id]": { id: string };
			"/owner/products/[id]/edit": { id: string };
			"/owner/shop": Record<string, never>;
			"/products": { id?: string | undefined };
			"/products/[id]": { id: string };
			"/register": Record<string, never>;
			"/reset-password": Record<string, never>;
			"/shops": Record<string, never>;
			"/shop": { slug?: string | undefined };
			"/shop/[slug]": { slug: string }
		};
		Pathname(): "/" | "/account/orders" | "/account/wishlist" | "/api/owner/shops" | "/cart" | "/checkout" | "/demo" | "/demo/better-auth" | "/demo/better-auth/login" | "/forgot-password" | "/login" | "/owner/dashboard" | "/owner/orders" | "/owner/products" | "/owner/products/new" | `/owner/products/${string}/edit` & {} | "/owner/shop" | "/products" | `/products/${string}` & {} | "/register" | "/reset-password" | "/shops" | `/shop/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | string & {};
	}
}