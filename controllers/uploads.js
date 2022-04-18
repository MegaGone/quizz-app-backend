const { request, response } = require("express");
const path = require('path');

const uploadFile = async (req = request, res = response) => {
  
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
      return res.status(400).send('No files were uploaded.');
    }
  
    const { file } = req.files;
  
    const uploadPath = path.join(__dirname, '../uploads/', file.name);
  
    file.mv(uploadPath, (err) => {
        if (err) { return res.status(500).send(err); }
  
      res.send('File uploaded to ' + uploadPath);
    });
}

module.exports = {
    uploadFile
}