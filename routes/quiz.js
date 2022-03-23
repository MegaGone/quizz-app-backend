const { Router } = require('express');
const { check } = require('express-validator');

// Helpers
const { validateRole, verifyUserById, validateSpaces, verifyQuizById, verifyCodeToQuiz } = require('../helpers')

// Middlewares
const { validateFields, validateJWT, haveRoles, validatePartipant, validateJwtToRenewToken, verifyParticipant } = require('../middlewares')

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


router.delete('/remove/:quizId/:user', 
[
  validateJWT,
  check('quizId', 'QuizId required').not().isEmpty(), 
  check('quizId', 'Invalid quizId').isMongoId(),
  check('quizId').custom(verifyQuizById),
  check('user', 'userId required').not().isEmpty(),
  check('user', 'Invalid userId').isMongoId(),
  verifyParticipant,
  validateFields
]
,controller.removeParticipant)

// Get Quizzes By User
router.get('/quizzes', validateJwtToRenewToken, controller.getQuizzesByUser)

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

// UPDATE QUIZ
router.put('/:id', 
[
  check('id', 'Invalid ID').not().isEmpty(),
  check('id').custom( verifyQuizById ),
  check('title', "Title required").not().isEmpty(),
  check('title', "Title must be at least 5 chars").isLength({ min: 5}),
  check('title').custom( validateSpaces ),
  check('description', "Description required").not().isEmpty(),
  check('description', "Description must be at least 10 chars").isLength({ min: 10 }),
  check('questions', "The quiz must be at least 5 questions").isArray({ min: 5}),
  check('questions.*.title', "Invalid title question").not().isEmpty(),
  check('questions.*.answers', 'The question must be at least 2 answers').isArray({ min:2 }),
  // check('participants', "Participants must be at least 1 participants").isArray({ min: 1 }),
  // check('participants.*.name', "Name of participant required").not().isEmpty(),
  // check('participants.*.name').custom( validateSpaces ),
  // check('participants.*.userId', 'User ID required').not().isEmpty(),
  // check('participants.*.joinIn', 'Date of join required').not().isEmpty(),
  validateFields
]
,controller.updateQuiz);

// DELETE QUIZ
router.delete('/:id', 
[
  check('id', 'Invalid ID').isMongoId(),
  check('id').custom( verifyQuizById ),
  validateFields
]
,controller.deleteQuiz);

router.get('/code/:code', 
[
  validateJWT,
  check('code', 'Code Required').not().isEmpty(),
  check('code', 'Invalid code',).isLength({ min: 7 }),
  check('code').custom( verifyCodeToQuiz ),
  haveRoles('ADMIN_ROLE', 'USER_ROLE'),
  validateFields
]
,controller.getQuizBycode)

/***** QUESIONS *****/ 

router.post('/question/:id', 
[
  validateJWT,
  check('id', 'Invalid quizID').isMongoId(),
  check('title', 'Title required').not().isEmpty(),
  check('answers', 'The question must be at least 2 answers').isArray({ min: 2 }),
  validateFields
]
,controller.addQuestion)


router.put('/question/:id/:questionId', 
[
  validateJWT,
  check('id', 'Invalid Quiz').not().isEmpty(),
  check('id', 'Invalid quizID').isMongoId(),
  check('questionId', 'Invalid Question').not().isEmpty(),
  check('questionId', 'Invalid quizID').isMongoId(),
  check('title', 'Title required').not().isEmpty(),
  check('answers', 'The question must be at least 2 answers').isArray({ min: 2 }),
  validateFields
]
,controller.updateQuestion)

router.delete('/question/:quizID/:questionID', 
[
  validateJWT,
  check('quizID', 'Invalid ID').isMongoId(),
  check('quizID').custom( verifyQuizById ),
  check('questionID', 'Invalid ID').isMongoId(),
  haveRoles('ADMIN_ROLE', 'USER_ROLE'),
  validateFields
]
,controller.deleteQuestion)

module.exports = router;