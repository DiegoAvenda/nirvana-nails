<script>
	import { enhance } from '$app/forms';
	let { userPicture, admin } = $props();
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost mr-2 sm:mr-4 sm:text-xl">BARBER SHOP</a>
		<a href="/services" class="btn btn-ghost sm:text-xl">SERVICES</a>
		<a href="/contact" class="btn btn-ghost sm:text-xl">CONTACT</a>
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
						<a href="/profile" class="justify-between"> Appointments </a>
					</li>
					<li><a href="/profile/delivered" class="justify-between"> Appointment History</a></li>
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
