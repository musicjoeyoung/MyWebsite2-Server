import puppeteer from 'puppeteer';

export async function scrapeLinkedInRecommendations() {
    //const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();
    const timeout = 60000;
    try {
        await page.goto('https://www.linkedin.com/login', { timeout });
        console.log('Navigated to LinkedIn login page.');

        const usernameField = await page.$('#username');
        if (!usernameField) throw new Error('Username input field not found.');
        await page.type('#username', "" /* `${process.env.LINKEDIN_EMAIL}` */);
        console.log('Entered username.');

        const passwordField = await page.$('#password');
        if (!passwordField) throw new Error('Password input field not found.');
        await page.type('#password', "" /* `${process.env.LINKEDIN_PASSWORD}` */);
        console.log('Entered password.');

        await page.locator('button[type="submit"]').click();
        console.log('Clicked login button.');

        await page.waitForNavigation({ timeout });
        console.log('Logged in and navigated to LinkedIn home page.');

        await page.goto('https://www.linkedin.com/in/joseph-m-young/details/recommendations/', { timeout });
        console.log('Navigated to recommendations page.');

        const recommendationElements = await page.$$('li.pvs-list__paged-list-item');
        if (recommendationElements.length === 0) throw new Error('No recommendations found.');
        console.log(`Found ${recommendationElements.length} recommendations.`);

        const recommendations = await page.evaluate(() => {
            const elements = document.querySelectorAll('li.pvs-list__paged-list-item');
            return Array.from(elements).map(el => ({
                text: el.querySelector('.dMebqQWOKcgqoOzatSvcRsxSijqPVyLuglpUBdY')?.textContent?.trim() || '',
                //author: el.querySelector('.recommendation-author')?.textContent?.trim(),
            }));
        });
        console.log('Scraped recommendations successfully.');

        await browser.close();
        return recommendations;
    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
        throw error;
    }
}
