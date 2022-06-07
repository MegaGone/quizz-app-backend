const { Router } = require('express');
const { check } = require('express-validator');

const controller = require('../controllers/stats');

const { verifyQuizById } = require('../helpers');

const { validateFields, validatePlayer, validateJWT, verifyQuizByUser, verifyParticipant, validateJWTGuest } = require('../middlewares');

const router = Router();

/*################### CREATE STAT ###################*/
router.post('/', 
[
    check('quizId', "Quiz Id not valid").isMongoId(),
    check('quizId').custom(verifyQuizById),
    check('playerId'            , "Quiz Id not valid").not().isEmpty(),
    validatePlayer,
    check('playerName'          , 'Player name required').not().isEmpty(),
    check('correctAnswers'      , 'Correct answers required').not().isEmpty(),
    check('incorrectAnswers'    , 'Incorrect answers required').not().isEmpty(),
    check('joinIn'              , 'Date of joinIn required').not().isEmpty(),
    check('questions'           , "The quiz must be at least 5 questions").isArray({ min: 5}),
    check('questions.*.questionId', 'questionId not valid').isMongoId(),
    check('questions.*.selectedIndex' , 'Answer selected required').not().isEmpty(),
    check('questions.*.time' ,  'Response time required').not().isEmpty(),
    validateFields
],controller.createStats)

/*################### GET STATS GUEST PLAYER ###################*/
router.get('/guest', 
[
    validateJWTGuest,
    validateFields
]
,controller.getUserStats)

/*################### GET STATS BY QUIZ ###################*/
router.get('/:id', 
[
    validateJWT,
    check('id', 'Id not valid').isMongoId(),
    verifyQuizByUser,
    validateFields
]
,controller.getStatsByQuiz)

/*################### GET STATS BY USER ###################*/
router.get('/:id/:user', 
[
    check('id', 'Quiz Id not valid').isMongoId(),
    check('user', 'User required').not().isEmpty(),
    verifyParticipant,
    validateFields
]
, controller.getStatsByUser)

module.exports = router;