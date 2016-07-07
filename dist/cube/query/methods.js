'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _database = require('../../database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// All available events.
var all = ['fetch', 'update', 'replace', 'subscribe', 'delete'];

exports.default = {
  id: {
    events: all,
    fn: function fn(q, query) {
      return q.get(query.id);
    }
  },

  filter: {
    events: all,
    fn: function fn(q, query) {
      return q.filter(query.filter);
    }
  },

  gt: {
    events: all,
    fn: function fn(q, query) {
      var keys = Object.keys(query.gt);

      var filter = undefined;

      keys.forEach(function (key, pos) {
        if (pos === 0) {
          filter = _database2.default.r.row(key).gt(query.gt[key]);
        } else {
          filter = filter.and(_database2.default.r.row(key).gt(query.gt[key]));
        }
      });

      return q.filter(filter);
    }
  },

  lt: {
    events: all,
    fn: function fn(q, query) {
      var keys = Object.keys(query.lt);

      var filter = undefined;

      keys.forEach(function (key, pos) {
        if (pos === 0) {
          filter = _database2.default.r.row(key).lt(query.lt[key]);
        } else {
          filter = filter.and(_database2.default.r.row(key).lt(query.lt[key]));
        }
      });

      return q.filter(filter);
    }
  },

  order: {
    events: ['fetch'],
    fn: function fn(q, query) {
      var order = [];

      for (var key in query.order) {
        var value = query.order[key];

        switch (value) {
          case 'asc':
            order.push(_database2.default.r.asc(key));break;
          case 'desc':
            order.push(_database2.default.r.desc(key));break;
        }
      }

      return q.orderBy.apply(q, order);
    }
  },

  limit: {
    events: ['fetch'],
    fn: function fn(q, query) {
      return q.limit(query.limit);
    }
  },

  skip: {
    events: ['skip'],
    fn: function fn(q, query) {
      return q.skip(query.skip);
    }
  },

  nth: {
    events: ['nth'],
    fn: function fn(q, query) {
      return q.nth(query.nth);
    }
  }
};