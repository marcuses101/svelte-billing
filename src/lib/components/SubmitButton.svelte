<script lang="ts">
	interface Props {
		fullWidth?: boolean;
		form?: string | undefined;
	}
	let { fullWidth = false, form = '' }: Props = $props();
</script>

<button class="btn btn-primary {fullWidth ? 'w-full' : ''}" type="submit" {form}>Submit</button>
