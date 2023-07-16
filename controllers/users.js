// require("dotenv").config();
// const express = require("express")
// const router = express.Router()
// const { User } = require('../models')
// const bcrypt = require("bcryptjs");
import bcrypt from "bcrypt";
// const jwt = require('jsonwebtoken')
// const isAuthenticated = require('../middlewares/authenticated')
// const isAdmin = require('../middlewares/is-admin');
// const { generateToken, generateError } = require('../helpers')

import REQ from "../helpers/index.js";
import jwt from "../helpers/jwt.js";
import {ValidateLogin} from "../helpers/validator.js"

export const users = async (ctx) => {
  console.log("cookie",ctx.cookies.get("jwt"))
  try {
    const users = await REQ.EcritureLecture("SELECT * FROM utilisateurs");
    // Masquer le contenu des mots de passe
    for (const user of users.rows) {
      user.password = null;
    }
    // Renvoyer la reponse
    ctx.body = users.rows;
  } catch (error) {
    ctx.body = error;
  }
};


/**Ici l'inscription de l'utilisateur */
export const inscription = async (ctx) => {
  try {
    const { prenom, nom, password, email } = await ctx.request.body;
    const sql =
      "INSERT INTO utilisateurs (prenom,nom,email,password,role) VALUES ($1,$2,$3,$4,$5) RETURNING id";

    const result = await REQ.EcritureLecture(sql, [
      prenom,
      nom,
      email,
      await jwt.crypt(password),
      "visiteur",
    ]);
    const insertedId = await result.rows[0].id;
    const jwtKey = jwt.token({
      id: insertedId,
      email,
      role: "éditeur",
    });

    ctx.cookies.set("jwt", jwtKey);
    ctx.body = {
      jwt: jwtKey,
    };
    ctx.redirect("/dashboard");
    // });
  } catch (error) {
    ctx.body = error;
  }
};

/**Ici la connexion de l'utilisateur */
export const connexion = async (ctx) => {
  const {error, value} =  ValidateLogin(await ctx.request.body)
  if(error){
    console.log(error.details[0].message);
    ctx.redirect("/users/connexion");
  }
  try {
    const { email, password } = await ctx.request.body;
    const resp = await REQ.EcritureLecture(
      "SELECT * FROM utilisateurs WHERE email = $1",
      [email]
    );
    const user = await resp.rows[0];
    /**Verifier si l'utilisateur existe */
    if (resp.rows.length > 0) {
      if (jwt.decrypt(password, user.password)) {
        const jwtKey = jwt.token({
          id: user.id,
          email: user.email,
          role: user.role,
        });
    
        ctx.cookies.set("jwt", jwtKey);
        ctx.body = {
          jwt: jwtKey,
        };
        ctx.redirect("/dashboard");
      } else {
        await ctx.render('pages/auth/connexion',{passwordError: "Mot de passe incorrect",connexion:true,title:"Mot de passe incorrect"})
        ctx.res.statusCode = 404;

      }
    } else {
      ctx.body = {
        error: "Cet utilisateur n'existe pas",
      };
      ctx.res.statusCode = 404;
    }

    // const connected = bcrypt.compareSync(req.body.password, user.password);
    /**Générer un token */
    /**Autoriser la connexion complète */
  } catch (error) {
    console.log(error);
  }
};

export const deconnexion = (ctx)=>{
  ctx.cookies.set("jwt",null)
  ctx.body = {
    message: "A revoir"
  }
  ctx.redirect("/users/connexion")
}

// /**Ici l'affichage d'un utilisateur */

// exports.user = router.get("/users/:id", async (req, res, next) => {
//   const user = await User.findOne({
//     where: {
//       id: req.params.id,
//     },
//   });
//   user
//     ? res.status(200).json(user)
//     : res.status(404).json({ erreur: "Ressource non existant" });
// });

// /**Ici la modification d'un utilisateur */

// exports.EditUser = router.put("/users/:id/edit", async (req, res, next) => {
//   const { nom, password, email } = req.body;
//   const user = await User.findOne({ where: { id: req.params.id } });

//   try {
//     user
//       .update({
//         nom: nom,
//         email: email,
//         password: await bcrypt.hashSync(password, 10),
//       })
//       .then((user) => res.status(200).json(user))
//       .catch((err) => {
//         res.status(404).json(err);
//       });
//   } catch (error) {
//     console.log("Erreur", error);
//   }
// });

// /**Ici la suppression d'un utilisateur */
// exports.DeleteUser = router.delete(
//   "/users/:id/delete",
//   async (req, res, next) => {
//     try {
//       const user = await User.destroy({ where: { id: req.params.id } });
//       user === 1
//         ? res.status(200).json({ msg: "Utilisateur supprimé avec succès" })
//         : res.status(404).json({ erreur: "Utilisateur n'existe pas" });
//     } catch (error) {}
//   }
// );
