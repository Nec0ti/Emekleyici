// crawler.js
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const SEARCH_ENGINES = {
  google: {
    baseUrl: 'https://www.google.com/search',
    selector: '.tF2Cxc',
    titleSelector: 'h3',
    linkSelector: 'a',
    snippetSelector: '.VwiC3b',
  },
  duckduckgo: {
    baseUrl: 'https://duckduckgo.com/',
    selector: '.nrn-react-div',
    titleSelector: 'h2 a',
    linkSelector: 'h2 a',
    snippetSelector: '.EkJbZ8I9O87muDMYwuqd',
  },
  wikipedia: {
    baseUrl: 'https://en.wikipedia.org/w/index.php',
    selector: '.mw-search-result',
    titleSelector: '.mw-search-result-heading a',
    linkSelector: '.mw-search-result-heading a',
    snippetSelector: '.searchResultSnippet',
  },
};

async function search(query, numResults, engine) {
  const searchEngineConfig = SEARCH_ENGINES[engine];
  if (!searchEngineConfig) {
    throw new Error(`Desteklenmeyen arama motoru: ${engine}`);
  }

  const { baseUrl, selector, titleSelector, linkSelector, snippetSelector } = searchEngineConfig;
  const urlParams = new URLSearchParams({ q: query });
  if (engine === 'wikipedia') {
    urlParams.set('search', query);
  }

  const searchUrl = `${baseUrl}?${urlParams.toString()}`;

  try {
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`${engine} için HTTP hatası! Durum: ${response.status}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const results = [];
    let count = 0;

    $(selector).each((i, el) => {
      if (count >= numResults) {
        return false; // İstenen sonuca ulaşıldı, döngüyü kır
      }

      const titleElement = $(el).find(titleSelector);
      const linkElement = $(el).find(linkSelector);
      const snippetElement = $(el).find(snippetSelector);

      const title = titleElement.text().trim();
      const link = linkElement.attr('href');
      const snippet = snippetElement ? snippetElement.text().trim() : '';

      if (title && link) {
        results.push({ title, link, source: engine, snippet });
        count++;
      }
    });

    return results;
  } catch (error) {
    console.error(`${engine} araması sırasında hata oluştu:`, error);
    return [];
  }
}

async function crawlArticles(query, numResults) {
  let allResults = [];

  for (const engine of Object.keys(SEARCH_ENGINES)) {
    const engineResults = await search(query, numResults, engine);
    allResults = allResults.concat(engineResults);
  }

  return allResults.slice(0, numResults); // Toplamda istenen sonuç sayısını geçmeyin
}

async function crawlImages(query, numResults, imageDir) {
  console.log(`'${query}' için ${numResults} resim aranıyor (gerçek implementasyon bekleniyor)...`);
  return new Promise(resolve => setTimeout(resolve, 1000));
}

export default {
  crawlArticles,
  crawlImages
};