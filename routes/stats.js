const { Router } = require('express');
const { check } = require('express-validator');

const controller = require('../controllers/stats');

const { verifyQuizById } = require('../helpers');

const { validateFields, validatePlayer, validateJWT, verifyQuizByUser } = require('../middlewares');

const router = Router();

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

router.get('/:id', 
[
    validateJWT,
    // check('id').custom( verifyQuizByUser ),
    check('id', 'Id not valid').isMongoId(),
    validateFields
]
,controller.getStatsByQuiz)

module.exports = router;