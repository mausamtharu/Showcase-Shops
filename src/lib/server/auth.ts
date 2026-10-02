import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			const apiKey = env.RESEND_API_KEY;
			const from = env.EMAIL_FROM;
			if (!apiKey || !from) {
				if (env.NODE_ENV === 'development') {
					console.info(`Password reset link for ${user.email}: ${url}`);
					return;
				}
				throw new Error('Password reset email delivery is not configured.');
			}

			const response = await fetch('https://api.resend.com/emails', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					from,
					to: [user.email],
					subject: 'Reset your ShowCase Shops password',
					text: `Use this link to reset your password. It expires in one hour: ${url}`,
					html: `<p>Use the link below to reset your ShowCase Shops password. It expires in one hour.</p><p><a href="${url}">Reset password</a></p>`
				})
			});
			if (!response.ok) throw new Error('Password reset email could not be sent.');
		}
	},
	plugins: [
		sveltekitCookies(getRequestEvent) // must be last
	]
});
