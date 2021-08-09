require('colors');
const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      quiz: "/quiz",
    };

    this.middlewares();

    this.routes();
  }

  middlewares() {
    // Allow the HTTP protocol in FRONTEND
    this.app.use(cors());

    // PARSE DATA
    this.app.use(express.json());
  }

  routes(){
      this.app.use( this.paths.quiz, require('../routes/quiz'));
  }

  listen(){
    this.app.listen(this.port, () => {
        console.log(`Server run on http://localhost:${ this.port }`);
    })
  }
}

module.exports = Server;