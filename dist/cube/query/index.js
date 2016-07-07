'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _database = require('../../database');

var _database2 = _interopRequireDefault(_database);

var _methods = require('./methods');

var _methods2 = _interopRequireDefault(_methods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Query
var Query = {
  initialize: function initialize() {
    this.methods = Object.keys(_methods2.default);
  },
  parse: function parse(q, event, query) {
    this.methods.forEach(function (item) {
      if (!query[item]) {
        return;
      }
      if (_methods2.default[item].events.indexOf(event) === -1) {
        return;
      }
      q = _methods2.default[item].fn(q, query);
    });
    return q;
  }
};

Query.initialize();

exports.default = Query;