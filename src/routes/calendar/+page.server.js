import client from '$lib/server/db.js';

export const load = async ({ locals }) => {
	const admin = locals.user?.admin;

	const mongoClient = await client.connect();
	const db = mongoClient.db('nirvana');

	const startDate = new Date();
	const daysInWeek = Array.from({ length: 6 }, (_, i) => {
		const date = new Date(startDate);
		date.setDate(startDate.getDate() + i);
		return date.toISOString().split('T')[0];
	});

	const appointments = await db
		.collection('appointments')
		.find({ day: { $in: daysInWeek } })
		.toArray();

	const week = daysInWeek.reduce((acc, day) => {
		acc[day] = {};
		const appointment = appointments.find((a) => a.day === day);
		if (appointment) {
			appointment.slots.forEach((slot) => {
				acc[day][slot?.hour] = slot?.client;
			});
		}
		return acc;
	}, {});

	client.close();

	return {
		admin,
		week,
		daysInWeek
	};
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const day = data.get('day');
		const hour = parseInt(data.get('hour'));
		const name = data.get('name');
		const phone = data.get('phone');

		try {
			const mongoClient = await client.connect();
			const db = mongoClient.db('nirvana');
			const orders = db.collection('appointments');
			const filter = { day };
			const newSlot = { hour, client: { name, phone } };
			const updateDoc = {
				$push: {
					slots: newSlot
				}
			};
			const options = { upsert: true };

			const result = await orders.updateOne(filter, updateDoc, options);
			console.log(
				`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
			);
		} catch (error) {
			console.log(error);
		}
	}
};
