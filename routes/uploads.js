const { Router  } = require('express');
const { check } = require('express-validator');

// Controller
const controller = require('../controllers/uploads');

// Middlewares
const { validateJWT, validateFields } = require('../middlewares');

const router = Router();

router.post('/', controller.uploadFile);

router.put('/:id', 
[
    validateJWT,
    check('id', 'User not valid').isMongoId(),
    validateFields
], controller.updateImage)

module.exports = router;