<script>
	let { data } = $props();
</script>

<div class="mt-6 flex flex-col items-center">
	<h1 class="flex justify-center text-3xl font-bold">My previous appointments</h1>

	<div class="my-6 flex flex-col items-center gap-1">
		{#each data.appointments as appointment}
			<div class="card card-bordered card-compact w-96 bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<h2 class="card-title">Appointment: {appointment.date}</h2>
					</div>
					<p>Service: <span class="font-bold">{appointment.service}</span></p>
					<p>Status: <span class="font-bold">{appointment.status}</span></p>
				</div>
			</div>
		{/each}
	</div>

	{#if data.appointments.length === 0}
		<p class="m-8">You have no past appointments.</p>
	{/if}
</div>
