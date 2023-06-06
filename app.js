require("dotenv").config()
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(morgan('dev'));

// Import the API router
const apiRouter = require('./api');

// Have the server use your API router with prefix '/api'

app.use("/api", apiRouter);

module.exports = app;
