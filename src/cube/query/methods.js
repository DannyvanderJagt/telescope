import Database from '../../database';

// All available events.
let all = ['fetch', 'update', 'replace', 'subscribe', 'delete'];

export default {
  id: {
    events: all,
    fn(q, query){
      return q.get(query.id)
    }
  },

  filter:{
    events: all,
    fn(q, query){
      return q.filter(query.filter)
    }
  },

  gt:{
    events: all,
    fn(q, query){
      let keys = Object.keys(query.gt);

      let filter;

      keys.forEach((key, pos) => {
        if(pos === 0){
          filter = Database.r.row(key).gt(query.gt[key])
        }else{
          filter = filter.and(Database.r.row(key).gt(query.gt[key]))
        }
      })

      return q.filter(filter);
    }
  },

  lt:{
    events: all,
    fn(q, query){
      let keys = Object.keys(query.lt);

      let filter;

      keys.forEach((key, pos) => {
        if(pos === 0){
          filter = Database.r.row(key).lt(query.lt[key])
        }else{
          filter = filter.and(Database.r.row(key).lt(query.lt[key]))
        }
      })

      return q.filter(filter);
    }
  },

  order:{
    events: ['fetch'],
    fn(q, query){
      let order = [];

      for(let key in query.order){
        let value = query.order[key];

        switch(value){
          case 'asc': order.push(Database.r.asc(key)); break;
          case 'desc': order.push(Database.r.desc(key)); break;
        }
      }

      return q.orderBy.apply(q, order)
    }
  },

  limit:{
    events: ['fetch'],
    fn(q, query){
      return q.limit(query.limit);
    }
  },

  skip:{
    events: ['skip'],
    fn(q, query){
      return q.skip(query.skip)
    }
  },

  nth:{
    events: ['nth'],
    fn(q, query){
      return q.nth(query.nth)
    }
  }
}