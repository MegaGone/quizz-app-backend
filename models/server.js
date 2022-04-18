require('colors');
const express = require("express");
const cors = require("cors");
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../db/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth    :   "/auth",
      quiz    :   "/quiz",
      user    :   "/users",
      uploads :   "/uploads"
    };

    this.connectDB();

    this.middlewares();

    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // Allow the HTTP protocol in FRONTEND
    this.app.use(cors());

    // PARSE DATA
    this.app.use(express.json());

    this.app.use(express.static("public"));

    // Fileupload
    this.app.use( fileUpload ({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
    }));
  }

  routes(){
      this.app.use( this.paths.auth,    require('../routes/auth'));
      this.app.use( this.paths.quiz,    require('../routes/quiz'));
      this.app.use( this.paths.user,    require('../routes/user'));
      this.app.use( this.paths.uploads, require('../routes/uploads'))
  }

  listen(){
    this.app.listen(this.port, () => {
        console.log(`Server run on http://localhost:${ this.port }`);
    })
  }
}

module.exports = Server;