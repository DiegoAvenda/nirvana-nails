import { PAYPAL_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_PAYPAL_CLIENT_ID } from '$env/static/public';

const environment = 'sandbox';
export const endpoint_url =
	environment === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

export function get_access_token() {
	const auth = `${PUBLIC_PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`;
	const data = 'grant_type=client_credentials';
	return fetch(endpoint_url + '/v1/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(auth).toString('base64')}`
		},
		body: data
	})
		.then((res) => res.json())
		.then((json) => {
			return json.access_token;
		});
}
