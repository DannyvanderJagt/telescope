'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = (function () {
  function Store(db, table, object) {
    _classCallCheck(this, Store);

    this.object = object;
    this.db = db;
    this.table = table;

    if (_index2.default.connection) {
      this.run();
      return this;
    }

    _index2.default.on('connect', this.run.bind(this));
  }

  _createClass(Store, [{
    key: 'run',
    value: function run() {
      this.fetch();
      this.subscribe();
    }
  }, {
    key: 'fetch',
    value: function fetch() {
      var _this = this;

      _index2.default.r.db(this.db).table(this.table).run(_index2.default.connection, function (err, cursor) {
        if (err) {
          return;
        }

        cursor.toArray(function (err, items) {
          items.forEach(function (item) {
            _this.set(item.key, item);
          });
        });
      });
    }
  }, {
    key: 'subscribe',
    value: function subscribe() {
      var _this2 = this;

      _index2.default.r.db(this.db).table(this.table).changes().run(_index2.default.connection, function (err, cursor) {
        if (err) {
          return;
        }

        cursor.each(function (err, item) {
          if (!item.new_val) {
            _this2.delete(item.old_val.key);
            return;
          }

          _this2.set(item.new_val.key, item.new_val);
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete(key) {
      delete this.object[key];
    }
  }, {
    key: 'set',
    value: function set(key, data) {
      this.object[key] = data;
    }
  }, {
    key: 'store',
    value: function store(key, data) {
      data.key = key;
      this.set(key, data);
      _index2.default.r.db(this.db).table(this.table).insert(data).run(_index2.default.connection, function (err, cursor) {
        console.log(err);
      });
    }
  }]);

  return Store;
})();

exports.default = Store;