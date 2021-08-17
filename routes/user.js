const { Router } = require('express');
const { check } = require('express-validator');

const Controller = require('../controllers/user');

// TODO: Crear Middlewares y Helpers

const router = Router();

router.get('/', Controller.getUsers);

router.post('/', Controller.createUser)

router.get('/:id', Controller.getUser)

router.put('/:id', Controller.updateUser)

router.delete('/:id', Controller.deleteUser)

module.exports = router;