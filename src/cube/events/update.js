import Database from '../../database';
import Query from '../query';
import Rows from '../rows';

export default (socket, signal) => {
  let {db, t: table, d:query} = signal;

  let q = Database.r
    .db(socket.db)
    .table(table)

  // Add query methods.
  q = Query.parse(q, 'update', query);

  // Options
  let opts = {};
  if(query.returnChanges && query.returnChanges === true){
    opts.returnChanges = true;
  }

  // Execute
  q = q.update(Rows.parse(query.rows), opts);

  q.run(Database.connection, (err, cursor) => {
      if(err){
        socket.signalAndClose(signal, 'error', err.msg);
        return;
      }

      if(cursor && cursor.constructor.name === 'Cursor'){
        cursor.toArray(function(err, result) {
            if (err) {
              socket.signal(signal, 'error', err.msg);
              return;
            }
            result = JSON.stringify(result, null, 2);
            socket.signalAndClose(signal, 'success', result);
        });
      }else{
        socket.signalAndClose(signal, 'success', cursor);
      }
    });
}
