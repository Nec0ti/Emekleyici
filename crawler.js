// crawler.js
const axios = require('axios');
const cheerio = require('cheerio');
const { saveJSON, saveImage } = require('./utils');

/**
 * Crawl the web based on the search query and type.
 * @param {string} query - The search query.
 * @param {string} type - The type of search (e.g., 'makale', 'resim', 'genel').
 * @param {number} limit - The number of results to retrieve.
 * @returns {Promise<Array>} - The results as an array of objects.
 */
async function crawl(query, type, limit) {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  };

  const results = [];

  try {
    // Fetch the search page
    const response = await axios.get(searchUrl, { headers });
    const $ = cheerio.load(response.data);

    if (type === 'makale' || type === 'genel') {
      // Extract article links and titles
      $('a').each((i, element) => {
        if (results.length >= limit) return false;

        const title = $(element).text();
        const url = $(element).attr('href');

        if (url && title) {
          results.push({ title, url });
        }
      });
    }

    if (type === 'resim' || type === 'genel') {
      // Extract image URLs (placeholder logic for image scraping)
      $('img').each((i, element) => {
        if (results.length >= limit) return false;

        const imageUrl = $(element).attr('src');
        if (imageUrl) {
          results.push({ imageUrl });
        }
      });
    }

    // Save the results as a JSON file
    saveJSON('results/results.json', results);

    // Save images if type is 'resim'
    if (type === 'resim') {
      for (const result of results) {
        if (result.imageUrl) {
          await saveImage(result.imageUrl, `results/images/${Date.now()}.webp`);
        }
      }
    }

    return results;
  } catch (error) {
    console.error('Crawl error:', error.message);
    throw error;
  }
}

module.exports = { crawl };