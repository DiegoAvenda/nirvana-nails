import client from '$lib/server/db.js';

export async function load() {
	const now = new Date(); // Hora actual en UTC
	const startDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' })); // Convertir a hora local
	startDate.setHours(now.getHours() + 1, 0, 0, 0); // Dentro de una hora, al inicio de esa hora

	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 7);

	try {
		const mongoClient = await client.connect();
		const db = mongoClient.db('nirvana');
		const appointments = await db
			.collection('appointments')
			.find({
				date: {
					$gte: startDate,
					$lte: endDate
				}
			})
			.toArray();

		return {
			appointments: appointments.map((a) => ({
				id: a._id.toString(),
				date: a.date
			}))
		};
	} catch (error) {
		console.error(error);
		return { appointments: [] };
	}
}
