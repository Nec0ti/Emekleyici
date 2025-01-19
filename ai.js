// ai.js

/**
 * Verilen sonuçları sorguya göre sıralar.
 * Şu an için basit bir anahtar kelime eşleşmesi ile sıralama yapmaktadır.
 * İleride daha gelişmiş AI algoritmaları entegre edilebilir.
 *
 * @param {Array<object>} results Sıralanacak sonuç dizisi.
 * @param {string} query Arama sorgusu.
 * @returns {Array<object>} Sıralanmış sonuç dizisi.
 */
function rankResults(results, query) {
  if (!results || results.length === 0) {
    return [];
  }

  const lowerCaseQuery = query.toLowerCase();

  // Basit anahtar kelime eşleşmesi skoru
  const scoredResults = results.map(result => {
    let score = 0;
    if (result.title && result.title.toLowerCase().includes(lowerCaseQuery)) {
      score += 2; // Başlıkta eşleşme daha yüksek skor
    }
    if (result.summary && result.summary.toLowerCase().includes(lowerCaseQuery)) {
      score += 1;
    }
    return { ...result, score };
  });

  // Skorlarına göre azalan sırada sırala
  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults.map(({ score, ...rest }) => rest); // Skoru çıkar ve sıralanmış sonuçları döndür
}

module.exports = {
  rankResults,
};