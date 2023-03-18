const express = require("express");
const cors = require("cors");
// const multer = require('multer');
// const sharp = require('sharp');
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');

// const db = require('./config');

const app = express();
const hostname = "127.0.0.1";
const port = 8000;

// Set up multer to handle file uploads
// const upload = multer({ dest: "uploads/" });

const bodyParser = require("body-parser");
// const authenticate = require('./middleware/middlewareAuth');
// const upload = require('./middleware/middlewareFile');

const itemRoute = require("./routes/items");
const userRoute = require("./routes/users");
const transactionRoute = require("./routes/transactions");
const resRoute = require("./routes/reservations");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/v1/items", itemRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/transactions", transactionRoute);
app.use("/api/v1/reservations", resRoute);

const server = app.listen(port, hostname, () =>
  console.log(`Server running at http://${hostname}:${port}/`)
);

module.exports = { app, server};
