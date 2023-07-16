import Router from "@koa/router";
import pkg from "pg";

const pool = new pkg.Pool({
  user: "mahmoud",
  host: "localhost",
  database: "auto-reserv",
  password: "passer",
  port: 5432,
});
const client = await pool.connect();
const router = new Router({
  prefix: "/vehicule",
});

router.get("/", async (ctx) => {
  try {
    const vehicules = await client.query("SELECT * FROM vehicule");
    ctx.body = vehicules.rows;
    ctx.res.statusCode = 201;
  } catch (error) {
    ctx.body = {
      error: error.message,
    };
    ctx.res.statusCode = 404;
  }
});

router.post("/new", async (ctx) => {
  try {
    const body = await ctx.request.body;
    ctx.body = {
        vehicule: body,
        message: "Véhicule ajouté avec succès",
    }
    ctx.res.statusCode = 200;
  } catch (error) {
    
  }
});

router.delete("/:id/delete", async(ctx)=>{
  const params = await ctx.params.id
  console.log(params)
})

export default router;
