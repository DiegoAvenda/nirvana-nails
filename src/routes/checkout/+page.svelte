<script>
	import { checkout } from '$lib/utils/checkout.svelte.js';
	import { cart } from '$lib/utils/cart.svelte.js';

	let { data } = $props();

	//let totalPrice = $page.params.totalPrice;
	let toggleCheckout = $state(false);

	//stripe checkout

	async function stripeCheckout() {
		if (data.customerId === null) {
			toggleCheckout = true;
			return;
		}

		await fetch('/api/stripe/checkout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				customerId: data.customerId,
				date: checkout.date,
				hour: checkout.hour,
				service: checkout.service
			})
		})
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				window.location.replace(data.url);
			});
	}
</script>

<h1>checkout page</h1>

<p>service: {checkout.service}</p>
<p>date: {checkout.date}</p>
<p>hour: {checkout.hour}</p>

<div class="m-6 flex justify-center">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body items-center text-center">
			<div class="card-actions">
				<button onclick={() => stripeCheckout()} class="btn btn-primary">Go to checkout</button>
			</div>
			{#if toggleCheckout}
				<span>autenticate primero</span>
			{/if}
		</div>
	</div>
</div>
