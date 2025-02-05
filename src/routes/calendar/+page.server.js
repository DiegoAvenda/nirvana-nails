import client from '$lib/server/db.js';
import { ObjectId } from 'mongodb';

export async function load({ locals }) {
	let admin = locals.user?.admin;
	const now = new Date();
	const startDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
	startDate.setHours(now.getHours() + 1, 0, 0, 0);

	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 7);

	try {
		const mongoClient = await client.connect();
		const db = mongoClient.db('nirvana');
		const rawAppointments = await db
			.collection('appointments')
			.find({
				date: {
					$gte: startDate,
					$lte: endDate
				}
			})
			.toArray();

		const appointments = rawAppointments.map((a) =>
			admin
				? {
						id: a._id.toString(),
						date: a.date,
						name: a.name
					}
				: {
						date: a.date
					}
		);

		return {
			appointments,
			admin
		};
	} catch (error) {
		console.error(error);
		return { appointments: [] };
	}
}

export const actions = {
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const objectId = new ObjectId(id);

		try {
			const mongoClient = await client.connect();
			const db = mongoClient.db('nirvana');
			const appointments = db.collection('appointments');
			const query = { _id: objectId };

			const result = await appointments.deleteOne(query);
			if (result.deletedCount === 1) {
				console.log('Successfully deleted one document.');
			} else {
				console.log('No documents matched the query. Deleted 0 documents.');
			}
		} catch (error) {
			console.error('Error al crear la cita:', error);
			throw error;
		}
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const name = data.get('name');
		//const phone = data.get('phone');
		const objectId = new ObjectId(id);

		try {
			const mongoClient = await client.connect();
			const db = mongoClient.db('nirvana');
			const appointments = db.collection('appointments');
			const query = { _id: objectId };
			const updateDoc = {
				$set: {
					name
					//phone
				}
			};
			const result = await appointments.updateOne(query, updateDoc);
			console.log(
				`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
			);
		} catch (error) {
			console.error('Error al crear la cita:', error);
			throw error;
		}
	}
};
