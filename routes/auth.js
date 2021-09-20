const { Router } = require('express');
const { check } = require('express-validator');

// Helpers
const { validateSpaces } = require('../helpers')

// Controller
const controller = require('../controllers/auth');

// Middlewares
const { validateFields, validateJWT } = require('../middlewares');

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

router.get('/renew', validateJWT, controller.renewToken)

module.exports = router;