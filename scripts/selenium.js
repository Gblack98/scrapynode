import { Builder, By, Key, until } from "selenium-webdriver";
import fs from 'fs/promises'
(async function example() {
  let driver = await new Builder().forBrowser("chrome").build();
  const pasteques = []

  try {
    await driver.get("https://www.biaugerme.com/potageres/legumes-fruit/melons-pasteques");
    // await driver.findElement(By.name("q")).sendKeys("You did it!!", Key.RETURN);
    // await driver.wait(until.titleIs("You did it!! - Google Search"), 1000);
    const elements = await driver.findElements(By.css(".blocks > li"))
    console.log(elements.length);
    for (const element of elements) {
      const title = await element.findElement(By.css(".lpPTitle")).getText()
      const image_url = await element.findElement(By.css("img")).getAttribute("src")
      const description = await element.findElement(By.css(".lpPDesc")).getText()
      const code = await element.findElement(By.css(".codeArticle")).getText()
      const pour = (await element.findElement(By.css(".jsAddToBasket > span")).getText()).trim()
      const a = await (await element.findElement(By.css(".jsAddToBasket")).getText()).split("\n")[2]

      pasteques.push({id: Date.now(),code,title,image_url,description,pour,a})
      await fs.writeFile("./json/pasteques.json",JSON.stringify(pasteques))
    }
  } finally {
    await driver.quit();
  }
})();
