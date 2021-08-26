const { Router } = require('express');
const { check } = require('express-validator');

// Helpers
const { validateRole, verifyUserById, validateSpaces, verifyQuizById, verifyCodeToQuiz } = require('../helpers')

// Middlewares
const { validateFields, validateJWT, haveRoles, validatePartipant } = require('../middlewares')

// Controller
const controller = require('../controllers/quiz');

const router = Router();

// GET ALL QUIZ - ADMIN_ROLE
router.get('/', 
[
  validateJWT,
  haveRoles('ADMIN_ROLE'),
  validateFields,
]
,controller.getQuizs);

// CREATE QUIZ
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

// JOIN TO THE QUIZ 
router.post('/join', 
[
  validateJWT,
  check('code', 'Code required').not().isEmpty(),
  check('code', 'The code must be at least 7 chars').isLength({ min: 7 }),
  check('code').custom( verifyCodeToQuiz ),
  validateFields,
  validatePartipant,
  validateFields
]
,controller.joinToQuiz)

// GET QUIZ BY ID
router.get('/:id', 
[
  validateJWT,
  check('id', "Invalid ID").isMongoId(),
  check('id').custom( verifyQuizById ),
  haveRoles('ADMIN_ROLE', 'USER_ROLE'),
  validateFields
]
,controller.getQuiz);

// GET QUIZ BY USER
router.post('/quizzes', 
[
  validateJWT,
  haveRoles('ADMIN_ROLE', 'USER_ROLE'),
  validateFields
]
,controller.getQuizByUser)

// UPDATE QUIZ
router.put('/:id', controller.updateQuiz);

// DELETE QUIZ
router.delete('/:id', controller.deleteQuiz);

module.exports = router;