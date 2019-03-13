const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(process.env.DB_URI, {useNewUrlParser: true});
console.log(process.env.DB_URI);

let _db;
module.exports = {
  init: () => {
    return client.connect()
      .then(() => {
        // connect to the db with this name
        _db = client.db('aggregator');
        console.log("Connected to mongodb!");
        return _db;
      })
      .catch(err => {
        console.log("Failed to connect to mongodb");
        console.log(err);
      });
  },

  // Return a reference to the database
  getDb: () => _db
}
