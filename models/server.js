require('colors');
const express = require("express");
const cors = require("cors");

const { dbConnection } = require('../db/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth:   "/auth",
      quiz:   "/quiz",
      user:   "/users"
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
  }

  routes(){
      this.app.use( this.paths.auth,  require('../routes/auth'));
      this.app.use( this.paths.quiz,  require('../routes/quiz'));
      this.app.use( this.paths.user,  require('../routes/user'));
  }

  listen(){
    this.app.listen(this.port, () => {
        console.log(`Server run on http://localhost:${ this.port }`);
    })
  }
}

module.exports = Server;