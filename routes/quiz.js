const { Router } = require('express');
const { check } = require('express-validator');

const controller = require('../controllers/quiz');

const router = Router();

router.get('/', controller.getQuizs);

router.post('/', controller.createQuiz);

router.get('/:id', controller.getQuiz);

router.put('/:id', controller.updateQuiz);

router.delete('/:id', controller.deleteQuiz);

module.exports = router;