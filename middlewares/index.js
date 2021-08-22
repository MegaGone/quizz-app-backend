const { validateFields } = require('./validate-fields');
const { haveRoles } = require('./validate-roles');
const { validateJWT } = require('./validate-jwt');

module.exports = {
    validateFields,
    haveRoles,
    validateJWT
}