from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, Table
from fastapi import FastAPI
from sqlalchemy import MetaData
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import uvicorn



app = FastAPI()

meta = MetaData()

materials = Table(
    'materials', meta,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('nom', String(30)), 
    Column('description', String(255)),
    Column('prix', Integer),
    Column('image_url', String(255))
)

class Material(BaseModel):
    nom: str
    description: str
    prix: int
    image_url:str
    
pgDatabase = create_engine("postgresql://moranta21:Wizzle21#@localhost:5432/fastapidb")
    
meta.create_all(pgDatabase)
pgconnection = pgDatabase.connect()

@app.get('/')
async def greetings():
    return{'message': 'Hello, World'}

agricultural_materials=[]

@app.post('/insert')
async def add_materials():
    nombre = 5
    for index in range(nombre):
        # print(index)
        url = f"https://www.terre-net-occasions.fr/tracteur/c1?page={index+1}"
        driver = webdriver.Chrome()

        driver.get(url)

        wait = WebDriverWait(driver, 10)  # Adjust the timeout value as needed

        agree_button = driver.find_element(By.CLASS_NAME, "highlight-button").click()
        names = wait.until(EC.visibility_of_all_elements_located((By.CLASS_NAME, 'ad-list__link')))
        descriptions = wait.until(EC.visibility_of_all_elements_located((By.CLASS_NAME, 'ad-list__mat')))
        prix = wait.until(EC.visibility_of_all_elements_located((By.CLASS_NAME, 'ad-list__prix')))
        images = driver.find_elements(By.CLASS_NAME, 'img-fluid')
        
        names_table = [name.text for name in names]
        descriptions_table = [description.text for description in descriptions]
        prix_table = [prix.text for prix in prix]
        images_table = [image.get_attribute('src') for image in images]
        for index in range(len(images_table)):
            material={}
            material['nom']=names_table[index]
            material['description']=descriptions_table[index]
            prix_str = re.sub(r'[^0-9]', '', prix_table[index])  # Remove non-numeric characters
            material['prix'] = int(prix_str) if prix_str else 0 
            material['image_url']=images_table[index]
            agricultural_materials.append(material)
            
        # pf = pd.DataFrame(materials, columns=['nom', 'description', 'prix', 'image_url'])
        # print(pf)
        driver.quit()
    for i in range(len(agricultural_materials)):
        pgconnection.execute(materials.insert().values(
            nom = agricultural_materials[i]['nom'],
            description = agricultural_materials[i]['description'],
            prix = agricultural_materials[i]['prix'],
            image_url = agricultural_materials[i]['image_url'],
        ))
    # pgDatabase.commit()
    result = pgconnection.execute(materials.select()).fetchall()
    materials_list = [dict(row._asdict()) for row in result]
    return materials_list

@app.get('/materials/{id}')
async def get_oneMaterial(id:int):
    result=pgconnection.execute(materials.select().where(materials.c.id==id))
    # result = pgconnection.execute(materials.select()).fetchall()
    materials_list=[dict(row._asdict()) for row in result] 
    return materials_list

@app.get('/materials')
async def get_materials():
    result = pgconnection.execute(materials.select()).fetchall()
    materials_list=[dict(row._asdict()) for row in result] 
    return materials_list


@app.put("/update/{id}")
async def update_materials(id: int, material: Material):
    pgconnection.execute(materials.update().values(
        nom = material.nom,
        prenom = material.description,
        age = material.prix
        ).where(materials.c.id ==id))
    pgconnection.commit()
    result = pgconnection.execute(materials.select()).fetchall()
    apprenants_list = [dict(row._asdict()) for row in result]
    return apprenants_list

@app.get('/delete/{id}')
async def delete_materials(id: int):
    pgconnection.execute(materials.delete().where(materials.c.id==id))
    pgconnection.commit()
    result = pgconnection.execute(materials.select()).fetchall()
    materials_list = [dict(row._asdict()) for row in result]
    return materials_list

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
    
    

