<script>
	import { products } from '$lib/utils/products';

	let { data } = $props();

	const calculateRemaining = (service) => {
		const product = products.find((p) => p.name === service);
		const servicePrice = product.price;
		const remaining = servicePrice - 100;
		return { servicePrice, remaining };
	};
</script>

<div class="mt-6 flex flex-col items-center">
	<h1 class="flex justify-center text-3xl font-bold">My Reservations</h1>

	<div class="my-6 flex flex-col items-center gap-1">
		{#each data.appointments as appointment}
			{@const calculation = calculateRemaining(appointment.service)}
			<div class="card card-bordered card-compact w-96 bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<h2 class="card-title">Appointment: {appointment.date}</h2>
					</div>
					<p>Service: <span class="font-bold">{appointment.service}</span></p>
					<p>Service price: <span class="font-bold">${calculation.servicePrice}</span></p>
					<p>You paid for the reservaton: <span class="font-bold"> $100</span></p>
					<p>
						Remaining balance to pay <span class="font-bold">
							$
							{calculation.remaining}</span
						>
					</p>
				</div>
			</div>
		{/each}
	</div>

	{#if data.appointments.length === 0}
		<p class="m-8">You have no reserved appointments.</p>
	{/if}
</div>
