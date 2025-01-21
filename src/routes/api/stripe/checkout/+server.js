import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { dev } from '$app/environment';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const POST = async ({ request }) => {
	const data = await request.json();
	const customerId = data.customerId;
	const phone = data.phone;
	const date = data.date;
	const hour = data.hour;
	const service = data.service;

	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: 'price_1Qi54E4hJ03qO4S1cYFLCipt',
				quantity: 1
			}
		],
		metadata: { customerId, date, hour, service, phone },
		mode: 'payment',
		phone_number_collection: { enabled: true },
		success_url: dev ? 'http://localhost:5173/citas' : 'hhttps://nirvana-nails.vercel.app/citas',
		cancel_url: dev ? 'http://localhost:5173/cancel' : 'https://nirvana-nails.vercel.app/cancel'
	});

	return new Response(JSON.stringify({ url: session.url }), {
		status: 200,
		headers: { 'content-type': 'application/json' }
	});
};
