const { User } = require('../models');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const uploadFile = (file, extentions = ['png', 'jpg', 'jpeg', 'gif'], id) => {
    return new Promise(async (resolve, reject) => {

        const userDB = await User.findById(id);

        if (!userDB) {
            reject('Error user not found');
        }

        // Validar imagen
        const { name } = file;
        const splited  = name.split('.');
        const ext      = splited[splited.length - 1]; 

        if (!extentions.includes(ext)) {
            reject('File not supported')
        }

        // Destroy last image
        if (userDB.img) {
            const imageSplited  = userDB.img.split('/');
            const img           = imageSplited[imageSplited.length - 1];
            const [ public_id ] = img.split('.');

            cloudinary.uploader.destroy(`${process.env.CLOUDINARY_FOLDER}/${public_id}`);
        }

        const { tempFilePath } = file;

        try {
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: process.env.CLOUDINARY_FOLDER });
            resolve(secure_url);
        } catch (error) {
            console.log(error);
            reject('Error to upload file');
        }

    });
}

module.exports = {
    uploadFile
}