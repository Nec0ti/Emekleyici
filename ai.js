// ai.js
const fs = require('fs');
const natural = require('natural');

/**
 * Sort results based on relevance using NLP.
 * @param {Array} results - The array of results to sort.
 * @param {string} query - The user's search query.
 * @returns {Array} - The sorted array of results.
 */
function sortResultsWithAI(results, query) {
  const tokenizer = new natural.WordTokenizer();
  const queryTokens = tokenizer.tokenize(query.toLowerCase());

  return results
    .map((result) => {
      const text = result.title || result.url || '';
      const textTokens = tokenizer.tokenize(text.toLowerCase());

      // Calculate similarity based on token overlap
      const overlap = textTokens.filter((token) => queryTokens.includes(token)).length;
      return { ...result, relevance: overlap };
    })
    .sort((a, b) => b.relevance - a.relevance);
}

/**
 * Save sorted results to a file.
 * @param {Array} results - The sorted results.
 */
function saveSortedResults(results) {
  const sortedPath = 'results/sorted_results.json';
  try {
    fs.writeFileSync(sortedPath, JSON.stringify(results, null, 2));
    console.log(`Sorted results saved to ${sortedPath}`);
  } catch (error) {
    console.error('Error saving sorted results:', error.message);
  }
}

module.exports = { sortResultsWithAI, saveSortedResults };
