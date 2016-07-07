/*
  Dependencies.
 */
import RethinkDB from 'rethinkdb';

import {Reporter} from 'thesuitcase-util';
let Report = Reporter.namespace('Database');

import EventEmitter from 'events';
let ee = new EventEmitter();

import Store from './store';
/*
  Database
  [x] Handle the conenction with the RethinkDB database.
  [x] Starts automatically.
 */
let Database = {
  on: ee.on.bind(ee),
  emit: ee.emit.bind(ee),

  Store: Store,
  connection: undefined,
  r: RethinkDB,

  reconnectTimeout: undefined,

  start(){
    this.connect()
  },

  connect(){
    if(this.connection){ 
      this.report.error('Already connected!');
      return;
    }

    RethinkDB.connect({
      host: 'localhost',
      port: 28015,
    }, this.handleConnectCallback.bind(this))
  },

  reconnect(){
    this.reconnectTimeout = setTimeout(
      this.connect.bind(this),
      1000
    )
  },

  databaseDidConnect(){
   this.emit('connect')
   Report.success('Connected.')
  },

  databaseDidDisconnect(){
    this.connection = undefined;
    this.emit('disconnect');
    Report.error('Disconnected.')
  },

  databaseDidError(error){
    this.emit('error')
    Report.error('Error: ' + error.msg)
    this.reconnect();
  },

  handleConnectCallback(err, con){
      if(err){
        this.databaseDidError(err);
        return;
      }

      this.connection = con;
      this.connection.on('close', this.databaseDidDisconnect.bind(this));

      this.databaseDidConnect();
  }
}

Database.start();

export default Database;