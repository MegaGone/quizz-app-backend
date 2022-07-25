const jwt = require('jsonwebtoken');

const generateJWT = ( uid = "" ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETKEY, {
            expiresIn: '4h'
        }, (err, token) => {

            if(err){
                console.log(err);
                reject('Error creating token')
            } else {
                resolve(token)
            }

        });
    })

};

const generateJWTGuest = ( uid = "", quizId = "" ) => {
    return new Promise((resolve, reject) => {

        const payload = { uid, quizId };

        jwt.sign(payload, process.env.SECRETKEY, {
            expiresIn: '8h'
        }, (err, token) => {
            if(err) {
                reject('Error creating token');
            } else {
                resolve(token)
            }
        });
    });
};

module.exports = {
    generateJWT,
    generateJWTGuest
}