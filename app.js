require("dotenv").config();
const express = require("express");
const app = express();

// Setup your Middleware and API Router here
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

app.use(bodyParser.json());
app.use(morgan('dev'));

// cors to allow test access to server
app.use(cors());
// app.get('/products/:id', function (req, res, next) {
//     res.json({msg: 'This is CORS-enabled for all origins!'})
//   })
  
//   app.listen(80, function () {
//     console.log('CORS-enabled web server listening on port 80')
//   })

// Import the API router
const apiRouter = require('./api');

// Have the server use your API router with prefix '/api'

app.use("/api", apiRouter);

app.use((req, res, next) => {
    res.status(404).json({ message: "Page not found" });
  });
  
app.use((err, req, res, next) => {
    console.error(err);
    res.status(401).send(err);
});
  

module.exports = app;
