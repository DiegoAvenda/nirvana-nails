import client from '$lib/server/db.js';

export const load = async () => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const weekFromNow = new Date(today);
	weekFromNow.setDate(today.getDate() + 6); // 6 días después de hoy

	try {
		const mongoClient = await client.connect();
		const db = mongoClient.db('nirvana');
		const appointmentsCollection = db.collection('appointments');
		const weeklySlots = await appointmentsCollection
			.find(
				{
					date: {
						$gte: today.toISOString().split('T')[0],
						$lte: weekFromNow.toISOString().split('T')[0]
					}
				},
				{ projection: { _id: 0 } }
			)
			.sort({ date: 1 })
			.toArray();

		const result = {};
		for (let i = 0; i <= 6; i++) {
			const currentDate = new Date(today);
			currentDate.setDate(today.getDate() + i);
			const formattedDate = currentDate.toISOString().split('T')[0];

			// Asignar las citas del día correspondiente
			result[`day${i + 1}`] = weeklySlots.filter((slot) => slot.date === formattedDate);
		}

		return result;
	} catch (e) {
		console.log(e);
	}
};
