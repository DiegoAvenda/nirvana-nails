<script>
	let { data } = $props();
	const week = data.week;
	const daysInWeek = data.daysInWeek;
	const hours = [9, 10, 11, 12, 13, 14];

	// Controlar qué formulario se muestra
	let activeForm = $state(null);

	// Función para mostrar un formulario específico
	function showForm(day, hour) {
		activeForm = `${day}-${hour}`;
	}
</script>

<div class="grid grid-cols-7 gap-2 p-4">
	<div></div>
	<!-- Espacio vacío en la esquina superior izquierda -->
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
				class={`border border-gray-300 p-2 text-center text-sm ${
					!week[day]?.[hour] ? 'cursor-pointer bg-green-200' : ''
				}`}
				title={`Fecha: ${day}, Hora: ${hour}:00`}
				role={!week[day]?.[hour] ? 'button' : null}
				onclick={!week[day]?.[hour] ? () => showForm(day, hour) : null}
				onkeydown={!week[day]?.[hour]
					? (event) => {
							if (event.key === 'Enter' || event.key === ' ') showForm(day, hour);
						}
					: null}
			>
				{#if week[day]?.[hour]}
					<!-- Mostrar información si está reservado -->
					<div>
						<p class="font-bold">{week[day][hour].name}</p>
						<p>{week[day][hour].phone}</p>
					</div>
				{:else if activeForm === `${day}-${hour}`}
					<!-- Mostrar formulario si es el cuadro activo -->
					<form method="post" class="space-y-1">
						<label for="name-{day}-{hour}" class="sr-only">Nombre</label>
						<input
							id="name-{day}-{hour}"
							name="name"
							type="text"
							placeholder="Nombre"
							class="w-full border p-1"
							required
						/>

						<label for="phone-{day}-{hour}" class="sr-only">Teléfono</label>
						<input
							id="phone-{day}-{hour}"
							name="phone"
							type="tel"
							placeholder="Teléfono"
							class="w-full border p-1"
							required
						/>

						<input type="hidden" name="day" value={day} />
						<input type="hidden" name="hour" value={hour} />

						<button type="submit" class="w-full rounded bg-blue-500 p-1 text-white">
							Guardar
						</button>
					</form>
				{:else}
					<!-- Mostrar solo "Disponible" por defecto -->
					<span>Disponible</span>
				{/if}
			</div>
		{/each}
	{/each}
</div>
