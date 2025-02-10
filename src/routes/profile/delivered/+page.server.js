import { redirect } from '@sveltejs/kit';
import client from '$lib/server/db.js';

export const load = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	const username = locals.user.name;
	const customerId = locals.user.googleId;

	try {
		const mongoClient = await client.connect();
		const db = mongoClient.db('nirvana');
		const ordersCollection = db.collection('appointments');
		const query = { customerId, status: { $ne: 'reserved' } };

		const options = {
			sort: { createdAt: -1 },
			projection: { _id: 0 }
		};

		const rawAppointments = await ordersCollection.find(query, options).toArray();

		const appointments = rawAppointments.map((order) => ({
			...order,
			date: order.date.toLocaleTimeString('en-US', {
				year: '2-digit',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
				timeZone: 'America/Mexico_City'
			})
		}));
		console.log(appointments);
		return {
			appointments,
			username
		};
	} catch (e) {
		console.log(e);
	}
};
