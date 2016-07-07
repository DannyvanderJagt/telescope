import Database from '../../database';
import Methods from './methods';

// Query
let Query = {
  initialize(){
    this.methods = Object.keys(Methods);
  },
  parse(q, event, query){
     this.methods.forEach((item) => {
        if(!query[item]){ return; }
        if(Methods[item].events.indexOf(event) === -1){ return; }
        q = Methods[item].fn(q, query);
      })
      return q;
  }
}

Query.initialize();

export default Query;
