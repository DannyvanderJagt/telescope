import Connections from '../connections';

// Events
import _delete from './events/delete';
import update from './events/update';
import createCollection from './events/createCollection';
import dropCollection from './events/dropCollection';
import fetch from './events/fetch';
import subscribe from './events/subscribe';
import store from './events/store';
import replace from './events/replace';

/*
  Reporter.
 */
import {Reporter} from 'thesuitcase-util';
let Report = Reporter.namespace('Cube');


let Cube = {
  events: {
    update, 
    replace,
    createCollection,
    dropCollection,
    fetch,
    subscribe,
    store,
    delete: _delete,
  },

  authorize(socket, signal){

    if(socket.db !== signal.db){
      Report.error('Unauthorized request:', signal);
      return false;
    }

    // Read/write
    if(socket.type === 'service'){
      return true;
    }

    if(signal.e === 'fetch'){
      return true;
    }

    return false;
  },

  parse(socket, signal){
    let valid = this.authorize(socket, signal);

    if(!valid){
      Connections.signalAndClose(socket, signal, 'error', 'Unauthorized request');
      return;
    }

    if(!this.events[signal.e]){
      Connections.signalAndClose(socket, signal, 'error', 'Event does not exists!');
      return;
    }


    this.events[signal.e](socket, signal);
  }
};

export default Cube;