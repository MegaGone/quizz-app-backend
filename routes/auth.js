const { Router, request } = require('express');
const { check } = require('express-validator');

// Controller
const controller = require('../controllers/auth');

// Middlewares
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login', 
[
    check('email', 'Email required').isEmail(),
    check('password', 'Password required').not().isEmpty(),
    validateFields
]
,controller.login)

module.exports = router;