const { generateJWT } = require('./jwt');
const { validateRole, validateEmail, verifyUserById, verifyQuizById, verifyCodeToQuiz } = require('./db-validators')
const { validateSpaces } = require('./validations');
const { googleVerify } = require('./google-verify');

module.exports = {
    generateJWT,
    validateRole,
    validateEmail,
    verifyUserById,
    validateSpaces,
    verifyQuizById,
    verifyCodeToQuiz,
    googleVerify
}