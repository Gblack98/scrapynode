import REQ from "../helpers/index.js";
// LISTER TOUS LES SEMENCES
export const semences = async (ctx) => {
    try {
        const resp = await REQ.EcritureLecture("SELECT * FROM semances")
        ctx.body = resp.rows;
        await ctx.render('pages/semences/index',{title:"SEMENCES",data: resp.rows})
    } catch (error) {
        ctx.body = error;
    }
   
};

// LISTER UNE SEMENCE
export const uneSemence = async (ctx) => {
    try {
        const resp = await REQ.EcritureLecture("SELECT * FROM semances WHERE id = $1",[ctx.params.id]);
        if(resp.rowCount !== 1){
            ctx.body= {
                erreur: "Cet article n'existe pas"
            };
        }
        ctx.body = resp.rows[0];
    } catch (error) {
        ctx.body = error;
    }
   
};

// AJOUTER UNE SEMENCE

export const ajouterSemence = async(ctx) => {
    try {
        const { famille, title, description, image } = ctx.request.body
        // console.log(ctx.request.body)
        const param1 = "INSERT INTO semances(famille, title, description, url_image) VALUES($1, $2, $3, $4)";
        const param2 = [famille, title, description, image]
        const resp = await REQ.EcritureLecture(param1,param2)
        if(resp.rowCount === 1){
            ctx.body = {
                message: "Semence ajoutée avec succées"
            };
        } else{
            ctx.body = {
                erreur: "Cet article n'est pas ajouté'"
            };
            ctx.res.statusCode = 404;
        }
        
    } catch (error) {
        ctx.body = error;
    }
};

// MODIFIER UNE SEMENCE

export const modifierSemence = async(ctx)=>{
    try {
        const { famille, title, description, image } = ctx.request.body;
        const req = "UPDATE semances SET famille = $1 , title = $2, description = $3,url_image = $4 WHERE id = $5";
        const values = [famille, title, description, image, ctx.params.id];
        const resp = await REQ.EcritureLecture(req,values);
        if(resp.rowCount === 1){
            ctx.body = {
                message: "Semence modifiée avec succès"
            };
        } else{
            ctx.body = {
                erreur: "Cet article n'existe pas"
            };
            ctx.res.statusCode = 404;
        }
        
    } catch (error) {
        ctx.body = error;
    }
  };

// SUPPRIMER UNE SEMENCE

export const supprimerSemence = async(ctx) =>{
    await REQ.EcritureLecture("DELETE FROM semances WHERE id=$1",[ctx.params.id]);
    ctx.body = {
        message: "Semence supprimée avec succès"
    };
};
