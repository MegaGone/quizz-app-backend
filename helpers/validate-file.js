const path = require('path');
const { v4: uuidv4 } = require('uuid');

const validateFile = async ( files, extentions = ['png', 'jpg', 'jpeg', 'gif'], folder = '' ) => {

    return new Promise((resolve, reject) => {
        const { file } = files;

        // Validar extensiones
        const fileSplited = file.name.split('.');
        const ext = fileSplited[ fileSplited.length - 1 ];

        if (!extentions.includes(ext)) {
            return reject(`Extension not valid - ${extentions}`);
        }

        // Creamos el path
        const temporalName = uuidv4() + '.' + ext;
        const uploadPath = path.join(__dirname, '../uploads/', folder, temporalName);

        file.mv(uploadPath, (err) => {
            if (err) { 
                console.log(err);
                return reject(`Cannot move the file`)
             }

            resolve(temporalName);
        });
    })


}

module.exports = {
    validateFile
}