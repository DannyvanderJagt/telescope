/*
  Depedencies.
 */
import Server from './server';
import Database from './database';
import Cube from './cube';

/*
  Reporter.
 */
import {Reporter} from 'thesuitcase-util';
let Report = Reporter.namespace('Connections');

/*
  Connections
  [x] Handle and authorize all the socket connections.
 */
let Connections = {
  keys: {},
  active: {},

  initialize(){
    new Database.Store('telescope', 'connection_keys', this.keys);
    this.listen();
  },

  listen(){
    Server.ws.on('connection', this.authorizeIncommingConnection.bind(this));
  },

  getKeyFromUpgradeRequest(socket){
    let req = socket.upgradeReq;
    let key;

    if(!req.url){ return key; }

    let parts = req.url.split('/');

    if(parts.length !== 2){ return key; }

    if(parts[1] && parts[1].length === 6){
      key = parts[1];
    }
    
    return key;
  },

  authorizeIncommingConnection(socket){
    let key = this.getKeyFromUpgradeRequest(socket);

    if(!(key && this.keys[key])){
      this.rejectConnection(socket, 'auth_error', 'Your key is invalid!');
      return;
    }

    let settings = this.keys[key];

    // Service: Only 1 connection allowed with the same key.
    if(settings.type === 'service' && settings.connected === true){
      this.rejectConnection(socket, 'auth_error', 'A connection with this key is already established!');
      return;
    }

    // Set permissions.
    socket.type = settings.type || 'client';
    socket.db = settings.db;
    socket.key = settings.key;

    this.socketDidConnect(socket);
    return;
  },

  /*
    Handle connected and disconnected connections.
   */
  socketDidConnect(socket){
    this.keys[socket.key].connected = true;

    Report.success('+ ' + socket.key)

    socket.signal = this.signal.bind(this, socket);
    socket.signalAndClose = this.signalAndClose.bind(this, socket);

    socket.on('close', this.socketDidDisconnect.bind(this, socket));
    socket.on('message', this.socketDidSignal.bind(this, socket));
  },

  socketDidDisconnect(socket){
    this.keys[socket.key].connected = false;

    Report.error('- ' + socket.key)
  },

  socketDidSignal(socket, signal){
    try{
      signal = JSON.parse(signal);
    }catch(error){
      Report.error(`Signal is malformed: ${signal}`);
      return;
    }

    Cube.parse(socket, signal);
  },


  /*
    Communicate back to the client.
   */
  signal(socket, signal, event, data = {}, close = false){
    socket.send(JSON.stringify({
      id: signal ? signal.id : undefined,
      e: event,
      d: data,
      c: close
    }))
  },

  signalAndClose(...args){
    args.push(true);
    this.signal.apply(this, args);
  },

  rejectConnection(socket, event, msg){
    Report.error(`Reject: ${event} - ${msg}`);
    this.signalAndClose(socket, null, event || 'connection_error', msg);
    socket.close()
    return;
  }




}

Connections.initialize();

export default Connections;