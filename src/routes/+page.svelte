<script>
	const services = [
		{ name: 'mustache', image: '/images/beard/service1.jpg' },
		{ name: 'haircut', image: '/images/beard/service2.jpg' },
		{ name: 'beard', image: '/images/beard/service3.jpg' }
	];

	const products = [
		{ name: 'product1', image: '/images/beard/products1.jpeg' },
		{ name: 'product2', image: '/images/beard/products2.jpg' },
		{ name: 'product3', image: '/images/beard/products3.jpeg' }
	];

	const facilities = [
		{ name: 'facilities1', image: '/images/beard/facilities1.jpg' },
		{ name: 'facilities2', image: '/images/beard/facilities2.jpeg' },
		{ name: 'facilities3', image: '/images/beard/facilities3.jpeg' }
	];
</script>

<img
	class="w-screen object-cover lg:h-[26rem]"
	src="/images/beard/barber-shop-banner.jpg"
	alt="portada"
/>

<div class="m-5 flex flex-col gap-6">
	<div class="flex justify-center">
		<p class="text-xl font-bold">SERVICES</p>
	</div>
	<div class="flex flex-col items-center gap-4 md:flex-row md:justify-center lg:mx-24">
		{#each services as service}
			<img
				src={service.image}
				alt={service.name}
				class="h-[28rem] w-[32rem] rounded-md object-cover md:h-56 md:w-56 lg:h-96 lg:w-96"
			/>
		{/each}
	</div>

	<div class="flex justify-center">
		<p class="text-xl font-bold">PRODUCTS</p>
	</div>
	<div class="flex flex-col items-center gap-4 md:flex-row md:justify-center lg:mx-24">
		{#each products as product}
			<img
				src={product.image}
				alt={product.name}
				class="h-[28rem] w-[32rem] rounded-md object-cover md:h-56 md:w-56 lg:h-96 lg:w-96"
			/>
		{/each}
	</div>

	<div class="flex justify-center">
		<p class="text-xl font-bold">FACILITIES</p>
	</div>
	<div class="flex flex-col items-center gap-4 md:flex-row md:justify-center lg:mx-24">
		{#each facilities as facility}
			<img
				src={facility.image}
				alt={facility.name}
				class="h-[28rem] w-[32rem] rounded-md object-cover md:h-56 md:w-56 lg:h-96 lg:w-96"
			/>
		{/each}
	</div>
</div>
