import Database from '../../database';
import Query from '../query';

export default (socket, signal) => {
  let {db, t: table, d:query} = signal;
  
  let q = Database.r
    .db(socket.db)
    .table(table)

  // Add query methods.
  q = Query.parse(q, 'delete', query);

  // Execute
  let opts = {};

  if(query.returnChanges && query.returnChanges === true){
    opts.returnChanges = true;
  }

  q.delete(opts)
    .run(Database.connection, (err, cursor) => {
      if(err){
        socket.signalAndClose(signal, 'error', err.msg);
        return;
      }
      socket.signalAndClose(signal, 'success', cursor);
    });
}
