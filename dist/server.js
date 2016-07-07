'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _thesuitcaseUtil = require('thesuitcase-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Report = _thesuitcaseUtil.Reporter.namespace('Server');

var Server = {
  http: undefined,
  express: undefined,
  ws: undefined,

  initialize: function initialize() {
    this.http = _http2.default.createServer();
    this.ws = new _ws2.default.Server({ server: this.http });
    this.express = (0, _express2.default)();

    this.http.on('request', this.express);
    this.http.listen(_config2.default.port, this.serverIsRunning.bind(this));
  },
  serverIsRunning: function serverIsRunning() {
    Report.log('Running at: ' + _config2.default.port);

    this.serveFiles();
  },
  serveFiles: function serveFiles() {
    this.express.use('/libs', _express2.default.static(_path2.default.join(__dirname, '../../../libs')));
  }
};

// Start Auto
Server.initialize();

exports.default = Server;