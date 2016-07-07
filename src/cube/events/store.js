import Database from '../../database';
import Query from '../query';

export default (socket, signal) => {
  let {db, t: table, d:data} = signal;

  Database.r
    .db(socket.db)
    .table(table)
    .insert(data)
    .run(Database.connection, (err, result) => {
      if(err){
        socket.signalAndClose(signal, 'error', err.msg);
        return;
      }
      socket.signalAndClose(signal, 'success', result);
    })
}
