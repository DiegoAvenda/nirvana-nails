<script>
	import { checkout } from '$lib/utils/checkout.svelte.js';

	let { data } = $props();

	let priceInPerson = $derived(checkout.price - 100);

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
	<p class="text-lg"><span class="font-semibold">Cita:</span> {checkout.date} {checkout.hour}:00</p>
	<p class="text-lg"><span class="font-semibold">Servicio:</span> {checkout.service}</p>
	<p class="text-lg"><span class="font-semibold">Precio de servicio:</span> ${checkout.price}</p>
	<p class="text-lg"><span class="font-semibold">Ahora paga:</span> $100</p>
	<p class="text-lg">
		<span class="font-semibold">Restante por pagar en salon:</span> ${priceInPerson}
	</p>
</div>

<div class="m-6 flex justify-center">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body items-center space-y-4 text-center">
			<div class="card-actions">
				<button onclick={() => stripeCheckout()} class="btn btn-primary">Proceder al pago</button>
			</div>
			{#if toggleCheckout}
				<span class="font-medium text-red-500"
					>Autenticate primero <a href="/login">Ir a login</a></span
				>
			{/if}
		</div>
	</div>
</div>
