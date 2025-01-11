<script>
	let { data } = $props();
	const week = data.week;
	const daysInWeek = data.daysInWeek;
	const hours = [9, 10, 11, 12, 13, 14];

	// Control de modal y formulario activo
	let activeForm = $state(null);
	let selectedAppointment = $state(null);
	let showModal = $state(false);

	// Función para mostrar el modal con el formulario
	function showForm(day, hour) {
		activeForm = `${day}-${hour}`;
		showModal = true;
	}

	// Función para mostrar detalles de la cita
	function showAppointmentDetails(appointment, day, hour) {
		selectedAppointment = { ...appointment, day, hour };
		showModal = true;
	}

	// Función para cerrar el modal
	function closeModal() {
		showModal = false;
		activeForm = null;
		selectedAppointment = null;
	}
</script>

<div class="grid grid-cols-7 gap-1 p-2 text-xs md:gap-2 md:p-4 md:text-base lg:m-8">
	<div></div>
	{#each daysInWeek as day}
		<div class="text-center font-bold">
			{new Date(day).toLocaleDateString('en-US', {
				weekday: 'short',
				day: 'numeric'
			})}
		</div>
	{/each}

	{#each hours as hour}
		<div class="text-center font-bold">{hour}:00</div>
		{#each daysInWeek as day}
			<div
				class={`border border-gray-300 p-1 text-center md:p-2 ${
					!week[day]?.[hour] ? 'cursor-pointer bg-green-400' : 'bg-red-400'
				}`}
				title={`Fecha: ${day}, Hora: ${hour}:00`}
				role={!week[day]?.[hour] ? 'button' : null}
				onclick={!week[day]?.[hour]
					? () => showForm(day, hour)
					: () => showAppointmentDetails(week[day][hour], day, hour)}
			>
				{#if week[day]?.[hour] && data.admin}
					<div class="hidden md:block">
						<p class="font-bold">{week[day][hour].name}</p>
						<p>{week[day][hour].phone}</p>
					</div>
				{/if}
			</div>
		{/each}
	{/each}
</div>

<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
		<div class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-4 shadow-xl">
			<div class="mb-4 flex justify-between">
				<h2 class="text-xl font-bold">
					{selectedAppointment ? 'Detalles de la Cita' : 'Nueva Cita'}
				</h2>
				<button onclick={closeModal} class="rounded-full p-1 hover:bg-gray-200" aria-label="Cerrar">
					✕
				</button>
			</div>

			{#if selectedAppointment}
				<div class="space-y-4">
					<div>
						<p class="font-bold">Nombre:</p>
						<p>{selectedAppointment.name}</p>
					</div>
					<div>
						<p class="font-bold">Teléfono:</p>
						<p>{selectedAppointment.phone}</p>
					</div>
					<div>
						<p class="font-bold">Fecha:</p>
						<p>
							{new Date(selectedAppointment.day).toLocaleDateString()} - {selectedAppointment.hour}:00
						</p>
					</div>
				</div>
			{:else}
				<form method="post" class="space-y-4">
					<div>
						<label for="name" class="block font-bold">Nombre</label>
						<input id="name" name="name" type="text" class="w-full rounded border p-2" required />
					</div>

					<div>
						<label for="phone" class="block font-bold">Teléfono</label>
						<input id="phone" name="phone" type="tel" class="w-full rounded border p-2" required />
					</div>

					<input type="hidden" name="day" value={activeForm?.split('-')[0]} />
					<input type="hidden" name="hour" value={activeForm?.split('-')[1]} />

					<button type="submit" class="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600">
						Guardar
					</button>
				</form>
			{/if}
		</div>
	</div>
{/if}
