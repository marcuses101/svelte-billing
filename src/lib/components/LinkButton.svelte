<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { Colors, Sizes, ButtonStyles } from './buttonClassMaps';
	import { getButtonClasses } from './buttonClassMaps';

	const {
		children,
		color,
		size,
		btnStyle,
		class: classValue,
		...rest
	}: HTMLAnchorAttributes & {
		color?: Colors;
		size?: Sizes;
		btnStyle?: ButtonStyles;
	} = $props();
</script>

<a class={[getButtonClasses({ size, color, buttonStyle: btnStyle }), classValue]} {...rest}>
	{@render children?.()}
</a>
