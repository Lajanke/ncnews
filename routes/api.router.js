const express = require('express');
const apiRouter = express.Router();

apiRouter.route('/').get((req, res, next) => {
    console.log('in api router')
})

module.exports = apiRouter;