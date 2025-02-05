<script>
	import { products } from '$lib/utils/products';
	import { checkout } from '$lib/utils/checkout.svelte.js';

	const serviceInfo = (service, price) => {
		checkout.service = service;
		checkout.price = price;
	};
</script>

<div class="m-8">
	<div class="flex justify-center">
		<h1 class="text-4xl font-bold">Haircuts</h1>
	</div>
	<div
		class="m-9 flex flex-col items-center gap-2 md:grid md:grid-cols-2 lg:grid-cols-3 lg:justify-center"
	>
		{#each products as product, i}
			<div class="card card-bordered card-compact w-96 bg-base-100 shadow-xl">
				<figure>
					<img alt={product.name} src={product.image} class="h-96" />
				</figure>
				<div class="card-body">
					<h2 class="card-title">
						{product.name}
					</h2>
					<p>${product.price}</p>
					<div class="card-actions justify-end">
						<button onclick={() => serviceInfo(product.name, product.price)} class="btn"
							><a href="/calendar"> comprar</a></button
						>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
