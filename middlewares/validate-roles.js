const { request, response } = require("express");

const haveRoles = async (...roles) => {

    return ( req = request, res = response, next ) => {

        if ( !req.user) {
            res.status(500).send('We cant verify the role without validate the token first')
        }

        if ( !roles.includes(req.user.role) ) {
            return res.status(401).send(`Service need permissions of this roles ${ roles }`)
          }
      
        next();
    }
}

module.exports = {
    haveRoles
}