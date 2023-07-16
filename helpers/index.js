import pkg from "pg";

const pool = new pkg.Pool({
  user: "mahmoud",
  host: "localhost",
  database: "agridata",
  password: "passer",
  port: 5432,
});
const client = await pool.connect();
export default {
  EcritureLecture: async (sql,value) => {
    return await client.query(sql,value);
  },
};
