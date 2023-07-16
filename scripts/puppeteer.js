import puppeteer from 'puppeteer'
import fs from 'fs/promises'
const API_URL = "https://kokopelli-semences.fr/fr/c/search?search=";


(async()=>{
const navigateur = await puppeteer.launch({
    headless: true,
    defaultViewport:false,
})
const page = await navigateur.newPage()
await page.goto(`${API_URL}gombo`)
const produit = await page.$$(".product__wrapper")
const produits = []

for (const p of produit) {
    const famille = await page.evaluate(el => el.querySelector(".product__family > a").textContent.replace(/(\r\n|\n|\r)/gm, "").trim(),p)
    const title = await page.evaluate(el => el.querySelector(".product__title > a").textContent.replace(/(\r\n|\n|\r)/gm, "").trim(),p)
    const description = await page.evaluate(el => el.querySelector(".product__abstract > p").textContent.replace(/(\r\n|\n|\r)/gm, "").trim(),p)
    const image = await page.evaluate(el => el.querySelector("img")?.getAttribute("data-src"),p)
    const prix = 3.40
    produits.push({
        id: Date.now(),
        famille,
        title,
        description,
        prix,
        image
    });
    await fs.writeFile("./json/niamoko.json",JSON.stringify(produits))
    
}


})()
.catch(err => console.error(err))