const { request, response } = require('express');

const validateFiles = async (req = request, res = response, next) => {
    //Validar que venga file
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).send('No files were uploaded.');
    }

    next();
}

module.exports = {
    validateFiles
}