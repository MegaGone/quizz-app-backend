const { Router } = require('express');
const { check } = require('express-validator');

// Controller
const controller = require('../controllers/uploads');

// Middlewares
const { validateJWT, validateFields, validateFiles } = require('../middlewares');

const router = Router();

router.post('/', validateFiles, controller.uploadFile);

router.put('/:id',
    [
        validateJWT,
        validateFiles,
        check('id', 'User not valid').isMongoId(),
        validateFields
    ]
    , controller.updateImageCloudinary)

router.get('/:id',
    [
        validateJWT,
        check('id', 'User not valid').isMongoId(),
        validateFields
    ]
    , controller.showImage)

module.exports = router;