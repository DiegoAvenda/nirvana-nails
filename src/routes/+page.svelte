<script>
	const services = [
		{ name: 'manicure1', image: '/images/profile.jpg' },
		{ name: 'pedicure', image: '/images/pedicure.jpg' },
		{ name: 'dipping', image: '/images/dipping.jpg' }
	];
</script>

<img
	class="w-screen object-cover object-bottom lg:h-[26rem]"
	src="/images/main-page.jpg"
	alt="portada"
/>

<div class="flex justify-center">
	<p>servicios</p>
</div>
<div class="m-6 flex flex-col items-center gap-4 md:flex-row md:justify-center lg:mx-24">
	{#each services as service}
		<img
			src={service.image}
			alt={service.name}
			class="w-[32rem] rounded-md object-cover md:h-56 md:w-56 lg:h-96 lg:w-96"
		/>
	{/each}
</div>
