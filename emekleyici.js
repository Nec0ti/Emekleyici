
// emekleyici.js

const fs = require('fs');
const readline = require('readline');
const { crawl } = require('./crawler'); // Crawler fonksiyonunu import ediyoruz
const { aiSort } = require('./ai'); // AI sıralama fonksiyonunu import ediyoruz

// CLI arayüzü için readline arayüzü oluşturuyoruz
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\n--- Emekleyici: Akıllı Web Taraması ---\n");

// Kullanıcıdan giriş alacağımız temel fonksiyon
function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

(async function main() {
  try {
    // Kullanıcıdan arama terimini alıyoruz
    const searchQuery = await askQuestion("Aramak istediğiniz kelime/konu nedir? \n> ");

    // Kullanıcıdan arama türünü seçmesini istiyoruz
    const searchType = await askQuestion("Arama türü seçin (makale, resim, genel): \n> ");

    // Kullanıcıdan sonuç sayısını alıyoruz
    const resultCount = await askQuestion("Kaç sonuç istiyorsunuz? (Örnek: 10) \n> ");

    console.log("\nEmekleyici, aramaya başlıyor...\n");

    // Crawler fonksiyonunu çağırıyoruz
    const results = await crawl(searchQuery, searchType, parseInt(resultCount, 10));

    console.log("Arama tamamlandı! Sonuçlar işleniyor...\n");

    // Sonuçları AI ile sıralamak isteyip istemediğini soruyoruz
    const useAI = await askQuestion("Sonuçları AI ile sıralamak ister misiniz? (evet/hayır): \n> ");

    let sortedResults = results;

    if (useAI.toLowerCase() === 'evet') {
      console.log("AI sıralaması yapılıyor...");
      sortedResults = aiSort(results); // AI sıralama fonksiyonu çağırılıyor
      console.log("AI sıralaması tamamlandı!\n");
    }

    // Sonuçları JSON olarak kaydediyoruz
    const outputPath = `results/results.json`;
    fs.writeFileSync(outputPath, JSON.stringify(sortedResults, null, 2));

    console.log(`Sonuçlar başarıyla kaydedildi: ${outputPath}`);

  } catch (error) {
    console.error("Bir hata oluştu:", error.message);
  } finally {
    rl.close();
  }
})();
