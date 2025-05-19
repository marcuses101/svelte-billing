export const colorMap = {
	info: 'btn-info',
	neutral: 'btn-neutral',
	primary: 'btn-primary',
	secondary: 'btn-secondary',
	accent: 'btn-accent',
	success: 'btn-success',
	warning: 'btn-warning',
	error: 'btn-error'
} as const;

export type Colors = keyof typeof colorMap;

export const sizeMap = {
	xs: 'btn-xs',
	sm: 'btn-sm',
	md: 'btn-md',
	lg: 'btn-lg',
	xl: 'btn-xl'
};

export type Sizes = keyof typeof sizeMap;

export const buttonStyleMap = {
	outline: 'btn-outline',
	dash: 'btn-dash',
	soft: 'btn-soft',
	ghost: 'btn-ghost',
	link: 'btn-link'
};

export type ButtonStyles = keyof typeof buttonStyleMap;

export function getButtonClasses({
	color,
	size,
	buttonStyle
}: {
	color?: Colors;
	size?: Sizes;
	buttonStyle?: ButtonStyles;
}) {
	return [
		'btn',
		color && colorMap[color],
		size && sizeMap[size],
		buttonStyle && buttonStyleMap[buttonStyle]
	];
}
