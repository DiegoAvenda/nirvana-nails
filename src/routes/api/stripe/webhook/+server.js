import Stripe from 'stripe';
import client from '$lib/server/db.js';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { notifUser } from '$lib/server/push-subscription';

const adminGoogleId = '100935988500638449773';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST({ request }) {
	const rawBody = await request.arrayBuffer();

	const event = await stripe.webhooks.constructEvent(
		Buffer.from(rawBody),
		request.headers.get('stripe-signature'),
		STRIPE_WEBHOOK_SECRET
	);

	if (event.type === 'checkout.session.completed') {
		const charge = event.data.object;
		const customerId = charge.metadata.customerId;
		const date = JSON.parse(charge.metadata.date);
		const hour = JSON.parse(charge.metadata.hour);
		const phone = JSON.parse(charge.metadata.phone);
		const service = JSON.parse(charge.metadata.service);

		try {
			const mongoClient = await client.connect();
			const db = mongoClient.db('nirvana');
			const users = db.collection('users');
			const query = { googleId: customerId };
			const user = await users.findOne(query);
			const customerName = user.name;

			const appointments = db.collection('appointments');

			const appointment = await appointments.insertOne({
				customerId,
				customerName,
				date,
				hour,
				service,
				phone,
				createdAt: new Date()
			});

			console.log(`Nueva cita creada con id: ${appointment.insertedId}`);

			notifUser(adminGoogleId, 'Tienes un nuevo pedido');

			//revalidatePath("/")
			//return { successMsg: "order created" }
		} catch (e) {
			console.error(e);
			//return { error: "Failed to create order" }
		}
	}
	return json({ message: 'exito' });
}
