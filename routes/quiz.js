const { Router } = require('express');
const { check } = require('express-validator');

// Helpers
const { validateRole, verifyUserById, validateSpaces } = require('../helpers')

// Middlewares
const { validateFields, validateJWT, haveRoles } = require('../middlewares')

// Controller
const controller = require('../controllers/quiz');

const router = Router();

router.get('/', controller.getQuizs);

router.post('/', 
[
  check('title', "Title required").not().isEmpty(),
  check('title', "Title must be at least 5 chars").isLength({ min: 5}),
  check('title').custom( validateSpaces ),
  check('description', "Description required").not().isEmpty(),
  check('description', "Description must be at least 10 chars").isLength({ min: 10 }),
  check('author', "Author required").not().isEmpty(),
  check("author", 'Invalid ID').isMongoId(),
  check('author').custom( verifyUserById ),
  validateFields  
]
,controller.createQuiz);

router.get('/:id', controller.getQuiz);

router.put('/:id', controller.updateQuiz);

router.delete('/:id', controller.deleteQuiz);

module.exports = router;