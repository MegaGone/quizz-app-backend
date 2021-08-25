const { generateJWT } = require('./jwt');
const { validateRole, validateEmail, verifyUserById, verifyQuizById } = require('./db-validators')
const { validateSpaces } = require('./validations');

module.exports = {
    generateJWT,
    validateRole,
    validateEmail,
    verifyUserById,
    validateSpaces,
    verifyQuizById
}