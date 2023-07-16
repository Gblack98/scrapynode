import Router from "@koa/router";
import { AdminMiddleware, authMiddleware } from "../middlewares/middlewares.js";

const router = new Router({
  prefix: "/",
});

router.get(
  "/",
  async (ctx) => await ctx.render("index", { title: "Page d'accueil" })
);

router.get(
  "dashboard",
  authMiddleware,
  AdminMiddleware,
  async (ctx) =>
    await ctx.render("pages/admin/dashboard", {
      title: "Bienvenue à la page d'administration",
    })
);

export default router;
