<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import LinkButton from './LinkButton.svelte';

	interface Props {
		href?: string;
		children?: import('svelte').Snippet;
		class?: ClassValue;
	}

	let { href, children, class: classValue }: Props = $props();
</script>

<LinkButton {href} btnStyle="dash" color="primary" class={classValue}>
	+ {@render children?.()}
</LinkButton>
