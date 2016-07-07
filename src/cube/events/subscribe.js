import Database from '../../database';
import Query from '../query';

export default (socket, signal) => {
  let {db, t: table, d:query} = signal;

  let q = Database.r
    .db(socket.db)
    .table(table)

    q = Query.parse(q, 'subscribe', query);

    q.changes()
    .run(Database.connection, (err, cursor) => {
      if (err) {
        socket.signal(signal, 'error', err.msg);
        return;
      }
          
      cursor.each(function(err, row) {
          if (err) {
            socket.signal(signal, 'error', err.msg);
            return;
          }
          row = JSON.stringify(row, null, 2);

          socket.signal(signal, 'success', row);
      });
    })
}
