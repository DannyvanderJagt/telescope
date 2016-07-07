import Database from '../../database';

let Rows = {
  parse(rows){

    let data = {};

    Object.keys(rows).forEach((row) => {
      row = rows[row];
      let item = Database.r.row(row.name);

      row.query.forEach((action) => {
        
        switch(action[0]){
          case 'add': 
            item = item.add(action[1]);
            break;
          case 'default': 
            item = item.default(action[1]);
            break;
          case 'devide': 
            item = item.devide(action[1]);
            break;
          case 'subtract': 
            item = item.subtract(action[1]);
            break;
          case 'multiply': 
            item = item.multiply(action[1]);
            break;
          case 'set': 
            item = action[1];
            break;
        }
      })

      data[row.name] = item;
    })

    return data;
  }
}

export default Rows;