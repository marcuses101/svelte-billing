import puppeteer from 'puppeteer';

(async () => {
	// Launch a headless browser
	const browser = await puppeteer.launch({ headless: 'new' });

	// Open a new page
	const page = await browser.newPage();

	await page.setCookie({
		name: 'user_id',
		value: 'bac635d0-5b13-42f5-b0aa-c041cb6f0c98',
		domain: 'localhost'
	});
	// Navigate to the desired URL
	await page.goto('http://localhost:5173/skaters', { waitUntil: 'networkidle2' });
	// Set the PDF options (you can customize these as needed)
	const pdfOptions = {
		path: 'output.pdf', // Path to save the PDF file
		format: 'A4', // Page format
		printBackground: true // Include background graphics and colors
	};

	// Generate the PDF
	await page.pdf(pdfOptions);

	// Close the browser
	await browser.close();

	console.log('PDF saved successfully.');
})();
