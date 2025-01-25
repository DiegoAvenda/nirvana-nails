import client from '$lib/server/db.js';
import { ObjectId } from 'mongodb';

export const load = async ({ locals }) => {
	let admin = locals.user?.admin;
	const calendar = locals.calendar;

	if (admin) {
		admin = {
			calendar
		};
	}

	console.log('calendar: ', calendar);
	const startDate = new Date();

	// Función centralizada para generar días
	const generateDays = (length, direction = 'forward') => {
		return Array.from({ length }, (_, i) => {
			const date = new Date(startDate);
			const modifier = direction === 'forward' ? 1 : -1;
			date.setDate(startDate.getDate() + modifier * (direction === 'backward' ? i + 1 : i));
			return date.toISOString().split('T')[0];
		});
	};

	let daysInWeek;
	if (admin) {
		switch (calendar) {
			case 'present':
				daysInWeek = generateDays(2);
				break;
			case 'future':
				daysInWeek = generateDays(6);
				break;
			case 'past':
				daysInWeek = generateDays(6, 'backward').reverse();
				break;
			default:
				daysInWeek = generateDays(2);
		}
	} else {
		daysInWeek = generateDays(6);
	}

	const mongoClient = await client.connect();
	const db = mongoClient.db('nirvana');

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
	adminView: async ({ request, locals }) => {
		const data = await request.formData();
		const days = data.get('days');

		locals.calendar = ['future', 'past', 'present'].includes(days) ? days : 'present';
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
