import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import router from './routes/main.js';
import serve from 'koa-static'
import logger from 'koa-logger'
import semenceRouter from './routes/semences.js'
import authRouter from './routes/authentication.js'
import matRouter from './routes/materiels.js'
import engraisRouter from './routes/engrais.js'
import render from 'koa-ejs'
import session from 'koa-session';
import 'dotenv/config'
import jwt from './helpers/jwt.js';
const app = new Koa();
app.keys = [process.env.SECRET]
app.use(async (ctx, next) => {
    // Variables globales à envoyer aux templates
    ctx.state.jwt = ctx.cookies.get("jwt")
    ctx.state.user = await jwt.verify(ctx.cookies.get("jwt"));
    await next();
  });
render(app, {
    root: "./views",
    layout: 'layout',
    viewExt: 'ejs',
    cache: false,
    debug: false
})
app.use(session(app));

app.use(serve('./public'))
app.use(logger())
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())
app.use(semenceRouter.routes()).use(semenceRouter.allowedMethods())
app.use(matRouter.routes()).use(matRouter.allowedMethods())
app.use(engraisRouter.routes()).use(engraisRouter.allowedMethods())
app.use(authRouter.routes()).use(authRouter.allowedMethods())

app.listen(3000);