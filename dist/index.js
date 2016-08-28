'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  Core
 */

var RethinkServer = require('rethinkdb-websocket-server');

var Server = {
  http: undefined,

  initialize: function initialize() {
    this.http = _http2.default.createServer();
    this.http.on('upgrade', this.handleUpgradeRequest.bind(this));

    // Start the rethink server.
    RethinkServer.listen({
      httpServer: this.http,
      unsafelyAllowAnyQuery: true,
      dbHost: _config2.default.rethinkDB.host || 'localhost',
      dbPort: _config2.default.rethinkDB.port || 28015,
      loggingMode: 'none'
    });

    // Listen.
    this.http.listen(8000);
  },
  handleUpgradeRequest: function handleUpgradeRequest(req, socket, head) {

    // Strip the key from the url.
    var key = req.url.split('/?');

    if (!key[1]) {
      this.closeSocket(socket);
      return;
    }
    key = key[1];

    // Validate the key.
    if (_config2.default.keys.indexOf(key) === -1) {
      this.closeSocket(socket);
      return;
    }

    // The socket is allowed...
  },
  closeSocket: function closeSocket(socket) {
    if (!socket) {
      return;
    }
    socket.end();
  }
};

Server.initialize();

exports.default = Server;