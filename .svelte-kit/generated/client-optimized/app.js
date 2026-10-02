// in dev, this makes Vite inject its client as this module's first dependency,
// so that global constant replacements are installed before any other module
// (including user hooks) evaluates. In build it's inert.
import.meta.hot;




export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24')
];

export const server_loads = [0,2];

export const dictionary = {
		"/": [~3],
		"/account/orders": [~4],
		"/account/wishlist": [~5],
		"/cart": [6],
		"/checkout": [~7],
		"/demo": [8],
		"/demo/better-auth": [~9],
		"/demo/better-auth/login": [~10],
		"/forgot-password": [11],
		"/login": [12],
		"/owner/dashboard": [~13,[2]],
		"/owner/orders": [~14,[2]],
		"/owner/products": [~15,[2]],
		"/owner/products/new": [~17,[2]],
		"/owner/products/[id]/edit": [~16,[2]],
		"/owner/shop": [~18,[2]],
		"/products": [~19],
		"/products/[id]": [~20],
		"/register": [21],
		"/reset-password": [22],
		"/shops": [~24],
		"/shop/[slug]": [~23]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';

export const get_error_template = () => import('../shared/error-template.js').then(m => m.default);