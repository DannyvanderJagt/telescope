import Ws from 'ws';
import Http from 'http';
import Express from 'express';
import Config from './config'
import Path from 'path';

import {Reporter} from 'thesuitcase-util';
let Report = Reporter.namespace('Server');

let Server = {
  http: undefined,
  express: undefined,
  ws: undefined,

  initialize(){
    this.http = Http.createServer();
    this.ws = new Ws.Server({server: this.http})
    this.express = Express();

    this.http.on('request', this.express);
    this.http.listen(Config.port, this.serverIsRunning.bind(this));
  },

  serverIsRunning(){
    Report.log('Running at: ' + Config.port);

    this.serveFiles();
  },

  serveFiles(){
    this.express.use('/libs', Express.static(Path.join(__dirname, '../../../libs')));
  }
}


// Start Auto
Server.initialize();

export default Server;