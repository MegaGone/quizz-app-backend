const { Router } = require('express');
const { check } = require('express-validator');

// Helpers
const { validateRole, verifyUserById, validateSpaces, verifyQuizById } = require('../helpers')

// Middlewares
const { validateFields, validateJWT, haveRoles } = require('../middlewares')

// Controller
const controller = require('../controllers/quiz');

const router = Router();

router.get('/', 
[
  validateJWT,
  haveRoles('ADMIN_ROLE', 'USER_ROLE'),
  validateFields,
]
,controller.getQuizs);

router.post('/', 
[
  validateJWT,
  check('title', "Title required").not().isEmpty(),
  check('title', "Title must be at least 5 chars").isLength({ min: 5}),
  check('title').custom( validateSpaces ),
  check('description', "Description required").not().isEmpty(),
  check('description', "Description must be at least 10 chars").isLength({ min: 10 }),
  check('questions', "The quiz must be at least 5 questions").isArray({ min: 5}),
  check('questions.*.title', "Invalid title question").not().isEmpty(),
  check('questions.*.answers', 'The question must be at least 2 answers').isArray({ min:2 }),
  check('participants', "We need a participants").isArray({ min: 0 }),
  validateFields  
]
,controller.createQuiz);

router.get('/:id', 
[
  validateJWT,
  check('id', "Invalid ID").isMongoId(),
  check('id').custom( verifyQuizById ),
  haveRoles('ADMIN_ROLE', 'USER_ROLE'),
  validateFields
]
,controller.getQuiz);

// Get Quiz by User
router.post('/quizzes', 
[
  validateJWT,
  haveRoles('ADMIN_ROLE', 'USER_ROLE'),
  validateFields
]
,controller.getQuizByUser)

router.put('/:id', controller.updateQuiz);

router.delete('/:id', controller.deleteQuiz);

module.exports = router;