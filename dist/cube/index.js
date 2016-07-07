'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _connections = require('../connections');

var _connections2 = _interopRequireDefault(_connections);

var _delete2 = require('./events/delete');

var _delete3 = _interopRequireDefault(_delete2);

var _update = require('./events/update');

var _update2 = _interopRequireDefault(_update);

var _createCollection = require('./events/createCollection');

var _createCollection2 = _interopRequireDefault(_createCollection);

var _dropCollection = require('./events/dropCollection');

var _dropCollection2 = _interopRequireDefault(_dropCollection);

var _fetch = require('./events/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _subscribe = require('./events/subscribe');

var _subscribe2 = _interopRequireDefault(_subscribe);

var _store = require('./events/store');

var _store2 = _interopRequireDefault(_store);

var _replace = require('./events/replace');

var _replace2 = _interopRequireDefault(_replace);

var _thesuitcaseUtil = require('thesuitcase-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Report = _thesuitcaseUtil.Reporter.namespace('Cube');

/*
  Reporter.
 */

// Events

var Cube = {
  events: {
    update: _update2.default,
    replace: _replace2.default,
    createCollection: _createCollection2.default,
    dropCollection: _dropCollection2.default,
    fetch: _fetch2.default,
    subscribe: _subscribe2.default,
    store: _store2.default,
    delete: _delete3.default
  },

  authorize: function authorize(socket, signal) {

    if (socket.db !== signal.db) {
      Report.error('Unauthorized request:', signal);
      return false;
    }

    // Read/write
    if (socket.type === 'service') {
      return true;
    }

    if (signal.e === 'fetch') {
      return true;
    }

    return false;
  },
  parse: function parse(socket, signal) {
    var valid = this.authorize(socket, signal);

    if (!valid) {
      _connections2.default.signalAndClose(socket, signal, 'error', 'Unauthorized request');
      return;
    }

    if (!this.events[signal.e]) {
      _connections2.default.signalAndClose(socket, signal, 'error', 'Event does not exists!');
      return;
    }

    this.events[signal.e](socket, signal);
  }
};

exports.default = Cube;