<script>
	import '../app.css';
	import Navbar from '../lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>nirvana burgers</title>
</svelte:head>

{#if data.username && !data.admin}
	<form method="post" action="/?/adminMode">
		<button
			class="absolute m-1 rounded bg-white px-3 text-xs text-black opacity-50 transition-all hover:bg-white hover:opacity-100"
			>Become admin</button
		>
	</form>
{/if}

<div class="flex min-h-screen flex-col">
	<Navbar username={data.username} admin={data.admin} userPicture={data.userPicture} />
	<div class="grow">
		{@render children()}
	</div>
	<Footer />
</div>
