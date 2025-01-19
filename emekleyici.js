#!/usr/bin/env node
import { program } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import * as ai from './ai.js';
import crawler from './crawler.js';
import * as utils from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Çıktı klasörlerini oluştur
const resultsDir = path.join(__dirname, 'results');
const imagesDir = path.join(resultsDir, 'images');

// Klasörlerin varlığını kontrol et ve yoksa oluştur
utils.createDirectoryIfNotExists(resultsDir);
utils.createDirectoryIfNotExists(imagesDir);

program
  .version('0.1.0')
  .description('İnternette belirtilen sorgular için tarama yapar ve sonuçları JSON veya WEBP olarak kaydeder.')
  .option('-q, --query <string>', 'Aranacak kelime veya ifade (zorunlu)')
  .option('-t, --type <type>', 'Aranacak içerik türü: article, image (varsayılan: article)', 'article')
  .option('-n, --numResults <number>', 'İstenen sonuç sayısı (varsayılan: 10)', parseInt)
  .option('--no-ai', 'AI sıralamasını devre dışı bırak')
  .parse(process.argv);

const options = program.opts();

async function main() {
  if (!options.query) {
    utils.handleError('Lütfen aranacak bir sorgu belirtin. (-q veya --query)');
    process.exit(1);
  }

  const query = options.query;
  const type = options.type;
  const numResults = options.numResults || 10;
  const useAI = options.ai;

  utils.logMessage(`Emekleyici çalışıyor...`);
  utils.logMessage(`Sorgu: ${query}`);
  utils.logMessage(`Tür: ${type}`);
  utils.logMessage(`İstenen Sonuç Sayısı: ${numResults}`);
  utils.logMessage(`AI Kullanımı: ${useAI ? 'Aktif' : 'Devre Dışı'}`);

  try {
    let results = [];
    if (type === 'article') {
      utils.logMessage('\nMakale aranıyor...');
      results = await crawler.crawlArticles(query, numResults);
      if (useAI) {
        utils.logMessage('AI ile sonuçlar sıralanıyor...');
        results = ai.rankResults(results, query);
      }
      utils.saveResultsToJson(results, path.join(resultsDir, 'results.json'));
      utils.logMessage(`\nMakale sonuçları ${path.join(resultsDir, 'results.json')} adresine kaydedildi.`);
    } else if (type === 'image') {
      utils.logMessage('\nResim aranıyor ve indiriliyor...');
      results = await crawler.crawlImages(query, numResults, imagesDir);
      utils.logMessage(`\nResimler ${imagesDir} klasörüne indirildi.`);
      // Resimler için AI sıralaması mantığı burada eklenebilir.
    } else {
      utils.handleError(`Geçersiz içerik türü. 'article' veya 'image' belirtin.`);
      process.exit(1);
    }

    utils.logMessage('\nTarama tamamlandı.\n');
  } catch (error) {
    utils.handleError('Bir hata oluştu:', error);
  }
}

main();