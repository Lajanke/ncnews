const express = require('express');
const usersRouter = express.Router();
const { getUsers } = require('../mvc/controllers/users.controller.js')

usersRouter.route('/:username').get(getUsers);

module.exports = usersRouter;

/*
a user object which should have the following properties:
username
avatar_url
name
*/