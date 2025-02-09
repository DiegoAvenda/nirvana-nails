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
						<h2 class="card-title">Appointment: {appointment.date} - {appointment.hour}:00</h2>
					</div>
					<p>Service: {appointment.service}</p>
					<p>Service price: ${calculation.servicePrice}</p>
					<p>You paid for the reservaton: $100</p>
					<p class="font-bold">
						Remaining balance to pay $
						{calculation.remaining}
					</p>
				</div>
			</div>
		{/each}
	</div>

	{#if data.appointments.length === 0}
		<p class="m-8">No tienes citas reservadas</p>
	{/if}
</div>
