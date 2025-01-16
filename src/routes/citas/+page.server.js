import client from '$lib/server/db.js';
import { ObjectId } from 'mongodb';

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
		.find({
			date: { $in: daysInWeek }
		})
		.toArray();

	const week = daysInWeek.reduce((acc, day) => {
		acc[day] = {};
		const dayAppointments = appointments.filter((a) => a.date === day);

		dayAppointments.forEach((appointment) => {
			// Si no es admin, solo indicamos que el slot está ocupado
			acc[day][appointment.hour] = admin
				? { name: appointment.name, phone: appointment.phone, id: appointment._id.toString() }
				: true;
		});

		return acc;
	}, {});

	return {
		admin,
		week,
		daysInWeek
	};
};

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const date = data.get('date');
		const hour = parseInt(data.get('hour'));
		const name = data.get('name');
		const phone = data.get('phone');

		try {
			const mongoClient = await client.connect();
			const db = mongoClient.db('nirvana');
			const appointments = db.collection('appointments');

			const result = await appointments.insertOne({
				date,
				hour,
				name,
				phone,
				createdAt: new Date()
			});

			console.log(`Nueva cita creada con id: ${result.insertedId}`);
		} catch (error) {
			console.error('Error al crear la cita:', error);
			throw error;
		}
	},
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
		const phone = data.get('phone');
		const objectId = new ObjectId(id);

		try {
			const mongoClient = await client.connect();
			const db = mongoClient.db('nirvana');
			const appointments = db.collection('appointments');
			const query = { _id: objectId };
			const updateDoc = {
				$set: {
					name,
					phone
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
