// utils.js
const fs = require('fs');
const axios = require('axios');

/**
 * Save JSON data to a file.
 * @param {string} path - The file path.
 * @param {Object} data - The data to save.
 */
function saveJSON(path, data) {
  try {
    fs.mkdirSync('results', { recursive: true });
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log(`JSON saved to ${path}`);
  } catch (error) {
    console.error('Error saving JSON:', error.message);
  }
}

/**
 * Download and save an image.
 * @param {string} url - The image URL.
 * @param {string} path - The file path to save the image.
 */
async function saveImage(url, path) {
  try {
    const response = await axios({ url, method: 'GET', responseType: 'stream' });
    fs.mkdirSync('results/images', { recursive: true });

    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error saving image:', error.message);
  }
}

module.exports = { saveJSON, saveImage };
