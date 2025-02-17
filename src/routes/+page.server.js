import { fail, redirect } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/session';
import client from '$lib/server/db.js';

export async function load() {}

export const actions = {
	adminMode: async ({ locals }) => {
		const isAdmin = locals.user.admin;
		const googleId = locals.user.googleId;

		try {
			const mongoClient = await client.connect();
			const db = mongoClient.db('chucky');
			const orders = db.collection('users');
			const filter = { googleId };
			const updateDoc = {
				$set: {
					admin: !isAdmin
				}
			};
			await orders.updateOne(filter, updateDoc);

			locals.user.admin = true;
		} catch (error) {
			console.log(error);
		}
	},
	signOut: async (event) => {
		if (event.locals.session === null) {
			return fail(401);
		}
		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		return redirect(302, '/login');
	}
};
