import express from 'express';
import { scrapeLinkedInRecommendations } from './scrapeLinkedIn.ts';

const app = express();

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

//Keeping this for now, but after so many successful attempts LinkedIn starts asking for authenication, and I can't address that via puppeteer. So, that is a bummer.
/* app.get('/scrape-recommendations', async (req, res) => {
    try {
        const recommendations = await scrapeLinkedInRecommendations();
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape recommendations' });
    }
}); */

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
