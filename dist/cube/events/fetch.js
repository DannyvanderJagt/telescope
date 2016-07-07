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
  var query = signal.d;

  var q = _database2.default.r.db(socket.db).table(table);

  q = _query2.default.parse(q, 'fetch', query);

  q.run(_database2.default.connection, function (err, cursor) {
    if (err) {
      socket.signalAndClose(signal, 'error', err.msg);
      return;
    }

    if (cursor && cursor.constructor.name === 'Cursor') {
      cursor.toArray(function (err, result) {
        if (err) throw err;
        result = JSON.stringify(result, null, 2);
        socket.signalAndClose(signal, 'success', result);
      });
    } else {
      socket.signalAndClose(signal, 'success', cursor);
    }
  });
};