'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

var _cube = require('./cube');

var _cube2 = _interopRequireDefault(_cube);

var _thesuitcaseUtil = require('thesuitcase-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  Depedencies.
 */

var Report = _thesuitcaseUtil.Reporter.namespace('Connections');

/*
  Connections
  [x] Handle and authorize all the socket connections.
 */

/*
  Reporter.
 */
var Connections = {
  keys: {},
  active: {},

  initialize: function initialize() {
    new _database2.default.Store('telescope', 'connection_keys', this.keys);
    this.listen();
  },
  listen: function listen() {
    _server2.default.ws.on('connection', this.authorizeIncommingConnection.bind(this));
  },
  getKeyFromUpgradeRequest: function getKeyFromUpgradeRequest(socket) {
    var req = socket.upgradeReq;
    var key = undefined;

    if (!req.url) {
      return key;
    }

    var parts = req.url.split('/');

    if (parts.length !== 2) {
      return key;
    }

    if (parts[1] && parts[1].length === 6) {
      key = parts[1];
    }

    return key;
  },
  authorizeIncommingConnection: function authorizeIncommingConnection(socket) {
    var key = this.getKeyFromUpgradeRequest(socket);

    if (!(key && this.keys[key])) {
      this.rejectConnection(socket, 'auth_error', 'Your key is invalid!');
      return;
    }

    var settings = this.keys[key];

    // Service: Only 1 connection allowed with the same key.
    if (settings.type === 'service' && settings.connected === true) {
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
  socketDidConnect: function socketDidConnect(socket) {
    this.keys[socket.key].connected = true;

    Report.success('+ ' + socket.key);

    socket.signal = this.signal.bind(this, socket);
    socket.signalAndClose = this.signalAndClose.bind(this, socket);

    socket.on('close', this.socketDidDisconnect.bind(this, socket));
    socket.on('message', this.socketDidSignal.bind(this, socket));
  },
  socketDidDisconnect: function socketDidDisconnect(socket) {
    this.keys[socket.key].connected = false;

    Report.error('- ' + socket.key);
  },
  socketDidSignal: function socketDidSignal(socket, signal) {
    try {
      signal = JSON.parse(signal);
    } catch (error) {
      Report.error('Signal is malformed: ' + signal);
      return;
    }

    _cube2.default.parse(socket, signal);
  },

  /*
    Communicate back to the client.
   */
  signal: function signal(socket, _signal, event) {
    var data = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
    var close = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

    socket.send(JSON.stringify({
      id: _signal ? _signal.id : undefined,
      e: event,
      d: data,
      c: close
    }));
  },
  signalAndClose: function signalAndClose() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    args.push(true);
    this.signal.apply(this, args);
  },
  rejectConnection: function rejectConnection(socket, event, msg) {
    Report.error('Reject: ' + event + ' - ' + msg);
    this.signalAndClose(socket, null, event || 'connection_error', msg);
    socket.close();
    return;
  }
};

Connections.initialize();

exports.default = Connections;