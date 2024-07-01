<script lang="ts">
	export let data;
	const user = data.user;
</script>

{#if Boolean(user)}
	<div class="prose">
		<p>Logged in as {user.firstName} {user.lastName}</p>
		<form action="/logout" method="POST">
			<input type="hidden" name="redirectTo" value="/" />
			<button type="submit" class="btn btn-primary">Log Out</button>
		</form>
	</div>
{:else}
	<form action="/login" method="POST">
		<input type="hidden" name="redirectTo" value="/" />
		<button class="btn btn-primary"> Log In</button>
	</form>
{/if}
