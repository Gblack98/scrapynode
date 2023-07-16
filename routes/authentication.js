import Router from'@koa/router'
import { connexion, deconnexion, inscription, users } from '../controllers/users.js';
import { ConnectedMiddleware, authMiddleware } from '../middlewares/middlewares.js';


const router = new Router({
    prefix: '/users'
})

router.get('/',authMiddleware, users)
router.get('/inscription',ConnectedMiddleware,ctx => ctx.render("/pages/auth/inscription",{title: "Inscription",connexion: false}))
router.get('/connexion',ConnectedMiddleware,ctx => ctx.render("/pages/auth/connexion",{title: "Connexion",connexion: true,passwordError:''}))
router.post('/inscription', inscription)
router.post('/connexion', connexion)
router.get('/deconnexion', deconnexion)

export default router;