<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Colors, Sizes, ButtonStyles } from './buttonClassMaps';
	import { getButtonClasses } from './buttonClassMaps';
	export type ButtonProps = HTMLButtonAttributes & {
		color?: Colors;
		size?: Sizes;
		btnStyle?: ButtonStyles;
		href?: string;
	};
	const {
		children,
		color,
		size,
		btnStyle,
		disabled = false,
		class: classValue,
		...rest
	}: ButtonProps = $props();
</script>

<button
	class={[getButtonClasses({ size, buttonStyle: btnStyle, color }), classValue]}
	{disabled}
	{...rest}
>
	{@render children?.()}
</button>
