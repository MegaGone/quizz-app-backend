const { Router } = require('express');
const { check } = require('express-validator');

const Controller = require('../controllers/user');

// Helpers
const { validateEmail } = require('../helpers/db-validators');

// Middlwares
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.get('/', Controller.getUsers);

router.post('/', 
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('email').custom( validateEmail ),
    check('password', 'Password must at least 6 characters').isLength({min: 6}),
    check('role', 'Invalid role').not().isEmpty(),
    validateFields
]
,Controller.createUser)

router.get('/:id', Controller.getUser)

router.put('/:id', Controller.updateUser)

router.delete('/:id', Controller.deleteUser)

module.exports = router;