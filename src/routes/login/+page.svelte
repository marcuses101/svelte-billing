<script lang="ts">
	export let form;
</script>

<section class="prose container mx-auto">
	<h1>Login</h1>
	{#if form && form.success === false}
		<p>{form.message}</p>
	{/if}
	<form class="grid gap-2" method="POST">
		<div class="form-control w-full">
			<label class="label" for="time-in-minutes">
				<span class="label-text">Email</span>
			</label>
			<input
				id="email"
				type="text"
				name="email"
				placeholder="john_doe@example.com"
				class="input input-bordered w-full"
			/>
		</div>
		<button class="btn" type="submit">Submit</button>
	</form>
</section>
