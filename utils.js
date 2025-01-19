// utils.js
const fs = require('fs');
const path = require('path');

function saveResultsToJson(data, filePath) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData);
    console.log(`Sonuçlar ${filePath} adresine kaydedildi.`);
  } catch (error) {
    console.error('JSON dosyasına yazılırken hata oluştu:', error);
  }
}

function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`${dirPath} klasörü oluşturuldu.`);
  }
}

function handleError(errorMessage, error) {
  console.error(`HATA: ${errorMessage}`);
  if (error) {
    console.error(error);
  }
}

// İsteğe bağlı: Konsol çıktılarını daha düzenli hale getirmek için
function logMessage(message) {
  console.log(`[Emekleyici] ${message}`);
}

module.exports = {
  saveResultsToJson,
  createDirectoryIfNotExists,
  handleError,
  logMessage,
};