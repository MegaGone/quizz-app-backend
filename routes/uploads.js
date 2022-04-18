const { Router  } = require('express');
const { check } = require('express-validator');

// Controller
const controller = require('../controllers/uploads');

// Middlewares
const { validateJWT, validateFields } = require('../middlewares');

const router = Router();

router.post('/', controller.uploadFile);

module.exports = router;