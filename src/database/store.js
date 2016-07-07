import Database from './index';

class Store{
  constructor(db, table, object){
    this.object = object;
    this.db = db;
    this.table = table;

    if(Database.connection){
      this.run()
      return this;
    }

    Database.on('connect', this.run.bind(this));
  }
  run(){
    this.fetch();
    this.subscribe();
  }
  fetch(){
    Database.r
      .db(this.db)
      .table(this.table)
      .run(Database.connection, (err, cursor) => {
        if(err){ return; }

        cursor.toArray((err, items) => {
          items.forEach((item) => {
            this.set(item.key, item);
          })
        });
      })
  }
  subscribe(){
    Database.r
      .db(this.db)
      .table(this.table)
      .changes()
      .run(Database.connection, (err, cursor) => {
        if(err){ return; }

        cursor.each((err, item) => {
          if(!item.new_val){
            this.delete(item.old_val.key)
            return;
          }

          this.set(item.new_val.key, item.new_val)
        });
      })
  }
  delete(key){
    delete this.object[key];
  }
  set(key, data){
    this.object[key] = data;
  }
  store(key, data){
    data.key = key;
    this.set(key, data);
    Database.r
      .db(this.db)
      .table(this.table)
      .insert(data)
      .run(Database.connection, (err, cursor) => {
        console.log(err);
      })
  }
}

export default Store;