const Pool = require("pg").Pool;
exports.pool = new Pool({
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DBNAME,
	password: process.env.PG_PASS,
	port: process.env.PG_PORT,
});
