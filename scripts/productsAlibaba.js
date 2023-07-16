const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');

function cleanAndConvertToRange(string) {
    // Supprimer les espaces et les caractères non numériques
    let cleanedString = string.replace(/[^0-9.,-]/g, '');
  
    // Remplacer la virgule par un point décimal
    cleanedString = cleanedString.replace(/,/g, '.');
  
    // Séparer les valeurs de la fourchette
    let values = cleanedString.split('-');
  
    // Convertir les valeurs en float
    let range = values.map(value => parseFloat(value));
  
    return range;
  }
  

async function scrapeAlibabaPages(numPages) {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    const data = [];
    const baseUrl = 'https://french.alibaba.com/g/liquid-fertilizer_{}.html';

    for (let page = 1; page <= numPages; page++) {
      const url = baseUrl.replace('{}', page);
      await driver.get(url);

      const titles = await driver.findElements(By.css('h2'));
      const prices = await driver.findElements(By.css('span.price-number'));
      const imageUrls = await driver.findElements(By.css('a.product-image img'));

      for (let i = 0; i < titles.length; i++) {
        const title = await titles[i].getText();
        let price = await prices[i].getText();
        const imageUrl = await imageUrls[i].getAttribute('src');
        price=cleanAndConvertToRange(price);
        data.push({ title, price, imageUrl });
      }
    }

    const jsonData = JSON.stringify(data);
    fs.writeFileSync('productsAlibaba.json', jsonData);
  } finally {
    await driver.quit();
  }
}

// Appel de la fonction pour scraper les 100 pages
scrapeAlibabaPages(50);
