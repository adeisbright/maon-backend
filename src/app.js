require("dotenv").config();

const MongooseLoader = require("./loader/MongooseLoader");
const compression = require("compression");
const cors = require("cors");

const express = require("express");

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

MongooseLoader();

module.exports = app;
