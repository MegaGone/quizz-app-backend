const { validateFields } = require('./validate-fields');
const { haveRoles } = require('./validate-roles');
const { validateJWT, validateJwtToRenewToken } = require('./validate-jwt');
const { validatePartipant, verifyParticipant } = require('./validate-participant'); 
const { verifyQuizByUser, verifyQuizByCode } = require('./verifyQuizByUser');
const { validateCurrentPassword } = require('./validate-password');
const { validateFiles } = require('./validate-files');



module.exports = {
    validateFields,
    haveRoles,
    validateJWT,
    validatePartipant,
    validateJwtToRenewToken,
    verifyParticipant,
    verifyQuizByUser,
    verifyQuizByCode,
    validateCurrentPassword,
    validateFiles
}