import fetch from "node-fetch";
import cheerio from "cheerio";
import fs from "fs/promises";
const API_URL =
  "https://kokopelli-semences.fr/fr/c/semences/potageres/legumes-fruits";
// "https://kokopelli-semences.fr/fr/c/semences/potageres/legumes-fruits";
const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.text();
  ParseHtml(data);
};
const articles = [];
const ParseHtml = (html) => {
  const $ = cheerio.load(html);
  $(".product > .product__wrapper", html).each(function () {
    const famille = $(this)
      .children(".product__top")
      .children(".product__family")
      .children("a")
      .text()
      .replace(/(\r\n|\n|\r)/gm, "")
      .trim();
    const title = $(this)
      .children(".product__top")
      .children("header")
      .children("h3")
      .children("a")
      .text()
      .replace(/(\r\n|\n|\r)/gm, "")
      .trim();
    const description = $(this)
      .children(".product__top")
      .children(".product__abstract")
      .children("p")
      .text()
      .replace(/(\r\n|\n|\r)/gm, "")
      .trim();
      
    const image = $(this).find("img").html().trim()
    console.log(image);
    const par = $(this)
      .find(".product__addtocart")
      .children(".addtocart--loading")
      .attr("data-title");

    const prix_unitaire = 3.4;

    const article = {
      id: articles.length + 1,
      famille,
      title,
      description,
      image,
      par,
      prix_unitaire,
    };
    articles.push(article);
    fs.writeFile("./json/kaani.json", JSON.stringify(articles));
  });
};

for (let index = 1; index <= 36; index++) {
  fetchData(`${API_URL}?page=${index}`);
}



async function scrapeAndInsertData(){
  try{
      materials=[]
      for(let index=0; index <= 36; index++){
          var response = await axios.get(`https://french.alibaba.com/g/china-agricultural-machinery${index}.html`)
  
  
          var $ = cheerio.load(response.data);  //Parser la reponse html en utilisant cheerio
          // console.log(pretty($.html()));
          // console.log(pretty($.html()));
          // console.log($.html());
  
  
          $('.product-card').each((index, element) => {
              const material = {
                  nom: $(element).find('.product-title span').text(),
                  image_url: $(element).find('a img').attr('src'),
                  description: $(element).find('.product-title span:eq(1)').text(),
                  // categorie=; 
                  prix: $(element).find('.product-price .price-number').text()
              };
              materials.push(material)
              console.log(materials.length)
          });
          
          console.log(materials) 

      }
  }catch(e){
      console.log(e)
  }
}
scrapeAndInsertData();