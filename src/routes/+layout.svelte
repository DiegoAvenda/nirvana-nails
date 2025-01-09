<script>
	import '../app.css';
	import Navbar from '../lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>nirvana burgers</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Navbar username={data.username} admin={data.admin} userPicture={data.userPicture} />
	<div class="grow">
		{@render children()}
	</div>
	<Footer />
</div>
