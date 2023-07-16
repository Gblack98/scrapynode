export const authMiddleware = async (ctx, next) => {
    // Vérifier si l'utilisateur est authentifié
    if (!ctx.cookies.get("jwt")) {
      // Gérer l'erreur d'authentification ou rediriger vers une page de connexion
      ctx.status = 401; // Non autorisé
      ctx.redirect("/users/connexion")
      return;
    }
  
    // Si l'utilisateur est authentifié, passer au middleware suivant
    await next();
  };

  export const ConnectedMiddleware = async (ctx, next) => {
    // Vérifier si l'utilisateur est authentifié
    if (ctx.cookies.get("jwt")) {
      // Gérer l'erreur d'authentification ou rediriger vers une page de connexion
      ctx.status = 200; // Non autorisé
      ctx.redirect("/")
      return;
    }
  
    // Si l'utilisateur est authentifié, passer au middleware suivant
    await next();
  };

  export const AdminMiddleware = async(ctx, next) => {
    if(ctx.state.user?.role !== 'admin'){
      ctx.redirect("/");
      return;
    }
    await next();
  }