export const formatCurrency = (amount: number, isCents = true) => {
	const format = new Intl.NumberFormat('en-CA', {
		style: 'currency',
		currency: 'CAD',
		currencyDisplay: 'narrowSymbol'
	}).format;
	if (isCents) {
		return format(amount / 100);
	}
	return format(amount);
};
