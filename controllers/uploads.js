const { request, response } = require("express");
const { validateFile } = require("../helpers");

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

module.exports = {
    uploadFile
}