const { chromium } = require("playwright");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// Create a CSV writer to write data to a CSV file
const csvWriter = createCsvWriter({
  path: "hacker-news-articles.csv",
  header: [
    { id: "title", title: "Title" },
    { id: "url", title: "URL" },
  ],
});

async function saveHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News
  await page.goto("https://news.ycombinator.com");

  // Wait for the page to load and the articles to be visible
  await page.waitForSelector(".athing");

  // Get the title and URL of the top 10 articles
  const articles = await page.$$eval(".athing", (articles) => {
    console.log(articles)
    return articles.slice(0, 10).map((article) => {
      const title = article.querySelector(".title .titleline a").textContent;
      const url = article.querySelector(".title .titleline a").href;
      return { title, url };
    });
  });

  // Write the articles to the CSV file
  await csvWriter.writeRecords(articles);

  // Close the browser
  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();

