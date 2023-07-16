import requests
from bs4 import BeautifulSoup
from tabulate import tabulate
import json
import pandas as pd

def clean_and_convert_to_float(string):
    # Supprimer les caractères non numériques
    cleaned_string = ''.join(filter(str.isdigit, string))

    # Insérer un point décimal à la position appropriée
    cleaned_string = cleaned_string[:-2] + '.' + cleaned_string[-2:]

    # Convertir en float
    float_value = float(cleaned_string)

    return float_value

def scrape_alibaba_pages(num_pages):
    base_url = "https://www.jardinerie-bergon.fr/374-engrais-bio?page={}"
    data = []
    for page in range(1, num_pages+1):
        url = base_url.format(page)
        response = requests.get(url)
        if response.ok:
            soup = BeautifulSoup(response.text, 'html.parser')
            titre = soup.select('h2.product-title a')
            prix = soup.select('div.product-price-and-shipping span.price')
            image_url = soup.select('a.product-thumbnail img')

            for i, j, k in zip(titre, prix, image_url):
                ttr = i.text.strip()
                prx = j.text
                prx=clean_and_convert_to_float(prx)
                img_link = k['src']
                data.append({"titre": ttr, "prix": prx, "image_url": img_link})
            df = pd.DataFrame(data)
            df.to_csv('JardinerieBergon.csv', index=False)  # Ajout des données au fichier CSV
            with open('JardinerieBergon.json', 'w', encoding='utf-8') as json_file:
                json.dump(data, json_file, ensure_ascii=False)
            print(df)
            print("Les nouvelles données ont été ajoutées aux fichiers JardinerieBergon.csv et JardinerieBergon.json avec succès.")

    
scrape_alibaba_pages(4)
