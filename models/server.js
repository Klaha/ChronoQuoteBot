const express = require('express');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use('/tweet', require('../routes/tweets'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Ejecutando en ->', this.port);
    });
  }
}

module.exports = Server;
