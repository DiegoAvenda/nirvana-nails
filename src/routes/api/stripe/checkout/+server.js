import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const POST = async ({ request }) => {
	const data = await request.json();
	const customerId = data.customerId;
	const date = data.date;
	const hour = data.hour;
	const service = data.service;

	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: 'prod_RbHdjhxhbNo3cM',
				quantity: 2
			}
		],
		metadata: { customerId, date, hour, service },
		mode: 'payment',
		success_url: 'https://nirvana-burgers.vercel.app/profile',
		cancel_url: 'https://nirvana-burgers.vercel.app/cancel',
		shipping_address_collection: {
			allowed_countries: ['US', 'MX']
		}
	});

	return new Response(JSON.stringify({ url: session.url }), {
		status: 200,
		headers: { 'content-type': 'application/json' }
	});
};
