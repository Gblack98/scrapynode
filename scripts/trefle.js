import fetch from "node-fetch";
import fs from 'fs/promises'
const plants = [];
for (let index = 0; index < 100; index++) {
  (async () => {
    const response = await fetch(
      `https://trefle.io/api/v1/plants?token=r4ufW9fZlFRUawn33uUeR3UiJMvHHJwt_5gJ5B0czrY&page=${index}`
    );
    const { data } = await response.json();
    // console.log(data);
    for (let d=0; d < data?.length; d++) {
      delete data[d].synonyms
      plants.push(data[d]);
      await fs.writeFile("./json/trefleplants.json",JSON.stringify(plants))
    }
  })();
}

