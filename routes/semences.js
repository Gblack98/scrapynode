import Router from "@koa/router";
import { ajouterSemence, modifierSemence, semences, supprimerSemence, uneSemence } from "../controllers/semences.js";

const router = new Router({
    prefix:'/semences'
})

router.get("/", semences)
router.post("/nouveau",ajouterSemence)
router.get("/:id", uneSemence)
router.put("/:id/edit",modifierSemence)
router.delete("/:id/delete",supprimerSemence)

export default router