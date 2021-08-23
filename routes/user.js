const { Router } = require('express');
const { check } = require('express-validator');

const Controller = require('../controllers/user');

// Helpers
const { validateEmail, verifyUserById, validateRole } = require('../helpers');

// Middlwares
const { validateFields, haveRoles, validateJWT } = require('../middlewares');

const router = Router();

router.get('/', Controller.getUsers);

router.post('/', 
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('email').custom( validateEmail ),
    check('password', 'Password must at least 6 characters').isLength({min: 6}),
    check('role').custom( validateRole ),
    validateFields
]
,Controller.createUser)

router.get('/:id', 
[
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom( verifyUserById ),
    validateFields
]
,Controller.getUser)

router.put('/:id', 
[
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(verifyUserById),
    validateFields
]
,Controller.updateUser)

router.delete('/:id', 
[
    validateJWT,
    haveRoles('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(verifyUserById),
    validateFields
]
,Controller.deleteUser)

router.delete('/', 
[
    validateJWT,
    haveRoles('ADMIN_ROLE'),
    validateFields
]
,Controller.purgeDeleteUsers)

module.exports = router;