'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _database = require('../../database');

var _database2 = _interopRequireDefault(_database);

var _query = require('../query');

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (id, client, collection, query) {
  _database2.default.r.db(socket.db).tableCreate(data).run(_database2.default.connection, function (err) {
    if (err) {
      client.signalAndClose(id, 'error', err.msg);
    } else {
      client.signalAndClose(id, 'success', data);
    }
  });
};