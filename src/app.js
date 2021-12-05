require("dotenv").config();

const mongooseLoader = require("./loader/mongoose-loader");
const compression = require("compression");
const cors = require("cors");
const express = require("express");

const questionRoutes = require("./routes/question-routes");
const {errorHandler} = require("./middleware");

const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("../openapi.json");

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
app.use("/", questionRoutes);
app.use("/", errorHandler);
mongooseLoader();

module.exports = app;
