const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

app.use("/api", require("./routes"));

module.exports = app;
