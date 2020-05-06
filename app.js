const express = require('express');
const app = express();
const apiRouter = require('./routes/api.router.js');
const { handle404s, handleErrors } = require('./mvc/controllers/errors.controller.js');

app.use(express.json());
app.use("/api", apiRouter);

app.use('/', handle404s);

app.use(handleErrors);

module.exports = app;