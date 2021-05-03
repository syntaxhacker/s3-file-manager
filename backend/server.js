require("dotenv").config();

const express = require("express");
const app = express();
const dbroutes = require("./routes/dbroutes");
const s3routes = require("./routes/s3routes");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", s3routes);
app.use("/db", dbroutes);

//listen
app.listen(process.env.PORT || 9000);
console.log(` Server running at ${process.env.PORT} `);
