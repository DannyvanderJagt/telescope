'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rethinkdb = require('rethinkdb');

var _rethinkdb2 = _interopRequireDefault(_rethinkdb);

var _thesuitcaseUtil = require('thesuitcase-util');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  Dependencies.
 */

var Report = _thesuitcaseUtil.Reporter.namespace('Database');

var ee = new _events2.default();

/*
  Database
  [x] Handle the conenction with the RethinkDB database.
  [x] Starts automatically.
 */
var Database = {
  on: ee.on.bind(ee),
  emit: ee.emit.bind(ee),

  Store: _store2.default,
  connection: undefined,
  r: _rethinkdb2.default,

  reconnectTimeout: undefined,

  start: function start() {
    this.connect();
  },
  connect: function connect() {
    if (this.connection) {
      this.report.error('Already connected!');
      return;
    }

    _rethinkdb2.default.connect({
      host: 'localhost',
      port: 28015
    }, this.handleConnectCallback.bind(this));
  },
  reconnect: function reconnect() {
    this.reconnectTimeout = setTimeout(this.connect.bind(this), 1000);
  },
  databaseDidConnect: function databaseDidConnect() {
    this.emit('connect');
    Report.success('Connected.');
  },
  databaseDidDisconnect: function databaseDidDisconnect() {
    this.connection = undefined;
    this.emit('disconnect');
    Report.error('Disconnected.');
  },
  databaseDidError: function databaseDidError(error) {
    this.emit('error');
    Report.error('Error: ' + error.msg);
    this.reconnect();
  },
  handleConnectCallback: function handleConnectCallback(err, con) {
    if (err) {
      this.databaseDidError(err);
      return;
    }

    this.connection = con;
    this.connection.on('close', this.databaseDidDisconnect.bind(this));

    this.databaseDidConnect();
  }
};

Database.start();

exports.default = Database;