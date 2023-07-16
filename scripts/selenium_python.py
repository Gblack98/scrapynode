from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import json
# import pandas as pd

# options = Options()
# options.add_argument('--headless')
nombre = 5
for index in range(nombre):
    # print(index)
    url = f"https://www.terre-net-occasions.fr/tracteur/c1?page={index+1}"
    # url = "https://www.terre-net-occasions.fr/tracteur/c1"
    # driver = webdriver.Chrome(options = options)
    driver = webdriver.Chrome()

    driver.get(url)

    wait = WebDriverWait(driver, 10)  # Adjust the timeout value as needed

    agree_button = driver.find_element(By.CLASS_NAME, "highlight-button").click()
    names = wait.until(EC.visibility_of_all_elements_located((By.CLASS_NAME, 'ad-list__link')))
    descriptions = wait.until(EC.visibility_of_all_elements_located((By.CLASS_NAME, 'ad-list__mat')))
    prix = wait.until(EC.visibility_of_all_elements_located((By.CLASS_NAME, 'ad-list__prix')))
    images = driver.find_elements(By.CLASS_NAME, 'img-fluid')
    # print(len(names))
    # print(len(descriptions))
    # print(len(prix))
    # print(len(images))
    names_table = [name.text for name in names]
    descriptions_table = [description.text for description in descriptions]
    prix_table = [prix.text for prix in prix]
    images_table = [image.get_attribute('src') for image in images]
    materials=[]
    for index in range(len(images_table)):
        material={}
        material['nom']=names_table[index]
        material['description']=descriptions_table[index]
        material['prix']=prix_table[index].strip().replace("HT", "").strip().replace("€", "").replace(" ", "")
        if material['prix'] is None  or material['prix']=='--NC--':
            material['prix']=0
            # pass
        else:
            material['prix'] = int(material['prix'])
        material['image_url']=images_table[index]
        materials.append(material)
        with open("json/materiels.json", "w") as fichier:
            json.dump(materials, fichier)
        
    print(materials)
        
    # pf = pd.DataFrame(materials, columns=['nom', 'description', 'prix', 'image_url'])
    # print(pf)
    driver.quit()
