import REQ from './helpers/index.js'
import fs from 'node:fs/promises'

const InsererSemence = async () => {
  const data = await fs.readFile("./json/productsAlibaba.json", "utf-8");
  for (const dta of JSON.parse(data)) {
    const { title, price, imageUrl} = dta;
    const req = "INSERT INTO engrais(titre, prix, image_url) VALUES($1, $2, $3)"
    const value = [title, price[0], imageUrl]
    REQ.EcritureLecture(req,value);
  }
  console.log("Data inserted successfully!");
};

InsererSemence()


