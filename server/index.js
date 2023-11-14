const dontenv = require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const router = require("./router");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyparser.urlencoded({extended: true}))
    .use(bodyparser.json())
    .use(cors())
    .use(router)

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})