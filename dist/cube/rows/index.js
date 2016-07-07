'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _database = require('../../database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Rows = {
  parse: function parse(rows) {

    var data = {};

    Object.keys(rows).forEach(function (row) {
      row = rows[row];
      var item = _database2.default.r.row(row.name);

      row.query.forEach(function (action) {

        switch (action[0]) {
          case 'add':
            item = item.add(action[1]);
            break;
          case 'default':
            item = item.default(action[1]);
            break;
          case 'devide':
            item = item.devide(action[1]);
            break;
          case 'subtract':
            item = item.subtract(action[1]);
            break;
          case 'multiply':
            item = item.multiply(action[1]);
            break;
          case 'set':
            item = action[1];
            break;
        }
      });

      data[row.name] = item;
    });

    return data;
  }
};

exports.default = Rows;