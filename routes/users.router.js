const express = require('express');
const usersRouter = express.Router();
const { getUsers } = require('../mvc/controllers/users.controller.js');
const { handle405s } = require('../mvc/controllers/errors.controller.js')


usersRouter.route('/:username').get(getUsers).all(handle405s);

module.exports = usersRouter;
