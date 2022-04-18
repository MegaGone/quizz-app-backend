const { request, response } = require("express");
const { validateFile } = require("../helpers");
const { User } = require('../models')

const uploadFile = async (req = request, res = response) => {
  
    //Validar que venga file
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
      return res.status(400).send('No files were uploaded.');
    }

    try {
        const pathFile = await validateFile(req.files, undefined, 'imgs');
        
        res.status(200).send(pathFile)
    } catch (error) {
        return res.status(400).send(error)
    }
}

const updateImage = async (req = request, res = response) => {

    const { id } = req.params;

    let model;

    model = await User.findById(id);

    if(!model) {
        return res.status(400).send('User not valid')
    }

    const pathFile = await validateFile(req.files, undefined, 'users');

    model.img = pathFile;

    await model.save();

    return res.status(200).json(model);

}

module.exports = {
    uploadFile,
    updateImage
}