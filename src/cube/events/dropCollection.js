import Database from '../../database';
import Query from '../query';

export default (id, client, collection, query) => {
  Database.r
    .db(client.db)
    .tableDrop(data).run(Database.connection, (err) => {
    if(err){
      client.signalAndClose(id, 'error', err.msg);
    }else{
      client.signalAndClose(id, 'success', data)
    }
  })
}
