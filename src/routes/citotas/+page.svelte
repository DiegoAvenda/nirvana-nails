<script>
	import { checkout } from '$lib/utils/checkout.svelte.js';

	let { data, form } = $props();

	let calendarColumns = $state(7);

	if (data.admin) {
		calendarColumns = 3;
	}

	const week = form?.week || data.week;
	const daysInWeek = form?.daysInWeek || data.daysInWeek;
	const hours = [9, 10, 11, 12, 13, 14];

	// Control de modal y formulario activo
	let activeForm = $state(null);
	let selectedAppointment = $state(null);
	let showModal = $state(false);
	let isEditing = $state(false);

	// Estado para el formulario de edición
	let editForm = $state({
		clientName: '',
		clientPhone: ''
	});

	// Función para mostrar el modal con el formulario
	function showForm(day, hour) {
		activeForm = `${day}/${hour}`;
		showModal = true;
		isEditing = false;
	}

	// Función para mostrar detalles de la cita
	function showAppointmentDetails(appointment, day, hour) {
		if (!data.admin) return; // Solo admins pueden ver detalles de citas existentes
		selectedAppointment = { ...appointment, day, hour };
		showModal = true;
		isEditing = false;
		// Inicializar el formulario de edición con los valores actuales
		editForm = {
			name: appointment.name,
			phone: appointment.phone
		};
	}

	function closeModal() {
		showModal = false;
		activeForm = null;
		selectedAppointment = null;
		isEditing = false;
	}

	function enableEditing() {
		if (!data.admin) return; // Solo admins pueden editar
		isEditing = true;
	}

	const checkoutAppointment = (date, hour) => {
		checkout.date = date;
		checkout.hour = hour;
	};

	let adminView = $state('present');

	const changeAdminView = (time) => {
		adminView = time;
	};
</script>

{#if checkout.service != ''}
	<p class="m-3 text-lg">Servicio elegido: {checkout.service}</p>
{/if}

<div class="flex justify-center">
	<form action="?/adminView" method="POST">
		<input type="hidden" name="days" value={adminView} />
		<button onclick={() => changeAdminView('past')} class="btn">Semana previa</button>
		<button onclick={() => changeAdminView('present')} class="btn">Hoy y mañana</button>
		<button onclick={() => changeAdminView('future')} class="btn">Semana futura</button>
	</form>
</div>
<div
	class={`grid grid-cols-${
		!data.admin
			? 7
			: data.admin.calendar === 'present'
				? 3
				: data.admin.calendar === 'future' || data.admin.calendar === 'past'
					? 7
					: 3
	} gap-1 p-2 text-xs md:gap-2 md:p-4 md:text-base lg:m-8`}
>
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
				class={`min-h-16 border border-gray-300 p-1 text-center md:p-2 ${
					!week[day]?.[hour] ? 'cursor-pointer bg-green-400' : 'bg-red-400'
				}`}
				title={!week[day]?.[hour] ? `Fecha: ${day}, Hora: ${hour}:00` : ''}
				role={!week[day]?.[hour] ? 'button' : null}
				onclick={!week[day]?.[hour]
					? () => showForm(day, hour)
					: data.admin
						? () => showAppointmentDetails(week[day][hour], day, hour)
						: null}
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
		<div class="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-lg bg-white p-4 shadow-xl">
			<div class="mb-4 flex justify-between">
				<h2 class="text-xl font-bold">
					{selectedAppointment ? (isEditing ? 'Editar Cita' : 'Detalles de la Cita') : 'Nueva Cita'}
				</h2>
				<button onclick={closeModal} class="rounded-full p-1 hover:bg-gray-200" aria-label="Cerrar">
					✕
				</button>
			</div>

			{#if selectedAppointment && data.admin}
				<form method="post" action="?/update" class="space-y-4">
					<input type="hidden" name="id" value={selectedAppointment.id} />
					<input type="hidden" name="date" value={selectedAppointment.day} />
					<input type="hidden" name="hour" value={selectedAppointment.hour} />

					<div>
						<label for="edit-name" class="block font-bold">Nombre</label>
						{#if isEditing}
							<input
								id="edit-name"
								name="name"
								type="text"
								class="w-full rounded border p-2"
								bind:value={editForm.name}
								required
							/>
						{:else}
							<p class="p-2">{selectedAppointment.name}</p>
						{/if}
					</div>

					<div>
						<label for="edit-phone" class="block font-bold">Teléfono</label>
						{#if isEditing}
							<input
								id="edit-phone"
								name="phone"
								type="tel"
								class="w-full rounded border p-2"
								bind:value={editForm.phone}
								required
							/>
						{:else}
							<p class="p-2">{selectedAppointment.phone}</p>
						{/if}
					</div>

					<div>
						<p class="font-bold">Fecha:</p>
						<p class="p-2">
							{new Date(selectedAppointment.day).toLocaleDateString()} - {selectedAppointment.hour}:00
						</p>
					</div>

					{#if isEditing}
						<div class="flex gap-2">
							<button
								type="submit"
								class="flex-1 rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
							>
								Guardar Cambios
							</button>
							<button
								type="button"
								onclick={() => (isEditing = false)}
								class="flex-1 rounded border border-gray-300 p-2 hover:bg-gray-100"
							>
								Cancelar
							</button>
						</div>
					{:else}
						<div class="flex gap-2">
							<button
								type="button"
								onclick={enableEditing}
								class="flex-1 rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
							>
								Editar
							</button>
							<button
								type="submit"
								class="flex-1 rounded bg-red-500 p-2 text-white hover:bg-red-600"
								formaction="?/delete"
							>
								Eliminar
							</button>
						</div>
					{/if}
				</form>
			{:else if !selectedAppointment}
				{#if checkout.service === ''}
					<p>Selecciona un servicio primero <a href="/services" class="link">Ir a servicios</a></p>
				{:else}
					<button
						class="btn"
						onclick={() =>
							checkoutAppointment(activeForm?.split('/')[0], activeForm?.split('/')[1])}
						><a href="/checkout"> Agendar cita</a></button
					>
				{/if}
			{/if}
		</div>
	</div>
{/if}
