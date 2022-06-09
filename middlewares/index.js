const { validateFields                          } = require('./validate-fields');
const { haveRoles                               } = require('./validate-roles');
const { validateJWT, validateJwtToRenewToken, validateJWTGuest  } = require('./validate-jwt');
const { validateParticipant, verifyParticipant, validatePlayer    } = require('./validate-participant'); 
const { verifyQuizByUser, verifyQuizByCode      } = require('./verifyQuizByUser');
const { validateCurrentPassword                 } = require('./validate-password');
const { validateFiles                           } = require('./validate-files');
const { verifyEmail                             } = require('./verify-user');




module.exports = {
    validateFields,
    haveRoles,
    validateJWT,
    validateParticipant,
    validateJwtToRenewToken,
    verifyParticipant,
    verifyQuizByUser,
    verifyQuizByCode,
    validateCurrentPassword,
    validateFiles,
    verifyEmail,
    validatePlayer,
    validateJWTGuest
}