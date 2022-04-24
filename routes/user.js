const { Router } = require('express');
const { check } = require('express-validator');

const Controller = require('../controllers/user');

// Helpers
const { validateEmail, verifyUserById, validateRole, validateSpaces } = require('../helpers');

// Middlwares
const { validateFields, haveRoles, validateJWT } = require('../middlewares');

const router = Router();

router.get('/', 
[
    validateJWT,
    haveRoles('ADMIN_ROLE'),
    validateFields
]
,Controller.getUsers);

router.post('/', 
[
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('name').custom( validateSpaces ),
    check('email', 'Invalid email').isEmail(),
    check('email').custom( validateEmail ),
    check('password', 'Password must at least 6 characters').isLength({min: 6}),
    check('password').custom( validateSpaces ),
    check('role').custom( validateRole ),
    validateFields
]
,Controller.createUser)

router.get('/:id', 
[
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom( verifyUserById ),
    validateFields
]
,Controller.getUser)

router.put('/:id', 
[
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(verifyUserById),
    validateFields
]
,Controller.updateUserv2)

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