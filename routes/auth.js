const { Router } = require('express');
const { check } = require('express-validator');

// Helpers
const { validateSpaces } = require('../helpers')

// Controller
const controller = require('../controllers/auth');

// Middlewares
const { validateFields, validateJwtToRenewToken, validateJWT, validateCurrentPassword } = require('../middlewares');

const router = Router();

router.post('/login', 
[
    check('email', 'Email required').isEmail(),
    check('email').custom( validateSpaces ),
    check('password', 'Password required').not().isEmpty(),
    check('password').custom( validateSpaces ),
    validateFields
]
,controller.login)

router.post('/google', 
[
    check('token', 'Token is required').not().isEmpty(),
    validateFields
]
,controller.googleSignIn)

router.get('/renew', validateJwtToRenewToken, controller.renewToken)

router.get('/session', validateJWT, controller.getSession)

router.post('/password', 
[
    validateJWT,
    check('currentPassword',    'Current Password Unexpected').not().isEmpty(),
    check('newPassword',        'New Password Unexpected').not().isEmpty(),
    check('currentPassword',    'Password must be at least 6 characters').isLength({min: 6}),
    check('newPassword',        'Password must be at least 6 characters').isLength({min: 6}),
    validateCurrentPassword,
    validateFields
]
, controller.changePassword)

module.exports = router;