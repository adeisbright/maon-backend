require("dotenv").config();

const mongooseLoader = require("./loader/mongoose-loader");
const compression = require("compression");
const cors = require("cors");
const express = require("express");
const readMessage = require("./services/read-from-exchange");

const questionRoutes = require("./routes/question-routes");
const { errorHandler } = require("./middleware");

const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("../openapi.json");

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
app.use("/", questionRoutes);
app.use("/", errorHandler);
mongooseLoader();

const logMessage = async (message) => {
    const { email, name } = JSON.parse(await message.content.toString());
    console.log(`Hello ${name} , check ${email} for your ID`);
};

//readMessage("notification4", "fanout", "food", "tester4", logMessage);
module.exports = app;
