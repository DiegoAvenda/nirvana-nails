<script>
	import { cart } from '$lib/utils/cart.svelte.js';

	let { data } = $props();

	//let totalPrice = $page.params.totalPrice;
	let toggleCheckout = $state(false);

	//stripe checkout

	async function checkout() {
		if (data.customerId === null) {
			toggleCheckout = true;
			return;
		}

		await fetch('/api/stripe/checkout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ items: cart, customerId: data.customerId })
		})
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				window.location.replace(data.url);
			});
	}
</script>

<div class="m-6 flex justify-center">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body items-center text-center">
			<div class="card-actions">
				<button onclick={() => checkout()} class="btn btn-primary">Go to checkout</button>
			</div>
			{#if toggleCheckout}
				<span>autenticate primero</span>
			{/if}
		</div>
	</div>
</div>
