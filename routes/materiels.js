import Router from "@koa/router";
import REQ from "../helpers/index.js"
// import pkg from "pg";

// const pool = new pkg.Pool({
//   user: "mahmoud",
//   host: "localhost",
//   database: "auto-reserv",
//   password: "passer",
//   port: 5432,
// });
// const client = await pool.connect();
// const router = new Router({
//   prefix: "/vehicule",
// });

// router.get("/", async (ctx) => {
//   try {
//     const vehicules = await client.query("SELECT * FROM vehicule");
//     ctx.body = vehicules.rows;
//     ctx.res.statusCode = 201;
//   } catch (error) {
//     ctx.body = {
//       error: error.message,
//     };
//     ctx.res.statusCode = 404;
//   }
// });

// router.post("/new", async (ctx) => {
//   try {
//     const body = await ctx.request.body;
//     ctx.body = {
//         vehicule: body,
//         message: "Véhicule ajouté avec succès",
//     }
//     ctx.res.statusCode = 200;
//   } catch (error) {
    
//   }
// });

const router = new Router({
  prefix: "/materiels"
})

//request to get all agricultural materials 

router.get('/', async(ctx) => { 
  try{
    const response = await REQ.EcritureLecture("SELECT * FROM materiels")
    const responseData = response.rows;
    ctx.body = responseData
    await ctx.render('pages/materiels/index',{title:"MATERIELS",data: responseData})
  }catch(error){
    console.log(error)
  }
})

//request to insert an agricultural material

router.get('/new/:id', async(ctx) => { 
  try{
    const {id} = ctx.params
    const response = await axios.get(`http://127.0.0.1/materials/${id}`);
    const responseData = response.data;
    console.log(responseData)
    ctx.body = responseData
  }catch(error){
    console.log(error)
    ctx.body = { error: 'An error occurred' };
  }
})

//request to update an agricultural materials

router.post('/:id', async(ctx) => { 
  try{
    const {id} = ctx.params
    const response = await axios.put(`http://127.0.0.1/update/${id}`);
    const responseData = response.data;
    console.log(responseData)
    ctx.body = responseData
  }catch(error){
    console.log(error)
    ctx.body = { error: 'An error occurred' };
  }
})

//request  to delete an agricultural material

router.delete('/:id', async(ctx) => {
  try{
    const{id} = ctx.params;
    const response = await axios.delete(`http://127.0.0.1/delete/${id}`);
    const responseData = response.data;
    console.log(responseData);
    ctx.body = responseData;

  }catch(error){
    console.log(error)
    ctx.body = {error: "There is an error"}

  }
})

//request  to delete an agricultural material

router.get('/:id', async(ctx) => {
  try{
    const{id} = ctx.params;
    const response = await axios.delete(`http://127.0.0.1/materials/${id}`);
    const responseData = response.data;
    console.log(responseData);
    ctx.body = responseData;

  }catch(error){
    console.log(error)
    ctx.body = {error: "There is an error"}

  }
})



export default router;
