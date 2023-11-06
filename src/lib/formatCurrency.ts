export const formatCurrency = new Intl.NumberFormat('en-CA', {
	style: 'currency',
	currency: 'CAD',
	currencyDisplay: 'narrowSymbol'
}).format;
