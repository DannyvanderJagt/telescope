import Database from '../../database';
import Query from '../query';

export default (socket, signal) => {
  let {db, t: table, d:query} = signal;

  let q = Database.r
      .db(socket.db)
      .table(table)

  q = Query.parse(q, 'fetch', query);

  q.run(Database.connection, (err, cursor) => {
    if(err){
      socket.signalAndClose(signal, 'error', err.msg);
      return;
    }

    if(cursor && cursor.constructor.name === 'Cursor'){
      cursor.toArray(function(err, result) {
          if (err) throw err;
          result = JSON.stringify(result, null, 2);
          socket.signalAndClose(signal, 'success', result);
      });
    }else{
      socket.signalAndClose(signal, 'success', cursor);
    }
  })
}
