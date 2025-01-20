<script>
	const services = [
		{ name: 'manicure1', image: '/images/profile.jpg' },
		{ name: 'pedicure', image: '/images/pedicure.jpg' },
		{ name: 'dipping', image: '/images/dipping.jpg' }
	];

	const products = [
		{ name: 'product1', image: '/images/product1.jpg' },
		{ name: 'product2', image: '/images/product3.jpg' },
		{ name: 'product3', image: '/images/product2.jpg' }
	];
</script>

<img
	class="w-screen object-cover object-bottom lg:h-[26rem]"
	src="/images/main-page.jpg"
	alt="portada"
/>

<div class="m-5 flex flex-col gap-6">
	<div class="flex justify-center">
		<p class="text-xl font-bold">SERVICIOS</p>
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
		<p class="text-xl font-bold">PRODUCTOS</p>
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
</div>
