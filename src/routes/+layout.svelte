<script lang="ts">
	import type { LayoutData } from './$types';
	import Header from './Header.svelte';
	import '../app.css';
	export let data: LayoutData;
</script>

<div class="app">
	<Header isLoggedIn={Boolean(data.user)} />

	<main>
		<slot />
	</main>
	<footer class="footer footer-center p-4 bg-neutral text-neutral-content">
		<aside>
			<p>Copyright {new Date().getFullYear()}</p>
		</aside>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
