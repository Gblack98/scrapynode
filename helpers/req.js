// helpers/req.js

import db from 'pg-promise';

const req = {
  async EcritureLecture(query, values = []) {
    try {
      const data = await db.any(query, values);
      return data;
    } catch (error) {
      throw new Error(`Erreur lors de l'exécution de la requête : ${error.message}`);
    }
  },

};

export default req;
