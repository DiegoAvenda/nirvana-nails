<script>
	import { enhance } from '$app/forms';
	let { userPicture, admin } = $props();
</script>

<div
	class="navbar bg-base-100"
	style="--tw-border-opacity: 1; border-bottom: 1px solid var(--fallback-b2, oklch(var(--b2) / var(--tw-border-opacity)));"
>
	<div class="flex-1">
		<a href="/" class="btn btn-ghost m-4 text-xl">Nirvana nails</a>
		<a href="/services" class="btn btn-ghost text-xl">Servicios</a>
		<a href="/contact" class="btn btn-ghost text-xl">Contacto</a>
	</div>
	<div class="flex-none">
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="avatar btn btn-circle btn-ghost">
				<div class="w-10 rounded-full">
					<img
						alt="Tailwind CSS Navbar component"
						src={userPicture
							? userPicture
							: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}
					/>
				</div>
			</div>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<ul
				tabindex="0"
				class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
			>
				{#if admin}
					<li><a href="/admin" class="justify-between"> Admin pending orders </a></li>
					<li><a href="/admin/prepared" class="justify-between"> Admin prepared orders </a></li>
					<li><a href="/admin/delivered" class="justify-between"> Admin delivered orders </a></li>
				{:else}
					<li>
						<a href="/profile" class="justify-between">
							Pending orders
							<span class="badge">New</span>
						</a>
					</li>
					<li><a href="/profile/delivered" class="justify-between"> Delivered orders </a></li>
				{/if}
				{#if !userPicture}
					<li><a href="/api/oauth/google">Login</a></li>
				{/if}
				{#if userPicture}
					<li>
						<form method="post" use:enhance action="/?/signOut">
							<button>Logout</button>
						</form>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</div>
