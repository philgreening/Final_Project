const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

// Swagger dependencies
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerJson = require("../src/swagger.json");

const swaggerSpecs = swaggerJsdoc(swaggerJson);

const hostname = "127.0.0.1";
const port = 8000;

// Pino logger
const logger = require('./logger');

//Routes
const itemRoute = require("./routes/items");
const userRoute = require("./routes/users");
const transactionRoute = require("./routes/transactions");
const resRoute = require("./routes/reservations");

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API endpoints
app.use("/api/v1/items", itemRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/transactions", transactionRoute);
app.use("/api/v1/reservations", resRoute);
app.use("/api/v1/documentation", swaggerUi.serve);
app.use("/api/v1/documentation", swaggerUi.setup(swaggerSpecs));

const server = app.listen(port, hostname, () =>
  logger.info(`Server running at http://${hostname}:${port}/`)
);

module.exports = { app, server };
