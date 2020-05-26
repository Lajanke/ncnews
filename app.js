const express = require('express');
const app = express();
const apiRouter = require('./routes/api.router.js');
const { handle404s, handleErrors, handlePSQLErrors } = require('./mvc/controllers/errors.controller.js');
const cors = require('cors');

app.use(express.json());
app.use("/api", apiRouter);

app.use('/', handle404s);

app.use(handleErrors);
app.use(handlePSQLErrors);

app.use(cors());

module.exports = app;