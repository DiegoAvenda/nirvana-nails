<script>
	let { data } = $props();
	console.log('data.appointments', data.appointments);

	// Get today's date and calculate the week range
	const today = new Date();
	const oneWeekLater = new Date(today);
	oneWeekLater.setDate(today.getDate() + 8);

	// Defined working hours
	const hours = [9, 10, 11, 12, 13, 14, 15];

	// Función para verificar si una fecha tiene cita
	function hasAppointment(date) {
		return data.appointments.some((appointment) => date.valueOf() === appointment.date.valueOf());
	}

	const now = new Date();
	const today9am = now.setHours(9, 0, 0, 0); // 9:00 AM de hoy

	// Crear un array para almacenar las fechas
	const dates = [];

	// Recorrer los 6 días
	for (let day = 0; day < 7; day++) {
		// Para cada día, generar las horas de 9 AM a 3 PM en intervalos de 1 hora
		for (let hour = 9; hour <= 15; hour++) {
			// Crear una nueva fecha para ese día y hora
			const newDate = new Date(today9am);
			newDate.setDate(now.getDate() + day); // Ajustar el día
			newDate.setHours(hour, 0, 0, 0); // Ajustar la hora

			// Agregar la fecha al array
			dates.push(newDate);
		}
	}
</script>

<div class="grid grid-cols-8">
	{#each hours as hour}
		<div class="rounded-md border text-center font-semibold">{hour}:00</div>
		{#each Array(7) as _, day}
			{#if dates[day * 7 + (hour - 9)]}
				{@const currentDate = dates[day * 7 + (hour - 9)]}
				<div
					class="rounded-md border p-1 text-center"
					class:bg-red-400={hasAppointment(currentDate)}
				>
					{currentDate.toLocaleTimeString('es-ES', {
						hour: '2-digit',
						minute: '2-digit',
						day: '2-digit',
						month: '2-digit'
					})}
				</div>
			{/if}
		{/each}
	{/each}
</div>
