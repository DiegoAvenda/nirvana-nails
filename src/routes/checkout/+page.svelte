<script>
	import { checkout } from '$lib/utils/checkout.svelte.js';

	let { data } = $props();

	let priceInPerson = $derived(checkout.price - 100);

	let toggleCheckout = $state(false);

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
				service: checkout.service,
				phone: checkout.phone
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

<h1 class="my-4 text-center text-3xl font-bold">Checkout Page</h1>

<div class="space-y-2 p-4">
	<p class="text-lg">
		<span class="font-semibold">Appointment:</span>
		{checkout.date.toLocaleTimeString('en-US', {
			year: '2-digit',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
			timeZone: 'America/Mexico_City'
		})}
	</p>
	<p class="text-lg"><span class="font-semibold">Service:</span> {checkout.service}</p>
	<p class="text-lg"><span class="font-semibold">Service price:</span> ${checkout.price}</p>
	<p class="text-lg"><span class="font-semibold">Pay now:</span> $100</p>
	<p class="text-lg">
		<span class="font-semibold">You'll pay at saloon:</span> ${priceInPerson}
	</p>
</div>

<div class="m-6 flex justify-center">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body items-center space-y-4 text-center">
			<div class="card-actions">
				<button onclick={() => stripeCheckout()} class="btn btn-primary">Proceed to Payment</button>
			</div>
			{#if toggleCheckout}
				<span class="font-medium text-red-500"
					>Please authenticate first <a href="/login">Go to login</a></span
				>
			{/if}
		</div>
	</div>
</div>
