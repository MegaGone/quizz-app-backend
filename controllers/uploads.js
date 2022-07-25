const { request, response } = require("express");
const { validateFile, getImage } = require("../helpers");
const { User } = require('../models')
const fs = require('fs');
const path = require("path");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const uploadFile = async (req = request, res = response) => {

    try {
        const pathFile = await validateFile(req.files, undefined, undefined);

        res.status(200).send(pathFile)
    } catch (error) {
        return res.status(400).send(error)
    }
}

const updateImage = async (req = request, res = response) => {

    const { id } = req.params;

    let model;

    model = await User.findById(id);

    if (!model) {
        return res.status(400).send('User not valid')
    }


    if (model.img) {

        const pathImg = path.join(__dirname, '../uploads', model.img);

        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg);
        }

    }

    const pathFile = await validateFile(req.files, undefined, undefined);
    model.img = pathFile;
    await model.save();

    return res.status(200).json(model);

}

const updateImageCloudinary = async (req = request, res = response) => {

    const { id } = req.params;

    let model;

    model = await User.findById(id);

    if (!model) {
        return res.status(400).send('User not valid')
    }


    if (model.img) {

        const imgSplited    = model.img.split('/');
        const img           = imgSplited[imgSplited.length - 1];
        const [public_id]   = img.split('.');
        // cloudinary.uploader.destroy( public_id, { });
        cloudinary.uploader.destroy( `${process.env.CLOUDINARY_FOLDER}/${public_id}` );
    }

    // Obtengo el path temporal
    const { tempFilePath } = req.files.file;

    try {
        // Le paso el path temporal a cloudinary y de la respuesta solo necesito la secure_url
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: process.env.CLOUDINARY_FOLDER });
        model.img = secure_url;
        await model.save();

    } catch (error) {
        console.log(error);
        return res.status(500).send('Error to upload file.')
    }


    return res.status(200).json(model);

}

const showImage = async (req = request, res = response) => {

    const { id } = req.params;

    let model = await User.findById(id);

    if (!model) {
        return res.status(400).send('User not valid')
    }

    if (model.img) {
        const pathImg = path.join(__dirname, '../uploads', model.img);
        if (fs.existsSync(pathImg)) {
            return res.status(200).sendFile(pathImg);
        }
    }

    // Default image
    const noImagePath = "https://res.cloudinary.com/dntsavc6r/image/upload/v1650422395/ngQuiz/noprofile_oqt2bu.jpg";

    return res.status(200).sendFile(noImagePath);
}

const showImageCloudinary = async (req = request, res = response) => {

    const { id } = req.params;

    let model = await User.findById(id);

    if (!model) {
        return res.status(400).send('User not valid')
    }

    if (model.img) {
        return res.status(200).send(model.img)
    }

    // Default image
    const noImagePath = "https://res.cloudinary.com/dntsavc6r/image/upload/v1650422395/ngQuiz/noprofile_oqt2bu.jpg";

    return res.status(200).sendFile(noImagePath);
}

module.exports = {
    uploadFile,
    updateImage,
    showImage,
    updateImageCloudinary,
    showImageCloudinary
}