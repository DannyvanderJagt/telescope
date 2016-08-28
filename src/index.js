/*
  Core
 */
import Http from 'http';
import Config from './config';
const RethinkServer = require('rethinkdb-websocket-server')

let Server = {
  http: undefined,

  initialize(){
    this.http = Http.createServer();
    this.http.on('upgrade', this.handleUpgradeRequest.bind(this));

    // Start the rethink server.
    RethinkServer.listen({
      httpServer: this.http,
      unsafelyAllowAnyQuery: true,
      dbHost: Config.rethinkDB.host || 'localhost',
      dbPort: Config.rethinkDB.port || 28015,
      loggingMode: 'none'
    });

    // Listen.
    this.http.listen(8000);
  },
  handleUpgradeRequest(req, socket, head){

    // Strip the key from the url.
    let key = req.url.split('/?');

    if(!key[1]){ 
      this.closeSocket(socket); 
      return; 
    }
    key = key[1];

    // Validate the key.
    if(Config.keys.indexOf(key) === -1){
      this.closeSocket(socket);
      return;
    }

    // The socket is allowed...
  },
  closeSocket(socket){
    if(!socket){ return; }
    socket.end();
  }
}

Server.initialize();

export default Server;