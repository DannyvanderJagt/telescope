'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _database = require('../../database');

var _database2 = _interopRequireDefault(_database);

var _query = require('../query');

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (socket, signal) {
  var db = signal.db;
  var table = signal.t;
  var data = signal.d;

  _database2.default.r.db(socket.db).table(table).insert(data).run(_database2.default.connection, function (err, result) {
    if (err) {
      socket.signalAndClose(signal, 'error', err.msg);
      return;
    }
    socket.signalAndClose(signal, 'success', result);
  });
};