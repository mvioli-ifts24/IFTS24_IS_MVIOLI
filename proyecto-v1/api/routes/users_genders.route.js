const express = require('express')
const controller = require('#controllers/users_genders.controller.js')

const usersGendersRouteGroup = express.Router()

usersGendersRouteGroup.get('/', controller.index)

module.exports = usersGendersRouteGroup