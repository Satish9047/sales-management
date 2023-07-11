const express = require("express");
const app = express();
const db = require("mysql");
const router = require("./router/router.js")
const cors = require("cors");
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const PORT=5000;

app.use("/", router);

app.listen(PORT, ()=>{
    console.log(`The server is running in port: ${PORT}`);
})

