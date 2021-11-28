require("dotenv").config();

const MongooseLoader = require("./loader/MongooseLoader");
const compression = require("compression");
const cors = require("cors");
const express = require("express");

const questionRoutes = require("./routes/question-routes");
const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/", questionRoutes);
MongooseLoader();

module.exports = app;
