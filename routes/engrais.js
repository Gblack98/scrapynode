import Router from "@koa/router";
import req from "../helpers/req.js";

const router = new Router({
  prefix: "/produits",
});

router.get("/", async (ctx) => {
  try {
    const query = "SELECT * FROM produits WHERE categorie = $1";
    const values = ['engrais'];
    const response = await req.EcritureLecture(query, values);
    await ctx.render("pages/engrais/index", { title: "PRODUITS", data: response });
  } catch (error) {
    ctx.body = error.message;
  }
});

// GET /data/:id - Récupérer une seule donnée par ID
router.get('/:id', async (ctx) => {
  const id = ctx.params.id;
  // Utilisez la fonction req.EcritureLecture pour exécuter la requête SELECT
  const query = 'SELECT * FROM produits WHERE id = $1';
  const values = [id];
  try {
    const data = await req.EcritureLecture(query, values);
    ctx.body = data;
  } catch (error) {
    ctx.body = error.message;
  }
});

// POST /data - Ajouter une nouvelle donnée
router.post('/produits', async (ctx) => {
  const newData = ctx.request.body;
  // Utilisez la fonction req.EcritureLecture pour exécuter la requête INSERT
  const query = 'INSERT INTO produits (title, prix, image_url) VALUES ($1, $2, $3) RETURNING *';
  const values = [newData.title, newData.prix, newData.image_url];
  try {
    const insertedData = await req.EcritureLecture(query, values);
    ctx.body = insertedData;
  } catch (error) {
    ctx.body = error.message;
  }
});

// PUT /data/:id - Mettre à jour une donnée existante par ID
router.put('/:id', async (ctx) => {
  const id = ctx.params.id;
  const updatedData = ctx.request.body;
  // Utilisez la fonction req.EcritureLecture pour exécuter la requête UPDATE
  const query = 'UPDATE produits SET title = $1, prix = $2, image_url = $3 WHERE id = $4 RETURNING *';
  const values = [updatedData.title, updatedData.prix, updatedData.image_url, id];
  try {
    const data = await req.EcritureLecture(query, values);
    ctx.body = data;
  } catch (error) {
    ctx.body = error.message;
  }
});

// DELETE /data/:id - Supprimer une donnée par ID
router.delete('/:id', async (ctx) => {
  const id = ctx.params.id;
  // Utilisez la fonction req.EcritureLecture pour exécuter la requête DELETE
  const query = 'DELETE FROM produits WHERE id = $1';
  const values = [id];
  try {
    await req.EcritureLecture(query, values);
    ctx.body = { message: 'Data deleted successfully.' };
  } catch (error) {
    ctx.body = error.message;
  }
});

export default router;
